import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export default async function ModerationPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Проверяем роль
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("clerk_id", userId)
    .single();

  if (!user || !["moderator", "admin", "owner"].includes(user.role)) {
    redirect("/dashboard");
  }

  // Получаем курсы на проверку
  const { data: courses } = await supabaseAdmin
  .from("courses")
  .select("*, users!courses_teacher_id_fkey(name, email)")
  .eq("status", "pending")
  .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
          ← Дашборд
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Панель модерации</h1>
        <p className="text-gray-400 mb-8">Курсы ожидающие проверки: {courses?.length || 0}</p>

        {!courses || courses.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold">Все курсы проверены!</h2>
            <p className="text-gray-400 mt-2">Новых заявок нет</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded-full">На проверке</span>
                      <span className="text-xs text-gray-500">{new Date(course.created_at).toLocaleDateString("ru")}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Автор: {course.users?.name}</span>
                      <span>Категория: {course.category}</span>
                      <span>Уровень: {course.level}</span>
                      <span className="text-white font-bold">{Number(course.price).toLocaleString("ru")} ₽</span>
                    </div>
                  </div>
                  <div className="flex gap-3 ml-6">
                    <ApproveButton courseId={course.id} />
                    <RejectButton courseId={course.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ApproveButton({ courseId }: { courseId: string }) {
  return (
    <form action={`/api/moderation/approve`} method="POST">
      <input type="hidden" name="courseId" value={courseId} />
      <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-semibold transition">
        ✓ Одобрить
      </button>
    </form>
  );
}

function RejectButton({ courseId }: { courseId: string }) {
  return (
    <form action={`/api/moderation/reject`} method="POST">
      <input type="hidden" name="courseId" value={courseId} />
      <button type="submit" className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-xl text-sm font-semibold transition text-red-300">
        ✗ Отклонить
      </button>
    </form>
  );
}