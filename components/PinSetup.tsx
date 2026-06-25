'use client';

import { useEffect, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { PIN_LENGTH, setPin as savePin } from '@/lib/pin';
import { PinDots, PinPad } from './PinPad';

export function PinSetup({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const [stage, setStage] = useState<'enter' | 'confirm'>('enter');
  const [first, setFirst] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) {
      setStage('enter');
      setFirst('');
      setPin('');
      setError(false);
    }
  }, [open]);

  const onKey = (d: string) => {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + d;
    setError(false);
    setPin(next);
    if (next.length === PIN_LENGTH) {
      setTimeout(() => {
        if (stage === 'enter') {
          setFirst(next);
          setStage('confirm');
          setPin('');
        } else {
          if (next === first) {
            savePin(next);
            onDone();
            onClose();
          } else {
            setError(true);
            if (navigator.vibrate) navigator.vibrate(120);
            setTimeout(() => {
              setStage('enter');
              setFirst('');
              setPin('');
              setError(false);
            }, 600);
          }
        }
      }, 120);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Atur PIN">
      <div className="flex flex-col items-center pb-4">
        <p className="text-sm text-muted">
          {stage === 'enter'
            ? `Buat PIN ${PIN_LENGTH} angka`
            : 'Ulangi PIN untuk konfirmasi'}
        </p>
        <div className="my-7">
          <PinDots count={pin.length} error={error} />
          {error && (
            <p className="mt-3 text-center text-xs text-red-400">
              PIN tidak cocok, ulangi
            </p>
          )}
        </div>
        <PinPad
          onKey={onKey}
          onBackspace={() => setPin((p) => p.slice(0, -1))}
        />
      </div>
    </BottomSheet>
  );
}
