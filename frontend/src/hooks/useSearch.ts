import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSearchResults, setIsLoading } from '../store/slices/searchSlice';
import { searchService } from '../services/searchService';
import { useAuth } from '../context/AuthContext';

export const useSearch = (events: any[]) => {
  const dispatch = useAppDispatch();
  const { token } = useAuth();
  const filters = useAppSelector((state) => state.search.filters);
  const searchResults = useAppSelector((state) => state.search.searchResults);

  const performSearch = useCallback(async () => {
    if (!token) return;

    dispatch(setIsLoading(true));
    try {
      const params = {
        text: filters.text || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        color: filters.color || undefined,
        category: filters.category || undefined,
        upcoming: filters.upcoming || undefined,
      };

      const results = await searchService.searchEvents(token, params);

      dispatch(setSearchResults(results.map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      }))));
    } catch (error) {
      console.error('Search failed:', error);
      dispatch(setSearchResults([]));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [token, filters, dispatch]);

  useEffect(() => {
    if (filters.isActive) {
      performSearch();
    } else {
      dispatch(setSearchResults([]));
    }
  }, [filters, performSearch, dispatch]);

  return {
    searchResults: filters.isActive ? searchResults : events,
    isSearchActive: filters.isActive,
  };
};
