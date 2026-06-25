// PIN lokal sederhana sebagai penghalang kalau HP dipinjam.
// Catatan: ini bukan enkripsi — data tetap ada di localStorage.
const KEY = 'noteplus.pin';

export const PIN_LENGTH = 4;

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export function hasPin(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(KEY);
}

export function setPin(pin: string): void {
  localStorage.setItem(KEY, hash(pin));
}

export function clearPin(): void {
  localStorage.removeItem(KEY);
}

export function verifyPin(pin: string): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem(KEY);
  return !!saved && saved === hash(pin);
}
