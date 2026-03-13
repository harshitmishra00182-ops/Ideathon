import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const UPI_ID   = 'harshitmishra00182-2@okicici'
const UPI_NAME = 'CampusBite DMCE'

const menuItems = [
  { id:1,  name:'Vada Pav',    price:25,  prepTime:5,  emoji:'🥙', kcal:320, cat:'street'   },
  { id:2,  name:'Pav Bhaji',   price:70,  prepTime:8,  emoji:'🍛', kcal:480, cat:'street'   },
  { id:3,  name:'Bhel Puri',   price:35,  prepTime:3,  emoji:'🥗', kcal:210, cat:'street'   },
  { id:4,  name:'Masala Chai', price:15,  prepTime:4,  emoji:'☕', kcal:90,  cat:'beverage' },
  { id:5,  name:'Samosa',      price:20,  prepTime:5,  emoji:'🔺', kcal:180, cat:'snack'    },
  { id:6,  name:'Thali',       price:120, prepTime:12, emoji:'🍱', kcal:850, cat:'meal'     },
  { id:7,  name:'Veg Frankie', price:50,  prepTime:5,  emoji:'🌯', kcal:340, cat:'snack'    },
  { id:8,  name:'Cold Coffee', price:60,  prepTime:3,  emoji:'🧋', kcal:180, cat:'beverage' },
  { id:9,  name:'Mango Lassi', price:50,  prepTime:2,  emoji:'🥛', kcal:220, cat:'beverage' },
  { id:10, name:'Chicken Biryani', price:120, prepTime:15, emoji:'🍗', kcal:750, cat:'meal' },
]

// AI suggestion pairs: itemId → suggested item ids
const SUGGEST_MAP = {
  1: [4, 5],   // Vada Pav → Chai, Samosa
  2: [4, 3],   // Pav Bhaji → Chai, Bhel Puri
  6: [8, 9],   // Thali → Cold Coffee, Lassi
  10:[9, 3],   // Biryani → Lassi, Bhel Puri
  4: [1, 5],   // Chai → Vada Pav, Samosa
  8: [5, 7],   // Cold Coffee → Samosa, Frankie
}
const DEFAULT_SUGGESTS = [4, 5, 9]

const timeSlots = [
  '8:00 AM','8:30 AM','9:00 AM','9:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM',
  '4:00 PM','4:30 PM','5:00 PM',
]

const genToken    = () => Math.floor(100000 + Math.random() * 900000).toString()
const buildUpiUri = (amount, token) => {
  const p = new URLSearchParams({ pa:UPI_ID, pn:UPI_NAME, am:amount.toFixed(2), cu:'INR', tn:`CampusBite #${token}`, tr:token })
  return `upi://pay?${p}`
}

