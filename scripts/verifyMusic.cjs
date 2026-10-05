/**
 * Offline sanity check for the Greek music scheduler grid.
 * Verifies every motif step lands on the loop grid and that pitches are finite.
 */
const MODES = {
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
};
const STEPS_PER_BAR = 16;
const STEPS_PER_MOTIF = STEPS_PER_BAR * 2;

const src = require('node:fs').readFileSync(
  require('node:path').join(__dirname, '../src/audio/greekMusic.ts'),
  'utf8',
);

const extractMotifs = () => {
  const start = src.indexOf('const MOTIFS: Motif[] = [');
  const end = src.indexOf('\n];', start);
  const body = src.slice(start, end + 3);
  // Convert the typed literal into evaluatable JS.
  const js = body
    .replace('const MOTIFS: Motif[] =', 'module.exports =')
    .replace(/\/\/[^\n]*/g, '');
  const module = { exports: [] };
  new Function('module', js)(module);
  return module.exports;
};

const motifs = extractMotifs();
let failures = 0;
const assert = (cond, msg) => {
  if (!cond) {
    console.error('FAIL:', msg);
    failures++;
  }
};

assert(motifs.length === 4, `expected 4 motifs, got ${motifs.length}`);

const loopLength = motifs.length * STEPS_PER_MOTIF;
const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const degreeToMidi = (steps, root, degree) => {
  const len = steps.length;
  const oct = Math.floor(degree / len);
  const idx = ((degree % len) + len) % len;
  return root + steps[idx] + oct * 12;
};

let melodyCount = 0;
let fired = new Set();

motifs.forEach((motif, mi) => {
  const base = mi * STEPS_PER_MOTIF;
  const steps = MODES[motif.mode];
  assert(!!steps, `unknown mode ${motif.mode}`);

  for (const n of motif.melody) {
    melodyCount++;
    assert(Number.isInteger(n.step), `${motif.mode}: melody step ${n.step} not an integer`);
    assert(n.step >= 0 && n.step < STEPS_PER_MOTIF, `${motif.mode}: melody step ${n.step} out of range`);
    assert(n.len > 0, `${motif.mode}: melody len ${n.len} not positive`);
    const f = midiToFreq(degreeToMidi(steps, motif.root, n.degree));
    assert(Number.isFinite(f) && f > 20 && f < 8000, `${motif.mode}: pitch out of audible range (${f})`);
    fired.add(base + n.step);
  }
  for (const d of motif.drone) {
    assert(Number.isInteger(d.step) && d.step >= 0 && d.step < STEPS_PER_MOTIF, `${motif.mode}: drone step out of range`);
    assert(d.len > 0, `${motif.mode}: drone len not positive`);
  }
  for (const b of motif.bass) {
    assert(Number.isInteger(b.step) && b.step >= 0 && b.step < STEPS_PER_MOTIF, `${motif.mode}: bass step out of range`);
  }
  for (const f of motif.frame) {
    assert(Number.isInteger(f) && f >= 0 && f < STEPS_PER_MOTIF, `${motif.mode}: frame step ${f} out of range`);
  }
  for (const c of motif.clap) {
    assert(Number.isInteger(c) && c >= 0 && c < STEPS_PER_MOTIF, `${motif.mode}: clap step ${c} out of range`);
  }
  // No overlapping melody notes (two notes at the same grid position).
  const seen = new Set();
  for (const n of motif.melody) {
    assert(!seen.has(n.step), `${motif.mode}: duplicate melody step ${n.step}`);
    seen.add(n.step);
  }
});

assert(melodyCount > 20, `expected a substantial melody, got ${melodyCount} notes`);

// Loop arithmetic: every grid position must map back to exactly one motif slot.
for (let s = 0; s < loopLength; s++) {
  const motif = motifs[Math.floor(s / STEPS_PER_MOTIF)];
  const local = s % STEPS_PER_MOTIF;
  assert(!!motif, `step ${s}: no motif`);
  assert(local >= 0 && local < STEPS_PER_MOTIF, `step ${s}: local ${local} out of range`);
}

console.log(`motifs=${motifs.length} loopSteps=${loopLength} melodyNotes=${melodyCount} distinctFiringSteps=${fired.size}`);
console.log(failures === 0 ? 'All music scheduler checks passed.' : `${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);