import { useState } from 'react';
import { calculate } from '../utils/isopsephy';
import type { GreekWord } from '../data/greekWords';
import { OwlOfAthena } from './GreekArt';

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
    <div className="space-y-3 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCalculate();
          }}
          placeholder="Enter a Greek word or phrase"
          aria-label="Enter a Greek word or phrase"
          dir="auto"
          spellCheck="false"
          className="flex-1 text-2xl sm:text-3xl font-bold p-4 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-300 dark:placeholder:text-stone-700 font-serif"
        />
        <button
          type="button"
          onClick={handleCalculate}
          className="shrink-0 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <OwlOfAthena className="w-4 h-4" />
          Calculate Value
        </button>
      </div>
      {lastValue > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
          <p className="font-bold text-amber-600 dark:text-amber-400">Value: {lastValue}</p>
          <p className="text-sm text-amber-400 dark:text-amber-300 mt-1">Added to custom word list</p>
        </div>
      )}
    </div>
  );
}