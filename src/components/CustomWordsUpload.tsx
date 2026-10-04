import { useState } from 'react';

interface GreekWord {
  word: string;
  normalized: string;
  value: number;
  transliteration: string;
  meaning: string;
  category: string;
  interpretationType: 'historical' | 'modern' | 'mathematical';
}

interface CustomWordsUploadProps {
  onWordsAdded: (words: GreekWord[]) => void;
}

export default function CustomWordsUpload({ onWordsAdded }: CustomWordsUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    if (file) processFile();
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

  const processFile = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const words = parseGreekWords(text);
      onWordsAdded(words);
      setFile(null);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".txt,.csv"
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => {
          const input = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (input) input.click();
        }}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm0-4.2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-4.2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
        </svg>
        Upload Greek Word List
      </button>
      {file && <p className="text-xs text-stone-500">Selected: {file.name}</p>}
    </div>
  );
}