import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function SubmitSinglePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Mano
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/submit" className="text-sm text-gray-400 hover:text-white transition">
            ← Назад
          </Link>
          <UserButton />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Подать заявку на курс</h1>
        <p className="text-gray-400 mb-10">Заполните все поля — наша команда проверит курс в течение 5-7 дней</p>

        <form className="space-y-6">
          {/* Основная информация */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-lg">Основная информация</h2>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Название курса *</label>
              <input type="text" placeholder="Например: Python для начинающих" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Описание курса *</label>
              <textarea rows={4} placeholder="Подробно опишите чему научится студент, для кого этот курс, какие результаты получит..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Категория *</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition">
                  <option value="" className="bg-[#111]">Выберите категорию</option>
                  <option value="programming" className="bg-[#111]">Программирование</option>
                  <option value="marketing" className="bg-[#111]">Маркетинг</option>
                  <option value="finance" className="bg-[#111]">Финансы</option>
                  <option value="design" className="bg-[#111]">Дизайн</option>
                  <option value="business" className="bg-[#111]">Бизнес</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Уровень *</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition">
                  <option value="" className="bg-[#111]">Выберите уровень</option>
                  <option value="beginner" className="bg-[#111]">Начинающий</option>
                  <option value="intermediate" className="bg-[#111]">Средний</option>
                  <option value="advanced" className="bg-[#111]">Продвинутый</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Цена курса (₽) *</label>
              <input type="number" placeholder="2990" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition" />
            </div>
          </div>

          {/* Ссылки */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-lg">Ссылки</h2>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ссылка на курс *</label>
              <input type="url" placeholder="https://your-course-platform.com/course" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Промо-видео (YouTube, Vimeo)</label>
              <input type="url" placeholder="https://youtube.com/watch?v=..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ваш сайт или соцсети</label>
              <input type="url" placeholder="https://instagram.com/yourprofile" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition" />
            </div>
          </div>

          {/* Обложка */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-lg">Медиа</h2>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Обложка курса *</label>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-500/50 transition cursor-pointer">
                <div className="text-4xl mb-2">🖼</div>
                <div className="text-gray-400 text-sm">Перетащите файл или нажмите для загрузки</div>
                <div className="text-gray-600 text-xs mt-1">PNG, JPG до 5MB, рекомендуется 1280×720</div>
              </div>
            </div>
          </div>

          {/* Об авторе */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-lg">О себе</h2>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ваш опыт и экспертиза *</label>
              <textarea rows={3} placeholder="Расскажите о своём опыте в данной области, достижениях, почему студенты должны доверять вам..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Программа курса *</label>
              <textarea rows={5} placeholder="Модуль 1: Введение&#10;Модуль 2: Основы&#10;Модуль 3: Практика&#10;..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none" />
            </div>
          </div>

          {/* Согласие */}
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 accent-purple-600" />
            <span className="text-sm text-gray-400">
              Я подтверждаю что курс является моей интеллектуальной собственностью и соответствует{" "}
              <Link href="#" className="text-purple-400 hover:text-purple-300">правилам платформы Mano</Link>
            </span>
          </div>

          <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-lg transition">
            Отправить на проверку
          </button>
        </form>
      </div>
    </main>
  );
}