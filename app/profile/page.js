"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(
        `/sign-in?callbackURL=${encodeURIComponent("/profile")}`
      );
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="animate-pulse text-gray-500">
          প্রোফাইল লোড হচ্ছে...
        </p>
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
      <Link
        href="/"
        className="text-sm font-medium text-green-700 hover:underline"
      >
        ← হোম পেজে ফিরে যাও
      </Link>

      <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-green-700 px-6 py-8 text-white sm:px-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-green-700">
            {user.name?.charAt(0)?.toUpperCase() || "👤"}
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-green-100">
            তোমার ব্যক্তিগত তথ্য দেখো ও আপডেট করো।
          </p>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="mt-1 font-semibold text-gray-900">
              {user.name || "নাম দেওয়া নেই"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="mt-1 break-all font-semibold text-gray-900">
              {user.email || "ইমেইল পাওয়া যায়নি"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email Verification</p>
            <p className="mt-1 font-semibold text-gray-900">
              {user.emailVerified ? "Verified" : "Not verified"}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <Link
              href="/profile/update"
              className="inline-flex w-full items-center justify-center rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 sm:w-auto"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}