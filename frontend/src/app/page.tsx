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
import { Package, History, Zap, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const [rates, setRates] = useState<any[]>([]);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-2 border-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">RL</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30" />
        
        <div className="container mx-auto px-6 pt-24 pb-32">
          <div className="grid gap-16 xl:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="max-w-3xl space-y-8">
              <Badge className="px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors" variant="outline">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                Evolution of Shipping
              </Badge>
              
              <h1 className="text-6xl font-black tracking-tight leading-[1.1] sm:text-7xl">
                Compare carrier rates <br />
                <span className="gradient-text">in real-time.</span>
              </h1>
              
              <p className="max-w-xl text-xl leading-relaxed text-muted-foreground">
                The most powerful dashboard for instant shipping quotes, 
                predictive rate history, and enterprise-grade visibility.
              </p>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/10 hover:bg-white/5">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur-2xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 opacity-50" />
              <div className="relative glass-card rounded-[2.5rem] p-10 space-y-8 group-hover:border-primary/20 transition-all duration-500">
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 glass-card-hover">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                    <Zap className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Live updates</p>
                    <p className="text-lg font-semibold">Multi-carrier Engine</p>
                  </div>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 glass-card-hover">
                    <ShieldCheck className="h-6 w-6 text-emerald-400 mb-4" />
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Security</p>
                    <p className="text-xl font-bold">Bank-level Auth</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 glass-card-hover">
                    <History className="h-6 w-6 text-sky-400 mb-4" />
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">History</p>
                    <p className="text-xl font-bold">Instant Audit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-40 grid gap-8 md:grid-cols-3">
            {[
              { 
                icon: Package, 
                title: "Unified Interface", 
                desc: "One dashboard for UPS, FedEx, and DHL. No more jumping between tabs.",
                color: "text-blue-400"
              },
              { 
                icon: Sparkles, 
                title: "Dynamic Workflow", 
                desc: "Smart routing suggestions based on weight, dimensions, and destination.",
                color: "text-purple-400"
              },
              { 
                icon: ShieldCheck, 
                title: "Secure Controls", 
                desc: "Admin-level permissions and detailed audit logs for your entire organization.",
                color: "text-emerald-400"
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card rounded-3xl p-8 glass-card-hover">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 ${feature.color} mb-6`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-12 space-y-4">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3 py-1">
            Authenticated Access
          </Badge>
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Get instant quotes <br />
            <span className="gradient-text">for your shipments.</span>
          </h1>
        </header>

        <div className="grid gap-10 xl:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            <section className="glass-card rounded-[2.5rem] p-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-20 -mt-20 -z-10" />
              <div className="flex items-center gap-3 mb-8">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Shipment Engine v1.2
                </h2>
              </div>
              <RateForm onRatesFetched={setRates} />
            </section>

            <section className="glass-card rounded-[2.5rem] p-8">
               <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Instant Results</h2>
                {rates.length > 0 && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {rates.length} rates found
                  </Badge>
                )}
              </div>
              <RateTable rates={rates} />
            </section>
          </div>

          <aside className="space-y-8">
            <div className="glass-card rounded-[2rem] p-8 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Recent History
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 shimmer">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Statistics</p>
                  <p className="text-2xl font-black gradient-text">42 Active Quotes</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Review your last searches and pick the best carrier option instantly.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-8 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Platform Security
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All rate requests are secured with JWT and stored with detailed audit trails.
              </p>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                View Audit Guidelines
              </Button>
            </div>
          </aside>
        </div>

        <section className="mt-16 glass-card rounded-[2.5rem] p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Search History</h2>
              <p className="text-muted-foreground mt-2">
                Tracking your last 50 shipping rate computations.
              </p>
            </div>
            <Button variant="secondary" className="bg-white/5 hover:bg-white/10 border-white/10">
              Export History (CSV)
            </Button>
          </div>
          <HistoryTable />
        </section>
      </div>

      <Toaster />
    </main>
  );
}

