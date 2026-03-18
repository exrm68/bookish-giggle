import React, { useState, useEffect, useRef } from 'react';
import { Lock, Play, Clock, ShieldCheck, ExternalLink, Flame, Wallet, Eye, AlertTriangle, Unlock, ArrowLeft, Maximize, Volume2, Settings, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['Exclusive 🔞', 'Viral Leaks', 'Trending', 'Premium'];

const ALL_VIDEOS = [
  // Exclusive (Grid)
  { id: 1, title: 'Private Party Leaked Footage | Uncensored', channel: 'Deshi Leaks', duration: '12:40', price: 0, category: 'Exclusive 🔞', image: 'https://picsum.photos/seed/party1/600/337', avatar: 'https://picsum.photos/seed/av1/100/100', views: '2.5M', unlockedCount: '45K', time: 'Just now', premium: true },
  { id: 2, title: 'College Scandal Leaked Video | Raw Footage', channel: 'Deshi Leaks', duration: '4:30', price: 0, category: 'Exclusive 🔞', image: 'https://picsum.photos/seed/college4/600/337', avatar: 'https://picsum.photos/seed/av1/100/100', views: '1.2M', unlockedCount: '30K', time: '2h ago', premium: false },
  { id: 3, title: 'Exclusive Model Photoshoot BTS | 18+', channel: 'Deshi Leaks', duration: '15:20', price: 5, category: 'Exclusive 🔞', image: 'https://picsum.photos/seed/model7/600/337', avatar: 'https://picsum.photos/seed/av1/100/100', views: '900K', unlockedCount: '15K', time: '5h ago', premium: true },
  { id: 4, title: 'Late Night Video Call Recording', channel: 'Deshi Leaks', duration: '8:45', price: 0, category: 'Exclusive 🔞', image: 'https://picsum.photos/seed/call/600/337', avatar: 'https://picsum.photos/seed/av1/100/100', views: '3.1M', unlockedCount: '80K', time: '1d ago', premium: false },
  
  // Viral Leaks (Large Cards)
  { id: 5, title: 'Viral Hotel Room Hidden Cam | Full Video', channel: 'Dark Web Media', duration: '8:15', price: 0, category: 'Viral Leaks', image: 'https://picsum.photos/seed/hotel2/600/337', avatar: 'https://picsum.photos/seed/av2/100/100', views: '850K', unlockedCount: '12K', time: '5h ago', premium: false },
  { id: 6, title: 'Trending Tiktok Star Private Video Leak', channel: 'Dark Web Media', duration: '6:10', price: 0, category: 'Viral Leaks', image: 'https://picsum.photos/seed/tiktok6/600/337', avatar: 'https://picsum.photos/seed/av2/100/100', views: '3.8M', unlockedCount: '85K', time: '1w ago', premium: false },
  { id: 7, title: 'Hidden Cam Compilation 2026 | Vol 1', channel: 'Dark Web Media', duration: '45:00', price: 0, category: 'Viral Leaks', image: 'https://picsum.photos/seed/comp8/600/337', avatar: 'https://picsum.photos/seed/av2/100/100', views: '7.2M', unlockedCount: '500K', time: '2w ago', premium: false },
  
  // Trending (List View)
  { id: 8, title: 'Deshi Viral MMS Collection 2026 | Mega Pack', channel: 'Trending Hub', duration: '25:20', price: 5, category: 'Trending', image: 'https://picsum.photos/seed/mms3/600/337', avatar: 'https://picsum.photos/seed/av3/100/100', views: '4.1M', unlockedCount: '120K', time: '1d ago', premium: true },
  { id: 9, title: 'Village Girl Viral Scandal | Unseen', channel: 'Trending Hub', duration: '10:15', price: 0, category: 'Trending', image: 'https://picsum.photos/seed/village/600/337', avatar: 'https://picsum.photos/seed/av3/100/100', views: '2.2M', unlockedCount: '50K', time: '2d ago', premium: false },
  { id: 10, title: 'New Web Series Leaked Scene', channel: 'Trending Hub', duration: '3:50', price: 0, category: 'Trending', image: 'https://picsum.photos/seed/webseries/600/337', avatar: 'https://picsum.photos/seed/av3/100/100', views: '1.5M', unlockedCount: '20K', time: '3d ago', premium: false },
  
  // Premium (Large Grid with Gold)
  { id: 11, title: 'VIP Lounge Secret Recording | 4K Uncensored', channel: 'Premium Hub', duration: '18:45', price: 10, category: 'Premium', image: 'https://picsum.photos/seed/lounge5/600/337', avatar: 'https://picsum.photos/seed/av4/100/100', views: '5.5M', unlockedCount: '250K', time: '3d ago', premium: true },
  { id: 12, title: 'Celebrity Private Yacht Party Leak', channel: 'Premium Hub', duration: '32:10', price: 15, category: 'Premium', image: 'https://picsum.photos/seed/yacht/600/337', avatar: 'https://picsum.photos/seed/av4/100/100', views: '8.9M', unlockedCount: '400K', time: '1w ago', premium: true },
];

export default function HomeTab({ showToast, balance, setBalance, myUserId, unlockRecords, addUnlockRecord }: any) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [unlockedVideos, setUnlockedVideos] = useState<{id: number, unlockTime: number}[]>([]);
  const [loadingVideo, setLoadingVideo] = useState<number | null>(null);
  const [unlockConfirm, setUnlockConfirm] = useState<any>(null); // State for confirmation modal
  const [activeVideo, setActiveVideo] = useState<any>(null); // State for video player page
  const [cooldownTime, setCooldownTime] = useState(0); // Cooldown in seconds
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  const filteredVideos = ALL_VIDEOS.filter(v => v.category === activeCategory);

  // Real unlock count from global records
  const getRealUnlockCount = (videoId: number) => {
    const real = (unlockRecords || []).filter((r: any) => r.videoId === videoId).length;
    const video = ALL_VIDEOS.find(v => v.id === videoId);
    if (real > 0) return real.toLocaleString();
    return video?.unlockedCount ?? '0';
  };

  // Check if THIS user unlocked this video (valid 24h)
  const isVideoUnlockedByMe = (videoId: number) => {
    return (unlockRecords || []).some(
      (r: any) => r.videoId === videoId && r.userId === myUserId && Date.now() - r.unlockTime < 86400000
    );
  };

  // Cineflix-style share
  const handleShare = (video: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const msg = `🎬 *${video.title}*\n\n🔥 DESI HUB — Exclusive Content\n👁️ ${video.views} views  ⏱️ ${video.duration}\n\n🔓 Watch FREE:\nhttps://t.me/deshihub_bot\n\n#DesiHub #Exclusive #Viral`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://t.me/deshihub_bot')}&text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Opening Telegram share 🚀', 'info');
  };

  // Check for expired unlocks (24 hours)
  useEffect(() => {
    const now = Date.now();
    const validUnlocks = unlockedVideos.filter(v => now - v.unlockTime < 24 * 60 * 60 * 1000);
    if (validUnlocks.length !== unlockedVideos.length) {
      setUnlockedVideos(validUnlocks);
    }
  }, [activeCategory]); // Check when category changes

  // Cooldown timer
  useEffect(() => {
    let timer: any;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  const handleUnlockClick = (video: any) => {
    const isUnlocked = unlockedVideos.some(v => v.id === video.id);
    
    if (isUnlocked) {
      setActiveVideo(video);
      return;
    }

    if (cooldownTime > 0 && video.price === 0) {
      showToast(`Please wait ${cooldownTime}s before watching another ad.`, 'error');
      return;
    }

    if (video.price > 0) {
      // Show confirmation modal for paid videos
      setUnlockConfirm(video);
    } else {
      // Direct unlock for ad-based videos
      processUnlock(video);
    }
  };

  const processUnlock = (video: any) => {
    setUnlockConfirm(null);
    setLoadingVideo(video.id);
    
    // Simulate Ad/Payment process
    setTimeout(() => {
      if (video.price > 0) {
        if (balance >= video.price) {
          setBalance((prev: number) => prev - video.price);
          setUnlockedVideos(prev => [...prev, { id: video.id, unlockTime: Date.now() }]);
          addUnlockRecord?.({ videoId: video.id, videoTitle: video.title, userId: myUserId, unlockTime: Date.now(), method: 'paid' });
          showToast('Payment successful! Video unlocked.', 'success');
          triggerUnlockAnimation(video);
        } else {
          showToast('Insufficient balance! Please recharge.', 'error');
        }
      } else {
        setUnlockedVideos(prev => [...prev, { id: video.id, unlockTime: Date.now() }]);
        addUnlockRecord?.({ videoId: video.id, videoTitle: video.title, userId: myUserId, unlockTime: Date.now(), method: 'ad' });
        showToast('Ad watched successfully! Video unlocked.', 'success');
        setCooldownTime(5);
        triggerUnlockAnimation(video);
      }
      setLoadingVideo(null);
    }, 2000);
  };

  const triggerUnlockAnimation = (video: any) => {
    setShowUnlockAnimation(true);
    setTimeout(() => {
      setShowUnlockAnimation(false);
      setActiveVideo(video); // Open video after animation
    }, 1500);
  };

  // --- Video Player Page ---
  if (activeVideo) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-[200] bg-black text-white overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setActiveVideo(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-sm font-bold truncate flex-1">{activeVideo.title}</h2>
          <button onClick={(e) => handleShare(activeVideo, e)} className="p-2 bg-[#0088cc]/20 rounded-full text-[#0088cc]"><Share2 size={18} /></button>
        </div>

        {/* Video Player Area (Mock) */}
        <div className="relative w-full aspect-video bg-zinc-900 flex flex-col items-center justify-center group">
          <img src={activeVideo.image} alt={activeVideo.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <button className="w-16 h-16 bg-pink-500/80 rounded-full flex items-center justify-center backdrop-blur-md border border-pink-400/50 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-110 transition-transform">
              <Play size={24} className="text-white fill-white ml-1" />
            </button>
          </div>
          
          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Play size={20} className="text-white fill-white cursor-pointer" />
              <Volume2 size={20} className="text-white cursor-pointer" />
              <span className="text-xs font-mono">00:00 / {activeVideo.duration}</span>
            </div>
            <div className="flex items-center gap-4">
              <Settings size={20} className="text-white cursor-pointer" />
              <Maximize size={20} className="text-white cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Video Details */}
        <div className="p-4 space-y-6">
          <div>
            <h1 className="text-xl font-black leading-tight mb-2">{activeVideo.title}</h1>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><Eye size={14} /> {activeVideo.views} Views</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {activeVideo.time}</span>
              <span className="flex items-center gap-1 text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full"><Unlock size={12} /> {getRealUnlockCount(activeVideo.id)} Unlocks</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#111] rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <img src={activeVideo.avatar} alt={activeVideo.channel} className="w-10 h-10 rounded-full border border-white/10" />
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1">{activeVideo.channel} <ShieldCheck size={14} className="text-pink-500" /></h3>
                <p className="text-[10px] text-slate-500">Official Creator</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-colors">
              Subscribe
            </button>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2">Description</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exclusive leaked footage from {activeVideo.channel}. This video is available for 24 hours after unlocking. Make sure to watch it before the timer expires. 
              <br/><br/>
              Tags: #viral #leaked #exclusive #desi
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 pb-4 relative">
      
      {/* Categories (Sticky) */}
      <div className="sticky top-[64px] z-40 bg-black/90 backdrop-blur-xl py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-black tracking-wide uppercase transition-all ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]' 
                  : 'bg-[#111] text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tutorial Banner */}
      <div className="px-4">
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open('https://t.me/your_telegram_channel', '_blank')}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-3 flex items-center justify-between shadow-[0_0_20px_rgba(79,70,229,0.2)] cursor-pointer border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
              <Play size={18} className="text-white fill-white ml-0.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white leading-tight uppercase tracking-wide">How to Unlock?</h3>
              <p className="text-[10px] text-blue-100 font-medium mt-0.5">Watch quick tutorial video</p>
            </div>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md shrink-0">
            <ExternalLink size={16} className="text-white" />
          </div>
        </motion.div>
      </div>

      {/* Dynamic Video Feed based on Category */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              ${activeCategory === 'Exclusive 🔞' ? 'grid grid-cols-2 gap-3' : ''}
              ${activeCategory === 'Viral Leaks' ? 'flex flex-col gap-5' : ''}
              ${activeCategory === 'Trending' ? 'flex flex-col gap-3' : ''}
              ${activeCategory === 'Premium' ? 'grid grid-cols-1 gap-5' : ''}
            `}
          >
            {filteredVideos.map((video) => {
              const isUnlocked = unlockedVideos.some(v => v.id === video.id);
              const isLoading = loadingVideo === video.id;

              if (activeCategory === 'Trending') {
                const realCount = getRealUnlockCount(video.id);
              return <ListCard key={video.id} video={video} isUnlocked={isUnlocked} isLoading={isLoading} realUnlockCount={realCount} onUnlock={() => handleUnlockClick(video)} onShare={(e: any) => handleShare(video, e)} cooldownTime={cooldownTime} />;
              }
              if (activeCategory === 'Viral Leaks' || activeCategory === 'Premium') {
                const realCount = getRealUnlockCount(video.id);
                return <LargeCard key={video.id} video={video} isUnlocked={isUnlocked} isLoading={isLoading} realUnlockCount={realCount} onUnlock={() => handleUnlockClick(video)} onShare={(e: any) => handleShare(video, e)} isPremium={activeCategory === 'Premium'} cooldownTime={cooldownTime} />;
              }
              const realCount = getRealUnlockCount(video.id);
              return <GridCard key={video.id} video={video} isUnlocked={isUnlocked} isLoading={isLoading} realUnlockCount={realCount} onUnlock={() => handleUnlockClick(video)} onShare={(e: any) => handleShare(video, e)} cooldownTime={cooldownTime} />;
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Unlock Animation Overlay */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.6)] mb-4 border-4 border-emerald-200/20">
                <Unlock size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest text-shadow-lg">Unlocked!</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Paid Unlocks */}
      <AnimatePresence>
        {unlockConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 border border-orange-500/20">
                  <AlertTriangle className="text-orange-500" size={32} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Confirm Unlock</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  You are about to unlock <span className="text-white font-bold">"{unlockConfirm.title}"</span>.
                </p>
                <div className="mt-4 bg-black/50 border border-white/5 rounded-xl py-3 px-6 inline-flex items-center gap-2">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Cost:</span>
                  <span className="text-xl font-black text-pink-500">৳{unlockConfirm.price}</span>
                </div>
                
                <div className="flex gap-3 w-full mt-6">
                  <button 
                    onClick={() => setUnlockConfirm(null)} 
                    className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => processUnlock(unlockConfirm)} 
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all active:scale-95"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- Card Components for Different Layouts ---

function ThumbnailOverlay({ isUnlocked, duration, premium }: any) {
  return (
    <>
      {premium && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-[0_4px_10px_rgba(245,158,11,0.5)] flex items-center gap-1 z-20 border border-amber-400/50 backdrop-blur-md">
          <Flame size={10} className="fill-white" /> PREMIUM
        </div>
      )}

      {isUnlocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full flex items-center justify-center pl-0.5 backdrop-blur-md border shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-emerald-500/30 border-emerald-400/40 text-emerald-400">
            <Play className="fill-current" size={16} />
          </div>
        </div>
      )}

      <div className="absolute bottom-2 right-2 text-white text-[11px] font-black px-1.5 py-0.5 rounded backdrop-blur-sm bg-black/20 z-20 drop-shadow-md">
        {duration}
      </div>
    </>
  );
}

function ActionButton({ video, isUnlocked, isLoading, onUnlock, cooldownTime }: any) {
  if (isUnlocked) {
    return (
      <button 
        onClick={onUnlock}
        className="w-full py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all"
      >
        <Play size={10} className="fill-current" /> PLAY NOW
      </button>
    );
  }

  const isCooldown = cooldownTime > 0 && video.price === 0;

  return (
    <button 
      onClick={onUnlock}
      disabled={isLoading || isCooldown}
      className={`w-full py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${
        isLoading || isCooldown
          ? 'bg-white/10 text-slate-400 cursor-not-allowed'
          : video.price > 0 
            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]' 
            : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]'
      }`}
    >
      {isLoading ? (
        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : isCooldown ? (
        <><Clock size={10} /> WAIT {cooldownTime}s</>
      ) : video.price > 0 ? (
        <><Lock size={10} /> PAY ৳{video.price}</>
      ) : (
        <><Lock size={10} className="text-white" /> WATCH AD</>
      )}
    </button>
  );
}

// 1. Grid Card (2 Columns)
function GridCard({ video, isUnlocked, isLoading, realUnlockCount, onUnlock, onShare, cooldownTime }: any) {
  return (
    <div className={`group bg-[#111] rounded-2xl overflow-hidden border shadow-lg flex flex-col transition-colors ${isUnlocked ? 'border-emerald-500/30' : 'border-white/5'}`}>
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        <img src={video.image} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <ThumbnailOverlay isUnlocked={isUnlocked} duration={video.duration} premium={video.premium} />
      </div>
      <div className="p-2.5 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="text-[11px] font-bold text-white leading-snug line-clamp-2 mb-1.5">{video.title}</h4>
          <div className="flex items-center justify-between text-[9px] text-slate-400 mb-2">
            <span className="flex items-center gap-1"><Eye size={10} /> {video.views}</span>
            <span className="flex items-center gap-1 text-pink-500"><Unlock size={10} /> {realUnlockCount}</span>
          </div>
        </div>
        <ActionButton video={video} isUnlocked={isUnlocked} isLoading={isLoading} onUnlock={onUnlock} cooldownTime={cooldownTime} />
      </div>
    </div>
  );
}

// 2. Large Card (1 Column, Big Image)
function LargeCard({ video, isUnlocked, isLoading, realUnlockCount, onUnlock, onShare, isPremium, cooldownTime }: any) {
  return (
    <div className={`group bg-[#111] rounded-3xl overflow-hidden border shadow-2xl flex flex-col transition-colors ${isUnlocked ? 'border-emerald-500/30' : isPremium ? 'border-yellow-500/20' : 'border-white/5'}`}>
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        <img src={video.image} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <ThumbnailOverlay isUnlocked={isUnlocked} duration={video.duration} premium={video.premium} />
      </div>
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">
            <img src={video.avatar} alt={video.channel} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">{video.title}</h4>
            <div className="flex items-center gap-2 mt-1.5">
              <p className="text-xs text-slate-400 flex items-center gap-1">{video.channel} <ShieldCheck size={12} className="text-pink-500" /></p>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1"><Eye size={10} /> {video.views} Views</p>
              <p className="text-[10px] text-pink-500 font-bold flex items-center gap-1"><Unlock size={10} /> {realUnlockCount} Unlocked</p>
              <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1"><Clock size={10} /> {video.time}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ActionButton video={video} isUnlocked={isUnlocked} isLoading={isLoading} onUnlock={onUnlock} cooldownTime={cooldownTime} />
        </div>
      </div>
    </div>
  );
}

// 3. List Card (Horizontal Layout)
function ListCard({ video, isUnlocked, isLoading, realUnlockCount, onUnlock, onShare, cooldownTime }: any) {
  return (
    <div className={`group bg-[#111] rounded-2xl overflow-hidden border shadow-sm flex items-center p-2 gap-3 transition-colors ${isUnlocked ? 'border-emerald-500/30' : 'border-white/5'}`}>
      <div className="relative w-32 aspect-video bg-black rounded-xl overflow-hidden shrink-0">
        <img src={video.image} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <ThumbnailOverlay isUnlocked={isUnlocked} duration={video.duration} premium={video.premium} />
      </div>
      <div className="flex flex-col flex-1 justify-between py-1 pr-1">
        <div>
          <h4 className="text-[11px] font-bold text-white leading-snug line-clamp-2 mb-1">{video.title}</h4>
          <p className="text-[9px] text-slate-400 flex items-center gap-1 mb-2">{video.channel} <ShieldCheck size={8} className="text-pink-500" /></p>
        </div>
        <ActionButton video={video} isUnlocked={isUnlocked} isLoading={isLoading} onUnlock={onUnlock} cooldownTime={cooldownTime} />
      </div>
    </div>
  );
}

