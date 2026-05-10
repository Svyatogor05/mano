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

  const statusLabels: Record<string, string> = {
    pending: "На проверке",
    approved: "Одобрен",
    rejected: "Отклонён",
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">← Дашборд</Link>
          <UserButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Шапка профиля */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-3xl">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{user?.name || "Без имени"}</h1>
              <p className="text-gray-400 text-sm mb-3">{user?.email}</p>
              <span className="text-xs bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full">
                {roleLabels[user?.role] || user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Мои курсы */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Мои курсы</h2>
            <Link href="/submit" className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-xl transition">
              + Добавить курс
            </Link>
          </div>

          {!myCourses || myCourses.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-gray-400">У вас пока нет курсов</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div key={course.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold mb-1">{course.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{course.category}</span>
                      <span>{Number(course.price).toLocaleString("ru")} ₽</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        course.status === "approved" ? "bg-green-600/20 text-green-300" :
                        course.status === "rejected" ? "bg-red-600/20 text-red-300" :
                        "bg-yellow-600/20 text-yellow-300"
                      }`}>
                        {statusLabels[course.status] || course.status}
                      </span>
                    </div>
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