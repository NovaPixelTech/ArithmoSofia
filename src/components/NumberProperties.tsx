import { useMemo, useState } from 'react';
import { getNumberProperties } from '../utils/isopsephy';
import { Info, Hash, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  value: number;
  digitalRoot: number;
}

export default function NumberProperties({ value, digitalRoot }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const props = useMemo(() => getNumberProperties(value), [value]);

  // Generate digital root calculation steps: e.g. 284 -> 2 + 8 + 4 = 14 -> 1 + 4 = 5
  const rootSteps = useMemo(() => {
    const steps: string[] = [];
    let current = value;
    while (current > 9) {
      const digits = String(current).split('').map(Number);
      const sum = digits.reduce((a, b) => a + b, 0);
      steps.push(`${digits.join(' + ')} = ${sum}`);
      current = sum;
    }
    return steps;
  }, [value]);

  const isEven = value % 2 === 0;

  // Divisibility checks for small common primes/numbers
  const commonDivisors = useMemo(() => {
    const testList = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return testList.filter(d => d < value && value % d === 0);
  }, [value]);

  return (
    <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-stone-100 dark:border-stone-700">
        <Hash size={18} className="text-amber-600 dark:text-amber-400" />
        <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
          Mathematical Properties
        </h3>
      </div>

      <div className="space-y-3.5 text-sm">
        {/* Digital Root with Tooltip */}
        <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1.5">
              <span className="font-medium text-stone-700 dark:text-stone-300">Digital Root</span>
              <button
                type="button"
                onClick={() => setShowTooltip(!showTooltip)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 focus:outline-none"
                aria-label="Digital root historical note"
              >
                <Info size={14} />
              </button>
            </div>
            <span className="font-mono font-bold text-lg text-amber-600 dark:text-amber-400">
              {digitalRoot}
            </span>
          </div>

          {/* Root breakdown progression */}
          {rootSteps.length > 0 && (
            <div className="mt-2 text-xs font-mono text-stone-500 dark:text-stone-400 space-y-0.5">
              {rootSteps.map((s, idx) => (
                <div key={idx}>Step {idx + 1}: {s}</div>
              ))}
            </div>
          )}

          {/* Tooltip explaining it is modern math, not ancient Greek */}
          {showTooltip && (
            <div className="mt-2.5 p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-lg text-xs leading-normal">
              <strong>Note:</strong> The digital root is a mathematical operation (reduction modulo 9). It was <em>not</em> part of the ancient Greek Milesian alphabetic numeral system.
            </div>
          )}
        </div>

        {/* Parity (Even / Odd) */}
        <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-700">
          <span className="text-stone-600 dark:text-stone-400">Parity</span>
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            {isEven ? 'Even Number' : 'Odd Number'}
          </span>
        </div>

        {/* Primality */}
        <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-700">
          <span className="text-stone-600 dark:text-stone-400">Classification</span>
          <span className="flex items-center space-x-1.5 font-semibold">
            {props.isPrime ? (
              <>
                <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400">Prime Number</span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-stone-400" />
                <span className="text-stone-700 dark:text-stone-300">Composite</span>
              </>
            )}
          </span>
        </div>

        {/* Divisibility Summary */}
        {commonDivisors.length > 0 && (
          <div className="py-1.5 border-b border-stone-100 dark:border-stone-700">
            <span className="text-stone-600 dark:text-stone-400 block mb-1">Divisible By</span>
            <div className="flex flex-wrap gap-1">
              {commonDivisors.map(d => (
                <span
                  key={d}
                  className="font-mono text-xs px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Factorization / All Divisors */}
        {!props.isPrime && props.factors.length > 0 && (
          <div className="pt-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-stone-600 dark:text-stone-400">All Divisors</span>
              <span className="text-xs text-stone-400 font-mono">({props.factors.length} total)</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {props.factors.map((f, i) => (
                <span
                  key={i}
                  className="text-xs font-mono bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300 border border-stone-200/50 dark:border-stone-700/50"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
