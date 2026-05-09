import { useState, useEffect, useRef, type ReactNode } from 'react'
import './App.css'

const SIMS_URL = 'https://physicssims.illiniopenedu.org'

// ── Hooks ─────────────────────────────────────────────────────────

function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return y
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ── Nav ───────────────────────────────────────────────────────────

type NavLink = { label: string; href: string; external?: boolean }

const NAV_LINKS: NavLink[] = [
  { label: 'PhysicsSims', href: SIMS_URL,    external: true },
  { label: 'Mission',     href: '#mission'               },
  { label: 'About',       href: '#about'                 },
  { label: 'Contact',     href: '#contact'               },
]

function Nav() {
  const y = useScrollY()
  const [open, setOpen] = useState(false)
  const scrolled = y > 10
  const close = () => setOpen(false)

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}${open ? ' nav--open' : ''}`}>
      <div className="nav__bar">
        <a href="#top" className="nav__logo" onClick={close}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 1L2 6v8l8 5 8-5V6L10 1z" />
          </svg>
          IlliniOpenEdu
        </a>

        <ul className="nav__links" role="list">
          {NAV_LINKS.map(({ label, href, external }) => (
            <li key={label}>
              <a
                href={href}
                onClick={close}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__right">
          
        </div>
      </div>

      <div className="nav__mobile" aria-hidden={!open}>
        {NAV_LINKS.map(({ label, href, external }) => (
          <a
            key={label}
            href={href}
            onClick={close}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {label}
          </a>
        ))}
        <a
          href={SIMS_URL}
          className="nav__mobile-cta"
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          Try it free
        </a>
      </div>
    </nav>
  )
}

// ── Reveal animation wrapper ──────────────────────────────────────

function Reveal({ children, delay = 0, className = '' }: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' reveal--in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <div className="orb orb--blue" />
        <div className="orb orb--purple" />
        <div className="orb orb--teal" />
      </div>

      <div className="hero__body">
        <p className="hero__kicker">IlliniOpenEdu</p>
        <h1 className="hero__title">
          Physics you can<br />
          <span className="hero__title-grad">actually play with.</span>
        </h1>
        <p className="hero__sub">
          Free, interactive physics simulations built by University of Illinois
          students — for every student, everywhere.
        </p>
        <div className="hero__btns">
          <a href={SIMS_URL} className="btn btn--blue" target="_blank" rel="noopener noreferrer">
            Try PhysicsSims
          </a>
          <a href="#mission" className="btn btn--ghost">Our mission ›</a>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <div className="scroll-mouse" />
      </div>
    </section>
  )
}

// ── Full-screen statement section ─────────────────────────────────

function Statement({ id, dark, eyebrow, headline, sub, cta, ctaHref = '#' }: {
  id?: string
  dark?: boolean
  eyebrow: string
  headline: ReactNode
  sub: string
  cta: string
  ctaHref?: string
}) {
  const { ref, visible } = useInView(0.2)
  const external = ctaHref.startsWith('http')
  return (
    <section id={id} className={`stmt${dark ? ' stmt--dark' : ' stmt--light'}`}>
      <div ref={ref} className={`stmt__body${visible ? ' stmt__body--in' : ''}`}>
        <p className="stmt__eyebrow">{eyebrow}</p>
        <h2 className="stmt__title">{headline}</h2>
        <p className="stmt__sub">{sub}</p>
        <a
          href={ctaHref}
          className="stmt__cta"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {cta} ›
        </a>
      </div>
    </section>
  )
}

// ── Feature grid ──────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '◆',
    title: 'Interactive simulations',
    body: 'Drag, click, and experiment with real physics concepts directly in your browser — no download, no login.',
  },
  {
    icon: '◈',
    title: 'Always free',
    body: 'No subscriptions, no paywalls, no accounts required. Our tools are free for every student on Earth.',
  },
  {
    icon: '◉',
    title: 'Student-built',
    body: 'Made by University of Illinois students who believe quality science education should be open to all.',
  },
  {
    icon: '◍',
    title: 'Open source',
    body: 'Every line of code is publicly available. Fork it, remix it, and run it yourself.',
  },
]

function Features() {
  return (
    <section className="features">
      <Reveal>
        <p className="features__eyebrow">What We're Building</p>
        <h2 className="features__title">Education tools that open doors.</h2>
      </Reveal>
      <div className="feat-grid">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 80} className="feat-card">
            <span className="feat-card__icon" aria-hidden="true">{f.icon}</span>
            <h3 className="feat-card__title">{f.title}</h3>
            <p className="feat-card__body">{f.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ── Founders ──────────────────────────────────────────────────────

type Founder = {
  name: string
  role: string
  initial: string
  title: string
  bio: string
  github: string
  linkedin: string
  photo?: string
}

const FOUNDERS: Founder[] = [
  {
    name: 'Evan',
    role: 'Founder',
    initial: 'E',
    title: 'Lead Developer / Computer Science',
    bio: 'Evan is the big brains behind PhysicsSims, the one who had the crazy idea to build free physics sims in the first place. He’s a sophomore studying CS and physics, and when he’s not coding or doing physics research, you can find him playing chess or exploring the outdoors.',
    github: 'https://github.com/Edoubek1024',
    linkedin: 'https://www.linkedin.com/in/evan-doubek-79047b32a/',
  },
  {
    name: 'Bryan',
    role: 'Co-founder',
    initial: 'B',
    title: 'Developer / System Engineering & Design',
    bio: "Bryan is a sophomore studying system engineering. He's passionate about fullstack development and has been instrumental in shaping the architecture of PhysicsSims. When he's not coding, Bryan enjoys playing League of Legends which he hates.",
    github: 'https://github.com/bbryanchenn',
    linkedin: 'https://linkedin.com/in/bryanheinchen',
  },
]

function Founders() {
  return (
    <section className="founders" id="about">
      <Reveal>
        <p className="founders__eyebrow">Meet the Team</p>
        <h2 className="founders__title">Built by students,<br />for students.</h2>
      </Reveal>
      <div className="founders__grid">
        {FOUNDERS.map((f, i) => (
          <Reveal key={f.name} delay={i * 140} className="founder-card">
            <div className="founder-card__photo">
              {f.photo
                ? <img src={f.photo} alt={f.name} />
                : <span>{f.initial}</span>
              }
            </div>
            <p className="founder-card__role">{f.role}</p>
            <h3 className="founder-card__name">{f.name}</h3>
            <p className="founder-card__title">{f.title}</p>
            <p className="founder-card__bio">{f.bio}</p>
            <div className="founder-card__links">
              <a href={f.github} target="_blank" rel="noopener noreferrer" aria-label={`${f.name} on GitHub`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href={f.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${f.name} on LinkedIn`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────────

