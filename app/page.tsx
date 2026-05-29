"use client";

import { useState } from 'react';

export default function Home() {
  const user = { name: 'Maya Singh', isPremium: false };
  const premiumCardBlur = !user.isPremium ? 'blur-sm filter' : '';
  const [activeSector, setActiveSector] = useState('Logistics');
  const [loading, setLoading] = useState(false);
  const [briefing, setBriefing] = useState(
    'Generate a sector briefing to see the latest AI insights appear here.'
  );
  const [latestAlert, setLatestAlert] = useState(
    'Supply chain tensions heat up across Asia-Pacific logistics.'
  );
  const [marketNote, setMarketNote] = useState(
    'Energy futures shift as renewables drive infrastructure bids.'
  );
  const [errorMessage, setErrorMessage] = useState('');

  const sectors = ['Logistics', 'Fintech', 'Manufacturing', 'Energy'];

  const handleGenerateBriefing = async () => {
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/briefing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sector: activeSector.toLowerCase().trim(), deepDive: false }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate briefing.');
      }

      const generatedBriefing = data.briefing ?? '';
      setBriefing(generatedBriefing || 'The briefing returned no content.');

      const sentences = generatedBriefing.split(/(?<=[.?!])\s+/).filter(Boolean);
      setLatestAlert(sentences[0] || 'The briefing did not return an alert.');
      setMarketNote(
        sentences[sentences.length - 1] || 'The briefing did not return a market note.'
      );
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-paper text-stone-900">
      <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-10">
        <header className="mb-10 rounded-3xl border border-hairline-stone bg-white/90 p-8 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-stone-500">
                B2B Intelligence Desk
              </p>
              <h1 className="mt-4 text-4xl font-header font-semibold leading-tight text-stone-950 sm:text-5xl">
                Financial Newspaper Intelligence
              </h1>
            </div>
            <div className="rounded-2xl border border-hairline-stone bg-stone-50 px-5 py-4 text-sm text-stone-700">
              <span className="font-semibold text-stone-900">Live Sector Pulse</span>
              <p className="mt-1 text-sm text-stone-500">Market insights refreshed every minute.</p>
            </div>
          </div>
        </header>

        <section className="mb-8 rounded-3xl border border-hairline-stone bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-3 text-sm font-medium text-stone-600">
            {sectors.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveSector(label)}
                className={`rounded-full border px-4 py-2 transition ${
                  activeSector === label
                    ? 'border-stone-900 bg-stone-950 text-white'
                    : 'border-stone-200 bg-cream-paper text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr_1fr]">
          <article className="space-y-6 rounded-3xl border border-hairline-stone bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-stone-500">AI Analyst Panel</p>
                <h2 className="mt-3 text-3xl font-header font-semibold text-stone-950">
                  Sector briefing automation
                </h2>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                Experimental
              </span>
            </div>

            <div className="grid gap-4 rounded-3xl border border-stone-200 bg-cream-paper p-5 text-sm text-stone-700">
              <div className="space-y-2">
                <p className="font-semibold text-stone-900">AI-driven briefing</p>
                <p className="leading-7 text-stone-600">
                  Generate a concise market note for leadership, tailored to the selected industry verticals and emerging trade flows.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-sm text-stone-500">
                  <p>Selected sector: {activeSector}</p>
                  <p>Analysis depth: Strategic</p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateBriefing}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {loading ? 'Generating...' : 'Generate Sector Briefing'}
                </button>
              </div>

              {errorMessage ? (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-hairline-stone bg-stone-50 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-stone-500">Latest alert</p>
                <p className="mt-4 text-lg font-semibold text-stone-900">{latestAlert}</p>
              </div>
              <div className="rounded-3xl border border-hairline-stone bg-stone-50 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-stone-500">Market note</p>
                <p className="mt-4 text-lg font-semibold text-stone-900">{marketNote}</p>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-hairline-stone bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.32em] text-stone-500">Today’s headlines</p>
              <ul className="mt-6 space-y-4 text-sm text-stone-700">
                {[
                  'Fintech deal flow expands in Q2',
                  'Manufacturing orders stabilize after rate update',
                  'Energy providers eye AI-driven logistics',
                ].map((headline) => (
                  <li key={headline} className="border-b border-stone-200 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-stone-900">{headline}</h3>
                    <p className="mt-2 text-sm text-stone-500">Curated insight for executive readers and investor teams.</p>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className={`relative overflow-hidden rounded-3xl border border-hairline-stone bg-stone-950 p-6 text-white shadow-sm ${premiumCardBlur}`}
            >
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.32em] text-amber-200">Premium access</p>
                <h3 className="text-2xl font-header font-semibold leading-tight">Strategic growth briefing</h3>
                <p className="text-sm leading-6 text-stone-300">
                  Unlock the full note on sector-specific insights reserved for premium subscribers.
                </p>
              </div>
              {!user.isPremium ? (
                <div className="pointer-events-none absolute inset-0 bg-[rgba(255,255,255,0.22)] backdrop-blur-lg" />
              ) : null}
              <div className="relative mt-6 flex items-center justify-between rounded-3xl border border-white/10 bg-white/10 px-4 py-4 text-sm text-stone-100">
                <div>
                  <p className="font-semibold">Premium content</p>
                  <p className="mt-1 text-xs text-stone-200">
                    {user.isPremium
                      ? 'Unlocked for premium subscribers.'
                      : 'Upgrade to remove the blur and access full briefings.'}
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-stone-100">
                  {user.isPremium ? 'Premium' : 'Free tier'}
                </span>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
