import { useEffect, useState } from 'react';
import {
  MusicPreferences,
  getPreferences,
  setMusicEnabled,
  setMusicVolume,
  subscribe,
} from '../audio/greekMusic';

export function useGreekMusic() {
  const [prefs, setPrefs] = useState<MusicPreferences>(getPreferences);

  useEffect(() => subscribe(setPrefs), []);

  return {
    ...prefs,
    toggle: () => setMusicEnabled(!prefs.enabled),
    setVolume,
  };
}

function setVolume(volume: number) {
  setMusicVolume(volume);
}

export default useGreekMusic;