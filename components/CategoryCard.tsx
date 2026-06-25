'use client';

import { useState } from 'react';
import { formatNumber, formatDate } from '@/lib/format';
import { remaining, spent, type Category, type Expense } from '@/lib/types';
import { useStore } from '@/lib/store';
import { SwipeActions } from './SwipeActions';
import { Check, ChevronDown, Trash, Pencil } from './icons';

export function CategoryCard({
  cat,
  onEdit,
  onEditExpense,
}: {
  cat: Category;
  onEdit: () => void;
  onEditExpense: (catId: string, expense: Expense) => void;
}) {
  const { toggleDone, deleteCategory } = useStore();
  const [open, setOpen] = useState(false);

  const used = spent(cat);
  const left = remaining(cat);
  const hasExpenses = cat.expenses.length > 0;
  const over = left < 0;
  const pct =
    cat.allocated > 0 ? Math.min(100, (used / cat.allocated) * 100) : 0;

  return (
    <SwipeActions
      frameClassName={`border transition-colors ${
        cat.done ? 'border-accent/30' : 'border-line'
      }`}
      actions={[
        {
          icon: <Pencil width={17} height={17} />,
          label: 'Edit',
          onClick: onEdit,
        },
        {
          icon: <Trash width={17} height={17} />,
          label: 'Hapus',
          danger: true,
          onClick: () => {
            if (confirm(`Hapus pos "${cat.name}"?`)) deleteCategory(cat.id);
          },
        },
      ]}
    >
      <div>
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
              <span className="whitespace-nowrap">
                Alokasi Rp {formatNumber(cat.allocated)}
              </span>
              {hasExpenses && (
                <span className="whitespace-nowrap text-muted/70">
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
          <div className="-mt-1 px-3.5 pb-3">
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
                <button
                  key={e.id}
                  onClick={() => onEditExpense(cat.id, e)}
                  className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-left active:bg-white/5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white/90">{e.label}</p>
                    <p className="text-[11px] text-muted">
                      {formatDate(e.createdAt)} · ketuk untuk ubah
                    </p>
                  </div>
                  <p className="tnum text-sm font-semibold text-red-400">
                    −{formatNumber(e.amount)}
                  </p>
                </button>
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
      </div>
    </SwipeActions>
  );
}
