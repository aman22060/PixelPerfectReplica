import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";


export const tokens = pgTable("tokens", {
  id: varchar("id").primaryKey(),
  rank: integer("rank").notNull(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  icon: text("icon").notNull(),
  price: numeric("price", { precision: 20, scale: 8 }).notNull(),
  change24h: numeric("change24h", { precision: 10, scale: 6 }).notNull(),
  change7d: numeric("change7d", { precision: 10, scale: 6 }).notNull(),
  volume24h: numeric("volume24h", { precision: 20, scale: 2 }).notNull(),
  marketCap: numeric("market_cap", { precision: 20, scale: 2 }).notNull(),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  status: text("status").notNull().$type<"new" | "final" | "migrated">(),
  description: text("description"),
  website: text("website"),
  twitter: text("twitter"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTokenSchema = createInsertSchema(tokens).omit({
  updatedAt: true,
});


export const createTokenInputSchema = z.object({
  id: z.string(),
  rank: z.coerce.number().int().nonnegative(),
  name: z.string().min(1),
  symbol: z.string().min(1),
  icon: z.string().min(1),
  price: z.coerce.number(),
  change24h: z.coerce.number(),
  change7d: z.coerce.number(),
  volume24h: z.coerce.number(),
  marketCap: z.coerce.number(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["new", "final", "migrated"]).optional().default("new"),
  description: z.string().optional(),
  website: z.string().url().optional(),
  twitter: z.string().url().optional(),
});


export type InsertToken = z.infer<typeof insertTokenSchema>;
export type CreateTokenInput = z.infer<typeof createTokenInputSchema>;
export type Token = typeof tokens.$inferSelect;


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

export const tokenDetailSchema = tokenSchema.extend({
  description: z.string().optional(),
  website: z.string().optional(),
  twitter: z.string().optional(),
  priceHistory: z
    .array(
      z.object({
        timestamp: z.number(),
        price: z.number(),
      })
    )
    .optional()
    .default([]),
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

export type SortColumn =
  | "rank"
  | "price"
  | "change24h"
  | "change7d"
  | "volume24h"
  | "marketCap";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  column: SortColumn;
  direction: SortDirection;
}
