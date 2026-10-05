import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import AppIcon from './AppIcon';
import MusicToggle from './MusicToggle';
import { LaurelBranch, MeanderBand } from './GreekArt';

export default function Header() {
  const { isDark, toggle } = useDarkMode();

  return (
    <header className="py-6 px-4 md:px-8 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 sticky top-0 z-10 transition-colors">
      <LaurelBranch className="w-full max-w-5xl mx-auto h-5 text-amber-700/50 dark:text-amber-500/40 mb-1" />
      <div className="container mx-auto max-w-5xl">
        <MeanderBand className="opacity-50 text-amber-800 dark:text-amber-600" />
      </div>
      <div className="container mx-auto flex justify-between items-center max-w-5xl gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <AppIcon size={44} className="shrink-0 drop-shadow-sm" />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-tight">
              Hellenic <span className="text-amber-600 dark:text-amber-400">ArithmoSofia</span> Explorer
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 hidden md:block">
              Greek Word Numerology &amp; ArithmoSofia Calculator
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <MusicToggle />
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-300"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}