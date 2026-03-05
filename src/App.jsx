import { useState, useEffect, useRef } from "react";
import "./App.css";

// ─── Utility: Intersection Observer Hook ───────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Animated Counter ──────────────────────────────────────────────────────
function Counter({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Typing Effect ─────────────────────────────────────────────────────────
function TypeWriter({ strings, speed = 80 }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = strings[idx % strings.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), 1800);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) { setDeleting(false); setIdx(i => i + 1); setCharIdx(0); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, strings, speed]);
  return <span className="typewriter">{display}<span className="cursor">|</span></span>;
}

// ─── Floating Grid Background ──────────────────────────────────────────────
function GridBackground() {
  return (
    <div className="grid-bg" aria-hidden="true">
      <div className="grid-lines" />
      <div className="grid-orb orb-1" />
      <div className="grid-orb orb-2" />
      <div className="grid-orb orb-3" />
      <div className="scanline" />
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const links = ["About", "Stack", "Projects", "DSA", "Journey", "Contact"];
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <span className="logo-bracket">&lt;</span>
        <span className="logo-name">PC</span>
        <span className="logo-bracket">/&gt;</span>
      </div>
      <ul className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
        {links.map(l => (
          <li key={l}>
            <button className="nav-link" onClick={() => scrollTo(l)}>{l}</button>
          </li>
        ))}
        <li>
          <a className="nav-cta" href="mailto:pcauthentic123@gmail.com">Hire Me</a>
        </li>
      </ul>
      <button className={`hamburger ${menuOpen ? "hamburger--open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="menu">
        <span /><span /><span />
      </button>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero" id="hero">
      <GridBackground />
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          Available for SDE Internships · 2026
        </div>
        <h1 className="hero-name">
          <span className="name-first">Priyanshu</span>
          <br />
          <span className="name-last">Chaudhary</span>
        </h1>
        <div className="hero-role">
          <TypeWriter strings={[
            "Full Stack Developer",
            "Product Builder",
            "ML Enthusiast",
            "DSA Practitioner",
          ]} />
        </div>
        <p className="hero-tagline">
          Building <em>scalable products</em> that solve real problems — <br className="br-desktop" />
          from HealthTech vaults to AI-powered career tools.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
            <span>View Projects</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="btn btn-ghost" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Contact Me
          </button>
        </div>
        <div className="hero-stats">
          {[
            { label: "Projects Built", value: 3, suffix: "+" },
            { label: "DSA Problems", value: 600, suffix: "+" },
            { label: "Tech Stack", value: 8, suffix: " tools" },
          ].map(s => (
            <div className="stat" key={s.label}>
              <span className="stat-value"><Counter end={s.value} suffix={s.suffix} /></span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="code-card">
          <div className="code-card-header">
            <span className="dot dot-red" /><span className="dot dot-yellow" /><span className="dot dot-green" />
            <span className="code-filename">portfolio.ts</span>
          </div>
          <pre className="code-body">{`const developer = {
  name: "Priyanshu Chaudhary",
  role: "Full Stack Developer",
  focus: ["Products", "Startups"],
  
  stack: {
    frontend: ["React.js"],
    backend: ["Node", "Express"],
    db: ["MongoDB"],
    lang: ["Java", "JavaScript"],
  },

  currentlyBuilding: [
    "MediVault 🏥",
    "ATS Optimizer 🤖",
    "Tree Visualizer 🌲",
  ],

  goal: "Top SDE Internship → Startup",
};`}</pre>
        </div>
      </div>
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────
function About() {
  const [ref, inView] = useInView();
  return (
    <section className="about section" id="about" ref={ref}>
      <div className={`container reveal ${inView ? "revealed" : ""}`}>
        <div className="section-label">// about me</div>
        <div className="about-grid">
          <div className="about-text">
            <h2 className="section-heading">
              Engineer by craft,<br /><span className="accent">Builder by passion</span>
            </h2>
            <p>
              I'm a 3rd-year B.Tech student who doesn't just write code — I build <strong>products with purpose</strong>.
              My journey started with curiosity and evolved into a relentless drive to solve real-world problems
              through technology.
            </p>
            <p>
              I think like a founder. Every project I take on, I ask: <em>Who does this help? How does it scale?
              What's the business impact?</em> That mindset is what separates me from developers who only
              write features.
            </p>
            <p>
              Currently deep in the HealthTech and AI space — building systems that could one day serve millions.
              I pair strong engineering fundamentals with product intuition to ship things that matter.
            </p>
            <div className="about-traits">
              {["Product Thinker", "ML Enthusiast", "DSA Practitioner", "Self-Taught Builder"].map(t => (
                <span className="trait-chip" key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="about-cards">
            {[
              { icon: "🚀", title: "Startup Mindset", desc: "I approach every project as an MVP — ship fast, iterate smart, and focus on user value." },
              { icon: "⚙️", title: "Full Stack Architect", desc: "From React UIs to Node APIs and MongoDB schemas — I own the entire product stack." },
              { icon: "🧠", title: "Algorithm Driven", desc: "600+ DSA problems. I write efficient code because I understand what happens under the hood." },
              { icon: "🌍", title: "Impact Oriented", desc: "MediVault, ATS tools — every project solves a real problem for real people at scale." },
            ].map(c => (
              <div className="about-card glass" key={c.title}>
                <span className="card-icon">{c.icon}</span>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TECH STACK ───────────────────────────────────────────────────────────
const STACK = {
  Frontend: [
    { name: "React.js", icon: "⚛️", level: 90 },
    { name: "HTML5 / CSS3", icon: "🌐", level: 92 },
    { name: "JavaScript", icon: "🟨", level: 88 },
  ],
  Backend: [
    { name: "Node.js", icon: "🟢", level: 85 },
    { name: "Express.js", icon: "🚂", level: 85 },
    { name: "REST APIs", icon: "🔗", level: 87 },
  ],
  Database: [
    { name: "MongoDB", icon: "🍃", level: 82 },
    { name: "Mongoose", icon: "📦", level: 80 },
  ],
  Languages: [
    { name: "Java", icon: "☕", level: 88 },
    { name: "JavaScript", icon: "🔥", level: 88 },
    { name: "C++", icon: "⚡", level: 72 },
  ],
  Tools: [
    { name: "Git / GitHub", icon: "🐙", level: 88 },
    { name: "VS Code", icon: "💻", level: 95 },
    { name: "Postman", icon: "📮", level: 83 },
  ],
};

function SkillBar({ level, inView }) {
  return (
    <div className="skill-bar-track">
      <div
        className="skill-bar-fill"
        style={{ width: inView ? `${level}%` : "0%" }}
      />
    </div>
  );
}

function TechStack() {
  const [ref, inView] = useInView();
  const [active, setActive] = useState("Frontend");
  return (
    <section className="stack section" id="stack" ref={ref}>
      <div className={`container reveal ${inView ? "revealed" : ""}`}>
        <div className="section-label">// tech stack</div>
        <h2 className="section-heading">Tools I <span className="accent">Build With</span></h2>
        <div className="stack-tabs">
          {Object.keys(STACK).map(cat => (
            <button
              key={cat}
              className={`stack-tab ${active === cat ? "stack-tab--active" : ""}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="stack-grid">
          {STACK[active].map((tech, i) => (
            <div className="tech-card glass" key={tech.name} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="tech-header">
                <span className="tech-icon">{tech.icon}</span>
                <span className="tech-name">{tech.name}</span>
                <span className="tech-level">{tech.level}%</span>
              </div>
              <SkillBar level={tech.level} inView={inView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "medivault",
    badge: "HealthTech Startup",
    emoji: "🏥",
    title: "MediVault",
    subtitle: "Paperless Medical Network",
    description:
      "A HealthTech platform creating a centralized, secure medical vault where hospitals upload patient reports directly. Patients own their data and share it instantly with any doctor — eliminating paper, delays, and data silos.",
    impact: "Addresses a ₹2000Cr+ problem in India's fragmented healthcare data ecosystem.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth", "REST API"],
    highlights: ["Patient-owned medical records", "Hospital integration APIs", "Role-based access control", "Secure vault architecture"],
    color: "#00d4aa",
    featured: true,
  },
  {
    id: "ats",
    badge: "AI Product",
    emoji: "🤖",
    title: "ATS Resume Optimizer",
    subtitle: "AI-Powered Career Tool",
    description:
      "An intelligent system that parses resumes against job descriptions using NLP techniques. Gives candidates an ATS match score, missing keyword analysis, impact assessment, and an overall career readiness score.",
    impact: "Helps job-seekers increase interview callbacks by optimizing for Applicant Tracking Systems.",
    tech: ["React.js", "Node.js", "NLP", "MongoDB", "Express.js", "AI/ML APIs"],
    highlights: ["ATS match scoring", "Keyword gap analysis", "Impact statement analyzer", "Career readiness dashboard"],
    color: "#7c6bff",
    featured: true,
  },
  {
    id: "visualizer",
    badge: "DSA Tool",
    emoji: "🌲",
    title: "Recursive Tree Visualizer",
    subtitle: "DSA Education Platform",
    description:
      "An interactive educational tool that takes recursive code (Java, C++, Python) as input and renders a live, animated recursion tree — making one of the hardest CS concepts visually intuitive.",
    impact: "Bridges the gap between abstract recursion theory and visual understanding for CS students.",
    tech: ["React.js", "D3.js / Canvas", "Java Parser", "Node.js", "Algorithm Engine"],
    highlights: ["Multi-language support", "Live tree animation", "Step-by-step trace", "Stack frame visualization"],
    color: "#f59e0b",
    featured: false,
  },
];

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView(0.1);
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      ref={ref}
      className={`project-card-wrap ${inView ? "revealed" : ""} ${project.featured ? "project-card-wrap--featured" : ""}`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div
        className={`project-card glass ${flipped ? "project-card--flipped" : ""}`}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        {/* Front */}
        <div className="project-front">
          <div className="project-top">
            <div className="project-badge" style={{ color: project.color, borderColor: project.color + "44", background: project.color + "11" }}>
              {project.badge}
            </div>
            {project.featured && <span className="featured-tag">★ Featured</span>}
          </div>
          <div className="project-emoji">{project.emoji}</div>
          <h3 className="project-title" style={{ color: project.color }}>{project.title}</h3>
          <p className="project-subtitle">{project.subtitle}</p>
          <p className="project-desc">{project.description}</p>
          <div className="project-tech">
            {project.tech.slice(0, 4).map(t => <span className="tech-tag" key={t}>{t}</span>)}
            {project.tech.length > 4 && <span className="tech-tag tech-tag--more">+{project.tech.length - 4}</span>}
          </div>
          <div className="project-hint">Hover for details →</div>
        </div>
        {/* Back */}
        <div className="project-back" style={{ borderColor: project.color + "33" }}>
          <h4 style={{ color: project.color }}>Key Features</h4>
          <ul className="highlight-list">
            {project.highlights.map(h => (
              <li key={h}><span className="highlight-dot" style={{ background: project.color }} />{h}</li>
            ))}
          </ul>
          <div className="impact-box" style={{ borderColor: project.color + "44", background: project.color + "0d" }}>
            <span className="impact-label">💡 Impact</span>
            <p>{project.impact}</p>
          </div>
          <div className="project-tech">
            {project.tech.map(t => <span className="tech-tag" key={t}>{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [ref, inView] = useInView();
  return (
    <section className="projects section" id="projects" ref={ref}>
      <div className="container">
        <div className={`reveal ${inView ? "revealed" : ""}`}>
          <div className="section-label">// projects</div>
          <h2 className="section-heading">Things I've <span className="accent">Built</span></h2>
          <p className="section-sub">Real products. Real problems. Real impact.</p>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => <ProjectCard project={p} index={i} key={p.id} />)}
        </div>
      </div>
    </section>
  );
}

// ─── DSA ─────────────────────────────────────────────────────────────────
const DSA_TOPICS = [
  { topic: "Arrays & Hashing", solved: 52, total: 60, color: "#00d4aa" },
  { topic: "Trees & Graphs", solved: 44, total: 55, color: "#7c6bff" },
  { topic: "Dynamic Programming", solved: 35, total: 50, color: "#f59e0b" },
  { topic: "Recursion & Backtracking", solved: 38, total: 45, color: "#ef4444" },
  { topic: "Linked Lists & Stacks", solved: 48, total: 52, color: "#06b6d4" },
  { topic: "Sorting & Searching", solved: 42, total: 45, color: "#10b981" },
];

function DSA() {
  const [ref, inView] = useInView();
  return (
    <section className="dsa section" id="dsa" ref={ref}>
      <div className={`container reveal ${inView ? "revealed" : ""}`}>
        <div className="section-label">// problem solving</div>
        <h2 className="section-heading">DSA & <span className="accent">Competitive Coding</span></h2>
        <div className="dsa-layout">
          <div className="dsa-stats">
            <div className="dsa-big-stat glass">
              <div className="dsa-number"><Counter end={600} suffix="+" /></div>
              <div className="dsa-label">Problems Solved</div>
              <div className="platform-badges">
                <a href="https://leetcode.com/u/pc_priyanshu05/" target="_blank" rel="noopener noreferrer">
                  <span className="platform-badge">LeetCode</span>
                </a>

                <a href="https://www.geeksforgeeks.org/profile/pcauthen4c9s?tab=activity" target="_blank" rel="noopener noreferrer">
                  <span className="platform-badge">GFG</span>
                </a>

                <a href="https://codeforces.com/profile/RightWinger011" target="_blank" rel="noopener noreferrer">
                  <span className="platform-badge">CodeForces</span>
                </a>
              </div>
            </div>
            <div className="dsa-info glass">
              <h4>🎯 My Approach</h4>
              <p>I don't just solve problems — I understand the <em>why</em> behind each algorithm. This deep understanding fuels my recursive tree visualizer project and makes me a better system designer.</p>
              <div className="consistency-row">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="streak-box"
                    style={{ opacity: Math.random() > 0.25 ? 1 : 0.15, background: Math.random() > 0.6 ? "#00d4aa" : Math.random() > 0.3 ? "#00d4aa88" : "#7c6bff44" }}
                  />
                ))}
              </div>
              <span className="streak-label">Last 30 days activity</span>
            </div>
          </div>
          <div className="dsa-topics">
            {DSA_TOPICS.map((t, i) => (
              <div className="topic-row" key={t.topic} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="topic-header">
                  <span className="topic-name">{t.topic}</span>
                  <span className="topic-count" style={{ color: t.color }}>{t.solved}/{t.total}</span>
                </div>
                <div className="topic-track">
                  <div
                    className="topic-fill"
                    style={{
                      width: inView ? `${(t.solved / t.total) * 100}%` : "0%",
                      background: t.color,
                      transitionDelay: `${i * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── JOURNEY ──────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: "2023",
    title: "The Spark",
    desc: "Started B.Tech. Wrote my first 'Hello World'. Fell in love with problem solving and the power of code.",
    icon: "🌱",
  },
   {
    year: "2024",
    title: "Became more DSA Focused",
    desc: "Started learning basic dsa fundamentals.",
    icon: "🚀",
  },
  {
    year: "2025",
    title: "Going Full Stack",
    desc: "Learned React, Node.js and MongoDB. Built my first full-stack CRUD app. Understood the entire request lifecycle.",
    icon: "⚡",
  },
 
  {
    year: "2026",
    title: "Learning",
    desc: "More into MERN stack and ML enthusiast,targeting SDE summer internships.",
    icon: "🏗️",
  },
];

function Journey() {
  const [ref, inView] = useInView();
  return (
    <section className="journey section" id="journey" ref={ref}>
      <div className={`container reveal ${inView ? "revealed" : ""}`}>
        <div className="section-label">// learning journey</div>
        <h2 className="section-heading">My <span className="accent">Story</span></h2>
        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div className={`timeline-item ${i % 2 === 0 ? "timeline-item--left" : "timeline-item--right"}`} key={item.year} style={{ animationDelay: `${i * 150}ms` }}>
              <div className="timeline-node">
                <span>{item.icon}</span>
              </div>
              <div className="timeline-content glass">
                <span className="timeline-year">{item.year}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
          <div className="timeline-line" />
        </div>
        <div className="journey-principles">
          {[
            { icon: "📐", label: "Architecture First", desc: "Design before you code." },
            { icon: "🔄", label: "Iterate Fast", desc: "Ship. Learn. Improve." },
            { icon: "📖", label: "Always Learning", desc: "Every project teaches." },
            { icon: "🤝", label: "Open Source", desc: "Give back to the community." },
          ].map(p => (
            <div className="principle glass" key={p.label}>
              <span className="principle-icon">{p.icon}</span>
              <strong>{p.label}</strong>
              <span>{p.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────
import { MdEmail } from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";
function Contact() {
  const [ref, inView] = useInView();
  const [copied, setCopied] = useState(false);
  const email = "pcauthentic123@gmail.com";
  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="contact section" id="contact" ref={ref}>
      <div className={`container reveal ${inView ? "revealed" : ""}`}>
        <div className="section-label">// contact</div>
        <h2 className="section-heading">Let's <span className="accent">Connect</span></h2>
        <p className="contact-sub">
          I'm actively looking for SDE internships and collaborations on impactful products.<br />
          If you're building something interesting — let's talk.
        </p>
                <div className="contact-grid">
          <div className="contact-card glass">
            <div className="contact-icon">
              <MdEmail />
            </div>
            <h4>Email</h4>
            <p className="contact-value">{email}</p>
            <button className="btn btn-primary" onClick={copyEmail}>
              {copied ? "✓ Copied!" : "Copy Email"}
            </button>
          </div>

          <a
            className="contact-card glass contact-card--link"
            href="https://linkedin.com/in/priyanshuchaudhary"
            target="_blank"
            rel="noreferrer"
          >
            <div className="contact-icon">
              <FaLinkedin />
            </div>
            <h4>LinkedIn</h4>
            <p className="contact-value">in/priyanshuchaudhary</p>
            <span className="contact-arrow">→</span>
          </a>

          <a
            className="contact-card glass contact-card--link"
            href="https://github.com/pcpriyanshu05"
            target="_blank"
            rel="noreferrer"
          >
            <div className="contact-icon">
              <FaGithub />
            </div>
            <h4>GitHub</h4>
            <p className="contact-value">github.com/pcpriyanshu05</p>
            <span className="contact-arrow">→</span>
          </a>
        </div>
        <div className="contact-cta glass">
          <div className="cta-content">
            <h3>Open to SDE Internships</h3>
            <p>Summer 2026 · Full Stack · Backend · DSA</p>
          </div>
          <a className="btn btn-primary" href="mailto:pcauthentic123@gmail.com">
            Get In Touch
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-logo">
          <span className="logo-bracket">&lt;</span>
          <span className="logo-name">PC</span>
          <span className="logo-bracket">/&gt;</span>
        </div>
        <p className="footer-copy">© 2026 Priyanshu Chaudhary. Built with React ⚛️ + passion 🔥</p>
        <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑ Top</button>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────
export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
  return (
    <div className="app">
      <Nav />
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <DSA />
      <Journey />
      <Contact />
      <Footer />
    </div>
  );
}