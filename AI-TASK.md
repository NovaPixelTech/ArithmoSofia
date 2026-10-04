Build a polished, modern, mobile-first web application called:

**Hellenic Isopsephy Explorer**

The application explores Greek isopsephy (ἰσοψηφία), the historical practice of assigning numerical values to Greek letters and calculating the numerical value of words and phrases.

IMPORTANT:
This application must clearly distinguish between:

1. Mathematical calculations
2. Historical information
3. Modern symbolic/numerological interpretations

Do NOT present numerological interpretations as scientific facts or historically proven conclusions.

---

## 1. TECH STACK

First inspect the existing project and preserve the current architecture if this is an existing project.

If starting from scratch, use:

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide icons
* Local/static data only for the initial version
* No backend required
* No authentication required
* No external API required

The application must work perfectly on desktop and mobile.

---

# 2. MAIN USER EXPERIENCE

The homepage should immediately present a beautiful calculator.

Hero title:

**Hellenic Isopsephy Explorer**

Subtitle:

**Discover the numerical value and symbolic connections hidden within Greek words.**

Add a large Greek text input:

Placeholder:

**Enter a Greek word or phrase…**

Examples:

ΘΕΟΣ
ΑΓΑΠΗ
ΛΟΓΟΣ
ΣΟΦΙΑ
ΦΩΣ
ΝΟΥΣ

Primary button:

**Calculate**

Add a secondary button:

**Explore a random word**

---

# 3. GREEK LETTER NUMERICAL SYSTEM

Implement the standard Greek numeral values:

α = 1
β = 2
γ = 3
δ = 4
ε = 5
ϛ/στ = 6
ζ = 7
η = 8
θ = 9

ι = 10
κ = 20
λ = 30
μ = 40
ν = 50
ξ = 60
ο = 70
π = 80
ϟ = 90

ρ = 100
σ/ς = 200
τ = 300
υ = 400
φ = 500
χ = 600
ψ = 700
ω = 800

The UI should support both σ and final ς as sigma with value 200.

Normalize uppercase/lowercase Greek automatically.

Accents and tonos should not affect the numerical calculation.

For example:

ΘΕΟΣ
θεος
Θεός

must all calculate to the same value.

Handle spaces and punctuation gracefully.

---

# 4. LETTER-BY-LETTER BREAKDOWN

After calculation, display a visual breakdown.

Example:

ΘΕΟΣ

Θ → 9
Ε → 5
Ο → 70
Σ → 200

Then show:

**9 + 5 + 70 + 200 = 284**

Large result:

### 284

Use animated counting when the result appears.

---

# 5. SAME-VALUE WORDS

Create a local dataset of Greek words and their calculated values.

When the user searches for a word, automatically find other words in the dataset with the exact same numerical value.

Example:

ΘΕΟΣ → 284

Potential related entries:

ΑΓΙΟΣ → 284
ΑΓΑΘΟΣ → 284

Display:

### Same Numerical Value

[ ΑΓΙΟΣ ] 284
[ ΑΓΑΘΟΣ ] 284

Each result should be clickable and should run the calculator for that word.

IMPORTANT:

Only include same-value relationships that are mathematically verified by the application.

Do not invent relationships.

---

# 6. DIGITAL ROOT

Calculate the digital root of the resulting number.

Example:

284 → 2 + 8 + 4 = 14
14 → 1 + 4 = 5

Display:

**Digital root: 5**

Include a small info tooltip explaining that digital roots are a mathematical operation and are NOT part of the original ancient Greek numeral system.

---

# 7. NUMBER PROPERTIES

Create a section:

### Number Properties

Show useful mathematical properties such as:

* Even / Odd
* Prime / Composite
* Divisibility
* Factorization where practical
* Digital root

Do not assign mystical meanings automatically.

---

# 8. SYMBOLIC INTERPRETATION

Create a separate section clearly labelled:

### Symbolic Interpretation

This section must visually distinguish itself from the mathematical calculation.

For example:

