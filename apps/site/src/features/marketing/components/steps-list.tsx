import { fetchSteps } from "@/features/marketing/api";

export async function StepsList() {
  const steps = await fetchSteps();

  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="reveal border-outline-variant bg-surface-low/60 flex min-w-0 gap-4 rounded-lg border p-6"
        >
          <span
            aria-hidden="true"
            className="tabular rounded-pill bg-primary-strong font-display text-body-md text-on-primary flex h-10 w-10 shrink-0 items-center justify-center"
          >
            {index + 1}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="font-display text-headline-md text-on-surface">{step.title}</h3>
            <p className="text-body-md text-on-surface-variant">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
