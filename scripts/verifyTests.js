import { GREEK_WORDS } from '../src/data/greekWords.ts';
import { calculate, normalizeGreek, getDigitalRoot, isPrime, getFactors } from '../src/utils/isopsephy.ts';

console.log('=== RUNNING HELLENIC ISOPSEPHY EXPLORER VERIFICATION SUITE ===\n');

let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Core historical test cases from Section 26
assert(calculate('ΘΕΟΣ').total === 284, 'ΘΕΟΣ -> 284');
assert(calculate('ΑΓΙΟΣ').total === 284, 'ΑΓΙΟΣ -> 284');
assert(calculate('ΑΓΑΘΟΣ').total === 284, 'ΑΓΑΘΟΣ -> 284');
assert(calculate('ΝΟΥΣ').total === 720, 'ΝΟΥΣ -> 720');
assert(calculate('ΤΟΠΟΣ').total === 720, 'ΤΟΠΟΣ -> 720');
assert(calculate('ΣΟΦΙΑ').total === 781, 'ΣΟΦΙΑ -> 781');
assert(calculate('ΙΗΣΟΥΣ').total === 888, 'ΙΗΣΟΥΣ -> 888');

// 2. Case and accent normalization (tonos, polytonic diacritics)
assert(calculate('θεος').total === 284, 'lowercase θεος -> 284');
assert(calculate('Θεός').total === 284, 'accented Θεός -> 284');
assert(calculate('ΘΕΌΣ').total === 284, 'uppercase accented ΘΕΌΣ -> 284');
assert(calculate('Ἅγιος').total === 284, 'polytonic Ἅγιος -> 284');
assert(calculate('ἀγαθός').total === 284, 'polytonic ἀγαθός -> 284');

// 3. Sigma vs Final Sigma (σ and ς must both = 200)
assert(calculate('σ').total === 200, 'standard sigma σ -> 200');
assert(calculate('ς').total === 200, 'final sigma ς -> 200');
assert(calculate('Σ').total === 200, 'capital sigma Σ -> 200');

// 4. Phrases and punctuation
const phraseRes = calculate('Ο ΛΟΓΟΣ');
assert(phraseRes.total === 373 + 70, 'Phrase "Ο ΛΟΓΟΣ" total = 443 (70 + 373)');
assert(phraseRes.words.length === 2, 'Phrase has 2 words');
assert(phraseRes.words[0].total === 70, 'Word 1 "Ο" = 70');
assert(phraseRes.words[1].total === 373, 'Word 2 "ΛΟΓΟΣ" = 373');

const punctRes = calculate('ΓΝΩΘΙ, ΣΕΑΥΤΟΝ!');
assert(punctRes.words.length === 2, 'Punctuation ignored in phrase');
assert(punctRes.total === calculate('ΓΝΩΘΙ').total + calculate('ΣΕΑΥΤΟΝ').total, 'Punctuation does not distort letter values');

// 5. Digital roots
assert(getDigitalRoot(284) === 5, 'Digital root of 284 is 5 (2+8+4=14 -> 1+4=5)');
assert(getDigitalRoot(888) === 6, 'Digital root of 888 is 6 (8+8+8=24 -> 2+4=6)');
assert(getDigitalRoot(720) === 9, 'Digital root of 720 is 9 (7+2+0=9)');

// 6. Number properties
assert(isPrime(7) === true, '7 is prime');
assert(isPrime(284) === false, '284 is composite');
assert(getFactors(284).includes(142), '142 is factor of 284');

// 7. Non-Greek and empty inputs
assert(calculate('').total === 0, 'Empty input returns 0');
assert(calculate('   ').total === 0, 'Whitespace returns 0');
assert(calculate('Hello 123!').total === 0, 'Latin and digits return 0 (no Greek letters)');

// 8. Dataset internal consistency: Every single word in GREEK_WORDS must match calculate(w.word).total
let datasetMismatches = 0;
for (const entry of GREEK_WORDS) {
  const calculated = calculate(entry.word).total;
  if (calculated !== entry.value) {
    console.error(`Mismatch for ${entry.word}: stored ${entry.value}, calculated ${calculated}`);
    datasetMismatches++;
  }
}
assert(datasetMismatches === 0, `All ${GREEK_WORDS.length} words in GREEK_WORDS match their calculated value!`);

console.log(`\nVerification complete: ${failed === 0 ? 'ALL CHECKS PASSED 🎉' : `${failed} CHECKS FAILED 🚨`}`);
if (failed > 0) process.exit(1);
