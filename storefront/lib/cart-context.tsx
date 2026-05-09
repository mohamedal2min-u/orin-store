"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const CART_ID_KEY = "orin_cart_id";

// Stable functions required by useSyncExternalStore (must not be recreated on
// every render — defined at module scope).
function subscribeToStorage(callback: () => void) {
  // The "storage" event fires when localStorage changes from another tab.
  // The "orin_cart_updated" event is dispatched manually for same-tab mutations.
  window.addEventListener("storage", callback);
  window.addEventListener("orin_cart_updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("orin_cart_updated", callback);
  };
}
function getCartIdSnapshot() {
  return localStorage.getItem(CART_ID_KEY);
}
function getServerCartIdSnapshot() {
  // Server-side: no localStorage — start with null.
  return null;
}

type CartContextValue = {
  cartId: string | null;
  itemCount: number;
  refreshCart: () => void;
};

const CartContext = createContext<CartContextValue>({
  cartId: null,
  itemCount: 0,
  refreshCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore is the React-Compiler-compatible way to read from
  // external stores (localStorage). This avoids setState in the effect body,
  // satisfying the react-hooks/set-state-in-effect rule.
  const cartId = useSyncExternalStore(
    subscribeToStorage,
    getCartIdSnapshot,
    getServerCartIdSnapshot
  );

  // Raw item count from the last successful Medusa fetch.
  // When cartId is absent, we derive 0 without an extra state update.
  const [fetchedCount, setFetchedCount] = useState(0);
  const itemCount = cartId ? fetchedCount : 0;

  const fetchItemCount = useCallback((id: string) => {
    const base =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
    const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

    // All setState calls happen inside .then() callbacks — never synchronously
    // in the effect body, keeping the React Compiler rule satisfied.
    fetch(`${base}/store/carts/${id}`, {
      headers: { "x-publishable-api-key": key },
      signal: AbortSignal.timeout(5000),
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem(CART_ID_KEY);
          return null;
        }
        return res.json() as Promise<{ cart: { items?: unknown[] } }>;
      })
      .then((data) => {
        if (data) setFetchedCount(data.cart?.items?.length ?? 0);
        else setFetchedCount(0);
      })
      .catch(() => {
        // Network error — keep last known count rather than resetting to 0
      });
  }, []);

  // Read cartId from localStorage at call time rather than from the stale closure
  // so calling refreshCart() immediately after setItem (first cart creation) works.
  const refreshCart = useCallback(() => {
    const id = localStorage.getItem(CART_ID_KEY);
    if (id) fetchItemCount(id);
  }, [fetchItemCount]);

  // Sync with Medusa whenever the cart ID changes.
  // No synchronous setState here — fetchItemCount is the only call and it
  // defers all setState to Promise .then() callbacks.
  useEffect(() => {
    if (cartId) fetchItemCount(cartId);
  }, [cartId, fetchItemCount]);

  return (
    <CartContext.Provider value={{ cartId, itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  return useContext(CartContext);
}
