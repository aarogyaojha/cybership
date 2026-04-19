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
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-20">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10 opacity-30 animate-pulse" />
      
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8 hidden lg:block">
            <Badge className="px-4 py-1.5 bg-primary/10 text-primary border-primary/20" variant="outline">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Secure Access
            </Badge>
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Welcome back to <br />
              <span className="gradient-text">RateLane.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
              Your intelligent shipping command center. Compare, track, and optimize with enterprise-grade security.
            </p>
            
            <div className="space-y-6 pt-4">
               {[
                "Instant rate comparisons",
                "Advanced search history",
                "Carrier performance insights",
                "Secure multi-tenant access"
               ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
               ))}
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <Card className="glass-card rounded-[2.5rem] p-4 border border-white/10 shadow-2xl">
              <CardHeader className="space-y-4 text-center pb-8 pt-6">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-2">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black tracking-tight">Login</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    Enter your credentials to continue
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl">
                      <AlertDescription className="text-xs font-bold uppercase tracking-wider">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 border-white/5 bg-white/5 pl-11 focus:bg-white/10 focus:border-primary/50 transition-all rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label
                        htmlFor="password"
                        className="text-xs font-black uppercase tracking-widest text-muted-foreground"
                      >
                        Password
                      </label>
                      <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                        Forgot?
                      </button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 border-white/5 bg-white/5 pl-11 focus:bg-white/10 focus:border-primary/50 transition-all rounded-xl"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base shadow-xl shadow-primary/20 group" disabled={isLoading}>
                    {isLoading ? "Authenticating..." : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    New to RateLane?{" "}
                    <Link
                      href="/register"
                      className="font-black uppercase tracking-widest text-[10px] text-primary hover:text-primary/80 transition-colors ml-1"
                    >
                      Create Account
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

