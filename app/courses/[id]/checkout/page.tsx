"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/courses/${courseId}?purchased=1`);
    } else {
      setError(data.error || "Ошибка оплаты");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#08080f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href={`/courses/${courseId}`} className="text-sm text-white/35 hover:text-white/60 transition mb-8 inline-block">
          ← Назад к курсу
        </Link>

        <div className="rounded-2xl border border-white/[0.08] bg-[#10101a] p-8">
          <h1 className="text-xl font-medium text-white mb-2">Оформление покупки</h1>
          <p className="text-sm text-white/40 mb-8">Тестовый режим — оплата без списания средств</p>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 mb-6">
            <div className="text-xs text-white/30 mb-1">Вы получите доступ к</div>
            <div className="text-sm text-white/70">Материалам курса и ссылкам автора</div>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              {error === "Already purchased" ? "Вы уже купили этот курс" : error}
            </div>
          )}

          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4fd4] disabled:opacity-50 text-sm font-medium text-white transition"
          >
            {loading ? "Обработка..." : "Подтвердить покупку →"}
          </button>
        </div>
      </div>
    </main>
  );
}