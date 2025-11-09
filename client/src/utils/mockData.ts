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

const toStr = (n: number) => String(n);

export function generateMockTokens(count: number, status: 'new' | 'final' | 'migrated'): Token[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const crypto = cryptoNames[i % cryptoNames.length];
    const basePriceNum = Math.random() * 50000 + 100;
    const change24hNum = (Math.random() - 0.5) * 0.2;
    const change7dNum = (Math.random() - 0.5) * 0.4;
    const volumeNum = Math.random() * 10_000_000_000 + 1_000_000;
    const mcapNum = basePriceNum * (Math.random() * 1_000_000_000 + 10_000_000);

    const id = `${crypto.symbol.toLowerCase()}-${status}-${i}`;

    return {
      id,
      rank: i + 1,
      name: crypto.name,
      symbol: crypto.symbol,
      icon: `https://api.dicebear.com/7.x/shapes/svg?seed=${crypto.symbol}`,
      price: toStr(Number(basePriceNum.toFixed(6))),               
      change24h: toStr(Number(change24hNum.toFixed(6))),           
      change7d: toStr(Number(change7dNum.toFixed(6))),             
      volume24h: toStr(Math.round(volumeNum)),                     
      marketCap: toStr(Math.round(mcapNum)),                       
      tags: tags[i % tags.length],
      status, 
      description: `${crypto.name} is a decentralized cryptocurrency that aims to revolutionize the blockchain industry.`,
      website: `https://${crypto.symbol.toLowerCase()}.org`,
      twitter: `@${crypto.symbol.toLowerCase()}`,
      updatedAt: now,
    };
  });
}

export function generateMockTokenDetail(token: Token): TokenDetail {
  const now = Date.now();


  const priceNum     = Number(token.price ?? 0);
  const change24hNum = Number(token.change24h ?? 0);
  const change7dNum  = Number(token.change7d ?? 0);
  const volumeNum    = Number(token.volume24h ?? 0);
  const mcapNum      = Number(token.marketCap ?? 0);

  const priceHistory = Array.from({ length: 24 }, (_, i) => ({
    timestamp: now - (23 - i) * 3600000,
    price: Number((priceNum * (1 + (Math.random() - 0.5) * 0.1)).toFixed(6)),
  }));

  return {
    symbol: token.symbol,
    id: token.id,
    rank: token.rank,
    name: token.name,
    icon: token.icon,
    price: priceNum,             
    change24h: change24hNum,     
    change7d: change7dNum,       
    volume24h: volumeNum,        
    marketCap: mcapNum,          
    tags: token.tags ?? [],
    status: token.status,
    priceHistory,                
    description: token.description ?? undefined,
    website: token.website ?? undefined,
    twitter: token.twitter ?? undefined,
  };
}
