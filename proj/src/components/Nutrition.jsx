import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const UPI_ID   = "harshitmishra00182-2@okicici"
const UPI_NAME = "CampusBite DMCE"

const menuItems = [
  { id:1, name:'Vada Pav',    emoji:'🥙', kcal:320, protein:8,  carbs:45,  fat:12, fiber:3,  price:25,  category:'Mumbai Street' },
  { id:2, name:'Pav Bhaji',   emoji:'🍛', kcal:480, protein:12, carbs:68,  fat:18, fiber:7,  price:70,  category:'Mumbai Street' },
  { id:3, name:'Bhel Puri',   emoji:'🥗', kcal:210, protein:5,  carbs:38,  fat:5,  fiber:4,  price:35,  category:'Snacks'        },
  { id:4, name:'Masala Chai', emoji:'☕', kcal:90,  protein:3,  carbs:12,  fat:4,  fiber:0,  price:15,  category:'Beverages'     },
  { id:5, name:'Samosa',      emoji:'🔺', kcal:180, protein:4,  carbs:22,  fat:9,  fiber:2,  price:20,  category:'Snacks'        },
  { id:6, name:'Thali',       emoji:'🍱', kcal:850, protein:28, carbs:110, fat:30, fiber:12, price:90,  category:'Meals'         },
  { id:7, name:'Lassi',       emoji:'🥛', kcal:180, protein:7,  carbs:28,  fat:5,  fiber:0,  price:40,  category:'Beverages'     },
  { id:8, name:'Poha',        emoji:'🍚', kcal:250, protein:6,  carbs:42,  fat:7,  fiber:3,  price:30,  category:'Meals'         },
  { id:9, name:'Sev Puri',    emoji:'🫓', kcal:280, protein:6,  carbs:35,  fat:13, fiber:2,  price:40,  category:'Snacks'        },
]

const GOALS = { kcal:2000, protein:60, carbs:250, fat:65, fiber:25 }

const macroColors = {
  kcal:'#f97316', protein:'#3b82f6', carbs:'#f59e0b', fat:'#ec4899', fiber:'#22c55e',
}

const genToken    = () => Math.floor(100000 + Math.random() * 900000).toString()
const buildUpiUri = (amount, token) => {
  const p = new URLSearchParams({ pa: UPI_ID, pn: UPI_NAME, am: amount.toFixed(2), cu: 'INR', tn: `CampusBite #${token}`, tr: token })
  return `upi://pay?${p}`
}

