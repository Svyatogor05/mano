import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; thumb: string }> = {
  "Программирование": {
    bg: "bg-purple-600/20", text: "text-purple-300", border: "border-purple-500/25",
    thumb: "from-[#1c1540] to-[#0d0c1f]"
  },
  "Финансы": {
    bg: "bg-emerald-600/20", text: "text-emerald-300", border: "border-emerald-500/25",
    thumb: "from-[#0b1e1b] to-[#08080f]"
  },
  "Маркетинг": {
    bg: "bg-amber-600/20", text: "text-amber-300", border: "border-amber-500/25",
    thumb: "from-[#1a1205] to-[#08080f]"
  },
  "Дизайн": {
    bg: "bg-pink-600/20", text: "text-pink-300", border: "border-pink-500/25",
    thumb: "from-[#1e0f1a] to-[#08080f]"
  },
  "Бизнес": {
    bg: "bg-blue-600/20", text: "text-blue-300", border: "border-blue-500/25",
    thumb: "from-[#0c1520] to-[#08080f]"
  },
};

const DEFAULT_COLOR = {
  bg: "bg-white/10", text: "text-gray-300", border: "border-white/10",
  thumb: "from-[#151520] to-[#08080f]"
};

export default async function CoursesPage() {
  const { userId } = await auth();

  const { data: courses } = await supabaseAdmin
    .from("courses")
    .select("*, users!courses_teacher_id_fkey(name)")
    .eq("status", "approved")
    .eq("is_published", true);

  return (
    <main className="min-h-screen bg-[#08080f] text-white">

      {/* Навигация */}
      <nav className="flex items-center justify-between px-7 h-[58px] border-b border-white/[0.06]">
        <Link href="/" className="text-[22px] font-medium tracking-tight text-white">
          Mano<span className="inline-block w-[7px] h-[7px] rounded-full bg-[#6c5ce7] ml-[3px] mb-[3px] align-middle" />
        </Link>
        <div className="flex items-center gap-4">
          {userId ? (
            <Link href="/profile" className="text-sm text-white/40 hover:text-white/70 transition">
              Мой кабинет
            </Link>
          ) : null}
          {!userId ? (
            <Link href="/sign-in" className="text-sm font-medium px-5 py-2 rounded-lg bg-[#6c5ce7] hover:bg-[#5b4fd4] text-white transition">
              Войти
            </Link>
          ) : (
            <Link href="/profile" className="w-8 h-8 rounded-full bg-white/10 border border-white/15 hover:border-purple-500/40 transition flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-7">

        {/* Баннеры */}
        <div className="flex flex-col gap-3 py-6">

          {/* Author Pro баннер */}
          <div className="relative rounded-2xl border border-[#6c5ce7]/30 bg-[#0e0c1e] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(108,92,231,0.18),transparent_65%)]" />
            <div className="relative flex items-center justify-between px-7 py-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#a89cf7] bg-[#6c5ce7]/15 border border-[#6c5ce7]/30 rounded-full px-3 py-1 mb-3">
                  <span className="w-[5px] h-[5px] rounded-full bg-[#a89cf7]" />
                  Подписка
                </div>
                <h2 className="text-xl font-medium text-white mb-1">Author Pro — продавай без ограничений</h2>
                <p className="text-sm text-white/40 max-w-lg leading-relaxed">
                  Неограниченное количество курсов, приоритет в каталоге и расширенная аналитика продаж
                </p>
              </div>
              <div className="flex items-center gap-5 shrink-0 ml-8">
                <div className="text-right">
                  <div className="text-[28px] font-medium text-white leading-none">4 490 ₽</div>
                  <div className="text-xs text-white/35 mt-1">в месяц</div>
                </div>
                <Link href="/profile" className="text-sm font-medium px-5 py-2.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4fd4] text-white transition whitespace-nowrap">
                  Подключить →
                </Link>
              </div>
            </div>
          </div>

          {/* Два рекламных баннера */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative rounded-2xl border border-emerald-500/20 bg-[#0a0f0e] overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(29,158,117,0.12),transparent_60%)]" />
              <div className="relative flex items-center gap-4 px-5 py-5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl shrink-0">
                  📈
                </div>
                <div>
                  <div className="text-[11px] text-emerald-400 mb-1">Финансы · Топ недели</div>
                  <div className="text-sm font-medium text-white/85 mb-1 group-hover:text-white transition">P2P-трейдинг: стабильный доход</div>
                  <div className="text-xs text-white/30 leading-relaxed">Проверенные стратегии от практикующего трейдера</div>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl border border-amber-500/20 bg-[#0f0d09] overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(186,117,23,0.10),transparent_60%)]" />
              <div className="relative flex items-center gap-4 px-5 py-5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shrink-0">
                  🎯
                </div>
                <div>
                  <div className="text-[11px] text-amber-400 mb-1">Маркетинг · Новинка</div>
                  <div className="text-sm font-medium text-white/85 mb-1 group-hover:text-white transition">Таргет в VK и Telegram Ads</div>
                  <div className="text-xs text-white/30 leading-relaxed">Настройка кампаний и аналитика без агентства</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Заголовок каталога */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-medium text-white">Все курсы</h2>
            <button className="flex items-center gap-2 text-xs text-white/50 border border-white/10 rounded-lg px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Направления
            </button>
          </div>
          <span className="text-xs text-white/25">{courses?.length || 0} курсов</span>
        </div>

        {/* Карточки */}
        {!courses || courses.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-medium mb-2">Курсов пока нет</h2>
            <p className="text-white/40 text-sm mb-6">Станьте первым автором на платформе!</p>
            <Link href="/submit" className="px-6 py-3 bg-[#6c5ce7] hover:bg-[#5b4fd4] rounded-xl text-sm font-medium transition">
              Предложить курс →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 pb-12">
            {courses.map((course) => {
              const colors = CATEGORY_COLORS[course.category] || DEFAULT_COLOR;
              const authorName = (course.users as any)?.name || "Автор";
              const initials = authorName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group block rounded-2xl overflow-hidden border border-white/[0.07] bg-[#10101a] hover:border-[#6c5ce7]/35 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Обложка */}
                  <div className={`h-[150px] bg-gradient-to-br ${colors.thumb} relative flex items-end p-3`}>
                    <div className="absolute inset-0 flex items-center justify-center text-[42px] leading-none" style={{paddingBottom: "20px"}}>
                      {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover absolute inset-0" />
                      ) : "📚"}
                    </div>
                    <span className={`relative text-[11px] font-medium px-2.5 py-1 rounded-md ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {course.category}
                    </span>
                  </div>

                  {/* Контент */}
                  <div className="p-4">
                    {/* Автор */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium ${colors.bg} ${colors.text}`}>
                        {initials}
                      </div>
                      <span className="text-xs text-white/30">{authorName}</span>
                    </div>

                    <h3 className="text-[15px] font-medium text-white/90 leading-snug mb-1.5 group-hover:text-white transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-white/30 leading-relaxed mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/25 border border-white/[0.08] rounded px-1.5 py-0.5">
                        {course.level}
                      </span>
                      <span className="text-lg font-medium text-white">
                        {Number(course.price).toLocaleString("ru")} <span className="text-sm text-white/35 font-normal">₽</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}