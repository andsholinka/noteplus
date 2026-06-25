'use client';

import { useState } from 'react';
import { formatNumber, formatDate } from '@/lib/format';
import { remaining, spent, type Category } from '@/lib/types';
import { useStore } from '@/lib/store';
import { MoneyInput } from './MoneyInput';
import { Check, ChevronDown, Plus, Trash, Pencil } from './icons';

export function CategoryCard({
  cat,
  onEdit,
}: {
  cat: Category;
  onEdit: () => void;
}) {
  const { toggleDone, addExpense, deleteExpense, deleteCategory } = useStore();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);

  const used = spent(cat);
  const left = remaining(cat);
  const hasExpenses = cat.expenses.length > 0;
  const over = left < 0;
  const pct =
    cat.allocated > 0 ? Math.min(100, (used / cat.allocated) * 100) : 0;

  const submit = () => {
    if (amount <= 0) return;
    addExpense(cat.id, { label: label.trim(), amount });
    setLabel('');
    setAmount(0);
    setAdding(false);
    setOpen(true);
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-card transition-colors ${
        cat.done ? 'border-accent/30' : 'border-line'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3.5">
        <button
          onClick={() => toggleDone(cat.id)}
          aria-label="Tandai selesai"
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all active:scale-90 ${
            cat.done
              ? 'border-accent bg-accent text-black'
              : 'border-line text-transparent'
          }`}
        >
          <Check width={15} height={15} strokeWidth={3} />
        </button>

        <button
          onClick={() => hasExpenses && setOpen((o) => !o)}
          className="min-w-0 flex-1 text-left"
        >
          <p
            className={`truncate text-[15px] font-semibold ${
              cat.done ? 'text-muted line-through' : 'text-white'
            }`}
          >
            {cat.name}
          </p>
          <p className="tnum mt-0.5 text-xs text-muted">
            Alokasi Rp {formatNumber(cat.allocated)}
            {hasExpenses && (
              <span className="text-muted/70">
                {' '}
                · {cat.expenses.length} pengeluaran
              </span>
            )}
          </p>
        </button>

        <div className="shrink-0 text-right">
          <p
            className={`tnum text-[15px] font-bold ${
              over ? 'text-red-400' : 'text-white'
            }`}
          >
            {formatNumber(left)}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-muted">
            {hasExpenses ? 'sisa' : 'nominal'}
          </p>
        </div>

        {hasExpenses && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted active:scale-90"
            aria-label="Buka detail"
          >
            <ChevronDown
              width={18}
              height={18}
              className={`transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Progress bar mini */}
      {hasExpenses && (
        <div className="px-3.5 pb-3 -mt-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-card-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                over
                  ? 'bg-red-500'
                  : 'bg-gradient-to-r from-accent-soft to-accent'
              }`}
              style={{ width: `${over ? 100 : pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Detail expand */}
      {open && (
        <div className="animate-fade-in border-t border-line bg-black/20 px-3.5 py-3">
          <div className="space-y-1.5">
            {cat.expenses.map((e) => (
              <div
                key={e.id}
                className="group flex items-center gap-2 rounded-lg px-1 py-1.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/90">{e.label}</p>
                  <p className="text-[11px] text-muted">
                    {formatDate(e.createdAt)}
                  </p>
                </div>
                <p className="tnum text-sm font-semibold text-red-400">
                  −{formatNumber(e.amount)}
                </p>
                <button
                  onClick={() => deleteExpense(cat.id, e.id)}
                  className="grid h-7 w-7 place-items-center rounded-full text-muted active:scale-90 active:text-red-400"
                  aria-label="Hapus pengeluaran"
                >
                  <Trash width={14} height={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-line pt-2.5">
            <span className="text-xs text-muted">Sisa pos</span>
            <span
              className={`tnum text-base font-bold ${
                over ? 'text-red-400' : 'text-accent-soft'
              }`}
            >
              Rp {formatNumber(left)}
            </span>
          </div>
        </div>
      )}

      {/* Add expense / actions row */}
      <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
        {adding ? (
          <div className="w-full space-y-2">
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Untuk apa? (mis. malam mingguan)"
              className="w-full rounded-xl border border-line bg-card-2 px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent/60"
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <MoneyInput value={amount} onChange={setAmount} />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAdding(false);
                  setLabel('');
                  setAmount(0);
                }}
                className="flex-1 rounded-xl border border-line py-2.5 text-sm font-medium text-muted active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={submit}
                disabled={amount <= 0}
                className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-black active:scale-95 disabled:opacity-40"
              >
                Simpan
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setAdding(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-card-2 py-2 text-[13px] font-medium text-accent-soft active:scale-95"
            >
              <Plus width={16} height={16} /> Pengeluaran
            </button>
            <button
              onClick={onEdit}
              className="grid h-9 w-9 place-items-center rounded-xl bg-card-2 text-muted active:scale-95"
              aria-label="Edit pos"
            >
              <Pencil width={15} height={15} />
            </button>
            <button
              onClick={() => {
                if (confirm(`Hapus pos "${cat.name}"?`)) deleteCategory(cat.id);
              }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-card-2 text-muted active:scale-95 active:text-red-400"
              aria-label="Hapus pos"
            >
              <Trash width={15} height={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
