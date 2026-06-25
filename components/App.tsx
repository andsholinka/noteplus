'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { Category } from '@/lib/types';
import { SummaryCard } from './SummaryCard';
import { CategoryCard } from './CategoryCard';
import { CategoryEditor } from './CategoryEditor';
import { SheetMenu } from './SheetMenu';
import { ChevronDown, Plus, Wallet } from './icons';

export function App() {
  const { ready, activeSheet } = useStore();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!ready || !activeSheet) {
    return (
      <div className="grid min-h-[100dvh] place-items-center text-muted">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" />
      </div>
    );
  }

  const openAdd = () => {
    setEditing(null);
    setEditorOpen(true);
  };
  const openEdit = (c: Category) => {
    setEditing(c);
    setEditorOpen(true);
  };

  const cats = activeSheet.categories;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-bg/85 px-4 pb-3 pt-[max(14px,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
              <Wallet width={18} height={18} />
            </span>
            <span className="text-sm font-semibold text-white">NotePlus</span>
          </div>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="mt-3 flex w-full items-center gap-2 text-left"
        >
          <h1 className="truncate text-2xl font-bold text-white">
            {activeSheet.title}
          </h1>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-card-2 text-muted">
            <ChevronDown width={16} height={16} />
          </span>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 space-y-3 px-4 pb-32">
        <SummaryCard sheet={activeSheet} />

        <div className="flex items-center justify-between pt-1">
          <h2 className="text-sm font-semibold text-muted">
            Pos Budget{' '}
            <span className="text-muted/60">({cats.length})</span>
          </h2>
        </div>

        {cats.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-12 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-card text-accent">
              <Wallet width={26} height={26} />
            </span>
            <p className="mt-4 font-semibold text-white">Belum ada pos</p>
            <p className="mt-1 max-w-[240px] text-sm text-muted">
              Tambahkan pos seperti KPR, Tabungan, atau Token, lalu catat
              pengeluaran di bawahnya.
            </p>
            <button
              onClick={openAdd}
              className="mt-5 flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-black active:scale-95"
            >
              <Plus width={16} height={16} /> Tambah pos pertama
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {cats.map((c) => (
              <CategoryCard key={c.id} cat={c} onEdit={() => openEdit(c)} />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      {cats.length > 0 && (
        <button
          onClick={openAdd}
          className="fixed bottom-[max(20px,env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-black shadow-lg shadow-accent/25 active:scale-95"
        >
          <Plus width={18} height={18} strokeWidth={2.5} /> Tambah Pos
        </button>
      )}

      <CategoryEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        editing={editing}
      />
      <SheetMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
