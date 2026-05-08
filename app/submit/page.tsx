import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function SubmitPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition">
            Мой кабинет
          </Link>
          <UserButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold mb-2">Предложить курс</h1>
        <p className="text-gray-400 mb-10">Выберите подходящий план размещения</p>

        {/* Тарифы */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {/* Одиночный курс */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 transition">
            <div className="text-sm text-gray-400 mb-2">Базовый</div>
            <div className="text-3xl font-bold mb-1">Бесплатно</div>
            <div className="text-gray-500 text-sm mb-6">Один курс на проверку</div>
            <ul className="space-y-3 mb-8 text-sm text-gray-300">
              {[
                "Размещение 1 курса",
                "Стандартная проверка 5-7 дней",
                "Базовая страница курса",
                "Доступ к статистике продаж",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/submit/single" className="block w-full text-center py-3 border border-purple-600/50 hover:border-purple-400 rounded-xl text-sm font-semibold transition text-purple-300">
              Подать заявку
            </Link>
          </div>

          {/* Подписка автора */}
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/50 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-4 bg-purple-600 text-xs px-2 py-1 rounded-full font-semibold">
              Популярно
            </div>
            <div className="text-sm text-purple-300 mb-2">Подписка автора</div>
            <div className="text-3xl font-bold mb-1">4 599 ₽<span className="text-lg text-gray-400 font-normal">/мес</span></div>
            <div className="text-gray-500 text-sm mb-6">Неограниченные возможности</div>
            <ul className="space-y-3 mb-8 text-sm text-gray-300">
              {[
                "Неограниченное количество курсов",
                "Приоритетная проверка 24-48 часов",
                "Расширенная страница автора",
                "Продвинутая аналитика и отчёты",
                "Значок верифицированного автора",
                "Приоритет в поиске и каталоге",
                "Поддержка персонального менеджера",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/submit/pro" className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-semibold transition">
              Стать автором Pro
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}