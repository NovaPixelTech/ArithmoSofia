import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Header() {
  const { isDark, toggle } = useDarkMode();

  return (
    <header className="py-6 px-4 md:px-8 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 sticky top-0 z-10 transition-colors">
      <div className="container mx-auto flex justify-between items-center max-w-5xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Hellenic <span className="text-amber-600 dark:text-amber-400">Isopsephy</span> Explorer
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 hidden md:block">
            Greek Word Numerology & Isopsephy Calculator
          </p>
        </div>
        <button
          onClick={toggle}
          className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-300"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </header>
  );
}
