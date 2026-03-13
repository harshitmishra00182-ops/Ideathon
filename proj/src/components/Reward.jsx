import { useState, useEffect, useRef } from "react";

const REWARDS = [
  { id: 1, name: "Vada Pav", coins: 150, emoji: "🍞", grad: ["#FF6B35", "#FF9A56"], desc: "Classic Mumbai street snack" },
  { id: 2, name: "Masala Chai", coins: 80, emoji: "☕", grad: ["#C47B2B", "#E8A44A"], desc: "Hot & freshly brewed" },
  { id: 3, name: "Samosa (2pc)", coins: 120, emoji: "🔺", grad: ["#D4A017", "#F5C842"], desc: "Crispy golden samosas" },
  { id: 4, name: "Pav Bhaji", coins: 200, emoji: "🍛", grad: ["#E84040", "#FF7043"], desc: "Butter pav bhaji combo" },
  { id: 5, name: "Sweet Lassi", coins: 100, emoji: "🥛", grad: ["#3B82F6", "#06B6D4"], desc: "Sweet or salted lassi" },
  { id: 6, name: "Full Thali", coins: 350, emoji: "🍱", grad: ["#22C55E", "#10B981"], desc: "Full meal combo thali" },
];

const MILESTONES = [
  { coins: 100, reward: "Unlock Chai Reward", icon: "☕" },
  { coins: 250, reward: "Unlock Snack Combo", icon: "🔺" },
  { coins: 500, reward: "Silver Member Badge", icon: "🥈" },
  { coins: 1000, reward: "Gold Member + Free Thali", icon: "🥇" },
];

const HISTORY = [
  { id: 1, type: "earn", label: "Order #CB-2041", coins: +25, date: "Today, 1:12 PM" },
  { id: 2, type: "earn", label: "Referral Bonus – Rohan", coins: +50, date: "Yesterday" },
  { id: 3, type: "redeem", label: "Redeemed: Free Chai", coins: -80, date: "Mar 10" },
  { id: 4, type: "earn", label: "Order #CB-2038", coins: +25, date: "Mar 10" },
  { id: 5, type: "earn", label: "Daily Streak Bonus", coins: +15, date: "Mar 9" },
];

