import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import type { SortColumn, SortDirection } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/tokens - List tokens with filtering, sorting, pagination
  app.get("/api/tokens", async (req, res) => {
    try {
      const status = (req.query.tab as string) || 'new';
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 50;
      const search = req.query.search as string;
      const sortParam = req.query.sort as string;

      let sort: Array<{ column: SortColumn; direction: SortDirection }> = [];
      
      if (sortParam) {
        const sortPairs = sortParam.split(',');
        sort = sortPairs.map(pair => {
          const [column, direction] = pair.split(':');
          return {
            column: column as SortColumn,
            direction: (direction || 'asc') as SortDirection,
          };
        });
      }

      const result = await storage.getTokens({
        status: status as any,
        page,
        pageSize,
        search,
        sort,
      });

      res.json({
        data: result.data,
        page,
        pageSize,
        total: result.total,
      });
    } catch (error) {
      console.error('Error fetching tokens:', error);
      res.status(500).json({ error: 'Failed to fetch tokens' });
    }
  });

  // GET /api/tokens/:id - Get token details
  app.get("/api/tokens/:id", async (req, res) => {
    try {
      const token = await storage.getTokenById(req.params.id);
      
      if (!token) {
        return res.status(404).json({ error: 'Token not found' });
      }

      const now = Date.now();
      const priceHistory = Array.from({ length: 24 }, (_, i) => ({
        timestamp: now - (23 - i) * 3600000,
        price: Number(token.price) * (1 + (Math.random() - 0.5) * 0.1),
      }));

      res.json({
        ...token,
        priceHistory,
      });
    } catch (error) {
      console.error('Error fetching token:', error);
      res.status(500).json({ error: 'Failed to fetch token' });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time price updates
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws',
  });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast price updates every 2 seconds
  setInterval(async () => {
    if (wss.clients.size === 0) return;

    try {
      const tokenIds = await storage.getAllTokenIds();
      if (tokenIds.length === 0) return;

      const randomId = tokenIds[Math.floor(Math.random() * tokenIds.length)];
      const token = await storage.getTokenById(randomId);
      
      if (token) {
        const priceChange = (Math.random() - 0.5) * 0.02;
        const newPrice = Number(token.price) * (1 + priceChange);
        
        await storage.updateTokenPrice(randomId, newPrice);

        const update = {
          id: randomId,
          price: newPrice,
          timestamp: Date.now(),
        };

        wss.clients.forEach((client) => {
          if (client.readyState === 1) { // OPEN
            client.send(JSON.stringify(update));
          }
        });
      }
    } catch (error) {
      console.error('Error broadcasting price update:', error);
    }
  }, 2000);

  return httpServer;
}
