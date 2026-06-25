'use client';

import { useRef, useState, type ReactNode } from 'react';

export type SwipeAction = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
};

const BTN = 64; // lebar tiap tombol aksi (px)

/**
 * Bungkus kartu agar tombol aksi (edit/hapus) muncul saat digeser ke kiri.
 * Geser kanan / ketuk kartu menutup kembali.
 */
export function SwipeActions({
  actions,
  children,
  frameClassName = '',
}: {
  actions: SwipeAction[];
  children: ReactNode;
  frameClassName?: string;
}) {
  const reveal = actions.length * BTN;
  const [tx, setTx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number; tx: number } | null>(null);
  const dir = useRef<'h' | 'v' | null>(null);

  const close = () => setTx(0);

  const onDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY, tx };
    dir.current = null;
  };

  const onMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (dir.current === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      dir.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      if (dir.current === 'h') setDragging(true);
    }
    if (dir.current !== 'h') return;
    const next = Math.max(-reveal, Math.min(0, start.current.tx + dx));
    setTx(next);
  };

  const onUp = () => {
    if (dir.current === 'h') setTx(tx < -reveal / 2 ? -reveal : 0);
    setDragging(false);
    start.current = null;
    dir.current = null;
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${frameClassName}`}>
      {/* Aksi di belakang kartu */}
      <div className="absolute inset-y-0 right-0 flex">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={() => {
              close();
              a.onClick();
            }}
            style={{ width: BTN }}
            className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
              a.danger
                ? 'bg-red-500 text-white'
                : 'bg-card-2 text-accent-soft'
            }`}
          >
            {a.icon}
            {a.label}
          </button>
        ))}
      </div>

      {/* Kartu (geser) — sudut siku agar nyatu dengan aksi */}
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ transform: `translateX(${tx}px)`, touchAction: 'pan-y' }}
        className={`relative bg-card ${
          dragging ? '' : 'transition-transform duration-200'
        }`}
      >
        {tx !== 0 && (
          <div className="absolute inset-0 z-10" onClick={close} />
        )}
        {children}
      </div>
    </div>
  );
}
