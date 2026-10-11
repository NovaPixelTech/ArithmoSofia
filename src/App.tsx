import { GreekWord, GREEK_WORDS } from './data/greekWords';
import { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Calculator from './components/Calculator';
import CompareMode from './components/CompareMode';
import DiscoverByNumber from './components/DiscoverByNumber';
import MatchingWords from './components/MatchingWords';
import FamousExamples from './components/FamousExamples';
import AboutIsopsephy from './components/AboutIsopsephy';
import RandomDiscovery from './components/RandomDiscovery';
import CustomWordsUpload from './components/CustomWordsUpload';
import ManualWordEntry from './components/ManualWordEntry';
import GreekArt from './components/GreekArt';
import ShareWordsButton from './components/ShareWordsButton';
import { Download, Trash2 } from 'lucide-react';
import { toSharedWords, buildWordsCsv, downloadCsv } from './utils/share';
import { parseWordsFromCsvText } from './utils/csvImport';

export type Tab = 'calculator' | 'compare' | 'discover' | 'curious' | 'matches' | 'examples' | 'about';

const STORAGE_KEY = 'isopsephy-custom-words';
const DELETED_KEY = 'isopsephy-deleted-words';

const loadCustomWordsFromStorage = (): GreekWord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore storage errors
  }
  return [];
};

