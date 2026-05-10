"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpgradeError, setIsUpgradeError] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    description: "",
    full_description: "",
    price: "",
    category: "Программирование",
    level: "beginner",
    course_url: "",
    telegram_url: "",
    promo_video_url: "",
    what_you_learn: "",
    requirements: "",
    certificate: "",
    has_certificate: false,
    duration: "",
    lessons_count: "",
    language: "Русский",
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
        if (data.code === "UPGRADE_REQUIRED") setIsUpgradeError(true);
        setError(data.error || "Ошибка при отправке");
        setStep(1);
      } else {
        router.push("/profile");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = form.title && form.description && form.price && form.category;
  const isStep2Valid = form.course_url && form.what_you_learn;

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition">← Профиль</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Предложить курс</h1>
          <p className="text-gray-400">Заполните все поля честно — модератор проверит каждый пункт</p>
        </div>

        {/* Инструкция */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-5 mb-8">
          <h3 className="font-bold text-blue-300 mb-2">📋 Инструкция по заполнению</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>✓ Указывайте только то, что реально есть в курсе</li>
            <li>✓ Прикрепите ссылку на курс или Telegram-канал для проверки</li>
            <li>✓ Если есть сертификат — опишите какой именно</li>
            <li>✓ Если сертификата нет — не пишите про него</li>
            <li>✓ Модератор проверит соответствие описания и реального содержания</li>
            <li>⚠️ За ложную информацию курс будет отклонён и аккаунт заблокирован</li>
          </ul>
        </div>

        {/* Шаги */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                step >= s ? "bg-purple-600 text-white" : "bg-white/10 text-gray-500"
              }`}>{s}</div>
              <span className={`text-sm ${step >= s ? "text-white" : "text-gray-500"}`}>
                {s === 1 ? "Основное" : s === 2 ? "Содержание" : "Доп. информация"}
              </span>
              {s < 3 && <div className={`w-12 h-px ${step > s ? "bg-purple-600" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className={`rounded-xl p-4 mb-6 ${isUpgradeError
            ? "bg-yellow-900/20 border border-yellow-500/30 text-yellow-300"
            : "bg-red-900/30 border border-red-500/50 text-red-300"
          }`}>
            <p className="mb-2">{error}</p>
            {isUpgradeError && (
              <Link href="/profile" className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg text-sm font-bold text-white transition">
                ⭐ Купить Author Pro
              </Link>
            )}
          </div>
        )}

        {/* Шаг 1 — Основная информация */}
        {step === 1 && (
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
              <label className="block text-sm text-gray-400 mb-2">Краткое описание * <span className="text-gray-600">(для карточки курса)</span></label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 h-24 resize-none"
                placeholder="1-2 предложения о курсе. Что получит студент?"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Полное описание курса *</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 h-40 resize-none"
                placeholder="Подробно расскажите о курсе: о чём он, как проходит обучение, какой формат, что входит..."
                value={form.full_description}
                onChange={e => setForm({...form, full_description: e.target.value})}
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
                <label className="block text-sm text-gray-400 mb-2">Категория *</label>
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

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm text-gray-400 mb-2">Язык курса</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  value={form.language}
                  onChange={e => setForm({...form, language: e.target.value})}
                >
                  {["Русский", "Английский", "Казахский", "Украинский"].map(l => (
                    <option key={l} value={l} className="bg-[#030303]">{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition"
            >
              Далее →
            </button>
          </div>
        )}

        {/* Шаг 2 — Содержание */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Ссылка на курс * <span className="text-gray-600">(сайт, платформа, Telegram и т.д.)</span></label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                placeholder="https://..."
                value={form.course_url}
                onChange={e => setForm({...form, course_url: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ссылка на Telegram-канал <span className="text-gray-600">(если курс в Telegram)</span></label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                placeholder="https://t.me/..."
                value={form.telegram_url}
                onChange={e => setForm({...form, telegram_url: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ссылка на промо-видео <span className="text-gray-600">(YouTube, Vimeo — будет на карточке)</span></label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                placeholder="https://youtube.com/..."
                value={form.promo_video_url}
                onChange={e => setForm({...form, promo_video_url: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Чему научится студент * <span className="text-gray-600">(каждый пункт с новой строки)</span></label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 h-32 resize-none"
                placeholder={"Работать с Python\nСоздавать веб-приложения\nПисать чистый код"}
                value={form.what_you_learn}
                onChange={e => setForm({...form, what_you_learn: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Требования к студенту <span className="text-gray-600">(каждый пункт с новой строки)</span></label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 h-24 resize-none"
                placeholder={"Базовые знания математики\nКомпьютер с интернетом"}
                value={form.requirements}
                onChange={e => setForm({...form, requirements: e.target.value})}
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="px-6 py-4 bg-white/10 hover:bg-white/15 rounded-xl font-semibold transition">
                ← Назад
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
                className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition"
              >
                Далее →
              </button>
            </div>
          </div>
        )}

        {/* Шаг 3 — Доп. информация */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Длительность курса</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  placeholder="Например: 20 часов"
                  value={form.duration}
                  onChange={e => setForm({...form, duration: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Количество уроков</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  placeholder="Например: 45"
                  value={form.lessons_count}
                  onChange={e => setForm({...form, lessons_count: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <div
                  onClick={() => setForm({...form, has_certificate: !form.has_certificate})}
                  className={`w-12 h-6 rounded-full transition relative ${form.has_certificate ? "bg-purple-600" : "bg-white/20"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.has_certificate ? "left-7" : "left-1"}`} />
                </div>
                <span className="text-sm text-gray-300">Курс выдаёт сертификат</span>
              </label>
              {form.has_certificate && (
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  placeholder="Опишите сертификат: какой, от кого, признаётся ли работодателями"
                  value={form.certificate}
                  onChange={e => setForm({...form, certificate: e.target.value})}
                />
              )}
            </div>

            {/* Превью карточки */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm text-gray-400 mb-4">👁 Превью карточки курса</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center">
                  {form.promo_video_url ? (
                    <span className="text-sm text-gray-400">🎬 Видео будет здесь</span>
                  ) : (
                    <span className="text-4xl">📚</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full">{form.category}</span>
                    <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{form.level === "beginner" ? "Начинающий" : form.level === "intermediate" ? "Средний" : "Продвинутый"}</span>
                  </div>
                  <h3 className="font-bold mb-1">{form.title || "Название курса"}</h3>
                  <p className="text-gray-500 text-xs mb-2">{form.description || "Описание курса"}</p>
                  <div className="text-xl font-bold">{form.price ? `${Number(form.price).toLocaleString("ru")} ₽` : "—"}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="px-6 py-4 bg-white/10 hover:bg-white/15 rounded-xl font-semibold transition">
                ← Назад
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition"
              >
                {loading ? "Отправляем..." : "Отправить на проверку →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}