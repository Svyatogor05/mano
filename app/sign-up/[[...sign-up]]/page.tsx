import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#030303] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Mano
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Создайте аккаунт бесплатно</p>
        </div>
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-2xl blur-xl" />
          <div className="relative">
            <SignUp />
          </div>
        </div>
      </div>
    </main>
  );
}