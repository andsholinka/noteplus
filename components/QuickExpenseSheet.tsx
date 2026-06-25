'use client';

import { useEffect, useMemo, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { MoneyInput } from './MoneyInput';
import { useStore } from '@/lib/store';
import { formatNumber, toDateInput, fromDateInput } from '@/lib/format';
import { remaining, type Sheet } from '@/lib/types';
import { Check, ChevronDown, Search, Wallet } from './icons';

export function QuickExpenseSheet({
  open,
  onClose,
  sheet,
}: {
  open: boolean;
  onClose: () => void;
  sheet: Sheet;
}) {
  const { addExpense } = useStore();
  const [catId, setCatId] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(() => toDateInput(Date.now()));
  const [picking, setPicking] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (open) {
      setCatId(sheet.categories.length === 1 ? sheet.categories[0].id : null);
      setLabel('');
      setAmount(0);
      setDate(toDateInput(Date.now()));
      setPicking(false);
      setSearch('');
    }
  }, [open, sheet.categories]);

  const selected = sheet.categories.find((c) => c.id === catId) ?? null;

  const filtered = useMemo(() => {
    const n = search.trim().toLowerCase();
    if (!n) return sheet.categories;
    return sheet.categories.filter((c) => c.name.toLowerCase().includes(n));
  }, [sheet.categories, search]);

  const valid = catId && amount > 0;

  const submit = () => {
    if (!valid || !catId) return;
    addExpense(catId, {
      label: label.trim(),
      amount,
      createdAt: fromDateInput(date),
    });
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Catat Pengeluaran">
      <div className="space-y-4 pb-2">
        {/* Pilih pos (dropdown bisa dicari) */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Untuk pos mana?
          </label>
          {sheet.categories.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-line bg-card-2 px-3.5 py-3 text-sm text-muted">
              <Wallet width={16} height={16} /> Belum ada pos. Tambah pos dulu.
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  setPicking((p) => !p);
                  setSearch('');
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl border bg-card-2 p-3 text-left transition ${
                  picking ? 'border-accent/60' : 'border-line'
                }`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Wallet width={16} height={16} />
                </span>
                <span className="min-w-0 flex-1">
                  {selected ? (
                    <>
                      <span className="block truncate text-sm font-medium text-white">
                        {selected.name}
                      </span>
                      <span className="tnum block text-[11px] text-muted">
                        sisa Rp {formatNumber(remaining(selected))}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted">Pilih pos…</span>
                  )}
                </span>
                <ChevronDown
                  width={18}
                  height={18}
                  className={`shrink-0 text-muted transition-transform ${
                    picking ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {picking && (
                <div className="absolute z-20 mt-1.5 w-full animate-pop overflow-hidden rounded-xl border border-line bg-card shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-line px-3">
                    <Search width={15} height={15} className="text-muted" />
                    <input
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari pos…"
                      className="w-full bg-transparent py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                  <div className="max-h-[30vh] overflow-y-auto no-scrollbar">
                    {filtered.length === 0 ? (
                      <p className="px-3 py-4 text-center text-xs text-muted">
                        Tidak ada pos cocok.
                      </p>
                    ) : (
                      filtered.map((c) => {
                        const active = c.id === catId;
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              setCatId(c.id);
                              setPicking(false);
                            }}
                            className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left active:bg-white/5 ${
                              active ? 'bg-accent/10' : ''
                            }`}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-white">
                                {c.name}
                              </span>
                              <span className="tnum block text-[11px] text-muted">
                                sisa Rp {formatNumber(remaining(c))}
                              </span>
                            </span>
                            {active && (
                              <Check
                                width={16}
                                height={16}
                                strokeWidth={3}
                                className="shrink-0 text-accent"
                              />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Keterangan */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Keterangan
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="mis. malam mingguan, dimsum…"
            className="w-full rounded-xl border border-line bg-card-2 px-3.5 py-3 text-base text-white outline-none focus:border-accent/60"
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>

        {/* Nominal + tanggal */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-muted">
              Nominal
            </label>
            <MoneyInput value={amount} onChange={setAmount} />
          </div>
          <div className="w-[40%]">
            <label className="mb-1.5 block text-xs font-medium text-muted">
              Tanggal
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="tnum w-full rounded-xl border border-line bg-card-2 px-3 py-3 text-sm text-white outline-none focus:border-accent/60 [color-scheme:dark]"
            />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!valid}
          className="w-full rounded-xl bg-accent py-3.5 text-[15px] font-semibold text-black transition active:scale-[0.98] disabled:opacity-40"
        >
          Simpan Pengeluaran
        </button>
      </div>
    </BottomSheet>
  );
}
