'use client';

import { useState } from 'react';
import { PIN_LENGTH, verifyPin } from '@/lib/pin';
import { PinDots, PinPad } from './PinPad';
import { Lock } from './icons';

export function PinLock({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const onKey = (d: string) => {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + d;
    setError(false);
    setPin(next);
    if (next.length === PIN_LENGTH) {
      setTimeout(() => {
        if (verifyPin(next)) {
          onUnlock();
        } else {
          setError(true);
          if (navigator.vibrate) navigator.vibrate(120);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }, 120);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-8">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/15 text-accent">
        <Lock width={28} height={28} />
      </span>
      <h1 className="mt-5 text-lg font-semibold text-white">NotePlus Terkunci</h1>
      <p className="mt-1 text-sm text-muted">Masukkan PIN untuk membuka</p>

      <div className="mt-8 mb-10">
        <PinDots count={pin.length} error={error} />
        {error && (
          <p className="mt-3 text-center text-xs text-red-400">PIN salah</p>
        )}
      </div>

      <PinPad onKey={onKey} onBackspace={() => setPin((p) => p.slice(0, -1))} />
    </div>
  );
}
