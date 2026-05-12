import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabase";
import ProButton from "./ProButton";
import ProfileHeader from "@/components/ProfileHeader";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let { data: user } = await supabaseAdmin
    .from("users").select("*").eq("clerk_id", userId).single();

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
        .select("*").single();
      user = newUser;
    }
  }

  const { data: purchasedCourses } = await supabaseAdmin
    .from("purchases").select("*, courses(*)").eq("user_id", user?.id);

  const { data: myCourses } = await supabaseAdmin
    .from("courses").select("*").eq("teacher_id", user?.id).order("created_at", { ascending: false });

  const coursesWithSales = await Promise.all(
    (myCourses || []).map(async (course) => {
      const { count } = await supabaseAdmin
        .from("purchases").select("*", { count: "exact", head: true }).eq("course_id", course.id);
      return { ...course, sales: count || 0 };
    })
  );

  const totalSales = coursesWithSales.reduce((sum, c) => sum + c.sales, 0);
  const totalRevenue = coursesWithSales.reduce((sum, c) => sum + c.sales * Number(c.price), 0);

  const roleLabels: Record<string, string> = {
    student: "Пользователь", author: "Автор", author_pro: "Автор Pro",
    moderator: "Модератор", admin: "Администратор", owner: "Владелец",
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "На проверке", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20" },
    approved: { label: "Одобрен", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
    rejected: { label: "Отклонён", color: "bg-red-500/10 text-red-300 border-red-500/20" },
  };

  const isAuthor = ["author", "author_pro", "moderator", "admin", "owner"].includes(user?.role);
  const isPro = ["author_pro", "moderator", "admin", "owner"].includes(user?.role);

  return (
    <main className="min-h-screen bg-[#08080f] text-white">
      <nav className="flex items-center justify-between px-7 h-[58px] border-b border-white/[0.06]">
        <Link href="/" className="text-[20px] font-medium tracking-tight text-white">
          Mano<span className="inline-block w-[6px] h-[6px] rounded-full bg-[#6c5ce7] ml-[2px] mb-[2px] align-middle" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition">← Каталог</Link>
          <Link href="/submit" className="text-sm text-white/40 hover:text-white/70 transition">Предложить курс</Link>
          <UserButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-7 py-6 flex flex-col gap-5">

        {/* Шапка профиля */}
        <ProfileHeader
          user={{ name: user?.name || "", email: user?.email || "", role: user?.role || "" }}
          isPro={isPro}
          roleLabel={roleLabels[user?.role] || user?.role}
        />

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[14px] border border-white/[0.07] bg-[#10101a] px-5 py-4">
            <div className="text-xs text-white/30 mb-2">Всего продаж</div>
            <div className="text-[26px] font-medium text-[#a89cf7]">{totalSales}</div>
          </div>
          <div className="rounded-[14px] border border-white/[0.07] bg-[#10101a] px-5 py-4">
            <div className="text-xs text-white/30 mb-2">Выручка</div>
            <div className="text-[26px] font-medium text-emerald-400">{totalRevenue.toLocaleString("ru")} ₽</div>
          </div>
          <div className="rounded-[14px] border border-white/[0.07] bg-[#10101a] px-5 py-4">
            <div className="text-xs text-white/30 mb-2">Куплено курсов</div>
            <div className="text-[26px] font-medium text-white">{purchasedCourses?.length || 0}</div>
          </div>
        </div>

        {/* Мои курсы */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white">Мои курсы</h2>
            <Link href="/submit" className="text-xs text-[#a89cf7] hover:text-white transition">+ Добавить курс</Link>
          </div>

          {!myCourses || myCourses.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border border-white/[0.07] bg-[#10101a]">
              <div className="text-4xl mb-3">🎓</div>
              <p className="text-sm text-white/35 mb-4">У вас пока нет курсов</p>
              <Link href="/submit" className="px-5 py-2 bg-[#6c5ce7] hover:bg-[#5b4fd4] rounded-xl text-sm font-medium transition">
                Создать курс
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {coursesWithSales.map((course) => (
                <div key={course.id} className="rounded-[12px] border border-white/[0.07] bg-[#10101a] px-5 py-4 flex items-center justify-between hover:border-white/[0.12] transition">
                  <div>
                    <div className="text-sm font-medium text-white/85 mb-2">{course.title}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-white/30">{course.category}</span>
                      <span className="text-[11px] font-medium text-white/55">{Number(course.price).toLocaleString("ru")} ₽</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-md border ${statusConfig[course.status]?.color}`}>
                        {statusConfig[course.status]?.label}
                      </span>
                    </div>
                  </div>
                  {course.status === "approved" && (
                    <div className="flex gap-5 text-right shrink-0 ml-4">
                      <div>
                        <div className="text-[11px] text-white/25 mb-1">Продаж</div>
                        <div className="text-[15px] font-medium text-white">{course.sales}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-white/25 mb-1">Выручка</div>
                        <div className="text-[15px] font-medium text-emerald-400">{(course.sales * Number(course.price)).toLocaleString("ru")} ₽</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Купленные курсы */}
        {purchasedCourses && purchasedCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-white">Купленные курсы</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {purchasedCourses.map((p: any) => (
                <Link key={p.id} href={`/courses/${p.courses?.id}`}
                  className="rounded-[12px] border border-white/[0.07] bg-[#10101a] px-4 py-3.5 hover:border-[#6c5ce7]/30 transition">
                  <div className="text-sm font-medium text-white/80 mb-1">{p.courses?.title}</div>
                  <div className="text-[11px] text-white/30">{p.courses?.category} · {Number(p.courses?.price).toLocaleString("ru")} ₽</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pro баннер */}
        {!isPro && (
          <div className="rounded-[14px] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/[0.06] to-orange-500/[0.04] px-6 py-5 flex items-center justify-between">
            <div>
              <div className="text-[15px] font-medium text-yellow-300 mb-3">⭐ Author Pro</div>
              <div className="flex flex-col gap-1.5">
                {["Неограниченное количество курсов", "Детальная аналитика продаж", "Приоритет в каталоге", "Данные о покупателях"].map(f => (
                  <div key={f} className="text-xs text-white/40"><span className="text-emerald-400 mr-2">✓</span>{f}</div>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0 ml-6">
              <div className="text-[22px] font-medium text-white mb-3">4 490 <span className="text-sm text-white/35 font-normal">₽/мес</span></div>
              <ProButton />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}