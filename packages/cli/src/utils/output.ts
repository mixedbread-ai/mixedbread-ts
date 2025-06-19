import Table from 'cli-table3';
import chalk from 'chalk';

export type OutputFormat = 'table' | 'json' | 'csv';

export function formatOutput(data: unknown, format: OutputFormat = 'table'): void {
  switch (format) {
    case 'json':
      console.log(JSON.stringify(data, null, 2));
      break;
    case 'csv':
      formatCsv(data);
      break;
    case 'table':
    default:
      formatTable(data);
      break;
  }
}

function formatTable(data: unknown): void {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      console.log(chalk.gray('No results found.'));
      return;
    }

    const headers = Object.keys(data[0]);
    const table = new Table({
      head: headers.map((h) => chalk.bold(h)),
      style: { head: [], border: [] },
    });

    data.forEach((item) => {
      table.push(headers.map((h) => formatValue(item[h])));
    });

    console.log(table.toString());
  } else if (typeof data === 'object' && data !== null) {
    const table = new Table({
      style: { head: [], border: [] },
    });

    Object.entries(data).forEach(([key, value]) => {
      table.push({ [chalk.bold(key)]: formatValue(value) });
    });

    console.log(table.toString());
  } else {
    console.log(data);
  }
}

function formatCsv(data: unknown): void {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return;
    }

    const headers = Object.keys(data[0]);
    console.log(headers.join(','));

    data.forEach((item) => {
      console.log(headers.map((h) => escapeCsv(formatValue(item[h]))).join(','));
    });
  } else if (typeof data === 'object' && data !== null) {
    console.log('key,value');
    Object.entries(data).forEach(([key, value]) => {
      console.log(`${escapeCsv(key)},${escapeCsv(formatValue(value))}`);
    });
  }
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function formatBytes(bytes: number | undefined): string {
  if (bytes === 0 || bytes === undefined || bytes === null || isNaN(bytes)) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}

export function formatCountWithSuffix(count: number, suffix: string): string {
  if (count === 1) return `1 ${suffix}`;
  return `${count} ${suffix}s`;
}