const saveCustomWordsToStorage = (words: GreekWord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch {
    // ignore storage errors
  }
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [selectedWord, setSelectedWord] = useState<string>('ΘΕΟΣ');
  const [customWords, setCustomWords] = useState<GreekWord[]>(loadCustomWordsFromStorage);
  const [deletedWords, setDeletedWords] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(DELETED_KEY) || '[]'); } catch { return []; }
  });
  const [wordNotice, setWordNotice] = useState('');

  // Merge custom words with the base dataset, avoiding duplicates
  const allWords = useMemo(() => {
    const customWordSet = new Set(customWords.map(w => w.word));
    return [
      ...GREEK_WORDS.filter(w => !customWordSet.has(w.word) && !deletedWords.includes(w.word)),
      ...customWords.filter(w => w.value > 0)
    ];
  }, [customWords, deletedWords]);

  useEffect(() => {
    saveCustomWordsToStorage(customWords);
  }, [customWords]);

  useEffect(() => {
    try { localStorage.setItem(DELETED_KEY, JSON.stringify(deletedWords)); } catch { /* ignore storage errors */ }
  }, [deletedWords]);

  const handleDeleteWord = (word: string) => {
    if (!window.confirm(`Delete “${word}” from the word database? This cannot be undone.`)) return;
    setCustomWords(prev => prev.filter(entry => entry.word !== word));
    if (GREEK_WORDS.some(entry => entry.word === word)) {
      setDeletedWords(prev => prev.includes(word) ? prev : [...prev, word]);
    }
    setWordNotice(`“${word}” was deleted from the word database.`);
  };

  const handleDeleteDatabase = () => {
    if (!window.confirm('Delete the ENTIRE word database? This removes every word — the built-in list and everything you added — and cannot be undone.')) return;
    setCustomWords([]);
    setDeletedWords(GREEK_WORDS.map(entry => entry.word));
    setWordNotice('The entire word database was deleted.');
  };

  const handleDownloadWords = () => {
    downloadCsv('arithmosofia-words.csv', buildWordsCsv(toSharedWords(allWords)));
  };

  const handleWordsAdded = (newWords: GreekWord[]) => {
    const visible = new Set(allWords.map(w => w.word));
    const toAdd: GreekWord[] = [];
    const toRestore: string[] = [];
    for (const w of newWords) {
      if (!w || w.value <= 0 || visible.has(w.word)) continue;
      if (deletedWords.includes(w.word)) {
        if (!toRestore.includes(w.word)) toRestore.push(w.word);
        continue;
      }
      visible.add(w.word);
      toAdd.push(w);
    }
    if (toAdd.length > 0) setCustomWords(prev => [...prev, ...toAdd]);
    if (toRestore.length > 0) setDeletedWords(prev => prev.filter(w => !toRestore.includes(w)));
    const total = toAdd.length + toRestore.length;
    setWordNotice(
      total > 0
        ? `Imported ${total} new word${total === 1 ? '' : 's'} into the database.`
        : 'Those words are already in your database.'
    );
  };

  // Keep a live reference so the OS file-launch handler always uses current state.
  const handleWordsAddedRef = useRef(handleWordsAdded);
  useEffect(() => {
    handleWordsAddedRef.current = handleWordsAdded;
  });

  // PWA File Handling API: when the installed app is opened with a shared CSV
  // file, read it and import immediately.
  useEffect(() => {
    type LaunchFile = { getFile: () => Promise<File> };
    type LaunchParams = { files?: LaunchFile[] };
    const queue = (window as unknown as { launchQueue?: { setConsumer: (cb: (params: LaunchParams) => void) => void } }).launchQueue;
    if (!queue || typeof queue.setConsumer !== 'function') return;

    queue.setConsumer(async (params) => {
      const handles = params?.files ?? [];
      const collected: GreekWord[] = [];
      for (const handle of handles) {
        try {
          const file = await handle.getFile();
          const text = await file.text();
          collected.push(...parseWordsFromCsvText(text));
        } catch {
          // ignore unreadable launches
        }
      }
      if (collected.length > 0) {
        setActiveTab('matches');
        handleWordsAddedRef.current(collected);
      }
    });
  }, []);

  const handleSelectWord = (word: string) => {
    setSelectedWord(word);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-100/60 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors greek-marble-bg">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-grow container mx-auto px-4 py-6 md:py-10 max-w-5xl pb-24 md:pb-12">
        {activeTab === 'calculator' && (
          <Calculator
            initialWord={selectedWord}
            onSelectWord={handleSelectWord}
            wordDatabase={allWords}
            onDeleteWord={handleDeleteWord}
          />
        )}
        {activeTab === 'compare' && (
          <CompareMode onSelectWord={handleSelectWord} />
        )}
        {activeTab === 'discover' && (
          <DiscoverByNumber onSelectWord={handleSelectWord} wordDatabase={allWords} />
        )}
        {activeTab === 'curious' && (
          <RandomDiscovery onSelectWord={handleSelectWord} wordDatabase={allWords} />
        )}
        {activeTab === 'matches' && (
          <MatchingWords onSelectWord={handleSelectWord} wordDatabase={allWords} />
        )}
        {activeTab === 'examples' && (
          <FamousExamples onSelectWord={handleSelectWord} wordDatabase={allWords} />
        )}
        {activeTab === 'about' && (
          <AboutIsopsephy />
        )}
      </main>

      {/* Greek word tools — placed at the bottom of every screen, just above the footer */}
      <GreekArt.MarbleDivider />
      <section
        aria-label="Greek word list tools"
        className="border-t border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm"
      >
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Add Greek Words to the Database
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Upload a word list or enter a word or phrase by hand — both feed the same collection.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={handleDownloadWords} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 text-sm font-medium">
                <Download size={16} /> Download full word list (CSV)
              </button>
              <ShareWordsButton
                words={toSharedWords(allWords)}
                filename="arithmosofia-word-database.csv"
                title="ArithmoSofia word database"
                label="Share word database (CSV)"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-sm font-medium transition-colors"
              />
              <button type="button" onClick={handleDeleteDatabase} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 text-sm font-medium">
                <Trash2 size={16} /> Delete entire database
              </button>
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-500 max-w-xl text-center">
              Sharing sends a CSV file — the recipient imports it with “Upload Greek Word List”.
            </p>
            {wordNotice && <p role="status" className="text-sm text-green-700 dark:text-green-400">{wordNotice}</p>}
          </div>

          <CustomWordsUpload onWordsAdded={handleWordsAdded} />

          <ManualWordEntry onWordAdded={(word) => handleWordsAdded([word as GreekWord])} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
