"use client";

import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import Link from "next/link";

interface Props {
  user: { name: string; email: string; role: string };
  isPro: boolean;
  roleLabel: string;
}

export default function ProfileHeader({ user, isPro, roleLabel }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const initials = user.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <>
      {modalOpen && <EditProfileModal user={user} onClose={() => setModalOpen(false)} />}

      <div className="rounded-[18px] border border-white/[0.07] bg-[#10101a] p-6 relative">
        
        <div className="flex items-center gap-5">
          <button onClick={() => setModalOpen(true)} className="relative shrink-0 group" title="Редактировать профиль">
            <div className="w-16 h-16 rounded-2xl bg-[#6c5ce7]/20 border border-[#6c5ce7]/30 flex items-center justify-center text-xl font-medium text-[#a89cf7] group-hover:border-[#6c5ce7]/70 transition">
              {initials}
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-lg bg-[#6c5ce7] border-2 border-[#10101a] flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition">
              ✏️
            </div>
          </button>

          <div className="flex-1 min-w-0 pr-28">
            <button onClick={() => setModalOpen(true)} className="text-[18px] font-medium text-white hover:text-[#a89cf7] transition mb-1 text-left block">
              {user.name || "Без имени"}
            </button>
            <div className="text-[13px] text-white/35 mb-3">{user.email}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#6c5ce7]/15 text-[#a89cf7] border border-[#6c5ce7]/25">{roleLabel}</span>
              {isPro && <span className="text-[11px] px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">⭐ Pro</span>}
              {["admin", "owner"].includes(user.role) && (
                <Link href="/admin" className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.06] text-white/45 border border-white/10 hover:border-white/20 transition">⚙️ Панель управления</Link>
              )}
              {["moderator", "admin", "owner"].includes(user.role) && (
                <Link href="/moderation" className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.06] text-white/45 border border-white/10 hover:border-white/20 transition">🛡️ Модерация</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}