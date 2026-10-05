import { useEffect, useMemo, useState } from 'react';
import { calculate } from '../utils/isopsephy';
import { GREEK_WORDS, type GreekWord } from '../data/greekWords';
import { ArrowUpRight, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';
import { GreekKeyDivider } from './GreekArt';

interface Props {
  onSelectWord?: (word: string) => void;
  wordDatabase?: GreekWord[];
}

interface FamousGroup {
  value: number;
  title: string;
  historicalNote: string;
  words: string[];
}

interface ScanEntry {
  word: string;
  value: number;
  meaning: string;
  transliteration: string;
  category: string;
}

interface ScanGroup {
  value: number;
  entries: ScanEntry[];
}

const CURATED_FAMOUS: FamousGroup[] = [
  {
    value: 284,
    title: 'The Divine Equivalence (Theos, Hagios, Agathos)',
    historicalNote: 'Celebrated in Hellenistic and patristic literature: God (Θεός), Holy (Ἅγιος), and Good (Ἀγαθός) all evaluate to 284.',
    words: ['ΘΕΟΣ', 'ΑΓΙΟΣ', 'ΑΓΑΘΟΣ']
  },
  {
    value: 720,
    title: 'Mind and Space (Nous and Topos)',
    historicalNote: 'Famous ancient philosophical equivalence between Mind / Intellect (Νοῦς) and Place / Space (Τόπος).',
    words: ['ΝΟΥΣ', 'ΤΟΠΟΣ']
  },
  {
    value: 800,
    title: 'Sovereignty & Faith (Kyrios and Pistis)',
    historicalNote: 'Both the supreme title of Lord (Κύριος) and the fundamental virtue of Faith / Trust (Πίστις) calculate to 800.',
    words: ['ΚΥΡΙΟΣ', 'ΠΙΣΤΙΣ']
  },
  {
    value: 888,
    title: 'The Sacred Ogdoad (Iesous)',
    historicalNote: 'Extensively cited in the Christian Sibylline Oracles and early fathers (Irenaeus): ΙΗΣΟΥΣ equals 888, composed of three eights (symbolizing resurrection and renewal).',
    words: ['ΙΗΣΟΥΣ']
  },
  {
    value: 781,
    title: 'Wisdom Incarnate (Sophia and Chroia)',
    historicalNote: 'Wisdom (Σοφία, 781) was the cornerstone of Hellenic virtue and early philosophical schools.',
    words: ['ΣΟΦΙΑ', 'ΧΡΟΙΑ']
  },
  {
    value: 576,
    title: 'The Heavenly Spirit & The Dove (Pneuma and Peristera)',
    historicalNote: 'Classical early Christian isopsephic connection: the divine Spirit (Πνεῦμα, 576) shares its exact sum with the Dove (Περιστερά, 576), the form in which the Spirit descended.',
    words: ['ΠΝΕΥΜΑ', 'ΠΕΡΙΣΤΕΡΑ', 'ΑΕΤΟΣ', 'ΠΟΙΗΤΗΣ']
  },
  {
    value: 430,
    title: 'Law, Number & Mortality (Nomos, Arithmos, Thanatos)',
    historicalNote: 'The sacred rule of Law (Νόμος), the cosmic principle of Number (Ἀριθμός), Homer (Ὅμηρος), and Death (Θάνατος) all share the value 430.',
    words: ['ΝΟΜΟΣ', 'ΑΡΙΘΜΟΣ', 'ΘΑΝΑΤΟΣ', 'ΟΜΗΡΟΣ']
  },
  {
    value: 681,
    title: 'Being & Excellence (Ousia, Aristos, Iatros)',
    historicalNote: 'Substance / True Being (Οὐσία), The Best / Preeminent (Ἄριστος), and The Physician / Healer (Ἰατρός) all evaluate to 681.',
    words: ['ΟΥΣΙΑ', 'ΑΡΙΣΤΟΣ', 'ΙΑΤΡΟΣ']
  },
  {
    value: 373,
    title: 'Word & Wonder (Logos and Semeion)',
    historicalNote: 'In the Gospel of John, the Divine Word (Λόγος, 373) is revealed through Miraculous Signs (Σημεῖον, 373).',
    words: ['ΛΟΓΟΣ', 'ΣΗΜΕΙΟΝ']
  },
  {
    value: 1219,
    title: 'The Depths: Ocean Sovereign & The Fish (Poseidon and Ichthys)',
    historicalNote: 'Poseidon (Ποσειδῶν, 1219), ruler of the sea, shares his exact numerical sum with the sacred fish acronym (Ἰχθύς, 1219).',
    words: ['ΠΟΣΕΙΔΩΝ', 'ΙΧΘΥΣ']
  }
];

export default function FamousExamples({ onSelectWord, wordDatabase }: Props) {
  const [scanState, setScanState] = useState<'idle' | 'running' | 'done'>('idle');
  const [scanMatches, setScanMatches] = useState<ScanGroup[]>([]);
  const [scanStats, setScanStats] = useState({ scanned: 0, matches: 0, values: 0 });

  /**
   * Re-processes every word currently held in the database — the bundled
   * dataset plus anything the user has uploaded or typed in — recomputes its
   * isopsephic value from scratch, then reports every value shared by two or
   * more words.
   */
  const runDatabaseScan = () => {
    setScanState('running');
    setScanMatches([]);
    setScanStats({ scanned: 0, matches: 0, values: 0 });

    // Defer to the next frame so the button's pending state paints first.
    window.setTimeout(() => {
      const pool = (wordDatabase ?? GREEK_WORDS).filter(Boolean);
      const byValue = new Map<number, ScanEntry[]>();

      for (const entry of pool) {
        const result = calculate(entry.word);
        if (result.total <= 0) continue;
        const bucket = byValue.get(result.total);
        const record: ScanEntry = {
          word: entry.word,
          value: result.total,
          meaning: entry.meaning ?? '',
          transliteration: entry.transliteration ?? '',
          category: entry.category ?? 'concept',
        };
        if (bucket) bucket.push(record);
        else byValue.set(result.total, [record]);
      }

      const groups: ScanGroup[] = [];
      byValue.forEach((entries, value) => {
        if (entries.length < 2) return;
        groups.push({
          value,
          entries: entries.sort((a, b) => a.word.localeCompare(b.word, 'el')),
        });
      });
      groups.sort((a, b) => b.entries.length - a.entries.length || a.value - b.value);

      const matchedWords = groups.reduce((sum, g) => sum + g.entries.length, 0);
      setScanMatches(groups);
      setScanStats({ scanned: pool.length, matches: matchedWords, values: groups.length });
      setScanState('done');
    }, 30);
  };

  // A fresh word upload invalidates the previous scan results.
  useEffect(() => {
    setScanState('idle');
    setScanMatches([]);
    setScanStats({ scanned: 0, matches: 0, values: 0 });
  }, [wordDatabase]);

  // Verified items with details
  const verifiedGroups = useMemo(() => {
    return CURATED_FAMOUS.map(group => {
      const wordDetails = group.words.map(w => {
        const item = GREEK_WORDS.find(entry => entry.word === w);
        const calcRes = calculate(w);
        return {
          word: w,
          meaning: item?.meaning || '',
          transliteration: item?.transliteration || '',
          total: calcRes.total,
          letters: calcRes.letters
        };
      });

      return {
        ...group,
        wordDetails
      };
    });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Famous Greek ArithmoSofia Examples
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Historically recorded and celebrated numerical equivalences from ancient literature, philosophy, and early biblical scholarship.
        </p>

        <div className="pt-3 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={runDatabaseScan}
            disabled={scanState === 'running'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-progress text-white text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900"
          >
            {scanState === 'running' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {scanState === 'running'
              ? 'Processing database…'
              : scanState === 'done'
                ? 'Rescan the Database'
                : 'Process All Words in the Database'}
          </button>
          <p className="text-xs text-stone-400 dark:text-stone-500 max-w-md">
            Recalculates every word in the current database — the{' '}
            {(wordDatabase ?? GREEK_WORDS).length} entries you have now — and lists every value
            shared by two or more words.
          </p>
        </div>
      </div>

      {scanState === 'done' && (
        <div className="rounded-3xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/20 p-5 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-amber-600 dark:text-amber-400" />
              Database Scan Complete
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                {scanStats.scanned} words processed
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                {scanStats.values} matching values
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                {scanStats.matches} matching words
              </span>
            </div>
          </div>

          {scanMatches.length === 0 ? (
            <p className="text-sm text-stone-600 dark:text-stone-300">
              No two words in the current database share a value. Upload or enter more Greek words and
              scan again.
            </p>
          ) : (
            <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-1">
              {scanMatches.map(group => (
                <div
                  key={group.value}
                  className="rounded-2xl bg-white dark:bg-stone-900/70 border border-stone-200 dark:border-stone-700 p-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
                      = {group.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-stone-400 dark:text-stone-500">
                      {group.entries.length} matches
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.entries.map(entry => (
                      <button
                        key={entry.word}
                        type="button"
                        onClick={() => onSelectWord && onSelectWord(entry.word)}
                        title={entry.transliteration ? `${entry.transliteration} — ${entry.meaning}` : entry.meaning}
                        className="px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
                          {entry.word}
                        </span>
                        {entry.transliteration && (
                          <span className="ml-2 text-[11px] text-stone-500 dark:text-stone-400">
                            {entry.transliteration}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <GreekKeyDivider />

      <div className="space-y-6">
        {verifiedGroups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="bg-white dark:bg-stone-800 rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200 dark:border-stone-700 space-y-5"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-700">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {group.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {group.historicalNote}
                </p>
              </div>
              <div className="flex items-center space-x-1.5 self-start sm:self-auto font-mono text-lg font-bold px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-xl">
                <span>Value:</span>
                <span>{group.value}</span>
              </div>
            </div>

            {/* Word cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.wordDetails.map((w, wIdx) => (
                <button
                  key={wIdx}
                  type="button"
                  onClick={() => onSelectWord && onSelectWord(w.word)}
                  className="group text-left p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600/70 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                        {w.word}
                      </span>
                      <ArrowUpRight size={16} className="text-stone-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {w.transliteration} — "{w.meaning}"
                    </div>
                  </div>

                  {/* Letter breakdown chips */}
                  <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800 space-y-1.5">
                    <div className="flex flex-wrap gap-1 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                      {w.letters.map((l, lIdx) => (
                        <span key={lIdx} className="bg-white dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                          {l.letter}={l.value}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      {w.letters.map(l => l.value).join(' + ')} = {w.total}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
