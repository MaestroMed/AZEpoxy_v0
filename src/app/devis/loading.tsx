import { Skeleton } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <div>
      <section className="relative isolate min-h-[40vh] overflow-hidden bg-brand-night text-white">
        <div className="absolute inset-0 bg-gradient-night" />
        <div className="container-wide relative flex min-h-[40vh] flex-col justify-center pt-40 pb-12">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="mt-6 h-12 w-1/2 bg-white/10" />
        </div>
      </section>
      <section className="bg-brand-cream py-24">
        <div className="container-wide max-w-3xl mx-auto">
          <Skeleton className="h-2 w-full" />
          <div className="mt-10 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </section>
    </div>
  );
}
