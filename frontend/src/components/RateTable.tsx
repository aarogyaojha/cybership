import { TrendingDown, Clock, DollarSign } from "lucide-react"

const serviceColors: Record<string, { bg: string; text: string; dot: string }> = {
  Ground: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  "2nd Day": { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  "Next Day": { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
}

function getServiceStyle(label: string) {
  if (label.includes("Ground")) return serviceColors["Ground"]
  if (label.includes("2nd Day")) return serviceColors["2nd Day"]
  if (label.includes("Next Day")) return serviceColors["Next Day"]
  return { bg: "bg-secondary/50", text: "text-muted-foreground", dot: "bg-muted-foreground" }
}

export function RateTable({ rates }: { rates: any[] }) {
  if (!rates || rates.length === 0) return null
  if (!Array.isArray(rates)) return null

  const sorted = [...rates].sort((a, b) => a.totalCharge - b.totalCharge)
  const cheapest = sorted[0]

  return (
    <div className="animate-slide-up">
      {/* Summary bar */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <TrendingDown className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">{rates.length} quotes</span> found — best rate{" "}
          <span className="text-emerald-400 font-semibold mono">
            {cheapest.totalCharge} {cheapest.currency}
          </span>
        </span>
      </div>

      <div className="space-y-3">
        {sorted.map((rate, idx) => {
          const style = getServiceStyle(rate.serviceLabel)
          const isBest = idx === 0

          return (
            <div
              key={rate.id}
              className={`glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card-hover transition-all duration-300 ${
                isBest ? "border-primary/30 bg-primary/5 shadow-2xl shadow-primary/10" : "border-white/5"
              }`}
            >
              <div className="flex items-center gap-5">
                {/* Rank */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 border ${
                  isBest ? "bg-primary/20 text-primary border-primary/30 shadow-lg shadow-primary/20" : "bg-white/5 text-muted-foreground border-white/10"
                }`}>
                  {idx + 1}
                </div>

                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-base tracking-tight">{rate.carrier}</span>
                    <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${style.bg} ${style.text} border-current/10`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
                      {rate.serviceLabel}
                    </span>
                    {isBest && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/20">
                        Best Value
                      </span>
                    )}
                  </div>

                  {rate.estimatedDays && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground font-medium">
                      <Clock className="w-3.5 h-3.5 text-primary/70" />
                      {rate.estimatedDays} business {rate.estimatedDays === 1 ? "day" : "days"}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:text-right pl-[52px] sm:pl-0">
                <span className="text-muted-foreground/30 font-black text-xs uppercase tracking-tighter self-start mt-1.5">Rate</span>
                <span className="mono text-3xl font-black gradient-text">
                  {rate.totalCharge}
                </span>
                <span className="text-xs font-bold text-muted-foreground self-end mb-1.5 tracking-widest uppercase">{rate.currency}</span>
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}
