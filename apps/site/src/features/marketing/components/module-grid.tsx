import { GlassCard } from "@/components/ui/glass-card";
import { Icon } from "@/components/ui/icon";
import { fetchModules } from "@/features/marketing/api";
import { cn } from "@/lib/cn";

export interface ModuleGridProps {
  /** `compact` = só resumo (home). `full` = com os destaques (página de recursos). */
  variant?: "compact" | "full";
  className?: string;
}

export async function ModuleGrid({ variant = "compact", className }: ModuleGridProps) {
  const modules = await fetchModules();
  const full = variant === "full";

  return (
    <div
      className={cn(
        "grid gap-4",
        full ? "lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {modules.map((module) => (
        <GlassCard
          key={module.id}
          id={module.id.toLowerCase()}
          className="reveal flex scroll-mt-28 flex-col gap-4 p-6"
        >
          <span className="bg-primary/15 text-primary inline-flex h-12 w-12 items-center justify-center rounded-md">
            <Icon name={module.icon} size={26} />
          </span>

          <div className="flex flex-col gap-2">
            <h3 className="font-display text-headline-md text-on-surface">{module.name}</h3>
            <p className="text-body-md text-on-surface-variant">{module.summary}</p>
          </div>

          {full ? (
            <ul className="border-outline-variant mt-auto flex flex-col gap-2 border-t pt-4">
              {module.highlights.map((highlight) => (
                <li key={highlight} className="text-body-md text-on-surface-variant flex gap-3">
                  <span
                    aria-hidden="true"
                    className="rounded-pill bg-secondary mt-2 h-1.5 w-1.5 shrink-0"
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          ) : null}
        </GlassCard>
      ))}
    </div>
  );
}
