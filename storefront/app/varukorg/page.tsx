"use client";

import { useEffect, useState, useCallback, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPriceRaw } from "@/lib/locale";
import { resolveCartItemImage } from "@/lib/normalize-image-url";
import { OrinPlaceholder } from "@/components/product-image-placeholder";
import { PaymentTrustBlock, GuaranteesBlock } from "@/components/payment-icons";
import { TrustBadgeInline } from "@/components/trust/trust-badge";
import { ProductCard } from "@/components/product-card";
import type { MedusaCart, CartLineItem, MedusaProduct } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
const KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";
const CART_ID_KEY = "orin_cart_id";

function subscribeNoop() { return () => {}; }
const alwaysTrue = () => true;
const alwaysFalse = () => false;

function cartHeaders() {
  return { "x-publishable-api-key": KEY, "Content-Type": "application/json" };
}

function safePriceDisplay(item: CartLineItem): string {
  const raw = item.total ?? item.unit_price * item.quantity;
  if (!raw && raw !== 0) return "—";
  return formatPriceRaw(raw / 100);
}

/* ─── Main Page ─── */
export default function VarukorgPage() {
  const { cartId, refreshCart } = useCart();
  const mounted = useSyncExternalStore(subscribeNoop, alwaysTrue, alwaysFalse);

  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [recommended, setRecommended] = useState<MedusaProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyItems, setBusyItems] = useState<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);
  const recommendedFetchedRef = useRef(false);

  const loadCart = useCallback((id: string) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    fetch(`${BASE}/store/carts/${id}?fields=id,currency_code,email,subtotal,shipping_total,tax_total,total,region_id,shipping_address.id,shipping_address.first_name,shipping_address.last_name,shipping_address.address_1,shipping_address.address_2,shipping_address.city,shipping_address.postal_code,shipping_address.country_code,shipping_address.phone,items.id,items.title,items.subtitle,items.thumbnail,items.quantity,items.unit_price,items.total,items.variant_id,items.variant.product.thumbnail,items.variant.product.images.url`, {
      headers: { "x-publishable-api-key": KEY },
      signal: ctrl.signal,
    })
      .then((res) => {
        if (res.status === 404) {
          localStorage.removeItem(CART_ID_KEY);
          window.dispatchEvent(new Event("orin_cart_updated"));
          setCart(null);
          return null;
        }
        if (!res.ok) { setError("Kunde inte hämta varukorgen."); return null; }
        return res.json() as Promise<{ cart: MedusaCart }>;
      })
      .then((d) => { if (d) setCart(d.cart); })
      .catch((e) => { if ((e as Error).name !== "AbortError") setError("Nätverksfel."); });
  }, []);

  const loadRecommended = useCallback(() => {
    fetch(`${BASE}/store/products?limit=4&fields=id,title,handle,thumbnail,metadata,tags,%2Bimages.id,%2Bimages.url,%2Bvariants.calculated_price&region_id=reg_01KR4NAMQR05YZNFWJFZY7BXS0`, {
      headers: { "x-publishable-api-key": KEY },
    })
      .then((r) => r.json())
      .then((d) => { if (d?.products) setRecommended(d.products); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mounted || !cartId) return;
    loadCart(cartId);
    if (!recommendedFetchedRef.current) {
      recommendedFetchedRef.current = true;
      loadRecommended();
    }
    return () => { abortRef.current?.abort(); };
  }, [mounted, cartId, loadCart, loadRecommended]);

  const setBusy = (id: string, busy: boolean) =>
    setBusyItems((prev) => { const n = new Set(prev); if (busy) { n.add(id); } else { n.delete(id); } return n; });

  const handleQty = async (item: CartLineItem, delta: number) => {
    if (!cartId || busyItems.has(item.id)) return;
    const q = item.quantity + delta;
    if (q < 1) return;
    setBusy(item.id, true);
    try {
      const r = await fetch(`${BASE}/store/carts/${cartId}/line-items/${item.id}`,
        { method: "POST", headers: cartHeaders(), body: JSON.stringify({ quantity: q }) });
      if (r.ok) { loadCart(cartId); refreshCart(); }
    } finally { setBusy(item.id, false); }
  };

  const handleRemove = async (id: string) => {
    if (!cartId || busyItems.has(id)) return;
    setBusy(id, true);
    try {
      const r = await fetch(`${BASE}/store/carts/${cartId}/line-items/${id}`,
        { method: "DELETE", headers: cartHeaders() });
      if (r.ok) { loadCart(cartId); refreshCart(); }
    } finally { setBusy(id, false); }
  };

  if (!mounted) return null;
  if (!!cartId && cart === null && error === null) return <CartSkeleton />;

  if (error) return (
    <section className="container py-24 flex flex-col items-center gap-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <p className="text-text-muted">{error}</p>
      <button onClick={() => { setError(null); if (cartId) loadCart(cartId); }}
        className="btn-primary px-8 py-3 text-xs">Försök igen</button>
    </section>
  );

  const items = cart?.items ?? [];

  /* ─── Empty state ─── */
  if (!cartId || items.length === 0) return (
    <section className="py-28 lg:py-36">
      <div className="container max-w-lg mx-auto flex flex-col items-center text-center gap-8">
        <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Din varukorg är tom</h1>
          <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto">
            Utforska vårt sortiment av premiumklockor och lägg till din nästa favorit.
          </p>
        </div>
        <Link href="/produkter" className="btn-primary px-10 py-4 text-xs">
          Utforska Kollektionen
        </Link>
      </div>
    </section>
  );

  const subtotal = cart?.subtotal ?? 0;
  const shippingTotal = cart?.shipping_total ?? 0;
  const total = cart?.total ?? 0;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  /* ─── Cart with items ─── */
  return (
    <div className="min-h-screen pb-28 lg:pb-16">
      {/* Header area */}
      <div className="bg-bg-secondary border-b border-border">
        <div className="container max-w-[1120px] mx-auto py-8 lg:py-12 px-6">
          <div className="flex items-baseline justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Varukorg
            </h1>
            <span className="text-sm text-text-muted">
              {itemCount} {itemCount === 1 ? "artikel" : "artiklar"}
            </span>
          </div>
        </div>
      </div>

      <div className="container max-w-[1120px] mx-auto px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">

          {/* ─── LEFT: Cart items ─── */}
          <div>
            {/* Trust banner */}
            <div className="mb-6">
              <TrustBadgeInline />
            </div>

            {/* Item list */}
            <div className="divide-y divide-border">
              {items.map((item) => {
                const busy = busyItems.has(item.id);
                const itemImg = resolveCartItemImage(item);
                return (
                  <article key={item.id}
                    className={`group py-6 first:pt-0 last:pb-0 transition-opacity duration-200 ${busy ? "opacity-40 pointer-events-none" : ""}`}>
                    <div className="flex gap-5">
                      {/* Image */}
                      <div className="relative w-[100px] h-[120px] sm:w-[120px] sm:h-[150px] shrink-0 rounded-sm overflow-hidden bg-bg-secondary border border-border">
                        {itemImg ? (
                          <Image src={itemImg} alt={item.title} fill
                            className="object-contain p-3 mix-blend-multiply" sizes="120px" />
                        ) : (
                          <OrinPlaceholder size={28} />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-bold text-[15px] leading-snug line-clamp-2">{item.title}</h3>
                            {item.subtitle && <p className="text-xs text-text-muted mt-1 line-clamp-1">{item.subtitle}</p>}
                          </div>
                          <button onClick={() => handleRemove(item.id)} disabled={busy}
                            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-secondary text-text-muted hover:text-error transition-colors"
                            aria-label={`Ta bort ${item.title}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>

                        <div className="mt-auto pt-4 flex items-center justify-between">
                          {/* Quantity */}
                          <div className="inline-flex items-center border border-border rounded-sm overflow-hidden">
                            <button onClick={() => handleQty(item, -1)} disabled={busy || item.quantity <= 1}
                              className="w-9 h-9 flex items-center justify-center text-sm text-text-muted hover:text-text hover:bg-bg-secondary disabled:opacity-25 transition-colors"
                              aria-label="Minska antal">−</button>
                            <span className="w-9 h-9 flex items-center justify-center text-sm font-semibold tabular-nums border-x border-border bg-white">
                              {item.quantity}
                            </span>
                            <button onClick={() => handleQty(item, 1)} disabled={busy}
                              className="w-9 h-9 flex items-center justify-center text-sm text-text-muted hover:text-text hover:bg-bg-secondary disabled:opacity-25 transition-colors"
                              aria-label="Öka antal">+</button>
                          </div>
                          {/* Price */}
                          <span className="font-bold tabular-nums text-[15px]">{safePriceDisplay(item)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Continue shopping link */}
            <div className="mt-6 pt-6 border-t border-border">
              <Link href="/produkter" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent transition-colors group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Fortsätt handla
              </Link>
            </div>
          </div>

          {/* ─── RIGHT: Summary ─── */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-bg-secondary rounded-sm border border-border overflow-hidden">
              {/* Summary header */}
              <div className="px-6 py-5 border-b border-border">
                <h2 className="text-xs font-bold uppercase tracking-[0.15em]">Ordersammanfattning</h2>
              </div>

              <div className="px-6 py-5 space-y-4">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Delsumma</dt>
                    <dd className="font-semibold tabular-nums">{formatPriceRaw(subtotal / 100)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Frakt</dt>
                    <dd className="font-semibold tabular-nums text-success">
                      {shippingTotal > 0 ? formatPriceRaw(shippingTotal / 100) : "Gratis"}
                    </dd>
                  </div>
                </dl>

                {/* Discount code */}
                <details className="group border-t border-border pt-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text transition-colors">
                    Rabattkod
                    <svg fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="12" className="transition-transform group-open:rotate-180"><path d="M6 9l6 6 6-6"/></svg>
                  </summary>
                  <div className="flex mt-3 gap-2">
                    <input type="text" placeholder="Ange kod" className="flex-1 border border-border bg-white px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent transition-colors" />
                    <button className="bg-bg-dark text-text-inverse px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-accent transition-colors">Använd</button>
                  </div>
                </details>

                {/* Total */}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-baseline">
                    <dt className="font-bold text-base">Totalt</dt>
                    <dd className="font-bold text-xl tabular-nums">{formatPriceRaw(total / 100)}</dd>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">Inkl. moms</p>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                <Link href="/kassan"
                  className="btn-primary w-full py-4 text-center text-xs flex items-center justify-center gap-2">
                  Gå till kassan
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </div>

            {/* Payment trust & guarantees */}
            <PaymentTrustBlock />
            <GuaranteesBlock />
          </div>
        </div>

        {/* ─── Recommended ─── */}
        {recommended.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-accent uppercase tracking-[0.2em] text-[11px] font-bold mb-1 block">Rekommenderat</span>
                <h2 className="text-xl lg:text-2xl font-bold">Du kanske också gillar</h2>
              </div>
              <Link href="/produkter" className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-accent border-b border-transparent hover:border-accent pb-0.5 transition-colors">
                Se alla
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} sizes="(max-width:768px) 50vw, 25vw" />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ─── Mobile sticky bar ─── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border p-4 lg:hidden z-50 safe-area-bottom">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">{itemCount} {itemCount === 1 ? "artikel" : "artiklar"}</span>
          <span className="font-bold text-lg tabular-nums">{formatPriceRaw(total / 100)}</span>
        </div>
        <Link href="/kassan" className="btn-primary w-full py-3.5 text-center text-xs flex items-center justify-center gap-2">
          Gå till kassan
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </Link>
      </div>
    </div>
  );
}

/* ─── Skeleton ─── */
function CartSkeleton() {
  return (
    <div className="min-h-screen pb-28 animate-pulse">
      <div className="bg-bg-secondary border-b border-border">
        <div className="container max-w-[1120px] mx-auto py-8 lg:py-12 px-6">
          <div className="h-8 w-40 bg-border rounded-sm" />
        </div>
      </div>
      <div className="container max-w-[1120px] mx-auto px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
          <div>
            <div className="h-10 w-full bg-bg-secondary rounded-sm border border-border mb-6" />
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-5 py-6 border-b border-border">
                <div className="w-[120px] h-[150px] bg-bg-secondary rounded-sm border border-border shrink-0" />
                <div className="flex-1 flex flex-col justify-between">
                  <div><div className="h-5 w-3/4 bg-border rounded-sm mb-2" /><div className="h-3 w-1/3 bg-bg-secondary rounded-sm" /></div>
                  <div className="flex justify-between items-center"><div className="h-9 w-28 bg-bg-secondary rounded-sm border border-border" /><div className="h-5 w-20 bg-border rounded-sm" /></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-bg-secondary rounded-sm border border-border p-6 space-y-4">
            <div className="h-4 w-32 bg-border rounded-sm" />
            <div className="h-4 w-full bg-border/50 rounded-sm" />
            <div className="h-4 w-full bg-border/50 rounded-sm" />
            <div className="h-px bg-border" />
            <div className="h-6 w-full bg-border rounded-sm" />
            <div className="h-12 w-full bg-bg-dark/20 rounded-sm mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
