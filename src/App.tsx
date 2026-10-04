import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Calculator from './components/Calculator';
import CompareMode from './components/CompareMode';
import DiscoverByNumber from './components/DiscoverByNumber';
import FamousExamples from './components/FamousExamples';
import AboutIsopsephy from './components/AboutIsopsephy';
import RandomDiscovery from './components/RandomDiscovery';

export type Tab = 'calculator' | 'compare' | 'discover' | 'curious' | 'examples' | 'about';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [selectedWord, setSelectedWord] = useState<string>('ΘΕΟΣ');

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
          <DiscoverByNumber onSelectWord={handleSelectWord} />
        )}
        {activeTab === 'curious' && (
          <RandomDiscovery onSelectWord={handleSelectWord} />
        )}
        {activeTab === 'examples' && (
          <FamousExamples onSelectWord={handleSelectWord} />
        )}
        {activeTab === 'about' && (
          <AboutIsopsephy />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
