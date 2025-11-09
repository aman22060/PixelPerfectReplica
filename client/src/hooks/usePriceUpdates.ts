// client/src/hooks/usePriceUpdates.ts
import { useEffect, useRef, useState } from "react";

/** Minimal UI token shape (numeric price for arithmetic) */
export type TokenUI = {
  id: string;
  name: string;
  symbol: string;
  price: number;         // <- numeric for math
  change24h?: number;
  change7d?: number;
  volume24h?: number;
  marketCap?: number;
  rank?: number;
  icon?: string;
  tags?: string[];
  status?: "new" | "migrated" | "final-stretch";
};

type Flash = "gain" | "loss";

type Options = {
  intervalMs?: number;   // default 2000ms
  flashMs?: number;      // default 600ms
  volatility?: number;   // +/- percent amplitude, default 0.02 = ±2%
};

/**
 * Client-side mock price ticker: periodically nudges a random token’s price,
 * returns updated tokens and a flash map to animate green/red blips.
 */
export function usePriceUpdates(
  tokens: TokenUI[],
  { intervalMs = 2000, flashMs = 600, volatility = 0.02 }: Options = {}
) {
  const [updatedTokens, setUpdatedTokens] = useState<TokenUI[]>(tokens);
  const [priceFlashes, setPriceFlashes] = useState<Map<string, Flash>>(new Map());

  // Keep state in sync when upstream tokens change (e.g., new page/search/sort)
  useEffect(() => {
    setUpdatedTokens(tokens);
  }, [tokens]);

  // refs to manage timers across renders and cleanup safely
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // clear any previous timers before starting fresh
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);

    intervalRef.current = setInterval(() => {
      setUpdatedTokens((prev) => {
        if (!prev.length) return prev;

        const idx = Math.floor(Math.random() * prev.length);
        const tok = prev[idx];
        if (!tok) return prev;

        // Compute a small random price change around current price
        const pct = (Math.random() - 0.5) * volatility * 2; // range ~ [-volatility, +volatility]
        const base = typeof tok.price === "number" ? tok.price : Number(tok.price ?? 0);
        const nextPrice = Math.max(0, base * (1 + pct));

        const next = [...prev];
        next[idx] = { ...tok, price: nextPrice };

        const flash = new Map<string, Flash>();
        flash.set(tok.id, pct >= 0 ? "gain" : "loss");
        setPriceFlashes(flash);

        // Clear flash after a short delay
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = setTimeout(() => setPriceFlashes(new Map()), flashMs);

        return next;
      });
    }, intervalMs);

    // Cleanup on unmount or dependency change
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      intervalRef.current = null;
      flashTimeoutRef.current = null;
    };
  }, [intervalMs, flashMs, volatility]);

  return { tokens: updatedTokens, priceFlashes };
}
