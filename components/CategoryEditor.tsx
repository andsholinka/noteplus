'use client';

import { useEffect, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { MoneyInput } from './MoneyInput';
import { useStore } from '@/lib/store';
import type { Category } from '@/lib/types';

export function CategoryEditor({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing: Category | null;
}) {
  const { addCategory, updateCategory } = useStore();
  const [name, setName] = useState('');
  const [allocated, setAllocated] = useState(0);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '');
      setAllocated(editing?.allocated ?? 0);
    }
  }, [open, editing]);

  const valid = name.trim().length > 0 && allocated > 0;

  const submit = () => {
    if (!valid) return;
    if (editing) {
      updateCategory(editing.id, { name: name.trim(), allocated });
    } else {
      addCategory({ name: name.trim(), allocated });
    }
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Pos' : 'Tambah Pos Budget'}
    >
      <div className="space-y-4 pb-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Nama pos
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="mis. Tabungan, KPR, Token…"
            className="w-full rounded-xl border border-line bg-card-2 px-3.5 py-3 text-base text-white outline-none focus:border-accent/60"
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Nominal alokasi
          </label>
          <MoneyInput value={allocated} onChange={setAllocated} />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[100000, 500000, 1000000, 2000000].map((q) => (
              <button
                key={q}
                onClick={() => setAllocated((a) => a + q)}
                className="tnum rounded-lg bg-card-2 px-2.5 py-1 text-xs font-medium text-muted active:scale-95"
              >
                +{q / 1000}rb
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!valid}
          className="w-full rounded-xl bg-accent py-3.5 text-[15px] font-semibold text-black transition active:scale-[0.98] disabled:opacity-40"
        >
          {editing ? 'Simpan Perubahan' : 'Tambah Pos'}
        </button>
      </div>
    </BottomSheet>
  );
}
