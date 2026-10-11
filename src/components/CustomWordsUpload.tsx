import { useRef, useState } from 'react';
import type { GreekWord } from '../data/greekWords';
import { parseWordsFromCsvText } from '../utils/csvImport';
import { Amphora } from './GreekArt';

interface CustomWordsUploadProps {
  onWordsAdded: (words: GreekWord[]) => void;
}

export default function CustomWordsUpload({ onWordsAdded }: CustomWordsUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [addedCount, setAddedCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const words = parseWordsFromCsvText(text);
      onWordsAdded(words);
      setAddedCount(words.length);
    };
    reader.readAsText(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    // Reset first so re-picking the same file fires change again.
    e.target.value = '';
    if (!selected) return;
    processFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col sm:flex-row sm:items-center justify-center gap-3 rounded-2xl border border-dashed p-4 transition-colors ${
        isDragging
          ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30'
          : 'border-stone-300 dark:border-stone-700'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.csv,text/csv,text/plain"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-sm font-medium"
      >
        <Amphora className="w-4 h-4 text-amber-700 dark:text-amber-500" />
        Upload Greek Word List
      </button>
      <p className="text-xs text-stone-500 dark:text-stone-400 text-center sm:text-left">
        {fileName
          ? `Selected: ${fileName}${addedCount > 0 ? ` — ${addedCount} words processed` : ''}`
          : 'Drop a shared CSV here, or pick a file / plain text list (one Greek word per line).'}
      </p>
    </div>
  );
}
