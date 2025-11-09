import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { eq, sql, and, or, ilike, desc, asc } from "drizzle-orm";
import * as schema from "@shared/schema";
import type { InsertToken, Token, TabType, SortColumn, SortDirection } from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export interface IStorage {
  getTokens(params: {
    status: TabType;
    page: number;
    pageSize: number;
    search?: string;
    sort?: Array<{ column: SortColumn; direction: SortDirection }>;
  }): Promise<{ data: Token[]; total: number }>;
  
  getTokenById(id: string): Promise<Token | undefined>;
  
  createToken(token: InsertToken): Promise<Token>;
  
  updateTokenPrice(id: string, price: number): Promise<void>;
  
  getAllTokenIds(): Promise<string[]>;
  
  seedTokens(tokens: InsertToken[]): Promise<void>;
}

export class DbStorage implements IStorage {
  async getTokens(params: {
    status: TabType;
    page: number;
    pageSize: number;
    search?: string;
    sort?: Array<{ column: SortColumn; direction: SortDirection }>;
  }): Promise<{ data: Token[]; total: number }> {
    const { status, page, pageSize, search, sort = [] } = params;
    const offset = (page - 1) * pageSize;

    let whereClause = eq(schema.tokens.status, status);
    
    if (search) {
      whereClause = and(
        whereClause,
        or(
          ilike(schema.tokens.name, `%${search}%`),
          ilike(schema.tokens.symbol, `%${search}%`)
        )
      ) as any;
    }

    const orderByClause = sort.length > 0
      ? sort.map(s => {
          const col = schema.tokens[s.column];
          return s.direction === 'asc' ? asc(col) : desc(col);
        })
      : [asc(schema.tokens.rank)];

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(schema.tokens)
        .where(whereClause)
        .orderBy(...orderByClause)
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(schema.tokens)
        .where(whereClause),
    ]);

    return {
      data: data.map(t => ({
        ...t,
        price: Number(t.price),
        change24h: Number(t.change24h),
        change7d: Number(t.change7d),
        volume24h: Number(t.volume24h),
        marketCap: Number(t.marketCap),
      })),
      total: Number(countResult[0]?.count || 0),
    };
  }

  async getTokenById(id: string): Promise<Token | undefined> {
    const result = await db
      .select()
      .from(schema.tokens)
      .where(eq(schema.tokens.id, id))
      .limit(1);

    if (result.length === 0) return undefined;

    const token = result[0];
    return {
      ...token,
      price: Number(token.price),
      change24h: Number(token.change24h),
      change7d: Number(token.change7d),
      volume24h: Number(token.volume24h),
      marketCap: Number(token.marketCap),
    };
  }

  async createToken(token: InsertToken): Promise<Token> {
    const result = await db.insert(schema.tokens).values(token).returning();
    const created = result[0];
    return {
      ...created,
      price: Number(created.price),
      change24h: Number(created.change24h),
      change7d: Number(created.change7d),
      volume24h: Number(created.volume24h),
      marketCap: Number(created.marketCap),
    };
  }

  async updateTokenPrice(id: string, price: number): Promise<void> {
    await db
      .update(schema.tokens)
      .set({ price: price.toString(), updatedAt: new Date() })
      .where(eq(schema.tokens.id, id));
  }

  async getAllTokenIds(): Promise<string[]> {
    const result = await db.select({ id: schema.tokens.id }).from(schema.tokens);
    return result.map(r => r.id);
  }

  async seedTokens(tokens: InsertToken[]): Promise<void> {
    if (tokens.length === 0) return;
    
    await db.delete(schema.tokens);
    
    for (const token of tokens) {
      await db.insert(schema.tokens).values(token).onConflictDoNothing();
    }
  }
}

export const storage = new DbStorage();
