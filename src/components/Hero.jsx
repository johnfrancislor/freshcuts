'use client'

import { useEffect, useState } from 'react'
import {
  ArrowRight, BrickWall, ChevronRight, Flower2, Menu, Phone, Scissors, ShieldCheck, Shovel, X,
} from 'lucide-react'
import { business, heroSlides, navLinks } from '../data'
import Logo from './Logo'

const quickServices = [
  { icon: Shovel, label: 'Mulch & Soil' },
  { icon: Flower2, label: 'Planting' },
  { icon: BrickWall, label: 'Retaining Walls' },
  { icon: Scissors, label: 'Hedge Trimming' },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const next = () => setActive((i) => (i + 1) % heroSlides.length)

  return (
    <header className="hero-wrap" id="top">
      <div className="hero">
        <div className="hero-panel" aria-hidden="true">
          {heroSlides.map((s, i) => (
            <img key={s.image} src={s.image} alt="" className={i === active ? 'is-active' : ''} />
          ))}
        </div>

        <nav className="hero-nav">
          <button className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu size={26} />
          </button>
          <a href="#top" className="hero-logo"><Logo /></a>
          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
          <a href={business.phoneHref} className="icon-btn call-btn" aria-label={`Call ${business.phone}`}>
            <Phone size={18} />
          </a>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">Healthy lawns. Beautiful spaces.</p>
          <h1>Beautiful Yards Start Here</h1>
          <p className="hero-lead">
            Locally owned lawn care and landscaping for the Greater Grand Rapids area.
            We listen to your ideas and turn them into the yard you’ve been picturing.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Get a free estimate <ArrowRight size={18} />
            </a>
            <a href={business.phoneHref} className="btn btn-ghost">
              <Phone size={16} /> {business.phone}
            </a>
          </div>

          <ul className="quick-services">
            {quickServices.map(({ icon: Icon, label }) => (
              <li key={label}>
                <a href="#services">
                  <Icon size={28} strokeWidth={1.6} />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-strip">
          <div className="hero-thumbs">
            {heroSlides.map((s, i) => (
              <button
                key={s.label}
                className={`thumb ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Show ${s.label}`}
                aria-pressed={i === active}
              >
                <img src={s.image} alt={s.alt} />
                <span>{s.label}</span>
              </button>
            ))}
            <button className="thumb-next" onClick={next} aria-label="Next image">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="strip-info">
            <p className="strip-title">Complete landscaping solutions</p>
            <p className="strip-sub">Residential &amp; Commercial Services</p>
          </div>

          <div className="badge-card">
            <ShieldCheck size={30} strokeWidth={1.6} />
            <div>
              <p className="strip-title">Licensed &amp; Insured</p>
              <p className="strip-sub">For your peace of mind</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="drawer-head">
          <Logo />
          <button className="icon-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <ul>
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href={business.phoneHref} className="btn btn-primary">
          <Phone size={16} /> Call {business.phone}
        </a>
      </div>
    </header>
  )
}
