import { useState, useMemo } from 'react';
import { GreekWord, GREEK_WORDS } from '../data/greekWords';
import { calculate } from '../utils/isopsephy';
import LetterBreakdown from './LetterBreakdown';
import SameValueWords from './SameValueWords';
import NumberProperties from './NumberProperties';
import SymbolicInterpretation from './SymbolicInterpretation';
import { Dices, BookOpen } from 'lucide-react';

interface Props {
  onSelectWord?: (word: string) => void;
  wordDatabase?: GreekWord[];
}

export default function RandomDiscovery({ onSelectWord, wordDatabase }: Props) {
  const effectiveDatabase = wordDatabase || GREEK_WORDS;
  const [selectedWord, setSelectedWord] = useState<GreekWord>(() => {
    // Pick an interesting initial word with same-value counterparts
    return effectiveDatabase.find(w => w.word === 'ΘΕΟΣ') || effectiveDatabase[0];
  });

  const handleCurious = () => {
    const randomIndex = Math.floor(Math.random() * effectiveDatabase.length);
    setSelectedWord(effectiveDatabase[randomIndex]);
  };

  const calcResult = useMemo(() => {
    return calculate(selectedWord.word);
  }, [selectedWord]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header with Call to Action */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Random Isopsephic Exploration
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
          Explore the rich tapestry of classical Greek vocabulary, its alphabetic numerical sums, and corresponding harmonic equivalents.
        </p>
        <div>
          <button
            type="button"
            onClick={handleCurious}
            className="inline-flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-2xl font-semibold shadow-md shadow-amber-600/20 hover:shadow-lg transition-all active:scale-95"
          >
            <Dices size={20} />
            <span>I'm Feeling Curious</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase Card */}
      <div className="bg-white dark:bg-stone-800 p-6 md:p-10 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-100 dark:border-stone-700 text-center md:text-left">
          <div>
            <div className="inline-block text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-2">
              Featured Discovery
            </div>
            <h3 className="text-5xl md:text-6xl font-serif font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {selectedWord.word}
            </h3>
            <div className="text-base text-stone-500 dark:text-stone-400 mt-1">
              <span className="font-semibold">{selectedWord.transliteration}</span> — "{selectedWord.meaning}"
            </div>
            {selectedWord.historicalSource && (
              <div className="flex items-center space-x-1.5 text-xs text-stone-400 mt-2">
                <BookOpen size={14} />
                <span>Source: {selectedWord.historicalSource}</span>
              </div>
            )}
          </div>

          <div className="text-center p-6 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-700 min-w-[180px]">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold block mb-1">
              Numerical Value
            </span>
            <span className="text-6xl font-serif font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
              {calcResult.total}
            </span>
            <div className="text-xs text-stone-500 mt-1">
              Digital Root: <strong>{calcResult.digitalRoot}</strong>
            </div>
          </div>
        </div>

        {/* Notes if available */}
        {selectedWord.notes && (
          <div className="p-4 bg-stone-50 dark:bg-stone-900/40 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-xs text-stone-600 dark:text-stone-300 leading-relaxed italic">
            <strong>Scholarly Note:</strong> {selectedWord.notes}
          </div>
        )}
      </div>

      {/* Breakdown and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LetterBreakdown result={calcResult} />
          <SameValueWords
            value={calcResult.total}
            currentInput={selectedWord.word}
            onSelectWord={onSelectWord}
          />
        </div>
        <div className="space-y-6">
          <NumberProperties value={calcResult.total} digitalRoot={calcResult.digitalRoot} />
          <SymbolicInterpretation value={calcResult.total} digitalRoot={calcResult.digitalRoot} />
        </div>
      </div>
    </div>
  );
}
