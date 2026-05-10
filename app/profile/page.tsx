import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Получаем или создаём пользователя
let { data: user } = await supabaseAdmin
  .from("users")
  .select("*")
  .eq("clerk_id", userId)
  .single();

if (!user) {
  const { currentUser } = await import("@clerk/nextjs/server");
  const clerkUser = await currentUser();
  if (clerkUser) {
    const { data: newUser } = await supabaseAdmin
      .from("users")
      .insert({
        clerk_id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Без имени",
        role: "student",
      })
      .select("*")
      .single();
    user = newUser;
  }
}

  const { data: purchasedCourses } = await supabaseAdmin
    .from("purchases")
    .select("*, courses(*)")
    .eq("user_id", user?.id);

  const { data: myCourses } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("teacher_id", user?.id)
    .order("created_at", { ascending: false });

  // Считаем продажи для каждого курса автора
  const coursesWithSales = await Promise.all(
    (myCourses || []).map(async (course) => {
      const { count } = await supabaseAdmin
        .from("purchases")
        .select("*", { count: "exact", head: true })
        .eq("course_id", course.id);
      return { ...course, sales: count || 0 };
    })
  );

  const totalSales = coursesWithSales.reduce((sum, c) => sum + c.sales, 0);
  const totalRevenue = coursesWithSales.reduce((sum, c) => sum + c.sales * Number(c.price), 0);

  const roleLabels: Record<string, string> = {
    student: "Студент", author: "Автор", author_pro: "Автор Pro",
    moderator: "Модератор", admin: "Администратор", owner: "Владелец",
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "На проверке", color: "bg-yellow-600/20 text-yellow-300 border-yellow-500/20" },
    approved: { label: "Одобрен", color: "bg-green-600/20 text-green-300 border-green-500/20" },
    rejected: { label: "Отклонён", color: "bg-red-600/20 text-red-300 border-red-500/20" },
  };

  const isAuthor = ["author", "author_pro", "moderator", "admin", "owner"].includes(user?.role);
  const isPro = ["author_pro", "moderator", "admin", "owner"].includes(user?.role);

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

      <div className="max-w-5xl mx-auto px-8 py-12 space-y-6">

        {/* Шапка */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/50 to-indigo-600/50 border-2 border-purple-500/40 flex items-center justify-center text-3xl font-bold text-purple-200 shrink-0">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{user?.name || "Без имени"}</h1>
            <p className="text-gray-400 text-sm mb-3">{user?.email}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
                {roleLabels[user?.role] || user?.role}
              </span>
              {isPro && (
                <span className="text-xs bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-300 px-3 py-1 rounded-full border border-yellow-500/20">
                  ⭐ Pro
                </span>
              )}
            </div>
          </div>
          {!isPro && (
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-2">Расширенная аналитика и приоритет</div>
              <button className="px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-xl text-sm font-bold transition">
                ⭐ Автор Pro
              </button>
            </div>
          )}
        </div>

        {/* Купленные курсы — широкий баннер */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Куплено курсов</div>
              <div className="text-4xl font-bold text-purple-400">{purchasedCourses?.length || 0}</div>
            </div>
            <Link href="#purchased" className="text-sm text-purple-400 hover:text-purple-300 transition">
              Смотреть все →
            </Link>
          </div>
          {purchasedCourses && purchasedCourses.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-2">
              {purchasedCourses.slice(0, 3).map((p: any) => (
                <Link key={p.id} href={`/courses/${p.courses?.id}`}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:border-purple-500/40 transition">
                  {p.courses?.title}
                </Link>
              ))}
              {purchasedCourses.length > 3 && (
                <span className="px-3 py-1.5 text-gray-500 text-sm">+{purchasedCourses.length - 3} ещё</span>
              )}
            </div>
          )}
        </div>

        {/* Мои курсы */}
        <div id="mycourses">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Мои курсы</h2>
            <Link href="/submit" className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-xl transition font-medium">
              + Добавить курс
            </Link>
          </div>

          {/* Сводная статистика автора */}
          {isAuthor && coursesWithSales.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-gray-400 text-xs mb-1">Всего продаж</div>
                <div className="text-2xl font-bold text-white">{totalSales}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-gray-400 text-xs mb-1">Выручка</div>
                <div className="text-2xl font-bold text-white">{totalRevenue.toLocaleString("ru")} ₽</div>
              </div>
              <div className={`rounded-xl p-4 border ${isPro ? "bg-yellow-600/10 border-yellow-500/20" : "bg-white/5 border-white/10"}`}>
                <div className="text-gray-400 text-xs mb-1">Курсов опубликовано</div>
                <div className="text-2xl font-bold text-white">
                  {coursesWithSales.filter(c => c.status === "approved").length}
                </div>
              </div>
            </div>
          )}

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
              {coursesWithSales.map((course) => (
                <div key={course.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig[course.status]?.color}`}>
                          {statusConfig[course.status]?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{course.category}</span>
                        <span>{course.level}</span>
                        <span className="text-white font-semibold">{Number(course.price).toLocaleString("ru")} ₽</span>
                      </div>
                    </div>

                    {/* Статистика курса */}
                    {course.status === "approved" && (
                      <div className="flex gap-6 ml-6 text-right">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Продаж</div>
                          <div className="text-xl font-bold text-white">{course.sales}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Выручка</div>
                          <div className="text-xl font-bold text-purple-400">
                            {(course.sales * Number(course.price)).toLocaleString("ru")} ₽
                          </div>
                        </div>
                        {!isPro && (
                          <div className="flex items-center">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Детальная аналитика</div>
                              <button className="text-xs px-3 py-1 bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border border-yellow-500/30 text-yellow-300 rounded-lg hover:from-yellow-600/50 hover:to-orange-600/50 transition">
                                ⭐ Pro
                              </button>
                            </div>
                          </div>
                        )}
                        {isPro && (
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Конверсия</div>
                            <div className="text-xl font-bold text-green-400">—</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Блок Pro если не Pro */}
        {!isPro && (
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">⭐ Автор Pro</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Детальная аналитика продаж</li>
                  <li>✓ График доходов по дням</li>
                  <li>✓ Данные о покупателях</li>
                  <li>✓ Приоритет в каталоге</li>
                  <li>✓ Расширенная страница курса</li>
                </ul>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">990 ₽<span className="text-gray-400 text-lg">/мес</span></div>
                <button className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-xl font-bold transition">
                  Подключить Pro
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}