// ── Order Confirmation ─────────────────────────────────────────────────────────
function OrderConfirmation({ token, items, total, onBack }) {
  const [method,   setMethod  ] = useState(null)
  const [utrInput, setUtrInput] = useState('')
  const [utrError, setUtrError] = useState('')
  const [paid,     setPaid    ] = useState(false)
  const upiUri = buildUpiUri(total, token)

  const handleUtrSubmit = () => {
    if (!/^\d{12}$/.test(utrInput.trim())) { setUtrError('Enter a valid 12-digit UTR from your payment app'); return }
    setUtrError('')
    setPaid(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#02030a', fontFamily: "'DM Sans',sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
      <div style={{ background: '#0d0f1a', border: '1px solid #1e2235', borderRadius: 24, padding: '36px 32px', maxWidth: 500, width: '100%', boxShadow: '0 0 60px rgba(249,115,22,.15)', textAlign: 'center' }}>
        <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>🎉</div>
        <div style={{ color: 'rgba(226,232,255,.45)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Order Confirmed</div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 'clamp(2.4rem,8vw,3.6rem)', fontWeight: 900, background: 'linear-gradient(90deg,#f97316,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.12em', lineHeight: 1.1, margin: '6px 0 8px' }}>
          #{token}
        </div>
        <div style={{ color: 'rgba(226,232,255,.5)', fontSize: '0.82rem', marginBottom: 16 }}>Your token number — show this at the counter</div>

        <div style={{ marginBottom: 20 }}>
          {items.map(it => (
            <span key={it.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(249,115,22,.1)', border: '1px solid rgba(249,115,22,.2)', borderRadius: 20, padding: '4px 11px', fontSize: '0.78rem', color: '#f97316', fontWeight: 600, margin: '3px' }}>
              {it.emoji} {it.name} ×{it.qty} — {it.kcal * it.qty}kcal
            </span>
          ))}
        </div>

        <div style={{ background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 12, padding: '10px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
          <span style={{ color: 'rgba(226,232,255,.5)' }}>Total Calories</span>
          <span style={{ color: '#22c55e', fontWeight: 700 }}>{items.reduce((s, i) => s + i.kcal * i.qty, 0)} kcal</span>
        </div>

        <div style={{ background: '#131629', borderRadius: 16, padding: 20, textAlign: 'left' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'rgba(226,232,255,.7)', marginBottom: 14 }}>💳 Pay ₹{total}</div>

          {/* COD */}
          <div onClick={() => { if (!paid) { setMethod('cod'); setUtrInput(''); setUtrError('') } }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 11, cursor: paid ? 'default' : 'pointer', marginBottom: 8, border: method === 'cod' ? '2px solid #f97316' : '1px solid #1e2235', background: method === 'cod' ? 'rgba(249,115,22,.08)' : 'transparent', transition: 'all .15s', opacity: paid && method !== 'cod' ? 0.4 : 1 }}>
            <span style={{ fontSize: '1.4rem', width: 34, textAlign: 'center' }}>💵</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#e2e8ff' }}>Cash on Delivery</div>
              <div style={{ fontSize: '0.76rem', color: 'rgba(226,232,255,.4)', marginTop: 2 }}>Pay ₹{total} cash when you collect</div>
            </div>
            {method === 'cod' && <span style={{ marginLeft: 'auto', color: '#f97316' }}>✓</span>}
          </div>

          {/* UPI */}
          <div onClick={() => { if (!paid) { setMethod('upi'); setUtrInput(''); setUtrError('') } }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 11, cursor: paid ? 'default' : 'pointer', marginBottom: 8, border: method === 'upi' ? '2px solid #f97316' : '1px solid #1e2235', background: method === 'upi' ? 'rgba(249,115,22,.08)' : 'transparent', transition: 'all .15s', opacity: paid && method !== 'upi' ? 0.4 : 1 }}>
            <span style={{ fontSize: '1.4rem', width: 34, textAlign: 'center' }}>📱</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#e2e8ff' }}>UPI Payment</div>
              <div style={{ fontSize: '0.76rem', color: 'rgba(226,232,255,.4)', marginTop: 2 }}>GPay · PhonePe · Paytm · any UPI app</div>
            </div>
            {method === 'upi' && <span style={{ marginLeft: 'auto', color: '#f97316' }}>✓</span>}
          </div>

          {method === 'upi' && !paid && (
            <div style={{ marginTop: 8 }}>
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <div style={{ color: 'rgba(226,232,255,.4)', fontSize: '0.76rem', marginBottom: 10 }}>Scan to pay <span style={{ color: '#22c55e', fontWeight: 700 }}>₹{total}</span></div>
                <div style={{ background: '#fff', borderRadius: 14, padding: 14, display: 'inline-block', boxShadow: '0 4px 24px rgba(249,115,22,.2)' }}>
                  <QRCodeSVG value={upiUri} size={170} level="H" fgColor="#1a1a1a" includeMargin={false} />
                </div>
                <div style={{ color: 'rgba(226,232,255,.25)', fontSize: '0.7rem', marginTop: 6 }}>UPI: <span style={{ color: '#fbbf24', fontWeight: 700 }}>{UPI_ID}</span> · Ref: #{token}</div>
              </div>
              <div style={{ background: '#0d0f1a', border: '1px solid #1e2235', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'rgba(226,232,255,.6)', marginBottom: 4 }}>🔐 Enter UTR to confirm payment</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(226,232,255,.35)', marginBottom: 10 }}>Find the 12-digit UTR in your GPay / PhonePe / Paytm receipt after paying</div>
                <input type="text" maxLength={12} placeholder="e.g. 426891234567" value={utrInput}
                  onChange={e => { setUtrInput(e.target.value.replace(/\D/g, '')); setUtrError('') }}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: utrError ? '1.5px solid #ef4444' : '1.5px solid #2a2d3e', background: '#131629', color: '#e2e8ff', fontSize: '0.92rem', fontFamily: "'Orbitron',monospace", letterSpacing: '0.08em', outline: 'none', boxSizing: 'border-box' }}
                />
                {utrError && <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: 6 }}>{utrError}</div>}
                <button onClick={handleUtrSubmit}
                  style={{ width: '100%', padding: 11, marginTop: 10, background: utrInput.length === 12 ? 'linear-gradient(135deg,#f97316,#ef4444)' : '#1e2235', color: utrInput.length === 12 ? '#fff' : 'rgba(226,232,255,.3)', border: 'none', borderRadius: 9, fontWeight: 800, fontSize: '0.88rem', cursor: utrInput.length === 12 ? 'pointer' : 'not-allowed', transition: 'all .2s' }}>
                  ✅ Verify & Confirm Payment
                </button>
              </div>
            </div>
          )}

          {method === 'cod' && !paid && (
            <button onClick={() => setPaid(true)}
              style={{ width: '100%', padding: 13, marginTop: 14, background: 'linear-gradient(135deg,#f97316,#ef4444)', color: '#fff', border: 'none', borderRadius: 11, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}>
              ✅ Confirm — I'll Pay Cash at Counter
            </button>
          )}

          {paid && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 20, padding: '8px 18px', fontSize: '0.84rem', color: '#22c55e', fontWeight: 700 }}>
                ✅ {method === 'cod' ? 'Confirmed — Pay cash at pickup' : `Payment Verified · UTR: ${utrInput}`}
              </div>
              <div style={{ color: 'rgba(226,232,255,.3)', fontSize: '0.75rem', marginTop: 8 }}>
                Show token <span style={{ color: '#fbbf24', fontWeight: 700 }}>#{token}</span> at the counter
              </div>
            </div>
          )}
        </div>

        <button onClick={onBack} style={{ marginTop: 20, background: 'transparent', border: '1px solid #1e2235', color: 'rgba(226,232,255,.4)', padding: '9px 22px', borderRadius: 10, cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600 }}>
          ← Back to Tracker
        </button>
      </div>
    </div>
  )
}

