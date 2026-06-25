'use client';

import { useMemo, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { formatNumber, formatDate } from '@/lib/format';
import type { Expense, Sheet } from '@/lib/types';
import { Clock, Search, X } from './icons';

type Row = { catId: string; catName: string; expense: Expense };

export function HistorySheet({
  open,
  onClose,
  sheet,
  onEditExpense,
}: {
  open: boolean;
  onClose: () => void;
  sheet: Sheet;
  onEditExpense: (catId: string, expense: Expense) => void;
}) {
  const [q, setQ] = useState('');

  const rows = useMemo<Row[]>(() => {
    const all: Row[] = [];
    for (const c of sheet.categories) {
      for (const e of c.expenses) {
        all.push({ catId: c.id, catName: c.name, expense: e });
      }
    }
    all.sort((a, b) => b.expense.createdAt - a.expense.createdAt);
    return all;
  }, [sheet]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (r) =>
        r.expense.label.toLowerCase().includes(needle) ||
        r.catName.toLowerCase().includes(needle)
    );
  }, [rows, q]);

  const total = filtered.reduce((s, r) => s + r.expense.amount, 0);

  return (
    <BottomSheet open={open} onClose={onClose} title="Riwayat Pengeluaran">
      <div className="pb-2">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-card-2 px-3.5">
          <Search width={16} height={16} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari keterangan / pos…"
            className="w-full bg-transparent py-3 text-sm text-white outline-none"
          />
          {q && (
            <button onClick={() => setQ('')} aria-label="Bersihkan">
              <X width={16} height={16} className="text-muted" />
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-accent/10 px-3.5 py-2.5">
          <span className="text-xs text-accent-soft">
            {filtered.length} pengeluaran
          </span>
          <span className="tnum text-sm font-bold text-accent-soft">
            Rp {formatNumber(total)}
          </span>
        </div>

        <div className="mt-2 max-h-[52vh] space-y-1 overflow-y-auto no-scrollbar">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center text-muted">
              <Clock width={28} height={28} />
              <p className="mt-3 text-sm">
                {rows.length === 0
                  ? 'Belum ada pengeluaran tercatat.'
                  : 'Tidak ada yang cocok.'}
              </p>
            </div>
          ) : (
            filtered.map((r) => (
              <button
                key={r.expense.id}
                onClick={() => {
                  onClose();
                  onEditExpense(r.catId, r.expense);
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-line bg-card-2 p-3 text-left active:scale-[0.99]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {r.expense.label}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted">
                    {r.catName} · {formatDate(r.expense.createdAt)}
                  </p>
                </div>
                <span className="tnum shrink-0 text-sm font-semibold text-red-400">
                  −{formatNumber(r.expense.amount)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
