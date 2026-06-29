import { useState, useEffect, useRef, useCallback } from "react";
import MediaGallery from "./components/MediaGallery";
import { dict } from "./i18n";

/* ── GDG OFFICIAL PALETTE ─────────────────────────────────────── */
const C = {
  blue:    "#4285F4",
  red:     "#EA4335",
  yellow:  "#FBBC04",
  green:   "#34A853",
  dark:    "#0D1117",
  darker:  "#060A0E",
  surface: "#151B23",
  card:    "#1C2333",
  border:  "rgba(66,133,244,0.14)",
  text:    "#E8EDF2",
  muted:   "#8B9BB4",
  dimmed:  "rgba(232,237,242,0.55)",
};
const GDG = [C.blue, C.red, C.yellow, C.green];

/* ── METADATA ─────────────────────────────────────────────────── */
const PRESS_META = [
  { url:"https://www.rainews.it/tgr/basilicata/notiziari/video/2026/06/TGR-Basilicata-del-28062026-ore-1400-f8010208-78c9-461b-925a-a7c857c1568c.html", color:C.red, icon:"📺", date:"28/06" },
  { url:"https://www.ansa.it/basilicata/notizie/2026/06/27/devfest-basilicata-a-tito-realizzata-una-serra-hi-tech_872d7025-3705-43b5-9fa3-c97fc10ad674.html", color:C.blue, icon:"📰", date:"27/06" },
  { url:"https://www.antennasud.com/tito-la-tecnologia-a-servizio-dellambiente-grazie-al-devfest-basilicata-2026/", color:C.green, icon:"📡", date:"28/06" },
  { url:"https://ufficiostampabasilicata.it/2026/06/28/tito-la-tecnologia-a-servizio-dellambiente-grazie-al-devfest-basilicata-2026/", color:C.yellow, icon:"🗞️", date:"28/06" },
  { url:"https://www.basilicatadigitalchannel.com/news/interviste/26847-devfest-basilicata-2026-la-tecnologia-a-servizio-dellambiente.html", color:C.blue, icon:"📱", date:"27/06" },
  { url:"https://www.sassilive.it/economia/lavoro/una-serra-automatizzata-con-un-supporto-domotico-presentato-il-risultato-di-devfest-basilicata-a-tito-report-e-foto/", color:C.green, icon:"🌐", date:"28/06" },
];

const SQUADS_META = [
  { icon:"🌱", color:C.green },
  { icon:"🖨️", color:C.yellow },
  { icon:"☁️", color:C.blue },
  { icon:"📱", color:C.blue },
  { icon:"🤖", color:C.red },
  { icon:"🔥", color:C.yellow },
];

const AGENDA_META = [
  { c:C.blue },
  { c:C.green },
  { c:C.yellow },
  { c:C.red, last:true }
];

/* ── RESPONSIVE HOOK ─────────────────────────────────────────── */
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ── GDG STRIPE ─────────────────────────────────────────────── */
function GdgStripe({ height = 4 }) {
  return (
    <div style={{ display:"flex", height }}>
      {GDG.map((c,i) => <div key={i} style={{ flex:1, background:c }} />)}
    </div>
  );
}

/* ── GDG DOTS ───────────────────────────────────────────────── */
function Dots({ size=8 }) {
  return (
    <span style={{ display:"inline-flex", gap:size*0.5, alignItems:"center" }}>
      {GDG.map((c,i) => <span key={i} style={{ width:size, height:size, borderRadius:"50%", background:c, display:"inline-block" }} />)}
    </span>
  );
}

/* ── SECTION LABEL ──────────────────────────────────────────── */
function Label({ text, color=C.blue }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontFamily:"monospace", fontSize:"0.62rem", letterSpacing:"0.22em", textTransform:"uppercase", color, marginBottom:"1rem" }}>
      <span style={{ width:18, height:2, background:color, display:"inline-block" }} />
      {text}
    </div>
  );
}

