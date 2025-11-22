import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setStartDate,
  setEndDate,
  setColor,
  setCategory,
  setUpcoming,
  clearFilters,
} from '../store/slices/searchSlice';
import { COLORS } from '../utils/constants';

interface FilterDropdownProps {
  onFiltersChange: () => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFiltersChange }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.search.filters);
  const [isOpen, setIsOpen] = useState(false);

  const handleStartDateChange = (date: string) => {
    dispatch(setStartDate(date || null));
    onFiltersChange();
  };

  const handleEndDateChange = (date: string) => {
    dispatch(setEndDate(date || null));
    onFiltersChange();
  };

  const handleColorChange = (color: string) => {
    dispatch(setColor(color === filters.color ? null : color));
    onFiltersChange();
  };

  const handleCategoryChange = (category: 'Work' | 'Personal' | 'Other') => {
    dispatch(setCategory(category === filters.category ? null : category));
    onFiltersChange();
  };

  const handleUpcomingChange = (value: boolean | null) => {
    dispatch(setUpcoming(value === filters.upcoming ? null : value));
    onFiltersChange();
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    onFiltersChange();
  };

  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    filters.color ||
    filters.category ||
    filters.upcoming !== null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          hasActiveFilters
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white'
        }`}
      >
        ⚙️ Filters {hasActiveFilters && '●'}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-50 p-4 border border-gray-200 dark:border-slate-700">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Date Range</h3>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
                />
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Color</h3>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => handleColorChange(c.value)}
                    className={`w-7 h-7 rounded border-2 transition ${
                      filters.color === c.value
                        ? 'border-gray-800 dark:border-white scale-110'
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Category</h3>
              <div className="space-y-1">
                {(['Work', 'Personal', 'Other'] as const).map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category === cat}
                      onChange={() => handleCategoryChange(cat)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Time</h3>
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="time-filter"
                    checked={filters.upcoming === true}
                    onChange={() => handleUpcomingChange(true)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Upcoming Events</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="time-filter"
                    checked={filters.upcoming === false}
                    onChange={() => handleUpcomingChange(false)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Past Events</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="time-filter"
                    checked={filters.upcoming === null}
                    onChange={() => handleUpcomingChange(null)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 dark:text-gray-300">All Events</span>
                </label>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="w-full px-3 py-2 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-700 text-gray-800 dark:text-white rounded font-medium transition"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
