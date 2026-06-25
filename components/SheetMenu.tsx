'use client';

import { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { useStore } from '@/lib/store';
import { Check, Copy, Pencil, Plus, Trash } from './icons';

export function SheetMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    state,
    activeSheet,
    setActiveSheet,
    addSheet,
    renameSheet,
    deleteSheet,
    duplicateSheet,
  } = useStore();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const startRename = (id: string, title: string) => {
    setRenamingId(id);
    setDraft(title);
  };
  const commitRename = () => {
    if (renamingId && draft.trim()) renameSheet(renamingId, draft.trim());
    setRenamingId(null);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Budget Bulanan">
      <div className="max-h-[55vh] space-y-2 overflow-y-auto no-scrollbar pb-2">
        {state.sheets.map((s) => {
          const active = s.id === activeSheet?.id;
          return (
            <div
              key={s.id}
              className={`flex items-center gap-2 rounded-xl border p-2.5 ${
                active ? 'border-accent/40 bg-accent/5' : 'border-line bg-card-2'
              }`}
            >
              {renamingId === s.id ? (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => e.key === 'Enter' && commitRename()}
                  className="min-w-0 flex-1 rounded-lg border border-accent/50 bg-card px-2.5 py-1.5 text-sm text-white outline-none"
                />
              ) : (
                <button
                  onClick={() => {
                    setActiveSheet(s.id);
                    onClose();
                  }}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                      active ? 'bg-accent text-black' : 'text-transparent'
                    }`}
                  >
                    <Check width={13} height={13} strokeWidth={3} />
                  </span>
                  <span className="truncate text-sm font-medium text-white">
                    {s.title}
                  </span>
                </button>
              )}

              <button
                onClick={() => startRename(s.id, s.title)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted active:scale-90"
                aria-label="Ganti nama"
              >
                <Pencil width={14} height={14} />
              </button>
              <button
                onClick={() => duplicateSheet(s.id)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted active:scale-90"
                aria-label="Duplikat ke bulan baru"
              >
                <Copy width={14} height={14} />
              </button>
              {state.sheets.length > 1 && (
                <button
                  onClick={() => {
                    if (confirm(`Hapus "${s.title}"?`)) deleteSheet(s.id);
                  }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted active:scale-90 active:text-red-400"
                  aria-label="Hapus"
                >
                  <Trash width={14} height={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          addSheet();
          onClose();
        }}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line py-3 text-sm font-medium text-accent-soft active:scale-[0.98]"
      >
        <Plus width={16} height={16} /> Budget bulan baru
      </button>
      <p className="mt-2 px-1 text-center text-[11px] text-muted">
        Tip: ikon salin untuk menyalin pos ke bulan berikutnya (saldo direset).
      </p>
    </BottomSheet>
  );
}
