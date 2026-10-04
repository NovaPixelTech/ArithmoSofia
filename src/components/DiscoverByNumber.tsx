import { useState, useMemo } from 'react';
import { GreekWord, GREEK_WORDS } from '../data/greekWords';
import { Search, ArrowUpRight } from 'lucide-react';

interface Props {
  onSelectWord?: (word: string) => void;
  wordDatabase?: GreekWord[];
}

const FAMOUS_NUMBERS = [284, 312, 321, 373, 430, 461, 510, 576, 680, 681, 720, 781, 800, 888, 1219, 1310, 1480];

export default function DiscoverByNumber({ onSelectWord, wordDatabase }: Props) {
  const effectiveDatabase = wordDatabase || GREEK_WORDS;
  const [targetNumber, setTargetNumber] = useState<string>('284');

  const numValue = parseInt(targetNumber, 10);

  const exactMatches = useMemo(() => {
    if (!targetNumber || isNaN(numValue) || numValue <= 0) return [];
    return effectiveDatabase.filter(w => w.value === numValue);
  }, [numValue, targetNumber, effectiveDatabase]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Discover by Number
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Reverse lookup: enter a numerical value to discover all corresponding words in our verified Greek lexicon.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-800 p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 space-y-6">
        <div>
          <label htmlFor="number-discovery-input" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            Target Numerical Value
          </label>
          <div className="relative">
            <input
              id="number-discovery-input"
              type="number"
              min="1"
              value={targetNumber}
              onChange={(e) => setTargetNumber(e.target.value)}
              placeholder="e.g. 284, 720, 888…"
              className="w-full text-3xl sm:text-4xl font-bold p-4 sm:p-5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none tabular-nums font-mono"
            />
          </div>
        </div>

        {/* Famous Number Shortcut Pills */}
        <div className="space-y-2 pt-1">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            Explore frequent isopsephic values:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {FAMOUS_NUMBERS.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setTargetNumber(String(n))}
                className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                  numValue === n
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Results grid */}
        {targetNumber && !isNaN(numValue) && (
          <div className="pt-6 border-t border-stone-100 dark:border-stone-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
                Found {exactMatches.length} {exactMatches.length === 1 ? 'entry' : 'entries'} for {numValue}
              </h3>
              <span className="text-xs font-mono bg-stone-100 dark:bg-stone-900 px-2.5 py-1 rounded-full text-stone-500">
                Sum = {numValue}
              </span>
            </div>

            {exactMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {exactMatches.map((match, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelectWord && onSelectWord(match.word)}
                    className="group text-left p-4 border border-stone-200 dark:border-stone-700 rounded-2xl bg-stone-50/70 hover:bg-amber-50/60 dark:bg-stone-900/40 dark:hover:bg-amber-950/20 hover:border-amber-400 dark:hover:border-amber-600/70 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 relative"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                        {match.word}
                      </span>
                      <ArrowUpRight size={16} className="text-stone-400 group-hover:text-amber-600 transition-colors" />
                    </div>

                    <div className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
                      {match.transliteration}
                    </div>

                    <div className="mt-2 text-xs italic text-stone-700 dark:text-stone-300 line-clamp-2">
                      "{match.meaning}"
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/50 dark:border-stone-800 flex justify-between text-[11px] text-stone-400">
                      <span className="capitalize">{match.category}</span>
                      <span className="capitalize">{match.interpretationType}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 bg-stone-50 dark:bg-stone-900/30 rounded-2xl border border-stone-200/60 dark:border-stone-800">
                <Search size={28} className="mx-auto text-stone-400 mb-2" />
                <p className="text-stone-600 dark:text-stone-400 font-medium">
                  No words with value {numValue} in our current verified database.
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Try another number or select one of the highlighted frequent values above.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}