import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, AlertCircle } from 'lucide-react';

export default function HistoricalContext() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-lg">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              Historical Context & Scholarship
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Understanding ancient Greek isopsephy vs. modern numerology
            </p>
          </div>
        </div>
        <div className="text-stone-400 dark:text-stone-500">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed animate-in fade-in duration-300">
          <div>
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
              What is Greek Isopsephy?
            </h4>
            <p>
              The word <em>isopsephy</em> comes from the Greek ἴσος (<em>isos</em>, "equal") and ψῆφος (<em>psephos</em>, "pebble" or "voting counter"). In antiquity, counting and calculating were done using pebbles on an abacus or board. Isopsephy refers to words or phrases having an equal pebble-count (numerical sum).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
              Letters as Numbers
            </h4>
            <p>
              Ancient Greek had no separate digit symbols like modern Arabic numerals (0–9). The Greek alphabet itself served as the numeral system (Milesian or alphabetic numerals), with 27 letters representing units (1–9), tens (10–90), and hundreds (100–800). Consequently, any written word inherently possessed a calculated sum.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
              Historical Usage: Graffiti, Literature & Religion
            </h4>
            <p>
              Isopsephy was used for playful riddles, competitive literary composition, and religious mysticism. Famous examples survive in Pompeian graffiti (e.g., <em>"I love her whose number is 545"</em>) and Roman political satire recorded by Suetonius regarding Nero. In early Christian theology, church fathers noted that <em>ΙΗΣΟΥΣ</em> (Jesus) totals 888 and evaluated symbolic connections between scriptural phrases.
            </p>
          </div>

          <div className="p-4 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-300">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <strong>Scholarly Caution:</strong> Numerical equivalence between two Greek words is a purely mathematical property of the alphabetic numeral system. It does not by itself prove a semantic, historical, or philosophical relationship between the words.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
