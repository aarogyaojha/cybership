"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
  };
}

export function AuditLogsViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      if (!token) return;

      try {
        const response = await fetch(
          `http://localhost:3000/admin/audit-logs?page=${page}&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (response.ok) {
          const data = await response.json();
          setLogs(data.data);
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [token, page]);

  if (isLoading) {
     return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full bg-white/5 border border-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
     );
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Activity Logs</h3>
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">Audit Trail v2.4</p>
        </div>
        <div className="h-10 w-64 bg-white/5 border border-white/5 rounded-xl flex items-center px-4 text-muted-foreground">
          <Search className="h-4 w-4 mr-2" />
          <span className="text-xs font-medium">Search patterns...</span>
        </div>
      </div>
      <div className="px-4">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-6">User</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Action</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Resource</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">IP Address</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight">{log.user.email}</span>
                    <span className="text-[10px] text-muted-foreground mono opacity-50">{log.userId}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">
                  {log.resource}
                </TableCell>
                <TableCell className="text-sm mono text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                  {log.ipAddress || "0.0.0.0"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold">{new Date(log.createdAt).toLocaleDateString()}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-8 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Page {page} of {totalPages} <span className="mx-2 text-white/10">|</span> {total} total entries
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-xl border-white/5 hover:bg-white/5 h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="rounded-xl border-white/5 hover:bg-white/5 h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

