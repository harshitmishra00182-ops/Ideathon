import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const NAV_LINKS = [
  { label: "Menu",        icon: "🍽",  page: "menu"      },
  { label: "Pre-Order",   icon: "⚡",  page: "preorder"  },
  { label: "Group Order", icon: "👥",  page: "group"     },
  { label: "Nutrition",   icon: "🥗",  page: "nutrition" },
  { label: "Rewards",     icon: "🎁",  page: "rewards"   },
  { label: "Wallet",      icon: "💳",  page: "wallet"    },
];

const TICKER_ITEMS = [
  "🍱 Pre-order & skip the queue",
  "⚡ Ready in under 15 mins",
  "🎁 Earn reward points on every order",
  "💳 Campus Wallet — top up once, pay always",
  "👥 Group orders with auto bill-split",
  "🥗 Calorie tracker on every dish",
];

export default function Navbar({ activePage, setActivePage }) {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navBarRef   = useRef(null);
  const logoRef     = useRef(null);
  const logoIconRef = useRef(null);
  const linksRef    = useRef([]);
  const authRef     = useRef(null);
  const drawerRef   = useRef(null);
  const mLinksRef   = useRef([]);
  const ham1Ref     = useRef(null);
  const ham2Ref     = useRef(null);
  const ham3Ref     = useRef(null);
  const joinBtnRef  = useRef(null);
  const drawerTlRef = useRef(null);
  const openRef     = useRef(false);

  /* 1 — Mount entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(logoRef.current,   { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65 });
      tl.fromTo(linksRef.current,  { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.065 }, "-=0.4");
      tl.fromTo(authRef.current,   { x:  28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, "-=0.4");
    });
    return () => ctx.revert();
  }, []);

  /* 2 — Logo bounce on hover */
  const onLogoHover = () =>
    gsap.to(logoIconRef.current, { rotation: 14, scale: 1.12, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 });

  /* 3 — Scroll shadow */
  useEffect(() => {
    const fn = () => {
      const past = window.scrollY > 20;
      setScrolled(past);
      gsap.to(navBarRef.current, {
        boxShadow: past
          ? "0 4px 28px rgba(234,88,12,0.1), 0 1px 6px rgba(0,0,0,0.07)"
          : "0 0 0 rgba(0,0,0,0)",
        duration: 0.3,
      });
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* 4 — Drawer */
  useEffect(() => {
    gsap.set(drawerRef.current, { height: 0, opacity: 0 });
    drawerTlRef.current = gsap.timeline({ paused: true })
      .to(drawerRef.current, { height: "auto", opacity: 1, duration: 0.34, ease: "power2.out" })
      .fromTo(mLinksRef.current,
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.048, duration: 0.26, ease: "power2.out" },
        "-=0.16"
      );
    return () => drawerTlRef.current?.kill();
  }, []);

  const toggleDrawer = () => {
    const opening = !openRef.current;
    openRef.current = opening;
    setOpen(opening);
    if (opening) {
      gsap.to(ham1Ref.current, { rotation: 45,  y: 7,  duration: 0.26, ease: "power2.inOut", backgroundColor: "#ea580c" });
      gsap.to(ham2Ref.current, { opacity: 0, duration: 0.14 });
      gsap.to(ham3Ref.current, { rotation: -45, y: -7, duration: 0.26, ease: "power2.inOut", backgroundColor: "#ea580c" });
      drawerTlRef.current?.play();
    } else {
      gsap.to([ham1Ref.current, ham3Ref.current], { rotation: 0, y: 0, duration: 0.26, ease: "power2.inOut", backgroundColor: "#1a1a1a" });
      gsap.to(ham2Ref.current, { opacity: 1, duration: 0.18, delay: 0.08 });
      drawerTlRef.current?.reverse();
    }
  };

  /* 5 — Magnetic hover */
  const onLinkMouseMove = (e, el) => {
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2))  / (r.width  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    gsap.to(el, { x: dx * 4, y: dy * 2.5, duration: 0.2, ease: "power2.out" });
  };
  const onLinkLeave = (el) => {
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.38, ease: "elastic.out(1,0.5)" });
  };

  /* 6 — Join burst */
  const onJoinClick = () => {
    const btn = joinBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cols = ["#f97316", "#16a34a", "#fbbf24", "#ef4444", "#22c55e", "#fb923c"];
    for (let i = 0; i < 10; i++) {
      const d = document.createElement("div");
      d.style.cssText = `position:fixed;width:7px;height:7px;border-radius:50%;
        background:${cols[i % cols.length]};
        left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;
        pointer-events:none;z-index:9999;`;
      document.body.appendChild(d);
      const a = (i / 10) * Math.PI * 2;
      const dist = 40 + Math.random() * 28;
      gsap.to(d, {
        x: Math.cos(a) * dist, y: Math.sin(a) * dist,
        opacity: 0, scale: 0,
        duration: 0.5 + Math.random() * 0.28, ease: "power2.out",
        onComplete: () => d.remove(),
      });
    }
    gsap.fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.44, ease: "elastic.out(1,0.4)" });
  };

  const handleNavClick = (page) => {
    setActivePage(page);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne:wght@700;800&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        :root{
          --saffron:#ea580c; --saffron-d:#c2410c; --saffron-lt:#fed7aa; --saffron-bg:#fff7ed;
          --green:#16a34a;   --green-lt:#bbf7d0;  --green-bg:#f0fdf4;
          --yellow:#fbbf24;
          --cream:#fffbf5;   --white:#ffffff;
          --ink:#1a1a1a;     --ink-2:#4b4b4b;     --ink-3:#8a8a8a;
          --border:#e8e0d4;  --border-h:#d4c4b0;
        }

        .nb-root{font-family:'DM Sans',sans-serif;position:sticky;top:0;z-index:1000;width:100%}

        .nb-stripe{
          height:3px;
          background:repeating-linear-gradient(90deg,
            var(--saffron) 0,var(--saffron) 22px,
            var(--yellow) 22px,var(--yellow) 38px,
            var(--green) 38px,var(--green) 54px,
            var(--yellow) 54px,var(--yellow) 70px
          );
          background-size:70px 3px;
          animation:stripe-move 1.8s linear infinite;
        }
        @keyframes stripe-move{from{background-position:0 0}to{background-position:70px 0}}

        .nb-bar{
          background:var(--cream);
          border-bottom:1px solid var(--border);
          transition:background .3s;
        }
        .nb-bar.scrolled{background:rgba(255,251,245,.97);backdrop-filter:blur(14px)}

        .nb-inner{
          display:flex;align-items:center;justify-content:space-between;
          padding:0 1.5rem;height:62px;
          max-width:1280px;margin:0 auto;
        }

        .nb-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;opacity:0;cursor:pointer}
        .nb-logo-icon{
          width:40px;height:40px;border-radius:12px;background:var(--saffron);
          display:flex;align-items:center;justify-content:center;font-size:21px;
          flex-shrink:0;box-shadow:0 2px 10px rgba(234,88,12,.28);
          will-change:transform;cursor:pointer;
        }
        .nb-logo-name{font-family:'Syne',sans-serif;font-weight:800;font-size:1.18rem;
          color:var(--ink);letter-spacing:-.02em;white-space:nowrap;line-height:1.1}
        .nb-logo-name em{color:var(--saffron);font-style:normal}
        .nb-logo-badge{
          display:inline-block;margin-top:2px;
          font-size:.5rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
          color:var(--green);background:var(--green-bg);
          border:1px solid var(--green-lt);border-radius:4px;padding:1px 5px;
        }

        .nb-links{display:flex;align-items:center;gap:1px;list-style:none}
        @media(max-width:920px){.nb-links{display:none}}

        .nb-link{
          position:relative;padding:7px 12px;border-radius:10px;
          text-decoration:none;font-size:.81rem;font-weight:500;
          color:var(--ink-2);transition:color .18s,background .18s;
          cursor:pointer;display:flex;align-items:center;gap:5px;
          white-space:nowrap;border:none;background:transparent;
          opacity:0;will-change:transform;
        }
        .nb-link .lico{font-size:13px;transition:transform .2s}
        .nb-link:hover{color:var(--saffron);background:var(--saffron-bg)}
        .nb-link:hover .lico{transform:scale(1.22) rotate(-5deg)}
        .nb-link.act{color:var(--saffron);background:var(--saffron-bg);font-weight:600}
        .nb-link::after{
          content:'';position:absolute;bottom:4px;left:50%;right:50%;
          height:2px;background:var(--saffron);border-radius:2px;
          transition:left .22s,right .22s;
        }
        .nb-link.act::after{left:18%;right:18%}
        .nb-link:hover::after{left:24%;right:24%}

        .nb-auth{display:flex;align-items:center;gap:8px;flex-shrink:0;opacity:0}
        @media(max-width:920px){.nb-auth{display:none}}

        .btn-signin{
          padding:7px 16px;border-radius:10px;font-size:.8rem;font-weight:500;
          font-family:'DM Sans',sans-serif;cursor:pointer;color:var(--ink-2);
          border:1.5px solid var(--border);background:transparent;transition:all .18s;
        }
        .btn-signin:hover{border-color:var(--saffron);color:var(--saffron);background:var(--saffron-bg)}

        .btn-join{
          padding:8px 20px;border-radius:10px;font-size:.82rem;font-weight:600;
          font-family:'DM Sans',sans-serif;cursor:pointer;border:none;
          background:var(--saffron);color:#fff;
          box-shadow:0 2px 10px rgba(234,88,12,.28);
          transition:background .18s,box-shadow .18s,transform .12s;
          will-change:transform;white-space:nowrap;
        }
        .btn-join:hover{background:var(--saffron-d);box-shadow:0 4px 18px rgba(234,88,12,.38);transform:translateY(-1px)}

        .nb-ham{
          display:none;flex-direction:column;gap:5px;
          background:transparent;border:none;cursor:pointer;
          padding:6px;border-radius:8px;
        }
        @media(max-width:920px){.nb-ham{display:flex}}
        .ham-ln{
          display:block;width:22px;height:2.5px;background:var(--ink);
          border-radius:2px;transform-origin:center;will-change:transform;
        }

        .nb-drawer{
          overflow:hidden;height:0;opacity:0;
          background:var(--cream);
          border-top:1px solid var(--border);
          border-bottom:3px solid var(--saffron-lt);
        }
        .nb-drawer-inner{padding:.9rem 1.25rem 1.25rem;display:flex;flex-direction:column;gap:3px}

        .nb-mlink{
          display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:10px;
          text-decoration:none;font-size:.9rem;font-weight:500;color:var(--ink-2);
          transition:background .18s,color .18s;cursor:pointer;border:none;
          background:transparent;width:100%;text-align:left;
          opacity:0;will-change:transform;
        }
        .nb-mlink:hover,.nb-mlink.act{background:var(--saffron-bg);color:var(--saffron)}
        .nb-mlink .lico{font-size:16px;width:22px;text-align:center}

        .nb-mdivider{height:1px;background:var(--border);margin:8px 0}
        .nb-mauth{display:flex;gap:8px;padding-top:4px}
        .nb-mauth .btn-signin,.nb-mauth .btn-join{flex:1;padding:10px;text-align:center;font-size:.86rem}

        .nb-ticker{
          background:var(--green);overflow:hidden;height:28px;
          display:flex;align-items:center;
        }
        .nb-ticker-track{
          display:flex;animation:ticker-scroll 24s linear infinite;
          white-space:nowrap;
        }
        @keyframes ticker-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .nb-ticker-item{
          padding:0 2rem;font-size:.71rem;font-weight:600;
          color:#fff;letter-spacing:.04em;
          display:flex;align-items:center;gap:8px;
        }
        .nb-ticker-sep{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.45);flex-shrink:0}
      `}</style>

      <nav className="nb-root">
        <div className="nb-stripe" />

        <div className={`nb-bar ${scrolled ? "scrolled" : ""}`} ref={navBarRef}>
          <div className="nb-inner">

            <a className="nb-logo" ref={logoRef} onClick={() => handleNavClick('menu')}>
              <div className="nb-logo-icon" ref={logoIconRef} onMouseEnter={onLogoHover}>🍱</div>
              <div>
                <div className="nb-logo-name">Campus<em>Bite</em></div>
                <span className="nb-logo-badge">DMCE · Est. 2024</span>
              </div>
            </a>

            <ul className="nb-links">
              {NAV_LINKS.map((l, i) => (
                <li key={l.label}>
                  <a
                    className={`nb-link ${activePage === l.page ? "act" : ""}`}
                    ref={(el) => { linksRef.current[i] = el; }}
                    onClick={() => handleNavClick(l.page)}
                    onMouseMove={(e) => onLinkMouseMove(e, linksRef.current[i])}
                    onMouseLeave={() => onLinkLeave(linksRef.current[i])}
                  >
                    <span className="lico">{l.icon}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="nb-auth" ref={authRef}>
              <button className="btn-signin">Sign in</button>
              <button className="btn-join" ref={joinBtnRef} onClick={onJoinClick}>
                Join Free 🎉
              </button>
            </div>

            <button className="nb-ham" onClick={toggleDrawer}
              aria-label="Toggle menu" aria-expanded={open}>
              <span className="ham-ln" ref={ham1Ref} />
              <span className="ham-ln" ref={ham2Ref} />
              <span className="ham-ln" ref={ham3Ref} />
            </button>
          </div>
        </div>

        <div className="nb-drawer" ref={drawerRef} aria-hidden={!open}>
          <div className="nb-drawer-inner">
            {NAV_LINKS.map((l, i) => (
              <a key={l.label}
                className={`nb-mlink ${activePage === l.page ? "act" : ""}`}
                ref={(el) => { mLinksRef.current[i] = el; }}
                onClick={() => { handleNavClick(l.page); toggleDrawer(); }}
              >
                <span className="lico">{l.icon}</span>
                {l.label}
              </a>
            ))}
            <div className="nb-mdivider" />
            <div className="nb-mauth">
              <button className="btn-signin">Sign in</button>
              <button className="btn-join" onClick={onJoinClick}>Join Free 🎉</button>
            </div>
          </div>
        </div>

        <div className="nb-ticker">
          <div className="nb-ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span className="nb-ticker-item" key={i}>
                {i > 0 && <span className="nb-ticker-sep" />}
                {t}
              </span>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}