import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const UPI_ID   = "harshitmishra00182-2@okicici"
const UPI_NAME = "CampusBite DMCE"

const menuItems = [
  { id: 1, name: 'Vada Pav',    price: 25,  emoji: '🥙' },
  { id: 2, name: 'Pav Bhaji',   price: 70,  emoji: '🍛' },
  { id: 3, name: 'Bhel Puri',   price: 35,  emoji: '🥗' },
  { id: 4, name: 'Masala Chai', price: 15,  emoji: '☕' },
  { id: 5, name: 'Samosa',      price: 20,  emoji: '🔺' },
  { id: 6, name: 'Thali',       price: 120, emoji: '🍱' },
  { id: 7, name: 'Lassi',       price: 40,  emoji: '🥛' },
  { id: 8, name: 'Poha',        price: 30,  emoji: '🍚' },
]

const avatarColors = ['#f97316', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6', '#f59e0b']

const genToken    = () => Math.floor(100 + Math.random() * 900).toString()
const buildUpiUri = (amount, token) => {
  const p = new URLSearchParams({ pa: UPI_ID, pn: UPI_NAME, am: amount.toFixed(2), cu: 'INR', tn: `CampusBite GRP#${token}`, tr: token })
  return `upi://pay?${p}`
}

// ── Payment Modal per member ───────────────────────────────────────────────────
function PaymentModal({ member, amount, token, onClose, onPaid }) {
  const [method,   setMethod  ] = useState(null)
  const [utrInput, setUtrInput] = useState('')
  const [utrError, setUtrError] = useState('')
  const [paid,     setPaid    ] = useState(false)
  const upiUri = buildUpiUri(amount, token)

  const handleUtrSubmit = () => {
    if (!/^\d{12}$/.test(utrInput.trim())) { setUtrError('Enter a valid 12-digit UTR'); return }
    setUtrError('')
    setPaid(true)
    setTimeout(() => { onPaid(member.id, 'upi', utrInput); onClose() }, 1400)
  }

  const handleCodConfirm = () => {
    setPaid(true)
    setTimeout(() => { onPaid(member.id, 'cod', null); onClose() }, 1400)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#0d0f1a', border: '1px solid #1e2235', borderRadius: 20, padding: '26px 22px', maxWidth: 420, width: '100%', boxShadow: '0 0 60px rgba(249,115,22,.2)', textAlign: 'center' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
        <div style={{ fontSize: '1.8rem', marginBottom: 5 }}>💰</div>
        <div style={{ color: 'rgba(226,232,255,.45)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Payment for</div>
        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#e2e8ff', margin: '4px 0' }}>{member.name}</div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(90deg,#f97316,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '4px 0 2px' }}>₹{amount}</div>
        <div style={{ color: 'rgba(226,232,255,.3)', fontSize: '0.7rem', marginBottom: 16 }}>Token #GRP{token}</div>

        <div style={{ background: '#131629', borderRadius: 14, padding: 14, textAlign: 'left' }}>
          {/* COD */}
          <div onClick={() => { if (!paid) { setMethod('cod'); setUtrInput(''); setUtrError('') } }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, cursor: paid ? 'default' : 'pointer', marginBottom: 8, border: method === 'cod' ? '2px solid #f97316' : '1px solid #1e2235', background: method === 'cod' ? 'rgba(249,115,22,.08)' : 'transparent', opacity: paid && method !== 'cod' ? 0.4 : 1, transition: 'all .15s' }}>
            <span style={{ fontSize: '1.3rem', width: 28, textAlign: 'center' }}>💵</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#e2e8ff' }}>Cash on Delivery</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(226,232,255,.4)', marginTop: 1 }}>Pay ₹{amount} cash at counter</div>
            </div>
            {method === 'cod' && <span style={{ marginLeft: 'auto', color: '#f97316' }}>✓</span>}
          </div>

          {/* UPI */}
          <div onClick={() => { if (!paid) { setMethod('upi'); setUtrInput(''); setUtrError('') } }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, cursor: paid ? 'default' : 'pointer', marginBottom: 8, border: method === 'upi' ? '2px solid #f97316' : '1px solid #1e2235', background: method === 'upi' ? 'rgba(249,115,22,.08)' : 'transparent', opacity: paid && method !== 'upi' ? 0.4 : 1, transition: 'all .15s' }}>
            <span style={{ fontSize: '1.3rem', width: 28, textAlign: 'center' }}>📱</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#e2e8ff' }}>UPI Payment</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(226,232,255,.4)', marginTop: 1 }}>GPay · PhonePe · Paytm</div>
            </div>
            {method === 'upi' && <span style={{ marginLeft: 'auto', color: '#f97316' }}>✓</span>}
          </div>

          {method === 'upi' && !paid && (
            <div style={{ marginTop: 6 }}>
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <div style={{ color: 'rgba(226,232,255,.4)', fontSize: '0.7rem', marginBottom: 8 }}>Scan to pay <span style={{ color: '#22c55e', fontWeight: 700 }}>₹{amount}</span></div>
                <div style={{ background: '#fff', borderRadius: 12, padding: 10, display: 'inline-block' }}>
                  <QRCodeSVG value={upiUri} size={140} level="H" fgColor="#1a1a1a" includeMargin={false} />
                </div>
                <div style={{ color: 'rgba(226,232,255,.25)', fontSize: '0.66rem', marginTop: 5 }}>UPI: <span style={{ color: '#fbbf24', fontWeight: 700 }}>{UPI_ID}</span></div>
              </div>
              <div style={{ background: '#0d0f1a', border: '1px solid #1e2235', borderRadius: 10, padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '0.76rem', color: 'rgba(226,232,255,.6)', marginBottom: 3 }}>🔐 Enter UTR to confirm</div>
                <div style={{ fontSize: '0.66rem', color: 'rgba(226,232,255,.35)', marginBottom: 7 }}>12-digit UTR from your payment app</div>
                <input type="text" maxLength={12} placeholder="e.g. 426891234567" value={utrInput}
                  onChange={e => { setUtrInput(e.target.value.replace(/\D/g, '')); setUtrError('') }}
                  style={{ width: '100%', padding: '8px 11px', borderRadius: 8, border: utrError ? '1.5px solid #ef4444' : '1.5px solid #1e2235', background: '#131629', color: '#e2e8ff', fontSize: '0.85rem', fontFamily: "'Orbitron',monospace", letterSpacing: '0.05em', outline: 'none', boxSizing: 'border-box' }}
                />
                {utrError && <div style={{ color: '#ef4444', fontSize: '0.66rem', marginTop: 4 }}>{utrError}</div>}
                <button onClick={handleUtrSubmit}
                  style={{ width: '100%', padding: 9, marginTop: 8, background: utrInput.length === 12 ? 'linear-gradient(135deg,#f97316,#ef4444)' : '#1e2235', color: utrInput.length === 12 ? '#fff' : 'rgba(226,232,255,.3)', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: '0.83rem', cursor: utrInput.length === 12 ? 'pointer' : 'not-allowed', transition: 'all .2s' }}>
                  ✅ Verify & Confirm
                </button>
              </div>
            </div>
          )}

          {method === 'cod' && !paid && (
            <button onClick={handleCodConfirm}
              style={{ width: '100%', padding: 11, marginTop: 8, background: 'linear-gradient(135deg,#f97316,#ef4444)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}>
              ✅ Confirm — Pay Cash at Counter
            </button>
          )}

          {paid && (
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 20, padding: '7px 16px', fontSize: '0.8rem', color: '#22c55e', fontWeight: 700 }}>
                ✅ Payment confirmed!
              </div>
            </div>
          )}
        </div>

        {!paid && (
          <button onClick={onClose} style={{ marginTop: 12, background: 'transparent', border: '1px solid #1e2235', color: 'rgba(226,232,255,.4)', padding: '7px 18px', borderRadius: 10, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Cancel</button>
        )}
      </div>
    </div>
  )
}

// ── Order Placed Screen ────────────────────────────────────────────────────────
function OrderPlaced({ members, grandTotal, token, onBack }) {
  const [payingFor,   setPayingFor  ] = useState(null)
  const [paidMembers, setPaidMembers] = useState({})

  const handlePaid = (memberId, method, utr) => {
    setPaidMembers(prev => ({ ...prev, [memberId]: { method, utr } }))
  }

  const membersWithOrders = members.filter(m => m.orders.length > 0)
  const allPaid = membersWithOrders.every(m => paidMembers[m.id])

  return (
    <div style={{ minHeight: '100vh', background: '#02030a', fontFamily: "'Nunito',sans-serif", padding: '32px 16px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 6 }}>🎉</div>
        <div style={{ color: 'rgba(226,232,255,.45)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Group Order Confirmed</div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 'clamp(1.8rem,7vw,2.8rem)', fontWeight: 900, background: 'linear-gradient(90deg,#f97316,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.1em', lineHeight: 1.1, margin: '6px 0 6px' }}>
          #GRP{token}
        </div>
        <div style={{ color: 'rgba(226,232,255,.4)', fontSize: '0.78rem', marginBottom: 24 }}>Show this token at the counter</div>

        <div style={{ background: '#0d0f1a', border: '1px solid #1e2235', borderRadius: 20, padding: 20, marginBottom: 16, textAlign: 'left' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'rgba(226,232,255,.7)', marginBottom: 14 }}>💰 Individual Payments — Each pays their own share</div>

          {membersWithOrders.map((m, i) => {
            const total  = m.orders.reduce((s, o) => s + o.price, 0)
            const isPaid = paidMembers[m.id]
            const idx    = members.findIndex(mem => mem.id === m.id)
            return (
              <div key={m.id} style={{ padding: '12px 0', borderBottom: '1px solid #1e2235' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarColors[idx % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                    {m.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#e2e8ff' }}>{m.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(226,232,255,.3)', marginTop: 2 }}>
                      {m.orders.map(o => `${o.emoji} ${o.name} ₹${o.price}`).join(' · ')}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#f97316', marginRight: 8 }}>₹{total}</div>
                  {isPaid ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 20, padding: '4px 10px', fontSize: '0.7rem', color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>
                      ✅ Paid
                    </div>
                  ) : (
                    <button onClick={() => setPayingFor(m)}
                      style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', color: '#fff', border: 'none', borderRadius: 20, padding: '5px 12px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                      Pay ₹{total}
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12 }}>
            <span style={{ fontWeight: 700, color: 'rgba(226,232,255,.6)', fontSize: '0.88rem' }}>Grand Total</span>
            <span style={{ fontWeight: 900, color: '#fbbf24', fontSize: '1rem' }}>₹{grandTotal}</span>
          </div>
        </div>

        {allPaid && (
          <div style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 14, padding: '14px 20px', marginBottom: 16, color: '#22c55e', fontWeight: 700, fontSize: '0.88rem' }}>
            🎉 All payments done! Show token at the counter.
          </div>
        )}

        <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #1e2235', color: 'rgba(226,232,255,.4)', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
          ← Place Another Order
        </button>
      </div>

      {payingFor && (
        <PaymentModal
          member={payingFor}
          amount={payingFor.orders.reduce((s, o) => s + o.price, 0)}
          token={token}
          onClose={() => setPayingFor(null)}
          onPaid={handlePaid}
        />
      )}
    </div>
  )
}

// ── Main GroupOrder ────────────────────────────────────────────────────────────
export default function GroupOrder() {
  const [members,      setMembers     ] = useState([{ id: 1, name: 'You', orders: [] }])
  const [newName,      setNewName     ] = useState('')
  const [selectingFor, setSelectingFor] = useState(1)
  const [orderPlaced,  setOrderPlaced ] = useState(null)

  const addMember = () => {
    if (!newName.trim()) return
    setMembers(prev => [...prev, { id: Date.now(), name: newName.trim(), orders: [] }])
    setNewName('')
  }

  const toggleItem = (memberId, item) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m
      const has = m.orders.find(o => o.id === item.id)
      return { ...m, orders: has ? m.orders.filter(o => o.id !== item.id) : [...m.orders, item] }
    }))
  }

  const getMemberTotal = (m) => m.orders.reduce((s, o) => s + o.price, 0)
  const grandTotal     = members.reduce((s, m) => s + getMemberTotal(m), 0)
  const currentMember  = members.find(m => m.id === selectingFor)

  const handlePlaceOrder = () => {
    if (grandTotal === 0) return
    setOrderPlaced({ token: genToken(), members: JSON.parse(JSON.stringify(members)), grandTotal })
  }

  if (orderPlaced) {
    return (
      <OrderPlaced
        members={orderPlaced.members}
        grandTotal={orderPlaced.grandTotal}
        token={orderPlaced.token}
        onBack={() => {
          setOrderPlaced(null)
          setMembers([{ id: 1, name: 'You', orders: [] }])
          setSelectingFor(1)
        }}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fffbf5', fontFamily: "'Nunito', sans-serif", padding: '20px 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .go-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; max-width: 960px; margin: 0 auto; }
        .go-summary { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,.06); position: sticky; top: 20px; }
        @media (max-width: 768px) {
          .go-layout { grid-template-columns: 1fr; }
          .go-summary { position: static; }
          .go-menu-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 960, margin: '0 auto 20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 20, padding: '4px 12px', fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginBottom: 10 }}>👥 Auto Bill-Split</div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 900, color: '#1a1a1a', marginBottom: 4 }}>Group Order</h1>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Order together, each person pays only their share</p>
      </div>

      <div className="go-layout">
        <div>
          {/* Members */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 14 }}>👤 Group Members</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input
                style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: '0.9rem', fontFamily: "'Nunito', sans-serif", outline: 'none', minWidth: 0 }}
                placeholder="Add friend's name..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMember()}
              />
              <button style={{ padding: '10px 16px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={addMember}>+ Add</button>
            </div>
            {members.map((m, i) => (
              <div key={m.id} onClick={() => setSelectingFor(m.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 10, cursor: 'pointer', background: selectingFor === m.id ? '#fff3e0' : 'transparent', marginBottom: 4, transition: 'background .15s' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                  {m.name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>{m.name} {selectingFor === m.id && '✏️'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.orders.length === 0 ? 'No items yet' : m.orders.map(o => o.emoji + ' ' + o.name).join(', ')}
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: '#f97316', fontSize: '0.92rem', flexShrink: 0 }}>₹{getMemberTotal(m)}</div>
              </div>
            ))}
          </div>

          {/* Menu */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            {currentMember && (
              <div style={{ background: '#fff3e0', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', color: '#f97316', fontWeight: 700, marginBottom: 12 }}>
                🛒 Selecting for: <strong>{currentMember.name}</strong>
              </div>
            )}
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 12 }}>📋 Choose Items</div>
            <div className="go-menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {menuItems.map(item => {
                const active = currentMember?.orders.find(o => o.id === item.id)
                return (
                  <div key={item.id} onClick={() => toggleItem(selectingFor, item)}
                    style={{ padding: '10px 12px', borderRadius: 10, border: active ? '2px solid #f97316' : '1px solid #e5e5e5', background: active ? '#fff3e0' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .15s' }}>
                    <span style={{ fontSize: '1.1rem' }}>{item.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#f97316' }}>₹{item.price}</div>
                    </div>
                    {active && <span style={{ color: '#f97316', fontSize: '0.8rem' }}>✓</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bill Split Summary */}
        <div className="go-summary">
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 14 }}>💰 Auto Bill Split</div>
          {members.map((m, i) => (
            <div key={m.id} style={{ padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>
                  {m.name[0].toUpperCase()}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a', flex: 1 }}>{m.name}</span>
                <span style={{ fontWeight: 900, fontSize: '0.9rem', color: getMemberTotal(m) > 0 ? '#22c55e' : '#ccc' }}>₹{getMemberTotal(m)}</span>
              </div>
              {m.orders.length > 0 && (
                <div style={{ paddingLeft: 36, marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {m.orders.map(o => (
                    <span key={o.id} style={{ fontSize: '0.65rem', background: '#fff3e0', color: '#f97316', padding: '1px 6px', borderRadius: 5, fontWeight: 600 }}>
                      {o.emoji} ₹{o.price}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '12px 16px', marginTop: 14, display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1rem', color: '#1a1a1a' }}>
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
          <button
            style={{ width: '100%', padding: 13, marginTop: 14, background: grandTotal === 0 ? '#e5e5e5' : 'linear-gradient(135deg, #22c55e, #16a34a)', color: grandTotal === 0 ? '#aaa' : '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: grandTotal === 0 ? 'not-allowed' : 'pointer' }}
            onClick={handlePlaceOrder} disabled={grandTotal === 0}>
            🚀 Place Group Order
          </button>
          <p style={{ color: '#bbb', fontSize: '0.72rem', textAlign: 'center', marginTop: 8 }}>Each person pays only their share</p>
        </div>
      </div>
    </div>
  )
}