// ── Main Nutrition ─────────────────────────────────────────────────────────────
export default function Nutrition() {
  const [logged,    setLogged   ] = useState([])
  const [cart,      setCart     ] = useState({})
  const [showCart,  setShowCart ] = useState(false)
  const [orderData, setOrderData] = useState(null)

  const toggleLog = (item) => {
    setLogged(prev => prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item])
  }

  const updateCart = (id, delta) => {
    setCart(prev => {
      const next = { ...prev, [id]: (prev[id] || 0) + delta }
      if (next[id] <= 0) delete next[id]
      return next
    })
  }

  const cartItems  = menuItems.filter(i => cart[i.id]).map(i => ({ ...i, qty: cart[i.id] }))
  const cartTotal  = cartItems.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount  = cartItems.reduce((s, i) => s + i.qty, 0)

  const totals = logged.reduce((acc, item) => ({
    kcal:    acc.kcal    + item.kcal,
    protein: acc.protein + item.protein,
    carbs:   acc.carbs   + item.carbs,
    fat:     acc.fat     + item.fat,
    fiber:   acc.fiber   + item.fiber,
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })

  const remaining = GOALS.kcal - totals.kcal

  const macros = [
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs',   label: 'Carbs',   unit: 'g' },
    { key: 'fat',     label: 'Fat',     unit: 'g' },
    { key: 'fiber',   label: 'Fiber',   unit: 'g' },
  ]

  const handleCheckout = () => {
    if (!cartItems.length) return
    setOrderData({ token: genToken(), items: cartItems, total: cartTotal })
    setShowCart(false)
  }

  if (orderData) return <OrderConfirmation {...orderData} onBack={() => { setOrderData(null); setCart({}) }} />

  return (
    <div style={{ minHeight: '100vh', background: '#fffbf5', fontFamily: "'Nunito',sans-serif", padding: '20px 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .nt-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; max-width: 1000px; margin: 0 auto; }
        .nt-macro-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 4px; }
        .nt-kcal-card { background: linear-gradient(135deg,#fff3e0,#fff); border: 1px solid #f97316; border-radius: 16px; padding: 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 16px; }
        @media (max-width: 768px) {
          .nt-layout { grid-template-columns: 1fr; }
          .nt-right { order: -1; }
          .nt-macro-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      {/* Cart FAB */}
      {cartCount > 0 && (
        <button onClick={() => setShowCart(true)}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 500, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 50, border: 'none', cursor: 'pointer', background: '#f97316', color: '#fff', fontFamily: "'Nunito',sans-serif", fontSize: '0.88rem', fontWeight: 700, boxShadow: '0 4px 20px rgba(249,115,22,.4)' }}>
          🛒 View Cart
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', color: '#f97316', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
        </button>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600 }}>
          <div onClick={() => setShowCart(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,.45)', backdropFilter: 'blur(3px)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: 'min(380px,100vw)', background: '#fff', borderLeft: '1.5px solid #e8e0d4', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1.4rem', borderBottom: '1.5px solid #e8e0d4' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a' }}>Your Cart 🛒</span>
              <button onClick={() => setShowCart(false)} style={{ width: 32, height: 32, borderRadius: 9, border: '1.5px solid #e8e0d4', background: 'transparent', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.4rem' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{item.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1a1a' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 600, marginTop: 1 }}>₹{item.price * item.qty} · {item.kcal * item.qty} kcal</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => updateCart(item.id, -1)} style={{ width: 26, height: 26, borderRadius: 7, border: '1.5px solid #e8e0d4', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontWeight: 800, minWidth: 18, textAlign: 'center', fontSize: '0.88rem' }}>{item.qty}</span>
                    <button onClick={() => updateCart(item.id, 1)} style={{ width: 26, height: 26, borderRadius: 7, border: '1.5px solid #e8e0d4', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '1.2rem 1.4rem', borderTop: '1.5px solid #e8e0d4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.05rem', color: '#1a1a1a', marginBottom: 12 }}>
                <span>{cartCount} items</span>
                <span>₹{cartTotal}</span>
              </div>
              <button onClick={handleCheckout}
                style={{ width: '100%', padding: 13, background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}>
                ⚡ Place Order — ₹{cartTotal}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto 20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: 20, padding: '4px 12px', fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, marginBottom: 10 }}>🔥 Calorie Tracker</div>
        <h1 style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)', fontWeight: 900, color: '#1a1a1a', marginBottom: 4 }}>Nutrition Tracker</h1>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Track calories, log meals & order healthy — all in one place</p>
      </div>

      <div className="nt-layout">
        <div>
          {/* Calorie Card */}
          <div className="nt-kcal-card">
            <div style={{ width: 82, height: 82, borderRadius: '50%', border: '5px solid #f97316', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fff' }}>
              <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#f97316', lineHeight: 1 }}>{totals.kcal}</span>
              <span style={{ fontWeight: 600, fontSize: '0.68rem', color: '#f97316' }}>kcal</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a1a1a', marginBottom: 4 }}>Today's Calories</div>
              <div style={{ fontSize: '0.83rem', color: '#888', marginBottom: 8 }}>
                {remaining >= 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over goal`}
              </div>
              <div style={{ height: 6, borderRadius: 4, background: '#f5f5f5', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(Math.round(totals.kcal / GOALS.kcal * 100), 100)}%`, background: '#f97316', borderRadius: 4, transition: 'width .4s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#bbb', marginTop: 4 }}>
                <span>0</span>
                <span style={{ color: remaining < 0 ? '#ef4444' : '#f97316', fontWeight: 700 }}>{Math.round(totals.kcal / GOALS.kcal * 100)}%</span>
                <span>{GOALS.kcal}</span>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 14 }}>📊 Macronutrients</div>
            <div className="nt-macro-grid">
              {macros.map(({ key, label, unit }) => (
                <div key={key} style={{ background: `${macroColors[key]}12`, border: `1px solid ${macroColors[key]}30`, borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: macroColors[key], lineHeight: 1.2 }}>
                    {totals[key]}<span style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 600 }}>{unit}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 4, background: '#f5f5f5', overflow: 'hidden', marginTop: 7 }}>
                    <div style={{ height: '100%', width: `${Math.min(Math.round(totals[key] / GOALS[key] * 100), 100)}%`, background: macroColors[key], borderRadius: 4, transition: 'width .4s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#bbb', marginTop: 3 }}>
                    <span>{Math.round(totals[key] / GOALS[key] * 100)}%</span>
                    <span>{GOALS[key]}{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logged Items */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 14 }}>📝 Logged Today</div>
            {logged.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#ccc', fontSize: '0.88rem' }}>No items logged yet. Log from the menu →</div>
            ) : (
              logged.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: '1px solid #f5f5f5', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.2rem' }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1a1a', flex: 1, minWidth: 80 }}>{item.name}</span>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ background: `${macroColors.protein}15`, color: macroColors.protein, padding: '2px 7px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>P:{item.protein}g</span>
                    <span style={{ background: `${macroColors.carbs}15`, color: macroColors.carbs, padding: '2px 7px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>C:{item.carbs}g</span>
                    <span style={{ background: `${macroColors.fat}15`, color: macroColors.fat, padding: '2px 7px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>F:{item.fat}g</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#f97316', fontWeight: 700 }}>{item.kcal} kcal</span>
                  <button onClick={() => toggleLog(item)}
                    style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid #ef4444', background: '#fef2f2', color: '#ef4444', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Menu + Goals */}
        <div className="nt-right">
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 14 }}>🍽️ Today's Menu</div>
            {menuItems.map(item => {
              const isLogged = logged.find(i => i.id === item.id)
              const cartQty  = cart[item.id] || 0
              return (
                <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#bbb', marginTop: 2 }}>P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g · ₹{item.price}</div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#f97316', fontWeight: 700, flexShrink: 0 }}>{item.kcal}kcal</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, paddingLeft: 34 }}>
                    {/* Log button */}
                    <button onClick={() => toggleLog(item)}
                      style={{ flex: 1, padding: '5px 8px', borderRadius: 8, border: isLogged ? '1px solid #ef4444' : '1px solid #3b82f6', background: isLogged ? '#fef2f2' : '#eff6ff', color: isLogged ? '#ef4444' : '#2563eb', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                      {isLogged ? '✓ Logged' : '📊 Log'}
                    </button>
                    {/* Cart controls */}
                    {cartQty === 0 ? (
                      <button onClick={() => updateCart(item.id, 1)}
                        style={{ flex: 1, padding: '5px 8px', borderRadius: 8, border: '1px solid #f97316', background: '#fff3e0', color: '#f97316', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                        🛒 Add
                      </button>
                    ) : (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5, background: '#f5f5f5', borderRadius: 8, padding: '3px 8px', justifyContent: 'center' }}>
                        <button onClick={() => updateCart(item.id, -1)} style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#f97316', fontWeight: 900 }}>−</button>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', minWidth: 14, textAlign: 'center' }}>{cartQty}</span>
                        <button onClick={() => updateCart(item.id, 1)} style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#f97316', fontWeight: 900 }}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Goals */}
          <div style={{ background: '#f8faff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 12 }}>🎯 Daily Goals</div>
            {[
              { label: 'Calories', val: GOALS.kcal,    unit: 'kcal', color: macroColors.kcal    },
              { label: 'Protein',  val: GOALS.protein,  unit: 'g',    color: macroColors.protein  },
              { label: 'Carbs',    val: GOALS.carbs,    unit: 'g',    color: macroColors.carbs    },
              { label: 'Fat',      val: GOALS.fat,      unit: 'g',    color: macroColors.fat      },
              { label: 'Fiber',    val: GOALS.fiber,    unit: 'g',    color: macroColors.fiber    },
            ].map(({ label, val, unit, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: '0.87rem' }}>
                <span style={{ color: '#555' }}>{label}</span>
                <span style={{ fontWeight: 800, color }}>{val}{unit}</span>
              </div>
            ))}
            <p style={{ fontSize: '0.7rem', color: '#ccc', marginTop: 8 }}>Based on avg. adult daily intake</p>
          </div>
        </div>
      </div>
    </div>
  )
}