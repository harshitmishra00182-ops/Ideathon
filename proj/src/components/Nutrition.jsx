import React, { useState } from 'react'

const menuItems = [
  { id: 1, name: 'Vada Pav', emoji: '🥙', kcal: 320, protein: 8, carbs: 45, fat: 12, fiber: 3, category: 'Mumbai Street' },
  { id: 2, name: 'Pav Bhaji', emoji: '🍛', kcal: 480, protein: 12, carbs: 68, fat: 18, fiber: 7, category: 'Mumbai Street' },
  { id: 3, name: 'Bhel Puri', emoji: '🥗', kcal: 210, protein: 5, carbs: 38, fat: 5, fiber: 4, category: 'Snacks' },
  { id: 4, name: 'Masala Chai', emoji: '☕', kcal: 90, protein: 3, carbs: 12, fat: 4, fiber: 0, category: 'Beverages' },
  { id: 5, name: 'Samosa', emoji: '🔺', kcal: 180, protein: 4, carbs: 22, fat: 9, fiber: 2, category: 'Snacks' },
  { id: 6, name: 'Thali', emoji: '🍱', kcal: 850, protein: 28, carbs: 110, fat: 30, fiber: 12, category: 'Meals' },
  { id: 7, name: 'Lassi', emoji: '🥛', kcal: 180, protein: 7, carbs: 28, fat: 5, fiber: 0, category: 'Beverages' },
  { id: 8, name: 'Poha', emoji: '🍚', kcal: 250, protein: 6, carbs: 42, fat: 7, fiber: 3, category: 'Meals' },
  { id: 9, name: 'Sev Puri', emoji: '🫓', kcal: 280, protein: 6, carbs: 35, fat: 13, fiber: 2, category: 'Snacks' },
]

const GOALS = { kcal: 2000, protein: 60, carbs: 250, fat: 65, fiber: 25 }

const macroColors = {
  kcal: '#f97316',
  protein: '#3b82f6',
  carbs: '#f59e0b',
  fat: '#ec4899',
  fiber: '#22c55e',
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fffbf5',
    fontFamily: "'Nunito', sans-serif",
    padding: '32px 24px',
  },
  header: { maxWidth: 1000, margin: '0 auto 28px' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#eff6ff', border: '1px solid #3b82f6',
    borderRadius: 20, padding: '4px 12px', fontSize: '0.8rem',
    color: '#2563eb', fontWeight: 700, marginBottom: 12,
  },
  title: { fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: '#1a1a1a', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: '0.95rem' },
  layout: { maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 },
  card: {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20,
  },
  sectionTitle: { fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 16 },
  macroGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 4 },
  macroCard: (color) => ({
    background: `${color}12`,
    border: `1px solid ${color}30`,
    borderRadius: 12, padding: '14px 16px',
  }),
  macroLabel: { fontSize: '0.78rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  macroValue: (color) => ({ fontSize: '1.4rem', fontWeight: 900, color, lineHeight: 1.2 }),
  macroUnit: { fontSize: '0.75rem', color: '#aaa', fontWeight: 600 },
  progressBar: (pct, color) => ({
    height: 6, borderRadius: 4, background: '#f5f5f5', overflow: 'hidden', marginTop: 8,
  }),
  progressFill: (pct, color) => ({
    height: '100%',
    width: `${Math.min(pct, 100)}%`,
    background: color,
    borderRadius: 4,
    transition: 'width 0.4s ease',
  }),
  progressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#bbb', marginTop: 4 },
  kcalCard: {
    background: 'linear-gradient(135deg, #fff3e0, #fff)',
    border: '1px solid #f97316',
    borderRadius: 16, padding: 20, marginBottom: 20,
    display: 'flex', alignItems: 'center', gap: 20,
  },
  kcalCircle: {
    width: 90, height: 90, borderRadius: '50%',
    border: '6px solid #f97316',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    background: '#fff',
  },
  kcalNum: { fontWeight: 900, fontSize: '1.3rem', color: '#f97316', lineHeight: 1 },
  kcalSub: { fontWeight: 600, fontSize: '0.7rem', color: '#f97316' },
  itemRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0', borderBottom: '1px solid #f5f5f5',
  },
  itemEmoji: { fontSize: '1.3rem' },
  itemName: { fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a', flex: 1 },
  itemKcal: { fontSize: '0.82rem', color: '#f97316', fontWeight: 700 },
  addBtn: (active) => ({
    padding: '5px 12px', borderRadius: 8,
    border: active ? '1px solid #ef4444' : '1px solid #f97316',
    background: active ? '#fef2f2' : '#fff3e0',
    color: active ? '#ef4444' : '#f97316',
    fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
  }),
  macroRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  macroTag: (color) => ({
    background: `${color}15`, color,
    padding: '2px 8px', borderRadius: 6,
    fontSize: '0.75rem', fontWeight: 700,
  }),
  emptyState: { textAlign: 'center', padding: '30px 0', color: '#ccc', fontSize: '0.9rem' },
}

