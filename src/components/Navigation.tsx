import { Tab } from '../App';
import { Calculator, ArrowLeftRight, Search, BookOpen, Dices } from 'lucide-react';
import { OwlOfAthena } from './GreekArt';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Navigation({ activeTab, onTabChange }: Props) {
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'calculator', label: 'Calculator', icon: <Calculator size={18} /> },
    { id: 'compare', label: 'Compare', icon: <ArrowLeftRight size={18} /> },
    { id: 'discover', label: 'Discover', icon: <Search size={18} /> },
    { id: 'curious', label: 'Curious', icon: <Dices size={18} /> },
    { id: 'examples', label: 'Famous Examples', icon: <BookOpen size={18} /> },
    { id: 'about', label: 'About', icon: <OwlOfAthena className="w-[18px] h-[18px]" /> },
  ];

  return (
    <>
      {/* Desktop Navigation (Top Bar) */}
      <nav className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 sticky top-[73px] md:top-[85px] z-20 transition-colors hidden md:block">
        <div className="container mx-auto max-w-5xl flex px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center space-x-2 px-5 py-4 border-b-2 font-medium text-sm transition-all focus:outline-none ${
                activeTab === item.id
                  ? 'border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-400 font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation (Bottom Fixed Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 z-50 flex justify-around items-center px-1 py-1.5 shadow-lg safe-area-bottom">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] rounded-xl text-[10px] transition-colors focus:outline-none ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-amber-100/70 dark:bg-amber-950/60' : ''}`}>
                {item.icon}
              </div>
              <span className="mt-0.5 tracking-tight truncate max-w-[55px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
