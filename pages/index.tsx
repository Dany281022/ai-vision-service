"use client";

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Vision Analyzer</h1>
          <div className="flex items-center gap-6">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/analyze" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                Go to Analyzer
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>

        <div className="text-center py-20">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Analyze Images with AI
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Upload any image and get detailed AI-powered descriptions: objects, colors, mood, notable features.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Free Tier</h3>
              <p className="text-4xl font-bold text-blue-600 mb-6">$0<span className="text-lg">/month</span></p>
              <ul className="text-left space-y-3 mb-6">
                <li>✓ 1 image analysis</li>
                <li>✓ Basic descriptions</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-2 border-blue-600 relative">
              <span className="absolute -top-3 right-6 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">Popular</span>
              <h3 className="text-2xl font-bold mb-4">Premium Tier</h3>
              <p className="text-4xl font-bold text-blue-600 mb-6">$5<span className="text-lg">/month</span></p>
              <ul className="text-left space-y-3 mb-6">
                <li>✓ Unlimited analyses</li>
                <li>✓ Advanced detailed descriptions</li>
                <li>✓ Priority processing</li>
              </ul>
            </div>
          </div>

          <SignedIn>
            <Link href="/analyze">
              <button className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-xl text-lg hover:opacity-90 transition">
                Start Analyzing Now
              </button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-xl text-lg hover:opacity-90 transition">
                Get Started Free
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-3">Instant Upload</h3>
            <p>Drag & drop or select images (jpg, png, webp).</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-3">Powered by OpenAI</h3>
            <p>gpt-4o-mini for accurate, detailed vision analysis.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
            <p>Clerk authentication + tiered access control.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
