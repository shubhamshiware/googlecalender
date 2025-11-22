import React from 'react';
import { SearchBar } from './SearchBar';
import { FilterDropdown } from './FilterDropdown';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetSearch } from '../store/slices/searchSlice';

interface SearchHeaderProps {
  onSearch: (text: string) => void;
  onFiltersChange: () => void;
  resultCount: number;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  onFiltersChange,
  resultCount,
}) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.search.filters);

  const handleSearchClose = () => {
    dispatch(resetSearch());
    onSearch('');
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
      <SearchBar onSearch={onSearch} />
      <FilterDropdown onFiltersChange={onFiltersChange} />

      {filters.isActive && (
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {resultCount} result{resultCount !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleSearchClose}
            className="px-3 py-2 text-sm bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-700 text-gray-800 dark:text-white rounded transition"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
