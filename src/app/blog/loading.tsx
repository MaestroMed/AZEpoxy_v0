import { Skeleton } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <div>
      <section className="relative isolate min-h-[40vh] overflow-hidden bg-brand-night text-white">
        <div className="absolute inset-0 bg-gradient-night" />
        <div className="container-wide relative flex min-h-[40vh] flex-col justify-center pt-40 pb-12">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="mt-6 h-12 w-1/2 bg-white/10" />
          <Skeleton className="mt-4 h-5 w-2/3 bg-white/10" />
        </div>
      </section>
      <section className="bg-brand-cream py-24">
        <div className="container-wide grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-foreground/5 bg-card p-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-4 h-6 w-5/6" />
              <Skeleton className="mt-2 h-6 w-3/4" />
              <Skeleton className="mt-6 h-4 w-32" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
