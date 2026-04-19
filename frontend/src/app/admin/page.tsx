"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminStats } from "@/components/AdminStats";
import { AuditLogsViewer } from "@/components/AuditLogsViewer";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, LayoutDashboard } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== "admin") {
      router.push("/");
    }
  }, [user, isLoading, router]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen py-16 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -z-10 opacity-50" />
        
        <div className="container mx-auto px-6 max-w-7xl">
          <header className="mb-16 space-y-4">
            <Badge className="px-4 py-1.5 bg-red-500/10 text-red-500 border-red-500/20" variant="outline">
              <ShieldCheck className="h-3.5 w-3.5 mr-2" />
              Administrative Control
            </Badge>
            
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Platform <br />
              <span className="gradient-text uppercase tracking-tighter">Command Center.</span>
            </h1>
          </header>

          <section className="space-y-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">System Health</h2>
              </div>
              <AdminStats />
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-3">
                <Badge variant="outline" className="h-2 w-2 rounded-full bg-emerald-500 p-0 border-0 animate-pulse" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">Real-time Activity</h2>
              </div>
              <AuditLogsViewer />
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}

