import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await req.json();
  if (!courseId) return NextResponse.json({ error: "No courseId" }, { status: 400 });

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Проверяем не куплен ли уже
  const { data: existing } = await supabaseAdmin
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (existing) return NextResponse.json({ error: "Already purchased" }, { status: 409 });

  const { data: course } = await supabaseAdmin
    .from("courses")
    .select("price")
    .eq("id", courseId)
    .single();

  const { error } = await supabaseAdmin
    .from("purchases")
    .insert({
      user_id: user.id,
      course_id: courseId,
      price_paid: course?.price || 0,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}