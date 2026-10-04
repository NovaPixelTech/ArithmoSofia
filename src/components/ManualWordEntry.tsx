import { useState } from 'react';
import { calculate } from '../utils/isopsephy';

interface GreekWord {
  word: string;
  value: number;
  normalized: string;
  transliteration: string;
  meaning: string;
  category?: string;
  interpretationType?: 'historical' | 'modern' | 'mathematical';
  historicalSource?: string;
  notes?: string;
}

interface ManualWordEntryProps {
  onWordAdded: (word: GreekWord) => void;
}

export default function ManualWordEntry({ onWordAdded }: ManualWordEntryProps) {
  const [input, setInput] = useState<string>('');
  const [lastValue, setLastValue] = useState<number>(0);

  const handleCalculate = () => {
    if (!input.trim()) return;
    const result = calculate(input);
    if (result.total > 0) {
      const newWord: GreekWord = {
        word: input,
        normalized: result.letters[0]?.normalized || input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        value: result.total,
        transliteration: input,
        meaning: 'User-added',
        category: 'user',
        interpretationType: 'mathematical'
      };
      onWordAdded(newWord);
      setLastValue(result.total);
      setInput('');
    }
  };

  return (
    <div className="space-y-3">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a Greek word or phrase"
        dir="auto"
        spellCheck="false"
        className="w-full text-2xl sm:text-4xl md:text-5xl font-bold p-4 sm:p-5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-300 dark:placeholder:text-stone-700 font-serif"
      />
      <button
        onClick={handleCalculate}
        className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm0-4.2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-4.2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
        </svg>
        Calculate Value
      </button>
      {lastValue > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
          <p className="font-bold text-amber-600 dark:text-amber-400">Value: {lastValue}</p>
          <p className="text-sm text-amber-400 dark:text-amber-300 mt-1">Added to custom word list</p>
        </div>
      )}
    </div>
  );
}