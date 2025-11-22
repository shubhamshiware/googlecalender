import React, { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSearchText, clearFilters } from '../store/slices/searchSlice';

interface SearchBarProps {
  onSearch: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.search.filters);
  const [localText, setLocalText] = useState(filters.text);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalText(filters.text);
  }, [filters.text]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalText(value);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        dispatch(setSearchText(value));
        onSearch(value);
      }, 300);

      setDebounceTimer(timer);
    },
    [dispatch, onSearch, debounceTimer]
  );

  const handleClear = () => {
    setLocalText('');
    dispatch(clearFilters());
    onSearch('');
  };

  return (
    <div className="flex gap-2 items-center flex-1 max-w-md">
      <input
        type="text"
        value={localText}
        onChange={handleInputChange}
        placeholder="Search events..."
        className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {localText && (
        <button
          onClick={handleClear}
          className="px-3 py-2 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 rounded-lg text-gray-800 dark:text-white transition"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};