**284**

Possible modern symbolic interpretation:
"Some modern numerological traditions may associate this number with..."

But do not state symbolic interpretations as scientific facts.

Add a small label:

**Modern symbolic interpretation — not scientific evidence**

---

# 9. HISTORICAL CONTEXT

Create an expandable section:

### Historical Context

Explain briefly:

* What is Greek isopsephy?
* How Greek letters were used numerically
* The relationship with ancient Greek writing
* The later use of isopsephy in Greek and early Christian contexts
* The difference between historical isopsephy and modern numerology

Use neutral language.

Do not claim that numerical equality proves a semantic or philosophical relationship between words.

---

# 10. FAMOUS EXAMPLES

Create a section:

### Famous Greek Isopsephy Examples

Include verified examples such as:

ΘΕΟΣ → 284
ΑΓΙΟΣ → 284
ΑΓΑΘΟΣ → 284

ΝΟΥΣ → 720
ΤΟΠΟΣ → 720

ΣΟΦΙΑ → 781

ΙΗΣΟΥΣ → 888

Each card should show:

Word
Greek spelling
Numerical value
Letter breakdown

IMPORTANT:
Verify every numerical value mathematically before displaying it.

---

# 11. WORD COMPARISON MODE

Add a dedicated feature:

### Compare Two Words

Two input fields:

Word A
Word B

Button:

**Compare**

Show:

* Numerical value of A
* Numerical value of B
* Difference
* Whether they are isopsephic
* Letter-by-letter calculations

If equal:

Display:

**Same numerical value**

If different:

Display:

**Different numerical values**

Do NOT call two words "related" merely because they have the same numerical value.

---

# 12. PHRASE CALCULATOR

Allow complete Greek phrases.

Example:

Ο ΛΟΓΟΣ

The application should calculate every valid Greek letter while ignoring spaces and punctuation.

Show both:

**Word values**

and

**Total phrase value**

This should make the application useful for exploring historical examples of Greek isopsephy.

---

# 13. SEARCH / DISCOVERY

Add:

### Discover by Number

Input:

**Enter a number**

Example:

284

Then show every word in the local dataset with that value.

This should work in reverse:

Number → Words

rather than only:

Word → Number.

---

# 14. RANDOM DISCOVERY

Add a button:

**I'm Feeling Curious**

It randomly selects a Greek word from the dataset and displays:

* Word
* Value
* Letter breakdown
* Same-value words
* Mathematical properties
* Historical/symbolic notes where available

Make this visually engaging.

---

# 15. SHARE RESULT

Add:

**Share Result**

On supported devices use the Web Share API.

Also provide:

**Copy Result**

The copied text should look like:

Hellenic Isopsephy Explorer

ΘΕΟΣ

Θ=9 + Ε=5 + Ο=70 + Σ=200

Total: 284

Same numerical value:
ΑΓΙΟΣ
ΑΓΑΘΟΣ

Digital root: 5

Historical isopsephy calculation.
Symbolic interpretations are not scientific claims.

---

# 16. DESIGN

Design direction:

Ancient Greek + modern technology.

Do NOT make it look like a cheap "mystical numerology" website.

Use:

* Elegant typography
* Greek-inspired visual details
* Subtle marble/papyrus-inspired surfaces
* Modern cards
* Smooth animations
* Strong contrast
* Large numerical results
* Responsive layout

The interface should feel like:

**Ancient Greek scholarship meets a modern data visualization application.**

Avoid excessive Greek ornaments.

---

# 17. DARK MODE

Implement dark mode.

Dark mode should feel elegant and academic rather than neon/mystical.

Remember the user's preference automatically using localStorage.

---

# 18. NAVIGATION

Create these main sections:

Home
Calculator
Compare
Discover
Famous Examples
About Isopsephy

On mobile use a clean bottom navigation or compact menu.

---

# 19. DATA ARCHITECTURE

Do NOT hard-code relationships directly inside UI components.

Create a structured dataset, for example:

data/greekWords.ts

