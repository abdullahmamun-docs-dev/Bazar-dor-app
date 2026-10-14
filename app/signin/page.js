
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  // Redirect only to a local path to avoid open redirects.
  const requestedCallback = searchParams.get("callbackURL");
  const callbackURL =
    requestedCallback?.startsWith("/") &&
    !requestedCallback.startsWith("//") &&
    !requestedCallback.startsWith("/\\")
      ? requestedCallback
      : "/";

  async function handleSignIn(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখো।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL,
      });

      if (result.error) {
        toast.error(
          result.error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।"
        );
        return;
      }

      toast.success("সফলভাবে Sign In হয়েছে!");

      router.push(callbackURL);
      router.refresh();
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("লগইন করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider) {
    setSocialLoading(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL,
      });

      if (result?.error) {
        toast.error(
          result.error.message || "Social login করা যায়নি।"
        );
        setSocialLoading("");
      }
    } catch (error) {
      console.error("Social sign in error:", error);
      toast.error("Social login চালু করা যায়নি।");
      setSocialLoading("");
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#f7f9f3] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
        <Link
          href="/"
          className="block text-center text-2xl font-extrabold text-green-800"
        >
          🛒 বাজার দর
        </Link>

        <h1 className="mb-2 mt-6 text-center text-3xl font-bold text-green-700">
          Welcome Back!
        </h1>

        <p className="mb-6 text-center text-gray-600">
          তোমার অ্যাকাউন্টে Sign In করো
        </p>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block font-medium text-gray-800"
            >
              ইমেইল
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block font-medium text-gray-800"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="তোমার পাসওয়ার্ড লিখো"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading || Boolean(socialLoading)}
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sign In হচ্ছে..." : "Sign In"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={loading || Boolean(socialLoading)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 disabled:opacity-60"
          >
            {socialLoading === "google"
              ? "Google-এ যাচ্ছি..."
              : "Google দিয়ে Sign In"}
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            disabled={loading || Boolean(socialLoading)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 disabled:opacity-60"
          >
            {socialLoading === "github"
              ? "GitHub-এ যাচ্ছি..."
              : "GitHub দিয়ে Sign In"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          নতুন অ্যাকাউন্ট প্রয়োজন?{" "}
          <Link
            href="/signup"
            className="font-semibold text-green-700 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <p className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-green-700"
          >
            ← হোম পেজে ফিরে যাও
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center">
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
