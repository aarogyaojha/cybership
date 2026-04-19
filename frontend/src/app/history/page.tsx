"use client";

import { HistoryTable } from "@/components/HistoryTable";
import { Toaster } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { History, Sparkles } from "lucide-react";

export default function HistoryPage() {
  return (
    <main className="min-h-screen py-20 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 opacity-30" />
      
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Hero */}
        <div className="mb-12 space-y-4">
          <Badge className="px-4 py-1.5 bg-primary/10 text-primary border-primary/20" variant="outline">
            <History className="h-3.5 w-3.5 mr-2" />
            Rate Logs
          </Badge>
          
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Consult your <br />
            <span className="gradient-text">Search History.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Access every shipment rate lookup from your account. Track trends and audit your carrier selections in one place.
          </p>
        </div>

        <section className="glass-card rounded-[2.5rem] p-1 shadow-2xl overflow-hidden">
          <div className="p-8">
            <HistoryTable />
          </div>
        </section>
      </div>

      <Toaster />
    </main>
  );
}

