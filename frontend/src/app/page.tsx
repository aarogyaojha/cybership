"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { RateForm } from "@/components/RateForm";
import { RateTable } from "@/components/RateTable";
import { HistoryTable } from "@/components/HistoryTable";
import { Toaster } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Package, History, Zap, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  const [rates, setRates] = useState<any[]>([]);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-lg">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-gradient-to-r from-sky-200/70 via-white to-indigo-200/70 blur-3xl" />
          <div className="container mx-auto px-6 py-24">
            <div className="grid gap-12 xl:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="max-w-2xl">
                <Badge className="mb-6" variant="default">
                  Shipping SaaS
                </Badge>
                <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
                  Compare carrier rates in seconds.
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  RateLane gives you one dashboard for instant shipping quotes,
                  rate history, and admin-level visibility.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/register">
                    <Button size="lg">Get started</Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-8 shadow-2xl shadow-slate-200/70">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 rounded-3xl bg-slate-50 p-5">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-100 text-sky-700">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Live shipping rates
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        Compare UPS and more with one request
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-4">
                      <p className="text-sm text-slate-500">Fast quotes</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        Seconds per shipment
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-4">
                      <p className="text-sm text-slate-500">User-friendly</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        Secure account access
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-3">
              <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <Package className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Multi-Carrier</CardTitle>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  One interface for UPS, rate comparison, and shipping
                  workflows.
                </p>
              </Card>
              <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Simple workflow</CardTitle>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Enter shipment details, get instant quotes, and keep your
                  history.
                </p>
              </Card>
              <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Secure access</CardTitle>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Built-in JWT auth, admin controls, and audit logging for every
                  user.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_0.8fr]">
          <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/60">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">
                  Ship smarter
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Get instant quotes for every shipment.
                </h1>
                <p className="mt-4 max-w-2xl text-slate-600">
                  Enter shipment details below to compare carrier rates, and
                  keep your history available for later review.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-lg">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                    Quick quote
                  </p>
                  <p className="mt-2 text-xl font-semibold">Instant results</p>
                </div>
                <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-lg">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                    Safe access
                  </p>
                  <p className="mt-2 text-xl font-semibold">JWT auth</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Shipment details
              </p>
              <RateForm onRatesFetched={setRates} />
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
              <CardTitle className="text-xl">Recent quotes</CardTitle>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review your last rate searches and pick the best carrier option.
              </p>
            </Card>
            <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
              <CardTitle className="text-xl">History & insights</CardTitle>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your submitted rate requests are automatically stored for audit
                and reporting.
              </p>
            </Card>
          </aside>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/50">
          <RateTable rates={rates} />
        </div>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/50">
          <h2 className="text-2xl font-semibold text-slate-950">
            Your recent quotes
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Quickly scan the most recent rate requests from your account.
          </p>
          <div className="mt-6">
            <HistoryTable />
          </div>
        </section>
      </div>

      <Toaster />
    </main>
  );
}
