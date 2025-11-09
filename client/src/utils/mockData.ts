//todo: remove mock functionality
import type { Token, TokenDetail } from '@shared/schema';

const cryptoNames = [
  { name: 'Bitcoin', symbol: 'BTC' },
  { name: 'Ethereum', symbol: 'ETH' },
  { name: 'Solana', symbol: 'SOL' },
  { name: 'Cardano', symbol: 'ADA' },
  { name: 'Polkadot', symbol: 'DOT' },
  { name: 'Avalanche', symbol: 'AVAX' },
  { name: 'Chainlink', symbol: 'LINK' },
  { name: 'Polygon', symbol: 'MATIC' },
  { name: 'Uniswap', symbol: 'UNI' },
  { name: 'Cosmos', symbol: 'ATOM' },
  { name: 'Litecoin', symbol: 'LTC' },
  { name: 'Algorand', symbol: 'ALGO' },
  { name: 'VeChain', symbol: 'VET' },
  { name: 'Filecoin', symbol: 'FIL' },
  { name: 'Tron', symbol: 'TRX' },
  { name: 'Stellar', symbol: 'XLM' },
  { name: 'Monero', symbol: 'XMR' },
  { name: 'EOS', symbol: 'EOS' },
  { name: 'Tezos', symbol: 'XTZ' },
  { name: 'Aave', symbol: 'AAVE' },
];

const tags = [
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

export function generateMockTokens(count: number, status: 'new' | 'final' | 'migrated'): Token[] {
  return Array.from({ length: count }, (_, i) => {
    const crypto = cryptoNames[i % cryptoNames.length];
    const basePrice = Math.random() * 50000 + 100;
    
    return {
      id: `${crypto.symbol.toLowerCase()}-${status}-${i}`,
      rank: i + 1,
      name: crypto.name,
      symbol: crypto.symbol,
      icon: `https://api.dicebear.com/7.x/shapes/svg?seed=${crypto.symbol}`,
      price: basePrice,
      change24h: (Math.random() - 0.5) * 0.2,
      change7d: (Math.random() - 0.5) * 0.4,
      volume24h: Math.random() * 10_000_000_000 + 1_000_000,
      marketCap: basePrice * (Math.random() * 1_000_000_000 + 10_000_000),
      tags: tags[i % tags.length],
      status,
    };
  });
}

export function generateMockTokenDetail(token: Token): TokenDetail {
  const now = Date.now();
  const priceHistory = Array.from({ length: 24 }, (_, i) => ({
    timestamp: now - (23 - i) * 3600000,
    price: token.price * (1 + (Math.random() - 0.5) * 0.1),
  }));

  return {
    ...token,
    description: `${token.name} is a decentralized cryptocurrency that aims to revolutionize the blockchain industry.`,
    website: `https://${token.symbol.toLowerCase()}.org`,
    twitter: `@${token.symbol.toLowerCase()}`,
    priceHistory,
  };
}
