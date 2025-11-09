import { storage } from './storage';
import type { InsertToken } from '@shared/schema';

const cryptoTokens = [
  { name: 'Bitcoin', symbol: 'BTC', basePrice: 67432.15 },
  { name: 'Ethereum', symbol: 'ETH', basePrice: 3542.87 },
  { name: 'Solana', symbol: 'SOL', basePrice: 142.56 },
  { name: 'Cardano', symbol: 'ADA', basePrice: 0.58 },
  { name: 'Polkadot', symbol: 'DOT', basePrice: 7.32 },
  { name: 'Avalanche', symbol: 'AVAX', basePrice: 38.45 },
  { name: 'Chainlink', symbol: 'LINK', basePrice: 14.89 },
  { name: 'Polygon', symbol: 'MATIC', basePrice: 0.87 },
  { name: 'Uniswap', symbol: 'UNI', basePrice: 6.54 },
  { name: 'Cosmos', symbol: 'ATOM', basePrice: 10.23 },
  { name: 'Litecoin', symbol: 'LTC', basePrice: 86.12 },
  { name: 'Algorand', symbol: 'ALGO', basePrice: 0.19 },
  { name: 'VeChain', symbol: 'VET', basePrice: 0.03 },
  { name: 'Filecoin', symbol: 'FIL', basePrice: 5.67 },
  { name: 'Tron', symbol: 'TRX', basePrice: 0.11 },
  { name: 'Stellar', symbol: 'XLM', basePrice: 0.12 },
  { name: 'Monero', symbol: 'XMR', basePrice: 165.43 },
  { name: 'EOS', symbol: 'EOS', basePrice: 0.78 },
  { name: 'Tezos', symbol: 'XTZ', basePrice: 1.12 },
  { name: 'Aave', symbol: 'AAVE', basePrice: 98.34 },
];

const tagGroups = [
  ['blue-chip', 'pow'],
  ['defi', 'smart-contract'],
  ['layer-1', 'fast'],
  ['staking', 'governance'],
  ['oracle', 'defi'],
  ['layer-2', 'scaling'],
  ['dex', 'governance'],
  ['nft', 'gaming'],
  ['meme', 'community'],
  ['privacy'],
];

function generateTokens(count: number, status: 'new' | 'final' | 'migrated'): InsertToken[] {
  const tokens: InsertToken[] = [];
  
  for (let i = 0; i < count; i++) {
    const crypto = cryptoTokens[i % cryptoTokens.length];
    const priceVariation = 1 + (Math.random() - 0.5) * 0.3;
    const price = crypto.basePrice * priceVariation;
    
    tokens.push({
      id: `${crypto.symbol.toLowerCase()}-${status}-${i}`,
      rank: i + 1,
      name: crypto.name,
      symbol: crypto.symbol,
      icon: `https://api.dicebear.com/7.x/shapes/svg?seed=${crypto.symbol}`,
      price: price.toString(),
      change24h: ((Math.random() - 0.5) * 0.2).toString(),
      change7d: ((Math.random() - 0.5) * 0.4).toString(),
      volume24h: (Math.random() * 10_000_000_000 + 1_000_000).toString(),
      marketCap: (price * (Math.random() * 1_000_000_000 + 10_000_000)).toString(),
      tags: tagGroups[i % tagGroups.length],
      status,
      description: `${crypto.name} is a decentralized cryptocurrency that aims to revolutionize the blockchain industry.`,
      website: `https://${crypto.symbol.toLowerCase()}.org`,
      twitter: `@${crypto.symbol.toLowerCase()}`,
    });
  }
  
  return tokens;
}

export async function seedDatabase() {
  console.log('Seeding database...');
  
  const allTokens = [
    ...generateTokens(50, 'new'),
    ...generateTokens(50, 'final'),
    ...generateTokens(50, 'migrated'),
  ];
  
  await storage.seedTokens(allTokens);
  
  console.log(`Seeded ${allTokens.length} tokens`);
}

seedDatabase()
  .then(() => {
    console.log('Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
