import { useState, useEffect, useRef } from "react";

const PLANS = [
  {
    id: "basic", name: "Starter", price: 99,
    color: "#6B7280", grad: "linear-gradient(135deg,#6B7280,#9CA3AF)",
    badge: null,
    perks: ["5% cashback on orders","10 free coins/day","Priority queue skip (1x/week)","Basic nutrition tracking"],
  },
  {
    id: "pro", name: "Campus Pro", price: 199,
    color: "#F97316", grad: "linear-gradient(135deg,#F97316,#FBBF24)",
    badge: "Most Popular",
    perks: ["10% cashback on orders","25 free coins/day","Unlimited queue skip","Free meal on birthday 🎂","Early access to new menus","Group order discount 5%"],
  },
  {
    id: "elite", name: "Elite", price: 349,
    color: "#7C3AED", grad: "linear-gradient(135deg,#7C3AED,#EC4899)",
    badge: "Best Value",
    perks: ["15% cashback on orders","50 free coins/day","Unlimited queue skip","1 Free meal/week 🍛","Exclusive vendor deals","Dedicated support line","Annual summary report"],
  },
];

const QUICK_AMOUNTS = [50, 100, 200, 500];

const WALLET_REWARDS = [
  { threshold: 100, reward: "10 Bonus Coins", icon: "🪙" },
  { threshold: 250, reward: "25 Bonus Coins", icon: "🪙" },
  { threshold: 500, reward: "Free Chai + 60 Coins", icon: "☕" },
  { threshold: 1000, reward: "Free Meal + 150 Coins", icon: "🍛" },
];

const INITIAL_TXNS = [
  { id: 1, label: "Added via UPI", amount: +200, date: "Today", type: "credit" },
  { id: 2, label: "Order #CB-2041", amount: -89, date: "Today", type: "debit" },
  { id: 3, label: "Cashback – Pro Plan", amount: +12, date: "Yesterday", type: "credit" },
  { id: 4, label: "Order #CB-2038", amount: -45, date: "Mar 10", type: "debit" },
  { id: 5, label: "Added via Card", amount: +500, date: "Mar 8", type: "credit" },
];

