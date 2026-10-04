import { useState } from 'react';
import { calculate } from '../utils/isopsephy';
import { ArrowLeftRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  onSelectWord?: (word: string) => void;
}

export default function CompareMode({ onSelectWord: _onSelectWord }: Props) {
  const [wordA, setWordA] = useState('');
  const [wordB, setWordB] = useState('');

  const resA = calculate(wordA);
  const resB = calculate(wordB);

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const hasBoth = wordA.trim().length > 0 && wordB.trim().length > 0;
  const isMatch = hasBoth && resA.total > 0 && resA.total === resB.total;
  const difference = Math.abs(resA.total - resB.total);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Compare Two Greek Words
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Determine if two words share an exact isopsephic equivalence or examine their numerical difference.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-800 p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 space-y-6">
        <form onSubmit={handleCompare} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Word A */}
            <div className="space-y-2">
              <label htmlFor="word-a-input" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Word A
              </label>
              <input
                id="word-a-input"
                type="text"
                value={wordA}
                onChange={(e) => setWordA(e.target.value)}
                placeholder="e.g. ΘΕΟΣ"
                className="w-full text-2xl md:text-3xl font-serif font-bold p-4 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none"
                dir="auto"
              />
              {resA.total > 0 && (
                <div className="text-center p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                  <div className="text-xs text-stone-400">Value of Word A</div>
                  <div className="text-4xl font-bold font-serif text-amber-600 dark:text-amber-400 tabular-nums">
                    {resA.total}
                  </div>
                </div>
              )}
            </div>

            {/* Visual separator icon */}
            <div className="hidden md:flex absolute left-1/2 top-10 -translate-x-1/2 bg-stone-100 dark:bg-stone-700 p-2.5 rounded-full z-10 text-stone-500 dark:text-stone-300 border border-stone-200 dark:border-stone-600 shadow-sm">
              <ArrowLeftRight size={18} />
            </div>

            {/* Word B */}
            <div className="space-y-2">
              <label htmlFor="word-b-input" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Word B
              </label>
              <input
                id="word-b-input"
                type="text"
                value={wordB}
                onChange={(e) => setWordB(e.target.value)}
                placeholder="e.g. ΑΓΙΟΣ"
                className="w-full text-2xl md:text-3xl font-serif font-bold p-4 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none"
                dir="auto"
              />
              {resB.total > 0 && (
                <div className="text-center p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                  <div className="text-xs text-stone-400">Value of Word B</div>
                  <div className="text-4xl font-bold font-serif text-amber-600 dark:text-amber-400 tabular-nums">
                    {resB.total}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!hasBoth}
              className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Compare
            </button>
          </div>
        </form>

        {/* Comparison Evaluation Banner */}
        {hasBoth && resA.total > 0 && resB.total > 0 && (
          <div className="space-y-6 pt-4 border-t border-stone-100 dark:border-stone-700">
            {isMatch ? (
              <div className="p-6 bg-green-50/90 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl text-center animate-in zoom-in duration-300">
                <div className="inline-flex items-center space-x-2 text-green-700 dark:text-green-300 font-serif text-2xl font-bold mb-2">
                  <CheckCircle2 size={24} />
                  <span>Same Numerical Value</span>
                </div>
                <p className="text-sm text-green-800 dark:text-green-400">
                  Both words evaluate to exactly <strong className="font-mono">{resA.total}</strong>. They are strictly isopsephic.
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-3 italic">
                  Note: A shared numerical value is a mathematical observation. It does not by itself establish a semantic, philosophical, or causal relationship.
                </p>
              </div>
            ) : (
              <div className="p-6 bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-700 rounded-2xl text-center animate-in fade-in duration-300">
                <div className="inline-flex items-center space-x-2 text-stone-700 dark:text-stone-300 font-serif text-2xl font-bold mb-2">
                  <AlertTriangle size={24} className="text-amber-500" />
                  <span>Different Numerical Values</span>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Word A evaluates to <strong className="font-mono">{resA.total}</strong> and Word B evaluates to <strong className="font-mono">{resB.total}</strong>.
                </p>
                <div className="mt-2 inline-block font-mono text-sm bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full text-stone-700 dark:text-stone-300">
                  Difference: |{resA.total} − {resB.total}| = {difference}
                </div>
              </div>
            )}

            {/* Letter breakdowns for both words */}
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              {/* Word A breakdown */}
              <div className="p-4 bg-stone-50/70 dark:bg-stone-900/40 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                <h4 className="font-serif font-bold text-sm text-stone-800 dark:text-stone-200 mb-3">
                  Breakdown of {wordA}
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {resA.letters.map((l, i) => (
                    <span key={i} className="text-xs font-mono bg-white dark:bg-stone-800 px-2 py-1 rounded border border-stone-200 dark:border-stone-700">
                      {l.letter} = {l.value}
                    </span>
                  ))}
                </div>
                <div className="text-xs font-mono text-stone-500 dark:text-stone-400">
                  {resA.letters.map(l => l.value).join(' + ')} = <strong className="text-stone-900 dark:text-stone-100">{resA.total}</strong>
                </div>
              </div>

              {/* Word B breakdown */}
              <div className="p-4 bg-stone-50/70 dark:bg-stone-900/40 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                <h4 className="font-serif font-bold text-sm text-stone-800 dark:text-stone-200 mb-3">
                  Breakdown of {wordB}
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {resB.letters.map((l, i) => (
                    <span key={i} className="text-xs font-mono bg-white dark:bg-stone-800 px-2 py-1 rounded border border-stone-200 dark:border-stone-700">
                      {l.letter} = {l.value}
                    </span>
                  ))}
                </div>
                <div className="text-xs font-mono text-stone-500 dark:text-stone-400">
                  {resB.letters.map(l => l.value).join(' + ')} = <strong className="text-stone-900 dark:text-stone-100">{resB.total}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
