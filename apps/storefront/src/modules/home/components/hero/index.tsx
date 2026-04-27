import Image from "next/image"

const Hero = () => {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-kv-bg">
      {/* Background Image with elegant vignette and dark overlay for text readability */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-watch.png"
          alt="Luxury Watch - ORIN"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Soft overlay for contrast across all devices */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Vignette effect for dramatic luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      <div className="content-container relative z-10 w-full">
        <div className="flex flex-col items-center text-center gap-y-6 max-w-3xl mx-auto px-4">
          {/* Brand Mark */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-[1px] bg-white/60" />
            <span
              className="text-[12px] font-bold tracking-[0.4em] text-white uppercase"
              aria-label="ORIN brand"
            >
              ORIN
            </span>
            <div className="w-10 h-[1px] bg-white/60" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-[64px] leading-[1.1] font-light tracking-[0.02em] text-white drop-shadow-sm">
            Tidlös precision.
            <br />
            <span className="font-medium italic">Kurerad för Sverige.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-[15px] sm:text-[17px] leading-[1.7] text-white/90 max-w-lg mx-auto font-light tracking-wide mt-2">
            Utforska vårt noggrant kurerade urval av premiumklockor. 
            Vi förenar skandinavisk minimalism med hantverk i världsklass.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full">
            <a href="#collections" className="w-full sm:w-auto px-8 py-3.5 bg-white text-black text-[13px] font-semibold tracking-widest uppercase hover:bg-kv-surface hover:text-kv-primary transition-all duration-300">
              Utforska kollektionen
            </a>
            <a href="/store" className="w-full sm:w-auto px-8 py-3.5 bg-black/40 backdrop-blur-md text-white border border-white/20 text-[13px] font-semibold tracking-widest uppercase hover:bg-white/10 transition-all duration-300">
              Alla klockor
            </a>
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-pulse opacity-70">
        <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-white">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
