'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import type { Category, Expense } from '@/lib/types';
import { hasPin } from '@/lib/pin';
import { SummaryCard } from './SummaryCard';
import { CategoryCard } from './CategoryCard';
import { CategoryEditor } from './CategoryEditor';
import { SheetMenu } from './SheetMenu';
import { BackupSheet } from './BackupSheet';
import { HistorySheet } from './HistorySheet';
import { ReorderSheet } from './ReorderSheet';
import { ExpenseEditor, type ExpenseTarget } from './ExpenseEditor';
import { QuickExpenseSheet } from './QuickExpenseSheet';
import { PinLock } from './PinLock';
import {
  ChevronDown,
  Clock,
  Gear,
  ListOrder,
  Plus,
  Search,
  Wallet,
  X,
} from './icons';

export function App() {
  const { ready, activeSheet } = useStore();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [posSearch, setPosSearch] = useState('');
  const [expTarget, setExpTarget] = useState<ExpenseTarget | null>(null);

  // Gerbang PIN: jangan render isi sampai status kunci diperiksa.
  const [pinChecked, setPinChecked] = useState(false);
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    setLocked(hasPin());
    setPinChecked(true);
  }, []);

  if (!ready || !activeSheet || !pinChecked) {
    return (
      <div className="grid min-h-[100dvh] place-items-center text-muted">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" />
      </div>
    );
  }

  if (locked) {
    return <PinLock onUnlock={() => setLocked(false)} />;
  }

  const openAdd = () => {
    setEditing(null);
    setEditorOpen(true);
  };
  const openEdit = (c: Category) => {
    setEditing(c);
    setEditorOpen(true);
  };
  const openExpense = (catId: string, expense: Expense) =>
    setExpTarget({ catId, expense });

  const cats = activeSheet.categories;
  const q = posSearch.trim().toLowerCase();
  const visibleCats = q
    ? cats.filter((c) => c.name.toLowerCase().includes(q))
    : cats;

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

          <button
            onClick={() => setBackupOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-xl bg-card-2 text-muted active:scale-95"
            aria-label="Backup & pengaturan"
          >
            <Gear width={18} height={18} />
          </button>
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
          <h2 className="shrink-0 text-sm font-semibold text-muted">
            Pos Budget{' '}
            <span className="text-muted/60">({cats.length})</span>
          </h2>
          <div className="flex items-center gap-1.5">
            {cats.length > 1 && (
              <button
                onClick={() => setReorderOpen(true)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-card-2 text-muted active:scale-90"
                aria-label="Urutkan pos"
              >
                <ListOrder width={16} height={16} />
              </button>
            )}
            <button
              onClick={() => setHistoryOpen(true)}
              className="grid h-8 w-8 place-items-center rounded-lg bg-card-2 text-accent-soft active:scale-90"
              aria-label="Riwayat pengeluaran"
            >
              <Clock width={16} height={16} />
            </button>
            <button
              onClick={openAdd}
              className="flex h-8 items-center gap-1 rounded-lg bg-accent/15 px-2.5 text-xs font-semibold text-accent active:scale-95"
            >
              <Plus width={15} height={15} /> Pos
            </button>
          </div>
        </div>

        {cats.length >= 4 && (
          <div className="flex items-center gap-2 rounded-xl border border-line bg-card-2 px-3.5">
            <Search width={15} height={15} className="text-muted" />
            <input
              value={posSearch}
              onChange={(e) => setPosSearch(e.target.value)}
              placeholder="Cari pos…"
              className="w-full bg-transparent py-2.5 text-sm text-white outline-none"
            />
            {posSearch && (
              <button onClick={() => setPosSearch('')} aria-label="Bersihkan">
                <X width={15} height={15} className="text-muted" />
              </button>
            )}
          </div>
        )}

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
        ) : visibleCats.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            Tidak ada pos cocok dengan &ldquo;{posSearch}&rdquo;.
          </p>
        ) : (
          <div className="space-y-2.5">
            {visibleCats.map((c) => (
              <CategoryCard
                key={c.id}
                cat={c}
                onEdit={() => openEdit(c)}
                onEditExpense={openExpense}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB: catat pengeluaran cepat */}
      {cats.length > 0 && (
        <div className="pointer-events-none fixed bottom-[max(20px,env(safe-area-inset-bottom))] left-1/2 z-30 flex w-full max-w-[430px] -translate-x-1/2 justify-end px-4">
          <button
            onClick={() => setQuickOpen(true)}
            aria-label="Catat pengeluaran"
            className="pointer-events-auto grid place-items-center rounded-full bg-accent text-black shadow-xl shadow-accent/30 transition active:scale-90"
            style={{ height: 52, width: 52 }}
          >
            <Plus width={22} height={22} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <CategoryEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        editing={editing}
      />
      <SheetMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <BackupSheet open={backupOpen} onClose={() => setBackupOpen(false)} />
      <HistorySheet
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sheet={activeSheet}
        onEditExpense={openExpense}
      />
      <ReorderSheet
        open={reorderOpen}
        onClose={() => setReorderOpen(false)}
        sheet={activeSheet}
      />
      <ExpenseEditor target={expTarget} onClose={() => setExpTarget(null)} />
      <QuickExpenseSheet
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        sheet={activeSheet}
      />
    </div>
  );
}
