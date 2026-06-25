# NotePlus — Budgeting

Aplikasi pencatatan keuangan simpel ala catatan HP. Setiap **pos budget** (KPR,
Tabungan, Token, dll.) kamu plot nominalnya, lalu tinggal catat pengeluaran di
bawahnya — **sisa tiap pos dihitung otomatis**. Tanpa login, tanpa database.
Semua tersimpan di **storage HP** (localStorage) dan bisa di-_install_ sebagai
PWA.

## Fitur

- 📒 Pos budget dengan alokasi + daftar pengeluaran, sisa otomatis
- ✅ Centang pos yang sudah dibayar lunas (mis. KPR, gas, zakat)
- 📊 Ringkasan total: dialokasikan, terpakai, sisa, progress bar
- 🗓️ Multi-bulan: bikin budget baru tiap bulan, atau **duplikat** pos bulan
  lalu (saldo direset)
- 📱 Tampilan mobile-only (tetap frame HP walau dibuka di laptop)
- ⚡ PWA: bisa di-_install_ ke home screen & jalan offline
- 💾 Data tersimpan lokal di HP — tidak dikirim ke mana pun

## Menjalankan

```bash
npm install
npm run dev      # mode development → http://localhost:3000
```

Untuk versi final (PWA aktif hanya di production):

```bash
npm run build
npm start        # → http://localhost:3000
```

## Pakai di HP / Install sebagai aplikasi

1. Pastikan HP & komputer satu jaringan WiFi.
2. Jalankan `npm start`, lalu buka `http://IP-komputer:3000` di HP.
   (Untuk install PWA via Chrome, idealnya diakses lewat HTTPS/localhost atau
   di-_deploy_ ke Vercel.)
3. Di Chrome HP: menu ⋮ → **Add to Home screen**.

Cara termudah: deploy gratis ke [Vercel](https://vercel.com) lalu buka link-nya
di HP dan _Add to Home screen_.

## Struktur

- `app/` — layout, halaman, global style
- `components/` — UI (kartu pos, bottom sheet, editor, ringkasan)
- `lib/` — tipe data, format Rupiah, dan store (localStorage)
- `public/` — manifest PWA, service worker, ikon
