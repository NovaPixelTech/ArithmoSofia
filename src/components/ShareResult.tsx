import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { CalculationResult } from '../utils/isopsephy';
import { buildImportUrl, shareLinkOrCopy } from '../utils/share';
import type { SharePayload } from '../utils/share';

export default function ShareResult({ result }: { result: CalculationResult }) {
  const [state, setState] = useState<'idle' | 'shared' | 'copied'>('idle');
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const words = result.words.map(w => ({
    word: w.word,
    value: w.total,
  }));

  const shareSummary = `${result.input}\n\n${result.words.flatMap(w => w.letters).map(l => `${l.letter.toUpperCase()}=${l.value}`).join(' + ')}\n\nTotal: ${result.total}\nDigital root: ${result.digitalRoot}\n\nHistorical ArithmoSofia calculation.\nSymbolic interpretations are not scientific claims.`;

  const payload: SharePayload = {
    v: 1,
    kind: 'result',
    title: 'ArithmoSofia result',
    note: shareSummary,
    words,
  };

  const handleShare = async () => {
    const url = buildImportUrl(payload);
    const text = `${shareSummary}\n\nOpen this link to import these words into your ArithmoSofia word database:`;
    const outcome = await shareLinkOrCopy(url, 'ArithmoSofia Result', text);
    if (outcome === 'failed') return;
    setState(outcome === 'copied' ? 'copied' : 'shared');
    window.setTimeout(() => setState('idle'), 2000);
  };

  const label = state === 'copied' ? 'Link Copied to Clipboard!' : state === 'shared' ? 'Shared!' : 'Share Result';

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 py-3 px-4 rounded-xl font-medium transition-colors"
    >
      {state === 'copied' ? <Check size={20} /> : (canShare ? <Share2 size={20} /> : <Copy size={20} />)}
      <span>{label}</span>
    </button>
  );
}
