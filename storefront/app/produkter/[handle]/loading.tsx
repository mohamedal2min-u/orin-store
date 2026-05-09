export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-bg-secondary pb-20 animate-pulse">
      {/* Breadcrumb bar */}
      <div className="container py-4 flex items-center gap-4">
        <div className="w-8 h-8 bg-border rounded" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-4 bg-border rounded" />
          <div className="h-3 w-2 bg-border rounded" />
          <div className="h-3 w-20 bg-border rounded" />
          <div className="h-3 w-2 bg-border rounded" />
          <div className="h-3 w-16 bg-border rounded" />
          <div className="h-3 w-2 bg-border rounded" />
          <div className="h-3 w-36 bg-border rounded" />
        </div>
      </div>

      <section className="container">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16">

            {/* Left: gallery skeleton */}
            <div>
              <div className="flex gap-4 h-[600px]">
                {/* Thumbnail strip */}
                <div className="flex flex-col gap-3 w-20 shrink-0">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[3/4] w-full bg-bg-secondary rounded border border-border" />
                  ))}
                </div>
                {/* Main image */}
                <div className="flex-1 bg-bg-secondary rounded border border-border" />
              </div>

              {/* Accordion skeletons */}
              <div className="mt-12 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-bg-secondary rounded-lg border border-border" />
                ))}
              </div>
            </div>

            {/* Right: info panel skeleton */}
            <div className="flex flex-col gap-4">
              <div className="h-3 w-16 bg-border rounded" />
              <div className="h-8 w-3/4 bg-border rounded" />

              {/* Stock */}
              <div className="space-y-2 mt-2">
                <div className="h-4 w-48 bg-border rounded" />
                <div className="h-4 w-40 bg-border rounded" />
              </div>

              {/* Price box */}
              <div className="border border-border rounded-lg p-5 mt-2 space-y-3">
                <div className="h-10 w-32 bg-border rounded" />
                <div className="h-10 bg-bg-secondary rounded" />
              </div>

              {/* Warranty grid */}
              <div className="grid grid-cols-5 gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-bg-secondary rounded border border-border" />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-2">
                <div className="flex-1 h-[52px] bg-border rounded" />
                <div className="w-[52px] h-[52px] bg-bg-secondary rounded border border-border" />
              </div>

              {/* Add-ons */}
              <div className="space-y-2 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-bg-secondary rounded border border-border" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
