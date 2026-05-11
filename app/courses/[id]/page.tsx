import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export default async function CoursePage({ params }: { params: { id: string } }) {
  const { userId } = await auth();

  const { data: course, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!course || error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Курс не найден</h1>
          <p className="text-red-400 text-sm">{error?.message}</p>
          <Link href="/" className="mt-4 inline-block text-purple-400">← Назад</Link>
        </div>
      </div>
    );
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
          <div className="col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
                  {course.category}
                </span>
                <span className="text-xs bg-white/5 text-gray-400 px-3 py-1 rounded-full border border-white/10">
                  {levelLabels[course.level] || course.level}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
            </div>

            {course.full_description && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">О курсе</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{course.full_description}</p>
              </div>
            )}

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
          </div>

          <div className="col-span-1">
            <div className="sticky top-8 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="h-40 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl flex items-center justify-center">
                <div className="text-5xl">📚</div>
              </div>
              <div className="text-3xl font-bold">{Number(course.price).toLocaleString("ru")} ₽</div>
              <div className="space-y-2 text-sm text-gray-400">
                {course.duration && (
                  <div className="flex justify-between">
                    <span>Длительность</span>
                    <span className="text-white">{course.duration}</span>
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
              </div>
              <div className="border-t border-white/10 pt-4">
                {!userId ? (
                  <Link href="/sign-up" className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition">
                    Войдите чтобы купить
                  </Link>
                ) : (
                  <Link href={`/courses/${course.id}/checkout`} className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition">
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