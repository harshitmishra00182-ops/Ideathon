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

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fffbf5',
    fontFamily: "'Nunito', sans-serif",
    padding: '32px 24px',
  },
  header: { maxWidth: 960, margin: '0 auto 28px' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#f0fdf4', border: '1px solid #22c55e',
    borderRadius: 20, padding: '4px 12px', fontSize: '0.8rem',
    color: '#16a34a', fontWeight: 700, marginBottom: 12,
  },
  title: { fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: '#1a1a1a', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: '0.95rem' },
  layout: { maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 },
  card: {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20,
  },
  sectionTitle: { fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 16 },
  memberRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0', borderBottom: '1px solid #f5f5f5',
  },
  avatar: (color) => ({
    width: 36, height: 36, borderRadius: '50%',
    background: color, display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem',
    flexShrink: 0,
  }),
  memberName: { fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' },
  memberItems: { fontSize: '0.78rem', color: '#999', marginTop: 2 },
  memberTotal: { marginLeft: 'auto', fontWeight: 800, color: '#f97316', fontSize: '0.95rem' },
  addInput: {
    display: 'flex', gap: 8, marginBottom: 16,
  },
  input: {
    flex: 1, padding: '10px 14px', borderRadius: 10,
    border: '1px solid #e5e5e5', fontSize: '0.9rem',
    fontFamily: "'Nunito', sans-serif", outline: 'none',
  },
  greenBtn: {
    padding: '10px 16px', background: '#22c55e', color: '#fff',
    border: 'none', borderRadius: 10, fontWeight: 700,
    fontSize: '0.88rem', cursor: 'pointer',
  },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 },
  menuItem: (active) => ({
    padding: '10px 12px', borderRadius: 10,
    border: active ? '2px solid #f97316' : '1px solid #e5e5e5',
    background: active ? '#fff3e0' : '#fff',
    cursor: 'pointer', transition: 'all 0.15s',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  }),
  itemName: { fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a' },
  itemPrice: { fontWeight: 700, fontSize: '0.82rem', color: '#f97316' },
  summaryCard: {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: 24,
  },
  splitRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 0', borderBottom: '1px solid #f5f5f5',
  },
  splitName: { fontWeight: 700, fontSize: '0.88rem', color: '#1a1a1a', flex: 1 },
  splitAmt: { fontWeight: 900, fontSize: '0.95rem', color: '#22c55e' },
  totalBox: {
    background: '#f0fdf4', borderRadius: 12, padding: '12px 16px',
    marginTop: 16, display: 'flex', justifyContent: 'space-between',
    fontWeight: 900, fontSize: '1.05rem', color: '#1a1a1a',
  },
  orderBtn: {
    width: '100%', padding: 14, marginTop: 16,
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: '#fff', border: 'none', borderRadius: 12,
    fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
  },
  selectingFor: {
    background: '#fff3e0', borderRadius: 10, padding: '10px 14px',
    fontSize: '0.85rem', color: '#f97316', fontWeight: 700, marginBottom: 12,
    display: 'flex', alignItems: 'center', gap: 8,
  },
  successBanner: {
    background: '#dcfce7', border: '1px solid #22c55e', borderRadius: 12,
    padding: '16px 20px', textAlign: 'center', color: '#15803d',
    fontWeight: 700, fontSize: '0.95rem', marginBottom: 20,
    maxWidth: 960, margin: '0 auto 20px',
  },
}

export default function GroupOrder() {
  const [members, setMembers] = useState([
    { id: 1, name: 'You', orders: [] },
  ])
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
      return {
        ...m,
        orders: has ? m.orders.filter(o => o.id !== item.id) : [...m.orders, item]
      }
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
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={styles.header}>
        <div style={styles.badge}>👥 Auto Bill-Split</div>
        <h1 style={styles.title}>Group Order</h1>
        <p style={styles.subtitle}>Order together, split automatically — no awkward math</p>
      </div>

      {ordered && (
        <div style={styles.successBanner}>
          ✅ Group order placed! Everyone's share has been calculated. Token #GRP{Math.floor(Math.random() * 900) + 100}
        </div>
      )}

      <div style={styles.layout}>
        <div>
          {/* Add Members */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>👤 Group Members</div>
            <div style={styles.addInput}>
              <input
                style={styles.input}
                placeholder="Add friend's name..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMember()}
              />
              <button style={styles.greenBtn} onClick={addMember}>+ Add</button>
            </div>
            {members.map((m, i) => (
              <div
                key={m.id}
                style={{ ...styles.memberRow, cursor: 'pointer', background: selectingFor === m.id ? '#fff3e0' : 'transparent', borderRadius: 8, padding: '10px 8px' }}
                onClick={() => setSelectingFor(m.id)}
              >
                <div style={styles.avatar(avatarColors[i % avatarColors.length])}>
                  {m.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={styles.memberName}>{m.name} {selectingFor === m.id && '✏️'}</div>
                  <div style={styles.memberItems}>
                    {m.orders.length === 0 ? 'No items yet' : m.orders.map(o => o.emoji + o.name).join(', ')}
                  </div>
                </div>
                <div style={styles.memberTotal}>₹{getMemberTotal(m)}</div>
              </div>
            ))}
          </div>

          {/* Menu for selected member */}
          <div style={styles.card}>
            {currentMember && (
              <div style={styles.selectingFor}>
                {avatarColors && '🛒'} Selecting for: <strong>{currentMember.name}</strong>
              </div>
            )}
            <div style={styles.sectionTitle}>📋 Choose Items</div>
            <div style={styles.menuGrid}>
              {menuItems.map(item => {
                const active = currentMember?.orders.find(o => o.id === item.id)
                return (
                  <div key={item.id} style={styles.menuItem(active)} onClick={() => toggleItem(selectingFor, item)}>
                    <span style={{ fontSize: '1.1rem', marginRight: 6 }}>{item.emoji}</span>
                    <span style={styles.itemName}>{item.name}</span>
                    <span style={styles.itemPrice}>₹{item.price}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bill Split Summary */}
        <div style={styles.summaryCard}>
          <div style={styles.sectionTitle}>💰 Auto Bill Split</div>
          {members.map((m, i) => (
            <div key={m.id} style={styles.splitRow}>
              <div style={styles.avatar(avatarColors[i % avatarColors.length])}>
                {m.name[0].toUpperCase()}
              </div>
              <span style={styles.splitName}>{m.name}</span>
              <span style={styles.splitAmt}>₹{getMemberTotal(m)}</span>
            </div>
          ))}
          <div style={styles.totalBox}>
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
          <button
            style={{ ...styles.orderBtn, opacity: grandTotal === 0 ? 0.5 : 1 }}
            onClick={handleOrder}
            disabled={grandTotal === 0}
          >
            🚀 Place Group Order
          </button>
          <p style={{ color: '#bbb', fontSize: '0.75rem', textAlign: 'center', marginTop: 8 }}>
            Each person pays only their share
          </p>
        </div>
      </div>
    </div>
  )
}