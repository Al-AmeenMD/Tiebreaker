import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Scale, 
  Table as TableIcon, 
  Target, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { analyzeDecision } from './services/gemini';
import { DecisionAnalysis } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [decision, setDecision] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAnalyze = async () => {
    if (!decision.trim()) {
      setError('Please describe the decision you need to make.');
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      const filteredOptions = options.filter(opt => opt.trim() !== '');
      const result = await analyzeDecision(decision, filteredOptions);
      setAnalysis(result);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <header className="pt-20 pb-12 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-xs font-medium mb-6 tracking-wider uppercase">
            <Sparkles className="w-3 h-3" />
            AI-Powered Decision Strategist
          </div>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tight mb-6">
            Tiebreaker
          </h1>
          <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
            Turn uncertainty into clarity. Provide your dilemma, and let AI dissect the variables for a better choice.
          </p>
        </motion.div>
      </header>

      <main className="px-6 max-w-4xl mx-auto space-y-12">
        {/* Input Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <label className="text-sm font-semibold uppercase tracking-widest text-zinc-400">The Decision</label>
            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder="e.g., Should I move to a new city for a job offer?"
              className="w-full min-h-[120px] p-6 text-xl font-light bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all resize-none placeholder:text-zinc-300"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Options (Optional)</label>
              <button 
                onClick={handleAddOption}
                className="flex items-center gap-1 text-xs font-bold text-zinc-900 hover:opacity-70 transition-opacity"
              >
                <Plus className="w-3 h-3" /> ADD OPTION
              </button>
            </div>
            <div className="grid gap-3">
              {options.map((option, index) => (
                <motion.div 
                  key={index}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative"
                >
                  <input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="w-full p-4 pr-12 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                  />
                  {options.length > 1 && (
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-zinc-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Variables...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Analysis
                </>
              )}
            </button>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Results Section */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              id="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-16 pt-12 border-t border-zinc-100"
            >
              {/* Summary & Recommendation */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-serif italic">The Verdict</h2>
                </div>
                <div className="p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100 space-y-4">
                  <p className="text-xl font-medium text-emerald-900 leading-relaxed">
                    {analysis.recommendation}
                  </p>
                  <p className="text-zinc-600 leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>
              </section>

              {/* Pros & Cons */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-serif italic">Pros & Cons</h2>
                </div>
                <div className="grid gap-8">
                  {analysis.prosCons.map((item, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-lg font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <span className="w-6 h-[1px] bg-zinc-200" />
                        {item.option}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                          <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">Advantages</h4>
                          <ul className="space-y-3">
                            {item.pros.map((pro, i) => (
                              <li key={i} className="flex gap-3 text-zinc-600 text-sm leading-relaxed">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                          <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4">Disadvantages</h4>
                          <ul className="space-y-3">
                            {item.cons.map((con, i) => (
                              <li key={i} className="flex gap-3 text-zinc-600 text-sm leading-relaxed">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Comparison Table */}
              {analysis.comparisonTable && (
                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
                      <TableIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-serif italic">Direct Comparison</h2>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-zinc-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50">
                          {analysis.comparisonTable.headers.map((header, i) => (
                            <th key={i} className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-100">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.comparisonTable.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                            {row.map((cell, j) => (
                              <td key={j} className="p-4 text-sm text-zinc-600 border-b border-zinc-100">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* SWOT Analysis */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-serif italic">SWOT Analysis</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-zinc-900 text-white rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Strengths</h4>
                    <ul className="space-y-2">
                      {analysis.swotAnalysis.strengths.map((s, i) => (
                        <li key={i} className="text-sm opacity-90 flex gap-2">
                          <ChevronRight className="w-4 h-4 shrink-0 text-emerald-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-zinc-100 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Weaknesses</h4>
                    <ul className="space-y-2">
                      {analysis.swotAnalysis.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-zinc-600 flex gap-2">
                          <ChevronRight className="w-4 h-4 shrink-0 text-red-400" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-zinc-100 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Opportunities</h4>
                    <ul className="space-y-2">
                      {analysis.swotAnalysis.opportunities.map((o, i) => (
                        <li key={i} className="text-sm text-zinc-600 flex gap-2">
                          <ChevronRight className="w-4 h-4 shrink-0 text-blue-400" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-zinc-900 text-white rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Threats</h4>
                    <ul className="space-y-2">
                      {analysis.swotAnalysis.threats.map((t, i) => (
                        <li key={i} className="text-sm opacity-90 flex gap-2">
                          <ChevronRight className="w-4 h-4 shrink-0 text-orange-400" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <div className="pt-12 text-center">
                <button 
                  onClick={() => {
                    setAnalysis(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors font-medium"
                >
                  Start a new analysis <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-32 py-12 border-t border-zinc-100 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
          Crafted with Intelligence & Precision
        </p>
      </footer>
    </div>
  );
}
