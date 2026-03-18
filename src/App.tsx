import React, { useState, useEffect } from 'react';
import { Home, LayoutGrid, PlayCircle, Wallet, User, Bell, ShieldAlert, Flame, X, CheckCircle2, Search, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import HomeTab from './components/HomeTab';
import TasksTab from './components/TasksTab';
import EarnTab from './components/EarnTab';
import WalletTab from './components/WalletTab';
import ProfileTab from './components/ProfileTab';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [is18Plus, setIs18Plus] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [balance, setBalance] = useState(12.50);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [walletInfo, setWalletInfo] = useState<{type: string, address: string} | null>(null);

  // ── Referral System State ──────────────────────────────────────
  // myUserId: this user's Telegram ID (production: window.Telegram.WebApp.initDataUnsafe.user.id)
  const myUserId = '104859203';
  const REFERRAL_COIN_REWARD = 50;
  const [referralCoins, setReferralCoins] = useState(0);
  // referredUsers: friend IDs who COMPLETED referral (watched ad) — never counted again
  const [referredUsers, setReferredUsers] = useState<string[]>([]);
  // pendingReferrals: clicked link but haven't watched ad yet
  const [pendingReferrals, setPendingReferrals] = useState<string[]>([]);

  // ── Unlock Records (for admin + real counts) ───────────────────
  const [unlockRecords, setUnlockRecords] = useState<{videoId: number, videoTitle: string, userId: string, unlockTime: number, method: 'ad' | 'paid'}[]>([]);
  const addUnlockRecord = (record: {videoId: number, videoTitle: string, userId: string, unlockTime: number, method: 'ad' | 'paid'}) => {
    setUnlockRecords(prev => [...prev, record]);
  };

  // ── Admin Panel ────────────────────────────────────────────────
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);
  const handleLogoTap = () => {
    setLogoTapCount(prev => {
      const next = prev + 1;
      if (next >= 5) { setShowAdmin(true); return 0; }
      return next;
    });
  };

  // ── Referral Functions ─────────────────────────────────────────
  // Called when a friend opens the app via YOUR referral link
  const onFriendJoinedViaLink = (friendId: string): boolean => {
    if (friendId === myUserId) { showToast('❌ নিজেকে refer করা যাবে না!', 'error'); return false; }
    if (referredUsers.includes(friendId)) { showToast('⚠️ এই friend আগেই refer হয়েছে।', 'error'); return false; }
    if (pendingReferrals.includes(friendId)) return false;
    setPendingReferrals(prev => [...prev, friendId]);
    return true;
  };

  // Called when a pending friend watches an ad — THEN coins are awarded
  const onFriendWatchedAd = (friendId: string) => {
    if (!pendingReferrals.includes(friendId)) return;
    if (referredUsers.includes(friendId)) return;
    setPendingReferrals(prev => prev.filter(id => id !== friendId));
    setReferredUsers(prev => [...prev, friendId]);
    setReferralCoins(prev => prev + REFERRAL_COIN_REWARD);
    showToast(\`🎉 Referral confirmed! +\${REFERRAL_COIN_REWARD} coins earned!\`, 'success');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!is18Plus) {
    return <DisclaimerScreen onAccept={() => setIs18Plus(true)} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab showToast={showToast} balance={balance} setBalance={setBalance} myUserId={myUserId} unlockRecords={unlockRecords} addUnlockRecord={addUnlockRecord} />;
      case 'tasks': return <TasksTab balance={balance} setBalance={setBalance} showToast={showToast} walletInfo={walletInfo} navigateToWallet={() => setActiveTab('wallet')} />;
      case 'earn': return <EarnTab balance={balance} setBalance={setBalance} showToast={showToast} walletInfo={walletInfo} navigateToWallet={() => setActiveTab('wallet')} pendingReferrals={pendingReferrals} onFriendWatchedAd={onFriendWatchedAd} />;
      case 'wallet': return <WalletTab balance={balance} showToast={showToast} walletInfo={walletInfo} setWalletInfo={setWalletInfo} />;
      case 'profile': return <ProfileTab showToast={showToast} balance={balance} setBalance={setBalance} myUserId={myUserId} referredUsers={referredUsers} pendingReferrals={pendingReferrals} referralCoins={referralCoins} onFriendJoinedViaLink={onFriendJoinedViaLink} />;
      default: return <HomeTab showToast={showToast} balance={balance} setBalance={setBalance} myUserId={myUserId} unlockRecords={unlockRecords} addUnlockRecord={addUnlockRecord} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500/30 transition-all duration-500">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
          >
            <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${
              toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
              toast.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
              'bg-pink-500/20 border-pink-500/30 text-pink-400'
            }`}>
              <span className="text-sm font-bold tracking-wide">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[500] bg-black overflow-y-auto"
          >
            <AdminPanel
              onClose={() => setShowAdmin(false)}
              unlockRecords={unlockRecords}
              pendingReferrals={pendingReferrals}
              referredUsers={referredUsers}
              referralCoins={referralCoins}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header */}
      <AnimatePresence>
        {activeTab === 'home' && (
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between h-[64px]"
          >
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.div 
                  key="search"
                  initial={{ opacity: 0, width: '50%' }}
                  animate={{ opacity: 1, width: '100%' }}
                  exit={{ opacity: 0, width: '50%' }}
                  className="flex items-center w-full gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500" size={16} />
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search exclusive videos..." 
                      className="w-full bg-[#111] border border-pink-500/50 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none shadow-[0_0_15px_rgba(236,72,153,0.1)]"
                    />
                  </div>
                  <button onClick={() => setIsSearchOpen(false)} className="p-2 text-slate-400 hover:text-white">
                    <X size={20} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between w-full"
                >
                  <button onClick={handleLogoTap} className="flex items-center gap-2 active:opacity-70">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                      <Flame size={18} className="text-white fill-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-none">
                        DESI HUB
                      </h1>
                      <p className="text-[9px] text-pink-500 font-bold tracking-widest uppercase">Premium Content</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2 bg-[#111] border border-white/5 hover:bg-white/5 rounded-full transition-colors text-slate-300"
                    >
                      <Search size={16} />
                    </button>
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className={`relative p-2 border rounded-full transition-colors ${showNotifications ? 'bg-pink-500/20 border-pink-500/50 text-pink-500' : 'bg-[#111] border-white/5 hover:bg-white/5 text-slate-300'}`}
                    >
                      <Bell size={16} />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {activeTab === 'home' && showNotifications && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[60px] right-4 left-4 z-50 bg-[#111]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/50">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 border border-pink-500/30">
                  <Flame size={14} className="text-pink-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">New Viral Leak Added! 🔥</p>
                  <p className="text-xs text-slate-400 mt-1">Check out the latest exclusive content in the Premium section.</p>
                  <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">2 mins ago</p>
                </div>
              </div>
              <div className="p-4 hover:bg-white/5 transition-colors flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">Withdrawal Successful</p>
                  <p className="text-xs text-slate-400 mt-1">Your request for ৳500 via bKash has been processed.</p>
                  <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wider">1 hour ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pb-28 pt-0 px-0 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Ultra Dark & Sleek */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-2xl border-t border-white/5 pb-safe">
        <div className="max-w-md mx-auto px-6 py-3 flex justify-between items-center relative">
          <NavItem icon={<LayoutGrid size={22} />} label="Tasks" isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
          <NavItem icon={<PlayCircle size={22} />} label="Earn" isActive={activeTab === 'earn'} onClick={() => setActiveTab('earn')} />
          
          {/* Center Home Button - Glowing */}
          <div className="relative -top-5">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab('home')}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                activeTab === 'home' 
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] ring-4 ring-black' 
                  : 'bg-[#111] text-slate-400 border border-white/10 ring-4 ring-black hover:text-white'
              }`}
            >
              <Home size={24} className={activeTab === 'home' ? 'fill-white/20' : ''} />
            </motion.button>
          </div>

          <NavItem icon={<Wallet size={22} />} label="Wallet" isActive={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
          <NavItem icon={<User size={22} />} label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>
    </div>
  );
}

// Splash Screen Component
function SplashScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.15)_0%,transparent_60%)]"></div>
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.5)] mb-6">
          <Flame size={40} className="text-white fill-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">DESI HUB</h1>
        <p className="text-pink-500 font-medium tracking-[0.2em] text-xs uppercase">Premium Content</p>
      </motion.div>

      <div className="absolute bottom-20 w-48 h-1 bg-[#111] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
        ></motion.div>
      </div>
    </div>
  );
}

// 18+ Disclaimer Component
function DisclaimerScreen({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/dark/800/1200')] opacity-20 bg-cover bg-center blur-md"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/90 to-black"></div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <ShieldAlert size={32} className="text-red-500" />
        </div>
        
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Age Verification</h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          This application contains adult content (18+). By entering, you confirm that you are at least 18 years of age and consent to viewing such material.
        </p>

        <div className="space-y-3">
          <button 
            onClick={onAccept}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all active:scale-95 uppercase tracking-wide text-sm"
          >
            I am 18 or older - Enter
          </button>
          <button 
            onClick={() => window.location.href = 'https://google.com'}
            className="w-full bg-transparent border border-white/10 text-slate-400 font-bold py-4 rounded-xl hover:bg-white/5 transition-all uppercase tracking-wide text-sm"
          >
            Exit
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-colors relative w-12 pt-1 ${isActive ? 'text-pink-500' : 'text-slate-500 hover:text-slate-300'}`}
    >
      {icon}
      <span className="text-[9px] font-bold tracking-wider uppercase">{label}</span>
    </motion.button>
  );
}
