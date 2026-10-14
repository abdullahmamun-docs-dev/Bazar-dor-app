
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";

export default function Navbar({
  categories = [],
  selectedCategory = "all",
  onCategorySelect,
}) {
  const { data: session, isPending } = authClient.useSession();
  const { cartCount = 0 } = useCart();

  const user = session?.user;

  const toBanglaNumber = (value) =>
    String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);

  async function handleSignOut() {
    try {
      const result = await authClient.signOut();

      if (result?.error) {
        alert("লগআউট করা যায়নি। আবার চেষ্টা করো।");
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("লগআউট করার সময় সমস্যা হয়েছে।");
    }
  }

  const navButton =
    "inline-flex shrink-0 items-center justify-center rounded-lg px-2.5 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm";

  const categoryButton =
    "shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e5eadf] bg-white/95 backdrop-blur">
      {/* Main navigation */}
      <nav className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-1.5 text-lg font-extrabold text-[#176b43] sm:gap-2 sm:text-2xl"
          aria-label="বাজার দর হোম পেজ"
        >
          <span aria-hidden="true">🛒</span>
          <span>বাজার দর</span>
        </Link>

        {/* Navigation actions */}
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm">
          <Link
            href="/"
            className={`${navButton} text-[#176b43] hover:bg-[#eef7ee]`}
          >
            হোম
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`কার্টে ${toBanglaNumber(cartCount)}টি পণ্য`}
            className={`${navButton} gap-1 border border-[#176b43] text-[#176b43] hover:bg-[#eef7ee]`}
          >
            <span aria-hidden="true">🛒</span>
            <span>কার্ট</span>

            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] text-white">
                {toBanglaNumber(cartCount)}
              </span>
            )}
          </Link>

          {/* Authentication */}
          {isPending ? (
            <span className="px-1 text-xs text-gray-500">
              লোড হচ্ছে...
            </span>
          ) : user ? (
            <>
              <Link
                href="/profile"
                title={user.name || user.email || "প্রোফাইল"}
                className={`${navButton} max-w-24 truncate border border-[#176b43] text-[#176b43] hover:bg-[#eef7ee] sm:max-w-48`}
              >
                {user.name || "প্রোফাইল"}
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className={`${navButton} bg-red-600 text-white hover:bg-red-700`}
              >
                লগআউট
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className={`${navButton} border border-[#176b43] text-[#176b43] hover:bg-[#eef7ee]`}
              >
                লগইন
              </Link>

              <Link
                href="/signup"
                className={`${navButton} bg-[#176b43] text-white hover:bg-[#105533]`}
              >
                <span className="sm:hidden">সাইন আপ</span>
                <span className="hidden sm:inline">রেজিস্ট্রেশন</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Horizontally scrollable categories */}
      <div className="w-full border-t border-[#edf0e9]">
        <div
          className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto whitespace-nowrap px-3 py-2.5 sm:gap-3 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="পণ্যের ক্যাটাগরি"
        >
          <button
            type="button"
            onClick={() => onCategorySelect?.("all")}
            aria-pressed={selectedCategory === "all"}
            className={`${categoryButton} ${
              selectedCategory === "all"
                ? "bg-[#176b43] text-white"
                : "text-gray-600 hover:bg-[#eef7ee] hover:text-[#176b43]"
            }`}
          >
            সব পণ্য
          </button>

          {categories.map((category, index) => {
            const id =
              category?.slug ??
              category?.category ??
              category?.categoryId ??
              category?.id ??
              category?._id;

            if (id == null) return null;

            const categoryId = String(id);

            const name =
              category?.nameBn ??
              category?.categoryNameBn ??
              category?.name ??
              category?.categoryName ??
              category?.title ??
              "ক্যাটাগরি";

            const isSelected = selectedCategory === categoryId;

            return (
              <button
                key={categoryId || index}
                type="button"
                onClick={() => onCategorySelect?.(categoryId)}
                aria-pressed={isSelected}
                className={`${categoryButton} ${
                  isSelected
                    ? "bg-[#176b43] text-white"
                    : "text-gray-600 hover:bg-[#eef7ee] hover:text-[#176b43]"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
