import { Compass, HelpCircle } from 'lucide-react';

interface Props {
  value: number;
  digitalRoot: number;
}

// Symbolic archetypes for digital roots in Pythagorean and modern traditions
const ROOT_DESCRIPTIONS: Record<number, { archetype: string; meaning: string }> = {
  1: { archetype: 'The Monad / Unity', meaning: 'In Pythagorean tradition, the Monad represents the unmanifest origin, wholeness, the first principle, and indivisible divine unity.' },
  2: { archetype: 'The Dyad / Polarity', meaning: 'Associated with duality, receptive reflection, balance of opposites, partnership, and the first departure from unity toward diversity.' },
  3: { archetype: 'The Triad / Synthesis', meaning: 'Considered the first true number with a beginning, middle, and end. Associated with completion, harmony, triadic divine orders, and equilibrium.' },
  4: { archetype: 'The Tetrad / Foundation', meaning: 'The foundation of the physical cosmos (four classical elements, four seasons, four compass directions). Symbol of justice, solidity, and the Tetractys.' },
  5: { archetype: 'The Pentad / Life & Nature', meaning: 'Combining the first odd (3) and even (2) numbers, historically associated with organic life, quintessence, health, and marriage.' },
  6: { archetype: 'The Hexad / Perfection', meaning: 'The first perfect number (1 + 2 + 3 = 6 = 1 × 2 × 3). Associated with cosmic balance, harmonious generation, and structural integrity.' },
  7: { archetype: 'The Heptad / The Sacred Virgin', meaning: 'Called "Athena" by Pythagoreans because it neither generates nor is generated within the decad (1–10). Linked to celestial cycles, wisdom, and rest.' },
  8: { archetype: 'The Ogdoad / Renewal', meaning: 'Associated with musical octaves, harmonic resonance, higher spiritual orders, and in early Christian symbolism, the day of resurrection.' },
  9: { archetype: 'The Ennead / Horizon & Horizon of Completion', meaning: 'The highest unit digit before the return to ten. Associated with culmination, boundaries of terrestrial experience, and universal compassion.' }
};

export default function SymbolicInterpretation({ value, digitalRoot }: Props) {
  const rootInfo = ROOT_DESCRIPTIONS[digitalRoot] || {
    archetype: 'Numerical Essence',
    meaning: 'Reduced through iterative digit summation.'
  };

  return (
    <div className="border border-stone-200 dark:border-stone-800 rounded-2xl p-6 bg-stone-50/50 dark:bg-stone-900/40 relative overflow-hidden">
      {/* Visual distinctive accent banner */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center space-x-2">
          <Compass size={18} className="text-stone-500 dark:text-stone-400" />
          <h3 className="font-serif font-bold text-stone-800 dark:text-stone-200">
            Symbolic & Numerological Reflections
          </h3>
        </div>
        <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
          Interpretive Study
        </span>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-white dark:bg-stone-900/80 rounded-xl border border-stone-200/70 dark:border-stone-800">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span>Digital Root Vibration</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">Root {digitalRoot}</span>
          </div>
          <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            {rootInfo.archetype}
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
            {rootInfo.meaning}
          </p>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed italic">
          "In modern esoteric or philosophical traditions, the calculated value of <strong className="font-mono not-italic text-stone-900 dark:text-stone-100">{value}</strong> (reducing to <span className="font-mono font-bold not-italic">{digitalRoot}</span>) is often contemplated through the lens of harmonic resonance or qualitative number symbolism."
        </p>

        {/* Mandatory prominent academic disclaimer tag */}
        <div className="pt-2 flex items-center space-x-2 text-[11px] text-stone-500 dark:text-stone-400 border-t border-stone-200/60 dark:border-stone-800/80">
          <HelpCircle size={14} className="shrink-0 text-stone-400 dark:text-stone-500" />
          <span>
            <strong>Modern symbolic interpretation — not scientific evidence.</strong> This reflection is presented for cultural and historical study.
          </span>
        </div>
      </div>
    </div>
  );
}
