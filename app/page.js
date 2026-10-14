
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { API_ENDPOINTS } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const toBanglaNumber = (value) =>
  String(value ?? "").replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);

const getUnitLabel = (unit) => {
  const units = {
    kg: "প্রতি কেজি",
    litre: "প্রতি লিটার",
    liter: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
  };

  return units[String(unit || "").toLowerCase()] || `প্রতি ${unit || "একক"}`;
};

const getProductId = (product) =>
  product?.id ?? product?._id ?? product?.slug;

const getCategoryId = (category) =>
  category?.slug ??
  category?.category ??
  category?.categoryId ??
  category?.id ??
  category?._id;

const getCategoryName = (category) =>
  category?.nameBn ??
  category?.categoryNameBn ??
  category?.name ??
  category?.categoryName ??
  category?.title ??
  getCategoryId(category) ??
  "ক্যাটাগরি";

const extractArray = (json, type) => {
  if (Array.isArray(json)) return json;

  const data = json?.data;

  if (Array.isArray(data)) return data;

  if (type === "categories") {
    if (Array.isArray(json?.categories)) return json.categories;
    if (Array.isArray(data?.categories)) return data.categories;
    if (Array.isArray(data?.data)) return data.data;
  }

  if (type === "products") {
    if (Array.isArray(json?.products)) return json.products;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(json?.result)) return json.result;
  }

  return [];
};

const getChangeValue = (product) => {
  const percentage = product?.change?.pct;

  if (
    percentage !== null &&
    percentage !== undefined &&
    percentage !== "" &&
    Number.isFinite(Number(percentage))
  ) {
    return Number(percentage);
  }

  const today = Number(
    product?.today ?? product?.price ?? product?.todayPrice
  );

  const yesterday = Number(
    product?.yesterday ?? product?.yesterdayPrice
  );

  if (
    Number.isFinite(today) &&
    Number.isFinite(yesterday) &&
    (product?.yesterday != null || product?.yesterdayPrice != null)
  ) {
    return today - yesterday;
  }

  return 0;
};

const getChangeDirection = (product) => {
  const direction = product?.change?.dir;

  if (["up", "down", "flat"].includes(direction)) {
    return direction;
  }

  const today = Number(
    product?.today ?? product?.price ?? product?.todayPrice
  );

  const yesterday = Number(
    product?.yesterday ?? product?.yesterdayPrice
  );

  if (
    product?.yesterday != null ||
    product?.yesterdayPrice != null
  ) {
    if (today > yesterday) return "up";
    if (today < yesterday) return "down";
  }

  return "flat";
};

