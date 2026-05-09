"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { t } from "@/lib/translations";

const NAV_LINKS = [
  { href: "/herrklockor", label: t.menWatches, className: "nav-link" },
  { href: "/damklockor", label: t.womenWatches, className: "nav-link" },
  { href: "/marken", label: t.brands, className: "nav-link" },
  { href: "/rea", label: t.sale, className: "nav-link text-sale" },
] as const;

export function NavigationHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll and handle keyboard when drawer is open
  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);

    // Move focus into the drawer
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      {/* Announcement banner */}
      <div className="top-banner">
        <div className="container">
          <p className="m-0">
            {t.freeShippingThreshold} &bull; {t.openPurchase}
          </p>
        </div>
      </div>

      {/* Sticky header */}
      <div className="header-wrapper glass-effect">
        <div className="container">
          <header className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex-1">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
              >
                ORIN<span className="text-accent">.</span>
              </Link>
            </div>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center space-x-10"
              aria-label="Huvudnavigation"
            >
              {NAV_LINKS.map(({ href, label, className }) => (
                <Link key={href} href={href} className={className}>
                  {label}
                </Link>
              ))}
            </nav>

            {/* Action icons */}
            <div className="flex-1 flex items-center justify-end space-x-4">
              <button className="header-icon-btn" aria-label={t.search}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>

              <button
                className="header-icon-btn hidden sm:flex"
                aria-label={t.myAccount}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              <Link
                href="/varukorg"
                className="header-icon-btn relative"
                aria-label={
                  itemCount > 0
                    ? `${t.cart} (${itemCount} artikel${itemCount !== 1 ? "ar" : ""})`
                    : t.cart
                }
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-bg-dark text-[10px] font-bold text-text-inverse"
                    aria-hidden="true"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Hamburger — mobile only */}
              <button
                className="header-icon-btn lg:hidden"
                aria-label="Öppna meny"
                aria-expanded={isOpen}
                aria-controls="mobile-nav-drawer"
                onClick={open}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="drawer-overlay"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Slide-in drawer — stays in DOM so CSS transition fires */}
      <nav
        id="mobile-nav-drawer"
        className={`mobile-drawer${isOpen ? " mobile-drawer--open" : ""}`}
        aria-label="Mobilnavigation"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        {/* Drawer header row */}
        <div className="mobile-drawer-header">
          <Link
            href="/"
            className="text-xl font-bold tracking-tighter"
            onClick={close}
          >
            ORIN<span className="text-accent">.</span>
          </Link>
          <button
            ref={closeButtonRef}
            className="header-icon-btn"
            onClick={close}
            aria-label="Stäng meny"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Primary links */}
        <ul className="mobile-drawer-nav" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="mobile-nav-link"
                onClick={close}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/nyheter" className="mobile-nav-link" onClick={close}>
              {t.newArrivals}
            </Link>
          </li>
        </ul>

        {/* Secondary footer links */}
        <div className="mobile-drawer-footer">
          <Link href="/kontakt" className="mobile-drawer-footer-link" onClick={close}>
            {t.contact}
          </Link>
          <Link href="/om-oss" className="mobile-drawer-footer-link" onClick={close}>
            {t.aboutUs}
          </Link>
        </div>
      </nav>
    </>
  );
}
