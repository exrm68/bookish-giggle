import React, { useState } from 'react';
import { ArrowLeft, Users, TrendingUp, PlaySquare, Clock, CheckCircle2, BarChart3, Activity, Search, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminPanel({ onClose, unlockRecords, pendingReferrals, referredUsers, referralCoins }: any) {
  const [tab, setTab] = useState<'dashboard' | 'unlocks' | 'referrals' | 'top'>('dashboard');
  const [search, setSearch] = useState('');

  const records: any[] = unlockRecords || [];
  const pending: string[] = pendingReferrals || [];
  const referred: string[] = referredUsers || [];

  // Top content by unlock count
  const countMap: Record<number, { title: string; count: number; adCount: number; paidCount: number }> = {};
  records.forEach((r: any) => {
    if (!countMap[r.videoId]) countMap[r.videoId] = { title: r.videoTitle, count: 0, adCount: 0, paidCount: 0 };
    countMap[r.videoId].count++;
    if (r.method === 'ad') countMap[r.videoId].adCount++;
    else countMap[r.videoId].paidCount++;
  });
  const topContent = Object.entries(countMap)
    .map(([id, d]) => ({ id: Number(id), ...d }))
    .sort((a, b) => b.count - a.count);

  const filtered = records.filter((r: any) =>
    !search || r.videoTitle?.toLowerCase().includes(search.toLowerCase()) || r.userId?.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-3">
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-black leading-none">Admin Panel</h1>
            <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">Desi Hub</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] text-slate-500">LIVE</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'unlocks', label: '🔓 Unlocks' },
          { id: 'referrals', label: '👥 Referrals' },
          { id: 'top', label: '🏆 Top Content' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all ${
              tab === t.id ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'bg-[#111] text-slate-400 border border-white/5'
            }`}
          >{t.label}</button>
        ))}
      </div>

      <div className="px-4 pb-12 mt-2 space-y-4">

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Unlocks', value: records.length, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
                { label: 'Referrals Done', value: referred.length, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                { label: 'Pending Refs', value: pending.length, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                { label: 'Coins Awarded', value: referralCoins || 0, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
              ].map((s, i) => (
                <div key={i} className={`bg-[#111] border ${s.border} rounded-2xl p-4`}>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent unlocks */}
            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Activity size={13} className="text-pink-400" />
                <span className="text-xs font-black text-white uppercase tracking-widest">Recent Unlocks</span>
              </div>
              {records.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">No unlocks yet. Users will appear here after unlocking content.</div>
              ) : records.slice(0, 6).map((r: any, i: number) => (
                <div key={i} className="px-4 py-3 border-b border-white/5 last:border-0 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-1">{r.videoTitle}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">User #{r.userId} · {new Date(r.unlockTime).toLocaleTimeString()}</p>
                  </div>
                  <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full ${r.method === 'paid' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {r.method === 'paid' ? '💰 PAID' : '📺 AD'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* UNLOCKS */}
        {tab === 'unlocks' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search by title or user ID..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50" />
            </div>
            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-black text-white uppercase">Unlock Records</span>
                <span className="text-[10px] text-slate-500">{filtered.length} records</span>
              </div>
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No unlock records yet.</div>
              ) : filtered.map((r: any, i: number) => (
                <div key={i} className="px-4 py-3 border-b border-white/5 last:border-0 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white line-clamp-1">{r.videoTitle}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-slate-500 font-mono">UID: {r.userId}</span>
                      <span className="text-[9px] text-slate-600">·</span>
                      <span className="text-[9px] text-slate-500">{new Date(r.unlockTime).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full border ${r.method === 'paid' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                    {r.method === 'paid' ? '💰 PAID' : '📺 AD'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* REFERRALS */}
        {tab === 'referrals' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="bg-[#111] border border-amber-500/20 rounded-2xl p-4">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3">Active Rules</h3>
              {['✅ Coins only after friend watches an ad', '✅ Same friend counted once only — ever', '✅ Self-referral blocked', `✅ Reward: 50 coins per referral`].map((r, i) => (
                <p key={i} className="text-[11px] text-slate-300 mb-1">{r}</p>
              ))}
            </div>

            {pending.length > 0 && (
              <div className="bg-[#111] border border-orange-500/20 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <Clock size={13} className="text-orange-400" />
                  <span className="text-xs font-black text-white uppercase">Pending ({pending.length})</span>
                </div>
                {pending.map((id, i) => (
                  <div key={i} className="px-4 py-3 border-b border-white/5 last:border-0 flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-mono">Friend #{id}</span>
                    <span className="text-[9px] text-orange-400 font-black bg-orange-500/10 px-2 py-0.5 rounded-full">Awaiting Ad</span>
                  </div>
                ))}
              </div>
            )}

            {referred.length > 0 && (
              <div className="bg-[#111] border border-emerald-500/20 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span className="text-xs font-black text-white uppercase">Completed ({referred.length})</span>
                </div>
                {referred.map((id, i) => (
                  <div key={i} className="px-4 py-3 border-b border-white/5 last:border-0 flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-mono">Friend #{id}</span>
                    <span className="text-[9px] text-emerald-400 font-black bg-emerald-500/10 px-2 py-0.5 rounded-full">+50 coins ✅</span>
                  </div>
                ))}
              </div>
            )}

            {pending.length === 0 && referred.length === 0 && (
              <div className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center text-xs text-slate-500">No referral data yet.</div>
            )}
          </motion.div>
        )}

        {/* TOP CONTENT */}
        {tab === 'top' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="bg-[#111] border border-white/5 rounded-2xl p-3 text-xs text-slate-400 text-center">
              Real unlock count — each row = one user paying or watching an ad to access that content.
            </div>
            {topContent.length === 0 ? (
              <div className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center text-xs text-slate-500">No data yet. Will populate as users unlock content.</div>
            ) : (
              <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <span className="text-xs font-black text-white uppercase">Top Videos by Real Unlocks</span>
                </div>
                {topContent.map((item, i) => (
                  <div key={item.id} className="px-4 py-3 border-b border-white/5 last:border-0 flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-300' : i === 2 ? 'bg-orange-700/20 text-orange-600' : 'bg-white/5 text-slate-500'
                    }`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">📺 {item.adCount} ad · 💰 {item.paidCount} paid</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-pink-400">{item.count}</p>
                      <p className="text-[8px] text-slate-600">unlocks</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
