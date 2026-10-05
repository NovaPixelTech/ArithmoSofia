import { Volume2, VolumeX } from 'lucide-react';
import { useGreekMusic } from '../hooks/useGreekMusic';

export default function MusicToggle() {
  const { enabled, volume, toggle, setVolume } = useGreekMusic();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? 'Mute ancient Greek music' : 'Play ancient Greek music'}
        title={enabled ? 'Mute ancient Greek music' : 'Play ancient Greek music'}
        className={`p-2 rounded-full transition-colors ${
          enabled
            ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            : 'text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
        }`}
      >
        {enabled ? (
          <Volume2 size={20} className={enabled ? 'animate-pulse' : ''} />
        ) : (
          <VolumeX size={20} />
        )}
      </button>

      {enabled && (
        <div className="hidden sm:flex items-center">
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Music volume"
            className="w-20 h-1 accent-amber-600 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}