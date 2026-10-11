import type { GreekWord } from '../data/greekWords';

export interface SharedWord {
  word: string;
  value: number;
  meaning?: string;
  transliteration?: string;
  category?: string;
}

export function toSharedWords(words: Array<Partial<GreekWord> & { word: string; value: number }>): SharedWord[] {
  return words
    .filter(w => w && typeof w.word === 'string' && w.word.trim().length > 0 && w.value > 0)
    .map(w => ({
      word: w.word,
      value: w.value,
      meaning: w.meaning,
      transliteration: w.transliteration,
      category: w.category,
    }));
}

const escapeCsvCell = (value: string | number | undefined): string =>
  `"${String(value ?? '').replace(/"/g, '""')}"`;

export function buildWordsCsv(words: SharedWord[]): string {
  const header = ['Word', 'Value', 'Meaning', 'Transliteration', 'Category'];
  const rows = words.map(w => [w.word, w.value, w.meaning ?? '', w.transliteration ?? '', w.category ?? '']);
  const csv = [header, ...rows].map(row => row.map(escapeCsvCell).join(',')).join('\r\n');
  return '\uFEFF' + csv;
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export type CsvShareOutcome = 'shared' | 'downloaded' | 'failed';

export async function shareWordsCsv(
  filename: string,
  words: SharedWord[],
  title: string,
  text: string
): Promise<CsvShareOutcome> {
  const csv = buildWordsCsv(words);
  const nav = navigator as Navigator & {
    share?: (data: ShareData) => Promise<void>;
    canShare?: (data: ShareData) => boolean;
  };
  try {
    const file = new File([csv], filename, { type: 'text/csv;charset=utf-8' });
    if (typeof nav.share === 'function' && typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
      await nav.share({ files: [file], title, text });
      return 'shared';
    }
  } catch (error) {
    if ((error as DOMException)?.name === 'AbortError') return 'failed';
  }
  try {
    downloadCsv(filename, csv);
    return 'downloaded';
  } catch {
    return 'failed';
  }
}
