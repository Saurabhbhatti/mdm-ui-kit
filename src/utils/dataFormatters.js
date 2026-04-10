export function getColumnKey(column = {}) {
  return column?.apiKey || column?.key || column?.accessor || column?.name || '';
}

export function resolveRowValue(row = {}, column = {}) {
  if (!row || !column) {
    return '';
  }

  if (typeof column.valueGetter === 'function') {
    return column.valueGetter(row);
  }

  const columnKey = getColumnKey(column);
  if (!columnKey) {
    return '';
  }

  return row?.[columnKey] ?? row?.[column?.key] ?? row?.[column?.apiKey] ?? row?.[column?.accessor] ?? '';
}

export function formatCellValue(value) {
  if (value === '' || value === null || value === undefined) {
    return '-';
  }

  return value;
}
