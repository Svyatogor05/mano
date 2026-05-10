import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, price, category, level } = body;

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, role")
    .eq("clerk_id", userId)
    .single();

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Модераторы и выше не ограничены
  const isPrivileged = ["moderator", "admin", "owner"].includes(user.role);
  const isPro = user.role === "author_pro";
  const isAuthor = user.role === "author";
  const isStudent = user.role === "student";

  // Студент автоматически становится автором при подаче курса
  if (isStudent) {
    await supabaseAdmin
      .from("users")
      .update({ role: "author" })
      .eq("id", user.id);
    user.role = "author";
  }

  // Обычный автор — только 1 курс
  if (isAuthor) {
    const { count } = await supabaseAdmin
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", user.id);

    if (count && count >= 1) {
      return NextResponse.json({ 
        error: "Бесплатный автор может выставить только 1 курс. Купите Author Pro для неограниченного количества курсов.",
        code: "UPGRADE_REQUIRED"
      }, { status: 403 });
    }
  }

  const { data, error } = await supabaseAdmin
    .from("courses")
    .insert({
      title,
      description,
      price,
      category,
      level,
      teacher_id: user.id,
      status: "pending",
      is_published: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ course: data, newRole: isStudent ? "author" : user.role });
}