"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-bold tracking-tight group"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            RL
          </span>
          <span className="gradient-text">RateLane</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-3 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm sm:flex">
                <span className="text-muted-foreground">{user?.email}</span>
                {user?.role === "admin" && (
                  <span className="rounded-full bg-primary/20 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="hover:bg-white/10">
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link href="http://localhost:3000/api/docs" target="_blank">
                <Button variant="ghost" size="sm" className="hover:bg-white/10 text-primary font-bold">
                  API Docs
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleLogout}
                className="bg-white/5 hover:bg-white/10 border-white/10"
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover:bg-white/5 text-muted-foreground hover:text-foreground">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-6">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