// ── AI Suggestions ─────────────────────────────────────────────────────────────
function AISuggestions({ cart, onAdd }) {
  const cartIds = Object.keys(cart).map(Number)
  if (!cartIds.length) return null

  const suggestSet = new Set()
  cartIds.forEach(id => {
    const s = SUGGEST_MAP[id] || DEFAULT_SUGGESTS
    s.forEach(sid => { if (!cart[sid]) suggestSet.add(sid) })
  })
  if (!suggestSet.size) DEFAULT_SUGGESTS.forEach(s => { if (!cart[s]) suggestSet.add(s) })

  const suggestions = [...suggestSet].slice(0, 3).map(id => menuItems.find(m => m.id === id)).filter(Boolean)
  if (!suggestions.length) return null

  const reason = cartIds.includes(10) ? 'Goes great with Biryani 🍗' :
                 cartIds.includes(6)  ? 'Complete your Thali experience 🍱' :
                 cartIds.some(id => [4,8,9].includes(id)) ? 'Snack to go with your drink ☕' :
                 'Customers also ordered'

  return (
    <div style={{ background:'linear-gradient(135deg,#fff7ed,#fffbf5)', border:'1.5px solid #fed7aa', borderRadius:16, padding:'16px 18px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <span style={{ fontSize:'1.2rem' }}>🤖</span>
        <div>
          <div style={{ fontWeight:800, fontSize:'0.9rem', color:'#ea580c' }}>AI Suggests</div>
          <div style={{ fontSize:'0.75rem', color:'#9a6520' }}>{reason}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        {suggestions.map(item => (
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, background:'#fff', border:'1px solid #fed7aa', borderRadius:12, padding:'10px 13px', flex:1, minWidth:130 }}>
            <span style={{ fontSize:'1.5rem' }}>{item.emoji}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:'0.83rem', color:'#1a1a1a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
              <div style={{ fontSize:'0.73rem', color:'#ea580c', fontWeight:700 }}>₹{item.price}</div>
            </div>
            <button
              onClick={() => onAdd(item)}
              style={{ background:'#ea580c', color:'#fff', border:'none', borderRadius:8, padding:'5px 10px', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', flexShrink:0 }}
            >+ Add</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Order Confirmation ─────────────────────────────────────────────────────────
function Confirmation({ order, onBack }) {
  const [method,  setMethod ] = useState(null)
  const [utrInput,setUtrInput] = useState('')
  const [utrError,setUtrError] = useState('')
  const [paid,    setPaid   ] = useState(false)

  const upiUri = buildUpiUri(order.total, order.token)

  const handleUtrSubmit = () => {
    const val = utrInput.trim()
    // UTR is 12 digits for IMPS/UPI
    if (!/^\d{12}$/.test(val)) {
      setUtrError('Enter a valid 12-digit UTR number from your payment app')
      return
    }
    setUtrError('')
    setPaid(true)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#02030a', fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Orbitron:wght@700;900&display=swap');`}</style>
      <div style={{ background:'#0d0f1a', border:'1px solid #1e2235', borderRadius:24, padding:'36px 32px', maxWidth:500, width:'100%', boxShadow:'0 0 60px rgba(249,115,22,.15)', textAlign:'center' }}>

        <div style={{ fontSize:'2.2rem', marginBottom:8 }}>🎉</div>
        <div style={{ color:'rgba(226,232,255,.45)', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>Order Confirmed</div>

        {/* Token */}
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(2.4rem,8vw,3.6rem)', fontWeight:900, background:'linear-gradient(90deg,#f97316,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'0.12em', lineHeight:1.1, margin:'6px 0 8px' }}>
          #{order.token}
        </div>
        <div style={{ color:'rgba(226,232,255,.5)', fontSize:'0.82rem', marginBottom:8 }}>Your token number — show this at the counter</div>

        {/* Slot + time */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:16 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(251,191,36,.1)', border:'1px solid rgba(251,191,36,.3)', borderRadius:20, padding:'6px 14px' }}>
            <span>🕐</span><span style={{ color:'#fbbf24', fontWeight:700, fontSize:'0.84rem' }}>{order.slot}</span>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.3)', borderRadius:20, padding:'6px 14px' }}>
            <span>⏱</span><span style={{ color:'#22c55e', fontWeight:700, fontSize:'0.84rem' }}>Ready in ~{order.prepTime} min</span>
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom:20 }}>
          {order.items.map(it => (
            <span key={it.id} style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(249,115,22,.1)', border:'1px solid rgba(249,115,22,.2)', borderRadius:20, padding:'4px 11px', fontSize:'0.78rem', color:'#f97316', fontWeight:600, margin:'3px' }}>
              {it.emoji} {it.name} ×{it.qty}
            </span>
          ))}
        </div>

        {/* Payment section */}
        <div style={{ background:'#131629', borderRadius:16, padding:20, textAlign:'left' }}>
          <div style={{ fontWeight:800, fontSize:'0.9rem', color:'rgba(226,232,255,.7)', marginBottom:14 }}>💳 Pay ₹{order.total}</div>

          {/* COD option */}
          <div
            onClick={() => { if (!paid) { setMethod('cod'); setUtrInput(''); setUtrError('') } }}
            style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 15px', borderRadius:11, cursor: paid?'default':'pointer', marginBottom:8, border:method==='cod'?'2px solid #f97316':'1px solid #1e2235', background:method==='cod'?'rgba(249,115,22,.08)':'transparent', transition:'all .15s', opacity: paid && method!=='cod' ? 0.4 : 1 }}
          >
            <span style={{ fontSize:'1.4rem', width:34, textAlign:'center' }}>💵</span>
            <div>
              <div style={{ fontWeight:700, fontSize:'0.92rem', color:'#e2e8ff' }}>Cash on Delivery</div>
              <div style={{ fontSize:'0.76rem', color:'rgba(226,232,255,.4)', marginTop:2 }}>Pay ₹{order.total} cash when you collect</div>
            </div>
            {method==='cod' && <span style={{ marginLeft:'auto', color:'#f97316' }}>✓</span>}
          </div>

          {/* UPI option */}
          <div
            onClick={() => { if (!paid) { setMethod('upi'); setUtrInput(''); setUtrError('') } }}
            style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 15px', borderRadius:11, cursor: paid?'default':'pointer', marginBottom:8, border:method==='upi'?'2px solid #f97316':'1px solid #1e2235', background:method==='upi'?'rgba(249,115,22,.08)':'transparent', transition:'all .15s', opacity: paid && method!=='upi' ? 0.4 : 1 }}
          >
            <span style={{ fontSize:'1.4rem', width:34, textAlign:'center' }}>📱</span>
            <div>
              <div style={{ fontWeight:700, fontSize:'0.92rem', color:'#e2e8ff' }}>UPI Payment</div>
              <div style={{ fontSize:'0.76rem', color:'rgba(226,232,255,.4)', marginTop:2 }}>GPay · PhonePe · Paytm · any UPI app</div>
            </div>
            {method==='upi' && <span style={{ marginLeft:'auto', color:'#f97316' }}>✓</span>}
          </div>

          {/* UPI QR + UTR entry */}
          {method==='upi' && !paid && (
            <div style={{ marginTop:8 }}>
              <div style={{ textAlign:'center', marginBottom:12 }}>
                <div style={{ color:'rgba(226,232,255,.4)', fontSize:'0.76rem', marginBottom:10 }}>
                  Scan to pay <span style={{ color:'#22c55e', fontWeight:700 }}>₹{order.total}</span>
                </div>
                <div style={{ background:'#fff', borderRadius:14, padding:14, display:'inline-block', boxShadow:'0 4px 24px rgba(249,115,22,.2)' }}>
                  <QRCodeSVG value={upiUri} size={170} level="H" fgColor="#1a1a1a" includeMargin={false} />
                </div>
                <div style={{ color:'rgba(226,232,255,.25)', fontSize:'0.7rem', marginTop:6 }}>
                  UPI: <span style={{ color:'#fbbf24', fontWeight:700 }}>{UPI_ID}</span> · Ref: #{order.token}
                </div>
              </div>

              {/* UTR input */}
              <div style={{ background:'#0d0f1a', border:'1px solid #1e2235', borderRadius:12, padding:16 }}>
                <div style={{ fontWeight:700, fontSize:'0.82rem', color:'rgba(226,232,255,.6)', marginBottom:6 }}>
                  🔐 Enter UTR number to confirm payment
                </div>
                <div style={{ fontSize:'0.72rem', color:'rgba(226,232,255,.35)', marginBottom:10 }}>
                  Find the 12-digit UTR in your GPay / PhonePe / Paytm transaction history after paying
                </div>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="e.g. 426891234567"
                  value={utrInput}
                  onChange={e => { setUtrInput(e.target.value.replace(/\D/g,'')); setUtrError('') }}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:9, border: utrError?'1.5px solid #ef4444':'1.5px solid #1e2235', background:'#131629', color:'#e2e8ff', fontSize:'0.92rem', fontFamily:"'Orbitron',monospace", letterSpacing:'0.08em', outline:'none', boxSizing:'border-box', marginBottom: utrError?6:0 }}
                />
                {utrError && <div style={{ color:'#ef4444', fontSize:'0.72rem', marginBottom:8 }}>{utrError}</div>}
                <button
                  onClick={handleUtrSubmit}
                  style={{ width:'100%', padding:11, marginTop:10, background: utrInput.length===12?'linear-gradient(135deg,#f97316,#ef4444)':'#1e2235', color: utrInput.length===12?'#fff':'rgba(226,232,255,.3)', border:'none', borderRadius:9, fontWeight:800, fontSize:'0.88rem', cursor: utrInput.length===12?'pointer':'not-allowed', transition:'all .2s' }}
                >
                  ✅ Verify & Confirm Payment
                </button>
              </div>
            </div>
          )}

          {/* COD confirm button */}
          {method==='cod' && !paid && (
            <button
              onClick={() => setPaid(true)}
              style={{ width:'100%', padding:13, marginTop:14, background:'linear-gradient(135deg,#f97316,#ef4444)', color:'#fff', border:'none', borderRadius:11, fontWeight:800, fontSize:'0.95rem', cursor:'pointer' }}
            >
              ✅ Confirm — I'll Pay Cash at Counter
            </button>
          )}

          {/* Paid state */}
          {paid && (
            <div style={{ textAlign:'center', marginTop:12 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.3)', borderRadius:20, padding:'8px 18px', fontSize:'0.84rem', color:'#22c55e', fontWeight:700 }}>
                ✅ {method==='cod' ? 'Confirmed — Pay cash at pickup' : `Payment Verified · UTR: ${utrInput}`}
              </div>
              {method==='upi' && (
                <div style={{ color:'rgba(226,232,255,.3)', fontSize:'0.72rem', marginTop:6 }}>
                  UTR <span style={{ color:'#fbbf24', fontWeight:700, fontFamily:"'Orbitron',monospace" }}>{utrInput}</span> recorded
                </div>
              )}
              <div style={{ color:'rgba(226,232,255,.3)', fontSize:'0.75rem', marginTop:8 }}>
                Show token <span style={{ color:'#fbbf24', fontWeight:700 }}>#{order.token}</span> at the counter
              </div>
            </div>
          )}
        </div>

        <button onClick={onBack} style={{ marginTop:20, background:'transparent', border:'1px solid #1e2235', color:'rgba(226,232,255,.4)', padding:'9px 22px', borderRadius:10, cursor:'pointer', fontSize:'0.83rem', fontWeight:600 }}>
          ← Place Another Order
        </button>
      </div>
    </div>
  )
}

// ── Main PreOrder ──────────────────────────────────────────────────────────────
export default function PreOrder() {
  const [cart,  setCart ] = useState({})
  const [slot,  setSlot ] = useState(null)
  const [order, setOrder] = useState(null)

  const updateQty = (id, delta) => setCart(prev => {
    const next = (prev[id]||0) + delta
    if (next <= 0) { const c={...prev}; delete c[id]; return c }
    return { ...prev, [id]:next }
  })

  const cartItems = menuItems.filter(i => cart[i.id])
  const subtotal  = cartItems.reduce((s,i) => s + i.price*(cart[i.id]||0), 0)
  const maxPrep   = cartItems.length ? Math.max(...cartItems.map(i=>i.prepTime)) : 0

  const placeOrder = () => {
    if (!slot || !cartItems.length) return
    setOrder({ token:genToken(), items:cartItems.map(i=>({...i,qty:cart[i.id]})), slot, total:subtotal, prepTime:maxPrep })
  }

  if (order) return <Confirmation order={order} onBack={() => { setOrder(null); setCart({}); setSlot(null) }} />

  return (
    <div style={{ minHeight:'100vh', background:'#fffbf5', fontFamily:"'Nunito',sans-serif", padding:'32px 24px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>

      <div style={{ maxWidth:900, margin:'0 auto 28px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#fff3e0', border:'1px solid #f97316', borderRadius:20, padding:'4px 12px', fontSize:'0.8rem', color:'#f97316', fontWeight:700, marginBottom:12 }}>⚡ Skip the Queue</div>
        <h1 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:900, color:'#1a1a1a', marginBottom:4 }}>Pre-Order Your Meal</h1>
        <p style={{ color:'#888', fontSize:'0.95rem' }}>Order ahead, pick up on time — no waiting in line</p>
      </div>

      {/* AI suggestions */}
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <AISuggestions cart={cart} onAdd={(item) => updateQty(item.id, 1)} />
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 340px', gap:24 }}>
        <div>
          {/* Menu */}
          <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,.06)', marginBottom:20 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1a1a', marginBottom:16 }}>📋 Select Items</div>
            {menuItems.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f5f5f5' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:'1.4rem' }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'0.95rem', color:'#1a1a1a' }}>{item.name}</div>
                    <div style={{ fontSize:'0.78rem', color:'#999', marginTop:2 }}>⏱ {item.prepTime} min · 🔥 {item.kcal} kcal · ₹{item.price}</div>
                  </div>
                </div>
                {cart[item.id]
                  ? <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', borderRadius:8, padding:'4px 8px' }}>
                      <button style={{ background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer', color:'#f97316', fontWeight:900 }} onClick={()=>updateQty(item.id,-1)}>−</button>
                      <span style={{ fontWeight:800, minWidth:16, textAlign:'center' }}>{cart[item.id]}</span>
                      <button style={{ background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer', color:'#f97316', fontWeight:900 }} onClick={()=>updateQty(item.id,1)}>+</button>
                    </div>
                  : <button style={{ background:'#f97316', color:'#fff', border:'none', borderRadius:8, padding:'6px 14px', fontWeight:700, fontSize:'0.85rem', cursor:'pointer' }} onClick={()=>updateQty(item.id,1)}>+ Add</button>
                }
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,.06)', marginBottom:20 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1a1a', marginBottom:16 }}>🕐 Pick-up Time Slot</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {timeSlots.map(s => (
                <button key={s} onClick={()=>setSlot(s)} style={{ padding:'8px 0', borderRadius:10, textAlign:'center', border:slot===s?'2px solid #f97316':'1px solid #e5e5e5', background:slot===s?'#fff3e0':'#fff', color:slot===s?'#f97316':'#555', fontWeight:slot===s?700:500, fontSize:'0.82rem', cursor:'pointer' }}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,.06)', position:'sticky', top:24, alignSelf:'start' }}>
          <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1a1a', marginBottom:16 }}>🧾 Order Summary</div>
          {!cartItems.length
            ? <p style={{ color:'#bbb', fontSize:'0.88rem', textAlign:'center', padding:'20px 0' }}>No items added yet</p>
            : cartItems.map(item => (
                <div key={item.id} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.88rem', color:'#555', marginBottom:8 }}>
                  <span>{item.emoji} {item.name} ×{cart[item.id]}</span>
                  <span>₹{item.price*cart[item.id]}</span>
                </div>
              ))
          }
          <div style={{ borderTop:'1px dashed #eee', margin:'12px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.88rem', color:'#555', marginBottom:8 }}><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.88rem', color:'#555', marginBottom:8 }}><span>Est. prep</span><span>{maxPrep} min</span></div>
          {slot && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.88rem', color:'#555', marginBottom:8 }}><span>Pick-up slot</span><span>{slot}</span></div>}
          <div style={{ borderTop:'1px dashed #eee', margin:'12px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:'1.05rem', color:'#1a1a1a' }}><span>Total</span><span>₹{subtotal}</span></div>
          <button
            onClick={placeOrder}
            disabled={!slot||!cartItems.length}
            style={{ width:'100%', padding:14, background:(!slot||!cartItems.length)?'#e5e5e5':'linear-gradient(135deg,#f97316,#ef4444)', color:(!slot||!cartItems.length)?'#aaa':'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:'1rem', cursor:(!slot||!cartItems.length)?'not-allowed':'pointer', marginTop:16 }}
          >⚡ Place Pre-Order</button>
          {(!slot||!cartItems.length) && (
            <p style={{ color:'#bbb', fontSize:'0.75rem', textAlign:'center', marginTop:8 }}>
              {!cartItems.length ? 'Add items to continue' : 'Select a time slot'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}