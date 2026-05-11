"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleActivate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pro/activate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
      } else {
        alert(data.error || "Ошибка активации");
      }
    } catch {
      alert("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleActivate}
      disabled={loading}
      className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 rounded-xl font-bold transition"
    >
      {loading ? "Активация..." : "Подключить Pro — 4 490 ₽/мес"}
    </button>
  );
}