export default function RewardPage() {
  const [coins, setCoins] = useState(320);
  const [redeeming, setRedeeming] = useState(null);
  const [redeemed, setRedeemed] = useState([]);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState("rewards");
  const [displayCoins, setDisplayCoins] = useState(0);
  const headerRef = useRef(null);
  const cardRef = useRef(null);
  const coinsRef = useRef(null);

  // Count-up animation on mount
  useEffect(() => {
    let start = 0;
    const end = coins;
    const duration = 1200;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayCoins(end);
        clearInterval(timer);
      } else {
        setDisplayCoins(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, []);

  // Animate header + card on mount via CSS
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.opacity = "0";
      headerRef.current.style.transform = "translateY(-20px)";
      requestAnimationFrame(() => {
        headerRef.current.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        headerRef.current.style.opacity = "1";
        headerRef.current.style.transform = "translateY(0)";
      });
    }
    if (cardRef.current) {
      cardRef.current.style.opacity = "0";
      cardRef.current.style.transform = "translateY(30px)";
      setTimeout(() => {
        cardRef.current.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        cardRef.current.style.opacity = "1";
        cardRef.current.style.transform = "translateY(0)";
      }, 200);
    }
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleRedeem = (reward) => {
    if (coins < reward.coins) {
      showToast(`Need ${reward.coins - coins} more coins!`, "error");
      return;
    }
    setRedeeming(reward.id);
    setTimeout(() => {
      setCoins((c) => {
        const newVal = c - reward.coins;
        setDisplayCoins(newVal);
        return newVal;
      });
      setRedeemed((r) => [...r, reward.id]);
      setRedeeming(null);
      showToast(`🎉 ${reward.name} redeemed! Show at counter.`);
    }, 1200);
  };

  const nextMilestone = MILESTONES.find((m) => m.coins > coins);
  const progress = nextMilestone ? Math.min((coins / nextMilestone.coins) * 100, 100) : 100;

  const TabContent = () => {
    if (tab === "rewards") return (
      <div>
        <p className="text-xs mb-5" style={{ color: "#9CA3AF", letterSpacing: "0.05em" }}>REDEEM COINS FOR FREE MEALS</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {REWARDS.map((r, i) => {
            const done = redeemed.includes(r.id);
            const loading = redeeming === r.id;
            const canAfford = coins >= r.coins;
            return (
              <div
                key={r.id}
                style={{
                  borderRadius: "20px",
                  background: done ? "#F0FDF4" : canAfford ? "#FFFBF5" : "#F9FAFB",
                  border: `1.5px solid ${done ? "#86EFAC" : canAfford ? "#FED7AA" : "#E5E7EB"}`,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  opacity: canAfford || done ? 1 : 0.65,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  animationDelay: `${i * 0.05}s`,
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `linear-gradient(135deg, ${r.grad[0]}, ${r.grad[1]})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, boxShadow: `0 4px 12px ${r.grad[0]}40`
                }}>{r.emoji}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", marginBottom: 2 }}>{r.name}</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF" }}>{r.desc}</p>
                </div>
                <button
                  onClick={() => !done && handleRedeem(r)}
                  disabled={done || loading}
                  style={{
                    width: "100%", padding: "9px 0", borderRadius: 12,
                    fontSize: 11, fontWeight: 700, border: "none", cursor: done ? "default" : "pointer",
                    background: done ? "#DCFCE7" : loading ? "#FED7AA" : canAfford
                      ? `linear-gradient(135deg, ${r.grad[0]}, ${r.grad[1]})` : "#E5E7EB",
                    color: done ? "#16A34A" : loading ? "#C2410C" : canAfford ? "#fff" : "#9CA3AF",
                    transition: "all 0.2s ease",
                    boxShadow: canAfford && !done ? `0 3px 10px ${r.grad[0]}40` : "none",
                  }}
                >
                  {done ? "✓ Redeemed" : loading ? "Redeeming..." : `🪙 ${r.coins} coins`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );

    if (tab === "milestones") return (
      <div>
        <p className="text-xs mb-5" style={{ color: "#9CA3AF", letterSpacing: "0.05em" }}>EARN & UNLOCK SPECIAL REWARDS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MILESTONES.map((m, i) => {
            const achieved = coins >= m.coins;
            const pct = Math.min((coins / m.coins) * 100, 100);
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                borderRadius: 18, border: `1.5px solid ${achieved ? "#86EFAC" : "#E5E7EB"}`,
                background: achieved ? "#F0FDF4" : "#FAFAFA",
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: achieved ? "#DCFCE7" : "#F3F4F6",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>
                  {achieved ? "✅" : m.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", marginBottom: 2 }}>{m.reward}</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: achieved ? 0 : 6 }}>{m.coins} coins required</p>
                  {!achieved && (
                    <div style={{ height: 5, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#F97316,#FBBF24)", borderRadius: 99, transition: "width 1s ease" }} />
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 99,
                  background: achieved ? "#22C55E" : "#F3F4F6",
                  color: achieved ? "#fff" : "#6B7280",
                }}>
                  {achieved ? "Done" : `${m.coins - coins} left`}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 20, background: "#FFF7ED", border: "1.5px solid #FED7AA", borderRadius: 20, padding: 18 }}>
          <p style={{ fontWeight: 700, color: "#C2410C", fontSize: 13, marginBottom: 12 }}>💡 How to earn coins</p>
          {[["Every order placed","+25"],["Refer a friend","+50"],["Daily login streak","+15"],["Write a review","+10"],["First order of day","+5"]].map(([a,b]) => (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, marginBottom: 8, borderBottom: "1px solid #FED7AA" }}>
              <span style={{ fontSize: 12, color: "#6B7280" }}>{a}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#EA580C" }}>{b} coins</span>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div>
        <p className="text-xs mb-5" style={{ color: "#9CA3AF", letterSpacing: "0.05em" }}>YOUR COIN ACTIVITY</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {HISTORY.map((h) => (
            <div key={h.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
              borderRadius: 16, transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{
                width: 42, height: 42, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 17,
                background: h.type === "earn" ? "#DCFCE7" : "#FEE2E2",
              }}>
                {h.type === "earn" ? "⬆️" : "⬇️"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: "#1F2937" }}>{h.label}</p>
                <p style={{ fontSize: 11, color: "#9CA3AF" }}>{h.date}</p>
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: h.type === "earn" ? "#22C55E" : "#EF4444" }}>
                {h.coins > 0 ? "+" : ""}{h.coins} 🪙
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F5F0", fontFamily: "'DM Sans', sans-serif", paddingBottom: 40 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&display=swap');
        @keyframes pulse-coin { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toast-in { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", zIndex: 9999,
          padding: "12px 24px", borderRadius: 99,
          background: toast.type === "error" ? "#EF4444" : "#22C55E",
          color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          animation: "toast-in 0.35s ease forwards",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div ref={headerRef} style={{
        background: "linear-gradient(145deg,#FF6B35 0%,#FF9F56 50%,#FFC372 100%)",
        padding: "48px 24px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{ position:"absolute", top:-60, right:-60, width:180, height:180, background:"rgba(255,255,255,0.1)", borderRadius:"50%" }} />
        <div style={{ position:"absolute", bottom:-40, left:-40, width:120, height:120, background:"rgba(255,255,255,0.08)", borderRadius:"50%" }} />
        <div style={{ position:"absolute", top:"40%", right:"20%", width:60, height:60, background:"rgba(255,255,255,0.07)", borderRadius:"50%" }} />

        <p style={{ color:"rgba(255,255,255,0.8)", fontSize:12, fontWeight:600, letterSpacing:"0.1em", marginBottom:8 }}>YOUR BALANCE</p>
        <div style={{ display:"flex", alignItems:"flex-end", gap:12, marginBottom:6 }}>
          <span style={{ fontSize:64, fontWeight:900, color:"#fff", lineHeight:1 }}>{displayCoins}</span>
          <span style={{ fontSize:24, fontWeight:700, color:"rgba(255,255,255,0.75)", marginBottom:6 }}>🪙</span>
        </div>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:13, marginBottom:20 }}>
          ≈ ₹{(coins * 0.5).toFixed(0)} equivalent value
        </p>

        {nextMilestone && (
          <div style={{
            background:"rgba(255,255,255,0.18)", backdropFilter:"blur(12px)",
            borderRadius:18, padding:16, border:"1px solid rgba(255,255,255,0.25)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>{nextMilestone.icon} {nextMilestone.reward}</span>
              <span style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>{coins}/{nextMilestone.coins}</span>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.25)", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"#fff", borderRadius:99, transition:"width 1.2s ease" }} />
            </div>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div ref={cardRef} style={{
        margin:"0 16px", marginTop:-40,
        background:"#fff", borderRadius:28, boxShadow:"0 12px 48px rgba(0,0,0,0.10)",
        overflow:"hidden",
      }}>
        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"1px solid #F3F4F6" }}>
          {[["rewards","🎁 Rewards"],["milestones","🏆 Goals"],["history","📋 History"]].map(([t,label]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:"16px 0", fontSize:12, fontWeight:700,
              color: tab===t ? "#F97316" : "#9CA3AF",
              borderBottom: tab===t ? "2.5px solid #F97316" : "2.5px solid transparent",
              background:"none", border:"none", borderBottom: tab===t ? "2.5px solid #F97316" : "2.5px solid transparent",
              cursor:"pointer", letterSpacing:"0.02em", transition:"color 0.2s",
            }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ padding:"22px 20px 28px" }}>
          <TabContent />
        </div>
      </div>
    </div>
  );
}