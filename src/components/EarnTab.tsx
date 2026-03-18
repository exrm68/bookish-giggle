import React, { useState, useEffect } from 'react';
import { Video, Play, Sparkles, Calendar, TrendingUp, CheckCircle2, Wallet, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function EarnTab({ balance, setBalance, showToast, walletInfo, navigateToWallet, pendingReferrals, onFriendWatchedAd }: any) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const currentDay = 2; // Wednesday (0-indexed)
  
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);
  const [dailyCheckedIn, setDailyCheckedIn] = useState(false);

  // Ad Networks State
  const [networks, setNetworks] = useState([
    { id: 'adsgram', name: 'Adsgram Premium', reward: 3.00, views: 4, maxViews: 30, color: '#ec4899' },
    { id: 'monetag', name: 'Monetag Bonus', reward: 2.50, views: 15, maxViews: 40, color: '#a855f7' },
    { id: 'adsterra', name: 'Adsterra Max', reward: 2.00, views: 0, maxViews: 100, color: '#3b82f6' }
  ]);

  // Ad Viewer State
  const [adViewer, setAdViewer] = useState<{ networkId: string, state: 'watching' | 'countdown' | 'claimable', timeLeft: number } | null>(null);

  const handleDailyCheckIn = () => {
    if (dailyCheckedIn) return;
    setDailyCheckedIn(true);
    setBalance((prev: number) => prev + 1.50);
    showToast('Daily Check-in Claimed! +৳1.50', 'success');
  };

  const handleWatchAd = (networkId: string) => {
    if (!walletInfo) {
      setShowWalletPrompt(true);
      return;
    }
    const network = networks.find(n => n.id === networkId);
    if (network && network.views >= network.maxViews) {
      showToast('Daily limit reached for this network.', 'error');
      return;
    }
    
    // Start Ad Viewer
    setAdViewer({ networkId, state: 'watching', timeLeft: 5 }); // 5s simulated ad
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (adViewer?.state === 'watching' && adViewer.timeLeft > 0) {
      timer = setTimeout(() => setAdViewer({ ...adViewer, timeLeft: adViewer.timeLeft - 1 }), 1000);
    } else if (adViewer?.state === 'watching' && adViewer.timeLeft === 0) {
      setAdViewer({ ...adViewer, state: 'countdown', timeLeft: 5 }); // 5s countdown before next
    } else if (adViewer?.state === 'countdown' && adViewer.timeLeft > 0) {
      timer = setTimeout(() => setAdViewer({ ...adViewer, timeLeft: adViewer.timeLeft - 1 }), 1000);
    } else if (adViewer?.state === 'countdown' && adViewer.timeLeft === 0) {
      setAdViewer({ ...adViewer, state: 'claimable' });
    }
    return () => clearTimeout(timer);
  }, [adViewer]);

  const claimAdReward = () => {
    if (!adViewer) return;
    const network = networks.find(n => n.id === adViewer.networkId);
    if (network) {
      setBalance((prev: number) => prev + network.reward);
      setNetworks(prev => prev.map(n => n.id === network.id ? { ...n, views: n.views + 1 } : n));
      showToast(`Earned ৳${network.reward.toFixed(2)} from ${network.name}`, 'success');
    }
    // ── Referral Confirmation ──────────────────────────────────────
    // In production: handled by backend when THIS user (a new referral) watches an ad.
    // Here: if there are pending referrals, confirm the first one as demo.
    if (onFriendWatchedAd && pendingReferrals?.length > 0) {
      onFriendWatchedAd(pendingReferrals[0]);
    }
    setAdViewer(null);
  };

  return (
    <div className="space-y-6 px-4 pt-2 pb-24">
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
                    Please set up your withdrawal wallet (bKash, Nagad, or USDT) before earning rewards.
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

      {/* Ad Viewer Modal */}
      <AnimatePresence>
        {adViewer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
            >
              {adViewer.state === 'watching' && (
                <>
                  <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mb-6 border border-pink-500/30">
                    <Video size={32} className="text-pink-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight mb-2">Watching Ad...</h3>
                  <p className="text-sm text-slate-400 mb-6">Please wait for the ad to finish.</p>
                  <div className="text-3xl font-black text-pink-500">{adViewer.timeLeft}s</div>
                </>
              )}

              {adViewer.state === 'countdown' && (
                <>
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 border border-orange-500/30">
                    <Clock size={32} className="text-orange-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight mb-2">Ad Finished!</h3>
                  <p className="text-sm text-slate-400 mb-6">You can claim your reward in...</p>
                  <div className="text-4xl font-black text-orange-500">{adViewer.timeLeft}</div>
                </>
              )}

              {adViewer.state === 'claimable' && (
                <>
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2">Reward Ready!</h3>
                  <p className="text-sm text-slate-400 mb-8">Click below to claim your earnings.</p>
                  <button 
                    onClick={claimAdReward}
                    className="w-full py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest"
                  >
                    Claim & Next
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="text-center space-y-2 py-4">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto text-pink-500 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
        >
          <Video size={28} />
        </motion.div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Watch & Earn</h2>
        <p className="text-xs text-slate-400 max-w-[250px] mx-auto font-medium">Watch exclusive ads to recharge your wallet</p>
      </div>

      {/* Daily Check-in */}
      <div className={`bg-[#111] border rounded-3xl p-5 shadow-2xl transition-colors ${dailyCheckedIn ? 'border-emerald-500/30' : 'border-white/5'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
            <Calendar size={16} className={dailyCheckedIn ? "text-emerald-500" : "text-pink-500"} />
            Daily Check-in
          </h3>
          <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20 uppercase tracking-wider">
            Day 3 Streak 🔥
          </span>
        </div>
        <div className="flex justify-between gap-1 mb-4">
          {days.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                i < currentDay || (i === currentDay && dailyCheckedIn) ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
                i === currentDay ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]' :
                'bg-black text-slate-600 border border-white/5'
              }`}>
                {i < currentDay || (i === currentDay && dailyCheckedIn) ? <CheckCircle2 size={14} /> : `+${(i+1)*2}`}
              </div>
              <span className={`text-[9px] font-bold ${i === currentDay ? 'text-pink-500' : 'text-slate-600'}`}>{day}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={handleDailyCheckIn}
          disabled={dailyCheckedIn}
          className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
            dailyCheckedIn 
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed' 
              : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95'
          }`}
        >
          {dailyCheckedIn ? 'Claimed (৳1.50)' : 'Claim Daily Reward (৳1.50)'}
        </button>
      </div>

      {/* Ad Networks */}
      <div className="space-y-3 pb-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Available Networks</h3>

        {networks.map((network, index) => {
          const isCompleted = network.views >= network.maxViews;
          const progress = (network.views / network.maxViews) * 100;
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={network.id} 
              className={`border rounded-3xl p-4 space-y-4 relative overflow-hidden ${
                isCompleted ? 'bg-[#111]/50 border-white/5' : 'bg-[#111] border-white/10 hover:border-white/20 shadow-lg'
              }`}
            >
              {isCompleted && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-3xl">
                  <CheckCircle2 size={28} className="text-emerald-500 mb-1" />
                  <p className="text-white font-bold text-sm tracking-wide">Completed for today</p>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/5" style={{ color: network.color }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm tracking-wide">{network.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1 font-bold">
                      <TrendingUp size={10} /> HIGH PAYING
                    </p>
                  </div>
                </div>
                <div className="text-emerald-500 font-black text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                  ৳{network.reward.toFixed(2)} / Ad
                </div>
              </div>

              <div className="space-y-2 bg-black p-3 rounded-2xl border border-white/5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">VIEWS: <span className="text-white">{network.views}/{network.maxViews}</span></span>
                  <span style={{ color: network.color }}>EARNED: ৳{(network.views * network.reward).toFixed(2)}</span>
                </div>
                <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full relative"
                    style={{ backgroundColor: isCompleted ? '#10B981' : network.color }}
                  />
                </div>
              </div>

              <button 
                onClick={() => handleWatchAd(network.id)}
                disabled={isCompleted}
                className={`w-full font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest ${
                  isCompleted 
                    ? 'bg-black text-slate-600' 
                    : 'text-white active:scale-95 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                }`}
                style={{ backgroundColor: isCompleted ? '' : network.color }}
              >
                <Play size={16} className="fill-white" />
                Watch Ad
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
