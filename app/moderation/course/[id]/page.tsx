import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export default async function CourseReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: currentUser } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("clerk_id", userId)
    .single();

  if (!currentUser || !["moderator", "admin", "owner"].includes(currentUser.role)) {
    redirect("/profile");
  }

  const { data: course } = await supabaseAdmin
    .from("courses")
    .select("*, users!courses_teacher_id_fkey(name, email, role)")
    .eq("id", id)
    .single();

  if (!course) {
    return (
      <div className="min-h-screen bg-[#08080f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium mb-2">Курс не найден</h1>
          <Link href="/moderation" className="text-sm text-[#a89cf7]">← Назад</Link>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "На проверке", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20" },
    approved: { label: "Одобрен", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
    rejected: { label: "Отклонён", color: "bg-red-500/10 text-red-300 border-red-500/20" },
  };

  return (
    <main className="min-h-screen bg-[#08080f] text-white">
      <nav className="flex items-center justify-between px-7 h-[58px] border-b border-white/[0.06]">
        <Link href="/" className="text-[20px] font-medium tracking-tight text-white">
          Mano<span className="inline-block w-[6px] h-[6px] rounded-full bg-[#6c5ce7] ml-[2px] mb-[2px] align-middle" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/moderation" className="text-sm text-white/35 hover:text-white/60 transition">
            ← Панель модерации
          </Link>
          <UserButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-7 py-8">

        {/* Шапка */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs px-2.5 py-1 rounded-md border ${statusConfig[course.status]?.color}`}>
                {statusConfig[course.status]?.label}
              </span>
              <span className="text-xs text-white/30">
                {new Date(course.created_at).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-2xl font-medium text-white mb-1">{course.title}</h1>
            <p className="text-sm text-white/40">
              Автор: <span className="text-white/70">{(course.users as any)?.name}</span>
              {" · "}{(course.users as any)?.email}
            </p>
          </div>
          <div className="text-2xl font-medium text-[#a89cf7]">
            {Number(course.price).toLocaleString("ru")} ₽
          </div>
        </div>

        {/* Метаданные */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Категория", value: course.category },
            { label: "Уровень", value: course.level === "beginner" ? "Начинающий" : course.level === "intermediate" ? "Средний" : "Продвинутый" },
            { label: "Язык", value: course.language || "Русский" },
            ...(course.duration ? [{ label: "Длительность", value: course.duration }] : []),
            ...(course.lessons_count ? [{ label: "Уроков", value: course.lessons_count }] : []),
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/[0.07] bg-[#10101a] p-4">
              <div className="text-xs text-white/30 mb-1">{item.label}</div>
              <div className="text-sm font-medium text-white">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Ссылки */}
        <div className="rounded-2xl border border-[#6c5ce7]/20 bg-[#6c5ce7]/[0.05] p-5 mb-5">
          <h2 className="text-sm font-medium text-[#a89cf7] mb-4">Ссылки для проверки</h2>
          <div className="flex flex-col gap-3">
            {course.course_url && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/35">Ссылка на курс</span>
                <a href={course.course_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#a89cf7] hover:text-white underline break-all">{course.course_url}</a>
              </div>
            )}
            {course.telegram_url && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/35">Telegram-канал</span>
                <a href={course.telegram_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#a89cf7] hover:text-white underline">{course.telegram_url}</a>
              </div>
            )}
            {course.promo_video_url && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/35">Промо-видео</span>
                <a href={course.promo_video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#a89cf7] hover:text-white underline">{course.promo_video_url}</a>
              </div>
            )}
            {!course.course_url && !course.telegram_url && !course.promo_video_url && (
              <p className="text-xs text-yellow-300">⚠️ Автор не указал ссылки</p>
            )}
          </div>
        </div>

        {/* Описания */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="rounded-2xl border border-white/[0.07] bg-[#10101a] p-5">
            <h2 className="text-sm font-medium text-white mb-3">Краткое описание</h2>
            <p className="text-sm text-white/50 leading-relaxed">{course.description}</p>
          </div>

          {course.full_description && (
            <div className="rounded-2xl border border-white/[0.07] bg-[#10101a] p-5">
              <h2 className="text-sm font-medium text-white mb-3">Полное описание</h2>
              <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">{course.full_description}</p>
            </div>
          )}

          {course.what_you_learn && (
            <div className="rounded-2xl border border-white/[0.07] bg-[#10101a] p-5">
              <h2 className="text-sm font-medium text-white mb-3">Чему научится студент</h2>
              <div className="flex flex-col gap-2">
                {course.what_you_learn.split("\n").filter(Boolean).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-white/50">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {course.requirements && (
            <div className="rounded-2xl border border-white/[0.07] bg-[#10101a] p-5">
              <h2 className="text-sm font-medium text-white mb-3">Требования</h2>
              <div className="flex flex-col gap-2">
                {course.requirements.split("\n").filter(Boolean).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-white/50">
                    <span className="text-amber-400 mt-0.5 shrink-0">•</span>{item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Кнопки модерации */}
        {course.status === "pending" && (
          <div className="rounded-2xl border border-white/[0.07] bg-[#10101a] p-5">
            <h2 className="text-sm font-medium text-white mb-4">Решение модератора</h2>
            <div className="flex gap-4">
              <form action="/api/moderation/approve" method="POST" className="flex-1">
                <input type="hidden" name="courseId" value={course.id} />
                <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-medium transition">
                  ✓ Одобрить курс
                </button>
              </form>
              <form action="/api/moderation/reject" method="POST" className="flex-1">
                <input type="hidden" name="courseId" value={course.id} />
                <input name="reason" className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 text-sm mb-3" placeholder="Причина отклонения (необязательно)" />
                <button type="submit" className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-sm font-medium transition">
                  ✗ Отклонить курс
                </button>
              </form>
            </div>
          </div>
        )}

        {course.status !== "pending" && (
          <div className={`rounded-2xl p-5 border ${course.status === "approved" ? "bg-emerald-500/[0.07] border-emerald-500/20" : "bg-red-500/[0.07] border-red-500/20"}`}>
            <p className="text-sm font-medium ${course.status === 'approved' ? 'text-emerald-300' : 'text-red-300'}">
              {course.status === "approved" ? "✓ Курс одобрен" : "✗ Курс отклонён"}
            </p>
            {course.rejection_reason && (
              <p className="text-xs text-white/40 mt-1">Причина: {course.rejection_reason}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}