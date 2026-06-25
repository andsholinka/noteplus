'use client';

import { PIN_LENGTH } from '@/lib/pin';

export function PinDots({ count, error }: { count: number; error?: boolean }) {
  return (
    <div className={`flex justify-center gap-3.5 ${error ? 'animate-pop' : ''}`}>
      {Array.from({ length: PIN_LENGTH }).map((_, i) => (
        <span
          key={i}
          className={`h-3.5 w-3.5 rounded-full border-2 transition-all ${
            error
              ? 'border-red-500 bg-red-500'
              : i < count
              ? 'border-accent bg-accent'
              : 'border-line'
          }`}
        />
      ))}
    </div>
  );
}

export function PinPad({
  onKey,
  onBackspace,
}: {
  onKey: (d: string) => void;
  onBackspace: () => void;
}) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return (
    <div className="mx-auto grid w-full max-w-[280px] grid-cols-3 gap-3">
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => onKey(k)}
          className="tnum h-16 rounded-2xl bg-card-2 text-2xl font-semibold text-white transition active:scale-90 active:bg-card"
        >
          {k}
        </button>
      ))}
      <span />
      <button
        onClick={() => onKey('0')}
        className="tnum h-16 rounded-2xl bg-card-2 text-2xl font-semibold text-white transition active:scale-90 active:bg-card"
      >
        0
      </button>
      <button
        onClick={onBackspace}
        className="grid h-16 place-items-center rounded-2xl text-muted transition active:scale-90"
        aria-label="Hapus"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
          <path d="m18 9-6 6M12 9l6 6" />
        </svg>
      </button>
    </div>
  );
}
