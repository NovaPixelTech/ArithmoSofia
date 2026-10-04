const LETTER_VALUES: Record<string, number> = {
  'α': 1, 'β': 2, 'γ': 3, 'δ': 4, 'ε': 5, 'ϛ': 6, 'ζ': 7, 'η': 8, 'θ': 9,
  'ι': 10, 'κ': 20, 'λ': 30, 'μ': 40, 'ν': 50, 'ξ': 60, 'ο': 70, 'π': 80, 'ϟ': 90,
  'ρ': 100, 'σ': 200, 'ς': 200, 'τ': 300, 'υ': 400, 'φ': 500, 'χ': 600, 'ψ': 700, 'ω': 800,
};

export function normalizeGreek(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove combining diacritical marks
    .replace(/[\u0370-\u0373\u0375-\u037d\u037f-\u0383\u0385\u0387\u038b\u038d\u03a2]/g, ''); // remove other Greek punctuation
}

export interface LetterValue {
  letter: string;
  normalized: string;
  value: number;
}

export interface WordValue {
  word: string;
  letters: LetterValue[];
  total: number;
}

export interface CalculationResult {
  input: string;
  letters: LetterValue[];
  total: number;
  digitalRoot: number;
  words: WordValue[];
}

export function calculate(input: string): CalculationResult {
  const words = input.split(/\s+/).filter(w => w.length > 0);
  const resultWords: WordValue[] = [];
  let grandTotal = 0;
  const allLetters: LetterValue[] = [];

  for (const word of words) {
    const letters: LetterValue[] = [];
    let wordTotal = 0;
    
    // We iterate over the un-normalized string to keep original chars,
    // but we have to map each to normalized to get value.
    // Actually, it's easier to iterate char by char.
    for (const char of word) {
      const normalized = normalizeGreek(char);
      if (LETTER_VALUES[normalized]) {
        const val = LETTER_VALUES[normalized];
        const lv = { letter: char, normalized, value: val };
        letters.push(lv);
        allLetters.push(lv);
        wordTotal += val;
      }
    }
    
    if (letters.length > 0) {
      resultWords.push({ word, letters, total: wordTotal });
      grandTotal += wordTotal;
    }
  }

  return {
    input,
    letters: allLetters,
    total: grandTotal,
    digitalRoot: getDigitalRoot(grandTotal),
    words: resultWords
  };
}

export function getDigitalRoot(n: number): number {
  if (n === 0) return 0;
  return 1 + ((n - 1) % 9);
}

export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function getFactors(n: number): number[] {
  const factors: number[] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) {
        factors.push(n / i);
      }
    }
  }
  return factors.sort((a, b) => a - b);
}

export interface NumberProperties {
  isPrime: boolean;
  factors: number[];
  digitalRoot: number;
}

export function getNumberProperties(n: number): NumberProperties {
  return {
    isPrime: isPrime(n),
    factors: getFactors(n),
    digitalRoot: getDigitalRoot(n)
  };
}