const matchesCategory = (product, category, selectedId) => {
  const productCategoryValues = [
    product?.category,
    product?.categoryId,
    product?.categorySlug,
    product?.categoryNameBn,
    product?.categoryName,
  ]
    .filter((value) => value != null)
    .map((value) => String(value).toLowerCase());

  const categoryValues = [
    getCategoryId(category),
    category?.slug,
    category?.category,
    category?.categoryId,
    category?.id,
    category?._id,
    getCategoryName(category),
  ]
    .filter((value) => value != null)
    .map((value) => String(value).toLowerCase());

  return (
    productCategoryValues.includes(String(selectedId).toLowerCase()) ||
    categoryValues.some((value) => productCategoryValues.includes(value))
  );
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { addToCart } = useCart();

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [categoryResponse, productResponse] = await Promise.all([
          fetch(API_ENDPOINTS.categories, {
            signal: controller.signal,
            cache: "no-store",
          }),
          fetch(API_ENDPOINTS.products, {
            signal: controller.signal,
            cache: "no-store",
          }),
        ]);

        if (!categoryResponse.ok || !productResponse.ok) {
          throw new Error("API থেকে তথ্য পাওয়া যায়নি");
        }

        const [categoryData, productData] = await Promise.all([
          categoryResponse.json(),
          productResponse.json(),
        ]);

        const categoryList = extractArray(categoryData, "categories");
        const productList = extractArray(productData, "products");

        if (productList.length === 0) {
          throw new Error("পণ্যের তালিকা খালি পাওয়া গেছে");
        }

        setCategories(categoryList);
        setProducts(productList);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Bazar Dor API error:", err);

        setError(
          "পণ্যের তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => controller.abort();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => {
          const category = categories.find(
            (item) =>
              String(getCategoryId(item)) === String(selectedCategory)
          );

          if (!category) {
            return (
              String(product?.category) === String(selectedCategory) ||
              String(product?.categoryId) === String(selectedCategory) ||
              String(product?.categorySlug) === String(selectedCategory)
            );
          }

          return matchesCategory(product, category, selectedCategory);
        });

  const risingProducts = [...products]
    .filter((product) => getChangeDirection(product) === "up")
    .sort((a, b) => getChangeValue(b) - getChangeValue(a))
    .slice(0, 6);

  const fallingProducts = [...products]
    .filter((product) => getChangeDirection(product) === "down")
    .sort((a, b) => getChangeValue(a) - getChangeValue(b))
    .slice(0, 6);

  const renderProductCard = (product, index) => {
    const id = getProductId(product);

    const name =
      product?.nameBn ?? product?.name ?? product?.title ?? "পণ্য";

    const price =
      product?.today ?? product?.price ?? product?.todayPrice;

    const yesterday =
      product?.yesterday ?? product?.yesterdayPrice;

    const direction = getChangeDirection(product);
    const change = product?.change;

    const imageUrl =
      typeof product?.image === "string" &&
      /^https?:\/\//i.test(product.image)
        ? product.image
        : typeof product?.imageUrl === "string" &&
            /^https?:\/\//i.test(product.imageUrl)
          ? product.imageUrl
          : "";

    const icon =
      typeof product?.image === "string" &&
      !/^https?:\/\//i.test(product.image)
        ? product.image
        : product?.categoryIcon ?? product?.icon ?? "🛒";

    const handleAddToCart = () => {
      if (id == null) {
        toast.error("এই পণ্যের ID পাওয়া যায়নি।");
        return;
      }

      if (price == null || !Number.isFinite(Number(price))) {
        toast.error("এই পণ্যের সঠিক দাম পাওয়া যায়নি।");
        return;
      }

      addToCart(product);
      toast.success(`${name} Cart-এ যোগ হয়েছে!`);
    };

    return (
      <article
        key={id ?? index}
        className="flex flex-col overflow-hidden rounded-2xl border border-[#e8eadf] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
      >
        <div className="flex h-36 items-center justify-center bg-[#f0f4e9]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-contain p-4"
              loading="lazy"
            />
          ) : (
            <span className="text-6xl" role="img" aria-label={name}>
              {icon}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-bold text-[#218653]">
            {product?.categoryNameBn ??
              product?.categoryName ??
              "নিত্যপ্রয়োজনীয় পণ্য"}
          </p>

          <h3 className="mt-2 text-lg font-extrabold">{name}</h3>

          <p className="mt-2 text-sm text-gray-500">
            একক: {getUnitLabel(product?.unit)}
          </p>

          <div className="mt-4 rounded-xl bg-[#f0f7ef] p-4">
            <p className="text-sm text-gray-600">আজকের দাম</p>

            <p className="mt-1 text-2xl font-extrabold text-[#176b43]">
              {price != null ? `৳ ${toBanglaNumber(price)}` : "দাম নেই"}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-600">
              {getUnitLabel(product?.unit)}
            </p>
          </div>

          {yesterday != null && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-gray-500">গতকালের দাম</span>

              <span className="font-semibold text-gray-800">
                ৳ {toBanglaNumber(yesterday)}
              </span>
            </div>
          )}

          <p
            className={`mt-3 inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${
              direction === "up"
                ? "bg-green-100 text-green-700"
                : direction === "down"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {direction === "up"
              ? "▲ দাম বেড়েছে"
              : direction === "down"
                ? "▼ দাম কমেছে"
                : "● দাম অপরিবর্তিত"}

            {change?.pct != null && (
              <span>
                ({toBanglaNumber(Math.abs(Number(change.pct)))}%)
              </span>
            )}
          </p>

          <div className="mt-auto space-y-3 pt-5">
            <button
              type="button"
              disabled={id == null}
              onClick={handleAddToCart}
              className="w-full rounded-xl border border-[#176b43] bg-white px-4 py-3 font-bold text-[#176b43] transition hover:bg-[#e8f4e8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              🛒 Add to Cart
            </button>

            {id != null ? (
              <Link
                href={`/product/${encodeURIComponent(id)}`}
                className="block rounded-xl bg-[#176b43] px-4 py-3 text-center font-bold text-white transition hover:bg-[#105533]"
              >
                বিস্তারিত দেখুন →
              </Link>
            ) : (
              <p className="rounded-xl bg-gray-100 px-4 py-3 text-center text-sm text-gray-500">
                বিস্তারিত পাওয়া যাচ্ছে না
              </p>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <main className="min-h-screen bg-[#fbfcf8] text-[#203328]">
      <style jsx global>{`
        @keyframes market-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .market-marquee {
          animation: market-marquee 35s linear infinite;
          width: max-content;
        }

        .market-marquee:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .market-marquee {
            animation: none;
          }
        }
      `}</style>

      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Live price ticker */}
      <section
        className="overflow-hidden bg-[#173e2b] py-3 text-white"
        aria-label="বাজারদরের চলমান তালিকা"
      >
        {loading ? (
          <p className="px-4 text-center text-sm">
            আজকের বাজারদরের তথ্য লোড হচ্ছে...
          </p>
        ) : products.length > 0 ? (
          <div className="market-marquee flex">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-8 pr-8"
                aria-hidden={copy === 1}
              >
                {products.map((product, index) => {
                  const direction = getChangeDirection(product);
                  const name = product?.nameBn ?? product?.name ?? "পণ্য";

                  return (
                    <span
                      key={`${copy}-${getProductId(product) ?? index}`}
                      className="whitespace-nowrap text-sm font-semibold"
                    >
                      {name}: ৳
                      {toBanglaNumber(
                        product?.today ??
                          product?.price ??
                          product?.todayPrice ??
                          "—"
                      )}

                      <span
                        className={`ml-2 ${
                          direction === "up"
                            ? "text-green-300"
                            : direction === "down"
                              ? "text-red-300"
                              : "text-gray-300"
                        }`}
                      >
                        {direction === "up"
                          ? "▲"
                          : direction === "down"
                            ? "▼"
                            : "●"}
                      </span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <p className="px-4 text-center text-sm">
            বাজারদরের তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8">
        <div>
          <p className="mb-4 inline-block rounded-full bg-[#e8f4e8] px-4 py-2 text-sm font-bold text-[#176b43]">
            প্রতিদিনের বাজারদর, এক জায়গায়
          </p>

          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            বাজার করার আগে
            <span className="mt-2 block text-[#218653]">
              জেনে নিন সঠিক দাম
            </span>
          </h1>

          <p className="mt-5 max-w-xl leading-8 text-gray-600">
            চাল, ডাল, তেল, মাছ, মাংসসহ নিত্যপ্রয়োজনীয় পণ্যের
            আজকের দাম ও আগের দিনের দামের পরিবর্তন দেখুন।
          </p>

          <a
            href="#products"
            className="mt-7 inline-block rounded-xl bg-[#176b43] px-6 py-3 font-bold text-white transition hover:bg-[#105533]"
          >
            পণ্যের দাম দেখুন ↓
          </a>
        </div>

        <div className="flex min-h-56 items-center justify-center rounded-3xl bg-[#edf4e6] p-8 sm:min-h-72">
          <img
            src="/bazar-hero.png"
            alt="নিত্যপ্রয়োজনীয় বাজারের পণ্য"
            className="max-h-72 w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />

          <span className="hidden text-6xl" aria-hidden="true">
            🥦 🥚 🐟
          </span>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold">পণ্যের ক্যাটাগরি</h2>

          <p className="mt-2 text-sm text-gray-500">
            ক্যাটাগরি নির্বাচন করে পণ্য দেখুন।
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selectedCategory === "all"
                ? "border-[#176b43] bg-[#176b43] text-white"
                : "border-[#dce5d8] bg-white hover:border-[#176b43]"
            }`}
          >
            🛍️ সব পণ্য
          </button>

          {categories.map((category, index) => {
            const id = getCategoryId(category);

            if (id == null) return null;

            return (
              <button
                key={id ?? index}
                type="button"
                onClick={() => setSelectedCategory(String(id))}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === String(id)
                    ? "border-[#176b43] bg-[#176b43] text-white"
                    : "border-[#dce5d8] bg-white hover:border-[#176b43]"
                }`}
              >
                {category?.icon ?? category?.categoryIcon ?? "🛒"}{" "}
                {getCategoryName(category)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Top price risers */}
      {!loading && !error && risingProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold">
              📈 সবচেয়ে বেশি দাম বেড়েছে
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              দাম বৃদ্ধির পরিমাণ অনুযায়ী প্রথম ৬টি পণ্য।
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {risingProducts.map((product, index) =>
              renderProductCard(product, index)
            )}
          </div>
        </section>
      )}

      {/* Top price fallers */}
      {!loading && !error && fallingProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold">
              📉 সবচেয়ে বেশি দাম কমেছে
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              দাম কমার পরিমাণ অনুযায়ী প্রথম ৬টি পণ্য।
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {fallingProducts.map((product, index) =>
              renderProductCard(product, index)
            )}
          </div>
        </section>
      )}

      {/* All products */}
      <section
        id="products"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              {selectedCategory === "all" ? "সব পণ্য" : "নির্বাচিত পণ্য"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              প্রতিটি পণ্যের বর্তমান বাজারদর ও একক দেখুন।
            </p>
          </div>

          {!loading && !error && (
            <span className="rounded-full bg-[#e8f4e8] px-4 py-2 text-sm font-bold text-[#176b43]">
              মোট {toBanglaNumber(filteredProducts.length)}টি পণ্য
            </span>
          )}
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5"
              >
                <div className="h-24 rounded-xl bg-gray-200" />
                <div className="mt-5 h-5 rounded bg-gray-200" />
                <div className="mt-3 h-4 w-2/3 rounded bg-gray-200" />
                <div className="mt-5 h-10 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
            <p className="font-semibold text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-[#176b43] px-5 py-3 font-semibold text-white"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।

            <div>
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="mt-4 rounded-lg bg-[#176b43] px-5 py-3 font-semibold text-white"
              >
                সব পণ্য দেখুন
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) =>
              renderProductCard(product, index)
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-8 bg-[#173e2b] px-4 py-8 text-center text-white">
        <p className="text-lg font-extrabold">🛒 বাজার দর</p>

        <p className="mt-2 text-sm text-white/80">
          নিত্যপ্রয়োজনীয় পণ্যের বাজারদর জানুন সহজেই।
        </p>

        <p className="mt-4 text-sm text-white/80">
          © ২০২৬ বাজার দর। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </footer>
    </main>
  );
}