/* ── MAIN ───────────────────────────────────────────────────── */
export default function DevForest() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');
  
  const iw = useWindowWidth();
  const mobile = iw < 640;
  const tablet = iw < 960;
  
  const t = dict[lang];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const sec = (bg, extra={}) => ({
    background: bg, padding: mobile ? "3.5rem 5vw" : "5rem 6vw", ...extra
  });

  return (
    <div style={{ fontFamily:"'Inter','Google Sans',system-ui,sans-serif", background:C.dark, color:C.text, overflowX:"hidden" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:${C.darker}; } ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:2px; }
        @keyframes bob { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @keyframes fadein { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav style={{
        position:"sticky", top:0, zIndex:200,
        background: scrolled ? "rgba(13,17,23,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition:"all 0.3s",
      }}>
        <GdgStripe height={3} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding: mobile ? "0.8rem 5vw" : "0.8rem 6vw" }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src="https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_80,q_100,w_80/v1/gcs/platform-data-goog/chapter_banners/Logo%20GDG%20Basilicatad%20%281%29_THF1R9j.png"
              alt="GDG Basilicata" style={{ width:32, height:32, borderRadius:6, objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
            <div>
              <div style={{ fontWeight:700, fontSize:"0.85rem", color:C.text, lineHeight:1.2 }}>GDG Basilicata</div>
              {!mobile && <div style={{ fontSize:"0.6rem", color:C.muted }}>Google Developer Groups</div>}
            </div>
          </div>

          {/* Nav Links & Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            {/* Desktop links */}
            {!mobile && (
              <div style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
                {[["#story", t.nav.event],["#gallery", t.nav.gallery],["#squads", t.nav.squads],["#press", t.nav.press]].map(([h,l]) => (
                  <a key={h} href={h} style={{ fontSize:"0.78rem", color:C.muted, textDecoration:"none", padding:"6px 12px", borderRadius:6, transition:"color 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.color=C.text} onMouseLeave={e=>e.currentTarget.style.color=C.muted}>{l}</a>
                ))}
                <a href="https://gdg.community.dev/gdg-basilicata/" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:"0.75rem", color:C.blue, textDecoration:"none", padding:"6px 14px", borderRadius:6, border:`1px solid ${C.blue}44`, marginLeft:4 }}>
                  {t.nav.community}
                </a>
              </div>
            )}

            {/* Language Toggle */}
            <div style={{ display: "flex", background: C.card, borderRadius: 6, padding: 2, border: `1px solid ${C.border}` }}>
              <button onClick={() => setLang('en')} style={{ background: lang === 'en' ? C.surface : "transparent", color: lang === 'en' ? C.text : C.muted, border: "none", borderRadius: 4, padding: "4px 8px", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer" }}>EN</button>
              <button onClick={() => setLang('it')} style={{ background: lang === 'it' ? C.surface : "transparent", color: lang === 'it' ? C.text : C.muted, border: "none", borderRadius: 4, padding: "4px 8px", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer" }}>IT</button>
            </div>

            {/* Mobile menu button */}
            {mobile && (
              <button onClick={() => setMenuOpen(!menuOpen)}
                style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"6px 10px", cursor:"pointer", fontSize:"1rem", marginLeft:"-0.5rem" }}>
                {menuOpen ? "✕" : "☰"}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobile && menuOpen && (
          <div style={{ background:C.surface, borderTop:`1px solid ${C.border}`, padding:"1rem 5vw", display:"flex", flexDirection:"column", gap:4 }}>
            {[["#story", t.nav.event],["#gallery", t.nav.gallery],["#squads", t.nav.squads],["#press", t.nav.press],["https://gdg.community.dev/gdg-basilicata/", t.nav.community]].map(([h,l]) => (
              <a key={h} href={h} onClick={() => setMenuOpen(false)} style={{ fontSize:"0.9rem", color:C.muted, textDecoration:"none", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <header style={{
        padding: mobile ? "4rem 5vw 3rem" : "6rem 6vw 5rem",
        backgroundColor: C.surface,
        position:"relative",
        borderBottom: `1px solid ${C.border}`
      }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: "3rem" }}>
          <div style={{ animation:"fadein 0.7s ease both", flex: 1 }}>
            <div style={{ fontFamily:"monospace", fontSize: mobile ? "0.6rem" : "0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.green, marginBottom:"1rem" }}>
              {t.hero.subtitle}
            </div>

            <h1 style={{
              fontWeight:800, fontSize: mobile ? "clamp(3rem,16vw,4.5rem)" : "clamp(3.5rem,8vw,6.5rem)",
              lineHeight:0.88, letterSpacing:"-0.03em", color:"#fff",
              margin:"0 0 1.5rem",
            }}>
              DevF<span style={{ color:C.yellow }}>{"{or}"}</span>est
            </h1>

            <p style={{ fontSize: mobile ? "0.95rem" : "clamp(1rem,2vw,1.25rem)", color:"rgba(255,255,255,0.68)", maxWidth:520, lineHeight:1.55, margin:"0 0 2.5rem" }} dangerouslySetInnerHTML={{ __html: t.hero.desc1 + "<br />" + t.hero.desc2 }} />

            <div style={{ display:"flex", gap: mobile ? "1.5rem" : "2.5rem", flexWrap:"wrap" }}>
              {[
                { l: t.hero.lblLocation, v: t.hero.dateLocation.split(" · ")[1] || "Tito (PZ)", c: C.blue },
                { l: t.hero.lblDate, v: t.hero.dateLocation.split(" · ")[0] || "2026", c: C.red },
                { l: t.hero.lblProject, v: t.hero.valProject,  c: C.green },
              ].map(({l,v,c}) => (
                <div key={l}>
                  <div style={{ fontFamily:"monospace", fontSize:"0.55rem", letterSpacing:"0.18em", textTransform:"uppercase", color:c, marginBottom:4 }}>{l}</div>
                  <div style={{ fontWeight:600, fontSize: mobile ? "0.85rem" : "0.9rem", color:"#fff" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background:C.dark,
            border:`1px solid ${C.border}`, borderRadius:14,
            padding:"1.5rem", display:"flex", flexDirection:"column", gap:7, minWidth:240,
            animation:"fadein 0.6s ease 0.3s both",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}>
            <Dots size={9} />
            <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:4 }}>{t.hero.badgeTitle}</div>
            <div style={{ fontWeight:700, fontSize:"1rem", color:C.text }}>DevFest Basilicata</div>
            <div style={{ fontFamily:"monospace", fontSize:"0.62rem", color:C.blue }}>{t.hero.dateLocation}</div>
          </div>
        </div>
      </header>

      {/* ── STORY ────────────────────────────────────────── */}
      <section id="story" style={sec(C.dark)}>
        <div style={{ maxWidth:1160, margin:"0 auto", display:"grid", gridTemplateColumns: tablet ? "1fr" : "1fr 1fr", gap: tablet ? "3rem" : "5rem", alignItems:"center" }}>
          <div>
            <Label text={t.story.label} color={C.green} />
            <h2 style={{ fontWeight:700, fontSize: mobile ? "2rem" : "clamp(2rem,4vw,3.2rem)", color:C.text, lineHeight:1.1, letterSpacing:"-0.02em", marginBottom:"1.5rem" }} dangerouslySetInnerHTML={{ __html: t.story.title }} />
            <p style={{ color:C.muted, lineHeight:1.75, marginBottom:"1rem", fontSize:"0.96rem" }}>{t.story.p1}</p>
            <p style={{ color:C.muted, lineHeight:1.75, marginBottom:"2rem", fontSize:"0.96rem" }}>{t.story.p2}</p>
            {/* Quote */}
            <div style={{ borderLeft:`3px solid ${C.yellow}`, padding:"1.1rem 1.4rem", background:C.yellow+"08", borderRadius:"0 10px 10px 0" }}>
              <blockquote style={{ margin:0, fontStyle:"italic", color:C.text, lineHeight:1.65, fontSize:"0.92rem" }}>
                "Abbiamo sperimentato cosa significa non solo progettare, ma costruire qualcosa di reale — con stampa 3D, sensoristica, cloud e app mobile per monitorare la pianta."
              </blockquote>
              <cite style={{ display:"block", marginTop:10, fontFamily:"monospace", fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.yellow, fontStyle:"normal" }}>
                Maurizio Argoneto — GDG Lead & Organizer
              </cite>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.8rem" }}>
              {[
                { n:"1",   l:"giornata intera all'aperto",      c:C.blue },
                { n:"6",   l:"squad tecniche multidisciplinari", c:C.green },
                { n:"3ª",  l:"edizione del DevFest Basilicata",  c:C.yellow },
                { n:"308", l:"membri della community GDG",        c:C.red },
              ].map(({n,l,c}) => (
                <div key={l} style={{ padding:"1.2rem", borderRadius:10, border:`1px solid ${c}28`, background:c+"0A", textAlign:"center" }}>
                  <div style={{ fontWeight:700, fontSize: mobile ? "2rem" : "2.4rem", color:c, lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:"0.72rem", color:C.muted, marginTop:5, lineHeight:1.4 }}>{l}</div>
                </div>
              ))}
            </div>
            {/* GDG badge */}
            <div style={{ border:`1px solid ${C.border}`, borderRadius:12, padding:"1.2rem 1.4rem", background:C.card, display:"flex", alignItems:"center", gap:"1rem" }}>
              <img src="https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_80,q_100,w_80/v1/gcs/platform-data-goog/chapter_banners/Logo%20GDG%20Basilicatad%20%281%29_THF1R9j.png"
                alt="GDG Basilicata" style={{ width:52, height:52, borderRadius:8, objectFit:"cover", flexShrink:0 }} />
              <div>
                <div style={{ fontWeight:700, color:C.text, marginBottom:4 }}>GDG Basilicata</div>
                <div style={{ fontSize:"0.78rem", color:C.muted, lineHeight:1.5 }}>
                  Comunità di sviluppatori e appassionati tech che promuove la condivisione di conoscenze attraverso eventi, workshop e meetup.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────── */}
      <section id="gallery" style={sec(C.surface)}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <Label text={t.gallery.label} color={C.red} />
          <h2 style={{ fontWeight:700, fontSize: mobile ? "1.9rem" : "clamp(1.9rem,3.5vw,2.8rem)", color:C.text, letterSpacing:"-0.02em", marginBottom:"2rem", lineHeight:1.1 }}>
            Rivivilo nelle foto
          </h2>
          <MediaGallery t={t} />
        </div>
      </section>

      {/* ── SQUADS ───────────────────────────────────────── */}
      <section id="squads" style={sec(C.dark)}>
        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          <Label text={t.tech.label} color={C.blue} />
          <h2 style={{ fontWeight:700, fontSize: mobile ? "1.9rem" : "clamp(1.9rem,3.5vw,2.8rem)", color:C.text, letterSpacing:"-0.02em", marginBottom:"2rem", lineHeight:1.1 }}>
            {t.tech.title}
          </h2>
          <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : tablet ? "1fr 1fr" : "repeat(3,1fr)", gap:"1rem" }}>
            {t.tech.squads.map((s, idx) => {
              const meta = SQUADS_META[idx];
              const [hov, setH] = useState(false);
              return (
                <div key={s.name} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
                  style={{ borderRadius:12, padding:"1.5rem", background: hov ? C.card : C.surface+"80", border:`1px solid ${hov ? meta.color+"44" : C.border}`, borderTop:`3px solid ${hov ? meta.color : "transparent"}`, transition:"all 0.2s" }}>
                  <div style={{ fontSize:"1.7rem", marginBottom:"0.8rem" }}>{meta.icon}</div>
                  <div style={{ fontWeight:700, fontSize:"0.96rem", color:C.text, marginBottom:"0.3rem" }}>{s.name}</div>
                  <div style={{ fontFamily:"monospace", fontSize:"0.6rem", color:meta.color, letterSpacing:"0.08em", marginBottom:"0.75rem" }}>{s.tech}</div>
                  <p style={{ fontSize:"0.8rem", color:C.muted, lineHeight:1.6, margin:0 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────── */}
      <section style={sec(C.surface)}>
        <div style={{ maxWidth: mobile ? "100%" : 700, margin:"0 auto" }}>
          <Label text={t.agenda.label} color={C.yellow} />
          <h2 style={{ fontWeight:700, fontSize: mobile ? "1.9rem" : "clamp(1.9rem,3.5vw,2.8rem)", color:C.text, letterSpacing:"-0.02em", marginBottom:"2.5rem", lineHeight:1.1 }}>
            {t.agenda.title}
          </h2>
          {t.agenda.items.map((item, idx) => {
            const meta = AGENDA_META[idx];
            return (
            <div key={item.t} style={{ display:"flex", gap:mobile ? "1rem" : "1.5rem", paddingBottom: meta.last ? 0 : "2rem" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ width:12, height:12, borderRadius:"50%", background:meta.c, border:`2px solid ${C.surface}`, flexShrink:0, marginTop:3 }} />
                {!meta.last && <div style={{ width:1, flex:1, background:`${meta.c}33`, marginTop:6 }} />}
              </div>
              <div style={{ paddingBottom: meta.last ? 0 : "0.5rem" }}>
                <div style={{ fontFamily:"monospace", fontSize:"0.58rem", color:meta.c, letterSpacing:"0.15em", marginBottom:4 }}>{item.t}</div>
                <div style={{ fontWeight:700, color:C.text, fontSize:"0.96rem", marginBottom:5 }}>{item.title}</div>
                <p style={{ margin:0, fontSize:"0.82rem", color:C.muted, lineHeight:1.58 }}>{item.desc}</p>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* ── VIDEO ────────────────────────────────────────── */}
      <section style={sec(C.dark)}>
        <div style={{ maxWidth:880, margin:"0 auto" }}>
          <Label text={t.video.label} color={C.green} />
          <h2 style={{ fontWeight:700, fontSize: mobile ? "1.9rem" : "clamp(1.9rem,3.5vw,2.8rem)", color:C.text, letterSpacing:"-0.02em", marginBottom:"2rem", lineHeight:1.1 }}>
            {t.video.title}
          </h2>
          <div style={{ position:"relative", paddingBottom:"56.25%", height:0, overflow:"hidden", borderRadius:14, border:`1px solid ${C.border}`, marginBottom:"1rem" }}>
            <iframe src="https://www.youtube.com/embed/BHt10OcWvjM" title="DevFest Basilicata 2026"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
              style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" }} />
          </div>
          <p style={{ fontFamily:"monospace", fontSize:"0.62rem", color:C.muted, letterSpacing:"0.1em", marginBottom:"1.5rem" }}>📺 Servizio Antenna Sud — 28 Giugno 2026</p>
        </div>
      </section>

      {/* ── PRESS ────────────────────────────────────────── */}
      <section id="press" style={sec(C.surface)}>
        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          <Label text={t.press.label} color={C.yellow} />
          <h2 style={{ fontWeight:700, fontSize: mobile ? "1.9rem" : "clamp(1.9rem,3.5vw,2.8rem)", color:C.text, letterSpacing:"-0.02em", marginBottom:"2rem", lineHeight:1.1 }}>
            {t.press.title}
          </h2>
          <div style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : tablet ? "1fr 1fr" : "repeat(3,1fr)", gap:"1rem" }}>
            {t.press.items.map((p, idx) => {
              const meta = PRESS_META[idx];
              const [hov, setH] = useState(false);
              return (
                <a key={p.outlet} href={meta.url} target="_blank" rel="noopener noreferrer"
                  onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
                  style={{ display:"flex", flexDirection:"column", gap:"0.75rem", padding:"1.4rem", borderRadius:12, textDecoration:"none",
                    background: hov ? C.card : C.surface+"80", border:`1px solid ${hov ? meta.color+"55" : C.border}`, borderLeft:`3px solid ${meta.color}`, transition:"all 0.2s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ fontFamily:"monospace", fontSize:"0.58rem", letterSpacing:"0.14em", textTransform:"uppercase", color:meta.color }}>
                      {meta.icon} {p.outlet}
                    </div>
                    <div style={{ fontFamily:"monospace", fontSize:"0.56rem", color:C.muted }}>{meta.date}</div>
                  </div>
                  <p style={{ margin:0, fontSize:"0.86rem", color: hov ? C.text : C.dimmed, lineHeight:1.45, fontWeight:500 }}>{p.title}</p>
                  <div style={{ fontSize:"0.72rem", color:meta.color, marginTop:"auto" }}>↗ {lang === 'en' ? 'read more' : 'leggi'}</div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ ...sec(C.dark), textAlign:"center" }}>
        <div style={{ maxWidth:580, margin:"0 auto" }}>
          <Dots size={10} />
          <h2 style={{ fontWeight:700, fontSize: mobile ? "1.9rem" : "clamp(1.9rem,3.5vw,2.6rem)", color:C.text, margin:"1.2rem 0 0.8rem", letterSpacing:"-0.02em", lineHeight:1.15 }}>
            {t.cta.title}
          </h2>
          <p style={{ color:C.muted, fontSize:"0.96rem", lineHeight:1.65, marginBottom:"2.5rem" }}>
            {t.cta.desc}
          </p>
          <div style={{ display:"flex", gap:"0.9rem", justifyContent:"center", flexWrap:"wrap" }}>
            <a href="https://gdg.community.dev/gdg-basilicata/" target="_blank" rel="noopener noreferrer"
              style={{ padding: mobile ? "0.85rem 1.6rem" : "0.9rem 2rem", borderRadius:8, background:C.blue, color:"#fff", textDecoration:"none", fontWeight:600, fontSize:"0.88rem" }}>
              {t.cta.btn1}
            </a>
            <a href="https://photos.app.goo.gl/CaaBZZs4EinE2pr89" target="_blank" rel="noopener noreferrer"
              style={{ padding: mobile ? "0.85rem 1.6rem" : "0.9rem 2rem", borderRadius:8, border:`1px solid ${C.border}`, color:C.muted, textDecoration:"none", fontWeight:600, fontSize:"0.88rem" }}>
              {t.cta.btn2}
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{ background:C.darker, borderTop:`1px solid ${C.border}` }}>
        <GdgStripe height={3} />
        <div style={{ padding: mobile ? "1.5rem 5vw" : "2rem 6vw", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src="https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_80,q_100,w_80/v1/gcs/platform-data-goog/chapter_banners/Logo%20GDG%20Basilicatad%20%281%29_THF1R9j.png"
              alt="GDG Basilicata" style={{ width:28, height:28, borderRadius:5, objectFit:"cover" }} />
            <div style={{ fontWeight:700, fontSize:"0.85rem", color:C.text }}>GDG Basilicata</div>
          </div>
          <div style={{ display:"flex", gap:"1.2rem", flexWrap:"wrap" }}>
            {[["https://gdg.community.dev/gdg-basilicata/","Community"],["https://www.facebook.com/gdgbasilicata","Facebook"],["https://www.instagram.com/gdg_basilicata","Instagram"],["http://www.pignolalug.it/","PLUG"]].map(([h,l]) => (
              <a key={h} href={h} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily:"monospace", fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.muted, textDecoration:"none" }}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{ textAlign:"center", padding:"0 6vw 1.5rem", fontSize:"0.68rem", color:C.muted+"66" }}>
          DevF{"{or}"}est Basilicata 2026 · {lang === 'en' ? 'Organized by' : 'Organizzato da'} GDG Basilicata / PLUG · Tito (PZ), 27 Giugno 2026
        </div>
      </footer>
    </div>
  );
}
