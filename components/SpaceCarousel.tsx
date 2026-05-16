"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import DeleteCourseButton from "./DeleteCourseButton";

const CATEGORY_COLORS: Record<string, { pill: string; orb: string; glow: string; thumb: string; btn: string }> = {
  "Программирование": { pill: "rgba(124,58,237,0.2)", orb: "rgba(124,58,237,0.25)", glow: "rgba(124,58,237,0.7)", thumb: "#07041a", btn: "rgba(124,58,237,0.2)" },
  "Финансы":          { pill: "rgba(16,185,129,0.15)", orb: "rgba(16,185,129,0.22)", glow: "rgba(16,185,129,0.6)", thumb: "#02100d", btn: "rgba(16,185,129,0.15)" },
  "Маркетинг":        { pill: "rgba(245,158,11,0.15)", orb: "rgba(245,158,11,0.2)", glow: "rgba(245,158,11,0.55)", thumb: "#100a02", btn: "rgba(245,158,11,0.15)" },
  "Дизайн":           { pill: "rgba(244,114,182,0.15)", orb: "rgba(244,114,182,0.2)", glow: "rgba(244,114,182,0.55)", thumb: "#080210", btn: "rgba(244,114,182,0.15)" },
  "Бизнес":           { pill: "rgba(96,165,250,0.15)", orb: "rgba(96,165,250,0.2)", glow: "rgba(96,165,250,0.55)", thumb: "#02060e", btn: "rgba(96,165,250,0.15)" },
};

const DEFAULT_C = { pill: "rgba(139,92,246,0.15)", orb: "rgba(139,92,246,0.2)", glow: "rgba(139,92,246,0.6)", thumb: "#07061a", btn: "rgba(139,92,246,0.15)" };

const EMOJI: Record<string, string> = {
  "Программирование": "💻", "Финансы": "📈", "Маркетинг": "🚀", "Дизайн": "🎨", "Бизнес": "💼",
};

const PILL_TEXT: Record<string, string> = {
  "Программирование": "#c4b5fd", "Финансы": "#6ee7b7", "Маркетинг": "#fcd34d", "Дизайн": "#f9a8d4", "Бизнес": "#93c5fd",
};

