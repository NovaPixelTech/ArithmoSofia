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
    <div className="min-h-screen flex flex-col font-sans bg-stone-100/60 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-grow container mx-auto px-4 py-6 md:py-10 max-w-5xl pb-24 md:pb-12">
        {activeTab === 'calculator' && (
          <Calculator initialWord={selectedWord} onSelectWord={handleSelectWord} />
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
          <FamousExamples onSelectWord={handleSelectWord} />
        )}
        {activeTab === 'about' && (
          <AboutIsopsephy />
        )}
      </main>

      <Footer />

      <CustomWordsUpload onWordsAdded={(newWords) => {
        setCustomWords(prev => {
          // Merge: avoid duplicates by word
          const existingWords = new Set(prev.map(w => w.word));
          const merged = [...prev, ...newWords].filter(w => !existingWords.has(w.word) && w.value > 0);
          return merged as GreekWord[];
        });
      }} />

<ManualWordEntry onWordAdded={(word) => {
        setCustomWords(prev => {
          // Avoid duplicates
          if (prev.some(w => w.word === word.word)) return prev;
          return [...prev, word as GreekWord];
        });
      }} />
    </div>
  );
}

export default App;
