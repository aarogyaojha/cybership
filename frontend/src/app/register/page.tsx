"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { UserPlus, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-20">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[150px] rounded-full -z-10 opacity-30 animate-pulse" />
      
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8 hidden lg:block">
            <Badge className="px-4 py-1.5 bg-accent/10 text-accent border-accent/20" variant="outline">
              <ShieldCheck className="h-3.5 w-3.5 mr-2" />
              Verified Accounts
            </Badge>
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Start shipping <br />
              <span className="gradient-text">smarter today.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
              Join thousands of businesses optimizing their carrier selection with RateLane.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
               {[
                { label: "Free Tier", value: "Unlimited" },
                { label: "Carriers", value: "Global" },
                { label: "Uptime", value: "99.9%" },
                { label: "Security", value: "AES-256" }
               ].map((stat, i) => (
                <div key={i} className="glass-card rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
               ))}
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <Card className="glass-card rounded-[2.5rem] p-4 border border-white/10 shadow-2xl">
              <CardHeader className="space-y-4 text-center pb-8 pt-6">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-2">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black tracking-tight">Create Account</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    Join the shipping revolution
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <Alert className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl">
                      <AlertDescription className="text-xs font-bold uppercase tracking-wider">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within:text-accent transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 border-white/5 bg-white/5 pl-11 focus:bg-white/10 focus:border-accent/50 transition-all rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Create Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within:text-accent transition-colors">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 border-white/5 bg-white/5 pl-11 focus:bg-white/10 focus:border-accent/50 transition-all rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-center">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within:text-accent transition-colors">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-12 border-white/5 bg-white/5 pl-11 focus:bg-white/10 focus:border-accent/50 transition-all rounded-xl"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base shadow-xl shadow-accent/20 bg-accent hover:bg-accent/90 group mt-4" disabled={isLoading}>
                    {isLoading ? "Provisioning Account..." : (
                      <>
                        Register Account
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already registered?{" "}
                    <Link
                      href="/login"
                      className="font-black uppercase tracking-widest text-[10px] text-accent hover:text-accent/80 transition-colors ml-1"
                    >
                      Sign In Instead
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