export default function SpaceCarousel({ courses, canDelete }: { courses: any[]; canDelete: boolean }) {
  const [current, setCurrent] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastWheel = useRef(0);

  // Stars animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() < 0.5 ? 0.5 : Math.random() < 0.6 ? 1 : 1.5,
      o: 0.08 + Math.random() * 0.5,
      s: 0.003 + Math.random() * 0.008,
      p: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.p += s.s;
        const op = s.o * (0.4 + 0.6 * Math.sin(s.p));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // Wheel scroll
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel.current < 400) return;
      lastWheel.current = now;
      if (e.deltaY > 0) setCurrent(c => Math.min(courses.length - 1, c + 1));
      else setCurrent(c => Math.max(0, c - 1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [courses.length]);

  const goTo = (i: number) => setCurrent(Math.max(0, Math.min(courses.length - 1, i)));

  return (
    <div className="relative flex flex-col" style={{ height: "calc(100vh - 58px)" }}>

      {/* Stars */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

      {/* Banners */}
      <div className="relative z-10 px-8 pt-5 flex flex-col gap-3 flex-shrink-0">

        {/* Pro banner */}
        <div className="relative rounded-[14px] overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.35)", background: "#07061a" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.12),transparent 55%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.05) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative flex items-center justify-between px-6 py-4">
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#a78bfa] mb-2" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20, padding: "2px 10px", display: "inline-block" }}>AUTHOR PRO</div>
              <div className="text-[17px] font-semibold text-white mb-1 tracking-tight">Продавай без ограничений</div>
              <div className="text-xs text-white/35 max-w-sm">Неограниченное количество курсов, приоритет в каталоге и детальная аналитика</div>
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-6">
              <div className="text-right">
                <div className="text-[22px] font-semibold text-white tracking-tight">4 490 ₽</div>
                <div className="text-[11px] text-white/30">в месяц</div>
              </div>
              <Link href="/profile" className="text-xs font-bold px-4 py-2.5 rounded-[9px] text-white whitespace-nowrap" style={{ background: "linear-gradient(135deg,#7c3aed,#4c1d95)", border: "1px solid rgba(139,92,246,0.5)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}>
                Подключить →
              </Link>
            </div>
          </div>
        </div>

        {/* Ads */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { bg: "rgba(16,185,129,0.04)", border: "rgba(16,185,129,0.2)", stripe: "#10b981", icon: "📈", tag: "ФИНАНСЫ · ТОП", tagColor: "#10b981", title: "P2P-трейдинг: стабильный доход", sub: "Проверенные стратегии от практика" },
            { bg: "rgba(245,158,11,0.04)", border: "rgba(245,158,11,0.18)", stripe: "#f59e0b", icon: "🎯", tag: "МАРКЕТИНГ · НОВИНКА", tagColor: "#f59e0b", title: "Таргет в VK и Telegram Ads", sub: "Кампании и аналитика без агентства" },
          ].map((ad, i) => (
            <div key={i} className="relative rounded-[12px] overflow-hidden cursor-pointer" style={{ background: ad.bg, border: `1px solid ${ad.border}` }}>
              <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: `linear-gradient(to bottom,transparent,${ad.stripe},transparent)` }} />
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[18px] shrink-0" style={{ background: `${ad.bg}`, border: `1px solid ${ad.border}` }}>{ad.icon}</div>
                <div>
                  <div className="text-[10px] font-bold tracking-wide mb-1" style={{ color: ad.tagColor }}>{ad.tag}</div>
                  <div className="text-[13px] font-medium text-white/85">{ad.title}</div>
                  <div className="text-[11px] text-white/28">{ad.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Catalog label */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-4 pb-2 flex-shrink-0">
        <span className="text-[13px] font-semibold text-white/40 uppercase tracking-widest">Все курсы</span>
        <span className="text-[11px] text-white/20">↕ прокрутите колесо мыши</span>
      </div>

      {/* Carousel */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
        {courses.length === 0 ? (
          <div className="text-center">
            <div className="text-5xl mb-4">🚀</div>
            <p className="text-white/40 text-sm mb-4">Курсов пока нет</p>
            <Link href="/submit" className="px-6 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#4c1d95)" }}>Предложить курс →</Link>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            {courses.map((course, idx) => {
              const diff = idx - current;
              const c = CATEGORY_COLORS[course.category] || DEFAULT_C;
              const emoji = EMOJI[course.category] || "📚";
              const pillText = PILL_TEXT[course.category] || "#c4b5fd";
              const authorName = (course.users as any)?.name || "Автор";
              const initials = authorName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
              const isActive = diff === 0;
              const isSide = Math.abs(diff) === 1;
              const isVisible = Math.abs(diff) <= 2;

              if (!isVisible) return null;

              const scale = isActive ? 1 : isSide ? 0.88 : 0.78;
              const translateX = diff * 320;
              const translateY = isActive ? 0 : isSide ? 12 : 24;
              const opacity = isActive ? 1 : isSide ? 0.6 : 0.3;
              const zIndex = isActive ? 10 : isSide ? 5 : 1;

              return (
                <div
                  key={course.id}
                  className="absolute"
                  style={{
                    transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: "all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
                    cursor: isActive ? "default" : "pointer",
                  }}
                  onClick={() => !isActive && goTo(idx)}
                >
                  <div
                    className="relative overflow-hidden flex flex-col"
                    style={{
                      width: 300,
                      height: 400,
                      borderRadius: 24,
                      border: isActive ? `1px solid rgba(139,92,246,0.5)` : "1px solid rgba(255,255,255,0.07)",
                      boxShadow: isActive ? `0 0 60px rgba(139,92,246,0.15), 0 30px 60px rgba(0,0,0,0.6)` : "0 20px 40px rgba(0,0,0,0.4)",
                      background: "#050509",
                    }}
                  >
                    {/* Thumb */}
                    <div className="relative overflow-hidden flex-shrink-0" style={{ height: 210, background: c.thumb }}>
                      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
                      <div className="absolute rounded-full" style={{ width: 180, height: 180, top: -60, right: -50, background: `radial-gradient(circle,${c.orb},transparent 70%)` }} />
                      <div className="absolute rounded-full" style={{ width: 90, height: 90, bottom: -20, left: -10, background: `radial-gradient(circle,${c.orb},transparent 70%)` }} />
                      <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-62%)", fontSize: 60, lineHeight: 1, filter: `drop-shadow(0 0 24px ${c.glow})` }}>
                        {emoji}
                      </div>
                      <div className="absolute bottom-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-[8px]" style={{ background: c.pill, color: pillText, border: `1px solid ${c.pill.replace("0.15", "0.3").replace("0.2", "0.35")}` }}>
                        {course.category}
                      </div>
                      {canDelete && isActive && (
                        <div className="absolute top-2 right-2">
                          <DeleteCourseButton courseId={course.id} />
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-[18px]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: c.pill, color: pillText }}>
                          {initials}
                        </div>
                        <span className="text-xs text-white/30">{authorName}</span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-white/92 leading-snug mb-2 tracking-tight">
                        {course.title}
                      </h3>
                      <p className="text-[12px] text-white/30 leading-relaxed flex-1 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-[19px] font-semibold text-white tracking-tight">
                          {Number(course.price).toLocaleString("ru")} <span className="text-xs text-white/28 font-normal">₽</span>
                        </div>
                        <Link
                          href={`/courses/${course.id}`}
                          className="text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition"
                          style={{ background: c.btn, color: pillText, border: `1px solid ${c.pill.replace("0.15","0.3")}` }}
                          onClick={e => e.stopPropagation()}
                        >
                          Подробнее →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dots */}
      {courses.length > 0 && (
        <div className="relative z-10 flex items-center justify-center gap-2 pb-5 flex-shrink-0">
          {courses.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 5,
                height: 5,
                background: i === current ? "#7c3aed" : "rgba(255,255,255,0.15)",
                borderRadius: i === current ? 3 : "50%",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}