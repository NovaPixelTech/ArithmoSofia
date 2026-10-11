import { useMemo } from 'react';
import { calculate } from '../utils/isopsephy';
import { GREEK_WORDS, type GreekWord } from '../data/greekWords';
import ShareWordsButton from './ShareWordsButton';
import { ArrowUpRight, Layers, CheckCircle2 } from 'lucide-react';

interface Props {
  wordDatabase?: GreekWord[];
  onSelectWord?: (word: string) => void;
}

interface MatchEntry {
  word: string;
  value: number;
  meaning: string;
  transliteration: string;
  category: string;
}

interface MatchGroup {
  value: number;
  entries: MatchEntry[];
}

export default function MatchingWords({ wordDatabase, onSelectWord }: Props) {
  const { groups, scanned, matchedWords } = useMemo(() => {
    const pool = (wordDatabase ?? GREEK_WORDS).filter(Boolean);
    const byValue = new Map<number, MatchEntry[]>();

    for (const entry of pool) {
      const result = calculate(entry.word);
      if (result.total <= 0) continue;
      const record: MatchEntry = {
        word: entry.word,
        value: result.total,
        meaning: entry.meaning ?? '',
        transliteration: entry.transliteration ?? '',
        category: entry.category ?? 'concept',
      };
      const bucket = byValue.get(result.total);
      if (bucket) bucket.push(record);
      else byValue.set(result.total, [record]);
    }

    const groupList: MatchGroup[] = [];
    byValue.forEach((entries, value) => {
      if (entries.length < 2) return;
      groupList.push({
        value,
        entries: entries.sort((a, b) => a.word.localeCompare(b.word, 'el')),
      });
    });
    groupList.sort((a, b) => b.entries.length - a.entries.length || a.value - b.value);

    return {
      groups: groupList,
      scanned: pool.length,
      matchedWords: groupList.reduce((sum, group) => sum + group.entries.length, 0),
    };
  }, [wordDatabase]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
          <Layers className="text-amber-600 dark:text-amber-400" size={28} />
          Matching Words in the Database
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
          Every value currently shared by two or more words in your database. Each matching group is a
          separate card you can share on its own as a CSV file.
        </p>

        <div className="pt-3 flex flex-wrap justify-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
            {scanned} words scanned
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
            {groups.length} matching values
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
            {matchedWords} matching words
          </span>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-3xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-8 text-center space-y-2">
          <CheckCircle2 size={28} className="mx-auto text-stone-400" />
          <p className="text-stone-600 dark:text-stone-300 font-medium">
            No two words in the current database share a value.
          </p>
          <p className="text-sm text-stone-400 dark:text-stone-500">
            Upload or enter more Greek words and come back to see the matches.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map(group => (
            <div
              key={group.value}
              className="rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-5 md:p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                    Value: {group.value}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-stone-400 dark:text-stone-500">
                    {group.entries.length} matching words
                  </span>
                </div>
                <ShareWordsButton
                  words={group.entries.map(entry => ({
                    word: entry.word,
                    value: entry.value,
                    meaning: entry.meaning,
                    transliteration: entry.transliteration,
                    category: entry.category,
                  }))}
                  filename={`arithmosofia-matches-${group.value}.csv`}
                  title={`ArithmoSofia matches for ${group.value}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.entries.map(entry => (
                  <button
                    key={entry.word}
                    type="button"
                    onClick={() => onSelectWord && onSelectWord(entry.word)}
                    className="group text-left p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600/70 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                        {entry.word}
                      </span>
                      <ArrowUpRight size={16} className="text-stone-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {entry.transliteration}
                    </div>
                    {entry.meaning && (
                      <div className="mt-2 text-xs italic text-stone-700 dark:text-stone-300 line-clamp-2">
                        "{entry.meaning}"
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
