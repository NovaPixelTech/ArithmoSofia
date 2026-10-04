import { useState, useMemo, useEffect, useRef } from 'react';
import { calculate, CalculationResult } from '../utils/isopsephy';
import { GREEK_WORDS } from '../data/greekWords';
import LetterBreakdown from './LetterBreakdown';
import SameValueWords from './SameValueWords';
import NumberProperties from './NumberProperties';
import SymbolicInterpretation from './SymbolicInterpretation';
import HistoricalContext from './HistoricalContext';
import ShareResult from './ShareResult';
import { Dices, AlertCircle } from 'lucide-react';

interface Props {
  initialWord?: string;
  onSelectWord?: (word: string) => void;
}

const EXAMPLE_WORDS = ['ΘΕΟΣ', 'ΑΓΑΠΗ', 'ΛΟΓΟΣ', 'ΣΟΦΙΑ', 'ΦΩΣ', 'ΝΟΥΣ'];

// Custom animated counter hook
function useAnimatedCounter(targetValue: number, duration: number = 600): number {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = null;

    if (targetValue === 0) {
      setDisplayValue(0);
      return;
    }

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValueRef.current + (targetValue - startValueRef.current) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, duration]);

  return displayValue;
}

export default function Calculator({ initialWord = '', onSelectWord }: Props) {
  const [input, setInput] = useState(initialWord);

  useEffect(() => {
    if (initialWord) {
      setInput(initialWord);
    }
  }, [initialWord]);

  const result: CalculationResult = useMemo(() => calculate(input), [input]);
  const animatedTotal = useAnimatedCounter(result.total);

  // Check if user entered text that contains no Greek letters
  const hasInput = input.trim().length > 0;
  const hasNoGreekLetters = hasInput && result.letters.length === 0;

  const handleRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * GREEK_WORDS.length);
    const chosen = GREEK_WORDS[randomIndex].word;
    setInput(chosen);
    if (onSelectWord) {
      onSelectWord(chosen);
    }
  };

  const handleSelectWord = (word: string) => {
    setInput(word);
    if (onSelectWord) {
      onSelectWord(word);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-4">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          Hellenic <span className="text-amber-600 dark:text-amber-400">Isopsephy</span> Explorer
        </h1>
        <p className="text-base md:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
          Discover the numerical value and symbolic connections hidden within Greek words.
        </p>
      </div>

      {/* Main Calculator Box */}
      <div className="bg-white dark:bg-stone-800 p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 space-y-6">
        <div>
          <label htmlFor="greek-calculator-input" className="block text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            Greek Word or Phrase
          </label>
          <div className="relative">
            <input
              id="greek-calculator-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a Greek word or phrase…"
              className="w-full text-2xl sm:text-4xl md:text-5xl font-bold p-4 sm:p-5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-300 dark:placeholder:text-stone-700 font-serif"
              dir="auto"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Validation Warning for non-Greek input */}
        {hasNoGreekLetters && (
          <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center space-x-3 text-amber-900 dark:text-amber-300 animate-in fade-in duration-200 text-sm">
            <AlertCircle size={20} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Please enter at least one Greek letter.</strong> English letters, numerals, and punctuation do not have values in Greek isopsephy.
            </span>
          </div>
        )}

        {/* Action Buttons & Examples */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
          {/* Quick example pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <span className="font-medium mr-1">Examples:</span>
            {EXAMPLE_WORDS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleSelectWord(ex)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 dark:bg-stone-900 dark:hover:bg-amber-950/50 hover:text-amber-900 dark:hover:text-amber-300 transition-colors font-serif font-bold text-stone-800 dark:text-stone-200 border border-stone-200/60 dark:border-stone-700/60"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRandomWord}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-sm font-medium"
            >
              <Dices size={16} />
              <span>Explore a random word</span>
            </button>
          </div>
        </div>

        {/* Large Result Counter Display */}
        {result.total > 0 && (
          <div className="mt-8 pt-8 border-t border-stone-100 dark:border-stone-700/80 text-center animate-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 font-semibold mb-1">
                Total Isopsephic Value
              </span>
              <div
                className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums tracking-tight font-serif select-all"
                aria-label={`Total calculation value ${result.total}`}
              >
                {animatedTotal}
              </div>
              <div className="mt-2 text-sm text-stone-500 dark:text-stone-400 font-sans">
                Digital Root: <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{result.digitalRoot}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results and Analytical Sections */}
      {result.total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <LetterBreakdown result={result} />
            <SameValueWords
              value={result.total}
              currentInput={input}
              onSelectWord={handleSelectWord}
            />
            <HistoricalContext />
          </div>

          <div className="space-y-6">
            <NumberProperties value={result.total} digitalRoot={result.digitalRoot} />
            <SymbolicInterpretation value={result.total} digitalRoot={result.digitalRoot} />
            <ShareResult result={result} />
          </div>
        </div>
      )}
    </div>
  );
}
