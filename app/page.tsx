import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import SpaceCarousel from "@/components/SpaceCarousel";

export default async function CoursesPage() {
  const { userId } = await auth();

  let userRole: string | null = null;
  if (userId) {
    const { data: user } = await supabaseAdmin
      .from("users").select("role").eq("clerk_id", userId).single();
    userRole = user?.role ?? null;
  }

  const { data: courses } = await supabaseAdmin
    .from("courses")
    .select("*, users!courses_teacher_id_fkey(name)")
    .eq("status", "approved")
    .eq("is_published", true);

  return (
    <main className="min-h-screen text-white relative overflow-hidden" style={{ background: "#000" }}>

      {/* Навигация */}
      <nav className="flex items-center justify-between px-8 h-[58px] border-b border-white/[0.06] relative z-10" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}>
        <Link href="/" className="flex items-center gap-2 text-[20px] font-semibold tracking-tight text-white">
          Mano
          <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg,#a78bfa,#6d28d9)", boxShadow: "0 0 10px rgba(139,92,246,0.8)" }} />
        </Link>
        <div className="flex items-center gap-5">
          {userId ? (
            <Link href="/profile" className="text-sm text-white/40 hover:text-white/70 transition">Мой кабинет</Link>
          ) : null}
          <Link href="/submit" className="text-sm text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 px-4 py-1.5 rounded-lg transition">
            Предложить курс
          </Link>
          {!userId ? (
            <Link href="/sign-in" className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#a78bfa" }}>
              Войти
            </Link>
          ) : (
            <Link href="/profile" className="w-8 h-8 rounded-full bg-white/10 border border-white/15 hover:border-[#8b7cf8]/50 transition flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </Link>
          )}
        </div>
      </nav>

      <SpaceCarousel courses={courses || []} canDelete={userRole === "owner" || userRole === "admin"} />
    </main>
  );
}