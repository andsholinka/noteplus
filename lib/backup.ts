import { formatNumber } from './format';
import { remaining, sheetTotals, type AppState, type Sheet } from './types';

export const BACKUP_VERSION = 1;

type BackupFile = {
  app: 'noteplus';
  version: number;
  exportedAt: number;
  state: AppState;
};

/** Bungkus state jadi JSON rapi untuk file backup. */
export function serialize(state: AppState): string {
  const payload: BackupFile = {
    app: 'noteplus',
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    state,
  };
  return JSON.stringify(payload, null, 2);
}

/** Validasi longgar: terima file backup NotePlus atau AppState mentah. */
export function parseBackup(raw: string): AppState {
  const obj = JSON.parse(raw);
  const state: unknown =
    obj && typeof obj === 'object' && 'state' in obj ? obj.state : obj;

  if (
    !state ||
    typeof state !== 'object' ||
    !Array.isArray((state as AppState).sheets)
  ) {
    throw new Error('Format file tidak dikenali.');
  }

  const s = state as AppState;
  // Pastikan tiap sheet & kategori punya bentuk minimal yang benar.
  for (const sheet of s.sheets) {
    if (typeof sheet.id !== 'string' || !Array.isArray(sheet.categories)) {
      throw new Error('Data sheet rusak.');
    }
    for (const c of sheet.categories) {
      c.expenses = Array.isArray(c.expenses) ? c.expenses : [];
      c.done = Boolean(c.done);
      c.allocated = Number(c.allocated) || 0;
    }
  }
  if (!s.activeSheetId && s.sheets[0]) s.activeSheetId = s.sheets[0].id;
  return s;
}

/** Nama file: noteplus-backup-2026-06-25.json */
export function backupFilename(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `noteplus-backup-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(
    d.getDate()
  )}.json`;
}

/** Picu unduhan file backup di browser. */
export function downloadBackup(state: AppState) {
  const blob = new Blob([serialize(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = backupFilename();
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Ubah satu sheet jadi teks rapi ala catatan (untuk dikirim ke WA). */
export function sheetToText(sheet: Sheet): string {
  const t = sheetTotals(sheet);
  const lines: string[] = [];
  lines.push(sheet.title.toUpperCase());
  lines.push('');

  for (const c of sheet.categories) {
    const mark = c.done ? '✅' : '⬜';
    const left = remaining(c);
    if (c.expenses.length === 0) {
      lines.push(`${mark} ${c.name} — Rp ${formatNumber(c.allocated)}`);
    } else {
      lines.push(
        `${mark} ${c.name} — alokasi Rp ${formatNumber(
          c.allocated
        )} (sisa Rp ${formatNumber(left)})`
      );
      for (const e of c.expenses) {
        lines.push(`     • ${e.label}: -${formatNumber(e.amount)}`);
      }
    }
  }

  lines.push('');
  lines.push(`Dialokasikan : Rp ${formatNumber(t.allocated)}`);
  lines.push(`Terpakai     : Rp ${formatNumber(t.used)}`);
  lines.push(`Sisa         : Rp ${formatNumber(t.left)}`);
  lines.push('');
  lines.push('— dibuat dengan NotePlus');
  return lines.join('\n');
}

/** Salin teks ke clipboard, dengan fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* lanjut ke fallback */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
