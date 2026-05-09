export default function VarukorgLoading() {
  return (
    <div className="min-h-screen bg-bg-secondary pb-20 animate-pulse">
      <div className="container py-6 lg:py-10">
        <div className="h-7 w-36 bg-border rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Items skeleton */}
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 p-6 border-b border-border last:border-0">
                <div className="w-24 h-32 bg-bg-secondary rounded border border-border shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-3/4 bg-border rounded" />
                  <div className="h-3 w-1/2 bg-border rounded" />
                  <div className="mt-4 flex justify-between">
                    <div className="h-9 w-28 bg-bg-secondary rounded-lg border border-border" />
                    <div className="h-5 w-16 bg-border rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Summary skeleton */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-3">
            <div className="h-5 w-40 bg-border rounded" />
            <div className="h-4 w-full bg-bg-secondary rounded" />
            <div className="h-4 w-full bg-bg-secondary rounded" />
            <div className="h-px bg-border mt-2" />
            <div className="h-5 w-full bg-border rounded" />
            <div className="h-12 w-full bg-bg-secondary rounded mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
