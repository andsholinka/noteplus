export type Expense = {
  id: string;
  label: string;
  amount: number;
  createdAt: number;
};

export type Category = {
  id: string;
  name: string;
  allocated: number;
  done: boolean;
  /** Pengeluaran yang mengurangi pos ini. Kosong = cukup dicentang saja. */
  expenses: Expense[];
};

export type Sheet = {
  id: string;
  title: string;
  createdAt: number;
  categories: Category[];
};

export type AppState = {
  sheets: Sheet[];
  activeSheetId: string | null;
};

export const spent = (c: Category) =>
  c.expenses.reduce((sum, e) => sum + e.amount, 0);

export const remaining = (c: Category) => c.allocated - spent(c);

/**
 * Terpakai efektif untuk perhitungan total. Pos yang dicentang dianggap
 * lunas/terpakai penuh (minimal sebesar alokasinya), walau belum ada
 * rincian pengeluaran. Pos belum dicentang hanya dihitung dari pengeluaran.
 */
export const usedOf = (c: Category) =>
  c.done ? Math.max(c.allocated, spent(c)) : spent(c);

export const sheetTotals = (s: Sheet) => {
  const allocated = s.categories.reduce((sum, c) => sum + c.allocated, 0);
  const used = s.categories.reduce((sum, c) => sum + usedOf(c), 0);
  const doneCount = s.categories.filter((c) => c.done).length;
  return {
    allocated,
    used,
    left: allocated - used,
    doneCount,
    total: s.categories.length,
  };
};
