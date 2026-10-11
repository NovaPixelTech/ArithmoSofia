import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { buildImportUrl, shareLinkOrCopy } from '../utils/share';
import type { SharePayload } from '../utils/share';

interface Props {
  payload: SharePayload;
  title?: string;
  label?: string;
  className?: string;
}

export default function ShareLinkButton({ payload, title = 'ArithmoSofia', label = 'Share link', className }: Props) {
  const [state, setState] = useState<'idle' | 'shared' | 'copied'>('idle');
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleShare = async () => {
    const url = buildImportUrl(payload);
    const text = `${title} — open this link to import these words into your ArithmoSofia word database:`;
    const outcome = await shareLinkOrCopy(url, title, text);
    if (outcome === 'failed') return;
    setState(outcome === 'copied' ? 'copied' : 'shared');
    window.setTimeout(() => setState('idle'), 2500);
  };

  const icon = state === 'copied' ? <Check size={16} /> : canShare ? <Share2 size={16} /> : <Copy size={16} />;
  const text = state === 'copied' ? 'Link copied!' : state === 'shared' ? 'Shared!' : label;

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ??
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-400 dark:hover:border-amber-600 text-xs font-medium transition-colors'
      }
      aria-label={label}
      title="Share an importable link"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
