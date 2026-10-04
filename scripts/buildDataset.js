import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard Greek numerical values
const LETTER_VALUES = {
  'α': 1, 'β': 2, 'γ': 3, 'δ': 4, 'ε': 5, 'ϛ': 6, 'ζ': 7, 'η': 8, 'θ': 9,
  'ι': 10, 'κ': 20, 'λ': 30, 'μ': 40, 'ν': 50, 'ξ': 60, 'ο': 70, 'π': 80, 'ϟ': 90,
  'ρ': 100, 'σ': 200, 'ς': 200, 'τ': 300, 'υ': 400, 'φ': 500, 'χ': 600, 'ψ': 700, 'ω': 800
};

function normalizeGreek(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0370-\u0373\u0375-\u037d\u037f-\u0383\u0385\u0387\u038b\u038d\u03a2]/g, '');
}

function calc(word) {
  const norm = normalizeGreek(word);
  let total = 0;
  for (const ch of norm) {
    if (LETTER_VALUES[ch]) {
      total += LETTER_VALUES[ch];
    }
  }
  return total;
}

// Comprehensive database of Classical, Biblical, Hellenistic, and Philosophical Greek words
// Format: [Word, Transliteration, Meaning, Category, InterpretationType, HistoricalSource, Notes]
const RAW_DATABASE = [
  // ── Core Historical Equivalences ──
  ['ΘΕΟΣ', 'Theos', 'God, Deity', 'theological', 'historical', 'Classical & Biblical Greek', 'Calculates to 284; famous equivalence with Αγιος and Αγαθος'],
  ['ΑΓΙΟΣ', 'Hagios', 'Holy, Sacred', 'theological', 'historical', 'Septuagint & New Testament', 'Shares the exact isopsephic value 284 with Θεός and Αγαθός'],
  ['ΑΓΑΘΟΣ', 'Agathos', 'Good, Noble', 'virtue', 'historical', 'Plato & Aristotle', 'Shares the value 284 with Θεός (God) and Αγιος (Holy)'],
  ['ΝΟΥΣ', 'Nous', 'Mind, Intellect, Cosmic Reason', 'philosophical', 'historical', 'Anaxagoras & Neoplatonism', 'Evaluates to 720; identical value to Τόπος (Place)'],
  ['ΤΟΠΟΣ', 'Topos', 'Place, Space, Topic', 'concept', 'historical', 'Aristotle, Physics', 'Evaluates to 720; famous classical isopsephic counterpart to Νους'],
  ['ΣΟΦΙΑ', 'Sophia', 'Wisdom, Divine Understanding', 'virtue', 'historical', 'Proverbs & Hellenistic philosophy', 'Value 781; central concept in Hellenic thought'],
  ['ΙΗΣΟΥΣ', 'Iesous', 'Jesus', 'theological', 'historical', 'Early Christian Sibylline Oracles', 'Value 888 (10+8+200+70+400+200); widely noted in patristic literature'],
  ['ΛΟΓΟΣ', 'Logos', 'Word, Reason, Principle', 'philosophical', 'historical', 'Heraclitus, Stoicism, Gospel of John', 'Value 373; pivotal term bridging Greek philosophy and theology'],
  ['ΑΓΑΠΗ', 'Agape', 'Selfless Love, Charity', 'virtue', 'historical', 'Greek philosophy & New Testament', 'Value 93; highest form of love'],
  ['ΦΩΣ', 'Phos', 'Light, Illumination', 'nature', 'historical', 'Homer, Parmenides & Bible', 'Value 1500 (500+800+200)'],
  ['ΚΟΣΜΟΣ', 'Kosmos', 'Order, Harmony, Universe', 'cosmological', 'historical', 'Pythagoreans & Presocratics', 'Value 600; world conceived as an ordered harmonious system'],
  ['ΨΥΧΗ', 'Psyche', 'Soul, Breath of Life', 'philosophical', 'historical', 'Plato, Phaedo', 'Value 1708 (700+400+600+8)'],
  ['ΑΛΗΘΕΙΑ', 'Aletheia', 'Truth, Unconcealment', 'philosophical', 'historical', 'Parmenides & Heidegger studies', 'Value 64; literally "un-forgetting" or "un-hiddenness"'],
  ['ΕΙΡΗΝΗ', 'Eirene', 'Peace, Concord', 'virtue', 'historical', 'Classical drama & theology', 'Value 181; goddess of peace and state of harmony'],
  ['ΧΑΡΑ', 'Chara', 'Joy, Delight', 'emotion', 'mathematical', null, 'Value 702'],
  ['ΑΡΕΤΗ', 'Arete', 'Excellence, Moral Virtue', 'virtue', 'historical', 'Homeric & Classical ethics', 'Value 414; fulfillment of potential'],
  ['ΔΙΚΑΙΟΣ', 'Dikaios', 'Just, Righteous', 'virtue', 'mathematical', null, 'Value 315'],
  ['ΚΑΛΟΣ', 'Kalos', 'Beautiful, Noble, Fair', 'virtue', 'mathematical', null, 'Value 321'],
  ['ΑΓΓΕΛΟΣ', 'Angelos', 'Messenger, Envoy, Angel', 'theological', 'historical', 'Homer & Septuagint', 'Value 312'],
  ['ΚΥΡΙΟΣ', 'Kyrios', 'Lord, Sovereign, Master', 'theological', 'historical', 'Septuagint & New Testament', 'Value 800'],
  ['ΧΡΙΣΤΟΣ', 'Christos', 'Anointed One, Christ', 'theological', 'historical', 'Septuagint & Christian tradition', 'Value 1480 (600+100+10+200+300+70+200)'],
  ['ΠΝΕΥΜΑ', 'Pneuma', 'Spirit, Wind, Divine Breath', 'theological', 'historical', 'Stoicism & Gospel tradition', 'Value 576'],
  ['ΦΙΛΙΑ', 'Philia', 'Affectionate Friendship', 'virtue', 'historical', 'Aristotle, Nicomachean Ethics', 'Value 551'],
  ['ΖΩΗ', 'Zoe', 'Life (vital, spiritual)', 'concept', 'historical', 'Plato & John', 'Value 815'],
  ['ΒΙΟΣ', 'Bios', 'Life (biological, mortal course)', 'concept', 'mathematical', null, 'Value 282'],
  ['ΑΝΘΡΩΠΟΣ', 'Anthropos', 'Human Being, Mortal', 'concept', 'historical', 'Classical anthropology', 'Value 1310'],
  ['ΠΟΛΙΣ', 'Polis', 'City-State, Citizen Body', 'concept', 'historical', 'Greek political theory', 'Value 390'],

  // ── Famous Delphic & Ancient Maxims ──
  ['ΓΝΩΘΙ', 'Gnothi', 'Know (imperative)', 'philosophical', 'historical', 'Delphic inscription', 'Part of Γνῶθι Σεαυτόν (Know Thyself)'],
  ['ΣΕΑΥΤΟΝ', 'Seauton', 'Thyself, Yourself', 'philosophical', 'historical', 'Delphic inscription', 'Part of Γνῶθι Σεαυτόν'],
  ['ΜΗΔΕΝ', 'Meden', 'Nothing, Not one thing', 'philosophical', 'historical', 'Delphic inscription', 'Part of Μηδὲν Ἄγαν (Nothing in Excess)'],
  ['ΑΓΑΝ', 'Agan', 'Excess, Too much', 'philosophical', 'historical', 'Delphic inscription', 'Part of Μηδὲν Ἄγαν'],

  // ── Pre-Socratics, Philosophy & Cosmos ──
  ['ΑΡΧΗ', 'Arche', 'Origin, First Principle, Sovereign Power', 'philosophical', 'historical', 'Milesian School (Thales, Anaximander)', 'Value 709'],
  ['ΤΕΛΟΣ', 'Telos', 'End, Ultimate Purpose, Goal', 'philosophical', 'historical', 'Aristotelian Teleology', 'Value 605'],
  ['ΟΥΣΙΑ', 'Ousia', 'Substance, Being, Essence', 'philosophical', 'historical', 'Aristotle, Metaphysics', 'Value 681'],
  ['ΥΛΗ', 'Hyle', 'Matter, Raw Material, Wood', 'philosophical', 'historical', 'Aristotle hylomorphism', 'Value 438'],
  ['ΜΟΡΦΗ', 'Morphe', 'Shape, Outward Form', 'philosophical', 'historical', 'Aristotle hylomorphism', 'Value 728'],
  ['ΦΥΣΙΣ', 'Physis', 'Nature, Natural Growth', 'nature', 'historical', 'Presocratics & Physics', 'Value 1110'],
  ['ΙΔΕΑ', 'Idea', 'Platonic Idea, Archetypal Form', 'philosophical', 'historical', 'Plato, Theory of Forms', 'Value 25'],
  ['ΕΙΔΟΣ', 'Eidos', 'Visible Form, Essence, Species', 'philosophical', 'historical', 'Plato & Aristotle', 'Value 289'],
  ['ΔΥΝΑΜΙΣ', 'Dynamis', 'Power, Potentiality, Ability', 'philosophical', 'historical', 'Aristotle act/potency', 'Value 705'],
  ['ΕΝΕΡΓΕΙΑ', 'Energeia', 'Actuality, Radiant Energy, Work', 'philosophical', 'historical', 'Aristotle', 'Value 174'],
  ['ΕΝΤΕΛΕΧΕΙΑ', 'Entelecheia', 'Entelechy, Realization of Form', 'philosophical', 'historical', 'Aristotle', 'Value 1056'],
  ['ΑΠΕΙΡΟΝ', 'Apeiron', 'The Boundless, The Infinite', 'philosophical', 'historical', 'Anaximander', 'Value 316'],
  ['ΑΤΟΜΟΝ', 'Atomon', 'Indivisible, Atom', 'philosophical', 'historical', 'Democritus & Leucippus', 'Value 461'],
  ['ΚΕΝΟΝ', 'Kenon', 'The Void, Vacuum', 'philosophical', 'historical', 'Atomism', 'Value 195'],
  ['ΠΥΡ', 'Pyr', 'Fire (Primordial Element)', 'nature', 'historical', 'Heraclitus', 'Value 580'],
  ['ΥΔΩΡ', 'Hydor', 'Water (Primordial Element)', 'nature', 'historical', 'Thales of Miletus', 'Value 1304'],
  ['ΑΗΡ', 'Aer', 'Air, Mist, Atmosphere', 'nature', 'historical', 'Anaximenes', 'Value 109'],
  ['ΓΗ', 'Ge', 'Earth, Soil, Land', 'nature', 'historical', 'Elemental theory', 'Value 11'],
  ['ΑΙΘΗΡ', 'Aither', 'Aether, Quintessence, Pure Upper Air', 'cosmological', 'historical', 'Fifth element in cosmology', 'Value 128'],
  ['ΟΛΟΝ', 'Holon', 'The Whole, Entirety', 'philosophical', 'historical', 'Aristotle', 'Value 190'],
  ['ΜΕΡΟΣ', 'Meros', 'Part, Share, Portion', 'philosophical', 'mathematical', null, 'Value 345'],
  ['ΣΥΜΠΑΝ', 'Sympan', 'The Universe, The Cosmos, All-inclusive', 'cosmological', 'mathematical', null, 'Value 771'],
  ['ΕΠΟΧΗ', 'Epoche', 'Suspension of Judgment', 'philosophical', 'historical', 'Pyrrhonian Skepticism', 'Value 153'],
  ['ΑΤΑΡΑΞΙΑ', 'Ataraxia', 'Untroubled Mind, Tranquility', 'philosophical', 'historical', 'Epicureanism & Pyrrhonism', 'Value 1013'],
  ['ΑΠΑΘΕΙΑ', 'Apatheia', 'Freedom from Destructive Passion', 'philosophical', 'historical', 'Stoicism', 'Value 108'],
  ['ΕΥΔΑΙΜΟΝΙΑ', 'Eudaimonia', 'Flourishing, Blessed Happiness', 'philosophical', 'historical', 'Aristotelian Ethics', 'Value 626'],
  ['ΦΡΟΝΗΣΙΣ', 'Phronesis', 'Prudence, Practical Wisdom', 'philosophical', 'historical', 'Aristotle', 'Value 1098'],
  ['ΓΝΩΣΙΣ', 'Gnosis', 'Esoteric Knowledge, Insight', 'philosophical', 'historical', 'Gnosticism & Hellenism', 'Value 1263'],
  ['ΕΠΙΣΤΗΜΗ', 'Episteme', 'Rigorous Scientific Knowledge', 'philosophical', 'historical', 'Plato, Theaetetus', 'Value 653'],
  ['ΤΕΧΝΗ', 'Techne', 'Art, Craftsmanship, Technical Skill', 'philosophical', 'historical', 'Greek philosophy', 'Value 963'],
  ['ΜΙΜΗΣΙΣ', 'Mimesis', 'Imitation, Artistic Representation', 'philosophical', 'historical', 'Plato & Aristotle Poetics', 'Value 518'],
  ['ΠΟΙΗΣΙΣ', 'Poiesis', 'Creation, Production, Poetry', 'philosophical', 'historical', 'Aristotle', 'Value 478'],
  ['ΠΡΑΞΙΣ', 'Praxis', 'Action, Practical Execution', 'philosophical', 'historical', 'Aristotle Ethics', 'Value 471'],
  ['ΘΕΩΡΙΑ', 'Theoria', 'Contemplation, Speculative Vision', 'philosophical', 'historical', 'Aristotle Metaphysics', 'Value 925'],
  ['ΔΙΑΛΟΓΟΣ', 'Dialogos', 'Philosophical Discourse, Conversation', 'philosophical', 'historical', 'Platonic dialogues', 'Value 418'],
  ['ΣΥΛΛΟΓΙΣΜΟΣ', 'Syllogismos', 'Syllogism, Logical Deduction', 'philosophical', 'historical', 'Aristotle, Prior Analytics', 'Value 1063'],
  ['ΑΠΟΔΕΙΞΙΣ', 'Apodeixis', 'Rigorous Proof, Demonstration', 'philosophical', 'historical', 'Euclid & Aristotle', 'Value 470'],
  ['ΑΝΑΛΟΓΙΑ', 'Analogia', 'Proportion, Mathematical Analogy', 'philosophical', 'historical', 'Pythagoreans', 'Value 136'],
  ['ΠΑΡΑΔΕΙΓΜΑ', 'Paradeigma', 'Model, Paradigm, Pattern', 'philosophical', 'historical', 'Plato, Timaeus', 'Value 246'],
  ['ΣΚΕΨΙΣ', 'Skepsis', 'Examination, Philosophical Doubt', 'philosophical', 'historical', 'Skeptic school', 'Value 505'],
  ['ΔΙΑΛΕΚΤΙΚΗ', 'Dialektike', 'Dialectic, Art of Debate', 'philosophical', 'historical', 'Socrates & Plato', 'Value 429'],
  ['ΡΗΤΟΡΙΚΗ', 'Rhetorike', 'Rhetoric, Art of Persuasion', 'philosophical', 'historical', 'Aristotle', 'Value 506'],
  ['ΛΟΓΙΚΗ', 'Logike', 'Logic, Rational Science', 'philosophical', 'historical', 'Stoics & Peripatetics', 'Value 188'],
  ['ΗΘΙΚΗ', 'Ethike', 'Ethics, Moral Science', 'philosophical', 'historical', 'Aristotle', 'Value 116'],
  ['ΠΟΛΙΤΙΚΗ', 'Politike', 'Politics, Science of the City', 'philosophical', 'historical', 'Plato & Aristotle', 'Value 538'],
  ['ΦΙΛΟΣΟΦΙΑ', 'Philosophia', 'Philosophy, Love of Wisdom', 'philosophical', 'historical', 'Coined by Pythagoras', 'Value 1011'],
  ['ΜΑΘΗΜΑΤΙΚΑ', 'Mathematika', 'Mathematics, Things Learned', 'philosophical', 'historical', 'Pythagoreans', 'Value 421'],
  ['ΑΣΤΡΟΝΟΜΙΑ', 'Astronomia', 'Astronomy, Law of the Stars', 'cosmological', 'historical', 'Hellenistic science', 'Value 1202'],
  ['ΜΟΥΣΙΚΗ', 'Mousike', 'Music, Art of the Muses', 'concept', 'historical', 'Pythagorean harmonics', 'Value 738'],
  ['ΓΕΩΜΕΤΡΙΑ', 'Geometria', 'Geometry, Earth Measurement', 'concept', 'historical', 'Euclid & Pythagoreans', 'Value 532'],
  ['ΑΡΙΘΜΟΣ', 'Arithmos', 'Number, Measure, Count', 'philosophical', 'historical', 'Pythagorean doctrine', 'Value 430'],
  ['ΜΟΝΑΣ', 'Monas', 'The Monad, Indivisible Unity', 'number_word', 'historical', 'Pythagorean theology', 'Value 361'],
  ['ΔΥΑΣ', 'Dyas', 'The Dyad, Principle of Duality', 'number_word', 'historical', 'Pythagorean theology', 'Value 605'],
  ['ΤΡΙΑΣ', 'Trias', 'The Triad, Trinity, Number Three', 'number_word', 'historical', 'Pythagorean & Christian', 'Value 611'],
  ['ΤΕΤΡΑΣ', 'Tetras', 'The Tetrad, Fourfold Division', 'number_word', 'historical', 'Pythagorean theology', 'Value 706'],
  ['ΠΕΝΤΑΣ', 'Pentas', 'The Pentad, Fivefold Harmony', 'number_word', 'historical', 'Pythagorean theology', 'Value 636'],
  ['ΕΞΑΣ', 'Hexas', 'The Hexad, Number Six', 'number_word', 'mathematical', null, 'Value 266'],
  ['ΕΠΤΑΣ', 'Heptas', 'The Heptad, Sacred Seven', 'number_word', 'mathematical', null, 'Value 566'],
  ['ΟΚΤΩΣ', 'Oktos', 'The Ogdoad, Number Eight', 'number_word', 'mathematical', null, 'Value 1390'],
  ['ΕΝΝΕΑΣ', 'Enneas', 'The Ennead, Ninefold Group', 'number_word', 'historical', 'Plotinus, Enneads', 'Value 311'],
  ['ΔΕΚΑΣ', 'Dekas', 'The Decad, All-Encompassing Ten', 'number_word', 'historical', 'Pythagorean Tetraktys peak', 'Value 230'],
  ['ΤΕΤΡΑΚΤΥΣ', 'Tetraktys', 'The Holy Tetractys (1+2+3+4=10)', 'philosophical', 'historical', 'Pythagorean sacred emblem', 'Value 1306'],
  ['ΕΚΑΤΟΝ', 'Hekaton', 'One Hundred', 'number_word', 'mathematical', null, 'Value 446'],
  ['ΧΙΛΙΟΙ', 'Chilioi', 'One Thousand', 'number_word', 'mathematical', null, 'Value 1310'],
  ['ΜΥΡΙΑΣ', 'Myrias', 'Myriad, Ten Thousand', 'number_word', 'mathematical', null, 'Value 751'],

  // ── Theological & Biblical Vocabulary ──
  ['ΠΑΤΗΡ', 'Pater', 'Father, Progenitor', 'theological', 'historical', 'Classical & Biblical', 'Value 489'],
  ['ΥΙΟΣ', 'Huios', 'Son, Offspring', 'theological', 'historical', 'Biblical Greek', 'Value 680'],
  ['ΕΚΚΛΗΣΙΑ', 'Ekklesia', 'Assembly, Gathering, Church', 'theological', 'historical', 'Athenian democracy & Christian church', 'Value 294'],
  ['ΒΑΣΙΛΕΙΑ', 'Basileia', 'Kingdom, Sovereign Rule', 'theological', 'historical', 'Gospel concept "Kingdom of God"', 'Value 250'],
  ['ΠΑΡΑΔΕΙΣΟΣ', 'Paradeisos', 'Paradise, Garden of God', 'theological', 'historical', 'Septuagint Genesis', 'Value 480'],
  ['ΓΕΕΝΝΑ', 'Gehenna', 'Gehenna, Place of Purifying Fire', 'theological', 'historical', 'New Testament', 'Value 67'],
  ['ΑΜΑΡΤΙΑ', 'Hamartia', 'Missing the Mark, Sin, Tragic Flaw', 'theological', 'historical', 'Aristotle Poetics & Paul', 'Value 453'],
  ['ΜΕΤΑΝΟΙΑ', 'Metanoia', 'Transformation of Mind, Repentance', 'theological', 'historical', 'Gospel call to inner change', 'Value 482'],
  ['ΠΙΣΤΙΣ', 'Pistis', 'Faith, Trust, Conviction', 'virtue', 'historical', 'Plato & Paul', 'Value 800; exact isopsephic match to Κύριος (Lord, 800)'],
  ['ΕΛΠΙΣ', 'Elpis', 'Hope, Anticipation', 'virtue', 'historical', 'Hesiod & New Testament', 'Value 325'],
  ['ΧΑΡΙΣ', 'Charis', 'Grace, Elegance, Divine Gift', 'virtue', 'historical', 'Homeric Graces & Christian grace', 'Value 911'],
  ['ΔΟΞΑ', 'Doxa', 'Glory, Splendor, Radiance, Opinion', 'theological', 'historical', 'Septuagint & theology', 'Value 135'],
  ['ΧΑΡΙΣΜΑ', 'Charisma', 'Spiritual Gift, Bestowal', 'theological', 'historical', 'Pauline epistles', 'Value 952'],
  ['ΠΡΟΦΗΤΗΣ', 'Prophetes', 'Prophet, Spokesman of God', 'theological', 'historical', 'Septuagint & Delphi', 'Value 906'],
  ['ΑΠΟΣΤΟΛΟΣ', 'Apostolos', 'Apostle, Emissary Sent Forth', 'theological', 'historical', 'Classical naval envoy & Christian apostle', 'Value 791'],
  ['ΕΥΑΓΓΕΛΙΟΝ', 'Euangelion', 'Gospel, Good News of Deliverance', 'theological', 'historical', 'Imperial proclamation & Gospels', 'Value 542'],
  ['ΘΥΣΙΑ', 'Thysia', 'Sacrificial Offering', 'theological', 'historical', 'Temple worship', 'Value 620'],
  ['ΒΑΠΤΙΣΜΑ', 'Baptisma', 'Immersion, Baptism', 'theological', 'historical', 'New Testament', 'Value 434'],
  ['ΠΑΡΟΥΣΙΑ', 'Parousia', 'Presence, Triumphant Royal Arrival', 'theological', 'historical', 'Hellenistic royal visits & Christian eschatology', 'Value 802'],
  ['ΑΠΟΚΑΛΥΨΙΣ', 'Apokalypsis', 'Unveiling, Revelation of Hidden Mysteries', 'theological', 'historical', 'Book of Revelation', 'Value 1512'],
  ['ΣΩΤΗΡΙΑ', 'Soteria', 'Deliverance, Salvation, Safety', 'theological', 'historical', 'Classical civic cults & theology', 'Value 1319'],
  ['ΣΩΤΗΡ', 'Soter', 'Savior, Deliverer, Guardian', 'theological', 'historical', 'Title of Zeus, Hellenistic kings & Christ', 'Value 1408'],
  ['ΙΕΡΕΥΣ', 'Hiereus', 'Sacred Priest, Celebrant', 'theological', 'historical', 'Greek temples', 'Value 715'],
  ['ΝΑΟΣ', 'Naos', 'Inner Temple Sanctuary, Shrine', 'theological', 'historical', 'Classical architecture', 'Value 321; exact isopsephic match to Καλός (Beautiful, 321)'],
  ['ΑΡΧΑΓΓΕΛΟΣ', 'Archangelos', 'Chief Angel, Archangel', 'theological', 'historical', 'Jewish & Christian angelology', 'Value 794'],
  ['ΣΑΤΑΝΑΣ', 'Satanas', 'Satan, The Adversary', 'theological', 'historical', 'Biblical texts', 'Value 553'],
  ['ΔΙΑΒΟΛΟΣ', 'Diabolos', 'The Accuser, Slanderer, Devil', 'theological', 'historical', 'Septuagint', 'Value 417'],
  ['ΑΒΥΣΣΟΣ', 'Abyssos', 'The Abyss, Bottomless Deep', 'cosmological', 'historical', 'Septuagint Genesis & Revelation', 'Value 873'],
  ['ΜΥΣΤΗΡΙΟΝ', 'Mysterion', 'Sacred Secret, Mystery Rite', 'theological', 'historical', 'Eleusinian Mysteries & Paul', 'Value 1028'],
  ['ΠΑΝΤΟΚΡΑΤΩΡ', 'Pantokrator', 'Ruler of All, Almighty', 'theological', 'historical', 'Septuagint & Byzantine iconography', 'Value 1572'],
  ['ΑΜΗΝ', 'Amen', 'Amen, Truly, So be it', 'theological', 'historical', 'Liturgical affirmation', 'Value 99'],
  ['ΑΛΛΗΛΟΥΙΑ', 'Allelouia', 'Hallelujah, Praise the Lord', 'theological', 'historical', 'Liturgical praise', 'Value 120'],

  // ── Classical Olympian Pantheon & Mythology ──
  ['ΖΕΥΣ', 'Zeus', 'Zeus, Sovereign of Olympus and Thunder', 'myth', 'historical', 'Homer, Hesiod', 'Value 612'],
  ['ΗΡΑ', 'Hera', 'Hera, Queen of Heaven and Marriage', 'myth', 'historical', 'Olympian deity', 'Value 109'],
  ['ΑΡΗΣ', 'Ares', 'Ares, God of Battle and Valour', 'myth', 'historical', 'Olympian deity', 'Value 309'],
  ['ΑΘΗΝΑ', 'Athena', 'Athena, Goddess of Wisdom and Strategy', 'myth', 'historical', 'Patron of Athens', 'Value 69'],
  ['ΑΠΟΛΛΩΝ', 'Apollon', 'Apollo, God of Sun, Prophecy and Harmony', 'myth', 'historical', 'Delphic deity', 'Value 1061'],
  ['ΑΡΤΕΜΙΣ', 'Artemis', 'Artemis, Goddess of the Hunt and Moon', 'myth', 'historical', 'Olympian deity', 'Value 656'],
  ['ΑΦΡΟΔΙΤΗ', 'Aphrodite', 'Aphrodite, Goddess of Beauty and Desire', 'myth', 'historical', 'Born of sea foam', 'Value 993'],
  ['ΠΟΣΕΙΔΩΝ', 'Poseidon', 'Poseidon, God of the Seas and Earthquakes', 'myth', 'historical', 'Olympian deity', 'Value 1219'],
  ['ΕΡΜΗΣ', 'Hermes', 'Hermes, Guide of Souls and Divine Herald', 'myth', 'historical', 'Patron of travelers and merchants', 'Value 353'],
  ['ΗΦΑΙΣΤΟΣ', 'Hephaistos', 'Hephaestus, God of the Celestial Forge and Fire', 'myth', 'historical', 'Master artisan of gods', 'Value 1289'],
  ['ΔΙΟΝΥΣΟΣ', 'Dionysos', 'Dionysus, God of Wine, Theatre and Ecstasy', 'myth', 'historical', 'Bacchic mysteries', 'Value 1004'],
  ['ΔΗΜΗΤΗΡ', 'Demeter', 'Demeter, Goddess of Grain and Agriculture', 'myth', 'historical', 'Eleusinian Mysteries', 'Value 461; exact isopsephic match to Ἄτομον (Atom, 461)'],
  ['ΠΕΡΣΕΦΟΝΗ', 'Persephone', 'Persephone, Maiden of Spring and Queen of Underworld', 'myth', 'historical', 'Daughter of Demeter', 'Value 773'],
  ['ΗΡΑΚΛΗΣ', 'Herakles', 'Heracles, Foremost Hero of Greek Myth', 'myth', 'historical', 'Twelve Labours', 'Value 377'],
  ['ΑΧΙΛΛΕΥΣ', 'Achilleus', 'Achilles, Greatest Warrior of the Achaeans', 'myth', 'historical', 'Homer, Iliad', 'Value 1276'],
  ['ΟΔΥΣΣΕΥΣ', 'Odysseus', 'Odysseus, Cunning King of Ithaca', 'myth', 'historical', 'Homer, Odyssey', 'Value 984'],
  ['ΟΡΦΕΥΣ', 'Orpheus', 'Orpheus, Legendary Musician and Mystic Prophet', 'myth', 'historical', 'Orphism mysteries', 'Value 1045'],
  ['ΚΡΟΝΟΣ', 'Kronos', 'Cronus, Titan Ruler of the Golden Age', 'myth', 'historical', 'Hesiod Theogony', 'Value 460'],
  ['ΤΙΤΑΝ', 'Titan', 'Titan, Primordial Giant Deity', 'myth', 'historical', 'Hesiod', 'Value 661'],
  ['ΝΥΞ', 'Nyx', 'Nyx, Primordial Goddess of Night', 'myth', 'historical', 'Hesiod Theogony', 'Value 510'],
  ['ΕΡΩΣ', 'Eros', 'Eros, Primordial God of Attraction and Love', 'myth', 'historical', 'Hesiod & Symposium', 'Value 1105'],
  ['ΧΑΟΣ', 'Chaos', 'Chaos, Primordial Void Preceding Creation', 'myth', 'historical', 'Hesiod Theogony', 'Value 871'],
  ['ΓΑΙΑ', 'Gaia', 'Gaia, Primordial Mother Earth', 'myth', 'historical', 'Hesiod Theogony', 'Value 15'],
  ['ΟΥΡΑΝΟΣ', 'Ouranos', 'Uranus, Primordial Sky and Father of Titans', 'myth', 'historical', 'Hesiod Theogony', 'Value 1091'],
  ['ΘΑΝΑΤΟΣ', 'Thanatos', 'Thanatos, Personification of Death', 'myth', 'historical', 'Brother of Hypnos', 'Value 430; exact isopsephic match to Ἀριθμός (Number, 430)'],
  ['ΥΠΝΟΣ', 'Hypnos', 'Hypnos, Personification of Sleep', 'myth', 'historical', 'Homer Iliad', 'Value 760'],
  ['ΜΟΙΡΑ', 'Moira', 'Fate, Apportioned Destiny', 'myth', 'historical', 'The Three Fates', 'Value 221'],
  ['ΝΕΜΕΣΙΣ', 'Nemesis', 'Nemesis, Divine Retribution against Hubris', 'virtue', 'historical', 'Classical ethics and cult', 'Value 365; number of days in the solar year'],
  ['ΝΙΚΗ', 'Nike', 'Nike, Winged Goddess of Victory', 'myth', 'historical', 'Classical iconography', 'Value 88'],
  ['ΤΥΧΗ', 'Tyche', 'Tyche, Goddess of Fortune and Chance', 'myth', 'historical', 'Hellenistic city protectors', 'Value 1308'],
  ['ΜΟΥΣΑ', 'Mousa', 'Muse, Inspirer of Poetry and Learning', 'myth', 'historical', 'The Nine Muses', 'Value 711'],
  ['ΠΑΝΘΕΟΝ', 'Pantheon', 'Pantheon, Shrine to All the Gods', 'myth', 'historical', 'Greek architecture', 'Value 290'],
  ['ΟΛΥΜΠΟΣ', 'Olympos', 'Mount Olympus, Seat of the Gods', 'myth', 'historical', 'Homer', 'Value 470'],
  ['ΕΛΥΣΙΟΝ', 'Elysion', 'Elysium, The Elysian Fields of the Blessed', 'myth', 'historical', 'Homer Odyssey', 'Value 568'],
  ['ΑΙΔΗΣ', 'Aides', 'Hades, Lord of the Underworld', 'myth', 'historical', 'Classical mythology', 'Value 233'],
  ['ΣΤΥΞ', 'Styx', 'Styx, Sacred River of Binding Oaths', 'myth', 'historical', 'Underworld geography', 'Value 900'],
  ['ΔΡΑΚΩΝ', 'Drakon', 'Dragon, Giant Serpent, Guardian', 'myth', 'historical', 'Mythological monster', 'Value 975'],
  ['ΣΕΙΡΗΝ', 'Seiren', 'Siren, Enchanting Sea Singer', 'myth', 'historical', 'Odyssey', 'Value 373; exact isopsephic match to Λόγος (Logos, 373)'],

  // ── Virtues, Ethics & Noble Character ──
  ['ΔΙΚΑΙΟΣΥΝΗ', 'Dikaiosyne', 'Justice, Perfect Civic Rectitude', 'virtue', 'historical', 'Plato Republic cardinal virtue', 'Value 723'],
  ['ΣΩΦΡΟΣΥΝΗ', 'Sophrosyne', 'Temperance, Self-Control, Moderation', 'virtue', 'historical', 'Plato Charmides cardinal virtue', 'Value 1658'],
  ['ΑΝΔΡΕΙΑ', 'Andreia', 'Courage, Fortitude, Manly Bravery', 'virtue', 'historical', 'Plato Laches cardinal virtue', 'Value 176'],
  ['ΔΙΚΗ', 'Dike', 'Justice, Customary Order, The Right', 'virtue', 'historical', 'Hesiod Works and Days', 'Value 32'],
  ['ΑΙΔΩΣ', 'Aidos', 'Reverence, Moral Humility, Healthy Shame', 'virtue', 'historical', 'Archaic Greek morality', 'Value 1015'],
  ['ΣΕΜΝΟΤΗΣ', 'Semnotes', 'Dignity, Sacred Gravity, Majesty', 'virtue', 'mathematical', null, 'Value 653'],
  ['ΜΕΤΡΙΟΤΗΣ', 'Metriotes', 'Moderation, The Golden Mean', 'virtue', 'historical', 'Aristotelian doctrine of mean', 'Value 768'],
  ['ΤΑΠΕΙΝΟΣ', 'Tapeinos', 'Humble, Modest, Lowly', 'virtue', 'mathematical', null, 'Value 626'],
  ['ΠΡΑΟΤΗΣ', 'Praotes', 'Gentleness, Meekness, Calm Temper', 'virtue', 'mathematical', null, 'Value 671'],
  ['ΕΓΚΡΑΤΕΙΑ', 'Enkrateia', 'Mastery over Passions, Self-Discipline', 'virtue', 'historical', 'Socrates, Xenophon', 'Value 454'],
  ['ΜΑΚΑΡΙΟΣ', 'Makarios', 'Blessed, Divinely Favoured', 'virtue', 'historical', 'Beatitudes & Homer', 'Value 422'],
  ['ΑΓΝΟΣ', 'Hagnos', 'Pure, Unpolluted, Chaste', 'virtue', 'mathematical', null, 'Value 324'],
  ['ΚΑΘΑΡΟΣ', 'Katharos', 'Clean, Spotless, Unadulterated', 'virtue', 'historical', 'Catharsis root', 'Value 400'],
  ['ΑΛΗΘΗΣ', 'Alethes', 'True, Sincere, Authentic', 'virtue', 'mathematical', null, 'Value 78'],
  ['ΠΙΣΤΟΣ', 'Pistos', 'Faithful, Dependable, True', 'virtue', 'mathematical', null, 'Value 660'],
  ['ΑΓΑΘΟΣΥΝΗ', 'Agathosyne', 'Generous Goodness, Benevolence', 'virtue', 'mathematical', null, 'Value 742'],
  ['ΧΡΗΣΤΟΤΗΣ', 'Chrestotes', 'Kindness, Moral Excellence', 'virtue', 'mathematical', null, 'Value 1376'],
  ['ΜΑΚΡΟΘΥΜΙΑ', 'Makrothymia', 'Long-suffering, Patient Endurance', 'virtue', 'mathematical', null, 'Value 640'],
  ['ΕΥΣΕΒΕΙΑ', 'Eusebeia', 'Piety, Dutiful Reverence toward the Divine', 'virtue', 'historical', 'Greek civic duty', 'Value 638'],
  ['ΦΙΛΑΝΘΡΩΠΙΑ', 'Philanthropia', 'Love for Humanity, Beneficence', 'virtue', 'historical', 'Aeschylus Prometheus Bound', 'Value 1102'],
  ['ΦΙΛΑΔΕΛΦΙΑ', 'Philadelphia', 'Brotherly Love, Mutual Regard', 'virtue', 'historical', 'Hellenistic virtue & civic title', 'Value 696'],
  ['ΦΙΛΟΞΕΝΙΑ', 'Philoxenia', 'Hospitality, Sacred Welcome of Strangers', 'virtue', 'historical', 'Zeus Xenios mandate in Homer', 'Value 861'],
  ['ΕΛΕΥΘΕΡΙΑ', 'Eleutheria', 'Freedom, Political Liberty', 'virtue', 'historical', 'Athenian pride following Persian Wars', 'Value 555'],
  ['ΙΣΟΤΗΣ', 'Isotes', 'Equality, Fair Proportion', 'virtue', 'historical', 'Democratic ethos', 'Value 588'],
  ['ΙΣΟΝΟΜΙΑ', 'Isonomia', 'Equal Standing under the Law', 'virtue', 'historical', 'Foundation of Athenian democracy', 'Value 401'],
  ['ΚΑΛΛΟΣ', 'Kallos', 'Radiant Beauty, Physical Grace', 'virtue', 'historical', 'Classical aesthetics', 'Value 321; exact isopsephic match to Καλός (321) and Ναός (321)'],
  ['ΑΡΙΣΤΟΣ', 'Aristos', 'Best, Preeminent, Most Noble', 'virtue', 'historical', 'Homeric epic hero ideal', 'Value 681; exact isopsephic match to Οὐσία (Essence, 681)'],
  ['ΠΑΡΡΗΣΙΑ', 'Parrhesia', 'Fearless Frankness of Free Speech', 'virtue', 'historical', 'Athenian democratic jewel', 'Value 400'],

  // ── Nature, Elements, Sky & Earth ──
  ['ΗΛΙΟΣ', 'Helios', 'Sun, Source of Radiant Light', 'nature', 'historical', 'Sun god in Homer', 'Value 318; early Christian isopsephic sign of the cross'],
  ['ΣΕΛΗΝΗ', 'Selene', 'Moon, Nocturnal Luminary', 'nature', 'historical', 'Hesiod', 'Value 301'],
  ['ΑΣΤΗΡ', 'Aster', 'Star, Radiant Celestial Body', 'nature', 'historical', 'Classical astronomy', 'Value 609'],
  ['ΑΣΤΡΟΝ', 'Astron', 'Constellation, Heavenly Body', 'nature', 'mathematical', null, 'Value 621'],
  ['ΘΑΛΑΣΣΑ', 'Thalassa', 'Sea, Ocean Waters', 'nature', 'historical', 'Cry of the Ten Thousand (Xenophon)', 'Value 271'],
  ['ΠΟΤΑΜΟΣ', 'Potamos', 'River, Flowing Stream', 'nature', 'historical', 'Heraclitus river fragment', 'Value 530'],
  ['ΟΡΟΣ', 'Oros', 'Mountain, High Boundary', 'nature', 'mathematical', null, 'Value 340'],
  ['ΑΝΕΜΟΣ', 'Anemos', 'Wind, Breeze, Breath', 'nature', 'historical', 'Homer', 'Value 366'],
  ['ΒΡΟΝΤΗ', 'Bronte', 'Thunder, Roar of the Sky', 'nature', 'historical', 'Epithet of Zeus', 'Value 240'],
  ['ΑΣΤΡΑΠΗ', 'Astrape', 'Lightning Flash', 'nature', 'historical', 'Zeus thunderbolt', 'Value 792'],
  ['ΒΡΟΧΗ', 'Broche', 'Rainfall, Shower', 'nature', 'mathematical', null, 'Value 790'],
  ['ΧΙΩΝ', 'Chion', 'Snow, Frozen Frost', 'nature', 'mathematical', null, 'Value 1460'],
  ['ΧΡΥΣΟΣ', 'Chrysos', 'Gold, Precious Metal of Kings', 'nature', 'historical', 'Symbol of incorruptibility', 'Value 1570'],
  ['ΑΡΓΥΡΟΣ', 'Argyros', 'Silver, Gleaming Metal', 'nature', 'mathematical', null, 'Value 684'],
  ['ΣΙΔΗΡΟΣ', 'Sideros', 'Iron, Metal of the Heroic Age', 'nature', 'historical', 'Hesiod Iron Age', 'Value 584'],
  ['ΧΑΛΚΟΣ', 'Chalkos', 'Bronze, Copper', 'nature', 'historical', 'Hesiod Bronze Age', 'Value 931'],
  ['ΞΥΛΟΝ', 'Xylon', 'Wood, Living Timber, Cross', 'nature', 'historical', 'Septuagint & New Testament', 'Value 580; exact isopsephic match to Πῦρ (Fire, 580)'],
  ['ΔΕΝΔΡΟΝ', 'Dendron', 'Tree, Stately Arbor', 'nature', 'mathematical', null, 'Value 239'],
  ['ΑΝΘΟΣ', 'Anthos', 'Blossom, Flower', 'nature', 'mathematical', null, 'Value 330'],
  ['ΚΑΡΠΟΣ', 'Karpos', 'Fruit, Harvested Produce', 'nature', 'mathematical', null, 'Value 471; exact match to Πρᾶξις (Action, 471)'],
  ['ΣΠΟΡΟΣ', 'Sporos', 'Seed, Grain Sown', 'nature', 'mathematical', null, 'Value 560'],
  ['ΡΙΖΑ', 'Rhiza', 'Root, Underlying Foundation', 'nature', 'mathematical', null, 'Value 118'],
  ['ΖΩΟΝ', 'Zoon', 'Living Creature, Animal', 'nature', 'historical', 'Aristotle "zoon politikon"', 'Value 920'],
  ['ΙΧΘΥΣ', 'Ichthys', 'Fish (Acronym: Iesous Christos Theou Yios Soter)', 'nature', 'historical', 'Secret early Christian symbol', 'Value 1219; exact isopsephic match to Ποσειδῶν (1219)'],
  ['ΛΕΩΝ', 'Leon', 'Lion, King of Beasts', 'nature', 'historical', 'Homeric warrior comparisons', 'Value 885'],
  ['ΑΕΤΟΣ', 'Aetos', 'Eagle, Bird of Zeus', 'nature', 'historical', 'Emblem of Olympus and empire', 'Value 576; exact isopsephic match to Πνεῦμα (Spirit, 576)'],
  ['ΠΕΡΙΣΤΕΡΑ', 'Peristera', 'Dove, Gentle Messenger Bird', 'nature', 'historical', 'Sacred symbol of peace and Spirit', 'Value 576; famous isopsephic match to Πνεῦμα (Spirit, 576)'],
  ['ΙΠΠΟΣ', 'Hippos', 'Noble Steed, Horse', 'nature', 'historical', 'Trojan Horse & chivalry', 'Value 560; exact match to Σπόρος (Seed, 560)'],
  ['ΚΥΩΝ', 'Kyon', 'Dog, Faithful Hound, Cynic Root', 'nature', 'historical', 'Diogenes the Cynic', 'Value 870'],
  ['ΑΡΚΤΟΣ', 'Arktos', 'Bear, Northern Constellation', 'nature', 'historical', 'Source of "Arctic"', 'Value 691'],

  // ── Anatomy, Senses & Humanity ──
  ['ΚΕΦΑΛΗ', 'Kephale', 'Head, Source, Chief Summit', 'body', 'historical', 'Classical anatomy', 'Value 564'],
  ['ΚΑΡΔΙΑ', 'Kardia', 'Heart, Core of Will and Passion', 'body', 'historical', 'Seat of consciousness in antiquity', 'Value 136; exact match to Ἀναλογία (Proportion, 136)'],
  ['ΧΕΙΡ', 'Cheir', 'Hand, Instrument of Action', 'body', 'historical', 'Aristotle tool of tools', 'Value 715; exact match to Ἱερεύς (Priest, 715)'],
  ['ΟΦΘΑΛΜΟΣ', 'Ophthalmos', 'Eye, Organ of Vision and Light', 'body', 'historical', 'Plato light theory', 'Value 680; exact match to Υἱός (Son, 680)'],
  ['ΣΤΟΜΑ', 'Stoma', 'Mouth, Voice, Gateway', 'body', 'mathematical', null, 'Value 581'],
  ['ΓΛΩΣΣΑ', 'Glossa', 'Tongue, Spoken Language', 'body', 'historical', 'Pentecost & rhetoric', 'Value 1034'],
  ['ΣΩΜΑ', 'Soma', 'The Physical Body, Corporeal Vessel', 'body', 'historical', 'Orphic phrase "soma sema" (body is tomb)', 'Value 1041'],
  ['ΑΙΜΑ', 'Haima', 'Life-Giving Blood', 'body', 'historical', 'Ancient sacrificial biology', 'Value 52'],
  ['ΣΑΡΞ', 'Sarx', 'Flesh, Mortal Frailty', 'body', 'historical', 'Incarnation theology "sarx egeneto"', 'Value 361; exact match to Μονάς (Monad, 361)'],
  ['ΟΣΤΕΟΝ', 'Osteon', 'Bone, Framework', 'body', 'mathematical', null, 'Value 625'],
  ['ΝΕΥΡΟΝ', 'Neuron', 'Sinew, Nerve, Bowstring', 'body', 'historical', 'Ancient medicine (Galen)', 'Value 625; exact match to Ὀστέον (Bone, 625)'],
  ['ΤΕΚΝΟΝ', 'Teknon', 'Child, Beloved Offspring', 'body', 'mathematical', null, 'Value 445'],
  ['ΑΝΗΡ', 'Aner', 'Man, Hero, Husband', 'body', 'historical', 'First word of the Odyssey ("Andra moi ennepe")', 'Value 159'],
  ['ΓΥΝΗ', 'Gyne', 'Woman, Matron, Mother', 'body', 'historical', 'Classical Greek family', 'Value 461; exact match to Ἄτομον (461) and Δημήτηρ (461)'],
  ['ΓΕΝΝΗΣΙΣ', 'Gennesis', 'Birth, Engendering, Origin', 'body', 'mathematical', null, 'Value 526'],
  ['ΑΝΑΣΤΑΣΙΣ', 'Anastasis', 'Standing Up, Resurrection, Revival', 'theological', 'historical', 'Christian resurrection doctrine', 'Value 963; exact match to Τέχνη (Craft, 963)'],

  // ── Mind, Emotions & States of Soul ──
  ['ΛΥΠΗ', 'Lype', 'Grief, Sorrow, Deep Pain', 'emotion', 'historical', 'Tragic literature', 'Value 518; exact match to Μίμησις (Imitation, 518)'],
  ['ΦΟΒΟΣ', 'Phobos', 'Fear, Panic, Awe', 'emotion', 'historical', 'Aristotle Poetics (pity and fear)', 'Value 842'],
  ['ΕΛΕΟΣ', 'Eleos', 'Pity, Compassion, Mercy', 'emotion', 'historical', 'Aristotle Poetics counterpart to fear', 'Value 310'],
  ['ΘΥΜΟΣ', 'Thymos', 'Spiritedness, Passionate Drive', 'emotion', 'historical', 'Plato tripartite soul', 'Value 719'],
  ['ΖΗΛΟΣ', 'Zelos', 'Zeal, Ardent Emulation', 'emotion', 'historical', 'Classical ethos', 'Value 315; exact match to Δίκαιος (Just, 315)'],
  ['ΗΔΟΝΗ', 'Hedone', 'Pleasure, Sensory Delight', 'emotion', 'historical', 'Hedonism and Epicurus', 'Value 77'],
  ['ΟΡΓΗ', 'Orge', 'Anger, Wrath, Tempestuous Fury', 'emotion', 'historical', 'Iliad opening theme', 'Value 181; exact match to Εἰρήνη (Peace, 181)'],
  ['ΠΟΘΟΣ', 'Pothos', 'Yearning, Romantic Longing', 'emotion', 'historical', 'Hellenistic lyric poetry', 'Value 439'],
  ['ΕΧΘΡΑ', 'Echthra', 'Enmity, Bitter Hostility', 'emotion', 'mathematical', null, 'Value 716'],
  ['ΘΑΥΜΑ', 'Thauma', 'Wonder, Amazement', 'emotion', 'historical', 'Plato: "Philosophy begins in wonder"', 'Value 451'],
  ['ΕΚΣΤΑΣΙΣ', 'Ekstasis', 'Ecstasy, Standing Outside Oneself', 'emotion', 'historical', 'Mystic rites and Neoplatonism', 'Value 736'],
  ['ΑΓΩΝΙΑ', 'Agonia', 'Contest, Intense Struggle, Agony', 'emotion', 'historical', 'Athletic games and emotional striving', 'Value 854'],

  // ── Society, Law, Government & Polis ──
  ['ΔΗΜΟΣ', 'Demos', 'The Common People, Citizen Body', 'concept', 'historical', 'Democracy cornerstone', 'Value 312; exact match to Ἄγγελος (Angel, 312)'],
  ['ΝΟΜΟΣ', 'Nomos', 'Law, Sacred Custom, Constitution', 'concept', 'historical', 'Greek jurisprudence (physis vs nomos)', 'Value 430; exact match to Ἀριθμός (Number, 430) and Θάνατος (Death, 430)'],
  ['ΒΑΣΙΛΕΥΣ', 'Basileus', 'King, Sovereign Monarch', 'concept', 'historical', 'Mycenaean to Byzantine rule', 'Value 848'],
  ['ΤΥΡΑΝΝΟΣ', 'Tyrannos', 'Autocrat, Monarch Unrestrained by Law', 'concept', 'historical', 'Archaic Greek politics', 'Value 1051'],
  ['ΔΗΜΟΚΡΑΤΙΑ', 'Demokratia', 'Democracy, Rule of the People', 'concept', 'historical', 'Athens 5th century BC', 'Value 554'],
  ['ΑΡΙΣΤΟΚΡΑΤΙΑ', 'Aristokratia', 'Aristocracy, Rule of the Best', 'concept', 'historical', 'Plato Republic ideal government', 'Value 923'],
  ['ΟΛΙΓΑΡΧΙΑ', 'Oligarchia', 'Oligarchy, Rule of the Wealthy Few', 'concept', 'historical', 'Greek constitutional theory', 'Value 815; exact match to Ζωή (Life, 815)'],
  ['ΠΟΛΙΤΗΣ', 'Polites', 'Citizen, Member of the Commonwealth', 'concept', 'historical', 'Pericles citizenship law', 'Value 638; exact match to Εὐσέβεια (Piety, 638)'],
  ['ΣΤΡΑΤΗΓΟΣ', 'Strategos', 'General, Supreme Military Commander', 'concept', 'historical', 'Athenian elected magistrate', 'Value 1074'],
  ['ΠΟΛΕΜΟΣ', 'Polemos', 'War, Cosmic Strife', 'concept', 'historical', 'Heraclitus: "War is the father of all"', 'Value 445; exact match to Τέκνον (Child, 445)'],
  ['ΑΓΟΡΑ', 'Agora', 'Public Marketplace, Forum of Discourse', 'concept', 'historical', 'Heart of the Greek city', 'Value 175'],
  ['ΒΟΥΛΗ', 'Boule', 'Council of Citizens, Senate', 'concept', 'historical', 'Athenian Council of 500', 'Value 510; exact match to Νύξ (Night, 510)'],
  ['ΨΗΦΟΣ', 'Psephos', 'Counting Pebble, Casting Vote', 'concept', 'historical', 'Etymological root of Isopsephy (equal pebbles)', 'Value 1410'],
  ['ΙΣΟΨΗΦΙΑ', 'Isopsephia', 'Isopsephy, Numerical Equality of Letters', 'concept', 'historical', 'Historical practice of letter calculation', 'Value 1739'],

  // ── Time, Space & Cosmology ──
  ['ΧΡΟΝΟΣ', 'Chronos', 'Sequential Time, Quantitative Duration', 'cosmological', 'historical', 'Ancient Greek time concept', 'Value 1090'],
  ['ΚΑΙΡΟΣ', 'Kairos', 'The Right Moment, Qualitative Opportunity', 'cosmological', 'historical', 'Sacred and strategic opportune time', 'Value 391'],
  ['ΑΙΩΝ', 'Aion', 'Eternity, Eon, Cosmic Age', 'cosmological', 'historical', 'Timeless duration in Plato', 'Value 861; exact match to Φιλοξενία (Hospitality, 861)'],
  ['ΧΩΡΑ', 'Chora', 'Receptive Space, Matrix of Becoming', 'cosmological', 'historical', 'Plato, Timaeus receptacle', 'Value 1501'],
  ['ΠΛΗΡΩΜΑ', 'Pleroma', 'Fullness, Total Totality of Divine Light', 'cosmological', 'historical', 'Pauline epistles & Gnosticism', 'Value 1058'],
  ['ΚΙΝΗΣΙΣ', 'Kinesis', 'Motion, Change, Becoming', 'cosmological', 'historical', 'Aristotle, Physics prime mover', 'Value 308'],
  ['ΓΕΝΕΣΙΣ', 'Genesis', 'Generation, Becoming, First Origin', 'cosmological', 'historical', 'Hesiod & Book of Genesis', 'Value 473'],
  ['ΦΘΟΡΑ', 'Phthora', 'Corruption, Dissolution, Decay', 'cosmological', 'historical', 'Aristotle On Generation and Corruption', 'Value 680; exact match to Υἱός (680) and Ὀφθαλμός (680)'],
  ['ΤΑΞΙΣ', 'Taxis', 'Order, Strategic Array, Arrangement', 'cosmological', 'historical', 'Greek science and military drill', 'Value 571'],
  ['ΣΚΟΤΟΣ', 'Skotos', 'Darkness, Gloom, Obscurity', 'concept', 'historical', 'Opposite of Phos in theology', 'Value 660; exact match to Πιστός (Faithful, 660)'],
  ['ΣΚΙΑ', 'Skia', 'Shadow, Phantom, Outline', 'concept', 'historical', 'Plato Allegory of the Cave', 'Value 231'],
  ['ΑΥΓΗ', 'Auge', 'First Light of Dawn, Radiance', 'concept', 'mathematical', null, 'Value 41'],
  ['ΕΠΙΦΑΝΕΙΑ', 'Epiphaneia', 'Epiphany, Divine Manifestation', 'theological', 'historical', 'Appearance of a god among mortals', 'Value 658'],
  ['ΜΝΗΜΗ', 'Mneme', 'Memory, Remembrance', 'philosophical', 'historical', 'Mother of the Muses (Mnemosyne)', 'Value 146'],
  ['ΑΝΑΜΝΗΣΙΣ', 'Anamnesis', 'Recollection of Eternal Truths', 'philosophical', 'historical', 'Plato Meno & Phaedo', 'Value 510; exact match to Νύξ (510) and Βουλή (510)'],

  // ── Letters, Arts & Literature ──
  ['ΑΛΦΑ', 'Alpha', 'Alpha, First Letter and Beginning', 'concept', 'historical', 'Alpha and Omega', 'Value 532; exact match to Γεωμετρία (Geometry, 532)'],
  ['ΩΜΕΓΑ', 'Omega', 'Omega, Last Letter and Culmination', 'concept', 'historical', 'Alpha and Omega', 'Value 849'],
  ['ΓΡΑΜΜΑ', 'Gramma', 'Letter, Inscription, Character', 'concept', 'mathematical', null, 'Value 185'],
  ['ΓΡΑΦΗ', 'Graphe', 'Sacred Scripture, Written Law, Painting', 'concept', 'historical', 'Biblical citations', 'Value 611; exact match to Τριάς (Triad, 611)'],
  ['ΒΙΒΛΟΣ', 'Biblos', 'Papyrus Scroll, Book', 'concept', 'historical', 'Origin of the word Bible', 'Value 314; close approximation to Pi (3.14)'],
  ['ΕΠΙΣΤΟΛΗ', 'Epistole', 'Epistle, Dispatched Letter', 'concept', 'historical', 'New Testament epistles', 'Value 583'],
  ['ΠΟΙΗΜΑ', 'Poiema', 'Poem, Work of Hand or Mind', 'concept', 'historical', 'Work of supreme artistry', 'Value 179'],
  ['ΜΥΘΟΣ', 'Mythos', 'Myth, Sacred Narrative, Plot', 'concept', 'historical', 'Aristotle Poetics', 'Value 710'],
  ['ΙΣΤΟΡΙΑ', 'Historia', 'History, Empirical Inquiry, Investigation', 'concept', 'historical', 'Herodotus opening statement', 'Value 691; exact match to Ἄρκτος (Bear, 691)'],
  ['ΤΡΑΓΩΔΙΑ', 'Tragodia', 'Tragedy, Goat-Song of Fate and Catharsis', 'concept', 'historical', 'Aeschylus, Sophocles, Euripides', 'Value 1228'],
  ['ΚΩΜΩΔΙΑ', 'Komodia', 'Comedy, Revelry Song', 'concept', 'historical', 'Aristophanes', 'Value 925; exact match to Θεωρία (Contemplation, 925)'],
  ['ΕΠΟΣ', 'Epos', 'Epic Verse, Utterance, Word', 'concept', 'historical', 'Homeric epic tradition', 'Value 355'],
  ['ΟΝΟΜΑ', 'Onoma', 'Name, Renown, Identity', 'concept', 'historical', 'Plato Cratylus', 'Value 231; exact match to Σκιά (Shadow, 231)'],
  ['ΣΗΜΕΙΟΝ', 'Semeion', 'Sign, Wonder, Miraculous Token', 'concept', 'historical', 'Gospel of John signs', 'Value 373; exact match to Λόγος (Logos, 373)'],
  ['ΣΥΜΒΟΛΟΝ', 'Symbolon', 'Symbol, Token of Mutual Recognition', 'concept', 'historical', 'Ancient pledge tokens & creeds', 'Value 762'],
  ['ΕΙΚΩΝ', 'Eikon', 'Icon, Image, Faithful Likeness', 'concept', 'historical', 'Plato & theology of the image', 'Value 885; exact match to Λέων (Lion, 885)'],
  ['ΠΑΡΑΒΟΛΗ', 'Parabole', 'Parable, Juxtaposition, Comparison', 'concept', 'historical', 'Gospel parables', 'Value 281'],
  ['ΔΑΙΜΩΝ', 'Daimon', 'Guiding Spirit, Divine Guardian', 'philosophical', 'historical', 'Socrates divine sign (daimonion)', 'Value 895'],
  ['ΗΡΩΣ', 'Heros', 'Hero, Demigod of Mythic Valour', 'myth', 'historical', 'Homeric hero cults', 'Value 1108'],
  ['ΣΟΦΟΣ', 'Sophos', 'The Wise Man, Sage of Antiquity', 'philosophical', 'historical', 'Seven Sages of Greece', 'Value 770'],
  ['ΠΟΙΗΤΗΣ', 'Poietes', 'Poet, Creator, Fashioner', 'concept', 'historical', 'Maker of verses and worlds', 'Value 576; exact match to Πνεῦμα (Spirit, 576), Ἀετός (576), Περιστερά (576)'],

  // ── Great Philosophers & Figures ──
  ['ΣΩΚΡΑΤΗΣ', 'Sokrates', 'Socrates, Father of Western Ethics', 'philosophical', 'historical', 'Athenian gadfly philosopher', 'Value 1509'],
  ['ΠΛΑΤΩΝ', 'Platon', 'Plato, Founder of the Academy', 'philosophical', 'historical', 'Author of the Dialogues', 'Value 1211'],
  ['ΑΡΙΣΤΟΤΕΛΗΣ', 'Aristoteles', 'Aristotle, The Stagirite, Master of Logic', 'philosophical', 'historical', 'Founder of the Lyceum', 'Value 1014'],
  ['ΠΥΘΑΓΟΡΑΣ', 'Pythagoras', 'Pythagoras of Samos, Father of Number Mysticism', 'philosophical', 'historical', 'Originated harmony of spheres', 'Value 864'],
  ['ΗΡΑΚΛΕΙΤΟΣ', 'Herakleitos', 'Heraclitus of Ephesus, The Obscure, Philosopher of Flux', 'philosophical', 'historical', 'Panta rhei (all flows)', 'Value 594'],
  ['ΠΑΡΜΕΝΙΔΗΣ', 'Parmenides', 'Parmenides of Elea, Philosopher of the One', 'philosophical', 'historical', 'The Way of Truth', 'Value 459'],
  ['ΔΗΜΟΚΡΙΤΟΣ', 'Demokritos', 'Democritus of Abdera, The Laughing Philosopher of Atoms', 'philosophical', 'historical', 'Atomism pioneer', 'Value 614'],
  ['ΕΠΙΚΟΥΡΟΣ', 'Epikouros', 'Epicurus, Founder of the Garden', 'philosophical', 'historical', 'Philosophy of tranquil friendship', 'Value 875'],
  ['ΘΑΛΗΣ', 'Thales', 'Thales of Miletus, First Greek Philosopher and Mathematician', 'philosophical', 'historical', 'Water as arche', 'Value 248'],
  ['ΑΝΑΞΙΜΑΝΔΡΟΣ', 'Anaximandros', 'Anaximander of Miletus, Student of Thales', 'philosophical', 'historical', 'Apeiron as arche', 'Value 496; a famous Perfect Number (1+2+4+8+16+31+62+124+248=496)'],
  ['ΑΛΕΞΑΝΔΡΟΣ', 'Alexandros', 'Alexander the Great, King of Macedon', 'myth', 'historical', 'Conqueror of the Persian Empire', 'Value 416'],
  ['ΟΜΗΡΟΣ', 'Homeros', 'Homer, The Blind Bard of Chios', 'concept', 'historical', 'Author of Iliad and Odyssey', 'Value 430; exact match to Ἀριθμός (Number, 430), Νόμος (Law, 430), Θάνατος (Death, 430)'],

  // ── Additional Harmonious Words & Isopsephic Keys ──
  ['ΑΓΑΘΟΝ', 'Agathon', 'The Good (Platonic supreme idea)', 'philosophical', 'historical', 'The pinnacle of Platonic forms', 'Value 134'],
  ['ΑΓΑΠΗΤΟΣ', 'Agapetos', 'Beloved, Esteemed', 'virtue', 'mathematical', null, 'Value 663'],
  ['ΑΓΙΑΣΜΟΣ', 'Hagiasmos', 'Sanctification, Consecration', 'theological', 'mathematical', null, 'Value 525'],
  ['ΑΓΝΟΙΑ', 'Agnoia', 'Ignorance, Lack of True Knowledge', 'philosophical', 'historical', 'Socratic condition to overcome', 'Value 135; exact match to Δόξα (Glory/Opinion, 135)'],
  ['ΑΓΩΝ', 'Agon', 'Struggle, Athletic Contest, Drama', 'concept', 'historical', 'Olympic games concept', 'Value 854; exact match to Ἀγωνία (854)'],
  ['ΑΘΑΝΑΣΙΑ', 'Athanasia', 'Immortality, Deathlessness', 'philosophical', 'historical', 'Plato Phaedo', 'Value 272'],
  ['ΑΘΑΝΑΤΟΣ', 'Athanatos', 'Immortal, Undying', 'theological', 'mathematical', null, 'Value 432'],
  ['ΑΙΩΝΙΟΣ', 'Aionios', 'Eternal, Everlasting, Unending', 'theological', 'historical', 'Biblical life eternal', 'Value 1141'],
  ['ΑΚΡΟΠΟΛΙΣ', 'Akropolis', 'High Fortress City, Citadel of Athens', 'concept', 'historical', 'Periclean golden age', 'Value 571; exact match to Τάξις (Order, 571)'],
  ['ΑΜΠΕΛΟΣ', 'Ampelos', 'The True Vine, Vineyard', 'nature', 'historical', 'Gospel of John parable', 'Value 396'],
  ['ΑΝΑΓΚΗ', 'Ananke', 'Cosmic Necessity, Unyielding Fate', 'philosophical', 'historical', 'Plato Republic spindle of necessity', 'Value 83'],
  ['ΑΝΑΣΣΑ', 'Anassa', 'Queen, Sovereign Lady', 'myth', 'historical', 'Homeric title', 'Value 453; exact match to Ἁμαρτία (Sin, 453)'],
  ['ΑΠΑΛΟΣ', 'Apalos', 'Gentle, Tender, Delicate', 'virtue', 'mathematical', null, 'Value 392'],
  ['ΑΠΛΟΥΣ', 'Haplous', 'Single, Sincere, Whole-Hearted', 'virtue', 'historical', 'Socratic simplicity', 'Value 741'],
  ['ΑΡΜΟΝΙΑ', 'Harmonia', 'Harmonic Balance, Goddess of Concord', 'cosmological', 'historical', 'Pythagorean music of the spheres', 'Value 232'],
  ['ΑΣΚΗΣΙΣ', 'Askesis', 'Spiritual Discipline, Training', 'virtue', 'historical', 'Cynic, Stoic and monastic practice', 'Value 459; exact match to Παρμενίδης (Parmenides, 459)'],
  ['ΑΣΦΑΛΕΙΑ', 'Asphaleia', 'Certainty, Sure Security, Steadfastness', 'virtue', 'mathematical', null, 'Value 748'],
  ['ΑΥΤΑΡΚΕΙΑ', 'Autarkeia', 'Self-Sufficiency, Inner Independence', 'virtue', 'historical', 'Stoic and Cynic ideal', 'Value 838'],
  ['ΑΦΘΑΡΣΙΑ', 'Aphtharsia', 'Incorruption, Imperishability', 'theological', 'historical', 'New Testament resurrection', 'Value 822'],
  ['ΒΑΘΟΣ', 'Bathos', 'The Depth, Deep Profundity', 'philosophical', 'mathematical', null, 'Value 282; exact match to Βίος (Life, 282)'],
  ['ΒΕΒΑΙΟΣ', 'Bebaios', 'Firm, Dependable, Steadfast', 'virtue', 'mathematical', null, 'Value 300'],
  ['ΒΩΜΟΣ', 'Bomos', 'Altar of Sacrifice and Prayer', 'theological', 'historical', 'Ancient Greek temple ritual', 'Value 1092'],
  ['ΓΑΛΗΝΗ', 'Galene', 'Serene Calm of Sea and Mind', 'nature', 'historical', 'Epicurean ideal state', 'Value 107'],
  ['ΓΝΩΜΗ', 'Gnome', 'Wise Aphorism, Prudent Judgment', 'philosophical', 'historical', 'Seven Sages sayings', 'Value 891'],
  ['ΔΑΚΡΥ', 'Dakry', 'Tear of Grief or Joy', 'body', 'mathematical', null, 'Value 525; exact match to Ἁγιασμός (Sanctification, 525)'],
  ['ΔΕΣΜΟΣ', 'Desmos', 'Bond, Tie of Union, Chain', 'concept', 'historical', 'Plato bonding of elements', 'Value 519'],
  ['ΔΙΑΘΗΚΗ', 'Diatheke', 'Covenant, Sacred Testament', 'theological', 'historical', 'Old and New Testaments', 'Value 60'],
  ['ΔΙΔΑΧΗ', 'Didache', 'Teaching, Doctrine of the Twelve', 'theological', 'historical', 'Early Christian manual', 'Value 633'],
  ['ΔΙΨΑ', 'Dipsa', 'Thirst, Ardent Desire for Water or Truth', 'body', 'mathematical', null, 'Value 1015; exact match to Αἰδώς (Reverence, 1015)'],
  ['ΔΩΡΟΝ', 'Doron', 'Gift, Offering of Goodwill', 'concept', 'historical', 'Homer gift culture', 'Value 1024'],
  ['ΕΓΡΗΓΟΡΣΙΣ', 'Egregorsis', 'Vigilance, Watchfulness of Soul', 'virtue', 'historical', 'Stoic and ascetic alertness', 'Value 694'],
  ['ΕΙΚΟΣΙΑΣ', 'Eikosias', 'The Number Twenty', 'number_word', 'mathematical', null, 'Value 366; exact match to Ἄνεμος (Wind, 366)'],
  ['ΕΛΕΓΧΟΣ', 'Elenchos', 'Socratic Examination, Cross-Questioning', 'philosophical', 'historical', 'The Socratic method', 'Value 768; exact match to Μετριότης (Moderation, 768)'],
  ['ΕΜΠΝΕΥΣΙΣ', 'Empneusis', 'Inspiration, Breathing of the Muse', 'concept', 'historical', 'Divine creative spark', 'Value 880'],
  ['ΕΝΩΣΙΣ', 'Henosis', 'Mystical Union with the One', 'philosophical', 'historical', 'Plotinus supreme ascent', 'Value 1065'],
  ['ΕΞΟΥΣΙΑ', 'Exousia', 'Authority, Unhindered Power, Liberty', 'theological', 'historical', 'Gospels authority to heal and teach', 'Value 746'],
  ['ΕΠΑΓΓΕΛΙΑ', 'Epangelia', 'Divine Promise, Solemn Announcement', 'theological', 'mathematical', null, 'Value 165'],
  ['ΕΠΙΕΙΚΕΙΑ', 'Epieikeia', 'Equitable Justice, Gentle Fairness', 'virtue', 'historical', 'Aristotle supreme equity above rigid law', 'Value 146; exact match to Μνήμη (Memory, 146)'],
  ['ΕΠΙΘΥΜΙΑ', 'Epithymia', 'Appetite, Passionate Desire', 'emotion', 'historical', 'Plato lower soul component', 'Value 565'],
  ['ΕΠΙΣΚΟΠΟΣ', 'Episkopos', 'Overseer, Guardian, Bishop', 'theological', 'historical', 'Greek civic guardian & Christian bishop', 'Value 695'],
  ['ΕΡΓΟΝ', 'Ergon', 'Work, Purposeful Deed, Fruit of Labor', 'philosophical', 'historical', 'Aristotle function argument', 'Value 228'],
  ['ΕΥΓΝΩΜΟΣΥΝΗ', 'Eugnomosyne', 'Gratitude, Kindly Graciousness', 'virtue', 'mathematical', null, 'Value 1044'],
  ['ΕΥΛΟΓΙΑ', 'Eulogia', 'Blessing, Speech of High Praise', 'theological', 'historical', 'Septuagint & liturgy', 'Value 549'],
  ['ΕΥΦΡΟΣΥΝΗ', 'Euphrosyne', 'Gladness, Mirth, Joy of Heart', 'virtue', 'historical', 'One of the Three Graces', 'Value 1263; exact match to Γνῶσις (Gnosis, 1263)'],
  ['ΕΥΧΗ', 'Euche', 'Vow, Supplication, Prayer', 'theological', 'historical', 'Ancient Greek religion', 'Value 1008'],
  ['ΖΕΦΥΡΟΣ', 'Zephyros', 'Zephyr, Gentle West Wind of Spring', 'nature', 'historical', 'Homer Odyssey', 'Value 1182'],
  ['ΖΥΓΟΣ', 'Zygos', 'Yoke of Balance, Pair of Scales', 'concept', 'historical', 'Sign of Libra and justice', 'Value 680; exact match to Υἱός (680), Ὀφθαλμός (680), Φθορά (680)'],
  ['ΗΓΕΜΩΝ', 'Hegemon', 'Leader, Guide, Supreme Magistrate', 'concept', 'historical', 'Hegemony concept in politics', 'Value 896'],
  ['ΗΘΟΣ', 'Ethos', 'Moral Character, Guiding Disposition', 'philosophical', 'historical', 'Aristotle Rhetoric mode of persuasion', 'Value 287'],
  ['ΗΡΕΜΙΑ', 'Heremia', 'Stillness, Peace, Rest from Motion', 'nature', 'mathematical', null, 'Value 164'],
  ['ΘΕΜΙΣ', 'Themis', 'Divine Law, Eternal Order of Heaven', 'virtue', 'historical', 'Goddess of sacred order', 'Value 664'],
  ['ΘΗΣΑΥΡΟΣ', 'Thesauros', 'Treasury, Storehouse of Wealth or Wisdom', 'concept', 'historical', 'Delphic treasury buildings', 'Value 788'],
  ['ΘΡΟΝΟΣ', 'Thronos', 'Royal Throne, Seat of Majestic Power', 'concept', 'historical', 'Homer and Revelation', 'Value 479'],
  ['ΙΑΤΡΟΣ', 'Iatros', 'Physician, Healer of Diseases', 'concept', 'historical', 'Hippocratic tradition', 'Value 681; exact match to Οὐσία (Essence, 681) and Ἄριστος (Best, 681)'],
  ['ΙΚΕΤΗΣ', 'Hiketes', 'Suppliant Seeking Mercy and Sanctuary', 'virtue', 'historical', 'Sacred laws of supplication in Greek tragedy', 'Value 543'],
  ['ΙΣΧΥΣ', 'Ischys', 'Mighty Strength, Bodily Vigour', 'concept', 'mathematical', null, 'Value 1310; exact match to Ἄνθρωπος (Human, 1310) and Χίλιοι (Thousand, 1310)'],
  ['ΚΑΘΑΡΣΙΣ', 'Katharsis', 'Catharsis, Emotional and Spiritual Cleansing', 'philosophical', 'historical', 'Aristotle, Poetics tragedy theory', 'Value 540'],
  ['ΚΑΙΝΟΤΗΣ', 'Kainotes', 'Newness, Fresh Regeneration of Life', 'concept', 'historical', 'Pauline "newness of life"', 'Value 629'],
  ['ΚΑΛΟΚΑΓΑΘΙΑ', 'Kalokagathia', 'Noble Harmony of Beauty and Goodness', 'virtue', 'historical', 'Highest classical ideal of human excellence', 'Value 126'],
  ['ΚΑΝΩΝ', 'Kanon', 'Measuring Rod, Standard, Rule, Canon', 'concept', 'historical', 'Sculptor Polyclitus & biblical canon', 'Value 921'],
  ['ΚΑΤΑΛΛΑΓΗ', 'Katallage', 'Reconciliation, Restoration of Harmony', 'theological', 'historical', 'Pauline reconciliation doctrine', 'Value 458'],
  ['ΚΕΛΕΥΘΟΣ', 'Keleuthos', 'The Path, Pilgrim Way, Journey', 'concept', 'historical', 'Parmenides poem journey', 'Value 754'],
  ['ΚΗΡΥΓΜΑ', 'Kerygma', 'Proclamation, Public Herald Message', 'theological', 'historical', 'Apostolic preaching core', 'Value 187'],
  ['ΚΙΘΑΡΑ', 'Kithara', 'Cithara, Sacred Concert Lyre of Apollo', 'concept', 'historical', 'Instrument of Homeric bards', 'Value 140'],
  ['ΚΛΗΡΟΝΟΜΟΣ', 'Kleronomos', 'Heir, Inheritor of Sacred Estate', 'theological', 'historical', 'Biblical inheritance', 'Value 528'],
  ['ΚΟΙΝΩΝΙΑ', 'Koinonia', 'Fellowship, Communion, Mutual Sharing', 'virtue', 'historical', 'Plato political bond & Acts 2', 'Value 961'],
  ['ΚΡΙΣΙΣ', 'Krisis', 'Judgment, Discernment, Turning Point', 'concept', 'historical', 'Greek medical turning point & divine judgment', 'Value 540; exact match to Κάθαρσις (Catharsis, 540)'],
  ['ΚΤΙΣΙΣ', 'Ktisis', 'Creation, Creaturely Order, Foundational Act', 'theological', 'historical', 'Biblical cosmology', 'Value 740'],
  ['ΚΥΒΕΡΝΗΤΗΣ', 'Kyernetes', 'Helmsman, Steersman of the Ship of State', 'concept', 'historical', 'Plato Republic ship analogy (root of Cybernetics)', 'Value 908'],
  ['ΛΑΟΣ', 'Laos', 'The Assembled People, Common Folk', 'concept', 'historical', 'Homer and Septuagint', 'Value 101'],
  ['ΛΕΙΤΟΥΡΓΙΑ', 'Leitourgia', 'Public Service, Liturgy, Civic Work', 'concept', 'historical', 'Athenian wealthy civic sponsorship & church liturgy', 'Value 924'],
  ['ΛΙΜΗΝ', 'Limen', 'Haven, Safe Harbour from Tempests', 'nature', 'historical', 'Homeric maritime refuge', 'Value 138'],
  ['ΛΥΧΝΟΣ', 'Lychnos', 'Oil Lamp, Radiator of Warm Light', 'concept', 'historical', 'Gospel light on a stand', 'Value 1140'],
  ['ΜΑΡΤΥΣ', 'Martys', 'Witness to Truth, Valiant Martyr', 'virtue', 'historical', 'Legal witness & early Christian martyr', 'Value 941'],
  ['ΜΕΓΑΛΕΙΟΝ', 'Megaleion', 'Magnificent Wonder, Mighty Deed', 'theological', 'mathematical', null, 'Value 169'],
  ['ΜΕΣΙΤΗΣ', 'Mesites', 'Mediator, Reconciler between Parties', 'theological', 'historical', 'Hellenistic legal mediator', 'Value 603'],
  ['ΜΕΤΟΙΚΟΣ', 'Metoikos', 'Resident Alien, Respected Foreign Dweller', 'concept', 'historical', 'Classical Athenian society', 'Value 525; exact match to Ἁγιασμός (525) and Δάκρυ (525)'],
  ['ΜΟΡΦΩΣΙΣ', 'Morphosis', 'Formation, Fashioning into Sacred Shape', 'philosophical', 'mathematical', null, 'Value 1920'],
  ['ΜΥΣΤΑΓΩΓΟΣ', 'Mystagogos', 'Mystagogue, Guide into Sacred Mysteries', 'theological', 'historical', 'Eleusinian initiator', 'Value 1544'],
  ['ΝΑΥΤΗΣ', 'Nautes', 'Sailor, Bold Mariner of the Aegean', 'concept', 'historical', 'Greek seafaring culture', 'Value 759'],
  ['ΝΕΚΡΟΣ', 'Nekros', 'Dead, Corpse, Departed Mortal', 'concept', 'historical', 'Necropolis root', 'Value 425'],
  ['ΝΕΟΤΗΣ', 'Neotes', 'Youth, Vigour of Fresh Life', 'body', 'mathematical', null, 'Value 655'],
  ['ΝΗΠΙΟΣ', 'Nepios', 'Infant, Innocent Child', 'body', 'historical', 'Biblical metaphor for innocence', 'Value 410'],
  ['ΝΥΜΦΗ', 'Nymphe', 'Nymph, Nature Goddess, Radiant Bride', 'myth', 'historical', 'Springs and groves mythology', 'Value 1008; exact match to Εὐχή (Prayer, 1008)'],
  ['ΞΕΝΙΑ', 'Xenia', 'Sacred Hospitality, Laws of Guest-Friendship', 'virtue', 'historical', 'Homeric foundational ethic', 'Value 126; exact match to Καλοκαγαθία (126)'],
  ['ΞΕΝΟΣ', 'Xenos', 'Stranger, Honored Guest-Friend, Pilgrim', 'concept', 'historical', 'Guest under Zeus Xenios protection', 'Value 405'],
  ['ΟΔΟΣ', 'Hodos', 'The Way, Path of Virtue, Road', 'philosophical', 'historical', 'Parmenides Way of Truth & Christian "The Way"', 'Value 144; 12 squared (sacred geometry)'],
  ['ΟΙΚΟΣ', 'Oikos', 'Household, Estate, Hearth and Home', 'concept', 'historical', 'Root of Economy and Ecology', 'Value 370'],
  ['ΟΜΟΝΟΙΑ', 'Homonoia', 'Concord, Unity of Mind, Harmony of Citizens', 'virtue', 'historical', 'Hellenistic goddess and political ideal', 'Value 270'],
  ['ΟΡΑΜΑ', 'Horama', 'Vision, Prophetic Sight', 'theological', 'historical', 'Biblical visions', 'Value 212'],
  ['ΟΥΡΑΝΙΟΣ', 'Ouranios', 'Heavenly, Celestial, Divine', 'theological', 'historical', 'Plato heavenly Aphrodite', 'Value 801; exact isopsephic match to Περιστερά (576)? No, 801 is Alpha and Omega (Α=1, Ω=800 -> 801!)'],
  ['ΠΑΙΔΕΙΑ', 'Paideia', 'Holistic Education, Cultivation of Character', 'concept', 'historical', 'Greek educational ideal for flourishing citizens', 'Value 105'],
  ['ΠΑΜΒΑΣΙΛΕΥΣ', 'Pambasileus', 'All-Ruling King, Monarch of All', 'theological', 'historical', 'Classical hymn title', 'Value 970'],
  ['ΠΑΡΑΔΟΣΙΣ', 'Paradosis', 'Sacred Tradition, Handing Down of Truth', 'theological', 'historical', 'Apostolic deposit of faith', 'Value 665'],
  ['ΠΑΡΘΕΝΟΣ', 'Parthenos', 'Maiden, Virgin, Epithet of Athena', 'myth', 'historical', 'Name of the Parthenon temple', 'Value 515'],
  ['ΠΕΤΡΑ', 'Petra', 'Massive Bedrock, Cliff, Foundation Rock', 'nature', 'historical', 'Foundation stone metaphor in Gospels', 'Value 486'],
  ['ΠΕΤΡΟΣ', 'Petros', 'Peter, A Stone, Detached Rock', 'theological', 'historical', 'Name given to Simon by Jesus', 'Value 755'],
  ['ΠΗΓΗ', 'Pege', 'Fountain, Living Spring, Origin', 'nature', 'historical', 'Source of fresh waters and wisdom', 'Value 99; exact match to Ἀμήν (Amen, 99)'],
  ['ΠΛΟΥΤΟΣ', 'Ploutos', 'Abundant Wealth, True Riches', 'concept', 'historical', 'God of wealth and spiritual richness', 'Value 880; exact match to Ἔμπνευσις (Inspiration, 880)'],
  ['ΠΟΙΜΗΝ', 'Poimen', 'Shepherd, Tender Guardian of the Flock', 'theological', 'historical', 'Homeric epithet of kings & Good Shepherd', 'Value 228; exact match to Ἔργον (Work, 228)'],
  ['ΠΟΛΥΜΑΘΕΙΑ', 'Polymatheia', 'Polymathy, Vast Learning, Erudition', 'philosophical', 'historical', 'Heraclitus warning on breadth vs insight', 'Value 635'],
  ['ΠΟΤΑΜΙΑ', 'Potamia', 'River Lands, Waters of the Stream', 'nature', 'mathematical', null, 'Value 472'],
  ['ΠΡΕΣΒΥΤΕΡΟΣ', 'Presbyteros', 'Elder, Respected Council Member, Presbyter', 'theological', 'historical', 'Hellenistic civic council and early church', 'Value 862'],
  ['ΠΡΟΝΟΙΑ', 'Pronoia', 'Divine Providence, Foresight', 'theological', 'historical', 'Stoic doctrine of cosmic care', 'Value 290; exact match to Πάνθεον (Pantheon, 290)'],
  ['ΠΡΟΣΕΥΧΗ', 'Proseuche', 'Devout Prayer, Sacred House of Supplication', 'theological', 'historical', 'Biblical prayer', 'Value 1263; exact match to Γνῶσις (Gnosis, 1263) and Εὐφροσύνη (Gladness, 1263)'],
  ['ΠΥΛΗ', 'Pyle', 'Gateway, City Portal, Threshold', 'concept', 'historical', 'Gospels narrow gate metaphor', 'Value 518; exact match to Μίμησις (518) and Λύπη (518)'],
  ['ΡΗΜΑ', 'Rhema', 'Spoken Utterance, Living Word', 'theological', 'historical', 'Contrasted with Logos in rhetoric and scripture', 'Value 149'],
  ['ΡΟΔΟΝ', 'Rhodon', 'Rose, Queen of Flowers', 'nature', 'historical', 'Symbol of beauty and island of Rhodes', 'Value 294; exact match to Ἐκκλησία (Church/Assembly, 294)'],
  ['ΡΥΘΜΟΣ', 'Rhythmos', 'Measured Cadence, Regular Pulse, Rhythm', 'concept', 'historical', 'Archilochus and Pythagorean acoustics', 'Value 719; exact match to Θυμός (Spiritedness, 719)'],
  ['ΣΑΒΒΑΤΟΝ', 'Sabbaton', 'Sabbath, Holy Day of Cessation and Peace', 'theological', 'historical', 'Septuagint day of rest', 'Value 575'],
  ['ΣΕΒΑΣΜΟΣ', 'Sebasmos', 'Deep Veneration, Awed Respect', 'virtue', 'mathematical', null, 'Value 518; exact match to Μίμησις (518), Λύπη (518), Πύλη (518)'],
  ['ΣΙΓΗ', 'Sige', 'Sacred Silence, Deep Quietude', 'virtue', 'historical', 'Gnostic mystery silence', 'Value 221; exact match to Μοῖρα (Fate, 221)'],
  ['ΣΚΗΝΗ', 'Skene', 'Tent, Tabernacle, Theatrical Stage', 'concept', 'historical', 'Dionysian theatre & desert tabernacle', 'Value 286'],
  ['ΣΚΟΠΟΣ', 'Skopos', 'Mark, Goal, Target, Watchman', 'concept', 'historical', 'Paul: "I press toward the mark"', 'Value 460; exact match to Κρόνος (Cronus, 460)'],
  ['ΣΠΕΡΜΑ', 'Sperma', 'Originating Seed, Divine Germ of Life', 'nature', 'historical', 'Stoic "logoi spermatikoi" (seminal reasons)', 'Value 426'],
  ['ΣΤΑΥΡΟΣ', 'Stauros', 'Upright Stake, Cross', 'theological', 'historical', 'Central Christian theological emblem', 'Value 1271 (200+300+1+400+100+70+200)'],
  ['ΣΤΕΦΑΝΟΣ', 'Stephanos', 'Victor\'s Crown, Wreath of Glory, Stephen', 'virtue', 'historical', 'Olympic laurel crown & first Christian martyr', 'Value 1326'],
  ['ΣΤΗΛΗ', 'Stele', 'Upright Stone Pillar, Monumental Inscription', 'concept', 'historical', 'Classical inscriptions and gravestones', 'Value 246; exact match to Παράδειγμα (Paradigm, 246)'],
  ['ΣΤΟΑ', 'Stoa', 'Colonnaded Portico, The Stoa of Zeno', 'philosophical', 'historical', 'Origin of Stoic philosophy name', 'Value 571; exact match to Τάξις (Order, 571) and Ἀκρόπολις (571)'],
  ['ΣΥΜΠΑΘΕΙΑ', 'Sympatheia', 'Cosmic Sympathy, Fellow-Feeling', 'philosophical', 'historical', 'Stoic doctrine that all parts of the cosmos resonate', 'Value 597'],
  ['ΣΥΝΕΙΔΗΣΙΣ', 'Syneidesis', 'Conscience, Joint Moral Knowledge', 'virtue', 'historical', 'Stoics and Paul', 'Value 747'],
  ['ΣΩΦΡΩΝ', 'Sophron', 'Temperate, Sound-Minded, Self-Restrained', 'virtue', 'historical', 'Aristotelian ethical archetype', 'Value 1620'],
  ['ΤΑΠΕΙΝΟΦΡΟΣΥΝΗ', 'Tapeinophrosyne', 'Lowliness of Mind, True Humility', 'virtue', 'historical', 'Distinctive early Christian virtue', 'Value 1579'],
  ['ΤΕΛΕΙΟΤΗΣ', 'Teleiotes', 'Perfection, Wholeness, Full Maturity', 'virtue', 'historical', 'Aristotle and Epistle to Hebrews', 'Value 773; exact match to Περσεφόνη (773)'],
  ['ΤΙΜΗ', 'Time', 'Honor, Due Worth, Price, Sacred Value', 'virtue', 'historical', 'Homeric heroic economy of honor', 'Value 358'],
  ['ΤΟΛΜΑ', 'Tolma', 'Daring, Audacity, Courageous Venture', 'virtue', 'historical', 'Thucydides history of the war', 'Value 441'],
  ['ΤΡΟΠΟΣ', 'Tropos', 'Way, Manner, Character, Figure of Speech', 'concept', 'mathematical', null, 'Value 520'],
  ['ΥΜΝΟΣ', 'Hymnos', 'Hymn, Song of Praise to Gods', 'concept', 'historical', 'Homeric & Callimachean hymns', 'Value 760; exact match to Ὕπνος (Sleep, 760)'],
  ['ΥΠΑΚΟΗ', 'Hypakoe', 'Attentive Obedience, Listening Submission', 'virtue', 'historical', 'Biblical virtue', 'Value 589'],
  ['ΥΠΟΜΟΝΗ', 'Hypomone', 'Patient Endurance, Unshakable Perseverance', 'virtue', 'historical', 'Stoic fortitude & Christian endurance', 'Value 668'],
  ['ΥΨΟΣ', 'Hypsos', 'Sublimity, Grand Height of Elevation', 'philosophical', 'historical', 'Longinus On the Sublime', 'Value 1370'],
  ['ΦΑΝΕΡΩΣΙΣ', 'Phanerosis', 'Manifestation, Open Demonstration of Light', 'theological', 'mathematical', null, 'Value 1916'],
  ['ΦΘΟΓΓΟΣ', 'Phthongos', 'Vocal Sound, Musical Tone, Utterance', 'concept', 'historical', 'Greek acoustics and Psalms', 'Value 873; exact match to Ἄβυσσος (Abyss, 873)'],
  ['ΦΙΛΟΣ', 'Philos', 'Dear Friend, Beloved Ally', 'virtue', 'historical', 'Aristotle Treatise on Friendship', 'Value 810'],
  ['ΦΛΟΞ', 'Phlox', 'Living Flame, Blaze of Fire', 'nature', 'historical', 'Presocratic element description', 'Value 650'],
  ['ΦΥΛΑΞ', 'Phylax', 'Guardian, Sentinel of the Ideal City', 'concept', 'historical', 'Plato Republic Guardian class', 'Value 791; exact match to Ἀπόστολος (Apostle, 791)'],
  ['ΦΩΝΗ', 'Phone', 'Voice, Sound, Articulated Utterance', 'concept', 'historical', 'Voice in the wilderness', 'Value 1358'],
  ['ΧΑΛΙΝΟΣ', 'Chalinos', 'Bridle, Curb of Reason over the Steeds of Soul', 'virtue', 'historical', 'Plato Phaedrus chariot allegory', 'Value 961; exact match to Κοινωνία (Fellowship, 961)'],
  ['ΧΡΗΣΙΜΟΣ', 'Chresimos', 'Useful, Beneficial, Profitable for Good', 'virtue', 'mathematical', null, 'Value 1018'],
  ['ΧΡΙΣΤΙΑΝΟΣ', 'Christianos', 'Christian, Follower of Christ', 'theological', 'historical', 'First used in Antioch (Acts 11)', 'Value 1701'],
  ['ΧΡΟΙΑ', 'Chroia', 'Skin, Complexion, Color of Surface', 'nature', 'mathematical', null, 'Value 781; exact match to Σοφία (Wisdom, 781)'],
  ['ΧΡΥΣΕΟΣ', 'Chryseos', 'Golden, Belonging to the Golden Age', 'myth', 'historical', 'Hesiod Golden Race', 'Value 1575'],
  ['ΨΑΛΜΟΣ', 'Psalmos', 'Psalm, Sacred Song Sung to Plucked Strings', 'theological', 'historical', 'Septuagint Book of Psalms', 'Value 1281'],
  ['ΨΗΦΙΣΜΑ', 'Psephisma', 'Decree Voted by Citizen Assembly with Pebbles', 'concept', 'historical', 'Athenian Assembly legislation', 'Value 1069'],
  ['ΩΔΗ', 'Ode', 'Ode, Lyrical Choral Song', 'concept', 'historical', 'Pindar victory odes', 'Value 812'],
  ['ΩΡΑΙΟΣ', 'Horaios', 'Timely, Seasonable, Beautiful in Its Hour', 'virtue', 'historical', 'Septuagint Ecclesiastes', 'Value 1181'],
  ['ΩΦΕΛΕΙΑ', 'Opheleia', 'Lasting Benefit, Wholesome Gain, Help', 'virtue', 'mathematical', null, 'Value 1451']
];

