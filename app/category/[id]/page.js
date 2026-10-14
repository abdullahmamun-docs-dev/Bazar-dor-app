
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api";

function CategoryContent() {
  const params = useParams();
  const categoryId = params.id;

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!categoryId) return;

    let cancelled = false;

    async function loadCategory() {
      setLoading(true);
      setError("");
      setProducts([]);
      setCategory(null);

      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch(API_ENDPOINTS.categories),
          fetch(API_ENDPOINTS.filteredProducts(categoryId)),
        ]);

        if (!categoriesResponse.ok || !productsResponse.ok) {
          throw new Error("API request failed");
        }

        const categoriesData = await categoriesResponse.json();
        const productsData = await productsResponse.json();

        const categories = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData?.data ?? categoriesData?.categories ?? [];

        const productList = Array.isArray(productsData)
          ? productsData
          : productsData?.data ?? productsData?.products ?? [];

        const foundCategory = categories.find(
          (item) => item.id === categoryId || item.slug === categoryId
        );

        if (cancelled) return;

        if (!foundCategory) {
          setCategory(null);
          setProducts([]);
          return;
        }

        setCategory(foundCategory);
        setProducts(productList);
      } catch (err) {
        console.error("Category loading error:", err);

        if (!cancelled) {
          setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করো।");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategory();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sort === "low-high") {
      list.sort((a, b) => Number(a.today ?? 0) - Number(b.today ?? 0));
    } else if (sort === "high-low") {
      list.sort((a, b) => Number(b.today ?? 0) - Number(a.today ?? 0));
    }

    return list;
  }, [products, sort]);

  function formatPrice(price) {
    if (price == null || !Number.isFinite(Number(price))) {
      return "দাম পাওয়া যায়নি";
    }

    return `৳${Number(price).toLocaleString("bn-BD")}`;
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-sm text-green-700 hover:underline">
            ← হোম পেজ
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {category
              ? `${category.icon || "🛒"} ${category.nameBn}`
              : "ক্যাটাগরি"}
          </h1>

          <p className="mt-2 text-gray-500">
            {loading
              ? "পণ্য লোড হচ্ছে..."
              : `${sortedProducts.length}টি পণ্য পাওয়া গেছে`}
          </p>
        </div>

        <div className="w-full sm:w-64">
          <label
            htmlFor="sort"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            দাম অনুযায়ী সাজাও
          </label>

          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-600"
          >
            <option value="default">Default Sorting</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="mb-4 h-32 rounded-lg bg-gray-200" />
              <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
              <div className="mb-5 h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-10 rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-green-700 px-5 py-2 text-white hover:bg-green-800"
          >
            আবার চেষ্টা করো
          </button>
        </div>
      ) : !category ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-lg font-semibold text-gray-800">
            এই ক্যাটাগরি পাওয়া যায়নি।
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
          >
            হোম পেজে ফিরে যাও
          </Link>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-lg font-semibold text-gray-800">
            এই ক্যাটাগরিতে এখন কোনো পণ্য নেই।
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
          >
            অন্য পণ্য দেখো
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <article
              key={product.id ?? product.slug}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-green-50">
                {typeof product.image === "string" &&
                /^https?:\/\//i.test(product.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.nameBn || "পণ্য"}
                    className="h-full w-full rounded-lg object-contain p-3"
                  />
                ) : (
                  <span className="text-6xl" aria-hidden="true">
                    {product.image || product.categoryIcon || "🛒"}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-gray-900">
                {product.nameBn || product.name || "পণ্যের নাম"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {product.categoryNameBn || category.nameBn}
              </p>

              <p className="mt-3 text-xl font-bold text-green-700">
                {formatPrice(product.today)}
                <span className="ml-1 text-sm font-normal text-gray-500">
                  / {product.unit || "একক"}
                </span>
              </p>

              {product.yesterday != null && (
                <p className="mt-1 text-sm text-gray-500">
                  গতকাল: {formatPrice(product.yesterday)}
                </p>
              )}

              <Link
                href={`/product/${product.slug ?? product.id}`}
                className="mt-5 block rounded-lg bg-green-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-800"
              >
                বিস্তারিত দেখো
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-4 py-12">
          <div className="animate-pulse text-gray-500">
            ক্যাটাগরির পণ্য লোড হচ্ছে...
          </div>
        </main>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
