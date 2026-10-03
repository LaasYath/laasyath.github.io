import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Header from "../components/Header";
import data from "../data/portfolio.json";

// ─── Icons ────────────────────────────────────────────────────────────────────
const GridIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <rect x="1" y="1" width="6" height="6" />
    <rect x="9" y="1" width="6" height="6" />
    <rect x="1" y="9" width="6" height="6" />
    <rect x="9" y="9" width="6" height="6" />
  </svg>
);

// ─── Project drawer ────────────────────────────────────────────────────────────
function ProjectDrawer({ project, onClose }) {
  if (!project) return null;
  return (
    <div className="w-full h-full border-l border-white/15 overflow-y-auto bg-black">
      <div className="p-8">
        <button onClick={onClose} aria-label="Close"
          className="mb-8 text-white/50 hover:text-white transition-colors text-2xl leading-none block">
          ×
        </button>
        <div className="h-44 bg-zinc-950 mb-6 overflow-hidden relative">
          {project.imageSrc ? (
            <img src={project.imageSrc} alt={project.title}
              className="w-full h-full object-cover transition-all duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs text-zinc-800 tracking-widest">NO IMAGE</span>
            </div>
          )}
          {project.placeholder && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="border border-white/20 px-3 py-1 text-xs text-white/40 tracking-widest">
                IN PROGRESS
              </span>
            </div>
          )}
        </div>
        <h2 className="text-lg font-bold mb-3 leading-snug">{project.title}</h2>
        <p className="text-sm text-gray-300 leading-relaxed mb-6">{project.description}</p>
        {project.techStack.length > 0 && (
          <div className="mb-6">
            <span className="text-xs text-gray-400 tracking-widest block mb-3">TECH STACK</span>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <span key={t} className="border border-amber-500/30 bg-amber-500/[0.07] px-2 py-0.5 text-xs text-amber-300">{t}</span>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          {project.coursework ? (
            <span className="text-xs text-gray-500 tracking-widest">COURSEWORK</span>
          ) : project.physicalServer ? (
            <span className="text-xs text-gray-500 tracking-widest">PHYSICAL SERVER</span>
          ) : (
            <>
              {project.presentationUrl && (
                <a href={project.presentationUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-300 hover:text-white transition-colors">DEMO →</a>
              )}
              {project.presentationUrl && project.githubUrl && (
                <span className="text-xs text-white/20">|</span>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-300 hover:text-white transition-colors">GITHUB →</a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Grid filters ──────────────────────────────────────────────────────────────
const FILTERS = [
  {
    label: "Python",
    test: (t) => t === "python",
  },
  {
    label: "Java",
    test: (t) => t === "java",
  },
  {
    label: "C / C++",
    test: (t) => t === "c" || t === "c++" || t === "c/c++",
  },
  {
    label: "React",
    test: (t) => t === "react" || t === "next.js" || t === "react native",
  },
  {
    label: "Databases",
    test: (t) =>
      ["sql", "drizzle", "back4app", "parse", "phpmyadmin", "mongodb",
       "postgresql", "mysql", "firebase", "airtable"].includes(t),
  },
  {
    label: "Cloud",
    test: (t) =>
      ["back4app", "parse", "solana", "aws", "gcp", "azure", "vercel",
       "netlify", "cloud"].includes(t) || t.includes("api"),
  },
  {
    label: "Security",
    test: (t) =>
      ["networking", "cisco", "vlans", "firewalls", "acls", "siem",
       "log analysis", "linux"].includes(t) ||
      t.includes("security") || t.includes("crypt"),
  },
];

function projectMatchesFilter(project, filterLabel) {
  const filter = FILTERS.find((f) => f.label === filterLabel);
  if (!filter) return false;
  return project.techStack.some((tech) => filter.test(tech.toLowerCase()));
}

// ─── Grid view ─────────────────────────────────────────────────────────────────
function GridView({ projects, onProjectClick, activeProjectId, categoryLabel, onClearCategory }) {
  const [activeFilters, setActiveFilters] = useState(new Set());

  const toggleFilter = (label) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const visible =
    activeFilters.size === 0
      ? projects
      : projects.filter((p) =>
          [...activeFilters].some((label) => projectMatchesFilter(p, label))
        );

  return (
    <div className="flex-1 overflow-y-auto px-8 laptop:px-16 py-12">
      {categoryLabel && (
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold tracking-tight uppercase">{categoryLabel}</h2>
          <button
            onClick={onClearCategory}
            className="text-xs text-gray-400 border border-white/20 hover:border-white hover:text-white transition-colors tracking-widest px-3 py-1"
          >
            × ALL PROJECTS
          </button>
        </div>
      )}
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map(({ label }) => {
          const active = activeFilters.has(label);
          return (
            <button
              key={label}
              onClick={() => toggleFilter(label)}
              className={`border px-4 py-2 text-xs tracking-widest uppercase transition-colors duration-150
                ${active
                  ? "border-white bg-white text-black"
                  : "border-white/30 text-white hover:border-white hover:bg-white/10"
                }`}
            >
              {label}
            </button>
          );
        })}
        {activeFilters.size > 0 && (
          <button
            onClick={() => setActiveFilters(new Set())}
            className="border border-white/15 px-4 py-2 text-xs tracking-widest uppercase text-gray-600 hover:border-white/40 hover:text-gray-400 transition-colors duration-150"
          >
            CLEAR
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-5">
        {visible.length === 0 && (
          <div className="col-span-3 py-20 text-center text-xs text-gray-700 tracking-widest">
            NO PROJECTS MATCH SELECTED FILTERS
          </div>
        )}
        {visible.map((project) => {
          const isActive = activeProjectId === project.id;
          return (
            <div
              key={project.id}
              onClick={() => onProjectClick(project)}
              className={`border cursor-pointer flex flex-col transition-colors duration-150
                ${isActive ? "border-white" : "border-white/20 hover:border-white/50"}
                ${project.placeholder ? "opacity-50" : ""}`}
            >
              <div className="h-40 bg-zinc-950 relative flex-shrink-0 overflow-hidden">
                {project.imageSrc ? (
                  <img src={project.imageSrc} alt={project.title}
                    className="w-full h-full object-cover transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-zinc-800 text-xs tracking-widest">NO IMAGE</span>
                  </div>
                )}
                {project.placeholder && (
                  <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                    <span className="border border-white/20 px-3 py-1 text-xs text-white/40 tracking-widest">
                      IN PROGRESS
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-semibold mb-2 leading-snug">{project.title}</h3>
                <p className="text-xs text-gray-300 mb-4 leading-relaxed flex-1">{project.description}</p>
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((t) => (
                      <span key={t} className="border border-amber-500/30 bg-amber-500/[0.07] px-2 py-0.5 text-xs text-amber-300">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  {project.coursework ? (
                    <span className="text-xs text-gray-500 tracking-widest">COURSEWORK</span>
                  ) : (
                    <>
                      {project.presentationUrl && (
                        <a href={project.presentationUrl} target="_blank" rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-gray-300 hover:text-white transition-colors">DEMO →</a>
                      )}
                      {project.presentationUrl && project.githubUrl && (
                        <span className="text-xs text-white/20">|</span>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-gray-300 hover:text-white transition-colors">GITHUB →</a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Radial mind map ───────────────────────────────────────────────────────────
const CAT_ANGLES = [
  -Math.PI / 4,
   Math.PI / 4,
   (3 * Math.PI) / 4,
  -(3 * Math.PI) / 4,
];

const SPREAD_STEP = Math.PI / 5.5;

function computeLayout(w, h, categories, projects, activeCatId) {
  const cx = w / 2;
  const cy = h / 2;
  const base = Math.min(w, h);
  const CAT_R = base * 0.24;
  const PROJ_R_FOCUSED = base * 0.40;
  const PROJ_R_ALL = base * 0.44;
  const expanded = activeCatId !== null;
  // Constrain each category's project spread to fit within its sector in the all-view
  const MAX_SPREAD_ALL = ((2 * Math.PI) / categories.length) * 0.68;

  const layout = categories.map((cat, ci) => {
    const catAngle = CAT_ANGLES[ci];
    const isActive = expanded && cat.id === activeCatId;
    const catX = isActive ? cx : cx + CAT_R * Math.cos(catAngle);
    const catY = isActive ? cy : cy + CAT_R * Math.sin(catAngle);

    const catProjects = cat.projectIds
      .map((id) => projects.find((p) => p.id === id))
      .filter(Boolean);

    const n = catProjects.length;
    const rawSpread = n > 1 ? (n - 1) * SPREAD_STEP : 0;
    const spread = isActive ? rawSpread : Math.min(rawSpread, MAX_SPREAD_ALL);
    const projR = isActive ? PROJ_R_FOCUSED : PROJ_R_ALL;

    const projLayout = catProjects.map((proj, pi) => {
      const t = n === 1 ? 0 : pi / (n - 1);
      const angle = catAngle - spread / 2 + t * spread;
      return {
        project: proj,
        x: cx + projR * Math.cos(angle),
        y: cy + projR * Math.sin(angle),
      };
    });

    return { category: cat, x: catX, y: catY, projects: projLayout };
  });

  return { cx, cy, layout };
}

function MindMap({ categories, projects, onProjectClick, activeProjectId }) {
  const containerRef = useRef();
  const [dims, setDims] = useState({ w: 900, h: 600 });
  const [activeCatId, setActiveCatId] = useState(null);
  const [projVisible, setProjVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setDims({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const transition = useCallback((newCatId) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setProjVisible(false);
    timerRef.current = setTimeout(() => {
      setActiveCatId(newCatId);
      timerRef.current = setTimeout(() => setProjVisible(true), 60);
    }, 220);
  }, []);

  const handleCatClick = useCallback((catId) => {
    transition(activeCatId === catId ? null : catId);
  }, [activeCatId, transition]);

  const handleBack = useCallback(() => transition(null), [transition]);

  const expanded = activeCatId !== null;

  const { cx, cy, layout } = useMemo(
    () => computeLayout(dims.w, dims.h, categories, projects, activeCatId),
    [dims, categories, projects, activeCatId]
  );

  const POS_EASE = "cubic-bezier(0.4,0,0.2,1)";

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none">
      {/* Back button — visible only when a category is focused */}
      <div
        className="absolute top-4 left-4 z-20 transition-opacity duration-300"
        style={{ opacity: expanded ? 1 : 0, pointerEvents: expanded ? "auto" : "none" }}
      >
        <button
          onClick={handleBack}
          className="text-xs text-gray-400 border border-white/20 hover:border-white hover:text-white transition-colors tracking-widest px-3 py-1.5"
        >
          ← ALL PROJECTS
        </button>
      </div>

      {/* SVG spokes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {layout.map((cl) => {
          const isActive = cl.category.id === activeCatId;
          const isInactive = expanded && !isActive;
          return (
            <g key={cl.category.id} style={{ opacity: isInactive ? 0 : 1, transition: "opacity 0.3s ease" }}>
              {!isActive && (
                <line x1={cx} y1={cy} x2={cl.x} y2={cl.y}
                  stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              )}
              {cl.projects.map(({ project, x, y }) => (
                <line key={project.id}
                  x1={cl.x} y1={cl.y} x2={x} y2={y}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1"
                  style={{ opacity: projVisible ? 1 : 0, transition: "opacity 0.25s ease" }}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Center "PROJECTS" label — visible only in default (all) state */}
      <div
        className="absolute z-10 pointer-events-none font-bold tracking-widest uppercase text-center"
        style={{
          left: cx,
          top: cy,
          transform: "translate(-50%,-50%)",
          padding: "14px 28px",
          fontSize: "14px",
          background: "#fff",
          color: "#000",
          border: "1px solid #fff",
          whiteSpace: "nowrap",
          opacity: expanded ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        PROJECTS
      </div>

      {/* Category + project nodes */}
      {layout.map((cl) => {
        const isCatActive = cl.category.id === activeCatId;
        const isInactive = expanded && !isCatActive;
        const showProjects = !expanded || isCatActive;

        return (
          <div key={cl.category.id}>
            <button
              onClick={() => handleCatClick(cl.category.id)}
              className="absolute tracking-widest uppercase text-center whitespace-nowrap z-10 border"
              style={{
                left: cl.x,
                top: cl.y,
                transform: "translate(-50%,-50%)",
                padding: isCatActive ? "14px 32px" : "10px 20px",
                fontSize: isCatActive ? "15px" : "12px",
                background: isCatActive ? "#fff" : "transparent",
                color: isCatActive ? "#000" : "#fff",
                borderColor: isCatActive ? "#fff" : "rgba(255,255,255,0.5)",
                opacity: isInactive ? 0 : 1,
                pointerEvents: isInactive ? "none" : "auto",
                transition: `left 0.4s ${POS_EASE}, top 0.4s ${POS_EASE}, padding 0.4s ${POS_EASE}, font-size 0.4s ${POS_EASE}, opacity 0.3s ease, background 0.25s ease, color 0.25s ease`,
              }}
            >
              {cl.category.label}
            </button>

            {cl.projects.map(({ project, x, y }, pi) => {
              const isActiveProj = activeProjectId === project.id;
              return (
                <button
                  key={project.id}
                  onClick={() => onProjectClick(project)}
                  className={`absolute text-center border leading-snug z-10
                    ${isActiveProj
                      ? "border-white bg-white text-black"
                      : project.placeholder
                      ? "border-white/20 text-gray-500 hover:border-white/40 hover:text-gray-300"
                      : "border-white/40 text-white hover:border-white hover:bg-white/10"
                    }`}
                  style={{
                    left: x,
                    top: y,
                    transform: "translate(-50%,-50%)",
                    width: expanded ? 152 : 110,
                    padding: expanded ? "10px 14px" : "7px 10px",
                    fontSize: expanded ? "13px" : "11px",
                    opacity: showProjects && projVisible ? 1 : 0,
                    pointerEvents: showProjects && projVisible ? "auto" : "none",
                    transition: `left 0.4s ${POS_EASE}, top 0.4s ${POS_EASE}, opacity 0.3s ease ${expanded ? pi * 45 : 0}ms, width 0.35s ease, padding 0.35s ease, font-size 0.35s ease`,
                  }}
                >
                  <span style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {project.title}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Projects() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("interactive"); // "interactive" | "fullmap" | "grid"
  const [activeProject, setActiveProject] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [drawerWidth, setDrawerWidth] = useState(460);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  useEffect(() => {
    if (!router.isReady) return;
    const cat = router.query.category;
    if (cat) {
      const found = data.categories.find((c) => c.id === cat);
      if (found) {
        setCategoryFilter(found);
        setViewMode("grid");
      }
    }
  }, [router.isReady, router.query.category]);

  const toggleGrid = () =>
    setViewMode((prev) => (prev === "grid" ? "interactive" : "grid"));

  const startResize = useCallback((e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = drawerWidth;
    e.preventDefault();
  }, [drawerWidth]);

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX;
      setDrawerWidth(Math.max(300, Math.min(800, dragStartWidth.current + delta)));
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const handleProjectClick = (project) => {
    setActiveProject((prev) => (prev?.id === project.id ? null : project));
  };

  const showMindMap = viewMode !== "grid";

  const gridProjects = categoryFilter
    ? categoryFilter.projectIds.map((id) => data.projects.find((p) => p.id === id)).filter(Boolean)
    : data.projects;

  return (
    <div className="bg-black text-white min-h-screen">
      <Head><title>Projects — {data.name}</title></Head>
      <Header isBlog={true} />

      <div className="flex overflow-hidden relative" style={{ height: "calc(100vh - 64px)" }}>
        {/* Top controls */}
        <div className="absolute top-5 right-6 z-20 flex items-center gap-3">
          <button
            onClick={toggleGrid}
            title="Grid view"
            className={`w-8 h-8 border flex items-center justify-center transition-colors duration-150
              ${viewMode === "grid"
                ? "border-white bg-white text-black"
                : "border-white/30 text-white hover:border-white hover:bg-white/10"}`}
          >
            <GridIcon />
          </button>
        </div>

        {/* Main content */}
        {showMindMap ? (
          <div className="flex-1 overflow-hidden">
            <MindMap
              categories={data.categories}
              projects={data.projects}
              onProjectClick={handleProjectClick}
              activeProjectId={activeProject?.id}
            />
          </div>
        ) : (
          <GridView
            projects={gridProjects}
            onProjectClick={handleProjectClick}
            activeProjectId={activeProject?.id}
            categoryLabel={categoryFilter?.label}
            onClearCategory={() => { setCategoryFilter(null); }}
          />
        )}

        {/* Resizable drawer */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{
            width: activeProject ? drawerWidth : 0,
            opacity: activeProject ? 1 : 0,
            transition: activeProject
              ? "opacity 0.3s ease, width 0s"
              : "opacity 0.3s ease, width 0.3s ease 0.3s",
          }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1 z-10 cursor-col-resize hover:bg-white/20 transition-colors duration-150"
            onMouseDown={startResize}
          />
          <ProjectDrawer project={activeProject} onClose={() => setActiveProject(null)} />
        </div>
      </div>
    </div>
  );
}
