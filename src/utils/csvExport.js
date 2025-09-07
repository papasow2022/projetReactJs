export function exportToCsv(filename, rows, options = {}) {
  if (!rows || rows.length === 0) {
    console.warn('exportToCsv: no data');
    return;
  }

  const delimiter = options.delimiter || ';'; // Excel FR prefers semicolon
  const includeBom = options.bom !== false; // default true

  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row || {}).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );

  const escapeCell = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value).replace(/"/g, '""');
    const needsQuotes = new RegExp(`(["${delimiter}\n])`, 'g');
    if (str.search(needsQuotes) >= 0) {
      return `"${str}"`;
    }
    return str;
  };

  const csvCore = [headers.join(delimiter)]
    .concat(
      rows.map((row) => headers.map((h) => escapeCell(row[h])).join(delimiter))
    )
    .join('\n');

  const csv = includeBom ? `\uFEFF${csvCore}` : csvCore; // UTF-8 BOM for Excel
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
