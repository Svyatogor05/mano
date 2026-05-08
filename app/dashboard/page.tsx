import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) redirect("/sign-in");

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
  <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
    Mano
  </Link>
  <div className="flex items-center gap-4">
    <Link href="/courses" className="text-sm text-gray-400 hover:text-white transition">
      Каталог курсов
    </Link>
    <Link href="/submit" className="px-4 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg transition text-white font-medium">
      Предложить курс
    </Link>
    <UserButton />
  </div>
</nav>

      <div className="px-8 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-1">
          Привет, {user.firstName || "друг"} 👋
        </h1>
        <p className="text-gray-400 text-lg mb-12">Добро пожаловать в Mano</p>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { title: "Мои курсы", value: "0", desc: "Купленных курсов" },
            { title: "Прогресс", value: "0%", desc: "Средний прогресс" },
            { title: "Сертификаты", value: "0", desc: "Получено" },
          ].map((card) => (
            <div key={card.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition">
              <div className="text-gray-400 text-sm mb-2">{card.desc}</div>
              <div className="text-4xl font-bold text-purple-400">{card.value}</div>
              <div className="text-white font-semibold mt-1">{card.title}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-xl font-bold mb-2">Вы ещё не купили ни одного курса</h2>
          <p className="text-gray-400 mb-6">Откройте каталог и найдите курс который изменит вашу жизнь</p>
          <Link href="/courses" className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition">
            Смотреть курсы
          </Link>
        </div>
      </div>
    </main>
  );
}