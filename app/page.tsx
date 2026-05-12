import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

const CATEGORIES = ["Все", "Программирование", "Маркетинг", "Финансы", "Дизайн", "Бизнес"];

export default async function CoursesPage() {
  const { userId } = await auth();

  const { data: courses } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("status", "approved")
    .eq("is_published", true);

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <div className="flex items-center gap-4">
          {!userId ? (
            <>
              <Link href="/sign-in" className="px-4 py-2 text-sm text-purple-300 border border-purple-600/50 rounded-lg hover:border-purple-400 transition">
                Войти
              </Link>
              <Link href="/sign-up" className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                Регистрация
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition">
                Мой кабинет
              </Link>
              <Link href="/profile" className="w-9 h-9 rounded-full bg-white/10 border border-white/20 hover:border-purple-500/50 transition flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </Link>
            </>
          )}
          <Link href="/submit" className="px-4 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg transition text-white font-medium">
            Предложить курс
          </Link>
        </div>
      </nav>

      <div className="text-center pt-10 pb-8 px-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Учись.{" "}
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Продавай.
          </span>{" "}
          Зарабатывай.
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="flex gap-3 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${cat === "Все" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"}`}>
              {cat}
            </button>
          ))}
        </div>

        {!courses || courses.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">Курсов пока нет</h2>
            <p className="text-gray-400 mb-6">Станьте первым автором на платформе!</p>
            <Link href="/submit" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-semibold transition">
              Предложить курс →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 transition group block">
                <div className="h-40 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-5xl">📚</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full">{course.category}</span>
                    <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded-full">{course.level}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-purple-300 transition">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{Number(course.price).toLocaleString("ru")} ₽</span>
                    <span className="text-sm text-purple-400">Подробнее →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}