'use client';

import { BottomSheet } from './BottomSheet';
import { useStore } from '@/lib/store';
import { formatNumber } from '@/lib/format';
import type { Sheet } from '@/lib/types';
import { ArrowUp } from './icons';

export function ReorderSheet({
  open,
  onClose,
  sheet,
}: {
  open: boolean;
  onClose: () => void;
  sheet: Sheet;
}) {
  const { moveCategory } = useStore();
  const cats = sheet.categories;

  return (
    <BottomSheet open={open} onClose={onClose} title="Urutkan Pos">
      <p className="mb-3 text-[13px] text-muted">
        Atur urutan pos sesuai prioritasmu.
      </p>
      <div className="max-h-[55vh] space-y-1.5 overflow-y-auto no-scrollbar pb-2">
        {cats.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">Belum ada pos.</p>
        )}
        {cats.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center gap-2 rounded-xl border border-line bg-card-2 p-2.5"
          >
            <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-card text-xs font-semibold text-muted">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {c.name}
              </p>
              <p className="tnum text-[11px] text-muted">
                Rp {formatNumber(c.allocated)}
              </p>
            </div>
            <button
              onClick={() => moveCategory(c.id, -1)}
              disabled={i === 0}
              className="grid h-9 w-9 place-items-center rounded-lg bg-card text-muted active:scale-90 disabled:opacity-25"
              aria-label="Naik"
            >
              <ArrowUp width={16} height={16} />
            </button>
            <button
              onClick={() => moveCategory(c.id, 1)}
              disabled={i === cats.length - 1}
              className="grid h-9 w-9 place-items-center rounded-lg bg-card text-muted active:scale-90 disabled:opacity-25"
              aria-label="Turun"
            >
              <ArrowUp width={16} height={16} className="rotate-180" />
            </button>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}
