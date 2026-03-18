import React, { useState } from 'react';
import { Settings, HelpCircle, LogOut, ChevronRight, Award, PlaySquare, Users, Copy, CheckCircle2, Star, LockOpen, ArrowLeft, Send, MessageCircle, ShieldCheck, Globe, Info, Gift, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PARTNER_APPS = [
  { id: 1, name: 'Casino Pro', icon: '🎰', color: 'from-orange-500 to-red-500', users: '50K+' },
  { id: 2, name: 'Dating AI', icon: '💋', color: 'from-pink-500 to-rose-500', users: '120K+' },
  { id: 3, name: 'Crypto Earn', icon: '💎', color: 'from-blue-500 to-cyan-500', users: '85K+' },
  { id: 4, name: 'Live Chat', icon: '💬', color: 'from-purple-500 to-indigo-500', users: '200K+' },
];

const UNLOCKED_VIDEOS = [
  { id: 1, title: 'Private Party Leaked Footage', duration: '12:40', image: 'https://picsum.photos/seed/party1/600/337', time: 'Unlocked 2h ago' },
  { id: 3, title: 'Exclusive Model Photoshoot BTS', duration: '15:20', image: 'https://picsum.photos/seed/model7/600/337', time: 'Unlocked 5h ago' },
];

export default function ProfileTab({ showToast, balance, setBalance, myUserId, referredUsers, pendingReferrals, referralCoins, onFriendJoinedViaLink }: any) {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState('main'); // main, network, unlocked, invite, help

  const copyId = () => {
    setCopied(true);
    showToast('ID copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Real referral link uses THIS user's own ID
  const referralLink = `https://t.me/deshihub_bot?start=${myUserId}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink).catch(() => {});
    showToast('Referral link copied! Share to earn coins 🎉', 'success');
  };

  const handleTelegramShare = () => {
    const msg = `🔥 Join DESI HUB and earn free coins!\nUse my invite link:\n${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Opening Telegram share...', 'info');
  };

  // DEMO: simulate a friend joining (for testing — in production fires from backend)
  const [demoFriendId, setDemoFriendId] = useState('');
  const handleDemoSimulate = () => {
    const id = demoFriendId.trim();
    if (!id) { showToast('Enter a friend ID to test', 'error'); return; }
    const ok = onFriendJoinedViaLink?.(id);
    if (ok) showToast(`Friend ${id} joined! Waiting for ad watch... ⏳`, 'info');
    setDemoFriendId('');
  };

  const renderView = () => {
    switch (activeView) {
      case 'network':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6 px-4 pt-4 pb-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setActiveView('main')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-white tracking-tight">Our Network</h2>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-3xl p-5 shadow-2xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Send size={16} className="text-blue-400" /> Official Channels
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black rounded-2xl border border-white/5">
                  <div>
                    <p className="font-bold text-sm text-white">Desi Hub Main Channel</p>
                    <p className="text-[10px] text-slate-400">120K+ Subscribers</p>
                  </div>
                  <button className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold">Join</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-black rounded-2xl border border-white/5">
                  <div>
                    <p className="font-bold text-sm text-white">VIP Leaks Group</p>
                    <p className="text-[10px] text-slate-400">50K+ Members</p>
                  </div>
                  <button className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold">Join</button>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-3xl p-5 shadow-2xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Star size={16} className="text-yellow-500" /> Promotions & Work
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Want to earn more? Join our promoter network. Share our app links in your Telegram groups, WhatsApp, or Facebook. You will get paid for every active user you bring!
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {PARTNER_APPS.map((app) => (
                  <div key={app.id} className="bg-black border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-xl shrink-0`}>
                      {app.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{app.name}</p>
                      <p className="text-[9px] text-slate-500">{app.users}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'unlocked':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6 px-4 pt-4 pb-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setActiveView('main')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-white tracking-tight">Unlocked Content</h2>
            </div>

            <div className="space-y-4">
              {UNLOCKED_VIDEOS.map(video => (
                <div key={video.id} className="bg-[#111] border border-white/5 rounded-2xl p-3 flex gap-3 items-center">
                  <div className="relative w-28 aspect-video bg-black rounded-xl overflow-hidden shrink-0">
                    <img src={video.image} alt={video.title} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={16} className="text-white fill-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{video.title}</h4>
                    <p className="text-[9px] text-emerald-500 font-bold mt-1">{video.time}</p>
                  </div>
                </div>
              ))}
              {UNLOCKED_VIDEOS.length === 0 && (
                <div className="text-center py-10">
                  <LockOpen size={40} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-sm text-slate-400">No unlocked videos yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'invite':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6 px-4 pt-4 pb-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setActiveView('main')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-white tracking-tight">Invite Friends</h2>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 shadow-2xl text-center">
              <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                <Gift size={40} className="text-purple-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Earn 50 Coins 🪙</h3>
              <p className="text-sm text-slate-400 mb-4">Friend must join via your link AND watch an ad. Same friend counted once only. Self-referral blocked.</p>
              
              <div className="bg-black border border-white/10 rounded-xl p-4 flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-slate-300 truncate mr-4">{referralLink}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={handleCopyLink} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Copy size={16} className="text-white" />
                  </button>
                  <button 
                    onClick={() => {
                      window.open(`https://t.me/share/url?url={referralLink}&text=Join%20Desi%20Hub%20and%20earn%20money!`, '_blank');
                      handleTelegramShare();
                    }} 
                    className="p-2 bg-[#0088cc] rounded-lg hover:bg-[#0088cc]/80 transition-colors"
                  >
                    <Send size={16} className="text-white" />
                  </button>
                </div>
              </div>

              <button onClick={handleCopyLink} className="w-full py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95 transition-all">
                COPY INVITE LINK
              </button>
            </div>
          </motion.div>
        );

      case 'help':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6 px-4 pt-4 pb-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setActiveView('main')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-white tracking-tight">Help & Support</h2>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-white/5">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Info size={16} className="text-pink-500" /> About Mini App
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Desi Hub is a premium content platform where users can watch exclusive videos, complete tasks to earn rewards, and withdraw earnings directly to their local wallets (bKash, Nagad, USDT).
                </p>
              </div>
              
              <button onClick={() => showToast('Opening Live Chat...', 'info')} className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5">
                <div className="flex items-center gap-3">
                  <MessageCircle size={20} className="text-blue-400" />
                  <span className="text-sm font-bold text-white">Live Chat Support</span>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </button>

              <button onClick={() => showToast('Opening FAQ...', 'info')} className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle size={20} className="text-emerald-400" />
                  <span className="text-sm font-bold text-white">FAQ & Guides</span>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Professional Footer */}
            <div className="mt-12 text-center space-y-4">
              <div className="flex items-center justify-center gap-4 text-slate-500">
                <a href="#" className="text-[10px] font-bold uppercase hover:text-white transition-colors">Terms of Service</a>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <a href="#" className="text-[10px] font-bold uppercase hover:text-white transition-colors">Privacy Policy</a>
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure & Encrypted</span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium">
                &copy; {new Date().getFullYear()} Desi Hub Network. All rights reserved.
                <br />
                Protected by DMCA.
              </p>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-6 px-4 pt-4 pb-24"
          >
            {/* Telegram Style Profile Header */}
            <div className="flex flex-col items-center justify-center pt-4 pb-2">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#111] shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                  <img 
                    src="https://picsum.photos/seed/tgprofile/200/200" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-emerald-500 w-6 h-6 rounded-full border-4 border-black flex items-center justify-center"></div>
              </div>
              
              <h2 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                Rahul Ahmed
                <CheckCircle2 size={18} className="text-pink-500 fill-pink-500/20" />
              </h2>
              <p className="text-pink-500 font-bold mt-1 text-sm">@rahul_ahmed99</p>
              
              <button 
                onClick={copyId}
                className="mt-3 flex items-center gap-2 bg-[#111] hover:bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold transition-colors border border-white/5"
              >
                ID: 104859203
                {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <StatBox icon={<PlaySquare size={18} />} label="Videos" value="124" color="text-pink-500" bg="bg-pink-500/10" />
              <StatBox icon={<Award size={18} />} label="Tasks" value="45" color="text-emerald-500" bg="bg-emerald-500/10" />
              <StatBox icon={<Users size={18} />} label="Invites" value={String(referredUsers?.length ?? 0)} color="text-purple-500" bg="bg-purple-500/10" />
            </div>

            {/* Menu Options */}
            <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <ProfileMenuItem 
                icon={<Globe size={20} />} 
                label="Our Network" 
                onClick={() => setActiveView('network')}
              />
              <ProfileMenuItem 
                icon={<LockOpen size={20} />} 
                label="My Unlocked Content" 
                onClick={() => setActiveView('unlocked')}
              />
              <ProfileMenuItem 
                icon={<Users size={20} />} 
                label="Invite Friends" 
                badge="Earn 50 Coins" 
                onClick={() => setActiveView('invite')}
              />
              <ProfileMenuItem 
                icon={<HelpCircle size={20} />} 
                label="Help & Support" 
                onClick={() => setActiveView('help')}
              />
            </div>

            {/* Professional Footer */}
            <div className="text-center pt-4 space-y-3">
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure & Encrypted</span>
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Desi Hub v2.0.1 &copy; {new Date().getFullYear()}</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderView()}
    </AnimatePresence>
  );
}

function StatBox({ icon, label, value, color, bg }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:border-white/10 transition-colors">
      <div className={`${color} ${bg} p-2.5 rounded-xl`}>
        {icon}
      </div>
      <div className="text-center">
        <p className="text-lg font-black text-white leading-none">{value}</p>
        <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon, label, isDestructive = false, badge, onClick }: any) {
  return (
    <motion.button 
      onClick={onClick}
      whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      className={`w-full flex items-center justify-between p-4 transition-colors border-b border-white/5 last:border-0 ${
        isDestructive ? 'text-red-500 hover:bg-red-500/5' : 'text-slate-300 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-4 font-bold text-sm">
        <div className={`p-2 rounded-xl ${isDestructive ? 'bg-red-500/10' : 'bg-black border border-white/5'}`}>
          {icon}
        </div>
        {label}
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-[0_0_10px_rgba(236,72,153,0.3)]">
            {badge}
          </span>
        )}
        {!isDestructive && <ChevronRight size={18} className="text-slate-600" />}
      </div>
    </motion.button>
  );
}
