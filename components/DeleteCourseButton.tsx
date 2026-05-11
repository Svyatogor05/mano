"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault(); // чтобы не срабатывал Link под кнопкой
    if (!confirm("Удалить курс? Это действие необратимо.")) return;

    setLoading(true);
    const res = await fetch(`/api/courses/delete?id=${courseId}`, { method: "DELETE" });

    if (res.ok) {
      router.refresh(); // перерисовываем страницу без перезагрузки
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
      className="absolute top-3 right-3 z-10 p-1.5 bg-red-600/80 hover:bg-red-600 rounded-lg transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
      title="Удалить курс"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 3h6l1 1h4v2H4V4h4L9 3zm-3 5h12l-1 13H7L6 8zm5 2v9h1v-9h-1zm3 0v9h1v-9h-1z"/>
      </svg>
    </button>
  );
}