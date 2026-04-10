import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../../config/constants.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import { EmptyStateIcon, SearchIcon, SpinnerIcon } from '../icons/index.js';
import { getColumnKey, formatCellValue, resolveRowValue } from '../../utils/dataFormatters.js';

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="mdm-emptyStateCard">
      <EmptyStateIcon className="mdm-emptyStateCard__icon" />
      <h3>{title || 'No data available'}</h3>
      <p>{description || 'Create your first entry to get started.'}</p>
      <button className="mdm-button mdm-button--primary" type="button" onClick={onAction} disabled={!onAction}>
        {actionLabel || 'Add New'}
      </button>
    </div>
  );
}

function DataTable({
  columns = [],
  data = [],
  pageSize = DEFAULT_PAGE_SIZE,
  searchPlaceholder = 'Search',
  searchDebounceMs = 300,
  searchable = true,
  sortable = true,
  filters = [],
  className = '',
  loading = false,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateActionLabel,
  onEmptyStateAction
}) {
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortState, setSortState] = useState({ key: null, direction: 'asc' });
  const [filterState, setFilterState] = useState(
    filters.reduce((accumulator, filter) => {
      accumulator[filter.key] = filter.defaultValue ?? '';
      return accumulator;
    }, {})
  );

  useEffect(() => {
    setCurrentPageSize(pageSize);
  }, [pageSize]);

  const searchTerm = useDebouncedValue(searchInput, searchDebounceMs);

  const visibleColumns = useMemo(() => columns.filter((column) => column.hidden !== true), [columns]);
  const searchableColumns = useMemo(() => visibleColumns.filter((column) => column.searchable !== false), [visibleColumns]);
  const sortColumn = useMemo(
    () => visibleColumns.find((column) => getColumnKey(column) === sortState.key),
    [sortState.key, visibleColumns]
  );

  const filteredRows = useMemo(() => {
    let rows = [...data];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch && searchable) {
      rows = rows.filter((row) =>
        searchableColumns.some((column) => String(resolveRowValue(row, column) ?? '').toLowerCase().includes(normalizedSearch))
      );
    }

    Object.entries(filterState).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        return;
      }

      const targetColumn = visibleColumns.find((column) => getColumnKey(column) === key);
      rows = rows.filter((row) => String(resolveRowValue(row, targetColumn) ?? '') === String(value));
    });

    if (sortable && sortColumn) {
      rows.sort((left, right) => {
        const leftValue = resolveRowValue(left, sortColumn);
        const rightValue = resolveRowValue(right, sortColumn);

        if (leftValue === rightValue) {
          return 0;
        }

        const comparator = String(leftValue ?? '').localeCompare(String(rightValue ?? ''), undefined, {
          numeric: true,
          sensitivity: 'base'
        });

        return sortState.direction === 'asc' ? comparator : -comparator;
      });
    }

    return rows;
  }, [data, filterState, searchable, searchableColumns, searchTerm, sortColumn, sortState.direction, sortable, visibleColumns]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / currentPageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * currentPageSize;
  const pageRows = filteredRows.slice(startIndex, startIndex + currentPageSize);
  const hasRows = pageRows.length > 0;

  const toggleSort = useCallback((column) => {
    if (column.sortable === false || sortable === false) {
      return;
    }

    const key = getColumnKey(column);
    if (!key) {
      return;
    }

    setSortState((currentSort) => ({
      key,
      direction: currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, [sortable]);

  const handleSearchChange = useCallback((event) => setSearchInput(event.target.value), []);
  const handlePageSizeChange = useCallback((event) => setCurrentPageSize(Number(event.target.value)), []);
  const handleFilterChange = useCallback((key, value) => {
    setFilterState((currentFilterState) => ({
      ...currentFilterState,
      [key]: value
    }));
  }, []);
  const handleNextPage = useCallback(() => setCurrentPage((page) => Math.min(totalPages, page + 1)), [totalPages]);

  return (
    <div className={`mdm-tableCard ${className}`.trim()}>
      <div className="mdm-tableToolbar">
        <div className="mdm-tableToolbar__main">
          {searchable ? (
            <div className="mdm-searchField">
              <SearchIcon className="mdm-icon mdm-searchField__icon" />
              <input
                className="mdm-input mdm-input--search"
                type="search"
                value={searchInput}
                placeholder={searchPlaceholder}
                onChange={handleSearchChange}
              />
            </div>
          ) : null}

          <select
            className="mdm-input mdm-input--select mdm-input--pageSize"
            value={currentPageSize}
            onChange={handlePageSizeChange}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>

        <div className="mdm-tableToolbar__filters">
          {filters.map((filter) => (
            <select
              key={filter.key}
              className="mdm-input mdm-input--select mdm-input--pageSize"
              value={filterState[filter.key] ?? ''}
              onChange={(event) => handleFilterChange(filter.key, event.target.value)}
            >
              <option value="">{filter.label || 'Filter'}</option>
              {(filter.options || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <div className="mdm-tableScroll">
        <table className="mdm-table">
          <thead>
            <tr>
              {visibleColumns.map((column) => {
                const key = getColumnKey(column);
                const activeSort = sortState.key === key;

                return (
                  <th
                    key={key}
                    className={column.sortable !== false && sortable ? 'mdm-table__sortable' : ''}
                    onClick={() => toggleSort(column)}
                    role={column.sortable !== false && sortable ? 'button' : undefined}
                    scope="col"
                  >
                    <span className="mdm-table__thContent">
                      {column.label}
                      {activeSort ? <span className="mdm-table__sortMark">{sortState.direction === 'asc' ? '↑' : '↓'}</span> : null}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: currentPageSize }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="mdm-skeletonRow">
                  {visibleColumns.map((column) => (
                    <td key={`skeleton-${index}-${getColumnKey(column)}`}>
                      <span className="mdm-skeletonBlock" />
                    </td>
                  ))}
                </tr>
              ))
            ) : hasRows ? (
              pageRows.map((row, index) => (
                <tr key={row?.id ?? `${index}-${getColumnKey(visibleColumns[0] || {})}`}>
                  {visibleColumns.map((column) => (
                    <td key={`${row?.id ?? index}-${getColumnKey(column)}`}>
                      {typeof column.render === 'function'
                        ? column.render(row, { row, columns: visibleColumns })
                        : formatCellValue(resolveRowValue(row, column))}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="mdm-emptyStateCell" colSpan={Math.max(1, visibleColumns.length)}>
                  <EmptyState
                    title={emptyStateTitle || 'No data available'}
                    description={emptyStateDescription}
                    actionLabel={emptyStateActionLabel}
                    onAction={onEmptyStateAction}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mdm-pagination">
        <span className="mdm-pagination__summary">
          Showing {filteredRows.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + currentPageSize, filteredRows.length)} of {filteredRows.length}
        </span>

        <div className="mdm-pagination__actions">
          <button className="mdm-button mdm-button--secondary" type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safePage === 1}>
            Previous
          </button>
          <span className="mdm-pagination__page">Page {safePage} of {totalPages}</span>
          <button className="mdm-button mdm-button--secondary" type="button" onClick={handleNextPage} disabled={safePage === totalPages}>
            Next
          </button>
        </div>

        {loading ? (
          <div className="mdm-loadingInline">
            <SpinnerIcon className="mdm-spinner--inline" />
            Loading records...
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default memo(DataTable);
