export default function KassanLoading() {
  return (
    <div className="min-h-screen bg-bg-secondary pb-20 animate-pulse">
      <div className="container py-6 lg:py-10">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-16 bg-border rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Form skeleton */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
            <div className="h-5 w-40 bg-border rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-20 bg-border rounded" />
                <div className="h-10 w-full bg-bg-secondary rounded-lg border border-border" />
              </div>
            ))}
            <div className="h-12 w-full bg-border rounded" />
          </div>
          {/* Summary skeleton */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-3">
            <div className="h-5 w-32 bg-border rounded" />
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-12 h-16 bg-bg-secondary rounded border border-border shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-full bg-border rounded" />
                  <div className="h-3 w-16 bg-border rounded" />
                </div>
              </div>
            ))}
            <div className="h-px bg-border" />
            <div className="h-5 w-full bg-border rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