const STATS = [
  { value: '$0',   label: 'Cost to you'       },
  { value: '100%', label: 'Open source'        },
  { value: '∞',    label: 'Curiosity required' },
]

function Stats() {
  const { ref, visible } = useInView(0.3)
  return (
    <section className="stats">
      <div ref={ref} className="stats__inner">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`stat${visible ? ' stat--in' : ''}`}
            style={{ transitionDelay: `${i * 130}ms` }}
          >
            <span className="stat__value">{s.value}</span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────

function CTA() {
  const { ref, visible } = useInView(0.3)
  return (
    <section className="cta-section" id="contact">
      <div ref={ref} className={`cta-section__body${visible ? ' cta-section__body--in' : ''}`}>
        <h2 className="cta-section__title">See physics come alive.</h2>
        <p className="cta-section__sub">
          Our first project is live. Try PhysicsSims — free, interactive,
          and built for learners like you.
        </p>
        <a
          href={SIMS_URL}
          className="btn btn--blue btn--lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Launch PhysicsSims
        </a>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────

type FooterLink = { label: string; href: string; external?: boolean }

const FOOTER_COLS: Record<string, FooterLink[]> = {
  Projects: [
    { label: 'PhysicsSims', href: SIMS_URL, external: true },
  ],
  Organization: [
    { label: 'About',       href: '#about-stmt' },
    { label: 'Team',        href: '#about' },
    { label: 'Open Source', href: 'https://github.com/IlliniOpenEdu/PhysicsSims/wiki/Contributing' },
  ],
  Community: [
    { label: 'Contact',    href: 'mailto:contact@illiniopenedu.org' },
    { label: 'GitHub',     href: 'https://github.com/IlliniOpenEdu' },
    // { label: 'Newsletter', href: '#' },
  ],
  Legal: [  
    { label: 'Privacy',  href: '#' },
    { label: 'Terms',    href: 'https://physicssims.illiniopenedu.org/TOS' },
    { label: 'Licenses', href: '#' },
  ],
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {Object.entries(FOOTER_COLS).map(([cat, links]) => (
            <div key={cat} className="footer__col">
              <p className="footer__col-hd">{cat}</p>
              <ul>
                {links.map(({ label, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer__base">
          <p>Copyright © 2026 IlliniOpenEdu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ── Root ──────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Statement
        id="mission"
        dark
        eyebrow="Our First Project"
        headline={<>See physics in motion.<br />For free, forever.</>}
        sub="Interactive, browser-based simulations covering mechanics, waves, electromagnetism, and more — no download, no login."
        cta="Open PhysicsSims"
        ctaHref={SIMS_URL}
      />
      <Statement
        id="about-stmt"
        eyebrow="Our Mission"
        headline={<>Knowledge without<br />barriers.</>}
        sub="We believe every student deserves access to quality science education tools — regardless of where they are or what they can afford."
        cta="Learn about us"
        ctaHref="#about"
      />
      <Features />
      <Founders />
      <Stats />
      <CTA />
      <Footer />
    </>
  )
}