'use client';

import { formatInput, parseNumberInput } from '@/lib/format';

export function MoneyInput({
  value,
  onChange,
  placeholder = '0',
  autoFocus,
}: {
  value: number;
  onChange: (n: number) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-card-2 px-3.5 focus-within:border-accent/60">
      <span className="text-sm font-medium text-muted">Rp</span>
      <input
        inputMode="numeric"
        autoFocus={autoFocus}
        value={value ? formatInput(String(value)) : ''}
        onChange={(e) => onChange(parseNumberInput(e.target.value))}
        placeholder={placeholder}
        className="tnum w-full bg-transparent py-3 text-base font-semibold text-white outline-none"
      />
    </div>
  );
}