export default function WalletPage() {
  const [balance, setBalance] = useState(342);
  const [coins, setCoins] = useState(320);
  const [activePlan, setActivePlan] = useState("pro");
  const [tab, setTab] = useState("wallet");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmPlan, setConfirmPlan] = useState(null);
  const [displayBalance, setDisplayBalance] = useState(342);
  const [transactions, setTransactions] = useState(INITIAL_TXNS);
  const headerRef = useRef(null);
  const cardRef = useRef(null);

  // Animate header/card on mount
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.opacity = "0";
      headerRef.current.style.transform = "translateY(-18px)";
      requestAnimationFrame(() => {
        headerRef.current.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        headerRef.current.style.opacity = "1";
        headerRef.current.style.transform = "translateY(0)";
      });
    }
    if (cardRef.current) {
      cardRef.current.style.opacity = "0";
      cardRef.current.style.transform = "translateY(32px)";
      setTimeout(() => {
        cardRef.current.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        cardRef.current.style.opacity = "1";
        cardRef.current.style.transform = "translateY(0)";
      }, 180);
    }
  }, []);

  // Animated count-up for balance
  const animateBalance = (target) => {
    const start = displayBalance;
    const diff = target - start;
    const duration = 800;
    const startTime = performance.now();
    const step = (now) => {
      const pct = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setDisplayBalance(Math.round(start + diff * eased));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddMoney = () => {
    const amt = selectedAmount || parseInt(customAmount);
    if (!amt || amt < 10) {
      showToast("Enter a valid amount (min ₹10)", "error");
      return;
    }
    setAdding(true);
    setTimeout(() => {
      const newBalance = balance + amt;
      setBalance(newBalance);
      animateBalance(newBalance);

      // Add to transactions
      const newTxn = {
        id: Date.now(),
        label: "Added via UPI",
        amount: +amt,
        date: "Just now",
        type: "credit",
      };
      setTransactions(prev => [newTxn, ...prev]);

      // Unlock bonus coins
      const reward = [...WALLET_REWARDS].reverse().find(r => amt >= r.threshold);
      if (reward) {
        const bonusCoins = parseInt(reward.reward.match(/\d+/)?.[0] || 0);
        if (bonusCoins) setCoins(c => c + bonusCoins);
        showToast(`₹${amt} added! 🎉 Bonus: ${reward.reward}`);
      } else {
        showToast(`₹${amt} added to wallet!`);
      }

      setAdding(false);
      setSelectedAmount(null);
      setCustomAmount("");
    }, 1300);
  };

  const handlePlanSelect = (planId) => {
    if (planId === activePlan) return;
    setConfirmPlan(planId);
  };

  const confirmSubscribe = () => {
    const plan = PLANS.find(p => p.id === confirmPlan);
    if (balance < plan.price) {
      showToast(`Insufficient balance! Add ₹${plan.price - balance} more.`, "error");
      setConfirmPlan(null);
      return;
    }
    const newBal = balance - plan.price;
    setBalance(newBal);
    animateBalance(newBal);
    setActivePlan(confirmPlan);
    setConfirmPlan(null);
    showToast(`🎉 Switched to ${plan.name} plan!`);
  };

  const currentPlan = PLANS.find(p => p.id === activePlan);

  return (
    <div style={{ minHeight:"100vh", background:"#F0F2F5", fontFamily:"'DM Sans',sans-serif", paddingBottom:40 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&display=swap');
        @keyframes toast-in { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes modal-in { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes badge-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.4)} 50%{box-shadow:0 0 0 6px rgba(249,115,22,0)} }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:20, left:"50%", zIndex:9999,
          padding:"12px 22px", borderRadius:99,
          background: toast.type==="error" ? "#EF4444" : "#22C55E",
          color:"#fff", fontSize:13, fontWeight:600,
          boxShadow:"0 8px 32px rgba(0,0,0,0.18)",
          animation:"toast-in 0.35s ease forwards",
          whiteSpace:"nowrap",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Confirm Modal */}
      {confirmPlan && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:50, display:"flex", alignItems:"flex-end" }}>
          <div style={{ background:"#fff", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", animation:"modal-in 0.35s ease" }}>
            <p style={{ fontWeight:900, fontSize:18, color:"#111827", marginBottom:6 }}>Switch Plan?</p>
            <p style={{ fontSize:13, color:"#6B7280", marginBottom:22 }}>
              ₹{PLANS.find(p=>p.id===confirmPlan)?.price}/month will be deducted from your wallet balance.
            </p>
            <div style={{ display:"flex", gap:12 }}>
              <button onClick={() => setConfirmPlan(null)} style={{
                flex:1, padding:"14px 0", borderRadius:16, border:"2px solid #E5E7EB",
                color:"#374151", fontWeight:700, fontSize:14, background:"#fff", cursor:"pointer",
              }}>Cancel</button>
              <button onClick={confirmSubscribe} style={{
                flex:1, padding:"14px 0", borderRadius:16, border:"none",
                background:"linear-gradient(135deg,#F97316,#FBBF24)",
                color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer",
                boxShadow:"0 4px 16px rgba(249,115,22,0.35)",
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div ref={headerRef} style={{
        background:"linear-gradient(145deg,#1E293B 0%,#0F172A 100%)",
        padding:"48px 24px 80px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:220, height:220, background:"rgba(249,115,22,0.08)", borderRadius:"50%" }} />
        <div style={{ position:"absolute", bottom:-60, left:-60, width:160, height:160, background:"rgba(249,115,22,0.05)", borderRadius:"50%" }} />

        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontWeight:600, letterSpacing:"0.12em", marginBottom:10 }}>WALLET BALANCE</p>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, marginBottom:4 }}>
          <span style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:10 }}>₹</span>
          <span style={{ fontSize:60, fontWeight:900, color:"#fff", lineHeight:1 }}>{displayBalance}</span>
          <span style={{ fontSize:16, color:"rgba(255,255,255,0.3)", marginBottom:8 }}>.00</span>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:16 }}>
          <div style={{
            display:"flex", alignItems:"center", gap:6,
            background:"rgba(249,115,22,0.18)", padding:"7px 14px", borderRadius:99,
            border:"1px solid rgba(249,115,22,0.3)",
          }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#FDBA74" }}>🪙 {coins} coins</span>
          </div>
          <div style={{
            display:"flex", alignItems:"center", gap:6,
            background:"rgba(255,255,255,0.08)", padding:"7px 14px", borderRadius:99,
            border:"1px solid rgba(255,255,255,0.12)",
          }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:currentPlan.color, marginRight:2 }} />
            <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.8)" }}>{currentPlan.name} Plan</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div ref={cardRef} style={{
        margin:"0 16px", marginTop:-40,
        background:"#fff", borderRadius:28, boxShadow:"0 12px 48px rgba(0,0,0,0.12)",
        overflow:"hidden",
      }}>
        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"1px solid #F3F4F6" }}>
          {[["wallet","💳 Add Money"],["subscribe","⭐ Plans"],["history","📋 History"]].map(([t,label]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:"16px 0", fontSize:11, fontWeight:800,
              color: tab===t ? "#F97316" : "#9CA3AF",
              borderBottom: tab===t ? "2.5px solid #F97316" : "2.5px solid transparent",
              background:"none", border:"none",
              borderBottom: tab===t ? "2.5px solid #F97316" : "2.5px solid transparent",
              cursor:"pointer", letterSpacing:"0.06em", transition:"color 0.2s",
            }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding:"22px 20px 28px" }}>

          {/* WALLET TAB */}
          {tab === "wallet" && (
            <div>
              <p style={{ fontSize:11, color:"#9CA3AF", letterSpacing:"0.08em", marginBottom:18 }}>TOP UP YOUR CAMPUSBITE WALLET</p>

              {/* Quick amounts */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
                {QUICK_AMOUNTS.map(amt => (
                  <button key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }} style={{
                    padding:"14px 0", borderRadius:14, fontSize:14, fontWeight:700,
                    border: selectedAmount===amt ? "2px solid #F97316" : "2px solid #E5E7EB",
                    background: selectedAmount===amt ? "linear-gradient(135deg,#FF8C42,#FBBF24)" : "#FAFAFA",
                    color: selectedAmount===amt ? "#fff" : "#374151",
                    cursor:"pointer", transition:"all 0.2s ease",
                    transform: selectedAmount===amt ? "scale(1.06)" : "scale(1)",
                    boxShadow: selectedAmount===amt ? "0 4px 16px rgba(249,115,22,0.3)" : "none",
                  }}>
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div style={{ position:"relative", marginBottom:18 }}>
                <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontWeight:700, color:"#9CA3AF", fontSize:16 }}>₹</span>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  style={{
                    width:"100%", paddingLeft:36, paddingRight:16, paddingTop:14, paddingBottom:14,
                    borderRadius:16, border:"2px solid", borderColor: customAmount ? "#F97316" : "#E5E7EB",
                    fontSize:14, fontWeight:600, color:"#1F2937", background:"#FAFAFA",
                    outline:"none", boxSizing:"border-box", transition:"border-color 0.2s",
                    fontFamily:"'DM Sans',sans-serif",
                  }}
                />
              </div>

              {/* Bonus rewards strip */}
              <div style={{ background:"#FFF7ED", border:"1.5px solid #FED7AA", borderRadius:18, padding:16, marginBottom:20 }}>
                <p style={{ fontWeight:700, color:"#C2410C", fontSize:12, marginBottom:12, letterSpacing:"0.04em" }}>🎁 ADD MONEY & UNLOCK REWARDS</p>
                {WALLET_REWARDS.map(r => (
                  <div key={r.threshold} style={{ display:"flex", justifyContent:"space-between", paddingBottom:8, marginBottom:8, borderBottom:"1px solid rgba(253,186,116,0.3)" }}>
                    <span style={{ fontSize:12, color:"#6B7280" }}>Add ₹{r.threshold}+</span>
                    <span style={{ fontSize:12, fontWeight:700, color:"#EA580C" }}>{r.icon} {r.reward}</span>
                  </div>
                ))}
              </div>

              {/* Add button */}
              <button
                onClick={handleAddMoney}
                disabled={adding || (!selectedAmount && !customAmount)}
                style={{
                  width:"100%", padding:"16px 0", borderRadius:18, border:"none",
                  background: adding ? "linear-gradient(135deg,#FBD38D,#FCD34D)" : "linear-gradient(135deg,#F97316,#FBBF24)",
                  color:"#fff", fontWeight:900, fontSize:15, letterSpacing:"0.04em",
                  cursor: adding ? "not-allowed" : "pointer",
                  boxShadow:"0 6px 24px rgba(249,115,22,0.35)",
                  transition:"all 0.25s ease",
                  transform: adding ? "scale(0.98)" : "scale(1)",
                  opacity: (!selectedAmount && !customAmount) ? 0.5 : 1,
                }}
              >
                {adding ? "Processing..." : `Add ₹${selectedAmount || customAmount || "?"} to Wallet`}
              </button>

              {/* Payment methods */}
              <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:14, flexWrap:"wrap" }}>
                {["UPI","Credit Card","Debit Card","Net Banking"].map(m => (
                  <span key={m} style={{ fontSize:11, color:"#9CA3AF", background:"#F3F4F6", padding:"5px 10px", borderRadius:8, fontWeight:500 }}>{m}</span>
                ))}
              </div>
            </div>
          )}

          {/* SUBSCRIBE TAB */}
          {tab === "subscribe" && (
            <div>
              <p style={{ fontSize:11, color:"#9CA3AF", letterSpacing:"0.08em", marginBottom:18 }}>CHOOSE A PLAN & SAVE MORE</p>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {PLANS.map(plan => {
                  const isActive = activePlan === plan.id;
                  return (
                    <div key={plan.id} style={{
                      borderRadius:22, overflow:"hidden",
                      border: isActive ? "2.5px solid #F97316" : "1.5px solid #E5E7EB",
                      boxShadow: isActive ? "0 6px 24px rgba(249,115,22,0.15)" : "none",
                      transition:"all 0.3s ease",
                    }}>
                      <div style={{
                        background: plan.grad, padding:"16px 18px",
                        display:"flex", justifyContent:"space-between", alignItems:"center",
                      }}>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                            <p style={{ fontWeight:900, fontSize:16, color:"#fff" }}>{plan.name}</p>
                            {plan.badge && (
                              <span style={{ background:"rgba(255,255,255,0.25)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:99, border:"1px solid rgba(255,255,255,0.3)" }}>
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:13 }}>₹{plan.price}/month</p>
                        </div>
                        {isActive ? (
                          <span style={{ background:"#fff", color:plan.color, fontSize:11, fontWeight:800, padding:"7px 14px", borderRadius:99, animation:"badge-pulse 2s infinite" }}>Active ✓</span>
                        ) : (
                          <button onClick={() => handlePlanSelect(plan.id)} style={{
                            background:"rgba(255,255,255,0.2)", color:"#fff", fontSize:12, fontWeight:700,
                            padding:"7px 14px", borderRadius:99, border:"1.5px solid rgba(255,255,255,0.4)",
                            cursor:"pointer", transition:"background 0.2s",
                          }}>Switch</button>
                        )}
                      </div>
                      <div style={{ background:"#fff", padding:"14px 18px" }}>
                        {plan.perks.map(perk => (
                          <div key={perk} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                            <span style={{ color:"#22C55E", fontSize:12, fontWeight:700 }}>✓</span>
                            <span style={{ fontSize:12, color:"#4B5563" }}>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ textAlign:"center", color:"#9CA3AF", fontSize:11, marginTop:14 }}>Plans auto-renew monthly from wallet balance</p>
            </div>
          )}

          {/* HISTORY TAB */}
          {tab === "history" && (
            <div>
              <p style={{ fontSize:11, color:"#9CA3AF", letterSpacing:"0.08em", marginBottom:18 }}>RECENT TRANSACTIONS</p>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {transactions.map(t => (
                  <div key={t.id} style={{
                    display:"flex", alignItems:"center", gap:14, padding:"13px 14px",
                    borderRadius:16, transition:"background 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{
                      width:44, height:44, borderRadius:"50%", display:"flex",
                      alignItems:"center", justifyContent:"center", fontSize:18,
                      background: t.type==="credit" ? "#DCFCE7" : "#FEE2E2",
                    }}>
                      {t.type==="credit" ? "⬆️" : "⬇️"}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:600, fontSize:13, color:"#1F2937", marginBottom:2 }}>{t.label}</p>
                      <p style={{ fontSize:11, color:"#9CA3AF" }}>{t.date}</p>
                    </div>
                    <span style={{ fontWeight:700, fontSize:14, color: t.type==="credit" ? "#22C55E" : "#EF4444" }}>
                      {t.amount > 0 ? "+" : ""}₹{Math.abs(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}