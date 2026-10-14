
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  const user = session?.user;
  const currentName = user?.name || "";
  const inputName = name ?? currentName;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const trimmedName = inputName.trim();

    if (!trimmedName) {
      setMessageType("error");
      setMessage("আপনার নাম লিখুন।");
      return;
    }

    if (trimmedName === currentName) {
      setMessageType("error");
      setMessage("নতুন কোনো নাম লিখুন।");
      return;
    }

    try {
      setLoading(true);

      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        setMessageType("error");
        setMessage(
          result.error.message || "প্রোফাইল আপডেট করা যায়নি।"
        );
        return;
      }

      setName(trimmedName);
      setMessageType("success");
      setMessage("প্রোফাইল সফলভাবে আপডেট হয়েছে।");

      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Profile update error:", error);
      setMessageType("error");
      setMessage("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="animate-pulse text-gray-500">
          প্রোফাইল লোড হচ্ছে...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">
          লগইন তথ্য পাওয়া যায়নি। অনুগ্রহ করে{" "}
          <Link
            href="/signin"
            className="font-semibold text-green-700 hover:underline"
          >
            Login
          </Link>{" "}
          করুন।
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <Link
        href="/profile"
        className="text-sm font-medium text-green-700 hover:underline"
      >
        ← প্রোফাইলে ফিরে যাও
      </Link>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Update Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          তোমার প্রোফাইলের নাম পরিবর্তন করতে পারো।
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              value={inputName}
              onChange={(event) => setName(event.target.value)}
              placeholder="তোমার নাম লিখো"
              required
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={user.email || ""}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              এই পেজ থেকে ইমেইল পরিবর্তন করা যাবে না।
            </p>
          </div>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`text-sm ${
                messageType === "success"
                  ? "text-green-700"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "আপডেট হচ্ছে..." : "Save Changes"}
          </button>
        </form>
      </section>
    </main>
  );
}
