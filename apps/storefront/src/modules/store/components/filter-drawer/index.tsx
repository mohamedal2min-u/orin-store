"use client"

import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react"
import { Fragment, useState } from "react"
import { XMark } from "@medusajs/icons"
import RefinementList from "../refinement-list"
import { SortOptions } from "../refinement-list/sort-products"

type FilterDrawerProps = {
  isOpen: boolean
  close: () => void
  sortBy: SortOptions
}

const FilterDrawer = ({ isOpen, close, sortBy }: FilterDrawerProps) => {
  const [activeFilters, setActiveFilters] = useState(0)

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={close}>
        {/* Backdrop with premium blur */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-kv-primary/20 backdrop-blur-md" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <TransitionChild
                as={Fragment}
                enter="transform transition-all ease-[cubic-bezier(0.16,1,0.3,1)] duration-500"
                enterFrom="translate-x-full opacity-95"
                enterTo="translate-x-0 opacity-100"
                leave="transform transition-all ease-[cubic-bezier(0.7,0,0.84,0)] duration-400"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="translate-x-full opacity-0"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-[420px]">
                  <div className="flex h-full flex-col bg-kv-bg shadow-[-8px_0_40px_rgba(28,23,20,0.08)]">
                    
                    {/* ── Header ── */}
                    <div className="relative px-8 py-7 border-b border-kv-border/60">
                      {/* Decorative accent line */}
                      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-kv-accent/40 to-transparent" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Filter icon */}
                          <div className="flex items-center justify-center w-9 h-9 bg-kv-primary rounded-sm">
                            <svg
                              className="w-[15px] h-[15px] text-kv-bg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                              />
                            </svg>
                          </div>
                          <div>
                            <DialogTitle className="text-[15px] font-semibold text-kv-primary uppercase tracking-kv-wider">
                              Filter
                            </DialogTitle>
                            <p className="text-[11px] text-kv-secondary tracking-wide mt-0.5">
                              Förfina din sökning
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="group relative flex items-center justify-center w-9 h-9 rounded-sm border border-kv-border/60 text-kv-secondary hover:text-kv-primary hover:border-kv-primary/30 hover:bg-kv-surface transition-all duration-200"
                          onClick={close}
                          aria-label="Stäng filter"
                        >
                          <XMark className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                        </button>
                      </div>
                    </div>

                    {/* ── Filter Content ── */}
                    <div className="relative flex-1 overflow-y-auto overscroll-contain">
                      {/* Subtle top fade for scroll indication */}
                      <div className="sticky top-0 left-0 right-0 h-4 bg-gradient-to-b from-kv-bg to-transparent z-10 pointer-events-none" />
                      
                      <div className="px-8 pb-8 -mt-2">
                        <RefinementList sortBy={sortBy} />
                      </div>

                      {/* Subtle bottom fade */}
                      <div className="sticky bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-kv-bg to-transparent pointer-events-none" />
                    </div>

                    {/* ── Footer ── */}
                    <div className="border-t border-kv-border/60 p-6 px-8 bg-kv-surface/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        {/* Clear All */}
                        <button
                          type="button"
                          className="flex-1 py-3 text-[12px] font-medium text-kv-secondary uppercase tracking-kv-wider border border-kv-border/80 rounded-sm hover:text-kv-primary hover:border-kv-primary/30 transition-all duration-200"
                          onClick={close}
                        >
                          Rensa alla
                        </button>

                        {/* Apply */}
                        <button
                          type="button"
                          className="flex-[2] py-3 text-[12px] font-semibold text-kv-bg uppercase tracking-kv-wider bg-kv-primary rounded-sm hover:bg-kv-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={close}
                        >
                          Visa resultat
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default FilterDrawer
