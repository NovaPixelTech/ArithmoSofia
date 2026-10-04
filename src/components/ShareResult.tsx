import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { CalculationResult } from '../utils/isopsephy';

export default function ShareResult({ result }: { result: CalculationResult }) {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === 'function';

  const shareText = `Hellenic Isopsephy Explorer\n\n${result.input}\n\n${result.words.flatMap(w => w.letters).map(l => `${l.letter.toUpperCase()}=${l.value}`).join(' + ')}\n\nTotal: ${result.total}\nDigital root: ${result.digitalRoot}\n\nHistorical isopsephy calculation.\nSymbolic interpretations are not scientific claims.`;

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: 'Isopsephy Result',
          text: shareText,
        });
      } catch (e) {
        fallbackCopy();
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 py-3 px-4 rounded-xl font-medium transition-colors"
    >
      {copied ? <Check size={20} /> : (canShare ? <Share2 size={20} /> : <Copy size={20} />)}
      <span>{copied ? 'Copied to Clipboard!' : 'Share Result'}</span>
    </button>
  );
}
