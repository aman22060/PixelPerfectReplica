import { z } from "zod";

export const tokenSchema = z.object({
  id: z.string(),
  rank: z.number(),
  name: z.string(),
  symbol: z.string(),
  icon: z.string(),
  price: z.number(),
  change24h: z.number(),
  change7d: z.number(),
  volume24h: z.number(),
  marketCap: z.number(),
  tags: z.array(z.string()),
  status: z.enum(["new", "final", "migrated"]),
});

export type Token = z.infer<typeof tokenSchema>;

export const tokenDetailSchema = tokenSchema.extend({
  description: z.string().optional(),
  website: z.string().optional(),
  twitter: z.string().optional(),
  priceHistory: z.array(z.object({
    timestamp: z.number(),
    price: z.number(),
  })),
});

export type TokenDetail = z.infer<typeof tokenDetailSchema>;

export const tokensResponseSchema = z.object({
  data: z.array(tokenSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

export type TokensResponse = z.infer<typeof tokensResponseSchema>;

export type TabType = "new" | "final" | "migrated";

export type SortColumn = "rank" | "price" | "change24h" | "change7d" | "volume24h" | "marketCap";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  column: SortColumn;
  direction: SortDirection;
}
