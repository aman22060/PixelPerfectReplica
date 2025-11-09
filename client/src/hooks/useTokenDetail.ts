import { useQuery } from "@tanstack/react-query";
import { generateMockTokenDetail, generateMockTokens } from "../utils/mockData";

const num = (v: unknown) => (typeof v === "number" ? v : Number(v ?? 0));
const toStorageTab = (t: string | undefined): "new" | "final" | "migrated" =>
  t === "final-stretch" ? "final" : ((t as any) ?? "new");

// Normalize detail coming back from API/mocks
const normalizeDetail = (d: any) => ({
  ...d,
  price: num(d.price),
  change24h: num(d.change24h),
  change7d: num(d.change7d),
  volume24h: num(d.volume24h),
  marketCap: num(d.marketCap),
  priceHistory: Array.isArray(d.priceHistory)
    ? d.priceHistory.map((p: any) => ({ timestamp: num(p.timestamp), price: num(p.price) }))
    : [],
});

export function useTokenDetail(tokenId?: string) {
  return useQuery({
    queryKey: ["/api/tokens", tokenId],
    queryFn: async () => {
      if (!tokenId) throw new Error("No token ID");

      try {
        const res = await fetch(`/api/tokens/${tokenId}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return normalizeDetail(json);
      } catch {
        // fallback from mocks
        const all = [
          ...generateMockTokens(200, "new"),
          ...generateMockTokens(200, "final"),     // NOTE: generator expects "final"
          ...generateMockTokens(200, "migrated"),
        ] as any[];
        const t = all.find((x) => x.id === tokenId) ?? all[0];
        return normalizeDetail(generateMockTokenDetail(t));
      }
    },
    enabled: !!tokenId,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}
