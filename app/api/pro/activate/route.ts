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

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.role === "author_pro") {
    return NextResponse.json({ error: "Already Pro" }, { status: 400 });
  }

  // Обновляем роль на author_pro
  await supabaseAdmin
    .from("users")
    .update({ role: "author_pro" })
    .eq("id", user.id);

  // Записываем подписку в таблицу
  await supabaseAdmin
    .from("subscriptions")
    .insert({
      user_id: user.id,
      plan: "author_pro",
      price: 4490,
      status: "active",
      started_at: new Date().toISOString(),
    });

  return NextResponse.json({ success: true });
}