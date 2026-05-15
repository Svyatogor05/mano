import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import DeleteCourseButton from "@/components/DeleteCourseButton";

const CATEGORY_COLORS: Record<string, { pill: string; orb: string; emoji_filter: string; thumb: string }> = {
  "Программирование": {
    pill: "bg-[#8b7cf8]/25 text-[#c4bbff] border-[#8b7cf8]/40",
    orb: "rgba(124,110,245,0.2)",
    emoji_filter: "drop-shadow(0 0 20px rgba(138,124,248,0.5))",
    thumb: "bg-[#08061a]",
  },
  "Финансы": {
    pill: "bg-[#34d399]/20 text-[#6ee7b7] border-[#34d399]/35",
    orb: "rgba(52,211,153,0.18)",
    emoji_filter: "drop-shadow(0 0 20px rgba(52,211,153,0.4))",
    thumb: "bg-[#030e0c]",
  },
  "Маркетинг": {
    pill: "bg-[#fbbf24]/18 text-[#fcd34d] border-[#fbbf24]/30",
    orb: "rgba(251,191,36,0.15)",
    emoji_filter: "drop-shadow(0 0 20px rgba(251,191,36,0.35))",
    thumb: "bg-[#0c0800]",
  },
  "Дизайн": {
    pill: "bg-[#f472b6]/20 text-[#f9a8d4] border-[#f472b6]/30",
    orb: "rgba(244,114,182,0.15)",
    emoji_filter: "drop-shadow(0 0 20px rgba(244,114,182,0.35))",
    thumb: "bg-[#0e0610]",
  },
  "Бизнес": {
    pill: "bg-[#60a5fa]/20 text-[#93c5fd] border-[#60a5fa]/30",
    orb: "rgba(96,165,250,0.15)",
    emoji_filter: "drop-shadow(0 0 20px rgba(96,165,250,0.35))",
    thumb: "bg-[#04080e]",
  },
};

const DEFAULT_COLOR = {
  pill: "bg-white/10 text-white/50 border-white/15",
  orb: "rgba(138,124,248,0.15)",
  emoji_filter: "drop-shadow(0 0 20px rgba(138,124,248,0.4))",
  thumb: "bg-[#08080f]",
};

const EMOJI: Record<string, string> = {
  "Программирование": "💻",
  "Финансы": "📈",
  "Маркетинг": "🚀",
  "Дизайн": "🎨",
  "Бизнес": "💼",
};

