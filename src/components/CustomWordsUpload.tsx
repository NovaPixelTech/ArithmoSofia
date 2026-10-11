import { useRef, useState } from 'react';
import type { GreekWord } from '../data/greekWords';
import { Amphora } from './GreekArt';

interface CustomWordsUploadProps {
  onWordsAdded: (words: GreekWord[]) => void;
}

const normalizeGreekText = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0370-\u0373\u0375-\u037d\u037f-\u0383\u0385\u0387\u038b\u038d\u03a2]/g, '');

const LETTER_VALUES: Record<string, number> = {
  'α': 1, 'β': 2, 'γ': 3, 'δ': 4, 'ε': 5, 'ϛ': 6, 'ζ': 7, 'η': 8, 'θ': 9,
  'ι': 10, 'κ': 20, 'λ': 30, 'μ': 40, 'ν': 50, 'ξ': 60, 'ο': 70, 'π': 80, 'ϟ': 90,
  'ρ': 100, 'σ': 200, 'ς': 200, 'τ': 300, 'υ': 400, 'φ': 500, 'χ': 600, 'ψ': 700, 'ω': 800,
};

const calculateValue = (normalized: string): number => {
  let total = 0;
  for (const char of normalized) {
    if (LETTER_VALUES[char]) total += LETTER_VALUES[char];
  }
  return total > 0 ? total : 0;
};

/** Parses RFC-4180-style CSV (handles quoted fields, escaped quotes and commas). */
const parseCsvRows = (text: string): string[][] => {
  const src = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const char = src[i];
    if (inQuotes) {
      if (char === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
};

const parseCsvWords = (text: string): GreekWord[] | null => {
  const rows = parseCsvRows(text).filter(r => r.some(cell => cell.trim() !== ''));
  if (rows.length === 0) return null;

  const header = rows[0].map(cell => cell.trim().toLowerCase());
  const wordIdx = header.indexOf('word');
  if (wordIdx === -1) return null;

  const valueIdx = header.indexOf('value');
  const meaningIdx = header.indexOf('meaning');
  const translitIdx = header.indexOf('transliteration');

  const words: GreekWord[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rawWord = (row[wordIdx] ?? '').trim();
    if (!rawWord) continue;

    const normalized = normalizeGreekText(rawWord);
    const providedValue = valueIdx !== -1 ? parseInt((row[valueIdx] ?? '').replace(/[^\d]/g, ''), 10) : NaN;
    const value = providedValue > 0 ? providedValue : calculateValue(normalized);
    if (value <= 0) continue;

    words.push({
      word: rawWord,
      normalized,
      value,
      transliteration: (translitIdx !== -1 ? row[translitIdx]?.trim() : '') || rawWord,
      meaning: (meaningIdx !== -1 ? row[meaningIdx]?.trim() : '') || 'Imported',
      category: 'user',
      interpretationType: 'mathematical',
    });
  }
  return words;
};

const parsePlainList = (text: string): GreekWord[] => {
  const words: GreekWord[] = [];
  const lines = text.split(/\n|,/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const normalized = normalizeGreekText(trimmed);
    const value = calculateValue(normalized);
    if (value > 0) {
      words.push({
        word: trimmed,
        normalized,
        value,
        transliteration: trimmed,
        meaning: 'User-added',
        category: 'user',
        interpretationType: 'mathematical',
      });
    }
  }
  return words;
};

export default function CustomWordsUpload({ onWordsAdded }: CustomWordsUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [addedCount, setAddedCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    // Reset first so re-picking the same file fires change again.
    e.target.value = '';
    if (!selected) return;
    setFileName(selected.name);
    processFile(selected);
  };

  const parseGreekWords = (text: string): GreekWord[] => parseCsvWords(text) ?? parsePlainList(text);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const words = parseGreekWords(text);
      onWordsAdded(words);
      setAddedCount(words.length);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.csv"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-sm font-medium"
      >
        <Amphora className="w-4 h-4 text-amber-700 dark:text-amber-500" />
        Upload Greek Word List
      </button>
      <p className="text-xs text-stone-500 dark:text-stone-400 text-center sm:text-left">
        {fileName
          ? `Selected: ${fileName}${addedCount > 0 ? ` — ${addedCount} words processed` : ''}`
          : 'Upload a shared CSV file, or a plain text list with one Greek word per line.'}
      </p>
    </div>
  );
}
