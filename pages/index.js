import Head from "next/head";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import Header from "../components/Header";
import data from "../data/portfolio.json";

// ─── Text scramble hook ───────────────────────────────────────────────────────
function useTextScramble(text, delay = 0) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let frame = 0;
    const totalFrames = 22;
    let raf;

    const timer = setTimeout(() => {
      const run = () => {
        frame++;
        setDisplay(
          text
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i < (frame / totalFrames) * text.length) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        if (frame < totalFrames) {
          raf = requestAnimationFrame(run);
        } else {
          setDisplay(text);
        }
      };
      raf = requestAnimationFrame(run);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  return display;
}

// ─── Social icons ─────────────────────────────────────────────────────────────
const ICONS = {
  Github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="square" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
};

function SocialIcon({ social }) {
  return (
    <a
      href={social.link}
      target={social.title !== "Email" ? "_blank" : undefined}
      rel="noopener noreferrer"
      title={social.title}
      className="w-9 h-9 border border-white/30 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-colors duration-200"
    >
      {ICONS[social.title] ?? (
        <span className="text-xs">{social.title.slice(0, 2).toUpperCase()}</span>
      )}
    </a>
  );
}

// ─── Category card (magnetic) ─────────────────────────────────────────────────
function CategoryCard({ category, onHover, onLeave }) {
  const ref = useRef();

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.09;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.09;
    gsap.to(el, { x, y, duration: 0.3, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    onLeave();
  }, [onLeave]);

  return (
    <Link href={`/projects?category=${category.id}`} className="flex-1 flex">
      <div
        ref={ref}
        className="flex-1 flex items-center px-10 laptop:px-16 cursor-pointer border-b border-white/10 last:border-b-0 hover:bg-white hover:text-black transition-colors duration-200 group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => onHover(category.id)}
      >
        <span className="text-xl laptop:text-2xl font-light tracking-widest uppercase">
          {category.label}
        </span>
        <span className="ml-auto text-xs text-gray-400 group-hover:text-gray-600 tracking-widest">
          {String(category.projectIds.length).padStart(2, "0")} →
        </span>
      </div>
    </Link>
  );
}

// ─── Org card ─────────────────────────────────────────────────────────────────
function OrgCard({ org, onHover, onLeave }) {
  return (
    <div
      className="border-r border-b border-gray-200 p-6 laptop:p-8 cursor-default group transition-colors duration-150 hover:bg-gray-50"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <h3 className="text-base laptop:text-lg font-semibold mb-3">{org.name}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{org.tags}</p>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredOrg, setHoveredOrg] = useState(null);

  const heroLeftRef = useRef();
  const heroRightRef = useRef();
  const didInit = useRef(false);

  const displayName = useTextScramble(data.name, 300);

  // Entry animation
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    gsap.fromTo(
      [heroLeftRef.current, heroRightRef.current],
      { y: 90, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1, stagger: 0.14, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  // Ghost image for hovered category (first project with an image)
  const ghostImage = hoveredCategory
    ? (() => {
        const cat = data.categories.find((c) => c.id === hoveredCategory);
        if (!cat) return null;
        const proj = cat.projectIds
          .map((id) => data.projects.find((p) => p.id === id))
          .find((p) => p?.imageSrc);
        return proj?.imageSrc ?? null;
      })()
    : null;

  const hoveredOrgData = data.organizations.find((o) => o.id === hoveredOrg);

  return (
    <div className="bg-black text-white min-h-screen">
      <Head>
        <title>{data.name}</title>
      </Head>

      <Header />

      {/* ── SECTION 1: HERO ─────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        {/* Category hover ghost image */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            opacity: ghostImage ? 0.07 : 0,
            backgroundImage: ghostImage ? `url(${ghostImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(100%)",
          }}
        />

        {/* Hero: always side-by-side flex row */}
        <div className="absolute inset-0 flex">
          {/* Left: Name / bio / contacts */}
          <div
            ref={heroLeftRef}
            className="flex-1 flex items-center pl-8 laptop:pl-16 pr-8"
            style={{ opacity: 0 }}
          >
            <div>
              <p className="text-xs text-gray-400 tracking-widest mb-6">01 / INTRO</p>
              <h1 className="text-4xl laptop:text-6xl laptopl:text-7xl font-bold tracking-tight mb-4 leading-none">
                {displayName}
              </h1>
              <p className="text-base laptop:text-lg text-gray-400 mb-3 font-light">
                {data.title}
              </p>
              <p className="text-sm text-gray-400 mb-8 max-w-sm leading-relaxed">
                {data.interests}
              </p>
              <div className="flex gap-3 mb-8">
                {data.socials.map((s) => (
                  <SocialIcon key={s.id} social={s} />
                ))}
              </div>
              <a
                href="#summary"
                className="text-xs text-gray-400 hover:text-white transition-colors tracking-widest"
              >
                FULL SUMMARY ↓
              </a>
            </div>
          </div>

          {/* Right: Category cards */}
          <div
            ref={heroRightRef}
            className="w-1/2 flex flex-col border-l border-white/10"
            style={{ opacity: 0 }}
          >
            {data.categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onHover={setHoveredCategory}
                onLeave={() => setHoveredCategory(null)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: ABOUT  ─────────────────────── */}
      <section id="summary" className="bg-white text-black py-24 laptop:py-32 clip-diagonal">
        <div className="max-w-7xl px-8 laptop:px-16 mx-auto">
          <p className="text-xs text-gray-400 tracking-widest mb-10">02 / ABOUT</p>
          <h2 className="text-3xl laptop:text-5xl font-bold tracking-tight mb-12">
            Professional Summary
          </h2>
          <p className="text-lg laptop:text-2xl font-light leading-relaxed text-gray-700">
            {data.summary}
          </p>
        </div>
      </section>

      {/* ── SECTION 4: ORGANIZATIONS ─────────────────────────────── */}
      <section className="bg-white text-black py-24 laptop:py-32">
        <div className="max-w-7xl px-8 laptop:px-16 mx-auto">
          <p className="text-xs text-gray-400 tracking-widest mb-10">04 / ORGS</p>
          <h2 className="text-3xl laptop:text-5xl font-bold tracking-tight mb-16">
            Involvement
          </h2>

          <div className="grid grid-cols-2 laptop:grid-cols-4 border-l border-t border-gray-200">
            {data.organizations.map((org) => (
              <OrgCard
                key={org.id}
                org={org}
                onHover={() => setHoveredOrg(org.id)}
                onLeave={() => setHoveredOrg(null)}
              />
            ))}
          </div>

          {/* Hover detail panel */}
          <div
            className="border-l border-r border-b border-gray-200 overflow-hidden transition-all duration-300"
            style={{ maxHeight: hoveredOrgData ? "240px" : "0px", opacity: hoveredOrgData ? 1 : 0 }}
          >
            {hoveredOrgData && (
              <div className="flex bg-gray-50">
                <div className="w-44 h-44 flex-shrink-0 bg-gray-200 flex items-center justify-center border-r border-gray-200 overflow-hidden">
                  {hoveredOrgData.imageSrc ? (
                    <img
                      src={hoveredOrgData.imageSrc}
                      alt={hoveredOrgData.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <span className="text-xs text-gray-400 tracking-widest">IMG</span>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center flex-1">
                  <h4 className="text-base font-semibold mb-2">{hoveredOrgData.name}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {hoveredOrgData.description}
                  </p>
                  <p className="text-xs text-gray-400">{hoveredOrgData.impact}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="bg-black text-white py-12 px-8 laptop:px-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-xs text-gray-600 tracking-widest">{data.name.toUpperCase()}</span>
          <div className="flex gap-3">
            {data.socials.map((s) => (
              <SocialIcon key={s.id} social={s} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
