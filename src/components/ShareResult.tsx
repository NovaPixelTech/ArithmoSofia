import { CalculationResult } from '../utils/isopsephy';
import ShareWordsButton from './ShareWordsButton';

export default function ShareResult({ result }: { result: CalculationResult }) {
  const words = result.words.map(w => ({
    word: w.word,
    value: w.total,
    meaning: `Digital root ${result.digitalRoot}`,
    transliteration: w.word,
  }));

  return (
    <ShareWordsButton
      words={words}
      filename={`arithmosofia-result-${result.total}.csv`}
      title={`ArithmoSofia result — ${result.input}`}
      label="Share Result (CSV)"
      className="w-full flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 py-3 px-4 rounded-xl font-medium transition-colors"
    />
  );
}
