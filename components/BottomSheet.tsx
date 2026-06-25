'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from './icons';

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
      />
      <div className="phone-frame relative z-10 !min-h-0 animate-sheet-up rounded-t-2xl border-t border-line bg-card pb-[max(20px,env(safe-area-inset-bottom))] !my-0">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-line" />
        <div className="flex items-center justify-between px-5 pb-2 pt-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-card-2 text-muted active:scale-95"
            aria-label="Tutup"
          >
            <X width={16} height={16} />
          </button>
        </div>
        <div className="px-5">{children}</div>
      </div>
    </div>
  );
}
