import { useQuery } from "@tanstack/react-query";
import { generateMockTokens } from "../utils/mockData";

// UI-friendly types (numbers)
type TokenUI = {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  rank?: number;
  price: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  tags?: string[];
  status?: "new" | "migrated" | "final-stretch";
};

type TokensResponseUI = {
  items: TokenUI[];
  page: number;
  pageSize: number;
  total: number;
};

type SortColumn = "rank" | "price" | "change24h" | "change7d" | "volume24h" | "marketCap";
type SortDirection = "asc" | "desc";
type SortConfig = { column: SortColumn; direction: SortDirection };

// UI tabs
type TabUI = "new" | "migrated" | "final-stretch";

// map UI tab -> storage/mock tab
const toStorageTab = (t: TabUI | undefined): "new" | "final" | "migrated" =>
  t === "final-stretch" ? "final" : (t ?? "new");

// map storage/mock tab -> UI tab
const toUiTab = (t: string | undefined): TabUI =>
  t === "final" ? "final-stretch" : ((t as TabUI) ?? "new");

const num = (v: unknown) => (typeof v === "number" ? v : Number(v ?? 0));

// normalize any shape from API/mocks into TokenUI
const normalizeToken = (t: any): TokenUI => ({
  ...t,
  price: num(t.price),
  change24h: num(t.change24h),
  change7d: num(t.change7d),
  volume24h: num(t.volume24h),
  marketCap: num(t.marketCap),
  status: toUiTab(t.status),
});

type Params = {
  tab: TabUI | undefined;
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: SortConfig[];
};

export function useTokens({
  tab,
  page = 1,
  pageSize = 50,
  search,
  sort = [],
}: Params) {
  return useQuery<TokensResponseUI>({
    queryKey: ["/api/tokens", tab, page, pageSize, search, sort],
    queryFn: async () => {
      const storageTab = toStorageTab(tab);
      const params = new URLSearchParams({
        tab: storageTab,
        page: String(page),
        pageSize: String(pageSize),
      });
      if (search) params.set("search", search);
      if (sort.length) params.set("sort", JSON.stringify(sort));

      try {
        const res = await fetch(`/api/tokens?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // API may return {items:[]} or {data:[]}
        const json = await res.json();
        const raw = (json.items ?? json.data ?? []) as any[];

        const items = raw.map(normalizeToken);
        return {
          items,
          page: json.page ?? page,
          pageSize: json.pageSize ?? pageSize,
          total: json.total ?? items.length,
        };
      } catch {
        // fallback to mocks for demo
        const raw = generateMockTokens(300, storageTab) as any[];
        let items = raw.map(normalizeToken);

        if (search) {
          const s = search.toLowerCase();
          items = items.filter(
            (t) => t.name.toLowerCase().includes(s) || t.symbol.toLowerCase().includes(s),
          );
        }

        // client-side sorting for fallback
        if (sort.length) {
          for (const srt of sort) {
            const dir = srt.direction === "asc" ? 1 : -1;
            items.sort((a: any, b: any) =>
              a[srt.column] > b[srt.column] ? dir : a[srt.column] < b[srt.column] ? -dir : 0,
            );
          }
        }

        const start = (page - 1) * pageSize;
        return {
          items: items.slice(start, start + pageSize),
          page,
          pageSize,
          total: items.length,
        };
      }
    },
    staleTime: 5000,
    // React Query v5 replacement for keepPreviousData:
    placeholderData: (prev) => prev,
  });
}
