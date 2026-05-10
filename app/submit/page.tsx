"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpgradeError, setIsUpgradeError] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Программирование",
    level: "beginner",
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setIsUpgradeError(false);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "UPGRADE_REQUIRED") {
          setIsUpgradeError(true);
        }
        setError(data.error || "Ошибка при отправке");
      } else {
        router.push("/profile");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition">
          ← Профиль
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Предложить курс</h1>
        <p className="text-gray-400 mb-8">Заполните форму — модератор проверит и опубликует курс</p>

        {error && (
          <div className={`rounded-xl p-4 mb-6 ${isUpgradeError
            ? "bg-yellow-900/20 border border-yellow-500/30 text-yellow-300"
            : "bg-red-900/30 border border-red-500/50 text-red-300"
          }`}>
            <p className="mb-2">{error}</p>
            {isUpgradeError && (
              <Link href="/profile" className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-lg text-sm font-bold text-white transition">
                ⭐ Купить Author Pro
              </Link>
            )}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Название курса *</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
              placeholder="Например: Python для начинающих"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Описание *</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 h-32 resize-none"
              placeholder="Что научится делать студент?"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Цена (₽) *</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                placeholder="2990"
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Категория</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
              >
                {["Программирование", "Маркетинг", "Финансы", "Дизайн", "Бизнес"].map(c => (
                  <option key={c} value={c} className="bg-[#030303]">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Уровень</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              value={form.level}
              onChange={e => setForm({...form, level: e.target.value})}
            >
              <option value="beginner" className="bg-[#030303]">Начинающий</option>
              <option value="intermediate" className="bg-[#030303]">Средний</option>
              <option value="advanced" className="bg-[#030303]">Продвинутый</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.title || !form.price}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition"
          >
            {loading ? "Отправляем..." : "Отправить на проверку →"}
          </button>
        </div>
      </div>
    </main>
  );
}