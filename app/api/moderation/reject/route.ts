import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, role")
    .eq("clerk_id", userId)
    .single();

  if (!user || !["moderator", "admin", "owner"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const courseId = formData.get("courseId") as string;

  await supabaseAdmin
    .from("courses")
    .update({
      status: "rejected",
      is_published: false,
      moderator_id: user.id,
      moderated_at: new Date().toISOString(),
    })
    .eq("id", courseId);

  return NextResponse.redirect(new URL("/moderation", req.url));
}