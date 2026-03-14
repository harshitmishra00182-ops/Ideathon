import { useState, useEffect, useRef, forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { gsap } from "gsap";

const UPI_ID   = "harshitmishra00182-2@okicici";
const UPI_NAME = "CampusBite DMCE";

const CATEGORIES = ["All", "Mumbai Street", "Meals", "Snacks", "Beverages", "Healthy"];

const MENU_ITEMS = [
  // ── Mumbai Street ─────────────────────────────────────────────────────────
  {
    id:1, cat:"Mumbai Street", name:"Vada Pav", veg:true,
    desc:"Spiced potato fritter in a soft bun with green & tamarind chutneys",
    price:25, rating:4.9, time:"5 min", cal:320, tag:"🔥 Bestseller",
    emoji:"🍔",
    img: "https://ministryofcurry.com/wp-content/uploads/2024/06/vada-pav-3-500x375.jpg",
    img2:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:2, cat:"Mumbai Street", name:"Pav Bhaji", veg:true,
    desc:"Spiced mashed veggies with buttered pav rolls, straight from the tawa",
    price:70, rating:4.8, time:"8 min", cal:480, tag:"🌟 Most Ordered",
    emoji:"🍛",
    img: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Instant-Pot-Mumbai-Pav-Bhaji-Recipe.jpg",
    img2:"https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:3, cat:"Mumbai Street", name:"Bhel Puri", veg:true,
    desc:"Puffed rice, sev, tamarind chutney, onions & fresh tomato",
    price:35, rating:4.7, time:"3 min", cal:210, tag:null,
    emoji:"🥗",
    img: "https://www.awesomecuisine.com/wp-content/uploads/2007/11/bhel-puri.jpg",
    img2:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:4, cat:"Mumbai Street", name:"Sev Puri", veg:true,
    desc:"Crispy puris loaded with potato, chutneys & crunchy sev",
    price:40, rating:4.6, time:"4 min", cal:280, tag:null,
    emoji:"🫓",
    img: "https://shwetainthekitchen.com/wp-content/uploads/2021/10/sev-puri.jpg",
    img2:"https://images.unsplash.com/photo-1601050690117-94f5f7a207b7?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:5, cat:"Mumbai Street", name:"Misal Pav", veg:true,
    desc:"Spicy sprouted moth curry topped with farsan, lemon & onion",
    price:60, rating:4.8, time:"7 min", cal:420, tag:"🌶 Extra Spicy",
    emoji:"🌶️",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTacHU5VYYiZpMQpAYHAdJp7DHOXBz_YC_yCA&s",
    img2:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:6, cat:"Mumbai Street", name:"Dabeli", veg:true,
    desc:"Potato filling in pav with pomegranate, peanuts & date chutney",
    price:30, rating:4.5, time:"4 min", cal:260, tag:null,
    emoji:"🥙",
    img: "https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/9c4712a6ae156dfd0c82c58e991e84db",
    img2:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop&q=80&auto=format",
  },

  // ── Meals ──────────────────────────────────────────────────────────────────
  {
    id:7, cat:"Meals", name:"Dal Tadka + Rice", veg:true,
    desc:"Yellow dal tempered with ghee, cumin & fried garlic on fluffy rice",
    price:55, rating:4.6, time:"10 min", cal:520, tag:null,
    emoji:"🍲",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQazltkBxRK7xdnZ08kiia3P3PGKDeI_gWiQ&s",
    img2:"https://images.unsplash.com/photo-1631452180519-cf85c04e789d?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:8, cat:"Meals", name:"Veg Thali", veg:true,
    desc:"Dal, sabzi, roti, rice, salad, pickle & papad — the full spread",
    price:90, rating:4.7, time:"12 min", cal:680, tag:"🌟 Most Ordered",
    emoji:"🍱",
    img: "https://img.freepik.com/free-photo/delicious-food-table_23-2150857814.jpg?semt=ais_rp_progressive&w=740&q=80",
    img2:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:9, cat:"Meals", name:"Chicken Biryani", veg:false,
    desc:"Dum-cooked basmati rice with tender chicken, whole spices & saffron",
    price:120, rating:4.9, time:"15 min", cal:750, tag:"🔥 Bestseller",
    emoji:"🍗",
    img: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg",
    img2:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:10, cat:"Meals", name:"Paneer Butter Masala", veg:true,
    desc:"Cottage cheese cubes in a velvety tomato-cream gravy with naan",
    price:110, rating:4.8, time:"12 min", cal:620, tag:null,
    emoji:"🧀",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6GMD_WH9sl6HjJ4CObB9Lim-51zBji9n5KA&s",
    img2:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:11, cat:"Meals", name:"Egg Fried Rice", veg:false,
    desc:"Wok-tossed rice with eggs, spring onion, soy & sesame",
    price:70, rating:4.5, time:"8 min", cal:490, tag:null,
    emoji:"🍳",
    img: "https://www.bigfattummy.com/wp-content/uploads/2017/09/Prawn-Egg-Fried-Rice-07-800x800.jpg",
    img2:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:12, cat:"Meals", name:"Chole Bhature", veg:true,
    desc:"Spiced chickpea curry with giant fluffy deep-fried bhatura bread",
    price:80, rating:4.7, time:"10 min", cal:700, tag:"🌟 Most Ordered",
    emoji:"🫘",
    img: "https://holycowvegan.net/wp-content/uploads/2025/11/chole-bhature-4.jpg",
    img2:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&q=80&auto=format",
  },

  // ── Snacks ─────────────────────────────────────────────────────────────────
  {
    id:13, cat:"Snacks", name:"Samosa (2 pcs)", veg:true,
    desc:"Golden-fried pastry stuffed with spiced potato & green peas",
    price:20, rating:4.5, time:"3 min", cal:200, tag:null,
    emoji:"🥟",
    img: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_960,w_960//InstamartAssets/samosa.webp?updatedAt=1727156367955",
    img2:"https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:14, cat:"Snacks", name:"Cheese Maggi", veg:true,
    desc:"2-minute noodles loaded with melted cheese, veggies & masala",
    price:45, rating:4.7, time:"6 min", cal:380, tag:"🌟 Most Ordered",
    emoji:"🍜",
    img: "https://www.whiskaffair.com/wp-content/uploads/2018/01/Cheese-Maggi-2-3-2.jpg",
    img2:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:15, cat:"Snacks", name:"Veg Frankie", veg:true,
    desc:"Spiced veggie filling wrapped in a soft roomali roti",
    price:50, rating:4.6, time:"5 min", cal:340, tag:null,
    emoji:"🌯",
    img: "https://d1mxd7n691o8sz.cloudfront.net/static/recipe/recipe/2023-01/Vegetable_Frankie-fa94e3b43c914757bded445420e2519e_thumbnail_1675163626-65.jpg",
    img2:"https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:16, cat:"Snacks", name:"Aloo Tikki", veg:true,
    desc:"Crispy pan-fried potato patties with green & tamarind chutneys",
    price:30, rating:4.4, time:"4 min", cal:240, tag:null,
    emoji:"🥔",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh32l_8NdfJnoXbES8H9JQTVkCdGQpDEAkvw&s",
    img2:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:17, cat:"Snacks", name:"Bread Pakora", veg:true,
    desc:"Thick-cut bread slices dunked in spiced chickpea batter, deep-fried crisp",
    price:25, rating:4.3, time:"4 min", cal:290, tag:null,
    emoji:"🍞",
    img: "https://www.shutterstock.com/image-photo/bread-pakora-popular-indian-street-600nw-2490598497.jpg",
    img2:"https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:18, cat:"Snacks", name:"Pani Puri", veg:true,
    desc:"Hollow crispy puri shells filled with spiced potato & tangy tamarind water",
    price:30, rating:4.8, time:"3 min", cal:180, tag:"🔥 Bestseller",
    emoji:"🫙",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVxMDZ89fmuKlbqzOdXvFvhLA89V4J_klI3Q&s",
    img2:"https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop&q=80&auto=format",
  },

  // ── Beverages ──────────────────────────────────────────────────────────────
  {
    id:19, cat:"Beverages", name:"Masala Chai", veg:true,
    desc:"Fresh-brewed ginger & cardamom spiced tea, the campus staple",
    price:15, rating:4.8, time:"3 min", cal:80, tag:"☕ Campus Fave",
    emoji:"☕",
    img: "https://carameltintedlife.com/wp-content/uploads/2021/01/Masala-Chai-.jpg",
    img2:"https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:20, cat:"Beverages", name:"Mango Lassi", veg:true,
    desc:"Thick chilled yoghurt blended with Alphonso mango pulp & cardamom",
    price:50, rating:4.9, time:"2 min", cal:220, tag:"🥭 Mumbai Special",
    emoji:"🥭",
    img: "https://lentillovingfamily.com/wp-content/uploads/2025/05/mango-lassi-2.jpg",
    img2:"https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:21, cat:"Beverages", name:"Cold Coffee", veg:true,
    desc:"Double-shot blended coffee with full-cream milk & vanilla ice cream",
    price:60, rating:4.7, time:"3 min", cal:180, tag:null,
    emoji:"🧋",
    img: "https://www.whiskaffair.com/wp-content/uploads/2021/03/Cold-Coffee-2-3.jpg",
    img2:"https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:22, cat:"Beverages", name:"Fresh Lime Soda", veg:true,
    desc:"Hand-squeezed lime with sparkling soda — sweet, salted or masala",
    price:25, rating:4.5, time:"2 min", cal:60, tag:null,
    emoji:"🍋",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQesNNLtgLZJxbgUpaWmxEiuYTRLpsQkD8rUg&s",
    img2:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:23, cat:"Beverages", name:"Sugarcane Juice", veg:true,
    desc:"Fresh-pressed gane ka ras with ginger & mint, served chilled",
    price:30, rating:4.6, time:"3 min", cal:120, tag:null,
    emoji:"🌿",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&q=80&auto=format",
    img2:"https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop&q=80&auto=format",
  },

  // ── Healthy ────────────────────────────────────────────────────────────────
  {
    id:24, cat:"Healthy", name:"Sprouts Salad", veg:true,
    desc:"Mixed sprouts, cucumber, tomato & chaat masala with lemon dressing",
    price:45, rating:4.4, time:"3 min", cal:140, tag:"💪 High Protein",
    emoji:"🥗",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80&auto=format",
    img2:"https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:25, cat:"Healthy", name:"Fruit Bowl", veg:true,
    desc:"Seasonal fresh fruits with chaat masala, mint & a squeeze of lemon",
    price:60, rating:4.6, time:"2 min", cal:160, tag:null,
    emoji:"🍉",
    img: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop&q=80&auto=format",
    img2:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:26, cat:"Healthy", name:"Oats Upma", veg:true,
    desc:"Roasted oats with mustard, curry leaves, veggies & coconut",
    price:40, rating:4.3, time:"6 min", cal:210, tag:null,
    emoji:"🥣",
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&q=80&auto=format",
    img2:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80&auto=format",
  },
  {
    id:27, cat:"Healthy", name:"Greek Yogurt Parfait", veg:true,
    desc:"Thick yogurt layered with granola, seasonal fruits & honey drizzle",
    price:75, rating:4.5, time:"2 min", cal:280, tag:null,
    emoji:"🫙",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&q=80&auto=format",
    img2:"https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop&q=80&auto=format",
  },
];

const ADS = [
  { id:1, brand:"CampusBite Pre-Order", tagline:"Skip the queue, every single day", sub:"Pre-order your meals & earn 2× reward points 🎁", bg:"linear-gradient(135deg,#ea580c,#f97316)", emoji:"⚡", badge:"UPGRADE", cta:"Pre-Order Now", page:"preorder" },
  { id:2, brand:"Rewards Program", tagline:"Earn points on every order you place", sub:"Redeem for free food — the more you order, the more you earn 🎁", bg:"linear-gradient(135deg,#16a34a,#22c55e)", emoji:"🎉", badge:"OFFER", cta:"View Rewards", page:"rewards" },
  { id:3, brand:"Campus Wallet", tagline:"Top up once, never wait at the counter", sub:"Load ₹500+ and get ₹50 bonus credited instantly 💳", bg:"linear-gradient(135deg,#1d4ed8,#3b82f6)", emoji:"💳", badge:"NEW", cta:"Top Up Now", page:"wallet" },
  { id:4, brand:"Group Order", tagline:"Order with friends, split automatically", sub:"No more collecting cash — everyone pays their share 👥", bg:"linear-gradient(135deg,#7c3aed,#a855f7)", emoji:"👥", badge:"FEATURE", cta:"Start Group Order", page:"group" },
];

const SUGGEST_MAP = { 1:[19,13], 2:[22,19], 9:[20,22], 14:[21,20], 19:[1,13], 20:[18,24], 8:[13,15] };
const DEFAULT_SUGGESTS = [19, 13, 20];

const genToken    = () => Math.floor(100000 + Math.random() * 900000).toString();
const buildUpiUri = (amount, token) => {
  const p = new URLSearchParams({ pa:UPI_ID, pn:UPI_NAME, am:amount.toFixed(2), cu:"INR", tn:`CampusBite #${token}`, tr:token });
  return `upi://pay?${p}`;
};

// ── Smart Image component ──────────────────────────────────────────────────────
function FoodImg({ item, className, style, width, height }) {
  const [phase, setPhase] = useState(0);
  const src = phase === 0 ? item.img : phase === 1 ? item.img2 : null;
  if (phase === 2) {
    return (
      <div className={className} style={{ ...style, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#fff7ed,#fef3c7)", gap:4, width:width||"100%", height:height||"100%" }}>
        <span style={{ fontSize:width?"1.4rem":"2.4rem" }}>{item.emoji}</span>
        {!width && <span style={{ fontSize:"0.72rem", color:"#ea580c", fontWeight:600, textAlign:"center", padding:"0 8px" }}>{item.name}</span>}
      </div>
    );
  }
  return <img src={src} alt={item.name} className={className} style={style} loading="lazy" onError={()=>setPhase(p=>p+1)} />;
}

// ── Ad Banner — fully mobile responsive ───────────────────────────────────────
// On mobile (<520px): stacks vertically — emoji+brand on top, sub-text in middle,
// CTA button + dots on the bottom row side by side.
// On desktop: original single-row horizontal layout.
function AdBanner({ onNavigate }) {
  const [idx, setIdx]         = useState(0);
  const [anim, setAnim]       = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 520);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setAnim(false);
      setTimeout(() => { setIdx(i => (i + 1) % ADS.length); setAnim(true); }, 300);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const ad = ADS[idx];

  return (
    <div style={{
      margin:"1.5rem 0",
      borderRadius:16,
      background:ad.bg,
      padding: isMobile ? "14px 16px" : "18px 22px",
      display:"flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      gap: isMobile ? 8 : 16,
      opacity:anim ? 1 : 0,
      transform:anim ? "translateY(0)" : "translateY(8px)",
      transition:"all .3s",
      boxShadow:"0 4px 20px rgba(0,0,0,.15)",
    }}>

      {/* ── Brand row (emoji + name + badge + tagline) ── */}
      <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:0 }}>
        <span style={{ fontSize: isMobile ? "1.9rem" : "2.4rem", flexShrink:0 }}>{ad.emoji}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2, flexWrap:"wrap" }}>
            <span style={{ fontWeight:800, fontSize: isMobile ? "0.85rem" : "1rem", color:"#fff" }}>{ad.brand}</span>
            <span style={{ fontSize:"0.6rem", fontWeight:700, background:"rgba(255,255,255,.22)", color:"#fff", borderRadius:6, padding:"2px 6px", flexShrink:0 }}>{ad.badge}</span>
          </div>
          <div style={{ color:"rgba(255,255,255,.95)", fontWeight:700, fontSize: isMobile ? "0.8rem" : "0.92rem", lineHeight:1.3 }}>{ad.tagline}</div>
          {/* sub-text only visible inline on desktop */}
          {!isMobile && <div style={{ color:"rgba(255,255,255,.7)", fontSize:"0.76rem", marginTop:2 }}>{ad.sub}</div>}
        </div>
      </div>

      {/* ── Sub-text row (mobile only) ── */}
      {isMobile && (
        <div style={{ color:"rgba(255,255,255,.78)", fontSize:"0.73rem", lineHeight:1.45 }}>{ad.sub}</div>
      )}

      {/* ── CTA + dots row ── */}
      <div style={{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent: isMobile ? "space-between" : "flex-end",
        gap:12,
        flexShrink:0,
        // on desktop, stack CTA above dots
        ...(isMobile ? {} : { flexDirection:"column", alignItems:"flex-end", gap:10 }),
      }}>
        <button
          onClick={() => onNavigate(ad.page)}
          style={{
            background:"rgba(255,255,255,.2)",
            border:"1.5px solid rgba(255,255,255,.5)",
            color:"#fff",
            borderRadius:20,
            padding: isMobile ? "8px 18px" : "6px 14px",
            fontSize: isMobile ? "0.8rem" : "0.76rem",
            fontWeight:700,
            cursor:"pointer",
            whiteSpace:"nowrap",
            backdropFilter:"blur(4px)",
            transition:"background .18s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.35)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
        >
          {ad.cta} →
        </button>
        <div style={{ display:"flex", gap:5, alignItems:"center" }}>
          {ADS.map((_, i) => (
            <div
              key={i}
              onClick={() => setIdx(i)}
              style={{ width:i===idx?18:5, height:5, borderRadius:3, background:i===idx?"rgba(255,255,255,.9)":"rgba(255,255,255,.35)", cursor:"pointer", transition:"all .3s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AI Suggestions ─────────────────────────────────────────────────────────────
function AISuggestions({ cart, onAdd }) {
  const cartIds = Object.keys(cart).map(Number);
  if (!cartIds.length) return null;
  const suggestSet = new Set();
  cartIds.forEach(id=>{ (SUGGEST_MAP[id]||DEFAULT_SUGGESTS).forEach(s=>{ if(!cart[s]) suggestSet.add(s); }); });
  const suggestions = [...suggestSet].slice(0,3).map(id=>MENU_ITEMS.find(m=>m.id===id)).filter(Boolean);
  if (!suggestions.length) return null;
  const reason = cartIds.includes(9)?"Goes great with Biryani 🍗":cartIds.includes(2)?"Popular with Pav Bhaji":cartIds.some(id=>[19,21,20,22,23].includes(id))?"Snack to pair with your drink":"People also ordered";
  return (
    <div style={{ background:"linear-gradient(135deg,#fff7ed,#fffbf5)", border:"1.5px solid #fed7aa", borderRadius:16, padding:"16px 18px", marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <span style={{ fontSize:"1.1rem" }}>🤖</span>
        <div><div style={{ fontWeight:800, fontSize:"0.88rem", color:"#ea580c" }}>AI Suggests</div><div style={{ fontSize:"0.74rem", color:"#9a6520" }}>{reason}</div></div>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {suggestions.map(item=>(
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid #fed7aa", borderRadius:12, padding:"8px 12px", flex:1, minWidth:140 }}>
            <div style={{ width:36, height:36, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
              <FoodImg item={item} style={{ width:36, height:36, objectFit:"cover" }} width={36} height={36} />
            </div>
            <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, fontSize:"0.82rem", color:"#1a1a1a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.name}</div><div style={{ fontSize:"0.72rem", color:"#ea580c", fontWeight:700 }}>₹{item.price}</div></div>
            <button onClick={()=>onAdd(item)} style={{ background:"#ea580c", color:"#fff", border:"none", borderRadius:8, padding:"4px 10px", fontSize:"0.75rem", fontWeight:700, cursor:"pointer", flexShrink:0 }}>+ Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Order Confirmation ─────────────────────────────────────────────────────────
function OrderConfirmation({ token, items, total, prepTime, onBack }) {
  const [method,setMethod]=useState(null), [utrInput,setUtrInput]=useState(""), [utrError,setUtrError]=useState(""), [paid,setPaid]=useState(false);
  const upiUri = buildUpiUri(total, token);
  const handleUtrSubmit=()=>{ const val=utrInput.trim(); if(!/^\d{12}$/.test(val)){setUtrError("Enter a valid 12-digit UTR from your payment app");return;} setUtrError(""); setPaid(true); };
  return (
    <div style={{ minHeight:"100vh", background:"#02030a", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
      <div style={{ background:"#0d0f1a", border:"1px solid #1e2235", borderRadius:24, padding:"36px 32px", maxWidth:500, width:"100%", boxShadow:"0 0 60px rgba(249,115,22,.15)", textAlign:"center" }}>
        <div style={{ fontSize:"2.2rem", marginBottom:8 }}>🎉</div>
        <div style={{ color:"rgba(226,232,255,.45)", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>Order Confirmed</div>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:"clamp(2.4rem,8vw,3.6rem)", fontWeight:900, background:"linear-gradient(90deg,#f97316,#fbbf24)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.12em", lineHeight:1.1, margin:"6px 0 8px" }}>#{token}</div>
        <div style={{ color:"rgba(226,232,255,.5)", fontSize:"0.82rem", marginBottom:12 }}>Your token number — show this at the counter</div>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.3)", borderRadius:20, padding:"6px 16px", marginBottom:16 }}><span>⏱</span><span style={{ color:"#22c55e", fontWeight:700, fontSize:"0.88rem" }}>Ready in ~{prepTime} min</span></div>
        <div style={{ marginBottom:20 }}>{items.map(it=><span key={it.id} style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(249,115,22,.1)", border:"1px solid rgba(249,115,22,.2)", borderRadius:20, padding:"4px 11px", fontSize:"0.78rem", color:"#f97316", fontWeight:600, margin:"3px" }}>{it.name} ×{it.qty}</span>)}</div>
        <div style={{ background:"#131629", borderRadius:16, padding:20, textAlign:"left" }}>
          <div style={{ fontWeight:800, fontSize:"0.9rem", color:"rgba(226,232,255,.7)", marginBottom:14 }}>💳 Pay ₹{total}</div>
          {["cod","upi"].map(m=>(
            <div key={m} onClick={()=>{ if(!paid){setMethod(m);setUtrInput("");setUtrError("");} }} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:11, cursor:paid?"default":"pointer", marginBottom:8, border:method===m?"2px solid #f97316":"1px solid #1e2235", background:method===m?"rgba(249,115,22,.08)":"transparent", transition:"all .15s", opacity:paid&&method!==m?0.4:1 }}>
              <span style={{ fontSize:"1.4rem", width:34, textAlign:"center" }}>{m==="cod"?"💵":"📱"}</span>
              <div><div style={{ fontWeight:700, fontSize:"0.92rem", color:"#e2e8ff" }}>{m==="cod"?"Cash on Delivery":"UPI Payment"}</div><div style={{ fontSize:"0.76rem", color:"rgba(226,232,255,.4)", marginTop:2 }}>{m==="cod"?`Pay ₹${total} cash when you collect`:"GPay · PhonePe · Paytm · any UPI app"}</div></div>
              {method===m&&<span style={{ marginLeft:"auto", color:"#f97316" }}>✓</span>}
            </div>
          ))}
          {method==="upi"&&!paid&&(
            <div style={{ marginTop:8 }}>
              <div style={{ textAlign:"center", marginBottom:12 }}>
                <div style={{ color:"rgba(226,232,255,.4)", fontSize:"0.76rem", marginBottom:10 }}>Scan to pay <span style={{ color:"#22c55e", fontWeight:700 }}>₹{total}</span></div>
                <div style={{ background:"#fff", borderRadius:14, padding:14, display:"inline-block", boxShadow:"0 4px 24px rgba(249,115,22,.2)" }}><QRCodeSVG value={upiUri} size={170} level="H" fgColor="#1a1a1a" includeMargin={false} /></div>
                <div style={{ color:"rgba(226,232,255,.25)", fontSize:"0.7rem", marginTop:6 }}>UPI: <span style={{ color:"#fbbf24", fontWeight:700 }}>{UPI_ID}</span> · Ref: #{token}</div>
              </div>
              <div style={{ background:"#0d0f1a", border:"1px solid #1e2235", borderRadius:12, padding:16 }}>
                <div style={{ fontWeight:700, fontSize:"0.82rem", color:"rgba(226,232,255,.6)", marginBottom:4 }}>🔐 Enter UTR to confirm payment</div>
                <div style={{ fontSize:"0.72rem", color:"rgba(226,232,255,.35)", marginBottom:10 }}>Find the 12-digit UTR in your GPay / PhonePe / Paytm receipt after paying</div>
                <input type="text" maxLength={12} placeholder="e.g. 426891234567" value={utrInput} onChange={e=>{ setUtrInput(e.target.value.replace(/\D/g,"")); setUtrError(""); }} style={{ width:"100%", padding:"10px 14px", borderRadius:9, border:utrError?"1.5px solid #ef4444":"1.5px solid #2a2d3e", background:"#131629", color:"#e2e8ff", fontSize:"0.92rem", fontFamily:"'Orbitron',monospace", letterSpacing:"0.08em", outline:"none", boxSizing:"border-box" }} />
                {utrError&&<div style={{ color:"#ef4444", fontSize:"0.72rem", marginTop:6 }}>{utrError}</div>}
                <button onClick={handleUtrSubmit} style={{ width:"100%", padding:11, marginTop:10, background:utrInput.length===12?"linear-gradient(135deg,#f97316,#ef4444)":"#1e2235", color:utrInput.length===12?"#fff":"rgba(226,232,255,.3)", border:"none", borderRadius:9, fontWeight:800, fontSize:"0.88rem", cursor:utrInput.length===12?"pointer":"not-allowed", transition:"all .2s" }}>✅ Verify & Confirm Payment</button>
              </div>
            </div>
          )}
          {method==="cod"&&!paid&&<button onClick={()=>setPaid(true)} style={{ width:"100%", padding:13, marginTop:14, background:"linear-gradient(135deg,#f97316,#ef4444)", color:"#fff", border:"none", borderRadius:11, fontWeight:800, fontSize:"0.95rem", cursor:"pointer" }}>✅ Confirm — I'll Pay Cash at Counter</button>}
          {paid&&(
            <div style={{ textAlign:"center", marginTop:12 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.3)", borderRadius:20, padding:"8px 18px", fontSize:"0.84rem", color:"#22c55e", fontWeight:700 }}>✅ {method==="cod"?"Confirmed — Pay cash at pickup":`Payment Verified · UTR: ${utrInput}`}</div>
              {method==="upi"&&<div style={{ color:"rgba(226,232,255,.3)", fontSize:"0.72rem", marginTop:6 }}>UTR <span style={{ color:"#fbbf24", fontWeight:700, fontFamily:"'Orbitron',monospace" }}>{utrInput}</span> recorded</div>}
              <div style={{ color:"rgba(226,232,255,.3)", fontSize:"0.75rem", marginTop:8 }}>Show token <span style={{ color:"#fbbf24", fontWeight:700 }}>#{token}</span> at the counter</div>
            </div>
          )}
        </div>
        <button onClick={onBack} style={{ marginTop:20, background:"transparent", border:"1px solid #1e2235", color:"rgba(226,232,255,.4)", padding:"9px 22px", borderRadius:10, cursor:"pointer", fontSize:"0.83rem", fontWeight:600 }}>← Back to Menu</button>
      </div>
    </div>
  );
}

// ── Main Menu ──────────────────────────────────────────────────────────────────
export default function Menu({ setActivePage = () => {} }) {
  const [category,setCategory]=useState("All"), [search,setSearch]=useState(""), [cart,setCart]=useState({}), [vegOnly,setVegOnly]=useState(false), [showCart,setShowCart]=useState(false), [addedId,setAddedId]=useState(null), [orderData,setOrderData]=useState(null);
  const cartPanelRef=useRef(null), cartFabRef=useRef(null), cardRefs=useRef([]);

  const filtered = MENU_ITEMS.filter(item=>{ const mc=category==="All"||item.cat===category; const ms=item.name.toLowerCase().includes(search.toLowerCase())||item.desc.toLowerCase().includes(search.toLowerCase()); const mv=!vegOnly||item.veg; return mc&&ms&&mv; });
  const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
  const cartTotal=Object.entries(cart).reduce((sum,[id,qty])=>{ const item=MENU_ITEMS.find(m=>m.id===Number(id)); return sum+(item?.price??0)*qty; },0);
  const cartItems=Object.entries(cart).map(([id,qty])=>{ const item=MENU_ITEMS.find(m=>m.id===Number(id)); return item?{...item,qty}:null; }).filter(Boolean);
  const maxPrep=cartItems.length?Math.max(...cartItems.map(i=>parseInt(i.time))):0;

  useEffect(()=>{ const els=cardRefs.current.filter(Boolean); gsap.fromTo(els,{y:20,opacity:0},{y:0,opacity:1,stagger:0.05,duration:0.38,ease:"power2.out",clearProps:"all"}); },[category,search,vegOnly]);
  useEffect(()=>{ if(!cartPanelRef.current)return; gsap.to(cartPanelRef.current,{x:showCart?0:"100%",duration:0.36,ease:showCart?"power2.out":"power2.in"}); },[showCart]);

  const addToCart=(item)=>{ setCart(prev=>({...prev,[item.id]:(prev[item.id]||0)+1})); setAddedId(item.id); setTimeout(()=>setAddedId(null),900); if(cartFabRef.current) gsap.fromTo(cartFabRef.current,{scale:1.3},{scale:1,duration:0.4,ease:"elastic.out(1,0.4)"}); };
  const changeQty=(id,delta)=>{ setCart(prev=>{ const next={...prev,[id]:(prev[id]||0)+delta}; if(next[id]<=0) delete next[id]; return next; }); };
  const handleCheckout=()=>{ if(!cartItems.length)return; setOrderData({token:genToken(),items:cartItems,total:cartTotal,prepTime:maxPrep}); setShowCart(false); };

  if(orderData) return <OrderConfirmation {...orderData} onBack={()=>{ setOrderData(null); setCart({}); }} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        :root{ --saffron:#ea580c; --saffron-d:#c2410c; --saffron-lt:#fed7aa; --saffron-bg:#fff7ed; --green:#16a34a; --green-d:#15803d; --green-lt:#bbf7d0; --green-bg:#f0fdf4; --cream:#fffbf5; --white:#ffffff; --ink:#1a1a1a; --ink-2:#4b4b4b; --ink-3:#8a8a8a; --border:#e8e0d4; --red:#ef4444; }
        .mn-root{ min-height:100vh; background:var(--cream); font-family:'DM Sans',sans-serif; color:var(--ink); }
        .mn-root::before{ content:''; position:fixed; inset:0; pointer-events:none; z-index:0; background-image:radial-gradient(circle,rgba(234,88,12,.07) 1px,transparent 1px); background-size:28px 28px; }
        .mn-wrap{ position:relative; z-index:1; max-width:1180px; margin:0 auto; padding:2rem 1.5rem 5rem }
        .mn-title{ font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(1.7rem,4vw,2.5rem); color:var(--ink); letter-spacing:-.03em; line-height:1.1; }
        .mn-title em{ color:var(--saffron); font-style:normal }
        .mn-sub{ font-size:.92rem; color:var(--ink-3); margin-top:.4rem; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .mn-sub-pill{ display:inline-flex; align-items:center; gap:4px; font-size:.75rem; font-weight:600; padding:3px 10px; border-radius:20px; background:var(--green-bg); color:var(--green); border:1px solid var(--green-lt); }
        .mn-controls{ display:flex; gap:10px; margin-bottom:1.2rem; align-items:center; flex-wrap:wrap }
        .mn-search-wrap{ flex:1; min-width:200px; position:relative }
        .mn-search-ico{ position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:14px; opacity:.4 }
        .mn-search{ width:100%; padding:10px 12px 10px 36px; border-radius:12px; background:var(--white); border:1.5px solid var(--border); color:var(--ink); font-size:.88rem; font-family:'DM Sans',sans-serif; outline:none; transition:border-color .2s,box-shadow .2s; }
        .mn-search:focus{ border-color:var(--saffron); box-shadow:0 0 0 3px rgba(234,88,12,.08) }
        .mn-search::placeholder{ color:var(--ink-3) }
        .mn-veg{ display:flex; align-items:center; gap:7px; padding:8px 14px; border-radius:12px; cursor:pointer; background:var(--white); border:1.5px solid var(--border); font-size:.82rem; font-weight:500; color:var(--ink-2); transition:all .2s; white-space:nowrap; user-select:none; }
        .mn-veg.on{ border-color:var(--green); color:var(--green); background:var(--green-bg); }
        .veg-indicator{ width:12px; height:12px; border-radius:3px; border:1.5px solid currentColor; position:relative; flex-shrink:0 }
        .veg-indicator::after{ content:''; position:absolute; inset:2px; border-radius:1px; background:currentColor; opacity:0; transition:opacity .2s }
        .mn-veg.on .veg-indicator::after{ opacity:1 }
        .mn-cats{ display:flex; gap:8px; margin-bottom:1.4rem; flex-wrap:wrap }
        .mn-cat{ padding:8px 18px; border-radius:24px; border:1.5px solid var(--border); font-size:.8rem; font-weight:500; cursor:pointer; color:var(--ink-2); background:var(--white); transition:all .2s; white-space:nowrap; }
        .mn-cat:hover{ border-color:var(--saffron-lt); color:var(--saffron); background:var(--saffron-bg) }
        .mn-cat.act{ background:var(--saffron); border-color:var(--saffron); color:#fff; box-shadow:0 2px 10px rgba(234,88,12,.28); }
        .mn-count{ font-size:.8rem; color:var(--ink-3); margin-bottom:1rem }
        .mn-count strong{ color:var(--saffron) }
        .mn-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(268px,1fr)); gap:16px }
        .mn-card{ background:var(--white); border:1.5px solid var(--border); border-radius:16px; overflow:hidden; transition:border-color .22s,box-shadow .22s,transform .2s; }
        .mn-card:hover{ border-color:var(--saffron-lt); box-shadow:0 8px 32px rgba(234,88,12,.1),0 2px 8px rgba(0,0,0,.06); transform:translateY(-3px); }
        .mn-card-img{ position:relative; height:165px; overflow:hidden; background:#f5f0eb }
        .mn-card-img img{ width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s ease; }
        .mn-card:hover .mn-card-img img{ transform:scale(1.06) }
        .mn-card-tag{ position:absolute; top:10px; left:10px; padding:3px 9px; border-radius:20px; font-size:.66rem; font-weight:700; background:rgba(255,255,255,.92); backdrop-filter:blur(4px); color:var(--saffron); border:1px solid var(--saffron-lt); }
        .mn-vbadge{ position:absolute; top:10px; right:10px; width:18px; height:18px; border-radius:4px; border:2px solid var(--green); background:rgba(255,255,255,.9); display:flex; align-items:center; justify-content:center; }
        .mn-vbadge .dot{ width:7px; height:7px; border-radius:50%; background:var(--green) }
        .mn-nvbadge{ position:absolute; top:10px; right:10px; width:18px; height:18px; border-radius:4px; border:2px solid var(--red); background:rgba(255,255,255,.9); display:flex; align-items:center; justify-content:center; }
        .mn-nvbadge .dot{ width:7px; height:7px; border-radius:50%; background:var(--red) }
        .mn-card-body{ padding:14px }
        .mn-card-name{ font-family:'Syne',sans-serif; font-size:.97rem; font-weight:700; color:var(--ink); margin-bottom:4px; }
        .mn-card-desc{ font-size:.74rem; color:var(--ink-3); line-height:1.5; margin-bottom:10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .mn-card-meta{ display:flex; gap:6px; margin-bottom:12px; flex-wrap:wrap; align-items:center }
        .mn-mpill{ font-size:.67rem; padding:2px 8px; border-radius:8px; font-weight:500; background:#f5f0eb; color:var(--ink-3); }
        .mn-rating{ display:flex; align-items:center; gap:3px; font-size:.72rem; color:#d97706; font-weight:700 }
        .mn-card-foot{ display:flex; align-items:center; justify-content:space-between }
        .mn-price{ font-family:'Syne',sans-serif; font-size:1.05rem; font-weight:700; color:var(--saffron) }
        .mn-price span{ font-size:.68rem; font-weight:400; color:var(--ink-3); margin-right:1px }
        .mn-add{ padding:7px 16px; border-radius:9px; border:none; cursor:pointer; background:var(--saffron); color:#fff; font-size:.78rem; font-weight:600; font-family:'DM Sans',sans-serif; transition:background .18s,transform .12s; }
        .mn-add:hover{ background:var(--saffron-d); transform:translateY(-1px) }
        .mn-add.done{ background:var(--green) }
        .mn-qty{ display:flex; align-items:center; }
        .mn-qbtn{ width:30px; height:30px; border-radius:9px; border:1.5px solid var(--border); background:var(--white); color:var(--ink); font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; font-weight:600; }
        .mn-qbtn:hover{ border-color:var(--saffron); color:var(--saffron); background:var(--saffron-bg) }
        .mn-qnum{ width:30px; text-align:center; font-size:.88rem; font-weight:700; color:var(--ink) }
        .mn-empty{ grid-column:1/-1; text-align:center; padding:5rem 0; color:var(--ink-3) }
        .mn-fab{ position:fixed; bottom:2rem; right:2rem; z-index:500; display:flex; align-items:center; gap:10px; padding:12px 20px; border-radius:50px; border:none; cursor:pointer; background:var(--saffron); color:#fff; font-family:'DM Sans',sans-serif; font-size:.88rem; font-weight:600; box-shadow:0 4px 20px rgba(234,88,12,.38); transition:background .18s; will-change:transform; }
        .mn-fab:hover{ background:var(--saffron-d) }
        .mn-fab-count{ width:22px; height:22px; border-radius:50%; background:#fff; color:var(--saffron); font-size:.72rem; font-weight:800; display:flex; align-items:center; justify-content:center; }
        .mn-overlay{ position:fixed; inset:0; background:rgba(26,26,26,.45); z-index:600; backdrop-filter:blur(3px) }
        .mn-cart{ position:fixed; top:0; right:0; height:100%; width:min(400px,100vw); background:var(--white); border-left:1.5px solid var(--border); z-index:700; display:flex; flex-direction:column; transform:translateX(100%); box-shadow:-8px 0 40px rgba(0,0,0,.1); }
        .mn-cart-hd{ display:flex; align-items:center; justify-content:space-between; padding:1.2rem 1.4rem; border-bottom:1.5px solid var(--border); }
        .mn-cart-title{ font-family:'Syne',sans-serif; font-size:1.05rem; font-weight:800; color:var(--ink) }
        .mn-cart-title em{ color:var(--saffron); font-style:normal }
        .mn-cart-close{ width:32px; height:32px; border-radius:9px; border:1.5px solid var(--border); background:transparent; color:var(--ink-2); cursor:pointer; font-size:.95rem; display:flex; align-items:center; justify-content:center; transition:all .18s; }
        .mn-cart-close:hover{ border-color:var(--saffron); color:var(--saffron) }
        .mn-cart-items{ flex:1; overflow-y:auto; padding:1rem 1.4rem }
        .mn-ci{ display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
        .mn-ci-img{ width:54px; height:54px; border-radius:10px; object-fit:cover; flex-shrink:0; background:#f5f0eb; overflow:hidden; }
        .mn-ci-info{ flex:1; min-width:0 }
        .mn-ci-name{ font-size:.88rem; font-weight:600; color:var(--ink) }
        .mn-ci-price{ font-size:.78rem; color:var(--saffron); font-weight:600; margin-top:2px }
        .mn-ci-qty{ display:flex; align-items:center; gap:5px }
        .mn-ci-qb{ width:24px; height:24px; border-radius:7px; border:1.5px solid var(--border); background:var(--white); color:var(--ink); font-size:.9rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
        .mn-ci-qb:hover{ border-color:var(--saffron); color:var(--saffron) }
        .mn-ci-qn{ width:22px; text-align:center; font-size:.82rem; font-weight:700 }
        .mn-cart-ft{ padding:1.2rem 1.4rem; border-top:1.5px solid var(--border) }
        .mn-prep-note{ font-size:.78rem; color:var(--green-d); background:var(--green-bg); border:1px solid var(--green-lt); border-radius:8px; padding:6px 10px; margin-bottom:.8rem; text-align:center; }
        .mn-cart-total{ display:flex; justify-content:space-between; align-items:center; margin-bottom:.8rem }
        .mn-ct-label{ font-size:.88rem; color:var(--ink-3) }
        .mn-ct-val{ font-family:'Syne',sans-serif; font-size:1.2rem; font-weight:800; color:var(--ink) }
        .mn-checkout{ width:100%; padding:14px; border-radius:12px; border:none; cursor:pointer; background:var(--saffron); color:#fff; font-family:'DM Sans',sans-serif; font-size:.92rem; font-weight:700; transition:background .18s,transform .12s; }
        .mn-checkout:hover{ background:var(--saffron-d); transform:translateY(-1px) }
        .mn-cart-empty{ text-align:center; padding:3rem 0; color:var(--ink-3) }
        .mn-cart-empty .ceico{ font-size:3rem; margin-bottom:.9rem }
        @media(max-width:600px){ .mn-wrap{padding:1.2rem 1rem 5rem} .mn-grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px} .mn-fab{bottom:1.2rem;right:1.2rem;padding:10px 16px;font-size:.82rem} }
      `}</style>

      <div className="mn-root">
        <div className="mn-wrap">
          <div style={{ marginBottom:"1.5rem" }}>
            <h1 className="mn-title">Today's <em>Menu</em> 🍱</h1>
            <p className="mn-sub">
              Mumbai street flavours + campus favourites
              <span className="mn-sub-pill">✅ {MENU_ITEMS.filter(m=>m.veg).length} veg options</span>
              <span className="mn-sub-pill" style={{ color:"var(--saffron)", background:"var(--saffron-bg)", borderColor:"var(--saffron-lt)" }}>🔥 {MENU_ITEMS.length} total dishes</span>
            </p>
          </div>
          <AdBanner onNavigate={setActivePage} />
          <AISuggestions cart={cart} onAdd={addToCart} />
          <div className="mn-controls">
            <div className="mn-search-wrap">
              <span className="mn-search-ico">🔍</span>
              <input className="mn-search" placeholder="Search vada pav, biryani, chai…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <div className={`mn-veg ${vegOnly?"on":""}`} onClick={()=>setVegOnly(!vegOnly)}><div className="veg-indicator" /> Veg only</div>
          </div>
          <div className="mn-cats">{CATEGORIES.map(c=><button key={c} className={`mn-cat ${category===c?"act":""}`} onClick={()=>setCategory(c)}>{c}</button>)}</div>
          <div className="mn-count">Showing <strong>{filtered.length}</strong> dish{filtered.length!==1?"es":""}{category!=="All"&&` in ${category}`}{search&&` matching "${search}"`}</div>
          <div className="mn-grid">
            {filtered.length===0
              ? <div className="mn-empty"><div style={{fontSize:"3rem",marginBottom:"1rem"}}>🍽</div><p>No dishes found</p></div>
              : filtered.map((item,i)=><FoodCard key={item.id} item={item} qty={cart[item.id]||0} added={addedId===item.id} onAdd={()=>addToCart(item)} onInc={()=>changeQty(item.id,1)} onDec={()=>changeQty(item.id,-1)} ref={el=>{cardRefs.current[i]=el;}} />)
            }
          </div>
        </div>
        {cartCount>0&&<button className="mn-fab" ref={cartFabRef} onClick={()=>setShowCart(true)}>🛒 View Cart <span className="mn-fab-count">{cartCount}</span></button>}
        {showCart&&<div className="mn-overlay" onClick={()=>setShowCart(false)} />}
        <div className="mn-cart" ref={cartPanelRef}>
          <div className="mn-cart-hd"><span className="mn-cart-title">Your <em>Cart</em> 🛒</span><button className="mn-cart-close" onClick={()=>setShowCart(false)}>✕</button></div>
          <div className="mn-cart-items">
            {cartCount===0
              ? <div className="mn-cart-empty"><div className="ceico">🍱</div><p>Your cart is empty!</p></div>
              : <>
                  <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:12, padding:"12px 14px", marginBottom:12 }}>
                    <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#ea580c", marginBottom:8 }}>🤖 Add to your order?</div>
                    {(()=>{ const cIds=Object.keys(cart).map(Number); const ss=new Set(); cIds.forEach(id=>{(SUGGEST_MAP[id]||DEFAULT_SUGGESTS).forEach(s=>{if(!cart[s])ss.add(s);})}); return [...ss].slice(0,2).map(id=>MENU_ITEMS.find(m=>m.id===id)).filter(Boolean).map(item=>(
                      <div key={item.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <div className="mn-ci-img"><FoodImg item={item} style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>
                        <span style={{ flex:1, fontSize:"0.8rem", fontWeight:600, color:"#1a1a1a" }}>{item.name}</span>
                        <span style={{ fontSize:"0.78rem", color:"#ea580c", fontWeight:700, marginRight:6 }}>₹{item.price}</span>
                        <button onClick={()=>addToCart(item)} style={{ background:"#ea580c",color:"#fff",border:"none",borderRadius:7,padding:"3px 9px",fontSize:"0.72rem",fontWeight:700,cursor:"pointer" }}>+</button>
                      </div>
                    )); })()}
                  </div>
                  {Object.entries(cart).map(([id,qty])=>{ const item=MENU_ITEMS.find(m=>m.id===Number(id)); if(!item)return null; return (
                    <div className="mn-ci" key={id}>
                      <div className="mn-ci-img"><FoodImg item={item} style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>
                      <div className="mn-ci-info"><div className="mn-ci-name">{item.name}</div><div className="mn-ci-price">₹{item.price*qty}</div></div>
                      <div className="mn-ci-qty"><button className="mn-ci-qb" onClick={()=>changeQty(item.id,-1)}>−</button><span className="mn-ci-qn">{qty}</span><button className="mn-ci-qb" onClick={()=>changeQty(item.id,1)}>+</button></div>
                    </div>
                  ); })}
                </>
            }
          </div>
          {cartCount>0&&(
            <div className="mn-cart-ft">
              <div className="mn-prep-note">⏱ Est. ready in ~{maxPrep} min</div>
              <div className="mn-cart-total"><span className="mn-ct-label">{cartCount} item{cartCount!==1?"s":""}</span><span className="mn-ct-val">₹{cartTotal}</span></div>
              <button className="mn-checkout" onClick={handleCheckout}>⚡ Place Order — ₹{cartTotal}</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Food Card ──────────────────────────────────────────────────────────────────
const FoodCard = forwardRef(({ item, qty, added, onAdd, onInc, onDec }, ref) => (
  <div className="mn-card" ref={ref}>
    <div className="mn-card-img">
      <FoodImg item={item} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform .4s ease" }} />
      {item.tag&&<span className="mn-card-tag">{item.tag}</span>}
      {item.veg?<div className="mn-vbadge"><div className="dot"/></div>:<div className="mn-nvbadge"><div className="dot"/></div>}
    </div>
    <div className="mn-card-body">
      <div className="mn-card-name">{item.name}</div>
      <div className="mn-card-desc">{item.desc}</div>
      <div className="mn-card-meta"><span className="mn-rating">★ {item.rating}</span><span className="mn-mpill">⏱ {item.time}</span><span className="mn-mpill">🔥 {item.cal} kcal</span></div>
      <div className="mn-card-foot">
        <div className="mn-price"><span>₹</span>{item.price}</div>
        {qty===0
          ? <button className={`mn-add ${added?"done":""}`} onClick={onAdd}>{added?"✓ Added!":"+ Add"}</button>
          : <div className="mn-qty"><button className="mn-qbtn" onClick={onDec}>−</button><span className="mn-qnum">{qty}</span><button className="mn-qbtn" onClick={onInc}>+</button></div>
        }
      </div>
    </div>
  </div>
));
FoodCard.displayName = "FoodCard";