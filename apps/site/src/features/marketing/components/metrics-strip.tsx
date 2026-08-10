import { GlassCard } from "@/components/ui/glass-card";
import { fetchMetrics } from "@/features/marketing/api";

export async function MetricsStrip() {
  const metrics = await fetchMetrics();

  return (
    <GlassCard className="reveal bg-outline-variant grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        // O `gap-px` do pai com fundo `outline-variant` desenha as divisórias:
        // borda por item duplicaria o traço no encontro das células.
        <div key={metric.label} className="bg-surface-low flex min-w-0 flex-col gap-1 p-6">
          <p className="tabular font-display text-headline-lg text-secondary">{metric.value}</p>
          <p className="text-body-md text-on-surface">{metric.label}</p>
          <p className="text-label-md text-on-surface-muted">{metric.detail}</p>
        </div>
      ))}
    </GlassCard>
  );
}
