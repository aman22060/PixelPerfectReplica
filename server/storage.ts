type InsertToken = any;
type Token = any;
type TabType = any;
type SortColumn = any;
type SortDirection = any;

type InMemoryToken = Token & {
  id: string;
  status?: TabType;
  updatedAt?: number;
  rank?: number;
};

function uid() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 9));
}


function normalizeTab(t?: string): "new" | "final" | "migrated" | undefined {
  if (!t) return undefined;
  if (t === "final-stretch") return "final";
  if (t === "new" || t === "final" || t === "migrated") return t;
  return undefined;
}

export class DbStorage {
  private tokens: InMemoryToken[] = [];

  constructor() {}

  async seedTokens(tokens: InsertToken[]): Promise<void> {
    this.tokens = [];
    let rank = 1;
    for (const t of tokens) {
      const newT: InMemoryToken = {
        id: (t.id as string) ?? uid(),
        rank: (t.rank as number) ?? rank++,
        name: t.name ?? t.symbol ?? "Unknown",
        symbol: t.symbol ?? "UNK",
        icon: t.icon ?? "",
        price: typeof t.price === "number" ? t.price : Number(t.price) || 0,
        change24h: typeof t.change24h === "number" ? t.change24h : Number(t.change24h) || 0,
        change7d: typeof t.change7d === "number" ? t.change7d : Number(t.change7d) || 0,
        volume24h: typeof t.volume24h === "number" ? t.volume24h : Number(t.volume24h) || 0,
        marketCap: typeof t.marketCap === "number" ? t.marketCap : Number(t.marketCap) || 0,
        tags: t.tags ?? [],
        status: normalizeTab(t.status) ?? "new",
        description: t.description ?? null,
        website: t.website ?? null,
        twitter: t.twitter ?? null,
        updatedAt: Date.now(),
        ...t,
      };
      this.tokens.push(newT);
    }
  }


  async listTokens(options: {
    tab?: TabType | string;
    page?: number;
    pageSize?: number;
    search?: string | undefined;
    sort?: { column?: SortColumn | string; direction?: SortDirection | string } | undefined;
  }): Promise<{ rows: InMemoryToken[]; count: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const pageSize = options.pageSize && options.pageSize > 0 ? options.pageSize : 50;
    let items = this.tokens.slice();

    if (options.tab) {
      const tab = normalizeTab(String(options.tab));
      if (tab) items = items.filter((it) => normalizeTab(String(it.status)) === tab);
    }

    if (options.search && options.search.trim() !== "") {
      const s = options.search.trim().toLowerCase();
      items = items.filter((it) => {
        return (
          String(it.name || "").toLowerCase().includes(s) ||
          String(it.symbol || "").toLowerCase().includes(s)
        );
      });
    }

    if (options.sort && options.sort.column) {
      const col = String(options.sort.column);
      const dir = String(options.sort.direction || "asc").toLowerCase();
      items.sort((a: any, b: any) => {
        const va = a[col];
        const vb = b[col];
        if (va == null && vb == null) return 0;
        if (va == null) return dir === "asc" ? -1 : 1;
        if (vb == null) return dir === "asc" ? 1 : -1;
        if (typeof va === "string" || typeof vb === "string") {
          return dir === "asc"
            ? String(va).localeCompare(String(vb))
            : String(vb).localeCompare(String(va));
        }
        return dir === "asc" ? Number(va) - Number(vb) : Number(vb) - Number(va);
      });
    }

    const count = items.length;
    const start = (page - 1) * pageSize;
    const rows = items.slice(start, start + pageSize);

    return { rows, count };
  }

  async getTokens(opts: {
    status?: TabType | string;
    page?: number;
    pageSize?: number;
    search?: string | undefined;
    sort?: { column?: SortColumn | string; direction?: SortDirection | string }[] | undefined;
  }): Promise<{ data: InMemoryToken[]; total: number }> {
    const sortOption = Array.isArray(opts.sort) && opts.sort.length > 0 ? opts.sort[0] : undefined;
    const { rows, count } = await this.listTokens({
      tab: opts.status,
      page: opts.page,
      pageSize: opts.pageSize,
      search: opts.search,
      sort: sortOption ? { column: sortOption.column, direction: sortOption.direction } : undefined,
    });
    return { data: rows, total: count };
  }


