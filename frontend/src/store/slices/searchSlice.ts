import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SearchFilters {
  text: string;
  startDate: string | null;
  endDate: string | null;
  color: string | null;
  category: 'Work' | 'Personal' | 'Other' | null;
  upcoming: boolean | null;
  isActive: boolean;
}

interface SearchState {
  filters: SearchFilters;
  searchResults: any[];
  isLoading: boolean;
}

const initialState: SearchState = {
  filters: {
    text: '',
    startDate: null,
    endDate: null,
    color: null,
    category: null,
    upcoming: null,
    isActive: false,
  },
  searchResults: [],
  isLoading: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.filters.text = action.payload;
      state.filters.isActive = true;
    },
    setStartDate: (state, action: PayloadAction<string | null>) => {
      state.filters.startDate = action.payload;
      state.filters.isActive = true;
    },
    setEndDate: (state, action: PayloadAction<string | null>) => {
      state.filters.endDate = action.payload;
      state.filters.isActive = true;
    },
    setColor: (state, action: PayloadAction<string | null>) => {
      state.filters.color = action.payload;
      state.filters.isActive = true;
    },
    setCategory: (state, action: PayloadAction<'Work' | 'Personal' | 'Other' | null>) => {
      state.filters.category = action.payload;
      state.filters.isActive = true;
    },
    setUpcoming: (state, action: PayloadAction<boolean | null>) => {
      state.filters.upcoming = action.payload;
      state.filters.isActive = true;
    },
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.searchResults = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        text: '',
        startDate: null,
        endDate: null,
        color: null,
        category: null,
        upcoming: null,
        isActive: false,
      };
      state.searchResults = [];
    },
    resetSearch: (state) => {
      state.filters.isActive = false;
      state.searchResults = [];
    },
    setIsActive: (state, action: PayloadAction<boolean>) => {
      state.filters.isActive = action.payload;
    },
  },
});

export const {
  setSearchText,
  setStartDate,
  setEndDate,
  setColor,
  setCategory,
  setUpcoming,
  setSearchResults,
  setIsLoading,
  clearFilters,
  resetSearch,
  setIsActive,
} = searchSlice.actions;

export default searchSlice.reducer;
