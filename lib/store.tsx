'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppState, Category, Expense, Sheet } from './types';
import { remaining } from './types';

/**
 * Pos yang punya pengeluaran otomatis dicentang saat sisa habis (≤ 0),
 * dan lepas centang kalau sisa kembali positif. Pos tanpa pengeluaran
 * (cukup dicentang manual) tidak diutak-atik.
 */
function withAutoDone(c: Category): Category {
  if (c.expenses.length === 0) return c;
  const done = c.allocated > 0 && remaining(c) <= 0;
  return c.done === done ? c : { ...c, done };
}

const STORAGE_KEY = 'noteplus.v1';

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function makeSheet(title?: string): Sheet {
  const now = new Date();
  return {
    id: uid(),
    title:
      title ?? `Budgeting ${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
    createdAt: Date.now(),
    categories: [],
  };
}

function defaultState(): AppState {
  const sheet = makeSheet();
  return { sheets: [sheet], activeSheetId: sheet.id };
}

function load(): AppState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.sheets?.length) return defaultState();
    if (!parsed.activeSheetId) parsed.activeSheetId = parsed.sheets[0].id;
    return parsed;
  } catch {
    return defaultState();
  }
}

type Store = {
  ready: boolean;
  state: AppState;
  activeSheet: Sheet | null;
  setActiveSheet: (id: string) => void;
  addSheet: (title?: string) => void;
  renameSheet: (id: string, title: string) => void;
  deleteSheet: (id: string) => void;
  duplicateSheet: (id: string) => void;

  addCategory: (data: { name: string; allocated: number }) => void;
  updateCategory: (
    id: string,
    data: { name: string; allocated: number }
  ) => void;
  deleteCategory: (id: string) => void;
  toggleDone: (id: string) => void;
  moveCategory: (id: string, dir: -1 | 1) => void;

  addExpense: (
    catId: string,
    data: { label: string; amount: number; createdAt?: number }
  ) => void;
  updateExpense: (
    catId: string,
    expId: string,
    data: { label: string; amount: number; createdAt: number }
  ) => void;
  deleteExpense: (catId: string, expId: string) => void;

  importState: (state: AppState) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage penuh / private mode */
    }
  }, [state, ready]);

  const activeSheet =
    state.sheets.find((s) => s.id === state.activeSheetId) ??
    state.sheets[0] ??
    null;

  const mutateSheet = (fn: (s: Sheet) => Sheet) =>
    setState((prev) => ({
      ...prev,
      sheets: prev.sheets.map((s) =>
        s.id === prev.activeSheetId ? fn(s) : s
      ),
    }));

  const mutateCategory = (id: string, fn: (c: Category) => Category) =>
    mutateSheet((s) => ({
      ...s,
      categories: s.categories.map((c) => (c.id === id ? fn(c) : c)),
    }));

  const store: Store = {
    ready,
    state,
    activeSheet,

    setActiveSheet: (id) =>
      setState((p) => ({ ...p, activeSheetId: id })),

    addSheet: (title) =>
      setState((p) => {
        const s = makeSheet(title);
        return { sheets: [...p.sheets, s], activeSheetId: s.id };
      }),

    renameSheet: (id, title) =>
      setState((p) => ({
        ...p,
        sheets: p.sheets.map((s) => (s.id === id ? { ...s, title } : s)),
      })),

    deleteSheet: (id) =>
      setState((p) => {
        const sheets = p.sheets.filter((s) => s.id !== id);
        const safe = sheets.length ? sheets : [makeSheet()];
        const activeSheetId =
          p.activeSheetId === id ? safe[0].id : p.activeSheetId;
        return { sheets: safe, activeSheetId };
      }),

    duplicateSheet: (id) =>
      setState((p) => {
        const src = p.sheets.find((s) => s.id === id);
        if (!src) return p;
        const copy: Sheet = {
          ...src,
          id: uid(),
          title: `${src.title} (salinan)`,
          createdAt: Date.now(),
          categories: src.categories.map((c) => ({
            ...c,
            id: uid(),
            done: false,
            expenses: [],
          })),
        };
        return { sheets: [...p.sheets, copy], activeSheetId: copy.id };
      }),

    addCategory: ({ name, allocated }) =>
      mutateSheet((s) => ({
        ...s,
        categories: [
          ...s.categories,
          { id: uid(), name, allocated, done: false, expenses: [] },
        ],
      })),

    updateCategory: (id, { name, allocated }) =>
      mutateCategory(id, (c) => ({ ...c, name, allocated })),

    deleteCategory: (id) =>
      mutateSheet((s) => ({
        ...s,
        categories: s.categories.filter((c) => c.id !== id),
      })),

    toggleDone: (id) =>
      mutateCategory(id, (c) => ({ ...c, done: !c.done })),

    moveCategory: (id, dir) =>
      mutateSheet((s) => {
        const i = s.categories.findIndex((c) => c.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= s.categories.length) return s;
        const next = [...s.categories];
        [next[i], next[j]] = [next[j], next[i]];
        return { ...s, categories: next };
      }),

    addExpense: (catId, { label, amount, createdAt }) => {
      const exp: Expense = {
        id: uid(),
        label: label || 'Pengeluaran',
        amount,
        createdAt: createdAt ?? Date.now(),
      };
      mutateCategory(catId, (c) =>
        withAutoDone({ ...c, expenses: [...c.expenses, exp] })
      );
    },

    updateExpense: (catId, expId, data) =>
      mutateCategory(catId, (c) =>
        withAutoDone({
          ...c,
          expenses: c.expenses.map((e) =>
            e.id === expId
              ? {
                  ...e,
                  label: data.label || 'Pengeluaran',
                  amount: data.amount,
                  createdAt: data.createdAt,
                }
              : e
          ),
        })
      ),

    deleteExpense: (catId, expId) =>
      mutateCategory(catId, (c) =>
        withAutoDone({
          ...c,
          expenses: c.expenses.filter((e) => e.id !== expId),
        })
      ),

    importState: (next) => {
      setState(next);
    },
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