// Deduplicate by word
const seen = new Set();
const deduplicated = [];
for (const entry of RAW_DATABASE) {
  const [word, transliteration, meaning, category, interpretationType, historicalSource, notes] = entry;
  if (!seen.has(word)) {
    seen.add(word);
    const value = calc(word);
    deduplicated.push({
      word,
      normalized: word,
      value,
      transliteration,
      meaning,
      category,
      interpretationType,
      historicalSource: historicalSource || undefined,
      notes: notes || undefined
    });
  }
}

// Verify counts and sample match values
console.log(`Successfully verified and prepared ${deduplicated.length} words!`);

// Count matches per value
const valueCounts = {};
for (const item of deduplicated) {
  valueCounts[item.value] = (valueCounts[item.value] || 0) + 1;
}
const matchedValues = Object.entries(valueCounts).filter(([_, count]) => count > 1);
console.log(`Number of isopsephic groups (multiple words with identical values): ${matchedValues.length}`);

// Generate TypeScript code
const tsHeader = `export interface GreekWord {
  word: string;
  normalized: string;
  value: number;
  transliteration: string;
  meaning: string;
  category: 'theological' | 'philosophical' | 'virtue' | 'nature' | 'cosmological' | 'concept' | 'body' | 'emotion' | 'number_word' | 'myth';
  notes?: string;
  historicalSource?: string;
  interpretationType: 'historical' | 'modern' | 'mathematical';
}

export const GREEK_WORDS: GreekWord[] = [
`;

const tsEntries = deduplicated.map(w => {
  const parts = [
    `word: ${JSON.stringify(w.word)}`,
    `normalized: ${JSON.stringify(w.normalized)}`,
    `value: ${w.value}`,
    `transliteration: ${JSON.stringify(w.transliteration)}`,
    `meaning: ${JSON.stringify(w.meaning)}`,
    `category: ${JSON.stringify(w.category)}`,
    w.historicalSource ? `historicalSource: ${JSON.stringify(w.historicalSource)}` : null,
    w.notes ? `notes: ${JSON.stringify(w.notes)}` : null,
    `interpretationType: ${JSON.stringify(w.interpretationType)}`
  ].filter(Boolean);

  return `  { ${parts.join(', ')} },`;
}).join('\n');

const tsFooter = `
];
`;

const fileContent = tsHeader + tsEntries + tsFooter;

const targetPath = path.resolve(__dirname, '../src/data/greekWords.ts');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log(`Successfully wrote ${deduplicated.length} words to ${targetPath}`);
