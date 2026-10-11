import type { GreekWord } from '../data/greekWords';

export interface SharedWord {
  word: string;
  value: number;
  meaning?: string;
  transliteration?: string;
  category?: string;
}

export interface SharePayload {
  v: 1;
  kind: 'database' | 'match' | 'result';
  title?: string;
  note?: string;
  words: SharedWord[];
  deleted?: string[];
}

export function toSharedWords(words: Array<Partial<GreekWord> & { word: string; value: number }>): SharedWord[] {
  return words
    .filter(w => w && typeof w.word === 'string' && w.word.trim().length > 0 && w.value > 0)
    .map(w => ({
      word: w.word,
      value: w.value,
      meaning: w.meaning,
      transliteration: w.transliteration,
      category: w.category,
    }));
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(encoded: string): Uint8Array {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.length % 4 ? base64 + '='.repeat(4 - (base64.length % 4)) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function encodePayload(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  return bytesToBase64Url(new TextEncoder().encode(json));
}

export function decodePayload(encoded: string): SharePayload | null {
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(encoded));
    const payload = JSON.parse(json) as SharePayload;
    if (!payload || !Array.isArray(payload.words)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function buildImportUrl(payload: SharePayload): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?import=${encodePayload(payload)}`;
}

export function readImportFromLocation(): SharePayload | null {
  try {
    const raw = new URLSearchParams(window.location.search).get('import');
    if (!raw) return null;
    return decodePayload(raw);
  } catch {
    return null;
  }
}

export function clearImportParam(): void {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('import')) return;
    url.searchParams.delete('import');
    const query = url.searchParams.toString();
    window.history.replaceState({}, document.title, `${url.pathname}${query ? `?${query}` : ''}${url.hash}`);
  } catch {
    // ignore history errors
  }
}

export type ShareOutcome = 'shared' | 'copied' | 'failed';

export async function shareLinkOrCopy(url: string, title: string, text: string): Promise<ShareOutcome> {
  const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
  if (typeof nav.share === 'function') {
    try {
      await nav.share({ title, text, url });
      return 'shared';
    } catch (error) {
      if ((error as DOMException)?.name === 'AbortError') return 'failed';
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