export default async function CoursesPage() {
  const { userId } = await auth();

  let userRole: string | null = null;
  if (userId) {
    const { data: user } = await supabaseAdmin
      .from("users").select("role").eq("clerk_id", userId).single();
    userRole = user?.role ?? null;
  }

  const canDelete = userRole === "owner" || userRole === "admin";

  const { data: courses } = await supabaseAdmin
    .from("courses")
    .select("*, users!courses_teacher_id_fkey(name)")
    .eq("status", "approved")
    .eq("is_published", true);

  return (
    <main className="min-h-screen text-white relative overflow-hidden" style={{ background: "#02020a" }}>

      {/* Звёзды */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 120 }).map((_, i) => {
          const size = Math.random() < 0.6 ? 1 : Math.random() < 0.6 ? 1.5 : 2;
          const opacity = 0.15 + Math.random() * 0.55;
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: size, height: size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity,
              }}
            />
          );
        })}
      </div>

      {/* Навигация */}
      <nav className="flex items-center justify-between px-7 h-[56px] border-b border-white/[0.06] relative z-10" style={{ background: "rgba(2,2,10,0.85)" }}>
        <Link href="/" className="text-[20px] font-medium tracking-tight text-white">
          Mano<span className="inline-block w-[7px] h-[7px] rounded-full bg-[#8b7cf8] ml-[2px] mb-[2px] align-middle" />
        </Link>
        <div className="flex items-center gap-4">
          {userId ? (
            <Link href="/profile" className="text-sm text-white/40 hover:text-white/70 transition">Мой кабинет</Link>
          ) : null}
          <Link href="/submit" className="text-sm text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 px-4 py-1.5 rounded-lg transition">
            Предложить курс
          </Link>
          {!userId ? (
            <Link href="/sign-in" className="text-sm font-medium px-5 py-2 rounded-lg text-white transition" style={{ background: "linear-gradient(135deg,#7c6ef5,#5b4fd4)" }}>
              Войти
            </Link>
          ) : (
            <Link href="/profile" className="w-8 h-8 rounded-full bg-white/10 border border-white/15 hover:border-[#8b7cf8]/50 transition flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-[900px] mx-auto px-7 py-5 relative z-10">

        {/* Pro баннер */}
        <div className="relative rounded-[18px] border border-[#8b7cf8]/40 overflow-hidden mb-3" style={{ background: "#07061a" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(124,110,245,0.15) 0%,transparent 60%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(124,110,245,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,110,245,0.04) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="relative flex items-center justify-between px-6 py-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#c4bbff] bg-[#7c6ef5]/20 border border-[#7c6ef5]/40 rounded-full px-3 py-1 mb-3 tracking-wide">
                <span className="w-[5px] h-[5px] rounded-full bg-[#8b7cf8]" />
                AUTHOR PRO
              </div>
              <h2 className="text-[19px] font-medium text-white mb-1 tracking-tight">Продавай без ограничений</h2>
              <p className="text-sm text-white/40 max-w-md leading-relaxed">Неограниченное количество курсов, приоритет в каталоге и детальная аналитика продаж</p>
            </div>
            <div className="flex items-center gap-5 shrink-0 ml-8">
              <div className="text-right">
                <div className="text-[26px] font-medium text-white tracking-tight leading-none">4 490 ₽</div>
                <div className="text-xs text-white/30 mt-1">в месяц</div>
              </div>
              <Link href="/profile" className="text-sm font-medium px-5 py-2.5 rounded-xl text-white whitespace-nowrap transition" style={{ background: "linear-gradient(135deg,#7c6ef5,#5b4fd4)" }}>
                Подключить →
              </Link>
            </div>
          </div>
        </div>

        {/* Рекламные баннеры */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="relative rounded-[14px] border border-[#34d399]/25 overflow-hidden cursor-pointer group" style={{ background: "#030d0b" }}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: "linear-gradient(to bottom,transparent,#34d399,transparent)" }} />
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-[#34d399]/12 border border-[#34d399]/25 flex items-center justify-center text-xl shrink-0">📈</div>
              <div>
                <div className="text-[11px] font-medium text-[#34d399] mb-1">Финансы · Топ недели</div>
                <div className="text-[13px] font-medium text-white/85 mb-0.5 group-hover:text-white transition">P2P-трейдинг: стабильный доход</div>
                <div className="text-[11px] text-white/30">Проверенные стратегии от практикующего трейдера</div>
              </div>
            </div>
          </div>
          <div className="relative rounded-[14px] border border-[#fbbf24]/20 overflow-hidden cursor-pointer group" style={{ background: "#0c0800" }}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: "linear-gradient(to bottom,transparent,#fbbf24,transparent)" }} />
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex items-center justify-center text-xl shrink-0">🎯</div>
              <div>
                <div className="text-[11px] font-medium text-[#fbbf24] mb-1">Маркетинг · Новинка</div>
                <div className="text-[13px] font-medium text-white/85 mb-0.5 group-hover:text-white transition">Таргет в VK и Telegram Ads</div>
                <div className="text-[11px] text-white/30">Настройка кампаний и аналитика без агентства</div>
              </div>
            </div>
          </div>
        </div>

        {/* Каталог */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-medium text-white">Все курсы</h2>
            <button className="flex items-center gap-2 text-xs text-white/40 border border-white/10 rounded-lg px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.05] transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Направления
            </button>
          </div>
          <span className="text-xs text-white/20">{courses?.length || 0} курсов</span>
        </div>

        {/* Карточки */}
        {!courses || courses.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/[0.06]" style={{ background: "#06060f" }}>
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-lg font-medium text-white mb-2">Курсов пока нет</h2>
            <p className="text-sm text-white/35 mb-6">Станьте первым автором на платформе!</p>
            <Link href="/submit" className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition" style={{ background: "linear-gradient(135deg,#7c6ef5,#5b4fd4)" }}>
              Предложить курс →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 pb-10">
            {courses.map((course) => {
              const colors = CATEGORY_COLORS[course.category] || DEFAULT_COLOR;
              const emoji = EMOJI[course.category] || "📚";
              const authorName = (course.users as any)?.name || "Автор";
              const initials = authorName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

              return (
                <div key={course.id} className="relative group">
                  {canDelete && <DeleteCourseButton courseId={course.id} />}
                  <Link
                    href={`/courses/${course.id}`}
                    className="block rounded-[20px] overflow-hidden border border-white/[0.08] hover:border-[#8b7cf8]/50 transition-all duration-250 hover:-translate-y-1"
                    style={{ background: "#06060f" }}
                  >
                    {/* Обложка */}
                    <div className={`h-[190px] ${colors.thumb} relative overflow-hidden flex items-end p-3.5`}>
                      {/* Сетка */}
                      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
                      {/* Туманность */}
                      <div className="absolute rounded-full pointer-events-none" style={{ width: 160, height: 160, top: -50, right: -40, background: `radial-gradient(circle,${colors.orb},transparent 70%)` }} />
                      <div className="absolute rounded-full pointer-events-none" style={{ width: 70, height: 70, bottom: -5, left: 10, background: `radial-gradient(circle,${colors.orb.replace("0.", "0.0")},transparent 70%)` }} />
                      {/* Эмодзи */}
                      <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-62%)", fontSize: 52, lineHeight: 1, filter: colors.emoji_filter }}>
                        {emoji}
                      </div>
                      {/* Категория */}
                      <span className={`relative text-[11px] font-medium px-2.5 py-1 rounded-[8px] border ${colors.pill}`}>
                        {course.category}
                      </span>
                    </div>

                    {/* Тело */}
                    <div className="px-[18px] py-4">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-semibold ${colors.pill.split(" ").slice(0, 2).join(" ")}`}>
                          {initials}
                        </div>
                        <span className="text-xs text-white/30">{authorName}</span>
                      </div>
                      <h3 className="text-[15px] font-medium text-white/92 leading-snug mb-1.5 group-hover:text-white transition tracking-tight">
                        {course.title}
                      </h3>
                      <p className="text-xs text-white/28 leading-relaxed mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-white/22 border border-white/[0.08] rounded-[5px] px-1.5 py-0.5">{course.level}</span>
                        <span className="text-[19px] font-medium text-white tracking-tight">
                          {Number(course.price).toLocaleString("ru")} <span className="text-xs text-white/30 font-normal">₽</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}