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
    duration: "",
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

  const isStep1Valid = form.title && form.description && form.price;
  const isStep2Valid = form.course_url && form.what_you_learn;

  const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-white placeholder-white/20 focus:outline-none focus:border-[#6c5ce7]/50 transition";
const labelClass = "text-sm text-white/50 mb-2 block font-medium";

  return (
    <main className="min-h-screen bg-[#08080f] text-white">
      <nav className="flex items-center justify-between px-7 h-[58px] border-b border-white/[0.06]">
        <Link href="/" className="text-[20px] font-medium tracking-tight text-white">
          Mano<span className="inline-block w-[6px] h-[6px] rounded-full bg-[#6c5ce7] ml-[2px] mb-[2px] align-middle" />
        </Link>
        <Link href="/profile" className="text-sm text-white/35 hover:text-white/60 transition">← Профиль</Link>
      </nav>

      <div className="max-w-xl mx-auto px-7 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-medium text-white mb-1">Предложить курс</h1>
          <p className="text-sm text-white/40">Модератор проверит каждый пункт — указывайте только реальную информацию</p>
        </div>

        {/* Шаги */}
        <div className="flex items-center gap-1 mb-8 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
          {[
            { n: 1, label: "Основное" },
            { n: 2, label: "Содержание" },
            { n: 3, label: "Детали" },
          ].map(s => (
            <div key={s.n} className={`flex-1 text-center py-2 rounded-lg text-xs font-medium transition ${
              step === s.n ? "bg-[#6c5ce7] text-white" : step > s.n ? "text-[#a89cf7]" : "text-white/30"
            }`}>
              {s.n} · {s.label}
            </div>
          ))}
        </div>

        {error && (
          <div className={`rounded-xl p-4 mb-5 text-sm ${isUpgradeError
            ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-300"
            : "bg-red-500/10 border border-red-500/20 text-red-300"
          }`}>
            <p className="mb-2">{error}</p>
            {isUpgradeError && (
              <Link href="/profile" className="inline-block mt-1 px-4 py-2 bg-yellow-500/15 border border-yellow-500/25 rounded-lg text-xs font-medium text-yellow-300 transition">
                ⭐ Купить Author Pro
              </Link>
            )}
          </div>
        )}

        {/* Шаг 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Название курса <span className="text-[#6c5ce7]">*</span></label>
              <input className={inputClass} placeholder="Например: Python для начинающих" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Краткое описание <span className="text-[#6c5ce7]">*</span> <span className="text-white/20">— для карточки курса</span></label>
              <textarea className={`${inputClass} h-20 resize-none`} placeholder="1–2 предложения. Что получит студент?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Полное описание <span className="text-[#6c5ce7]">*</span></label>
              <textarea className={`${inputClass} h-28 resize-none`} placeholder="Подробно расскажите о курсе: формат, что входит, как проходит обучение..." value={form.full_description} onChange={e => setForm({...form, full_description: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Цена (₽) <span className="text-[#6c5ce7]">*</span></label>
              <input type="number" className={inputClass} placeholder="2990" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex gap-3 items-start">
              <span className="text-[#a89cf7] text-sm mt-0.5 shrink-0">ℹ</span>
              <p className="text-xs text-white/30 leading-relaxed">Указывайте только то что реально есть в курсе. За ложную информацию курс будет отклонён и аккаунт заблокирован.</p>
            </div>

            <button onClick={() => setStep(2)} disabled={!isStep1Valid} className="w-full py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4fd4] disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition">
              Далее →
            </button>
          </div>
        )}

        {/* Шаг 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Ссылка на курс <span className="text-[#6c5ce7]">*</span> <span className="text-white/20">— сайт, платформа, Telegram</span></label>
              <input className={inputClass} placeholder="https://..." value={form.course_url} onChange={e => setForm({...form, course_url: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Ссылка на Telegram-канал <span className="text-white/20">— если курс в Telegram</span></label>
              <input className={inputClass} placeholder="https://t.me/..." value={form.telegram_url} onChange={e => setForm({...form, telegram_url: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Ссылка на промо-видео <span className="text-white/20">— YouTube, Vimeo</span></label>
              <input className={inputClass} placeholder="https://youtube.com/..." value={form.promo_video_url} onChange={e => setForm({...form, promo_video_url: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Чему научится студент <span className="text-[#6c5ce7]">*</span> <span className="text-white/20">— каждый пункт с новой строки</span></label>
              <textarea className={`${inputClass} h-28 resize-none`} placeholder={"Работать с Python\nСоздавать веб-приложения\nПисать чистый код"} value={form.what_you_learn} onChange={e => setForm({...form, what_you_learn: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Требования к студенту <span className="text-white/20">— каждый пункт с новой строки</span></label>
              <textarea className={`${inputClass} h-20 resize-none`} placeholder={"Базовые знания математики\nКомпьютер с интернетом"} value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-white/[0.08] text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.03] transition">← Назад</button>
              <button onClick={() => setStep(3)} disabled={!isStep2Valid} className="flex-1 py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4fd4] disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition">Далее →</button>
            </div>
          </div>
        )}

        {/* Шаг 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Длительность курса <span className="text-white/20">— необязательно</span></label>
              <input className={inputClass} placeholder="Например: 20 часов" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
            </div>

            {/* Превью карточки */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="text-xs text-white/30 mb-3">Превью карточки</div>
              <div className="rounded-xl border border-white/[0.07] bg-[#10101a] overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-[#1c1540] to-[#0d0c1f] flex items-center justify-center text-3xl">📚</div>
                <div className="p-3">
                  <div className="text-sm font-medium text-white mb-1">{form.title || "Название курса"}</div>
                  <div className="text-xs text-white/30 mb-2 line-clamp-2">{form.description || "Описание курса"}</div>
                  <div className="text-base font-medium text-white">{form.price ? `${Number(form.price).toLocaleString("ru")} ₽` : "—"}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-5 py-3 rounded-xl border border-white/[0.08] text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.03] transition">← Назад</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4fd4] disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition">
                {loading ? "Отправляем..." : "Отправить на проверку →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}