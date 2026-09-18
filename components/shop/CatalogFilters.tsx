"use client";

/**
 * CatalogFilters - the filter + sort controls for the shop catalogue.
 *
 * All state lives in the URL search params (managed by the parent ShopCatalog),
 * so filters are shareable and survive refresh/back. On mobile the filter panel
 * collapses behind a toggle; the sort control stays visible.
 */
import { useState } from "react";

import { useT } from "@/lib/i18n";
import type { SortOption } from "@/lib/commerce/types";
import { Button } from "@/components/ui/Button";

export type MethodValue = "interior" | "exterior" | "greenhouse";

export interface CatalogFilterState {
  sort: SortOption;
  priceMin: number | null;
  priceMax: number | null;
  onlyAvailable: boolean;
  methods: MethodValue[];
}

export interface CatalogFiltersProps {
  state: CatalogFilterState;
  onChange: (next: Partial<CatalogFilterState>) => void;
  onClear: () => void;
  /** Hide the method filter for categories where it does not apply. */
  showMethod?: boolean;
  resultCount: number;
}

const SORT_ORDER: SortOption[] = [
  "novedad",
  "precio-asc",
  "precio-desc",
  "mas-vendidos",
  "disponibilidad",
];

export function CatalogFilters({
  state,
  onChange,
  onClear,
  showMethod = true,
  resultCount,
}: CatalogFiltersProps) {
  const t = useT();
  const [open, setOpen] = useState(false);

  const methods: MethodValue[] = ["interior", "exterior", "greenhouse"];
  const methodLabels: Record<MethodValue, string> = {
    interior: t.filters.methodInterior,
    exterior: t.filters.methodExterior,
    greenhouse: t.filters.methodGreenhouse,
  };

  function toggleMethod(method: MethodValue) {
    const next = state.methods.includes(method)
      ? state.methods.filter((m) => m !== method)
      : [...state.methods, method];
    onChange({ methods: next });
  }

  return (
    <div>
      {/* Sort + mobile filter toggle */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-offwhite/60">
          {resultCount} {resultCount === 1 ? "producto" : "productos"}
        </p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-offwhite/70">
            <span className="hidden sm:inline">{t.filters.sort}</span>
            <select
              value={state.sort}
              onChange={(e) => onChange({ sort: e.target.value as SortOption })}
              aria-label={t.filters.sort}
              className="rounded-full border border-gold/40 bg-black/40 px-3 py-1.5 text-sm text-offwhite focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {SORT_ORDER.map((opt) => (
                <option key={opt} value={opt} className="bg-black">
                  {t.filters.sortOptions[opt]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="rounded-full border border-gold/40 px-3 py-1.5 text-sm text-offwhite/80 hover:border-gold lg:hidden"
          >
            {t.filters.title}
          </button>
        </div>
      </div>

      <div className={[open ? "block" : "hidden", "lg:block"].join(" ")}>
        <div className="glass space-y-6 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-offwhite">{t.filters.title}</h2>
            <button type="button" onClick={onClear} className="text-xs text-gold hover:underline">
              {t.filters.clear}
            </button>
          </div>

          {/* Price range */}
          <fieldset>
            <legend className="text-sm font-semibold text-offwhite/80">{t.filters.price}</legend>
            <div className="mt-3 flex items-center gap-2">
              <label className="flex-1">
                <span className="sr-only">Mínimo</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="Mín €"
                  value={state.priceMin ?? ""}
                  onChange={(e) =>
                    onChange({ priceMin: e.target.value ? Number(e.target.value) : null })
                  }
                  className="h-10 w-full rounded-lg border border-gold/30 bg-black/40 px-3 text-sm text-offwhite placeholder:text-offwhite/40 focus-visible:border-gold focus-visible:outline-none"
                />
              </label>
              <span className="text-offwhite/40">–</span>
              <label className="flex-1">
                <span className="sr-only">Máximo</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="Máx €"
                  value={state.priceMax ?? ""}
                  onChange={(e) =>
                    onChange({ priceMax: e.target.value ? Number(e.target.value) : null })
                  }
                  className="h-10 w-full rounded-lg border border-gold/30 bg-black/40 px-3 text-sm text-offwhite placeholder:text-offwhite/40 focus-visible:border-gold focus-visible:outline-none"
                />
              </label>
            </div>
          </fieldset>

          {/* Availability */}
          <fieldset>
            <legend className="text-sm font-semibold text-offwhite/80">
              {t.filters.availability}
            </legend>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-offwhite/70">
              <input
                type="checkbox"
                checked={state.onlyAvailable}
                onChange={(e) => onChange({ onlyAvailable: e.target.checked })}
                className="h-4 w-4 accent-[color:var(--color-gold)]"
              />
              {t.filters.onlyAvailable}
            </label>
          </fieldset>

          {/* Cultivation method */}
          {showMethod && (
            <fieldset>
              <legend className="text-sm font-semibold text-offwhite/80">{t.filters.method}</legend>
              <div className="mt-3 space-y-2">
                {methods.map((method) => (
                  <label
                    key={method}
                    className="flex cursor-pointer items-center gap-2 text-sm text-offwhite/70"
                  >
                    <input
                      type="checkbox"
                      checked={state.methods.includes(method)}
                      onChange={() => toggleMethod(method)}
                      className="h-4 w-4 accent-[color:var(--color-gold)]"
                    />
                    {methodLabels[method]}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setOpen(false)}>
            Ver {resultCount} resultados
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CatalogFilters;
