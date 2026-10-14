
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

export const instant = false;

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  // Authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(
      `/signin?callbackURL=${encodeURIComponent(`/product/${slug}`)}`
    );
  }

  let product;

  try {
    const response = await fetch(API_ENDPOINTS.product(slug), {
      cache: "no-store",
    });

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error("Product API request failed");
    }

    const result = await response.json();

    // API returns the product object directly
    product = result?.data ?? result?.product ?? result;

    if (
      !product ||
      typeof product !== "object" ||
      Array.isArray(product) ||
      product.id == null
    ) {
      notFound();
    }
  } catch (error) {
    if (error?.digest?.startsWith("NEXT_HTTP_ERROR_FALLBACK")) {
      throw error;
    }

    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  const {
    nameBn,
    categoryNameBn,
    categoryIcon,
    unit,
    image,
    today,
    yesterday,
    lastWeek,
    lastMonth,
    change,
    markets = [],
  } = product;

  const marketMins = markets
    .map((market) => Number(market.min))
    .filter(Number.isFinite);

  const marketMaxes = markets
    .map((market) => Number(market.max))
    .filter(Number.isFinite);

  const lowestPrice =
    marketMins.length > 0 ? Math.min(...marketMins) : null;

  const highestPrice =
    marketMaxes.length > 0 ? Math.max(...marketMaxes) : null;

  const averagePrice =
    marketMins.length > 0 && marketMaxes.length > 0
      ? (
          [...marketMins, ...marketMaxes].reduce(
            (total, price) => total + price,
            0
          ) /
          (marketMins.length + marketMaxes.length)
        ).toFixed(2)
      : null;

  const formatPrice = (price) =>
    price == null || !Number.isFinite(Number(price))
      ? "তথ্য নেই"
      : `৳${Number(price).toLocaleString("bn-BD")}`;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        হোম / {categoryNameBn || "পণ্য"} / {nameBn || "পণ্যের বিবরণ"}
      </div>

      {/* Product overview */}
      <section className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
        <div className="flex min-h-64 items-center justify-center rounded-xl bg-green-50 p-8">
          {typeof image === "string" &&
          /^https?:\/\//i.test(image) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={nameBn || "পণ্য"}
              className="max-h-64 w-full object-contain"
            />
          ) : (
            <span className="text-8xl" aria-hidden="true">
              {image || categoryIcon || "🛒"}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              {categoryIcon || "🛒"} {categoryNameBn || "অন্যান্য"}
            </span>
          </div>

          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            {nameBn || "পণ্যের নাম পাওয়া যায়নি"}
          </h1>

          <p className="mb-2 text-sm text-gray-500">
            একক: {unit || "প্রযোজ্য নয়"}
          </p>

          <p className="mb-3 text-3xl font-extrabold text-green-700">
            {formatPrice(today)}
            <span className="ml-2 text-base font-normal text-gray-500">
              / {unit || "একক"}
            </span>
          </p>

          {change?.pct != null && (
            <p
              className={`mb-5 text-sm font-semibold ${
                change.dir === "up" ? "text-red-600" : "text-green-600"
              }`}
            >
              {change.dir === "up" ? "▲ দাম বেড়েছে" : "▼ দাম কমেছে"}{" "}
              {change.pct}%
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">গতকালের দাম</p>
              <p className="mt-1 font-bold text-gray-800">
                {formatPrice(yesterday)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">গত সপ্তাহের দাম</p>
              <p className="mt-1 font-bold text-gray-800">
                {formatPrice(lastWeek)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">গত মাসের দাম</p>
              <p className="mt-1 font-bold text-gray-800">
                {formatPrice(lastMonth)}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-sm text-gray-500">আজকের দাম</p>
              <p className="mt-1 font-bold text-green-700">
                {formatPrice(today)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Price summary */}
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          বাজারদরের সারসংক্ষেপ
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">সর্বনিম্ন বাজারদর</p>
            <p className="mt-2 text-2xl font-bold text-green-700">
              {formatPrice(lowestPrice)}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">সর্বোচ্চ বাজারদর</p>
            <p className="mt-2 text-2xl font-bold text-red-600">
              {formatPrice(highestPrice)}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">গড় বাজারদর</p>
            <p className="mt-2 text-2xl font-bold text-blue-700">
              {formatPrice(averagePrice)}
            </p>
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          গড় দামটি প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের গড় থেকে হিসাব করা হয়েছে।
        </p>
      </section>

      {/* Market prices */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          বাজারভিত্তিক দাম
        </h2>

        {markets.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
            এই পণ্যের বাজারভিত্তিক দাম পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead className="bg-green-50 text-gray-700">
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
                    key={`${market.market}-${index}`}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {market.market}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {market.division}
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
    </main>
  );
}
