import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const UPI_ID   = 'harshitmishra00182-2@okicici'
const UPI_NAME = 'CampusBite DMCE'

const menuItems = [
  { id:1,  name:'Vada Pav',       price:25,  prepTime:5,  emoji:'🥙', kcal:320, cat:'street'   },
  { id:2,  name:'Pav Bhaji',      price:70,  prepTime:8,  emoji:'🍛', kcal:480, cat:'street'   },
  { id:3,  name:'Bhel Puri',      price:35,  prepTime:3,  emoji:'🥗', kcal:210, cat:'street'   },
  { id:4,  name:'Masala Chai',    price:15,  prepTime:4,  emoji:'☕', kcal:90,  cat:'beverage' },
  { id:5,  name:'Samosa',         price:20,  prepTime:5,  emoji:'🔺', kcal:180, cat:'snack'    },
  { id:6,  name:'Thali',          price:120, prepTime:12, emoji:'🍱', kcal:850, cat:'meal'     },
  { id:7,  name:'Veg Frankie',    price:50,  prepTime:5,  emoji:'🌯', kcal:340, cat:'snack'    },
  { id:8,  name:'Cold Coffee',    price:60,  prepTime:3,  emoji:'🧋', kcal:180, cat:'beverage' },
  { id:9,  name:'Mango Lassi',    price:50,  prepTime:2,  emoji:'🥛', kcal:220, cat:'beverage' },
  { id:10, name:'Chicken Biryani',price:120, prepTime:15, emoji:'🍗', kcal:750, cat:'meal'     },
]

