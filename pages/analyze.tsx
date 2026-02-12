"use client";

import { useState, useEffect } from 'react';
import { useAuth, RedirectToSignIn, UserButton } from '@clerk/nextjs';

export default function Analyze() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usage, setUsage] = useState<{ tier: string; analyses_used: number; limit: number | 'unlimited' } | null>(null);

  useEffect(() => {
    if (isSignedIn) fetchUsage();
  }, [isSignedIn]);

  const fetchUsage = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/usage', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setUsage(await res.json());
    } catch {}
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult('');
      setError('');
    }
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed');
      }
      const data = await res.json();
      setResult(data.description);
      fetchUsage();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  const canUse = usage?.tier === 'premium' || (usage?.analyses_used ?? 0) < 1;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-6 right-6">
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Image Analyzer
        </h1>

        {usage && (
          <div className="max-w-lg mx-auto mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <p className="text-lg">
              Tier: <span className="font-bold">{usage.tier.charAt(0).toUpperCase() + usage.tier.slice(1)}</span> | 
              Analyses: {usage.tier === 'premium' ? 'Unlimited' : `${usage.analyses_used}/${usage.limit}`}
            </p>
          </div>
        )}

        {!canUse && (
          <div className="max-w-lg mx-auto mb-8 bg-yellow-100 dark:bg-yellow-900 p-6 rounded-xl text-center">
            <p className="text-red-700 dark:text-red-300 font-bold mb-4">Free limit reached (1 analysis).</p>
            <p className="mb-4">Upgrade to Premium for unlimited access ($5/mo).</p>
            <a
              href="https://accounts.clerk.dev/user"
              target="_blank"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg inline-block"
            >
              Upgrade Now
            </a>
          </div>
        )}

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="mb-6 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={!canUse || loading}
          />
          {preview && <img src={preview} alt="Preview" className="max-h-80 mx-auto mb-6 rounded-lg shadow" />}
          <button
            onClick={analyze}
            disabled={!file || !canUse || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>

        {result && (
          <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">AI Description</h2>
            <div className="prose dark:prose-invert max-w-none">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
