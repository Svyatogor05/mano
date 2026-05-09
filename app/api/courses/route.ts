import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, price, category, level } = body;

  // Получаем пользователя из Supabase
  const { data: user } = await supabase
    .from("users")
    .select("id, role")
    .eq("clerk_id", userId)
    .single();

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Проверяем роль
  if (!["author", "author_pro", "admin", "owner"].includes(user.role)) {
    return NextResponse.json({ error: "Not an author" }, { status: 403 });
  }

  // Обычный автор — только 1 курс
  if (user.role === "author") {
    const { count } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", user.id);
    
    if (count && count >= 1) {
      return NextResponse.json({ error: "Free authors can only submit 1 course" }, { status: 403 });
    }
  }

  const { data, error } = await supabase.from("courses").insert({
    title,
    description,
    price,
    category,
    level,
    teacher_id: user.id,
    status: "pending",
    is_published: false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ course: data });
}