  async getAllTokenIds(): Promise<string[]> {
    return this.tokens.map((t) => t.id);
  }

  async getTokenById(id: string): Promise<InMemoryToken | undefined> {
    return this.tokens.find((t) => t.id === id);
  }

  async getTokenBySymbol(symbol: string): Promise<InMemoryToken | undefined> {
    return this.tokens.find((t) => String(t.symbol).toLowerCase() === String(symbol).toLowerCase());
  }


  async updateTokenPrice(idOrSymbol: string, newPriceOrData: any): Promise<InMemoryToken | undefined> {

    let token = this.tokens.find((t) => t.id === idOrSymbol);
    if (!token) {
      token = this.tokens.find((t) => String(t.symbol).toLowerCase() === String(idOrSymbol).toLowerCase());
    }
    if (!token) return undefined;

    if (typeof newPriceOrData === "number") {
      token.price = newPriceOrData;
      token.updatedAt = Date.now();
    } else if (typeof newPriceOrData === "object" && newPriceOrData !== null) {
      Object.assign(token, newPriceOrData);
      token.updatedAt = Date.now();
    }
    return token;
  }


  async countTokens(): Promise<number> {
    return this.tokens.length;
  }
}

export const storage = new DbStorage();

const SEED_TAGS = [
  ["L1"], ["L2"], ["DeFi"], ["NFT"], ["Oracle"],
  ["Gaming"], ["Scaling"], ["DEX"], ["Infra"], ["Meme"],
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function makeSeedToken(i: number, status: "new" | "final" | "migrated") {
  const names = [
    { name: "Bitcoin",  symbol: "BTC"  },
    { name: "Ethereum", symbol: "ETH"  },
    { name: "Solana",   symbol: "SOL"  },
    { name: "Cardano",  symbol: "ADA"  },
    { name: "Polkadot", symbol: "DOT"  },
    { name: "Avalanche",symbol: "AVAX" },
    { name: "Chainlink",symbol: "LINK" },
    { name: "Polygon",  symbol: "MATIC"},
    { name: "Uniswap",  symbol: "UNI"  },
    { name: "Cosmos",   symbol: "ATOM" },
    { name: "Litecoin", symbol: "LTC"  },
    { name: "Aptos",    symbol: "APT"  },
    { name: "Sui",      symbol: "SUI"  },
    { name: "NEAR",     symbol: "NEAR" },
    { name: "Arbitrum", symbol: "ARB"  },
    { name: "Optimism", symbol: "OP"   },
  ];
  const base = names[i % names.length];
  const basePrice = randomBetween(0.1, 50_000);
  const change24 = (Math.random() - 0.5) * 0.2;
  const change7  = (Math.random() - 0.5) * 0.4;
  const vol      = randomBetween(1_000_000, 10_000_000_000);
  const mcap     = basePrice * randomBetween(10_000_000, 1_000_000_000);

  const id = `${base.symbol.toLowerCase()}-${status}-${i}`;
  return {
    id,
    rank: i + 1,
    name: base.name,
    symbol: base.symbol,
    icon: `https://api.dicebear.com/7.x/shapes/svg?seed=${base.symbol}`,
    price: basePrice,            
    change24h: change24,
    change7d: change7,
    volume24h: vol,
    marketCap: mcap,
    tags: SEED_TAGS[i % SEED_TAGS.length],
    status,
    description: `${base.name} mock asset for demo.`,
    website: `https://${base.symbol.toLowerCase()}.org`,
    twitter: `@${base.symbol.toLowerCase()}`,
  };
}

export async function seedIfEmpty() {
  const existing = await storage.countTokens();
  if (existing > 0) return;

  const batches: InsertToken[] = [];
  (["new", "final", "migrated"] as const).forEach((tab) => {
    for (let i = 0; i < 200; i++) {
      batches.push(makeSeedToken(i, tab));
    }
  });

  await storage.seedTokens(batches);
}
