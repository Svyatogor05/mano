import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function getOrCreateUser(userId: string) {
  // Пробуем найти пользователя
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, role")
    .eq("clerk_id", userId)
    .single();

  if (user) return user;

  // Если нет — создаём через Clerk API
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const { data: newUser } = await supabaseAdmin
    .from("users")
    .insert({
      clerk_id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Без имени",
      role: "student",
    })
    .select("id, role")
    .single();

  return newUser;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, price, category, level } = body;

  const user = await getOrCreateUser(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isStudent = user.role === "student";
  const isAuthor = user.role === "author";

  // Студент автоматически становится автором
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
        error: "Бесплатный автор может выставить только 1 курс. Купите Author Pro для неограниченного количества.",
        code: "UPGRADE_REQUIRED"
      }, { status: 403 });
    }
  }

  const { data, error } = await supabaseAdmin
  .from("courses")
  .insert({
    title,
    description: body.description,
    full_description: body.full_description,
    price: body.price,
    category: body.category,
    level: body.level,
    teacher_id: user.id,
    status: "pending",
    is_published: false,
    course_url: body.course_url,
    telegram_url: body.telegram_url,
    promo_video_url: body.promo_video_url,
    what_you_learn: body.what_you_learn,
    requirements: body.requirements,
    certificate: body.has_certificate ? body.certificate : null,
    duration: body.duration,
    lessons_count: body.lessons_count ? Number(body.lessons_count) : null,
    language: body.language || "Русский",
  })
  .select()
  .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ course: data, newRole: isStudent ? "author" : user.role });
}