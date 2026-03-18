import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Play, Gift, Send, Twitter, Wallet, X, Loader2, Star, Zap, ShieldAlert, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_TASKS = [
  { id: 1, title: 'Join VIP Telegram Channel', reward: 5.00, status: 'completed', type: 'social', icon: <Send size={18} /> },
  { id: 2, title: 'Follow us on Twitter (X)', reward: 3.00, status: 'idle', type: 'social', icon: <Twitter size={18} /> },
  { id: 3, title: 'Play Casino Demo (3 mins)', reward: 10.00, status: 'idle', type: 'game', icon: <Play size={18} /> },
  { id: 4, title: 'Share App with 5 Friends', reward: 15.00, status: 'idle', type: 'invite', icon: <Gift size={18} /> },
  { id: 5, title: 'Verify Age & Profile', reward: 2.00, status: 'idle', type: 'verify', icon: <ShieldAlert size={18} /> },
];

export default function TasksTab({ balance, setBalance, showToast, walletInfo, navigateToWallet }: any) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = (completedCount / tasks.length) * 100;

  const handleTaskAction = (task: any) => {
    if (!walletInfo) {
      setShowWalletPrompt(true);
      return;
    }

    if (task.status === 'idle') {
      // Start task
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'started' } : t));
      showToast(`Task started! Please complete it.`, 'info');
    } else if (task.status === 'started') {
      // Claim task
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'claiming' } : t));
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
        setBalance((prev: number) => prev + task.reward);
        showToast(`Task verified! Earned ৳${task.reward.toFixed(2)}`, 'success');
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 px-4 pt-4 pb-24">
      {/* Wallet Prompt Modal */}
      <AnimatePresence>
        {showWalletPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
              
              <button 
                onClick={() => setShowWalletPrompt(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-4 mb-6 mt-2">
                <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto text-pink-500 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                  <Wallet size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Wallet Required</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Please set up your withdrawal wallet (bKash, Nagad, or USDT) before starting tasks.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowWalletPrompt(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowWalletPrompt(false);
                    navigateToWallet();
                  }}
                  className="flex-1 py-3 rounded-xl font-black text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] active:scale-95"
                >
                  Go to Wallet
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Progress */}
      <div className="bg-[#111] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
                Missions <Target className="text-pink-500" size={24} />
              </h2>
              <p className="text-xs text-slate-400 mt-1">Complete tasks to earn rewards</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-pink-500">{completedCount}/{tasks.length}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Completed</p>
            </div>
          </div>

          <div className="h-2 bg-black rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12 translate-x-[-100%]"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={task.id} 
            className={`relative overflow-hidden border rounded-2xl p-4 flex items-center gap-4 transition-all ${
              task.status === 'completed' 
                ? 'bg-[#111]/50 border-white/5 opacity-50' 
                : 'bg-[#111] border-white/10 hover:border-pink-500/30 shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.1)]'
            }`}
          >
            {task.status === 'completed' && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                  <CheckCircle2 size={14} /> Completed
                </div>
              </div>
            )}

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-black text-pink-500 border-white/5'
            }`}>
              {task.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-white text-sm truncate tracking-wide">{task.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-emerald-500 font-black text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  ৳{task.reward.toFixed(2)}
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  {task.type}
                </span>
              </div>
            </div>

            <button 
              onClick={() => handleTaskAction(task)}
              disabled={task.status === 'completed' || task.status === 'claiming'}
              className={`shrink-0 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' :
                task.status === 'claiming' ? 'bg-pink-500/20 text-pink-500' :
                task.status === 'started' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95' :
                'bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95'
              }`}
            >
              {task.status === 'claiming' ? (
                <><Loader2 size={12} className="animate-spin" /> VERIFYING</>
              ) : task.status === 'started' ? (
                <><CheckCircle2 size={12} /> CLAIM</>
              ) : task.status === 'completed' ? (
                'DONE'
              ) : (
                <><Zap size={12} className="fill-current" /> START</>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
