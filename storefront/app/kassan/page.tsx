"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPriceRaw } from "@/lib/locale";
import { resolveCartItemImage } from "@/lib/normalize-image-url";
import type { MedusaCart, ShippingOption } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
const KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

function jsonHeaders() {
  return { "x-publishable-api-key": KEY, "Content-Type": "application/json" };
}

// Module-scope stable references for useSyncExternalStore
function subscribeNoop() { return () => {}; }
const alwaysTrue = () => true;
const alwaysFalse = () => false;

type Step = "contact" | "shipping" | "review";

type ContactForm = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
};

type AddressForm = {
  address_1: string;
  address_2: string;
  city: string;
  postal_code: string;
  country_code: string;
};

const STEPS: Step[] = ["contact", "shipping", "review"];
const STEP_LABELS: Record<Step, string> = {
  contact: "Kontakt",
  shipping: "Leverans",
  review: "Granska",
};

export default function KassanPage() {
  const router = useRouter();
  const { cartId } = useCart();
  const mounted = useSyncExternalStore(subscribeNoop, alwaysTrue, alwaysFalse);

  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [step, setStep] = useState<Step>("contact");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [contact, setContact] = useState<ContactForm>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [address, setAddress] = useState<AddressForm>({
    address_1: "",
    address_2: "",
    city: "",
    postal_code: "",
    country_code: "se",
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);

  // Non-async: returns a Promise<MedusaCart | null> via .then() chain.
  // No setState called synchronously — satisfies react-hooks/set-state-in-effect.
  const loadCart = useCallback((id: string): Promise<MedusaCart | null> => {
    return fetch(`${BASE}/store/carts/${id}?fields=id,currency_code,email,subtotal,shipping_total,tax_total,total,region_id,shipping_address.id,shipping_address.first_name,shipping_address.last_name,shipping_address.address_1,shipping_address.address_2,shipping_address.city,shipping_address.postal_code,shipping_address.country_code,shipping_address.phone,items.id,items.title,items.subtitle,items.thumbnail,items.quantity,items.unit_price,items.total,items.variant_id,items.variant.product.thumbnail,items.variant.product.images.url`, {
      headers: { "x-publishable-api-key": KEY },
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{ cart: MedusaCart }>;
      })
      .then((data) => (data as { cart: MedusaCart } | null)?.cart ?? null)
      .catch(() => null);
  }, []);

  useEffect(() => {
    if (!mounted || !cartId) return;
    loadCart(cartId).then((c) => {
      if (!c) { router.replace("/varukorg"); return; }
      setCart(c);
      if (c.email) setContact((prev) => ({ ...prev, email: c.email! }));
      if (c.shipping_address) {
        const a = c.shipping_address;
        setContact((prev) => ({
          ...prev,
          first_name: a.first_name ?? prev.first_name,
          last_name: a.last_name ?? prev.last_name,
          phone: a.phone ?? prev.phone,
        }));
        setAddress({
          address_1: a.address_1 ?? "",
          address_2: a.address_2 ?? "",
          city: a.city ?? "",
          postal_code: a.postal_code ?? "",
          country_code: a.country_code ?? "se",
        });
      }
    });
  }, [mounted, cartId, loadCart, router]);

  // Redirect when cartId disappears (cart cleared in another tab)
  useEffect(() => {
    if (mounted && !cartId) router.replace("/varukorg");
  }, [mounted, cartId, router]);

  const fetchShippingOptions = useCallback(async (id: string) => {
    const res = await fetch(`${BASE}/store/shipping-options?cart_id=${id}`, {
      headers: { "x-publishable-api-key": KEY },
    });
    if (!res.ok) return;
    const data = (await res.json()) as { shipping_options: ShippingOption[] };
    const opts = data.shipping_options ?? [];
    setShippingOptions(opts);
    if (opts.length > 0) setSelectedShippingId(opts[0].id);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch(`${BASE}/store/carts/${cartId}`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({
          email: contact.email,
          shipping_address: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            phone: contact.phone || undefined,
          },
        }),
      });
      if (!res.ok) throw new Error("Kunde inte spara kontaktuppgifter.");
      const data = (await res.json()) as { cart: MedusaCart };
      setCart(data.cart);
      setStep("shipping");
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch(`${BASE}/store/carts/${cartId}`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({
          shipping_address: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            phone: contact.phone || undefined,
            address_1: address.address_1,
            address_2: address.address_2 || undefined,
            city: address.city,
            postal_code: address.postal_code,
            country_code: address.country_code,
          },
        }),
      });
      if (!res.ok) throw new Error("Kunde inte spara leveransadress.");
      const data = (await res.json()) as { cart: MedusaCart };
      setCart(data.cart);
      await fetchShippingOptions(cartId);
      setStep("review");
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShippingSelect = async (optionId: string) => {
    if (!cartId) return;
    setSelectedShippingId(optionId);
    await fetch(`${BASE}/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ option_id: optionId }),
    });
    const updated = await loadCart(cartId);
    if (updated) setCart(updated);
  };

  if (!mounted) return null;

  // Show skeleton while waiting for initial cart load
  const isLoading = !!cartId && cart === null;
  if (isLoading) return <CheckoutSkeleton />;

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shippingTotal = cart?.shipping_total ?? 0;
  const total = cart?.total ?? 0;
  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen bg-bg-secondary pb-20">
      <div className="container py-6 lg:py-10">
        {/* Step breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm flex-wrap">
          <Link href="/varukorg" className="text-text-muted hover:text-text transition-colors">
            Varukorg
          </Link>
          {STEPS.map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span className="text-text-muted">/</span>
              <button
                type="button"
                disabled={i >= stepIndex}
                onClick={() => { if (i < stepIndex) setStep(s); }}
                className={
                  i === stepIndex
                    ? "font-semibold text-text cursor-default"
                    : i < stepIndex
                    ? "text-accent hover:underline"
                    : "text-text-muted cursor-default"
                }
              >
                {STEP_LABELS[s]}
              </button>
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Left: step forms */}
          <div className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {formError}
              </div>
            )}

            {/* Step 1: Contact */}
            {step === "contact" && (
              <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <h2 className="font-semibold text-base mb-5">Kontaktuppgifter</h2>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      E-post *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={contact.email}
                      onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      placeholder="din@epost.se"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="first_name">
                        Förnamn *
                      </label>
                      <input
                        id="first_name"
                        type="text"
                        required
                        value={contact.first_name}
                        onChange={(e) => setContact((p) => ({ ...p, first_name: e.target.value }))}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="last_name">
                        Efternamn *
                      </label>
                      <input
                        id="last_name"
                        type="text"
                        required
                        value={contact.last_name}
                        onChange={(e) => setContact((p) => ({ ...p, last_name: e.target.value }))}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="phone">
                      Telefon
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      placeholder="+46 70 123 45 67"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full py-3 mt-2 disabled:opacity-60"
                  >
                    {submitting ? "Sparar…" : "Fortsätt till leverans →"}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Shipping address */}
            {step === "shipping" && (
              <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <h2 className="font-semibold text-base mb-5">Leveransadress</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="address_1">
                      Gatuadress *
                    </label>
                    <input
                      id="address_1"
                      type="text"
                      required
                      value={address.address_1}
                      onChange={(e) => setAddress((p) => ({ ...p, address_1: e.target.value }))}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      placeholder="Storgatan 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="address_2">
                      Lägenhetsnummer / c/o
                    </label>
                    <input
                      id="address_2"
                      type="text"
                      value={address.address_2}
                      onChange={(e) => setAddress((p) => ({ ...p, address_2: e.target.value }))}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      placeholder="Lgh 1101"
                    />
                  </div>
                  <div className="grid grid-cols-[1fr_2fr] gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="postal_code">
                        Postnummer *
                      </label>
                      <input
                        id="postal_code"
                        type="text"
                        required
                        value={address.postal_code}
                        onChange={(e) => setAddress((p) => ({ ...p, postal_code: e.target.value }))}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                        placeholder="123 45"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="city">
                        Stad *
                      </label>
                      <input
                        id="city"
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                        placeholder="Stockholm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Land</label>
                    <div className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-bg-secondary text-text-muted">
                      Sverige
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full py-3 mt-2 disabled:opacity-60"
                  >
                    {submitting ? "Sparar…" : "Fortsätt till granskning →"}
                  </button>
                </form>
              </div>
            )}

            {/* Step 3: Review + payment placeholder */}
            {step === "review" && (
              <div className="space-y-4">
                {/* Shipping options */}
                {shippingOptions.length > 0 && (
                  <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                    <h2 className="font-semibold text-base mb-4">Välj fraktmetod</h2>
                    <div className="space-y-2">
                      {shippingOptions.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                            selectedShippingId === opt.id
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-border-dark"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShippingId === opt.id}
                              onChange={() => handleShippingSelect(opt.id)}
                              className="accent-accent"
                            />
                            <span className="text-sm font-medium">{opt.name}</span>
                          </div>
                          <span className="text-sm tabular-nums">
                            {opt.amount === 0 ? "Gratis" : formatPriceRaw(opt.amount / 100)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary of entered info */}
                <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                  <h2 className="font-semibold text-base mb-4">Dina uppgifter</h2>
                  <div className="text-sm space-y-1 text-text-muted">
                    <p>{contact.first_name} {contact.last_name}</p>
                    <p>{contact.email}</p>
                    {contact.phone && <p>{contact.phone}</p>}
                    <div className="pt-2 border-t border-border mt-2">
                      <p>
                        {address.address_1}
                        {address.address_2 ? `, ${address.address_2}` : ""}
                      </p>
                      <p>{address.postal_code} {address.city}</p>
                      <p>Sverige</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("contact")}
                    className="text-xs text-accent hover:underline mt-3"
                  >
                    Ändra uppgifter
                  </button>
                </div>

                {/* Payment placeholder */}
                <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                  <h2 className="font-semibold text-base mb-4">Betalning</h2>
                  <div className="rounded-lg bg-bg-secondary border border-border px-4 py-4 text-sm text-text-muted text-center">
                    Betalningsintegration konfigureras för lansering.
                    <br />
                    <span className="text-xs">Inga riktiga betalningar kan genomföras just nu.</span>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="btn-primary w-full py-3 mt-4 opacity-40 cursor-not-allowed"
                  >
                    Genomför köp
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: order summary sidebar */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 lg:sticky lg:top-24">
            <h2 className="font-semibold text-base mb-4">Din beställning</h2>
            <ul className="space-y-3 mb-4">
              {items.map((item) => {
                const itemImg = resolveCartItemImage(item);
                return (
                <li key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden bg-bg-secondary border border-border">
                    {itemImg && (
                      <Image
                        src={itemImg}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-2">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-xs text-text-muted line-clamp-1">{item.subtitle}</p>
                    )}
                    <p className="text-xs text-text-muted">Antal: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold tabular-nums shrink-0">
                    {formatPriceRaw(item.total / 100)}
                  </span>
                </li>
                );
              })}
            </ul>
            <dl className="space-y-2 text-sm border-t border-border pt-3">
              <div className="flex justify-between">
                <dt className="text-text-muted">Delsumma</dt>
                <dd className="tabular-nums font-medium">{formatPriceRaw(subtotal / 100)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Frakt</dt>
                <dd className="tabular-nums font-medium">
                  {shippingTotal > 0 ? formatPriceRaw(shippingTotal / 100) : "—"}
                </dd>
              </div>
              <div className="border-t border-border pt-3 mt-1 flex justify-between font-semibold text-base">
                <dt>Totalt</dt>
                <dd className="tabular-nums">{formatPriceRaw(total / 100)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-bg-secondary pb-20 animate-pulse">
      <div className="container py-6 lg:py-10">
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-16 bg-border rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
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
