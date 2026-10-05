export default function AboutIsopsephy() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-stone-800 p-6 md:p-10 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700">
        <h2 className="text-3xl font-serif font-bold mb-6">About Greek ArithmoSofia</h2>
        
        <div className="prose prose-stone dark:prose-invert max-w-none space-y-6">
          <p>
            <strong>ArithmoSofia</strong> (from Greek ἴσος <em>isos</em> meaning "equal" and ψῆφος <em>psephos</em> meaning "pebble") is the practice of adding up the number values of the letters in a word to form a single total.
          </p>

          <p>
            The ancient Greeks used their alphabet as their system of numerals. Every letter had a specific numerical value. Therefore, any word could also be read as a number.
          </p>

          <h3 className="text-xl font-serif font-bold pt-4">The Greek Numeral System</h3>
          <p>
            The standard system uses 27 letters (the 24 standard letters plus three obsolete ones: digamma/stigma, koppa, and sampi) divided into three groups of nine:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Units (1-9):</strong> α=1, β=2, γ=3, δ=4, ε=5, ϛ=6, ζ=7, η=8, θ=9</li>
            <li><strong>Tens (10-90):</strong> ι=10, κ=20, λ=30, μ=40, ν=50, ξ=60, ο=70, π=80, ϟ=90</li>
            <li><strong>Hundreds (100-800):</strong> ρ=100, σ/ς=200, τ=300, υ=400, φ=500, χ=600, ψ=700, ω=800</li>
          </ul>

          <h3 className="text-xl font-serif font-bold pt-4">Historical Use</h3>
          <p>
            Isopsephy was used for scholarly, mystical, and recreational purposes. If two words had the same numerical value, they were considered to be connected in some meaningful way. This practice was widespread in the Hellenistic world, particularly in Alexandria, and heavily influenced early Christian literature and Jewish Gematria.
          </p>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mt-8 italic">
            <strong>Modern symbolic interpretation — not scientific evidence.</strong>
            <p className="mt-2 text-sm text-amber-900 dark:text-amber-200">
              This tool presents isopsephy as a historical and mathematical study. The numerical equivalence between words is a mathematical fact based on the historical system, but any symbolic or numerological meaning derived from these equivalences is a matter of interpretation and belief, not science.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
