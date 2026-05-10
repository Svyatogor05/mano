import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  const { data: purchasedCourses } = await supabaseAdmin
    .from("purchases")
    .select("*, courses(*)")
    .eq("user_id", user?.id);

  const { data: myCourses } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("teacher_id", user?.id)
    .order("created_at", { ascending: false });

  const roleLabels: Record<string, string> = {
    student: "Студент",
    author: "Автор",
    author_pro: "Автор Pro",
    moderator: "Модератор",
    admin: "Администратор",
    owner: "Владелец",
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "На проверке", color: "bg-yellow-600/20 text-yellow-300" },
    approved: { label: "Одобрен", color: "bg-green-600/20 text-green-300" },
    rejected: { label: "Отклонён", color: "bg-red-600/20 text-red-300" },
  };

  const isAuthor = ["author", "author_pro", "moderator", "admin", "owner"].includes(user?.role);

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">Каталог</Link>
          <Link href="/submit" className="px-4 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg transition text-white font-medium">
            Предложить курс
          </Link>
          <UserButton />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* Шапка профиля */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-purple-600/30 border-2 border-purple-500/40 flex items-center justify-center text-3xl font-bold text-purple-300">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{user?.name || "Без имени"}</h1>
            <p className="text-gray-400 text-sm mb-3">{user?.email}</p>
            <span className="text-xs bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
              {roleLabels[user?.role] || user?.role}
            </span>
          </div>
          {!isAuthor && (
            <button className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-xl transition font-medium">
              Стать автором
            </button>
          )}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="#purchased" className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 transition group">
            <div className="text-gray-400 text-sm mb-2">Куплено курсов</div>
            <div className="text-4xl font-bold text-purple-400 mb-1">{purchasedCourses?.length || 0}</div>
            <div className="text-sm text-gray-500 group-hover:text-purple-300 transition">Смотреть все →</div>
          </Link>
          <Link href="#mycourses" className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 transition group">
            <div className="text-gray-400 text-sm mb-2">Выставлено курсов</div>
            <div className="text-4xl font-bold text-purple-400 mb-1">{myCourses?.length || 0}</div>
            <div className="text-sm text-gray-500 group-hover:text-purple-300 transition">Смотреть все →</div>
          </Link>
        </div>

        {/* Купленные курсы */}
        <div id="purchased" className="mb-10">
          <h2 className="text-xl font-bold mb-4">Купленные курсы</h2>
          {!purchasedCourses || purchasedCourses.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-gray-400 mb-4">Вы ещё не купили ни одного курса</p>
              <Link href="/" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-semibold transition">
                Смотреть каталог
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {purchasedCourses.map((p: any) => (
                <Link key={p.id} href={`/courses/${p.courses?.id}`} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/40 transition">
                  <div>
                    <h3 className="font-bold mb-1">{p.courses?.title}</h3>
                    <span className="text-sm text-gray-400">{p.courses?.category}</span>
                  </div>
                  <span className="text-purple-300 text-sm">Открыть →</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Мои курсы (для авторов) */}
        <div id="mycourses">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Мои курсы</h2>
            <Link href="/submit" className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-xl transition">
              + Добавить курс
            </Link>
          </div>
          {!myCourses || myCourses.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-4xl mb-3">🎓</div>
              <p className="text-gray-400 mb-4">У вас пока нет курсов</p>
              <Link href="/submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-semibold transition">
                Создать курс
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myCourses.map((course: any) => (
                <div key={course.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/40 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold mb-1">{course.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{course.category}</span>
                        <span>{Number(course.price).toLocaleString("ru")} ₽</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusLabels[course.status]?.color}`}>
                          {statusLabels[course.status]?.label}
                        </span>
                      </div>
                    </div>
                    {isAuthor && course.status === "approved" && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Продаж</div>
                        <div className="text-lg font-bold text-purple-400">—</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}