export default function Nutrition() {
  const [logged, setLogged] = useState([])

  const toggleItem = (item) => {
    setLogged(prev => prev.find(i => i.id === item.id)
      ? prev.filter(i => i.id !== item.id)
      : [...prev, item])
  }

  const totals = logged.reduce((acc, item) => ({
    kcal: acc.kcal + item.kcal,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fat: acc.fat + item.fat,
    fiber: acc.fiber + item.fiber,
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })

  const remaining = GOALS.kcal - totals.kcal

  const macros = [
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
  ]

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={styles.header}>
        <div style={styles.badge}>🔥 Calorie Tracker</div>
        <h1 style={styles.title}>Nutrition Tracker</h1>
        <p style={styles.subtitle}>Track calories & macros for every dish you eat today</p>
      </div>

      <div style={styles.layout}>
        <div>
          {/* Calorie Overview */}
          <div style={styles.kcalCard}>
            <div style={styles.kcalCircle}>
              <span style={styles.kcalNum}>{totals.kcal}</span>
              <span style={styles.kcalSub}>kcal</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 4 }}>
                Today's Calories
              </div>
              <div style={{ fontSize: '0.88rem', color: '#888', marginBottom: 8 }}>
                {remaining >= 0
                  ? `${remaining} kcal remaining out of ${GOALS.kcal} goal`
                  : `${Math.abs(remaining)} kcal over your daily goal`}
              </div>
              <div style={styles.progressBar()}>
                <div style={styles.progressFill(Math.round(totals.kcal / GOALS.kcal * 100), '#f97316')} />
              </div>
              <div style={styles.progressLabel}>
                <span>0</span>
                <span style={{ color: remaining < 0 ? '#ef4444' : '#f97316', fontWeight: 700 }}>
                  {Math.round(totals.kcal / GOALS.kcal * 100)}% of goal
                </span>
                <span>{GOALS.kcal}</span>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>📊 Macronutrients</div>
            <div style={styles.macroGrid}>
              {macros.map(({ key, label, unit }) => (
                <div key={key} style={styles.macroCard(macroColors[key])}>
                  <div style={styles.macroLabel}>{label}</div>
                  <div style={styles.macroValue(macroColors[key])}>
                    {totals[key]}<span style={styles.macroUnit}>{unit}</span>
                  </div>
                  <div style={styles.progressBar()}>
                    <div style={styles.progressFill(Math.round(totals[key] / GOALS[key] * 100), macroColors[key])} />
                  </div>
                  <div style={styles.progressLabel}>
                    <span>{Math.round(totals[key] / GOALS[key] * 100)}%</span>
                    <span>goal: {GOALS[key]}{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logged Items */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>📝 Logged Today</div>
            {logged.length === 0 ? (
              <div style={styles.emptyState}>No items logged yet. Add from the menu →</div>
            ) : (
              logged.map(item => (
                <div key={item.id} style={styles.itemRow}>
                  <span style={styles.itemEmoji}>{item.emoji}</span>
                  <span style={styles.itemName}>{item.name}</span>
                  <div style={{ display: 'flex', gap: 4, marginRight: 8 }}>
                    <span style={styles.macroTag(macroColors.protein)}>P: {item.protein}g</span>
                    <span style={styles.macroTag(macroColors.carbs)}>C: {item.carbs}g</span>
                    <span style={styles.macroTag(macroColors.fat)}>F: {item.fat}g</span>
                  </div>
                  <span style={styles.itemKcal}>{item.kcal} kcal</span>
                  <button style={styles.addBtn(true)} onClick={() => toggleItem(item)}>Remove</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Menu to add */}
        <div>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>🍽️ Today's Menu</div>
            {menuItems.map(item => {
              const isLogged = logged.find(i => i.id === item.id)
              return (
                <div key={item.id} style={styles.itemRow}>
                  <span style={styles.itemEmoji}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#bbb', marginTop: 2 }}>
                      P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g
                    </div>
                  </div>
                  <span style={{ ...styles.itemKcal, marginRight: 8 }}>{item.kcal} kcal</span>
                  <button style={styles.addBtn(isLogged)} onClick={() => toggleItem(item)}>
                    {isLogged ? '✓ Added' : '+ Log'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Goals Reference */}
          <div style={{ ...styles.card, background: '#f8faff' }}>
            <div style={styles.sectionTitle}>🎯 Daily Goals</div>
            {[
              { label: 'Calories', val: GOALS.kcal, unit: 'kcal', color: macroColors.kcal },
              { label: 'Protein', val: GOALS.protein, unit: 'g', color: macroColors.protein },
              { label: 'Carbs', val: GOALS.carbs, unit: 'g', color: macroColors.carbs },
              { label: 'Fat', val: GOALS.fat, unit: 'g', color: macroColors.fat },
              { label: 'Fiber', val: GOALS.fiber, unit: 'g', color: macroColors.fiber },
            ].map(({ label, val, unit, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.88rem' }}>
                <span style={{ color: '#555' }}>{label}</span>
                <span style={{ fontWeight: 800, color }}>{val}{unit}</span>
              </div>
            ))}
            <p style={{ fontSize: '0.72rem', color: '#ccc', marginTop: 8 }}>Based on avg. adult daily intake</p>
          </div>
        </div>
      </div>
    </div>
  )
}