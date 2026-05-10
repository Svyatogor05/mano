import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: currentUser } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("clerk_id", userId)
    .single();

  if (!currentUser || !["admin", "owner"].includes(currentUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const targetUserId = formData.get("userId") as string;
  const newRole = formData.get("role") as string;

  const validRoles = ["student", "author", "author_pro", "moderator", "admin", "owner"];
  if (!validRoles.includes(newRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Администратор не может назначать admin и owner
  if (currentUser.role === "admin" && ["admin", "owner"].includes(newRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await supabaseAdmin
    .from("users")
    .update({ role: newRole })
    .eq("id", targetUserId);

  return NextResponse.redirect(new URL("/admin", req.url));
}