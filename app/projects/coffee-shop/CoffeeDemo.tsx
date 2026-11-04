"use client";

import { useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

// A small in-browser version of the Coffee Shop's inventory logic: drinks are made from recipes,
// availability comes from ingredient stock, and stock is only deducted when an order is completed.

type Unit = "kg" | "g" | "l" | "ml" | "pcs";
type Ingredient = { name: string; unit: Unit; stock: number; reorderAt: number };
type Recipe = Record<string, { amount: number; unit: Unit }>;

const START: Record<string, Ingredient> = {
  beans: { name: "Espresso beans", unit: "kg", stock: 0.5, reorderAt: 0.15 },
  milk: { name: "Milk", unit: "l", stock: 2, reorderAt: 0.6 },
  caramel: { name: "Caramel syrup", unit: "l", stock: 0.25, reorderAt: 0.08 },
  cups: { name: "Cups", unit: "pcs", stock: 12, reorderAt: 4 },
};

const MENU: { name: string; price: number; recipe: Recipe }[] = [
  { name: "Espresso", price: 90, recipe: { beans: { amount: 18, unit: "g" }, cups: { amount: 1, unit: "pcs" } } },
  {
    name: "Latte",
    price: 140,
    recipe: { beans: { amount: 18, unit: "g" }, milk: { amount: 220, unit: "ml" }, cups: { amount: 1, unit: "pcs" } },
  },
  {
    name: "Caramel latte",
    price: 160,
    recipe: {
      beans: { amount: 18, unit: "g" },
      milk: { amount: 200, unit: "ml" },
      caramel: { amount: 30, unit: "ml" },
      cups: { amount: 1, unit: "pcs" },
    },
  },
];

// How many of the stock unit one recipe unit is, e.g. 1 g = 0.001 kg
const TO_STOCK: Partial<Record<Unit, Partial<Record<Unit, number>>>> = {
  g: { kg: 0.001, g: 1 },
  ml: { l: 0.001, ml: 1 },
  pcs: { pcs: 1 },
};
const convert = (amount: number, from: Unit, to: Unit) => amount * (TO_STOCK[from]?.[to] ?? 1);

// Floating-point drift from repeated subtraction would show up as 0.30000000000000004
const tidy = (n: number) => Math.round(n * 1000) / 1000;

const format = (value: number, unit: Unit) => {
  if (unit === "kg" && value < 1) return `${Math.round(value * 1000)} g`;
  if (unit === "l" && value < 1) return `${Math.round(value * 1000)} ml`;
  return `${tidy(value)} ${unit}`;
};

// The most drinks the current stock could make: the scarcest ingredient decides
function canMake(recipe: Recipe, stock: Record<string, Ingredient>) {
  return Math.min(
    ...Object.entries(recipe).map(([key, need]) =>
      Math.floor(stock[key].stock / convert(need.amount, need.unit, stock[key].unit))
    )
  );
}

export default function CoffeeDemo() {
  const [stock, setStock] = useState(START);
  const [order, setOrder] = useState<Record<string, number>>({});
  const [log, setLog] = useState<string[]>([]);

  const count = (name: string) => order[name] ?? 0;
  const items = MENU.filter((m) => count(m.name) > 0);
  const total = items.reduce((sum, m) => sum + m.price * count(m.name), 0);

  // What the whole order needs from each ingredient, in stock units
  const needs = () => {
    const totals: Record<string, number> = {};
    for (const item of items) {
      for (const [key, need] of Object.entries(item.recipe)) {
        totals[key] = (totals[key] ?? 0) + convert(need.amount, need.unit, stock[key].unit) * count(item.name);
      }
    }
    return totals;
  };

  const say = (line: string) => setLog((l) => [line, ...l].slice(0, 4));

  const change = (name: string, delta: number) => setOrder((o) => ({ ...o, [name]: Math.max(0, (o[name] ?? 0) + delta) }));

  const complete = () => {
    const totals = needs();
    // Check every ingredient first and report all shortages together, like the real API
    const short = Object.entries(totals).filter(([key, amount]) => amount > stock[key].stock + 1e-9);
    if (short.length) {
      say(`Can't complete: not enough ${short.map(([key]) => stock[key].name.toLowerCase()).join(", ")}.`);
      return;
    }
    setStock((s) => {
      const next = { ...s };
      for (const [key, amount] of Object.entries(totals)) next[key] = { ...next[key], stock: tidy(next[key].stock - amount) };
      return next;
    });
    say(`Completed ${items.map((m) => `${count(m.name)}× ${m.name}`).join(", ")}. Ingredients deducted.`);
    setOrder({});
  };

  const cancel = () => {
    // Nothing was deducted while the order was open, so there's nothing to put back
    say("Order cancelled. Stock unchanged, since nothing was taken yet.");
    setOrder({});
  };

  const restock = () => {
    setStock(START);
    setOrder({});
    setLog(["Restocked."]);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-mono text-muted">Menu</p>
          {MENU.map((m) => {
            const available = canMake(m.recipe, stock);
            return (
              <div key={m.name} className="flex items-center justify-between gap-3 py-1.5">
                <div className="min-w-0">
                  <p className="text-sm text-fg">{m.name}</p>
                  <p className="text-[11px] font-mono text-muted">
                    ₱{m.price} · {available > 0 ? `can make ${available}` : "out of stock"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => change(m.name, -1)}
                    disabled={count(m.name) === 0}
                    aria-label={`Remove one ${m.name}`}
                    className="p-1 rounded-md border border-line text-muted hover:text-fg disabled:opacity-30 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-4 text-center text-sm font-mono text-fg" aria-live="polite">
                    {count(m.name)}
                  </span>
                  <button
                    type="button"
                    onClick={() => change(m.name, 1)}
                    // Adding is checked against stock, but nothing is deducted until the order completes
                    disabled={count(m.name) >= available}
                    aria-label={`Add one ${m.name}`}
                    className="p-1 rounded-md border border-line text-muted hover:text-fg disabled:opacity-30 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-line">
            <span className="text-sm text-fg mr-auto">Total ₱{total}</span>
            <button
              type="button"
              onClick={cancel}
              disabled={items.length === 0}
              className="px-3 py-1.5 rounded-lg border border-line text-xs font-mono text-muted hover:text-fg disabled:opacity-30 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={complete}
              disabled={items.length === 0}
              className="px-3 py-1.5 rounded-lg bg-accent text-canvas text-xs font-mono font-medium hover:opacity-80 disabled:opacity-30 transition"
            >
              Complete order
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-muted">Ingredient stock</p>
            <button
              type="button"
              onClick={restock}
              className="flex items-center gap-1 text-[11px] font-mono text-muted hover:text-fg transition"
            >
              <RotateCcw className="w-3 h-3" />
              Restock
            </button>
          </div>
          {Object.entries(stock).map(([key, ing]) => {
            const low = ing.stock <= ing.reorderAt;
            const pct = Math.max(0, Math.min(100, (ing.stock / START[key].stock) * 100));
            return (
              <div key={key} className="space-y-1 py-1">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="text-fg-soft">{ing.name}</span>
                  <span className="flex items-center gap-2 text-xs font-mono text-muted">
                    {low && <span className="px-1.5 rounded border border-line-strong text-fg text-[10px]">LOW</span>}
                    {format(ing.stock, ing.unit)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-line overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${low ? "bg-fg" : "bg-muted"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-line min-h-[3.5rem]" aria-live="polite">
        {log.length === 0 ? (
          <p className="text-xs font-mono text-muted">Add a few drinks and complete the order to watch the stock change.</p>
        ) : (
          <ul className="space-y-1">
            {log.map((line, i) => (
              <li key={`${line}-${i}`} className={`text-xs font-mono ${i === 0 ? "text-fg-soft" : "text-muted"}`}>
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
