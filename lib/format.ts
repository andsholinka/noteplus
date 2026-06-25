/** Format angka ke gaya Indonesia: 3727000 -> "3.727.000" */
export function formatNumber(n: number): string {
  if (!isFinite(n)) return '0';
  const neg = n < 0;
  const s = Math.abs(Math.round(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return neg ? `-${s}` : s;
}

/** "Rp 3.727.000" */
export function formatRupiah(n: number): string {
  return `Rp ${formatNumber(n)}`;
}

/** Ringkas: 3.727.000 -> "3,7jt", 526500 -> "527rb" */
export function formatShort(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) {
    const v = abs / 1_000_000;
    return `${sign}${v % 1 === 0 ? v : v.toFixed(1).replace('.', ',')}jt`;
  }
  if (abs >= 1_000) {
    return `${sign}${Math.round(abs / 1_000)}rb`;
  }
  return `${sign}${abs}`;
}

/** Ambil hanya digit dari input lalu jadikan number. */
export function parseNumberInput(s: string): number {
  const digits = s.replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

/** Untuk input: tampilkan dengan pemisah ribuan saat user mengetik. */
export function formatInput(s: string): string {
  const digits = s.replace(/[^\d]/g, '');
  if (!digits) return '';
  return parseInt(digits, 10)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateLong(ts: number): string {
  return new Date(ts).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Timestamp -> "yyyy-mm-dd" untuk <input type="date"> (waktu lokal). */
export function toDateInput(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** "yyyy-mm-dd" -> timestamp, mempertahankan jam dari nilai lama bila ada. */
export function fromDateInput(value: string, keepTimeFrom?: number): number {
  const [y, m, d] = value.split('-').map(Number);
  const base = keepTimeFrom ? new Date(keepTimeFrom) : new Date();
  base.setFullYear(y, (m || 1) - 1, d || 1);
  return base.getTime();
}
