// Page-level loading skeleton shown while async Server Components await data.
// Mirrors the visual weight of page.tsx so there's no layout shift on resolve.

export default function Loading() {
  return (
    <div className="home-page" aria-busy="true" aria-label="Laddar sida...">
      {/* Hero skeleton */}
      <section className="hero-banner">
        <div className="container">
          <div className="hero-content max-w-2xl mx-auto text-center space-y-4 animate-pulse">
            <div className="h-16 md:h-24 w-3/4 mx-auto bg-border rounded" />
            <div className="h-6 w-2/3 mx-auto bg-border rounded" />
            <div className="h-4 w-1/2 mx-auto bg-border rounded" />
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <div className="h-12 w-48 bg-bg-dark/20 rounded" />
              <div className="h-12 w-48 bg-bg-dark/20 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand row skeleton */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-6 w-16 mx-auto bg-border rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* Category cards skeleton */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[300px] bg-bg-secondary rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* Product grid skeleton */}
      <section className="py-20 bg-bg-secondary/30">
        <div className="container">
          <div className="flex items-end justify-between mb-12 animate-pulse">
            <div>
              <div className="h-3 w-20 bg-border rounded mb-2" />
              <div className="h-8 w-40 bg-border rounded" />
            </div>
            <div className="h-4 w-28 bg-border rounded" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/5] bg-bg-secondary rounded" />
                <div className="pt-6 space-y-2">
                  <div className="h-2 w-16 bg-border rounded" />
                  <div className="h-4 w-32 bg-border rounded" />
                  <div className="h-4 w-20 bg-border rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
