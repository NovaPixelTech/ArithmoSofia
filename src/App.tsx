import { GreekWord, GREEK_WORDS } from './data/greekWords';
import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Calculator from './components/Calculator';
import CompareMode from './components/CompareMode';
import DiscoverByNumber from './components/DiscoverByNumber';
import FamousExamples from './components/FamousExamples';
import AboutIsopsephy from './components/AboutIsopsephy';
import RandomDiscovery from './components/RandomDiscovery';
import CustomWordsUpload from './components/CustomWordsUpload';
import ManualWordEntry from './components/ManualWordEntry';
import GreekArt from './components/GreekArt';

export type Tab = 'calculator' | 'compare' | 'discover' | 'curious' | 'examples' | 'about';

const STORAGE_KEY = 'isopsephy-custom-words';

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

  // Merge custom words with the base dataset, avoiding duplicates
  const allWords = useMemo(() => {
    const customWordSet = new Set(customWords.map(w => w.word));
    return [
      ...GREEK_WORDS.filter(w => !customWordSet.has(w.word)),
      ...customWords.filter(w => w.value > 0)
    ];
  }, [customWords]);

  useEffect(() => {
    saveCustomWordsToStorage(customWords);
  }, [customWords]);

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

          <CustomWordsUpload onWordsAdded={(newWords) => {
            setCustomWords(prev => {
              const seen = new Set(prev.map(w => w.word));
              const merged = [...prev];
              for (const w of newWords) {
                if (seen.has(w.word) || w.value <= 0) continue;
                seen.add(w.word);
                merged.push(w);
              }
              return merged as GreekWord[];
            });
          }} />

          <ManualWordEntry onWordAdded={(word) => {
            setCustomWords(prev => {
              if (prev.some(w => w.word === word.word)) return prev;
              return [...prev, word as GreekWord];
            });
          }} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;