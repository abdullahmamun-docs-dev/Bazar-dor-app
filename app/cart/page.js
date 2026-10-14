
"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const toBanglaNumber = (value) =>
  String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const formatPrice = (price) =>
    `৳ ${toBanglaNumber(Number(price).toLocaleString("en-IN"))}`;

  return (
    <main className="min-h-screen bg-[#fbfcf8] px-4 py-10 text-[#203328] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">
              🛒 আমার Cart
            </h1>

            <p className="mt-2 text-gray-500">
              মোট {toBanglaNumber(cartCount)}টি পণ্য
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-[#176b43] px-5 py-3 font-bold text-white hover:bg-[#105533]"
          >
            ← কেনাকাটা চালিয়ে যান
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-[#e8eadf] bg-white px-5 py-16 text-center shadow-sm">
            <p className="text-6xl">🛍️</p>

            <h2 className="mt-5 text-2xl font-bold">
              তোমার Cart এখন খালি
            </h2>

            <p className="mt-3 text-gray-500">
              Home Page থেকে পছন্দের পণ্য Cart-এ যোগ করো।
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-[#176b43] px-6 py-3 font-bold text-white hover:bg-[#105533]"
            >
              পণ্য দেখুন
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
            <section className="space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[#e8eadf] bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0f4e9]">
                    {item.image &&
                    /^https?:\/\//i.test(item.image) ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-4xl">
                        {item.image || "🛒"}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold">
                      {item.name}
                    </h2>

                    <p className="mt-2 text-[#176b43] font-extrabold">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        aria-label="পরিমাণ কমাও"
                        className="h-9 w-9 rounded-lg border disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="min-w-6 text-center font-bold">
                        {toBanglaNumber(item.quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        aria-label="পরিমাণ বাড়াও"
                        className="h-9 w-9 rounded-lg border"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-sm font-semibold text-red-600 hover:text-red-800"
                      >
                        সরিয়ে ফেলুন
                      </button>
                    </div>
                  </div>

                  <div className="font-extrabold sm:text-right">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </article>
              ))}

              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg px-2 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                সব পণ্য সরিয়ে ফেলুন
              </button>
            </section>

            <aside className="rounded-2xl border border-[#e8eadf] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-extrabold">
                অর্ডারের সারাংশ
              </h2>

              <div className="mt-5 flex justify-between gap-3 text-gray-600">
                <span>মোট পণ্য</span>
                <span>{toBanglaNumber(cartCount)}টি</span>
              </div>

              <div className="mt-4 flex justify-between gap-3 text-gray-600">
                <span>পণ্যের মোট দাম</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <div className="my-5 border-t border-dashed" />

              <div className="flex justify-between gap-3 text-lg font-extrabold">
                <span>সর্বমোট</span>
                <span className="text-[#176b43]">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                ডেলিভারি চার্জ বা অন্যান্য খরচ থাকলে তা এখানে অন্তর্ভুক্ত নয়।
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
