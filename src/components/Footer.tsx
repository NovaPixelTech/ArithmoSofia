export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-zinc-900 text-stone-600 dark:text-stone-400 text-sm text-center transition-colors">
      <div className="container mx-auto max-w-4xl space-y-4">
        <p>
          Greek isopsephy is a historical system of assigning numerical values to Greek letters. Numerical equivalence between words is a mathematical observation. Symbolic or numerological interpretations are presented as interpretations, not as scientific evidence.
        </p>
        <p>&copy; {new Date().getFullYear()} Hellenic Isopsephy Explorer</p>
      </div>
    </footer>
  );
}
