"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
const KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

export function AddToCartButton({ variantId }: { variantId: string | undefined }) {
  const { cartId, refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAdd() {
    if (!variantId) return;
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      let id = cartId;

      if (!id) {
        const res = await fetch(`${BASE}/store/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-publishable-api-key": KEY },
          body: JSON.stringify({}),
        });
        if (!res.ok) throw new Error("Kunde inte skapa kundvagn.");
        const data = await res.json();
        id = data.cart.id as string;
        localStorage.setItem("orin_cart_id", id);
        // Force CartContext to notice the new cart ID immediately
        window.dispatchEvent(new Event("orin_cart_updated"));
      }

      const res = await fetch(`${BASE}/store/carts/${id}/line-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-publishable-api-key": KEY },
        body: JSON.stringify({ variant_id: variantId, quantity: 1 }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Cart API Error:", errorData);
        // Map backend errors to Swedish user-friendly messages
        if (errorData?.message?.includes("not associated with any stock location")) {
          throw new Error("Lagersaldot är inte korrekt konfigurerat i systemet (Stock Location saknas).");
        }
        throw new Error(errorData?.message || "Kunde inte lägga till produkt i kundvagnen.");
      }

      refreshCart();
      // Also dispatch event after adding item so any other listeners update immediately
      window.dispatchEvent(new Event("orin_cart_updated"));
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Något gick fel.");
      setTimeout(() => setStatus("idle"), 4000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleAdd}
        disabled={loading || !variantId || status === "success"}
        className={`w-full h-[52px] rounded font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:cursor-not-allowed ${
          status === "success" 
            ? "bg-success text-white" 
            : status === "error"
              ? "bg-error text-white"
              : "bg-[#3A3BA8] hover:bg-[#2A2B98] text-white disabled:opacity-70"
        }`}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : status === "success" ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : status === "error" ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        )}
        
        {loading 
          ? "Lägger till..." 
          : status === "success" 
            ? "Tillagd" 
            : status === "error"
              ? "Försök igen"
              : "Lägg till i kundvagn"}
      </button>
      
      {status === "error" && errorMessage && (
        <p className="text-error text-xs font-medium mt-2 text-center animate-fade-in">{errorMessage}</p>
      )}
    </div>
  );
}
