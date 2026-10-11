import { useState } from 'react';
import { Share2, Check, Download } from 'lucide-react';
import { SharedWord, shareWordsCsv } from '../utils/share';

interface Props {
  words: SharedWord[];
  filename: string;
  title?: string;
  label?: string;
  className?: string;
}

export default function ShareWordsButton({
  words,
  filename,
  title = 'ArithmoSofia',
  label = 'Share CSV',
  className,
}: Props) {
  const [state, setState] = useState<'idle' | 'shared' | 'downloaded'>('idle');
  const canShareFiles =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof (navigator as Navigator & { canShare?: unknown }).canShare === 'function';

  const handleShare = async () => {
    const text = `${title} — import this CSV in ArithmoSofia using “Upload Greek Word List”.`;
    const outcome = await shareWordsCsv(filename, words, title, text);
    if (outcome === 'failed') return;
    setState(outcome);
    window.setTimeout(() => setState('idle'), 2500);
  };

  const icon =
    state === 'downloaded' ? <Check size={16} /> : canShareFiles ? <Share2 size={16} /> : <Download size={16} />;
  const text = state === 'downloaded' ? 'CSV downloaded!' : state === 'shared' ? 'Shared!' : label;

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ??
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-400 dark:hover:border-amber-600 text-xs font-medium transition-colors'
      }
      aria-label={label}
      title="Share this word list as a CSV file"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
