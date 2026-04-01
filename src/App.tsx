import { useState } from 'react';
import { Sparkles, Target, Brain, ArrowRight, Layers } from 'lucide-react';
import { generatePlan } from './aiService';

function App() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('');
  const [formData, setFormData] = useState({
    goal: '', time: 60, weakness: '', expertise: 'Intermediate', energy: 'High', notes: ''
  });

  const handleAction = async () => {
    if (!formData.goal) return alert("Please define your mission (Goal)");
    setLoading(true);
    try {
      const result = await generatePlan(formData);
      setPlan(result);
    } catch (err) {
      alert("System Error: Check Vercel API Key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-cyan-500/30">
      <header className="border-b border-white/10 py-6 px-4 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Layers className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              VANN <span className="text-cyan-500">BANN</span>
            </h1>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Infinite Intelligence OS
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Architect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Universe.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Unlearn the system. Reprogram your brain. Access the VANN BANN protocol for peak human performance.
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl shadow-cyan-500/5 transition-all hover:border-cyan-500/20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Target size={14} className="text-cyan-500" /> Defining Mission (Goal)
                </label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="e.g. Master HCS Mathematics Paper"
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Time (Mins)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 text-white"
                    onChange={(e) => setFormData({...formData, time: parseInt(e.target.value)})} value={formData.time}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 text-gray-500">Energy Level</label>
                  <select 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 text-white"
                    value={formData.energy}
                    onChange={(e) => setFormData({...formData, energy: e.target.value})}
                  >
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Brain size={14} className="text-blue-500" /> Neural Blockers (Weakness)
                </label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white"
                  placeholder="e.g. Procrastination, Complex Integration"
                  value={formData.weakness}
                  onChange={(e) => setFormData({...formData, weakness: e.target.value})}
                />
              </div>
              <button 
                onClick={handleAction}
                disabled={loading}
                className="w-full h-14 mt-8 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Initializing Protocol..." : "Activate VANN BANN AI"}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {plan && (
          <div className="mt-12 bg-white/5 border border-cyan-500/30 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-400">
              <Sparkles size={20} /> Optimized Intelligence Plan
            </h3>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300 leading-relaxed">
              {plan}
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm italic">
        © 2026 VANN BANN. Part of the Infinite Human Evolution Project.
      </footer>
    </div>
  );
}

export default App;
