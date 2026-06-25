'use client';

import { formatNumber } from '@/lib/format';
import { sheetTotals, type Sheet } from '@/lib/types';

export function SummaryCard({ sheet }: { sheet: Sheet }) {
  const t = sheetTotals(sheet);
  const pct = t.allocated > 0 ? Math.min(100, (t.used / t.allocated) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-[#3a2a08] via-[#1c1709] to-card p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/15 blur-2xl" />
      <p className="text-xs font-medium uppercase tracking-wider text-accent-soft/80">
        Total Sisa Budget
      </p>
      <p className="tnum mt-1 text-3xl font-bold text-white">
        <span className="text-lg font-semibold text-muted">Rp </span>
        {formatNumber(t.left)}
      </p>

      <div className="mt-4 flex items-center justify-between text-[13px]">
        <div>
          <p className="text-muted">Dialokasikan</p>
          <p className="tnum font-semibold text-white">
            Rp {formatNumber(t.allocated)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-muted">Terpakai</p>
          <p className="tnum font-semibold text-accent-soft">
            Rp {formatNumber(t.used)}
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-soft to-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-2.5 text-xs text-muted">
        {t.doneCount}/{t.total} pos selesai · {Math.round(pct)}% terpakai
      </p>
    </div>
  );
}
