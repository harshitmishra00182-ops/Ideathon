import React, { useState } from 'react'

const menuItems = [
  { id:1, name:'Vada Pav',    emoji:'🥙', kcal:320, protein:8,  carbs:45,  fat:12, fiber:3,  category:'Mumbai Street' },
  { id:2, name:'Pav Bhaji',   emoji:'🍛', kcal:480, protein:12, carbs:68,  fat:18, fiber:7,  category:'Mumbai Street' },
  { id:3, name:'Bhel Puri',   emoji:'🥗', kcal:210, protein:5,  carbs:38,  fat:5,  fiber:4,  category:'Snacks'        },
  { id:4, name:'Masala Chai', emoji:'☕', kcal:90,  protein:3,  carbs:12,  fat:4,  fiber:0,  category:'Beverages'     },
  { id:5, name:'Samosa',      emoji:'🔺', kcal:180, protein:4,  carbs:22,  fat:9,  fiber:2,  category:'Snacks'        },
  { id:6, name:'Thali',       emoji:'🍱', kcal:850, protein:28, carbs:110, fat:30, fiber:12, category:'Meals'         },
  { id:7, name:'Lassi',       emoji:'🥛', kcal:180, protein:7,  carbs:28,  fat:5,  fiber:0,  category:'Beverages'     },
  { id:8, name:'Poha',        emoji:'🍚', kcal:250, protein:6,  carbs:42,  fat:7,  fiber:3,  category:'Meals'         },
  { id:9, name:'Sev Puri',    emoji:'🫓', kcal:280, protein:6,  carbs:35,  fat:13, fiber:2,  category:'Snacks'        },
]

const GOALS = { kcal:2000, protein:60, carbs:250, fat:65, fiber:25 }

const macroColors = {
  kcal:'#f97316', protein:'#3b82f6', carbs:'#f59e0b', fat:'#ec4899', fiber:'#22c55e',
}

