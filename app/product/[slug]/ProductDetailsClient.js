
"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const toBanglaNumber = (value) =>
  String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);

const formatPrice = (price) => {
  if (price == null || price === "" || !Number.isFinite(Number(price))) {
    return "তথ্য নেই";
  }

  return `৳ ${Number(price).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  }).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit])}`;
};

export default function ProductDetailsClient({ product }) {
  const { addToCart } = useCart();

  const name =
    product.nameBn ??
    product.name ??
    product.title ??
    "পণ্যের নাম পাওয়া যায়নি";

  const category =
    product.categoryNameBn ??
    product.categoryBn ??
    product.categoryName ??
    product.category ??
    "অন্যান্য";

  const categoryIcon = product.categoryIcon ?? "🛒";
  const unit = product.unit ?? "প্রতি একক";
  const image = product.image ?? product.imageUrl ?? "";
  const today = product.today ?? product.price ?? product.todayPrice;
  const yesterday = product.yesterday ?? product.yesterdayPrice;
  const lastWeek = product.lastWeek;
  const lastMonth = product.lastMonth;
  const change = product.change ?? {};

  const markets = Array.isArray(product.markets)
    ? product.markets
    : [];

  const marketPrices = markets
    .map((market) => ({
      min: Number(market.min),
      max: Number(market.max),
    }))
    .filter(
      (market) =>
        Number.isFinite(market.min) &&
        Number.isFinite(market.max) &&
        market.min >= 0 &&
        market.max >= market.min
    );

  const lowestPrice =
    marketPrices.length > 0
      ? Math.min(...marketPrices.map((market) => market.min))
      : null;

  const highestPrice =
    marketPrices.length > 0
      ? Math.max(...marketPrices.map((market) => market.max))
      : null;

  const averagePrice =
    marketPrices.length > 0
      ? marketPrices.reduce(
          (sum, market) => sum + (market.min + market.max) / 2,
          0
        ) / marketPrices.length
      : null;

  function handleAddToCart() {
    const id = product.id ?? product._id ?? product.slug;

    if (id == null) {
      toast.error("এই পণ্যের ID পাওয়া যায়নি।");
      return;
    }

    if (
      today == null ||
      today === "" ||
      !Number.isFinite(Number(today))
    ) {
      toast.error("এই পণ্যের সঠিক দাম পাওয়া যায়নি।");
      return;
    }

    addToCart({
      ...product,
      id: String(id),
      name,
      nameBn: name,
      price: Number(today),
      today: Number(today),
      image,
    });

    toast.success(`${name} Cart-এ যোগ হয়েছে!`);
  }

  const changeDirection = String(change.dir ?? "").toLowerCase();
  const changePercent = Number(change.pct ?? 0);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 text-[#203328] sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#176b43]">
          হোম
        </Link>
        {" / "}
        <span>{category}</span>
        {" / "}
        <span className="font-medium text-gray-800">{name}</span>
      </nav>

      {/* Product overview */}
      <section className="grid gap-6 rounded-2xl border border-[#e5eadf] bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
        <div className="flex min-h-64 items-center justify-center rounded-xl bg-[#f0f5e9] p-8">
          {typeof image === "string" &&
          /^https?:\/\//i.test(image) ? (
            <img
              src={image}
              alt={name}
              className="max-h-64 w-full object-contain"
            />
          ) : (
            <span className="text-8xl" aria-hidden="true">
              {image || categoryIcon}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <span className="mb-4 w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
            {categoryIcon} {category}
          </span>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            {name}
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            একক: {unit}
          </p>

          <p className="mt-4 text-3xl font-extrabold text-[#176b43]">
            {formatPrice(today)}
            <span className="ml-2 text-base font-normal text-gray-500">
              / {unit}
            </span>
          </p>

          {Number.isFinite(changePercent) && change.pct != null && (
            <p
              className={`mt-3 text-sm font-bold ${
                changeDirection === "up"
                  ? "text-red-600"
                  : changeDirection === "down"
                    ? "text-green-700"
                    : "text-gray-500"
              }`}
            >
              {changeDirection === "up"
                ? "▲ দাম বেড়েছে"
                : changeDirection === "down"
                  ? "▼ দাম কমেছে"
                  : "— দাম অপরিবর্তিত"}
              {" "}
              {toBanglaNumber(changePercent)}%
            </p>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-6 w-full rounded-xl bg-[#176b43] px-5 py-3 font-bold text-white transition hover:bg-[#105533] sm:w-fit"
          >
            🛒 Add to Cart
          </button>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { label: "গতকালের দাম", price: yesterday },
              { label: "গত সপ্তাহের দাম", price: lastWeek },
              { label: "গত মাসের দাম", price: lastMonth },
              { label: "আজকের দাম", price: today },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-gray-50 p-4"
              >
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="mt-2 font-bold text-gray-800">
                  {formatPrice(item.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price summary */}
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-extrabold">
          বাজারদরের সারসংক্ষেপ
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "সর্বনিম্ন বাজারদর",
              price: lowestPrice,
              color: "text-green-700",
            },
            {
              label: "সর্বোচ্চ বাজারদর",
              price: highestPrice,
              color: "text-red-600",
            },
            {
              label: "গড় বাজারদর",
              price: averagePrice,
              color: "text-blue-700",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#e5eadf] bg-white p-5"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`mt-2 text-2xl font-extrabold ${item.color}`}>
                {formatPrice(item.price)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          গড় বাজারদর প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যবিন্দুর
          গড় হিসেবে হিসাব করা হয়েছে।
        </p>
      </section>

      {/* Market prices */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-extrabold">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <div className="rounded-xl border border-[#e5eadf] bg-white p-8 text-center">
            <p className="text-4xl">🏪</p>
            <p className="mt-3 font-semibold text-gray-700">
              এই পণ্যের বাজারভিত্তিক দাম পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#e5eadf] bg-white">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-[#f0f5e9] text-gray-700">
                <tr>
                  <th className="px-4 py-4 font-semibold">বাজারের নাম</th>
                  <th className="px-4 py-4 font-semibold">বিভাগ</th>
                  <th className="px-4 py-4 font-semibold">সর্বনিম্ন দাম</th>
                  <th className="px-4 py-4 font-semibold">সর্বোচ্চ দাম</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {markets.map((market, index) => (
                  <tr
                    key={`${market.market ?? market.marketName ?? "market"}-${index}`}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-medium">
                      {market.market ?? market.marketName ?? "নাম নেই"}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {market.division ?? "তথ্য নেই"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-green-700">
                      {formatPrice(market.min)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-red-600">
                      {formatPrice(market.max)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex rounded-xl border border-[#176b43] px-5 py-3 font-bold text-[#176b43] transition hover:bg-[#eef7ee]"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
