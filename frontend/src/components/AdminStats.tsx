"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { Users, Activity, Package, ShieldCheck, BarChart3, Database } from "lucide-react";

interface SystemStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  totalRateRequests: number;
  totalAuditLogs: number;
  totalCarrierQuotes: number;
  averageQuotesPerRequest: number;
}

const icons = {
  "Total Users": Users,
  "Admin Users": ShieldCheck,
  "Rate Requests": Activity,
  "Audit Logs": Database,
  "Carrier Quotes": Package,
  "Avg Quotes/Request": BarChart3,
};

export function AdminStats() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3000/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 rounded-[2rem] bg-white/5 border border-white/5 animate-pulse" />
        ))}
      </div>
    );
  }
  
  if (!stats) return <p className="text-muted-foreground">System stats temporarily unavailable.</p>;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, color: "text-blue-400" },
    { label: "Admin Users", value: stats.adminUsers, color: "text-red-400" },
    { label: "Rate Requests", value: stats.totalRateRequests, color: "text-indigo-400" },
    { label: "Audit Logs", value: stats.totalAuditLogs, color: "text-emerald-400" },
    { label: "Carrier Quotes", value: stats.totalCarrierQuotes, color: "text-amber-400" },
    {
      label: "Avg Quotes/Request",
      value: stats.averageQuotesPerRequest.toFixed(2),
      color: "text-purple-400"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card) => {
        const Icon = icons[card.label as keyof typeof icons] || Activity;
        return (
          <div key={card.label} className="glass-card rounded-[2rem] p-6 glass-card-hover border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/5 transition-colors duration-500" />
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {card.label}
              </p>
            </div>
            <p className="text-4xl font-black gradient-text tracking-tighter">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

