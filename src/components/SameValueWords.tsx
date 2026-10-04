import { useMemo } from 'react';
import { normalizeGreek } from '../utils/isopsephy';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface GreekWord {
  word: string;
  value: number;
  transliteration?: string;
  meaning?: string;
  category?: string;
  historicalSource?: string;
  interpretationType?: 'historical' | 'modern' | 'mathematical';
}

interface Props {
  value: number;
  currentInput?: string;
  onSelectWord?: (word: string) => void;
  wordDatabase?: GreekWord[];
}

export default function SameValueWords({ value, currentInput = '', onSelectWord, wordDatabase }: Props) {
  const currentNormalized = normalizeGreek(currentInput);

  const effectiveDatabase = wordDatabase || [];

  const matches = useMemo(() => {
    if (!value || value <= 0) return [];
    return effectiveDatabase.filter(w => {
      // Exclude exact identical word to focus on other words with same value
      const isSameWord = normalizeGreek(w.word) === currentNormalized;
      return w.value === value && !isSameWord;
    });
  }, [value, currentNormalized, effectiveDatabase]);

  if (matches.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700">
        <h3 className="text-xl font-serif font-bold mb-2 flex items-center justify-between">
          <span>Same Numerical Value</span>
          <span className="text-xs font-mono text-stone-400 bg-stone-100 dark:bg-stone-900 px-2.5 py-1 rounded-full">
            0 matches
          </span>
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          No other verified words in our dataset currently share the exact value of <strong className="font-mono text-stone-700 dark:text-stone-300">{value}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-800 p-6 md:p-8 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
        <div className="flex items-center space-x-2">
          <Sparkles size={20} className="text-amber-600 dark:text-amber-400" />
          <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Same Numerical Value
          </h3>
        </div>
        <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-xs px-2.5 py-1 rounded-full font-sans font-semibold">
          {matches.length} {matches.length === 1 ? 'word' : 'words'} ({value})
        </span>
      </div>

      <p className="text-xs text-stone-500 dark:text-stone-400">
        Mathematically verified entries in our database that evaluate to exactly <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{value}</span>. Click any entry to calculate it.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {matches.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectWord && onSelectWord(item.word)}
            className="group text-left p-4 rounded-xl border border-stone-200/90 dark:border-stone-700 bg-stone-50/70 hover:bg-amber-50/60 dark:bg-stone-900/40 dark:hover:bg-amber-950/20 hover:border-amber-400 dark:hover:border-amber-600/70 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 relative"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                  {item.word}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 ml-2 font-sans">
                  ({item.transliteration})
                </span>
              </div>
              <div className="flex items-center space-x-1 font-mono text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg">
                <span>{item.value}</span>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-300 mt-1 italic">
              "{item.meaning}"
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500 mt-2 pt-2 border-t border-stone-200/50 dark:border-stone-800">
              <span className="capitalize">{item.category}</span>
              {item.historicalSource && (
                <span className="truncate max-w-[150px]">{item.historicalSource}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
