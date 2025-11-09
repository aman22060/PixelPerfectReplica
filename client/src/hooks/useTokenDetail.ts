import { useQuery } from '@tanstack/react-query';
import type { TokenDetail } from '@shared/schema';

export function useTokenDetail(tokenId: string | null) {
  return useQuery<TokenDetail>({
    queryKey: ['/api/tokens', tokenId],
    queryFn: async () => {
      if (!tokenId) throw new Error('No token ID');
      
      const response = await fetch(`/api/tokens/${tokenId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch token details');
      }
      return response.json();
    },
    enabled: !!tokenId,
    staleTime: 1000 * 60,
  });
}
