'use client';

import { useEffect, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { MoneyInput } from './MoneyInput';
import { useStore } from '@/lib/store';
import { toDateInput, fromDateInput } from '@/lib/format';
import type { Expense } from '@/lib/types';
import { Trash } from './icons';

export type ExpenseTarget = { catId: string; expense: Expense };

export function ExpenseEditor({
  target,
  onClose,
}: {
  target: ExpenseTarget | null;
  onClose: () => void;
}) {
  const { updateExpense, deleteExpense } = useStore();
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (target) {
      setLabel(target.expense.label);
      setAmount(target.expense.amount);
      setDate(toDateInput(target.expense.createdAt));
    }
  }, [target]);

  const valid = amount > 0 && date;

  const submit = () => {
    if (!target || !valid) return;
    updateExpense(target.catId, target.expense.id, {
      label: label.trim(),
      amount,
      createdAt: fromDateInput(date, target.expense.createdAt),
    });
    onClose();
  };

  const remove = () => {
    if (!target) return;
    if (confirm('Hapus pengeluaran ini?')) {
      deleteExpense(target.catId, target.expense.id);
      onClose();
    }
  };

  return (
    <BottomSheet open={!!target} onClose={onClose} title="Edit Pengeluaran">
      <div className="space-y-4 pb-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Keterangan
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Untuk apa?"
            className="w-full rounded-xl border border-line bg-card-2 px-3.5 py-3 text-base text-white outline-none focus:border-accent/60"
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Nominal
          </label>
          <MoneyInput value={amount} onChange={setAmount} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Tanggal
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="tnum w-full rounded-xl border border-line bg-card-2 px-3.5 py-3 text-base text-white outline-none focus:border-accent/60 [color-scheme:dark]"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={remove}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line text-red-400 active:scale-95"
            aria-label="Hapus"
          >
            <Trash width={18} height={18} />
          </button>
          <button
            onClick={submit}
            disabled={!valid}
            className="flex-1 rounded-xl bg-accent text-[15px] font-semibold text-black transition active:scale-[0.98] disabled:opacity-40"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
