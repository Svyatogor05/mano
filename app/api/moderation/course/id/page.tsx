import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export default async function CourseReviewPage({ params }: { params: { id: string } }) {
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
    .eq("id", params.id)
    .single();

  if (!course) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div>
        <h1>Курс не найден</h1>
        <p>ID: {params.id}</p>
      </div>
    </div>
  );
}

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "На проверке", color: "bg-yellow-600/20 text-yellow-300 border-yellow-500/20" },
    approved: { label: "Одобрен", color: "bg-green-600/20 text-green-300 border-green-500/20" },
    rejected: { label: "Отклонён", color: "bg-red-600/20 text-red-300 border-red-500/20" },
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/moderation" className="text-sm text-gray-400 hover:text-white transition">
            ← Панель модерации
          </Link>
          <UserButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Шапка */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs px-3 py-1 rounded-full border ${statusConfig[course.status]?.color}`}>
                {statusConfig[course.status]?.label}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(course.created_at).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-1">{course.title}</h1>
            <p className="text-gray-400">
              Автор: <span className="text-white">{(course.users as any)?.name}</span>
              {" · "}{(course.users as any)?.email}
            </p>
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {Number(course.price).toLocaleString("ru")} ₽
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">Категория</div>
            <div className="font-medium">{course.category}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">Уровень</div>
            <div className="font-medium">
              {course.level === "beginner" ? "Начинающий" : course.level === "intermediate" ? "Средний" : "Продвинутый"}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">Язык</div>
            <div className="font-medium">{course.language || "Русский"}</div>
          </div>
          {course.duration && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Длительность</div>
              <div className="font-medium">{course.duration}</div>
            </div>
          )}
          {course.lessons_count && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Уроков</div>
              <div className="font-medium">{course.lessons_count}</div>
            </div>
          )}
          {course.certificate && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Сертификат</div>
              <div className="font-medium text-green-300">✓ Есть</div>
            </div>
          )}
        </div>

        {/* Ссылки для проверки */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-blue-300 mb-4">🔗 Ссылки для проверки</h2>
          <div className="space-y-3">
            {course.course_url && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Ссылка на курс:</span>
                <a href={course.course_url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 underline break-all">
                  {course.course_url}
                </a>
              </div>
            )}
            {course.telegram_url && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Telegram-канал:</span>
                <a href={course.telegram_url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 underline">
                  {course.telegram_url}
                </a>
              </div>
            )}
            {course.promo_video_url && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Промо-видео:</span>
                <a href={course.promo_video_url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 underline">
                  {course.promo_video_url}
                </a>
              </div>
            )}
            {!course.course_url && !course.telegram_url && !course.promo_video_url && (
              <p className="text-yellow-300 text-sm">⚠️ Автор не указал ссылки</p>
            )}
          </div>
        </div>

        {/* Описания */}
        <div className="space-y-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold mb-3">Краткое описание</h2>
            <p className="text-gray-300 leading-relaxed">{course.description}</p>
          </div>

          {course.full_description && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold mb-3">Полное описание</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{course.full_description}</p>
            </div>
          )}

          {course.what_you_learn && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold mb-3">Чему научится студент</h2>
              <ul className="space-y-2">
                {course.what_you_learn.split("\n").filter(Boolean).map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.requirements && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold mb-3">Требования</h2>
              <ul className="space-y-2">
                {course.requirements.split("\n").filter(Boolean).map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.certificate && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6">
              <h2 className="font-bold mb-3 text-green-300">🎓 Сертификат</h2>
              <p className="text-gray-300">{course.certificate}</p>
            </div>
          )}
        </div>

        {/* Кнопки модерации */}
        {course.status === "pending" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold mb-4">Решение модератора</h2>
            <div className="flex gap-4">
              <form action="/api/moderation/approve" method="POST" className="flex-1">
                <input type="hidden" name="courseId" value={course.id} />
                <button type="submit"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition">
                  ✓ Одобрить курс
                </button>
              </form>
              <form action="/api/moderation/reject" method="POST" className="flex-1">
                <input type="hidden" name="courseId" value={course.id} />
                <div className="mb-3">
                  <input
                    name="reason"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-sm"
                    placeholder="Причина отклонения (необязательно)"
                  />
                </div>
                <button type="submit"
                  className="w-full py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-xl font-semibold transition text-red-300">
                  ✗ Отклонить курс
                </button>
              </form>
            </div>
          </div>
        )}

        {course.status !== "pending" && (
          <div className={`rounded-2xl p-6 border ${
            course.status === "approved"
              ? "bg-green-900/20 border-green-500/30"
              : "bg-red-900/20 border-red-500/30"
          }`}>
            <p className="font-bold">
              {course.status === "approved" ? "✓ Курс одобрен" : "✗ Курс отклонён"}
            </p>
            {course.rejection_reason && (
              <p className="text-sm text-gray-400 mt-1">Причина: {course.rejection_reason}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}