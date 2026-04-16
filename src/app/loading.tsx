import { Skeleton } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <div className="bg-brand-night">
      <section className="relative isolate min-h-[60vh] overflow-hidden bg-brand-night text-white">
        <div className="absolute inset-0 bg-gradient-night" />
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-40" />
        <div className="container-wide relative flex min-h-[60vh] flex-col justify-center pt-40 pb-20">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="mt-6 h-14 w-3/4 bg-white/10" />
          <Skeleton className="mt-4 h-14 w-1/2 bg-white/10" />
          <Skeleton className="mt-8 h-5 w-2/3 bg-white/10" />
          <Skeleton className="mt-2 h-5 w-1/2 bg-white/10" />
        </div>
      </section>
      <section className="bg-brand-cream py-24">
        <div className="container-wide grid gap-6 md:grid-cols-3">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </section>
    </div>
  );
}