Each entry should contain:

{
word: "ΘΕΟΣ",
normalized: "ΘΕΟΣ",
value: 284,
category: "concept",
notes: "...",
historicalSource: "...",
interpretationType: "historical"
}

The calculator itself must independently calculate the value.

The dataset value should be used only as a verified lookup/reference value.

Add validation so that the application can detect if:

calculatedValue !== dataset.value

and flag the entry during development.

---

# 20. DATA QUALITY

This is extremely important.

Do NOT fill the database with arbitrary numerological claims.

Every word/value pair must be mathematically verifiable.

For historical claims, distinguish:

Historical evidence
Modern interpretation
User-generated interpretation

Never blur these categories.

---

# 21. ERROR HANDLING

If the user enters:

English letters
Numbers only
Unsupported symbols
Empty input

show a friendly message.

Example:

"Please enter at least one Greek letter."

Do not crash.

---

# 22. SEO

Add basic SEO:

Title:

Hellenic Isopsephy Explorer — Greek Word Numerology & Isopsephy Calculator

Description:

Explore Greek isopsephy, calculate the numerical value of Greek words and phrases, compare words, and discover historically documented numerical relationships.

Use semantic HTML.

Add Open Graph metadata.

---

# 23. PERFORMANCE

The application should feel instant.

Do not introduce unnecessary dependencies.

The calculator must work completely offline after the application loads.

---

# 24. ACCESSIBILITY

Implement:

* Keyboard navigation
* Proper labels
* ARIA labels where appropriate
* Visible focus states
* Good color contrast
* Screen-reader friendly result sections

---

# 25. IMPORTANT CONTENT DISCLAIMER

Add a subtle footer:

"Greek isopsephy is a historical system of assigning numerical values to Greek letters. Numerical equivalence between words is a mathematical observation. Symbolic or numerological interpretations are presented as interpretations, not as scientific evidence."

---

# 26. TESTING

Before declaring the task complete, test at minimum:

ΘΕΟΣ → 284
ΑΓΙΟΣ → 284
ΑΓΑΘΟΣ → 284
ΝΟΥΣ → 720
ΤΟΠΟΣ → 720
ΣΟΦΙΑ → 781
ΙΗΣΟΥΣ → 888

Also test:

* lowercase Greek
* uppercase Greek
* accented Greek
* final sigma ς
* spaces
* punctuation
* phrases
* empty input
* unsupported Latin characters
* mobile layout
* dark mode
* share/copy functionality

If any mathematical result is incorrect, fix the calculation engine before continuing.

---

# 27. GIT / DEVELOPMENT WORKFLOW

Before making changes:

1. Inspect the existing project.
2. Run the current application.
3. Inspect the current Git status.
4. Do not overwrite unrelated existing work.
5. Implement the feature incrementally.
6. Run the application after implementation.
7. Test all calculator examples.
8. Check responsive behavior.
9. Check the browser console for errors.
10. Run the project's available lint/typecheck/build commands.
11. Fix all errors.
12. Show me a concise summary of changed files.
13. Show me the exact Git commands I should use to commit the completed version.

Do NOT automatically push to a remote repository unless I explicitly ask you to.

---

# 28. FINAL QUALITY CHECK

Before finishing, verify:

[ ] Calculator works
[ ] Greek normalization works
[ ] Letter values are correct
[ ] Same-value search works
[ ] Reverse number search works
[ ] Compare mode works
[ ] Phrase calculation works
[ ] Digital root works
[ ] Number properties work
[ ] Famous examples are mathematically verified
[ ] Share/copy works
[ ] Dark mode works
[ ] Mobile layout works
[ ] No console errors
[ ] No TypeScript errors
[ ] Production build succeeds
[ ] No unrelated files were modified

Do not stop at creating the UI.

The application must be fully functional.

After implementation, give me:

1. What you changed
2. What you tested
3. Any remaining limitations
4. Git status
5. Exact commands for commit/push

Do not push unless explicitly instructed.
