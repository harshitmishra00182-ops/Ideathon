import React, { useState } from 'react'

const menuItems = [
  { id: 1, name: 'Vada Pav', price: 25, emoji: '🥙' },
  { id: 2, name: 'Pav Bhaji', price: 70, emoji: '🍛' },
  { id: 3, name: 'Bhel Puri', price: 35, emoji: '🥗' },
  { id: 4, name: 'Masala Chai', price: 15, emoji: '☕' },
  { id: 5, name: 'Samosa', price: 20, emoji: '🔺' },
  { id: 6, name: 'Thali', price: 120, emoji: '🍱' },
  { id: 7, name: 'Lassi', price: 40, emoji: '🥛' },
  { id: 8, name: 'Poha', price: 30, emoji: '🍚' },
]

const avatarColors = ['#f97316', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6', '#f59e0b']

export default function GroupOrder() {
  const [members, setMembers] = useState([{ id: 1, name: 'You', orders: [] }])
  const [newName, setNewName] = useState('')
  const [selectingFor, setSelectingFor] = useState(1)
  const [ordered, setOrdered] = useState(false)

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
  const grandTotal = members.reduce((s, m) => s + getMemberTotal(m), 0)
  const currentMember = members.find(m => m.id === selectingFor)

  const handleOrder = () => {
    if (grandTotal === 0) return
    setOrdered(true)
    setTimeout(() => setOrdered(false), 4000)
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
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Order together, split automatically — no awkward math</p>
      </div>

      {ordered && (
        <div style={{ background: '#dcfce7', border: '1px solid #22c55e', borderRadius: 12, padding: '14px 18px', textAlign: 'center', color: '#15803d', fontWeight: 700, fontSize: '0.9rem', marginBottom: 16, maxWidth: 960, margin: '0 auto 16px' }}>
          ✅ Group order placed! Token #GRP{Math.floor(Math.random() * 900) + 100}
        </div>
      )}

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
              <div
                key={m.id}
                onClick={() => setSelectingFor(m.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 10, cursor: 'pointer', background: selectingFor === m.id ? '#fff3e0' : 'transparent', marginBottom: 4, transition: 'background .15s' }}
              >
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                  {m.name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>{m.name} {selectingFor === m.id && '✏️'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.orders.length === 0 ? 'No items yet' : m.orders.map(o => o.emoji + o.name).join(', ')}
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
                  <div
                    key={item.id}
                    onClick={() => toggleItem(selectingFor, item)}
                    style={{ padding: '10px 12px', borderRadius: 10, border: active ? '2px solid #f97316' : '1px solid #e5e5e5', background: active ? '#fff3e0' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .15s' }}
                  >
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
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>
                {m.name[0].toUpperCase()}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1a1a', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
              <span style={{ fontWeight: 900, fontSize: '0.92rem', color: '#22c55e', flexShrink: 0 }}>₹{getMemberTotal(m)}</span>
            </div>
          ))}
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '12px 16px', marginTop: 14, display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1rem', color: '#1a1a1a' }}>
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
          <button
            style={{ width: '100%', padding: 13, marginTop: 14, background: grandTotal === 0 ? '#e5e5e5' : 'linear-gradient(135deg, #22c55e, #16a34a)', color: grandTotal === 0 ? '#aaa' : '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: grandTotal === 0 ? 'not-allowed' : 'pointer' }}
            onClick={handleOrder}
            disabled={grandTotal === 0}
          >
            🚀 Place Group Order
          </button>
          <p style={{ color: '#bbb', fontSize: '0.72rem', textAlign: 'center', marginTop: 8 }}>Each person pays only their share</p>
        </div>
      </div>
    </div>
  )
}