import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabase";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: currentUser } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("clerk_id", userId)
    .single();

  if (!currentUser || !["admin", "owner"].includes(currentUser.role)) {
    redirect("/profile");
  }

  const { data: users } = await supabaseAdmin
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: recentCourses } = await supabaseAdmin
    .from("courses")
    .select("*, users!courses_teacher_id_fkey(name, email)")
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = {
    total: users?.length || 0,
    students: users?.filter(u => u.role === "student").length || 0,
    authors: users?.filter(u => u.role === "author").length || 0,
    authorsPro: users?.filter(u => u.role === "author_pro").length || 0,
    moderators: users?.filter(u => u.role === "moderator").length || 0,
    admins: users?.filter(u => u.role === "admin").length || 0,
  };

  const roleConfig: Record<string, { label: string; color: string }> = {
    student: { label: "Пользователь", color: "bg-gray-600/20 text-gray-300 border-gray-500/20" },
    author: { label: "Автор", color: "bg-blue-600/20 text-blue-300 border-blue-500/20" },
    author_pro: { label: "Автор Pro", color: "bg-yellow-600/20 text-yellow-300 border-yellow-500/20" },
    moderator: { label: "Модератор", color: "bg-green-600/20 text-green-300 border-green-500/20" },
    admin: { label: "Администратор", color: "bg-purple-600/20 text-purple-300 border-purple-500/20" },
    owner: { label: "Владелец", color: "bg-red-600/20 text-red-300 border-red-500/20" },
  };

  const isOwner = currentUser.role === "owner";

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition">← Профиль</Link>
          {isOwner && (
            <Link href="/moderation" className="text-sm text-gray-400 hover:text-white transition">Модерация</Link>
          )}
          <UserButton />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {isOwner ? "Панель владельца" : "Панель администратора"}
            </h1>
            <p className="text-gray-400">Управление пользователями и ролями</p>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-6 gap-3 mb-8">
          {[
            { label: "Всего", value: stats.total, color: "text-white" },
            { label: "Пользователей", value: stats.students, color: "text-gray-300" },
            { label: "Авторов", value: stats.authors, color: "text-blue-300" },
            { label: "Автор Pro", value: stats.authorsPro, color: "text-yellow-300" },
            { label: "Модераторов", value: stats.moderators, color: "text-green-300" },
            { label: "Админов", value: stats.admins, color: "text-purple-300" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Таблица пользователей */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-bold">Все пользователи</h2>
          </div>
          <div className="divide-y divide-white/5">
            {users?.map((user) => (
              <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/3 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-300">
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div className="font-medium">{user.name || "Без имени"}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${roleConfig[user.role]?.color}`}>
                    {roleConfig[user.role]?.label}
                  </span>
                  {/* Кнопки смены роли — только для владельца */}
                  {isOwner && user.role !== "owner" && (
                    <RoleSelector userId={user.id} currentRole={user.role} />
                  )}
                  {/* Администратор может менять только модераторов и ниже */}
                  {!isOwner && !["owner", "admin"].includes(user.role) && (
                    <RoleSelector userId={user.id} currentRole={user.role} limitedRoles />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Последние курсы */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-bold">Последние курсы</h2>
          </div>
          <div className="divide-y divide-white/5">
            {recentCourses?.map((course) => (
              <div key={course.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{course.title}</div>
                  <div className="text-sm text-gray-500">
                    {(course.users as any)?.name} · {course.category}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    course.status === "approved" ? "bg-green-600/20 text-green-300 border-green-500/20" :
                    course.status === "rejected" ? "bg-red-600/20 text-red-300 border-red-500/20" :
                    "bg-yellow-600/20 text-yellow-300 border-yellow-500/20"
                  }`}>
                    {course.status === "approved" ? "Одобрен" : course.status === "rejected" ? "Отклонён" : "На проверке"}
                  </span>
                  <span className="text-sm font-bold">{Number(course.price).toLocaleString("ru")} ₽</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function RoleSelector({ userId, currentRole, limitedRoles }: { 
  userId: string; 
  currentRole: string; 
  limitedRoles?: boolean;
}) {
  const allRoles = limitedRoles
    ? [
        { value: "student", label: "Пользователь" },
        { value: "author", label: "Автор" },
        { value: "author_pro", label: "Автор Pro" },
        { value: "moderator", label: "Модератор" },
      ]
    : [
        { value: "student", label: "Пользователь" },
        { value: "author", label: "Автор" },
        { value: "author_pro", label: "Автор Pro" },
        { value: "moderator", label: "Модератор" },
        { value: "admin", label: "Администратор" },
      ];

  return (
    <form action="/api/admin/set-role" method="POST" className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
      >
        {allRoles.map(r => (
          <option key={r.value} value={r.value} className="bg-[#1a1a1a]">{r.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
      >
        Сохранить
      </button>
    </form>
  );
}