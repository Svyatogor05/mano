import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export default async function CoursePage({ params }: { params: { id: string } }) {
  const { userId } = await auth();

  const { data: course } = await supabaseAdmin
    .from("courses")
    .select("*, users!courses_teacher_id_fkey(name, email)")
    .eq("id", params.id)
    .single();

  if (!course) redirect("/");

  // Проверяем куплен ли курс
  let isPurchased = false;
  if (userId) {
    const { data: userRow } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userRow) {
      const { data: purchase } = await supabaseAdmin
        .from("purchases")
        .select("id")
        .eq("user_id", userRow.id)
        .eq("course_id", course.id)
        .single();
      isPurchased = !!purchase;
    }
  }

  const levelLabels: Record<string, string> = {
    beginner: "Начинающий",
    intermediate: "Средний",
    advanced: "Продвинутый",
  };

  const whatYouLearn = course.what_you_learn?.split("\n").filter(Boolean) || [];
  const requirements = course.requirements?.split("\n").filter(Boolean) || [];

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">← Каталог</Link>
          {userId ? (
            <>
              <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition">Профиль</Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="px-4 py-2 text-sm text-purple-300 border border-purple-600/50 rounded-lg hover:border-purple-400 transition">
                Войти
              </Link>
              <Link href="/sign-up" className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-8">

          {/* Основная информация */}
          <div className="col-span-2 space-y-6">
            {/* Шапка */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
                  {course.category}
                </span>
                <span className="text-xs bg-white/5 text-gray-400 px-3 py-1 rounded-full border border-white/10">
                  {levelLabels[course.level] || course.level}
                </span>
                {course.language && (
                  <span className="text-xs bg-white/5 text-gray-400 px-3 py-1 rounded-full border border-white/10">
                    🌐 {course.language}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
            </div>

            {/* Автор */}
            <div className="flex items-center gap-3 py-4 border-y border-white/10">
              <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300">
                {(course.users as any)?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <div className="text-sm text-gray-400">Автор курса</div>
                <div className="font-medium">{(course.users as any)?.name}</div>
              </div>
            </div>

            {/* Промо видео */}
            {course.promo_video_url && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="font-bold mb-3">🎬 Промо-видео</h2>
                <a href={course.promo_video_url} target="_blank" rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline text-sm">
                  Смотреть видео →
                </a>
              </div>
            )}

            {/* Полное описание */}
            {course.full_description && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">О курсе</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{course.full_description}</p>
              </div>
            )}

            {/* Чему научитесь */}
            {whatYouLearn.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Чему вы научитесь</h2>
                <div className="grid grid-cols-2 gap-3">
                  {whatYouLearn.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Требования */}
            {requirements.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Требования</h2>
                <ul className="space-y-2">
                  {requirements.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Сертификат */}
            {course.certificate && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-2 text-green-300">🎓 Сертификат</h2>
                <p className="text-gray-300 text-sm">{course.certificate}</p>
              </div>
            )}
          </div>

          {/* Боковая панель — покупка */}
          <div className="col-span-1">
            <div className="sticky top-8 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              {/* Превью */}
              <div className="h-40 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl flex items-center justify-center">
                <div className="text-5xl">📚</div>
              </div>

              <div className="text-3xl font-bold">{Number(course.price).toLocaleString("ru")} ₽</div>

              {/* Инфо */}
              <div className="space-y-2 text-sm text-gray-400">
                {course.duration && (
                  <div className="flex justify-between">
                    <span>Длительность</span>
                    <span className="text-white">{course.duration}</span>
                  </div>
                )}
                {course.lessons_count && (
                  <div className="flex justify-between">
                    <span>Уроков</span>
                    <span className="text-white">{course.lessons_count}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Уровень</span>
                  <span className="text-white">{levelLabels[course.level]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Язык</span>
                  <span className="text-white">{course.language || "Русский"}</span>
                </div>
                {course.certificate && (
                  <div className="flex justify-between">
                    <span>Сертификат</span>
                    <span className="text-green-400">✓ Есть</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4">
                {isPurchased ? (
                  <div className="space-y-3">
                    <div className="text-center py-2 bg-green-600/20 border border-green-500/30 rounded-xl text-green-300 text-sm font-medium">
                      ✓ Курс куплен
                    </div>
                    {course.course_url && (
                      <a href={course.course_url} target="_blank" rel="noopener noreferrer"
                        className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition">
                        Перейти к курсу →
                      </a>
                    )}
                  </div>
                ) : !userId ? (
                  <Link href="/sign-up"
                    className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition">
                    Войдите чтобы купить
                  </Link>
                ) : (
                  <Link href={`/courses/${course.id}/checkout`}
                    className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition">
                    Купить за {Number(course.price).toLocaleString("ru")} ₽
                  </Link>
                )}
              </div>

              {course.telegram_url && (
                <a href={course.telegram_url} target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition">
                  📱 Telegram-канал курса
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}