const SUGGEST_MAP = {
  1:[4,5], 2:[4,3], 6:[8,9], 10:[9,3], 4:[1,5], 8:[5,7],
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
    <div style={{ background:'linear-gradient(135deg,#fff7ed,#fffbf5)', border:'1.5px solid #fed7aa', borderRadius:16, padding:'16px', marginBottom:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <span style={{ fontSize:'1.2rem' }}>🤖</span>
        <div>
          <div style={{ fontWeight:800, fontSize:'0.9rem', color:'#ea580c' }}>AI Suggests</div>
          <div style={{ fontSize:'0.75rem', color:'#9a6520' }}>{reason}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {suggestions.map(item => (
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1px solid #fed7aa', borderRadius:12, padding:'8px 10px', flex:1, minWidth:120 }}>
            <span style={{ fontSize:'1.3rem' }}>{item.emoji}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:'0.8rem', color:'#1a1a1a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
              <div style={{ fontSize:'0.72rem', color:'#ea580c', fontWeight:700 }}>₹{item.price}</div>
            </div>
            <button onClick={() => onAdd(item)} style={{ background:'#ea580c', color:'#fff', border:'none', borderRadius:8, padding:'5px 8px', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', flexShrink:0 }}>+Add</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Confirmation({ order, onBack }) {
  const [method,   setMethod  ] = useState(null)
  const [utrInput, setUtrInput] = useState('')
  const [utrError, setUtrError] = useState('')
  const [paid,     setPaid    ] = useState(false)

  const upiUri = buildUpiUri(order.total, order.token)

  const handleUtrSubmit = () => {
    const val = utrInput.trim()
    if (!/^\d{12}$/.test(val)) { setUtrError('Enter a valid 12-digit UTR number'); return }
    setUtrError('')
    setPaid(true)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#02030a', fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 16px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Orbitron:wght@700;900&display=swap');`}</style>
      <div style={{ background:'#0d0f1a', border:'1px solid #1e2235', borderRadius:24, padding:'28px 20px', maxWidth:480, width:'100%', boxShadow:'0 0 60px rgba(249,115,22,.15)', textAlign:'center' }}>
        <div style={{ fontSize:'2rem', marginBottom:6 }}>🎉</div>
        <div style={{ color:'rgba(226,232,255,.45)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>Order Confirmed</div>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(2rem,8vw,3.2rem)', fontWeight:900, background:'linear-gradient(90deg,#f97316,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'0.12em', lineHeight:1.1, margin:'6px 0 8px' }}>
          #{order.token}
        </div>
        <div style={{ color:'rgba(226,232,255,.5)', fontSize:'0.8rem', marginBottom:10 }}>Show this at the counter</div>

        <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:14 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(251,191,36,.1)', border:'1px solid rgba(251,191,36,.3)', borderRadius:20, padding:'5px 12px' }}>
            <span>🕐</span><span style={{ color:'#fbbf24', fontWeight:700, fontSize:'0.82rem' }}>{order.slot}</span>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.3)', borderRadius:20, padding:'5px 12px' }}>
            <span>⏱</span><span style={{ color:'#22c55e', fontWeight:700, fontSize:'0.82rem' }}>~{order.prepTime} min</span>
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          {order.items.map(it => (
            <span key={it.id} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(249,115,22,.1)', border:'1px solid rgba(249,115,22,.2)', borderRadius:20, padding:'3px 10px', fontSize:'0.76rem', color:'#f97316', fontWeight:600, margin:'3px' }}>
              {it.emoji} {it.name} ×{it.qty}
            </span>
          ))}
        </div>

        <div style={{ background:'#131629', borderRadius:16, padding:16, textAlign:'left' }}>
          <div style={{ fontWeight:800, fontSize:'0.88rem', color:'rgba(226,232,255,.7)', marginBottom:12 }}>💳 Pay ₹{order.total}</div>

          {/* COD */}
          <div onClick={() => { if (!paid) { setMethod('cod'); setUtrInput(''); setUtrError('') } }}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:11, cursor:paid?'default':'pointer', marginBottom:8, border:method==='cod'?'2px solid #f97316':'1px solid #1e2235', background:method==='cod'?'rgba(249,115,22,.08)':'transparent', opacity:paid&&method!=='cod'?0.4:1, transition:'all .15s' }}>
            <span style={{ fontSize:'1.3rem', width:30, textAlign:'center' }}>💵</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#e2e8ff' }}>Cash on Delivery</div>
              <div style={{ fontSize:'0.74rem', color:'rgba(226,232,255,.4)', marginTop:2 }}>Pay ₹{order.total} at counter</div>
            </div>
            {method==='cod' && <span style={{ color:'#f97316' }}>✓</span>}
          </div>

          {/* UPI */}
          <div onClick={() => { if (!paid) { setMethod('upi'); setUtrInput(''); setUtrError('') } }}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:11, cursor:paid?'default':'pointer', marginBottom:8, border:method==='upi'?'2px solid #f97316':'1px solid #1e2235', background:method==='upi'?'rgba(249,115,22,.08)':'transparent', opacity:paid&&method!=='upi'?0.4:1, transition:'all .15s' }}>
            <span style={{ fontSize:'1.3rem', width:30, textAlign:'center' }}>📱</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#e2e8ff' }}>UPI Payment</div>
              <div style={{ fontSize:'0.74rem', color:'rgba(226,232,255,.4)', marginTop:2 }}>GPay · PhonePe · Paytm</div>
            </div>
            {method==='upi' && <span style={{ color:'#f97316' }}>✓</span>}
          </div>

          {method==='upi' && !paid && (
            <div style={{ marginTop:8 }}>
              <div style={{ textAlign:'center', marginBottom:10 }}>
                <div style={{ color:'rgba(226,232,255,.4)', fontSize:'0.74rem', marginBottom:8 }}>Scan to pay <span style={{ color:'#22c55e', fontWeight:700 }}>₹{order.total}</span></div>
                <div style={{ background:'#fff', borderRadius:12, padding:12, display:'inline-block' }}>
                  <QRCodeSVG value={upiUri} size={150} level="H" fgColor="#1a1a1a" includeMargin={false} />
                </div>
                <div style={{ color:'rgba(226,232,255,.25)', fontSize:'0.68rem', marginTop:5 }}>
                  UPI: <span style={{ color:'#fbbf24', fontWeight:700 }}>{UPI_ID}</span>
                </div>
              </div>
              <div style={{ background:'#0d0f1a', border:'1px solid #1e2235', borderRadius:12, padding:14 }}>
                <div style={{ fontWeight:700, fontSize:'0.8rem', color:'rgba(226,232,255,.6)', marginBottom:5 }}>🔐 Enter UTR to confirm</div>
                <div style={{ fontSize:'0.7rem', color:'rgba(226,232,255,.35)', marginBottom:8 }}>12-digit UTR from your payment app</div>
                <input
                  type="text" maxLength={12} placeholder="e.g. 426891234567"
                  value={utrInput}
                  onChange={e => { setUtrInput(e.target.value.replace(/\D/g,'')); setUtrError('') }}
                  style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:utrError?'1.5px solid #ef4444':'1.5px solid #1e2235', background:'#131629', color:'#e2e8ff', fontSize:'0.88rem', fontFamily:"'Orbitron',monospace", letterSpacing:'0.08em', outline:'none', boxSizing:'border-box', marginBottom:utrError?5:0 }}
                />
                {utrError && <div style={{ color:'#ef4444', fontSize:'0.7rem', marginBottom:6 }}>{utrError}</div>}
                <button onClick={handleUtrSubmit}
                  style={{ width:'100%', padding:10, marginTop:8, background:utrInput.length===12?'linear-gradient(135deg,#f97316,#ef4444)':'#1e2235', color:utrInput.length===12?'#fff':'rgba(226,232,255,.3)', border:'none', borderRadius:9, fontWeight:800, fontSize:'0.85rem', cursor:utrInput.length===12?'pointer':'not-allowed', transition:'all .2s' }}>
                  ✅ Verify & Confirm
                </button>
              </div>
            </div>
          )}

          {method==='cod' && !paid && (
            <button onClick={() => setPaid(true)}
              style={{ width:'100%', padding:12, marginTop:12, background:'linear-gradient(135deg,#f97316,#ef4444)', color:'#fff', border:'none', borderRadius:11, fontWeight:800, fontSize:'0.9rem', cursor:'pointer' }}>
              ✅ Confirm — Pay Cash at Counter
            </button>
          )}

          {paid && (
            <div style={{ textAlign:'center', marginTop:10 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.3)', borderRadius:20, padding:'7px 16px', fontSize:'0.82rem', color:'#22c55e', fontWeight:700 }}>
                ✅ {method==='cod' ? 'Confirmed — Pay cash at pickup' : `Payment Verified · UTR: ${utrInput}`}
              </div>
              <div style={{ color:'rgba(226,232,255,.3)', fontSize:'0.74rem', marginTop:8 }}>
                Show token <span style={{ color:'#fbbf24', fontWeight:700 }}>#{order.token}</span> at the counter
              </div>
            </div>
          )}
        </div>

        <button onClick={onBack} style={{ marginTop:16, background:'transparent', border:'1px solid #1e2235', color:'rgba(226,232,255,.4)', padding:'8px 20px', borderRadius:10, cursor:'pointer', fontSize:'0.82rem', fontWeight:600 }}>
          ← Place Another Order
        </button>
      </div>
    </div>
  )
}

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
    <div style={{ minHeight:'100vh', background:'#fffbf5', fontFamily:"'Nunito',sans-serif", padding:'20px 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .po-layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; max-width: 900px; margin: 0 auto; }
        .po-summary { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,.06); position: sticky; top: 20px; align-self: start; }
        .po-slots { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        @media (max-width: 768px) {
          .po-layout { grid-template-columns: 1fr; }
          .po-summary { position: static; order: -1; }
          .po-slots { grid-template-columns: repeat(3,1fr); }
        }
        @media (max-width: 400px) {
          .po-slots { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <div style={{ maxWidth:900, margin:'0 auto 20px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#fff3e0', border:'1px solid #f97316', borderRadius:20, padding:'4px 12px', fontSize:'0.8rem', color:'#f97316', fontWeight:700, marginBottom:10 }}>⚡ Skip the Queue</div>
        <h1 style={{ fontSize:'clamp(1.4rem,4vw,2.2rem)', fontWeight:900, color:'#1a1a1a', marginBottom:4 }}>Pre-Order Your Meal</h1>
        <p style={{ color:'#888', fontSize:'0.9rem' }}>Order ahead, pick up on time — no waiting in line</p>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <AISuggestions cart={cart} onAdd={(item) => updateQty(item.id, 1)} />
      </div>

      <div className="po-layout">
        <div>
          {/* Menu */}
          <div style={{ background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)', marginBottom:16 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1a1a', marginBottom:14 }}>📋 Select Items</div>
            {menuItems.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f5f5f5', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
                  <span style={{ fontSize:'1.3rem', flexShrink:0 }}>{item.emoji}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#1a1a1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'#999', marginTop:2 }}>⏱{item.prepTime}m · 🔥{item.kcal}kcal · ₹{item.price}</div>
                  </div>
                </div>
                <div style={{ flexShrink:0 }}>
                  {cart[item.id]
                    ? <div style={{ display:'flex', alignItems:'center', gap:6, background:'#f5f5f5', borderRadius:8, padding:'4px 8px' }}>
                        <button style={{ background:'none', border:'none', fontSize:'1rem', cursor:'pointer', color:'#f97316', fontWeight:900 }} onClick={()=>updateQty(item.id,-1)}>−</button>
                        <span style={{ fontWeight:800, minWidth:14, textAlign:'center', fontSize:'0.9rem' }}>{cart[item.id]}</span>
                        <button style={{ background:'none', border:'none', fontSize:'1rem', cursor:'pointer', color:'#f97316', fontWeight:900 }} onClick={()=>updateQty(item.id,1)}>+</button>
                      </div>
                    : <button style={{ background:'#f97316', color:'#fff', border:'none', borderRadius:8, padding:'6px 12px', fontWeight:700, fontSize:'0.82rem', cursor:'pointer' }} onClick={()=>updateQty(item.id,1)}>+ Add</button>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div style={{ background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1a1a', marginBottom:14 }}>🕐 Pick-up Time Slot</div>
            <div className="po-slots">
              {timeSlots.map(s => (
                <button key={s} onClick={()=>setSlot(s)}
                  style={{ padding:'8px 4px', borderRadius:10, textAlign:'center', border:slot===s?'2px solid #f97316':'1px solid #e5e5e5', background:slot===s?'#fff3e0':'#fff', color:slot===s?'#f97316':'#555', fontWeight:slot===s?700:500, fontSize:'0.8rem', cursor:'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="po-summary">
          <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1a1a', marginBottom:14 }}>🧾 Order Summary</div>
          {!cartItems.length
            ? <p style={{ color:'#bbb', fontSize:'0.85rem', textAlign:'center', padding:'16px 0' }}>No items added yet</p>
            : cartItems.map(item => (
                <div key={item.id} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'#555', marginBottom:7, gap:8 }}>
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.emoji} {item.name} ×{cart[item.id]}</span>
                  <span style={{ flexShrink:0, fontWeight:600 }}>₹{item.price*cart[item.id]}</span>
                </div>
              ))
          }
          <div style={{ borderTop:'1px dashed #eee', margin:'10px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'#555', marginBottom:6 }}><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'#555', marginBottom:6 }}><span>Est. prep</span><span>{maxPrep} min</span></div>
          {slot && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'#555', marginBottom:6 }}><span>Pick-up</span><span>{slot}</span></div>}
          <div style={{ borderTop:'1px dashed #eee', margin:'10px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:'1rem', color:'#1a1a1a' }}><span>Total</span><span>₹{subtotal}</span></div>
          <button onClick={placeOrder} disabled={!slot||!cartItems.length}
            style={{ width:'100%', padding:13, background:(!slot||!cartItems.length)?'#e5e5e5':'linear-gradient(135deg,#f97316,#ef4444)', color:(!slot||!cartItems.length)?'#aaa':'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:'0.95rem', cursor:(!slot||!cartItems.length)?'not-allowed':'pointer', marginTop:14 }}>
            ⚡ Place Pre-Order
          </button>
          {(!slot||!cartItems.length) && (
            <p style={{ color:'#bbb', fontSize:'0.73rem', textAlign:'center', marginTop:7 }}>
              {!cartItems.length ? 'Add items to continue' : 'Select a time slot'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}