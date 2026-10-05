import { useRef, useState } from 'react';
import type { GreekWord } from '../data/greekWords';
import { Amphora } from './GreekArt';

interface CustomWordsUploadProps {
  onWordsAdded: (words: GreekWord[]) => void;
}

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

  const parseGreekWords = (text: string): GreekWord[] => {
    const words: GreekWord[] = [];
    const lines = text.split(/\n|,/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const normalized = normalizedGreek(trimmed);
      const val = calculateValue(normalized);
      if (val > 0) {
        words.push({
          word: trimmed,
          normalized,
          value: val,
          transliteration: trimmed,
          meaning: 'User-added',
          category: 'user',
          interpretationType: 'mathematical'
        });
      }
    }
    return words;
  };

  const normalizedGreek = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u0370-\u0373\u0375-\u037d\u037f-\u0383\u0385\u0387\u038b\u038d\u03a2]/g, '');
  };

  const calculateValue = (normalized: string): number => {
    const LETTER_VALUES: Record<string, number> = {
      'α': 1, 'β': 2, 'γ': 3, 'δ': 4, 'ε': 5, 'ϛ': 6, 'ζ': 7, 'η': 8, 'θ': 9,
      'ι': 10, 'κ': 20, 'λ': 30, 'μ': 40, 'ν': 50, 'ξ': 60, 'ο': 70, 'π': 80, 'ϟ': 90,
      'ρ': 100, 'σ': 200, 'ς': 200, 'τ': 300, 'υ': 400, 'φ': 500, 'χ': 600, 'ψ': 700, 'ω': 800,
    };
    let total = 0;
    for (const char of normalized) {
      if (LETTER_VALUES[char]) {
        total += LETTER_VALUES[char];
      }
    }
    return total > 0 ? total : 0;
  };

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
          : 'Plain text or CSV, one Greek word per line.'}
      </p>
    </div>
  );
}