import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Проверяем роль — только owner и admin
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("clerk_id", userId)
    .single();

  if (!user || !["owner", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("id");

  if (!courseId) return NextResponse.json({ error: "No course id" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("courses")
    .delete()
    .eq("id", courseId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}