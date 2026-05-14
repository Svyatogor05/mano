import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export default async function ModerationPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("clerk_id", userId)
    .single();

  if (!user || !["moderator", "admin", "owner"].includes(user.role)) {
    redirect("/dashboard");
  }

  const { data: courses } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#08080f] text-white">
      <nav className="flex items-center justify-between px-7 h-[58px] border-b border-white/[0.06]">
        <Link href="/" className="text-[20px] font-medium tracking-tight text-white">
          Mano<span className="inline-block w-[6px] h-[6px] rounded-full bg-[#6c5ce7] ml-[2px] mb-[2px] align-middle" />
        </Link>
        <Link href="/profile" className="text-sm text-white/35 hover:text-white/60 transition">
          ← Профиль
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-7 py-8">
        <h1 className="text-2xl font-medium text-white mb-1">Панель модерации</h1>
        <p className="text-sm text-white/35 mb-8">Курсов на проверке: {courses?.length || 0}</p>

        {!courses || courses.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/[0.07] bg-[#10101a]">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-lg font-medium text-white">Все курсы проверены!</h2>
            <p className="text-sm text-white/35 mt-2">Новых заявок нет</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {courses.map((course) => (
              <div key={course.id} className="rounded-2xl border border-white/[0.07] bg-[#10101a] p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">На проверке</span>
                      <span className="text-xs text-white/25">{new Date(course.created_at).toLocaleDateString("ru")}</span>
                    </div>
                    <h3 className="text-base font-medium text-white mb-1">{course.title}</h3>
                    <p className="text-sm text-white/40 mb-3">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <span>{course.category}</span>
                      <span>{course.level}</span>
                      <span className="text-white/60 font-medium">{Number(course.price).toLocaleString("ru")} ₽</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-6 items-center shrink-0">
                    <Link href={`/moderation/course/${course.id}`}
                      className="px-3 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-xl text-xs font-medium transition">
                      👁 Просмотр
                    </Link>
                    <form action="/api/moderation/approve" method="POST">
                      <input type="hidden" name="courseId" value={course.id} />
                      <button type="submit" className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-medium transition">
                        ✓ Одобрить
                      </button>
                    </form>
                    <form action="/api/moderation/reject" method="POST">
                      <input type="hidden" name="courseId" value={course.id} />
                      <button type="submit" className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-medium text-red-300 transition">
                        ✗ Отклонить
                      </button>
                    </form>
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