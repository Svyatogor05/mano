import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: course, error } = await supabaseAdmin
    .from("courses")
    .select("*, users!courses_teacher_id_fkey(name)")
    .eq("id", id)
    .single();

  if (!course || error) {
    return (
      <div className="min-h-screen bg-[#08080f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-2">Курс не найден</h1>
          <Link href="/" className="mt-4 inline-block text-[#a89cf7] text-sm">← Назад в каталог</Link>
        </div>
      </div>
    );
  }

  // Проверяем куплен ли курс
  let hasPurchased = false;
  if (userId) {
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (dbUser) {
      const { data: purchase } = await supabaseAdmin
        .from("purchases")
        .select("id")
        .eq("user_id", dbUser.id)
        .eq("course_id", id)
        .single();

      hasPurchased = !!purchase;
    }
  }

  const levelLabels: Record<string, string> = {
    beginner: "Начинающий",
    intermediate: "Средний",
    advanced: "Продвинутый",
  };

  const whatYouLearn = course.what_you_learn?.split("\n").filter(Boolean) || [];
  const requirements = course.requirements?.split("\n").filter(Boolean) || [];
  const authorName = (course.users as any)?.name || "Автор";
  const initials = authorName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <main className="min-h-screen bg-[#08080f] text-white">

      {/* Навигация */}
      <nav className="flex items-center justify-between px-7 h-[58px] border-b border-white/[0.06]">
        <Link href="/" className="text-[20px] font-medium tracking-tight text-white">
          Mano<span className="inline-block w-[6px] h-[6px] rounded-full bg-[#6c5ce7] ml-[2px] mb-[2px] align-middle" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-white/35 hover:text-white/60 transition">← Каталог</Link>
          {userId ? (
            <>
              <Link href="/profile" className="text-sm text-white/40 hover:text-white/70 transition">Мой кабинет</Link>
              <UserButton />
            </>
          ) : (
            <Link href="/sign-in" className="text-sm font-medium px-5 py-2 rounded-lg bg-[#6c5ce7] hover:bg-[#5b4fd4] text-white transition">
              Войти
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-[#1c1540] via-[#0d0c1f] to-[#08080f] flex items-end">
        <div className="absolute inset-0 flex items-center justify-center text-[80px] opacity-30 select-none">📚</div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08080f]" />
        <div className="relative px-7 pb-6 w-full">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#6c5ce7]/20 text-[#a89cf7] border border-[#6c5ce7]/25">
              {course.category}
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.06] text-white/40 border border-white/10">
              {levelLabels[course.level] || course.level}
            </span>
          </div>
          <h1 className="text-2xl font-medium text-white leading-snug max-w-[600px]">{course.title}</h1>
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-5xl mx-auto px-7 py-5 grid grid-cols-3 gap-5 items-start">

        {/* Левая колонка */}
        <div className="col-span-2 flex flex-col gap-4">

          {course.description && (
            <p className="text-sm text-white/45 leading-relaxed">{course.description}</p>
          )}

          {/* Автор */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#10101a] p-5">
            <h2 className="text-sm font-medium text-white mb-4">Автор курса</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6c5ce7]/20 border border-[#6c5ce7]/30 flex items-center justify-center text-sm font-medium text-[#a89cf7]">
                {initials}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{authorName}</div>
                <div className="text-xs text-white/35 mt-0.5">Автор курса</div>
              </div>
            </div>
          </div>

          {/* О курсе */}
          {course.full_description && (
            <div className="rounded-2xl border border-white/[0.07] bg-[#10101a] p-5">
              <h2 className="text-sm font-medium text-white mb-3">О курсе</h2>
              <p className="text-sm text-white/45 leading-relaxed whitespace-pre-line">{course.full_description}</p>
            </div>
          )}

          {/* Чему научитесь */}
          {whatYouLearn.length > 0 && (
            <div className="rounded-2xl border border-white/[0.07] bg-[#10101a] p-5">
              <h2 className="text-sm font-medium text-white mb-4">Чему вы научитесь</h2>
              <div className="grid grid-cols-2 gap-3">
                {whatYouLearn.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 text-xs mt-0.5 shrink-0">✓</span>
                    <span className="text-sm text-white/50 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Требования */}
          {requirements.length > 0 && (
            <div className="rounded-2xl border border-white/[0.07] bg-[#10101a] p-5">
              <h2 className="text-sm font-medium text-white mb-4">Требования</h2>
              <div className="flex flex-col gap-2.5">
                {requirements.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-white/50">
                    <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Правая карточка */}
        <div className="col-span-1 sticky top-5 rounded-2xl border border-white/[0.08] bg-[#10101a] overflow-hidden">
          <div className="h-[120px] bg-gradient-to-br from-[#1c1540] to-[#0d0c1f] flex items-center justify-center text-5xl">
            📚
          </div>
          <div className="p-5">
            <div className="text-[28px] font-medium text-white leading-none mb-1">
              {Number(course.price).toLocaleString("ru")} <span className="text-sm text-white/35 font-normal">₽</span>
            </div>
            <div className="text-xs text-white/30 mb-4">единоразовый платёж</div>

            {!userId ? (
              <Link href="/sign-in" className="block w-full text-center py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4fd4] text-sm font-medium text-white transition mb-3">
                Войдите чтобы купить
              </Link>
            ) : hasPurchased ? (
              <div className="mb-3 space-y-2">
                <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-center">
                  ✓ Курс куплен
                </div>
                {course.course_url && (
                  <a href={course.course_url} target="_blank" rel="noopener noreferrer"
                    className="block w-full text-center py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4fd4] text-sm font-medium text-white transition">
                    Перейти к курсу →
                  </a>
                )}
              </div>
            ) : (
              <Link href={`/courses/${course.id}/checkout`} className="block w-full text-center py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4fd4] text-sm font-medium text-white transition mb-3">
                Купить курс →
              </Link>
            )}

            {course.telegram_url && hasPurchased && (
              <a href={course.telegram_url} target="_blank" rel="noopener noreferrer"
                className="block w-full text-center py-2.5 rounded-xl bg-transparent border border-white/10 hover:bg-white/[0.05] text-sm text-white/50 transition mb-3">
                📱 Telegram-канал курса
              </a>
            )}

            {(course.duration || course.language) && (
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-2.5">
                {course.language && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/30">Язык</span>
                    <span className="text-xs text-white/65">{course.language}</span>
                  </div>
                )}
                {course.duration && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/30">Длительность</span>
                    <span className="text-xs text-white/65">{course.duration}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}