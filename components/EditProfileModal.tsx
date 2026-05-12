"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  user: { name: string; email: string };
  onClose: () => void;
}

export default function EditProfileModal({ user, onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    if (!name.trim()) return setError("Имя не может быть пустым");
    setLoading(true);
    setError("");

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 800);
    } else {
      setError(data.error || "Ошибка сохранения");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Фон */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Модалка */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#13131f] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-medium text-white">Редактировать профиль</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition text-xl leading-none">×</button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Имя */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Имя</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#6c5ce7]/50 transition"
            />
          </div>

          {/* Email — только инфо */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Почта</label>
            <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2.5 text-sm text-white/30 flex items-center justify-between">
              <span>{user.email}</span>
              <span className="text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5">Clerk</span>
            </div>
            <p className="text-[11px] text-white/25 mt-1.5">Почта управляется через Clerk — нажмите на аватар в шапке</p>
          </div>

          {/* Будущие поля */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
            <p className="text-xs text-white/25">Реквизиты для выплат и настройки оплаты появятся после подключения Stripe</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.03] transition"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={loading || success}
            className="flex-1 py-2.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4fd4] disabled:opacity-50 text-sm font-medium text-white transition"
          >
            {success ? "✓ Сохранено" : loading ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}