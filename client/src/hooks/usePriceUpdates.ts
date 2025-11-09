//todo: remove mock functionality
import { useEffect, useState } from 'react';
import type { Token } from '@shared/schema';

export function usePriceUpdates(tokens: Token[]) {
  const [updatedTokens, setUpdatedTokens] = useState<Token[]>(tokens);
  const [priceFlashes, setPriceFlashes] = useState<Map<string, 'gain' | 'loss'>>(new Map());

  useEffect(() => {
    setUpdatedTokens(tokens);
  }, [tokens]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdatedTokens(prev => {
        const newTokens = [...prev];
        const updates = new Map<string, 'gain' | 'loss'>();
        
        const randomIndex = Math.floor(Math.random() * newTokens.length);
        const token = newTokens[randomIndex];
        
        if (token) {
          const priceChange = (Math.random() - 0.5) * 0.02;
          const newPrice = token.price * (1 + priceChange);
          
          newTokens[randomIndex] = {
            ...token,
            price: newPrice,
          };
          
          updates.set(token.id, priceChange > 0 ? 'gain' : 'loss');
        }
        
        setPriceFlashes(updates);
        setTimeout(() => setPriceFlashes(new Map()), 600);
        
        return newTokens;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { tokens: updatedTokens, priceFlashes };
}
