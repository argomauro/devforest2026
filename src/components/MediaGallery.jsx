import React, { useState, useEffect } from 'react';

const PHOTOS_BASE = [
  { url: "/assets/slide-1.jpg" },
  { url: "/assets/slide-2.jpg" },
  { url: "/assets/slide-3.jpg" },
  { url: "/assets/slide-4.jpg" },
  { url: "/assets/slide-5.jpg" },
  { url: "/assets/slide-6.jpg" },
];

export default function MediaGallery({ t }) {
  const [lightbox, setLb] = useState(null);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const PHOTOS = PHOTOS_BASE.map((p, i) => ({
    ...p,
    cap: t?.gallery?.photos?.[i] || ""
  }));
  const length = PHOTOS.length;

  const nextSlide = () => setCurrent((c) => (c === length - 1 ? 0 : c + 1));
  const prevSlide = () => setCurrent((c) => (c === 0 ? length - 1 : c - 1));

  // Autoplay
  useEffect(() => {
    if (isHovered || lightbox !== null) return;
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [isHovered, lightbox]);

  return (
    <>
      <div 
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          aspectRatio: "16/9",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
          backgroundColor: "#060A0E"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Immagini in Fade */}
        {PHOTOS.map((ph, idx) => (
          <div 
            key={idx}
            style={{
              position: "absolute",
              inset: 0,
              opacity: current === idx ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              zIndex: current === idx ? 1 : 0,
              cursor: "zoom-in"
            }}
            onClick={() => setLb(idx)}
          >
            <img
              src={ph.url}
              alt={ph.cap}
              loading={idx === 0 ? "eager" : "lazy"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
            {/* Gradiente nero e caption */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              padding: "2rem 1.5rem 1.5rem",
              display: "flex",
              alignItems: "flex-end"
            }}>
              <p style={{ margin: 0, color: "#fff", fontWeight: 600, fontSize: "clamp(0.9rem, 2vw, 1.1rem)", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                {ph.cap}
              </p>
            </div>
          </div>
        ))}

        {/* Frecce overlay */}
        <button 
          onClick={prevSlide}
          style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            background: "rgba(13,17,23,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%",
            width: 44, height: 44, cursor: "pointer", color: "#fff", fontSize: "1.2rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)", zIndex: 10,
            opacity: isHovered ? 1 : 0, transition: "opacity 0.3s"
          }}>❮</button>
        <button 
          onClick={nextSlide}
          style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            background: "rgba(13,17,23,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%",
            width: 44, height: 44, cursor: "pointer", color: "#fff", fontSize: "1.2rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)", zIndex: 10,
            opacity: isHovered ? 1 : 0, transition: "opacity 0.3s"
          }}>❯</button>

        {/* Dots */}
        <div style={{
          position: "absolute", bottom: 16, right: 24,
          display: "flex", gap: 8, zIndex: 10
        }}>
          {PHOTOS.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrent(idx)}
              style={{
                width: current === idx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: current === idx ? "#4285F4" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      </div>

      {/* ── LIGHTBOX (Modal Fullscreen) ── */}
      {lightbox !== null && (
        <div 
          onClick={() => setLb(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out"
          }}>
          <img 
            src={PHOTOS[lightbox].url} 
            alt={PHOTOS[lightbox].cap}
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: "95vw", maxHeight: "90vh", 
              borderRadius: 8, boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              objectFit: "contain"
            }} 
          />
          {/* Lightbox Caption */}
          <div style={{ position: "absolute", bottom: 40, color: "#fff", fontSize: "1.1rem", background: "rgba(0,0,0,0.6)", padding: "8px 16px", borderRadius: 8 }}>
            {PHOTOS[lightbox].cap}
          </div>
          {/* Lightbox Close */}
          <button onClick={() => setLb(null)} style={{
            position: "absolute", top: 24, right: 24,
            background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
            width: 48, height: 48, cursor: "pointer", color: "#fff", fontSize: "1.4rem"
          }}>✕</button>
          {/* Lightbox Prev */}
          <button onClick={e => { e.stopPropagation(); setLb((lightbox - 1 + length) % length); }}
            style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 56, height: 56, cursor: "pointer", color: "#fff", fontSize: "1.8rem" }}>❮</button>
          {/* Lightbox Next */}
          <button onClick={e => { e.stopPropagation(); setLb((lightbox + 1) % length); }}
            style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 56, height: 56, cursor: "pointer", color: "#fff", fontSize: "1.8rem" }}>❯</button>
        </div>
      )}
    </>
  );
}
