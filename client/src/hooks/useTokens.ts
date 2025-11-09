import { useQuery } from '@tanstack/react-query';
import type { TokensResponse, TabType, SortConfig } from '@shared/schema';

interface UseTokensParams {
  tab: TabType;
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: SortConfig[];
}

export function useTokens({ tab, page = 1, pageSize = 50, search, sort = [] }: UseTokensParams) {
  return useQuery<TokensResponse>({
    queryKey: ['/api/tokens', tab, page, pageSize, search, sort],
    queryFn: async () => {
      const params = new URLSearchParams({
        tab,
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      if (sort.length > 0) {
        const sortParam = sort.map(s => `${s.column}:${s.direction}`).join(',');
        params.append('sort', sortParam);
      }

      const response = await fetch(`/api/tokens?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }
      return response.json();
    },
    staleTime: 1000 * 30,
  });
}
