"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Удалить курс? Это действие необратимо.")) return;

    setLoading(true);
    const res = await fetch(`/api/courses/delete?id=${courseId}`, { method: "DELETE" });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Ошибка удаления");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/20 text-red-300 rounded-lg text-sm font-medium transition disabled:opacity-50"
    >
      {loading ? "..." : "Удалить"}
    </button>
  );
}