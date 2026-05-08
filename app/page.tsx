import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton, SignInButton } from "@clerk/nextjs";

const DEMO_COURSES = [
  { id: "1", title: "Python для начинающих", author: "Иван Петров", price: 2990, category: "Программирование", level: "Начинающий", students: 1240 },
  { id: "2", title: "Маркетинг в 2025", author: "Анна Смирнова", price: 4990, category: "Маркетинг", level: "Средний", students: 890 },
  { id: "3", title: "Финансовая грамотность", author: "Дмитрий Козлов", price: 1990, category: "Финансы", level: "Начинающий", students: 3200 },
  { id: "4", title: "Дизайн в Figma", author: "Мария Иванова", price: 3490, category: "Дизайн", level: "Начинающий", students: 2100 },
  { id: "5", title: "Продажи и переговоры", author: "Алексей Новиков", price: 5990, category: "Бизнес", level: "Продвинутый", students: 670 },
  { id: "6", title: "SEO продвижение", author: "Ольга Федорова", price: 2490, category: "Маркетинг", level: "Средний", students: 1560 },
];

const CATEGORIES = ["Все", "Программирование", "Маркетинг", "Финансы", "Дизайн", "Бизнес"];

export default async function CoursesPage() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <div className="flex items-center gap-4">
          {!userId ? (
            <>
              <Link href="/sign-in" className="px-4 py-2 text-sm text-purple-300 border border-purple-600/50 rounded-lg hover:border-purple-400 transition">
                Войти
              </Link>
              <Link href="/sign-up" className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                Регистрация
              </Link>
            </>
          ) : (
            <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition">
              Мой кабинет
            </Link>
          )}
          <Link href="/submit" className="px-4 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg transition text-white font-medium">
            Предложить курс
          </Link>
          {userId && <UserButton />}
        </div>
      </nav>

      <div className="text-center pt-10 pb-8 px-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Учись.{" "}
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Продавай.
          </span>{" "}
          Зарабатывай.
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-10 h-[340px]">
          <div className="col-span-2 row-span-1 bg-gradient-to-r from-emerald-900/70 to-teal-900/70 border border-emerald-500/30 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-300 uppercase tracking-widest mb-2">Акция недели</div>
              <h3 className="text-2xl font-bold mb-1">Курсы со скидкой 40%</h3>
              <p className="text-gray-300 text-sm max-w-sm">Только до конца недели — лучшие курсы по специальной цене от проверенных авторов</p>
            </div>
            <Link href="#" className="shrink-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-semibold transition">
              Смотреть →
            </Link>
          </div>

          <div className="col-span-1 row-span-2 bg-gradient-to-b from-purple-900 to-indigo-950 border border-purple-500/40 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-3">Для авторов</div>
              <h3 className="text-2xl font-bold mb-3">Подписка<br />Pro автора</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {["Неограниченные курсы", "Проверка за 24-48 часов", "Значок верифицированного автора", "Приоритет в каталоге", "Личный менеджер"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-purple-400 text-xs">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">4 599 ₽<span className="text-base text-gray-400 font-normal">/мес</span></div>
              <Link href="/submit" className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-semibold transition mt-3">
                Стать автором Pro →
              </Link>
            </div>
          </div>

          <div className="col-span-2 row-span-1 bg-gradient-to-r from-orange-900/50 to-rose-900/50 border border-orange-500/30 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-orange-300 uppercase tracking-widest mb-2">Новинки 2025</div>
              <h3 className="text-2xl font-bold mb-1">Свежие курсы от экспертов</h3>
              <p className="text-gray-300 text-sm max-w-sm">Актуальные знания — курсы добавляются каждую неделю от практикующих специалистов</p>
            </div>
            <Link href="#" className="shrink-0 px-6 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-sm font-semibold transition">
              Смотреть →
            </Link>
          </div>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${cat === "Все" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {DEMO_COURSES.map((course) => (
            <div key={course.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 transition group">
              <div className="h-40 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center">
                <div className="text-5xl">📚</div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full">{course.category}</span>
                  <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded-full">{course.level}</span>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-purple-300 transition">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{course.author}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">{course.price.toLocaleString("ru")} ₽</span>
                  <span className="text-xs text-gray-500">{course.students.toLocaleString("ru")} студентов</span>
                </div>
                {!userId ? (
                  <Link href="/sign-up" className="block w-full text-center py-2.5 border border-purple-600/50 hover:border-purple-400 rounded-xl text-sm font-semibold transition text-purple-300">
                    Войдите чтобы купить
                  </Link>
                ) : (
                  <Link href={`/courses/${course.id}`} className="block w-full text-center py-2.5 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-semibold transition">
                    Купить курс
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}