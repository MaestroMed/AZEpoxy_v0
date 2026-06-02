export default function AdminLoading() {
  return (
    <div className="animate-pulse px-8 py-7" aria-busy="true" aria-label="Chargement">
      <div className="mb-7 space-y-3 border-b border-white/[0.05] pb-7">
        <div className="h-2.5 w-24 rounded bg-white/[0.06]" />
        <div className="h-7 w-56 rounded bg-white/[0.08]" />
        <div className="h-3 w-80 rounded bg-white/[0.05]" />
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
        ))}
      </div>
      <div className="mt-6 h-64 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
    </div>
  );
}
