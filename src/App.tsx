import React, { useState, useEffect } from 'react';
import { generatePlan } from './aiService';
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"; 
import { db } from './firebase'; 
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function App() {
  const [activeTab, setActiveTab] = useState<'protocol' | 'analytics'>('protocol');
  
  // 🎯 Naye Inputs yahan add kiye hain
  const [goal, setGoal] = useState('');
  const [time, setTime] = useState(120);
  const [weakness, setWeakness] = useState('');
  const [expertise, setExpertise] = useState('Beginner');
  const [energy, setEnergy] = useState('High');
  const [notes, setNotes] = useState('');
  
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Dashboard Stats
  const [totalPlans, setTotalPlans] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalMinutes, setTotalMinutes] = useState<number>(0);

  const fetchStats = async () => {
    try {
      const q = query(collection(db, "vlos_plans"), orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      
      setTotalPlans(querySnapshot.size);

      let aggregatedData: any = {};
      let mins = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateObj = data.createdAt.toDate();
        const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        mins += data.timeAvailable;

        if (!aggregatedData[date]) {
          aggregatedData[date] = { date, minutes: 0, count: 0 };
        }
        aggregatedData[date].minutes += data.timeAvailable;
        aggregatedData[date].count += 1;
      });

      setChartData(Object.values(aggregatedData).slice(-7));
      setTotalMinutes(mins);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [activeTab]);

  const handleGenerate = async () => {
    if (!goal || !weakness) {
      alert("Goal and weakness are required!");
      return;
    }
    
    setLoading(true);
    // 🧠 AI ko naya data bhejna
    const newPlan = await generatePlan(goal, time, weakness, expertise, energy, notes);
    setPlan(newPlan);
    
    if (newPlan) {
      try {
        await addDoc(collection(db, "vlos_plans"), {
          goal, timeAvailable: time, distraction: weakness, 
          expertise, energy, notes, planDetails: newPlan, createdAt: new Date()
        });
        fetchStats(); 
      } catch (e) {
        console.error("Error saving document: ", e);
      }
    }
    setLoading(false);
  };

  const toggleTask = (taskId: string) => {
    setPlan({
      ...plan,
      tasks: plan.tasks.map((task: any) => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    });
  };

  const completedCount = plan?.tasks.filter((t: any) => t.completed).length || 0;
  const progress = plan ? Math.round((completedCount / plan.tasks.length) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-400 text-xs mb-1 uppercase tracking-widest">{label}</p>
          <p className="text-white font-mono font-bold">{payload[0].value} Minutes Logged</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row min-h-screen shadow-2xl bg-zinc-950">
        
        {/* Left Column: Command Center */}
        <div className="w-full md:w-5/12 p-8 lg:p-10 border-b md:border-b-0 md:border-r border-zinc-800/50 flex flex-col relative overflow-hidden h-screen overflow-y-auto custom-scrollbar">
          <div className="absolute top-0 left-0 w-full h-96 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 flex-1">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3">
                V LOS <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              </h1>
              <p className="text-zinc-500 text-sm tracking-wide uppercase font-semibold">System Configuration</p>
            </div>

            <div className="flex gap-2 mb-8 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/80">
              <button onClick={() => setActiveTab('protocol')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'protocol' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>Generator</button>
              <button onClick={() => setActiveTab('analytics')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'analytics' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>Analytics</button>
            </div>

            {activeTab === 'protocol' && (
              <div className="space-y-5 animate-in fade-in duration-500 pb-10">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-400">Primary Objective</label>
                  <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. UPSC, Startup" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-400">Time (Mins)</label>
                    <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-400">Energy Level</label>
                    <select value={energy} onChange={(e) => setEnergy(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                      <option value="High">⚡ High</option>
                      <option value="Medium">🔋 Medium</option>
                      <option value="Low">🪫 Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-400">Expertise</label>
                    <select value={expertise} onChange={(e) => setExpertise(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                      <option value="Beginner">🌱 Beginner</option>
                      <option value="Intermediate">🚀 Intermediate</option>
                      <option value="Expert">👑 Expert</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-400">Obstacle</label>
                    <input type="text" value={weakness} onChange={(e) => setWeakness(e.target.value)} placeholder="e.g. Instagram" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-400">Open Box (Thoughts / Instructions)</label>
                  <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Tell V LOS what's on your mind... e.g., 'Kal mera pharmacy ka exam hai, mujhe MCQ practice karni hai.'" 
                    rows={3}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-all resize-none" 
                  />
                </div>

                <button onClick={handleGenerate} disabled={loading} className="w-full mt-2 bg-white text-black rounded-lg p-4 text-sm font-bold tracking-wide hover:bg-zinc-200 transition-all disabled:opacity-50 flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Initializing...</span>
                    </div>
                  ) : "Deploy Protocol"}
                </button>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Total Deep Work Logged</p>
                  <p className="text-4xl font-light text-white font-mono">{totalMinutes} <span className="text-sm text-zinc-500">mins</span></p>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Protocols Executed</p>
                  <p className="text-4xl font-light text-white font-mono">{totalPlans}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="w-full md:w-7/12 p-8 lg:p-12 bg-zinc-950/80 flex flex-col justify-center relative min-h-screen h-screen overflow-y-auto custom-scrollbar">
          
          {activeTab === 'analytics' && (
            <div className="w-full h-full flex flex-col animate-in fade-in duration-700">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Performance Metrics</h2>
                <p className="text-sm text-zinc-500 mt-1">Your daily deep work volume over the last 7 days.</p>
              </div>
              
              <div className="flex-1 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 min-h-[400px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
                      <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={50}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#6366f1' : '#3f3f46'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-sm">
                    No data logged yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'protocol' && (
            <div className="py-10">
              {!plan && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 space-y-6 min-h-[400px]">
                  <div className="w-24 h-24 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/30">
                    <svg className="w-8 h-8 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <p className="text-sm tracking-widest uppercase font-semibold">Awaiting Parameters</p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center space-y-6 min-h-[400px]">
                  <div className="w-24 h-24 rounded-full border border-indigo-500/30 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-indigo-400 animate-pulse tracking-widest uppercase font-semibold">Synthesizing Path...</p>
                </div>
              )}

              {plan && !loading && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="p-6 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <p className="text-base leading-relaxed text-zinc-300 italic font-serif">"{plan.motivation}"</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Execution Progress</h3>
                      <span className="text-sm font-mono text-white">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="space-y-4 mt-8">
                      {plan.tasks.map((task: any) => (
                        <div key={task.id} onClick={() => toggleTask(task.id)} className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 flex gap-4 ${task.completed ? 'bg-zinc-900/30 border-zinc-800/50 opacity-50 grayscale' : 'bg-zinc-900/80 border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-800/80 hover:-translate-y-1 shadow-lg'}`}>
                          <div className="pt-1">
                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${task.completed ? 'bg-zinc-700 text-zinc-900' : 'border border-zinc-600'}`}>
                              {task.completed && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-sm font-semibold mb-2 transition-colors ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>{task.title}</h4>
                            <div className="flex items-center gap-4 text-xs font-mono">
                              <span className={`flex items-center gap-1.5 ${task.completed ? 'text-zinc-600' : 'text-indigo-400'}`}>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {task.duration}m
                              </span>
                              <span className={`flex items-center gap-1.5 ${task.completed ? 'text-zinc-600' : task.priority === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${task.completed ? 'bg-zinc-600' : task.priority === 'High' ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'}`}></div>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;