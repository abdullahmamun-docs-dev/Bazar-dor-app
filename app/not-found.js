
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fbfcf8] px-4 text-center">
      <div className="text-7xl" aria-hidden="true">
        🔎
      </div>

      <h1 className="mt-6 text-3xl font-extrabold text-[#176b43]">
        404 — পেজটি পাওয়া যায়নি
      </h1>

      <p className="mt-3 max-w-md text-gray-600">
        দুঃখিত! তুমি যে পেজটি খুঁজছ, সেটি পাওয়া যাচ্ছে না।
        লিংকটি পরীক্ষা করে আবার চেষ্টা করো।
      </p>

      <Link
        href="/"
        className="mt-7 rounded-xl bg-[#176b43] px-6 py-3 font-bold text-white transition hover:bg-[#105533]"
      >
        ← হোম পেজে ফিরে যাও
      </Link>
    </main>
  );
}
