import { CalculationResult } from '../utils/isopsephy';
import { ArrowRight } from 'lucide-react';

interface Props {
  result: CalculationResult;
}

export default function LetterBreakdown({ result }: Props) {
  if (result.letters.length === 0) return null;

  return (
    <div className="bg-white dark:bg-stone-800 p-6 md:p-8 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
        <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Letter-by-Letter Breakdown
        </h3>
        <span className="text-xs font-mono text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 px-2.5 py-1 rounded-full">
          {result.letters.length} {result.letters.length === 1 ? 'letter' : 'letters'}
        </span>
      </div>

      {/* Word-by-word visual cards */}
      <div className="space-y-6">
        {result.words.map((word, wIdx) => (
          <div key={wIdx} className="space-y-3">
            {result.words.length > 1 && (
              <div className="text-sm font-serif font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>Word {wIdx + 1}: <span className="text-amber-600 dark:text-amber-400 font-sans">{word.word}</span></span>
                <span className="font-mono text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                  Sum = {word.total}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {word.letters.map((lv, lIdx) => (
                <div
                  key={lIdx}
                  className="flex flex-col items-center justify-center p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200/80 dark:border-stone-700/80 transition-transform hover:-translate-y-0.5"
                >
                  <span className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
                    {lv.letter}
                  </span>
                  <div className="flex items-center space-x-1 mt-1 text-stone-400 dark:text-stone-500">
                    <ArrowRight size={12} />
                    <span className="font-mono font-bold text-base text-amber-600 dark:text-amber-400">
                      {lv.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Complete mathematical summation equation */}
      <div className="p-4 bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-700/60 rounded-xl">
        <div className="text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500 font-semibold mb-2">
          Mathematical Summation
        </div>
        <div className="font-mono text-base md:text-lg flex flex-wrap items-center gap-1.5 text-stone-800 dark:text-stone-200">
          {result.letters.map((l, i) => (
            <span key={i} className="inline-flex items-center">
              <span>{l.value}</span>
              {i < result.letters.length - 1 && (
                <span className="text-stone-400 dark:text-stone-500 mx-1">+</span>
              )}
            </span>
          ))}
          <span className="text-stone-400 dark:text-stone-500 mx-1">=</span>
          <span className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">
            {result.total}
          </span>
        </div>
      </div>
    </div>
  );
}