export default function Nutrition() {
  const [logged, setLogged] = useState([])

  const toggleItem = (item) => {
    setLogged(prev => prev.find(i => i.id === item.id)
      ? prev.filter(i => i.id !== item.id)
      : [...prev, item])
  }

  const totals = logged.reduce((acc, item) => ({
    kcal:    acc.kcal    + item.kcal,
    protein: acc.protein + item.protein,
    carbs:   acc.carbs   + item.carbs,
    fat:     acc.fat     + item.fat,
    fiber:   acc.fiber   + item.fiber,
  }), { kcal:0, protein:0, carbs:0, fat:0, fiber:0 })

  const remaining = GOALS.kcal - totals.kcal

  const macros = [
    { key:'protein', label:'Protein', unit:'g' },
    { key:'carbs',   label:'Carbs',   unit:'g' },
    { key:'fat',     label:'Fat',     unit:'g' },
    { key:'fiber',   label:'Fiber',   unit:'g' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#fffbf5', fontFamily:"'Nunito',sans-serif", padding:'20px 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .nt-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; max-width: 1000px; margin: 0 auto; }
        .nt-macro-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 4px; }
        .nt-kcal-card { background: linear-gradient(135deg,#fff3e0,#fff); border: 1px solid #f97316; border-radius: 16px; padding: 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 16px; }
        @media (max-width: 768px) {
          .nt-layout { grid-template-columns: 1fr; }
          .nt-right { order: -1; }
          .nt-macro-grid { grid-template-columns: repeat(2,1fr); }
          .nt-kcal-card { flex-direction: row; }
        }
        @media (max-width: 380px) {
          .nt-macro-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div style={{ maxWidth:1000, margin:'0 auto 20px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#eff6ff', border:'1px solid #3b82f6', borderRadius:20, padding:'4px 12px', fontSize:'0.8rem', color:'#2563eb', fontWeight:700, marginBottom:10 }}>🔥 Calorie Tracker</div>
        <h1 style={{ fontSize:'clamp(1.4rem,4vw,2.2rem)', fontWeight:900, color:'#1a1a1a', marginBottom:4 }}>Nutrition Tracker</h1>
        <p style={{ color:'#888', fontSize:'0.9rem' }}>Track calories & macros for every dish you eat today</p>
      </div>

      <div className="nt-layout">
        <div>
          {/* Calorie Card */}
          <div className="nt-kcal-card">
            <div style={{ width:82, height:82, borderRadius:'50%', border:'5px solid #f97316', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0, background:'#fff' }}>
              <span style={{ fontWeight:900, fontSize:'1.25rem', color:'#f97316', lineHeight:1 }}>{totals.kcal}</span>
              <span style={{ fontWeight:600, fontSize:'0.68rem', color:'#f97316' }}>kcal</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:800, fontSize:'0.95rem', color:'#1a1a1a', marginBottom:4 }}>Today's Calories</div>
              <div style={{ fontSize:'0.83rem', color:'#888', marginBottom:8 }}>
                {remaining >= 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over goal`}
              </div>
              <div style={{ height:6, borderRadius:4, background:'#f5f5f5', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min(Math.round(totals.kcal/GOALS.kcal*100),100)}%`, background:'#f97316', borderRadius:4, transition:'width .4s ease' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'#bbb', marginTop:4 }}>
                <span>0</span>
                <span style={{ color:remaining<0?'#ef4444':'#f97316', fontWeight:700 }}>{Math.round(totals.kcal/GOALS.kcal*100)}%</span>
                <span>{GOALS.kcal}</span>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div style={{ background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)', marginBottom:16 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1a1a', marginBottom:14 }}>📊 Macronutrients</div>
            <div className="nt-macro-grid">
              {macros.map(({ key, label, unit }) => (
                <div key={key} style={{ background:`${macroColors[key]}12`, border:`1px solid ${macroColors[key]}30`, borderRadius:12, padding:'12px 14px' }}>
                  <div style={{ fontSize:'0.72rem', color:'#888', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
                  <div style={{ fontSize:'1.3rem', fontWeight:900, color:macroColors[key], lineHeight:1.2 }}>
                    {totals[key]}<span style={{ fontSize:'0.72rem', color:'#aaa', fontWeight:600 }}>{unit}</span>
                  </div>
                  <div style={{ height:5, borderRadius:4, background:'#f5f5f5', overflow:'hidden', marginTop:7 }}>
                    <div style={{ height:'100%', width:`${Math.min(Math.round(totals[key]/GOALS[key]*100),100)}%`, background:macroColors[key], borderRadius:4, transition:'width .4s ease' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.68rem', color:'#bbb', marginTop:3 }}>
                    <span>{Math.round(totals[key]/GOALS[key]*100)}%</span>
                    <span>{GOALS[key]}{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logged Items */}
          <div style={{ background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1a1a', marginBottom:14 }}>📝 Logged Today</div>
            {logged.length === 0 ? (
              <div style={{ textAlign:'center', padding:'24px 0', color:'#ccc', fontSize:'0.88rem' }}>No items logged yet. Add from the menu →</div>
            ) : (
              logged.map(item => (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 0', borderBottom:'1px solid #f5f5f5', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'1.2rem' }}>{item.emoji}</span>
                  <span style={{ fontWeight:700, fontSize:'0.88rem', color:'#1a1a1a', flex:1, minWidth:80 }}>{item.name}</span>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                    <span style={{ background:`${macroColors.protein}15`, color:macroColors.protein, padding:'2px 7px', borderRadius:6, fontSize:'0.72rem', fontWeight:700 }}>P:{item.protein}g</span>
                    <span style={{ background:`${macroColors.carbs}15`, color:macroColors.carbs, padding:'2px 7px', borderRadius:6, fontSize:'0.72rem', fontWeight:700 }}>C:{item.carbs}g</span>
                    <span style={{ background:`${macroColors.fat}15`, color:macroColors.fat, padding:'2px 7px', borderRadius:6, fontSize:'0.72rem', fontWeight:700 }}>F:{item.fat}g</span>
                  </div>
                  <span style={{ fontSize:'0.82rem', color:'#f97316', fontWeight:700 }}>{item.kcal} kcal</span>
                  <button onClick={() => toggleItem(item)}
                    style={{ padding:'4px 10px', borderRadius:8, border:'1px solid #ef4444', background:'#fef2f2', color:'#ef4444', fontWeight:700, fontSize:'0.78rem', cursor:'pointer' }}>
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Menu + Goals */}
        <div className="nt-right">
          <div style={{ background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)', marginBottom:16 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1a1a', marginBottom:14 }}>🍽️ Today's Menu</div>
            {menuItems.map(item => {
              const isLogged = logged.find(i => i.id === item.id)
              return (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #f5f5f5' }}>
                  <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{item.emoji}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#1a1a1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize:'0.72rem', color:'#bbb', marginTop:2 }}>P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g</div>
                  </div>
                  <span style={{ fontSize:'0.8rem', color:'#f97316', fontWeight:700, flexShrink:0, marginRight:6 }}>{item.kcal}kcal</span>
                  <button onClick={() => toggleItem(item)}
                    style={{ padding:'5px 10px', borderRadius:8, border:isLogged?'1px solid #ef4444':'1px solid #f97316', background:isLogged?'#fef2f2':'#fff3e0', color:isLogged?'#ef4444':'#f97316', fontWeight:700, fontSize:'0.78rem', cursor:'pointer', flexShrink:0 }}>
                    {isLogged ? '✓ Added' : '+ Log'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Goals */}
          <div style={{ background:'#f8faff', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1a1a', marginBottom:12 }}>🎯 Daily Goals</div>
            {[
              { label:'Calories', val:GOALS.kcal,    unit:'kcal', color:macroColors.kcal    },
              { label:'Protein',  val:GOALS.protein,  unit:'g',    color:macroColors.protein  },
              { label:'Carbs',    val:GOALS.carbs,    unit:'g',    color:macroColors.carbs    },
              { label:'Fat',      val:GOALS.fat,      unit:'g',    color:macroColors.fat      },
              { label:'Fiber',    val:GOALS.fiber,    unit:'g',    color:macroColors.fiber    },
            ].map(({ label, val, unit, color }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', marginBottom:7, fontSize:'0.87rem' }}>
                <span style={{ color:'#555' }}>{label}</span>
                <span style={{ fontWeight:800, color }}>{val}{unit}</span>
              </div>
            ))}
            <p style={{ fontSize:'0.7rem', color:'#ccc', marginTop:8 }}>Based on avg. adult daily intake</p>
          </div>
        </div>
      </div>
    </div>
  )
}