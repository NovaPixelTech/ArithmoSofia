import { useMemo } from 'react';
import { calculate } from '../utils/isopsephy';
import { GREEK_WORDS } from '../data/greekWords';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  onSelectWord?: (word: string) => void;
}

interface FamousGroup {
  value: number;
  title: string;
  historicalNote: string;
  words: string[];
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

export default function FamousExamples({ onSelectWord }: Props) {
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
      </div>

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
