import { useQuery, useQueryClient } from '@tanstack/react-query';

interface CacheConfig {
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
}

// Default cache configurations for different data types
export const CACHE_CONFIGS = {
  // Frequent updates - 1 minute stale time
  metrics: {
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  },
  // Moderate updates - 5 minutes stale time
  campaigns: {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  },
  // Rare updates - 15 minutes stale time
  organizations: {
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  },
  // Very rare updates - 30 minutes stale time
  settings: {
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  },
} as const;

export function useCache() {
  const queryClient = useQueryClient();

  const invalidateCache = (keys: string[]) => {
    keys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };

  const prefetchData = async (key: string, fetcher: () => Promise<any>) => {
    await queryClient.prefetchQuery({
      queryKey: [key],
      queryFn: fetcher,
    });
  };

  return { invalidateCache, prefetchData };
}
