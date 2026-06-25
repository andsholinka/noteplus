'use client';

import { useEffect, useRef, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { useStore } from '@/lib/store';
import {
  copyText,
  downloadBackup,
  parseBackup,
  sheetToText,
} from '@/lib/backup';
import { clearPin, hasPin } from '@/lib/pin';
import { PinSetup } from './PinSetup';
import { Check, Download, FileText, Lock, Upload } from './icons';

type Toast = { msg: string; ok: boolean } | null;

export function BackupSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state, activeSheet, importState } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [pinOn, setPinOn] = useState(false);
  const [pinSetupOpen, setPinSetupOpen] = useState(false);

  useEffect(() => {
    if (open) setPinOn(hasPin());
  }, [open]);

  const onRemovePin = () => {
    if (confirm('Matikan kunci PIN?')) {
      clearPin();
      setPinOn(false);
      flash('Kunci PIN dimatikan');
    }
  };

  const flash = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2200);
  };

  const onExport = () => {
    downloadBackup(state);
    flash('File backup diunduh');
  };

  const onCopyText = async () => {
    if (!activeSheet) return;
    const ok = await copyText(sheetToText(activeSheet));
    flash(ok ? 'Disalin — tempel di WhatsApp' : 'Gagal menyalin', ok);
  };

  const onPickFile = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const next = parseBackup(text);
      const count = next.sheets.length;
      if (
        confirm(
          `Pulihkan ${count} budget dari file ini?\n\nData yang sekarang ada akan DIGANTI.`
        )
      ) {
        importState(next);
        flash('Data berhasil dipulihkan');
        setTimeout(onClose, 600);
      }
    } catch (err) {
      flash(
        err instanceof Error ? err.message : 'File tidak bisa dibaca',
        false
      );
    }
  };

  const totalSheets = state.sheets.length;
  const totalPos = state.sheets.reduce(
    (n, s) => n + s.categories.length,
    0
  );

  return (
    <BottomSheet open={open} onClose={onClose} title="Backup & Pulihkan">
      <div className="space-y-3 pb-2">
        <p className="text-[13px] leading-relaxed text-muted">
          Datamu disimpan di HP ini saja. Backup rutin biar aman kalau cache
          browser terhapus atau ganti HP.
        </p>

        <div className="rounded-xl border border-line bg-card-2 px-3.5 py-2.5 text-xs text-muted">
          Tersimpan:{' '}
          <span className="font-semibold text-white">{totalSheets} budget</span>{' '}
          · <span className="font-semibold text-white">{totalPos} pos</span>
        </div>

        <ActionRow
          icon={<Download width={18} height={18} />}
          title="Export ke file"
          subtitle="Simpan semua budget jadi file .json"
          onClick={onExport}
        />
        <ActionRow
          icon={<FileText width={18} height={18} />}
          title="Salin sebagai teks"
          subtitle="Untuk dikirim ke WhatsApp / catatan"
          onClick={onCopyText}
        />
        <ActionRow
          icon={<Upload width={18} height={18} />}
          title="Pulihkan dari file"
          subtitle="Impor file backup .json (mengganti data)"
          onClick={onPickFile}
          danger
        />

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onFile}
        />

        <div className="pt-1">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted">
            Keamanan
          </p>
          {pinOn ? (
            <div className="space-y-2">
              <ActionRow
                icon={<Lock width={18} height={18} />}
                title="Ubah PIN"
                subtitle="Ganti PIN yang sekarang"
                onClick={() => setPinSetupOpen(true)}
              />
              <ActionRow
                icon={<Lock width={18} height={18} />}
                title="Matikan kunci PIN"
                subtitle="App tidak akan minta PIN lagi"
                onClick={onRemovePin}
                danger
              />
            </div>
          ) : (
            <ActionRow
              icon={<Lock width={18} height={18} />}
              title="Aktifkan kunci PIN"
              subtitle="Minta PIN tiap buka aplikasi"
              onClick={() => setPinSetupOpen(true)}
            />
          )}
        </div>
      </div>

      <PinSetup
        open={pinSetupOpen}
        onClose={() => setPinSetupOpen(false)}
        onDone={() => {
          setPinOn(true);
          flash('Kunci PIN aktif');
        }}
      />

      {toast && (
        <div
          className={`pointer-events-none fixed inset-x-0 bottom-28 z-[60] mx-auto flex w-fit items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-lg animate-pop ${
            toast.ok ? 'bg-accent text-black' : 'bg-red-500'
          }`}
        >
          {toast.ok && <Check width={15} height={15} strokeWidth={3} />}
          {toast.msg}
        </div>
      )}
    </BottomSheet>
  );
}

function ActionRow({
  icon,
  title,
  subtitle,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-card-2 p-3 text-left active:scale-[0.98]"
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          danger ? 'bg-red-500/15 text-red-400' : 'bg-accent/15 text-accent'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="block truncate text-xs text-muted">{subtitle}</span>
      </span>
    </button>
  );
}
