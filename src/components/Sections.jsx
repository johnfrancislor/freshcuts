'use client'

import { useEffect, useState } from 'react'
import {
  BadgePercent, CalendarCheck, Check, ChevronDown, Home, MapPin, ShieldCheck, Star, Ticket, X,
} from 'lucide-react'
import { business, coupons, gallery, guarantees, serviceAreas, serviceGroups } from '@/data'

export function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
    </svg>
  )
}

function SectionHead({ eyebrow, title, children, center = false }) {
  return (
    <div className={`section-head ${center ? 'center' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p className="section-lead">{children}</p>}
    </div>
  )
}

const perks = [
  { icon: CalendarCheck, title: 'Free estimates', text: '7 days a week' },
  { icon: BadgePercent, title: 'Discounts', text: 'Senior, military & new customers' },
  { icon: ShieldCheck, title: 'Licensed & insured', text: 'For your peace of mind' },
  { icon: Home, title: 'Locally owned', text: 'Proudly serving Grand Rapids' },
]

export function Perks() {
  return (
    <section className="perks container" aria-label="Why choose us">
      {perks.map(({ icon: Icon, title, text }) => (
        <div className="perk" key={title}>
          <span className="perk-icon"><Icon size={22} /></span>
          <div>
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        </div>
      ))}
    </section>
  )
}

export function Services() {
  return (
    <section className="section container" id="services">
      <SectionHead eyebrow="What we do" title="Everything your yard needs, from one local crew">
        From a single bed refresh to a full backyard transformation, we handle the design and the
        work for homes and businesses alike.
      </SectionHead>
      <div className="service-grid">
        {serviceGroups.map((g) => (
          <article className="service-card" key={g.title}>
            <div className="service-img">
              <img src={g.image} alt="" loading="lazy" />
            </div>
            <div className="service-body">
              <h3>{g.title}</h3>
              <p>{g.blurb}</p>
              <ul>
                {g.items.map((it) => (
                  <li key={it}><Check size={16} /> {it}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function About() {
  return (
    <section className="section about-wrap" id="about">
      <div className="container about">
        <div className="about-media">
          <img src="/images/work/owners.webp" alt="Doug and Melisa, owners of Fresh Cuts" loading="lazy" />
          <div className="about-tag">
            <strong>{business.owners}</strong>
            <span>Owners</span>
          </div>
        </div>
        <div className="about-copy">
          <SectionHead eyebrow="Our story" title="A local business that listens first" />
          <p>
            Fresh Cuts Lawn Care and Landscaping LLC is a locally owned business offering reliable,
            affordable pricing. We meet with every customer individually and take the time to listen
            to your ideas. Together we come up with the landscape design of your dreams, and then we
            make it a reality.
          </p>
          <blockquote>
            “Our mission is to be helpful in our community, to be honest and fair with all our
            customers and treat them with dignity and respect every time.”
          </blockquote>
          <ul className="about-points">
            <li><Check size={18} /> One-on-one design consultations</li>
            <li><Check size={18} /> Portfolio book available to view in person</li>
            <li><Check size={18} /> Residential &amp; commercial properties</li>
          </ul>
          <a href="#contact" className="btn btn-primary">Talk to Doug about your project</a>
        </div>
      </div>
    </section>
  )
}

const galleryTags = ['All', ...new Set(gallery.map((g) => g.tag))]

export function Gallery() {
  const [tag, setTag] = useState('All')
  const [open, setOpen] = useState(null)
  const items = tag === 'All' ? gallery : gallery.filter((g) => g.tag === tag)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <section className="section container" id="gallery">
      <SectionHead eyebrow="Our work" title="Real yards. Real results." center>
        A few recent projects from around Grand Rapids. You’ll find plenty more on our Facebook page.
      </SectionHead>
      <div className="filters" role="tablist" aria-label="Filter projects">
        {galleryTags.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tag === t}
            className={`chip ${tag === t ? 'is-active' : ''}`}
            onClick={() => setTag(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {items.map((g) => (
          <button className="gallery-item" key={g.src} onClick={() => setOpen(g)}>
            <img src={g.src} alt={g.title} loading="lazy" />
            <span className="gallery-cap">
              <small>{g.tag}</small>
              {g.title}
            </span>
          </button>
        ))}
      </div>
      <div className="center-cta">
        <a href={business.facebook} target="_blank" rel="noreferrer" className="btn btn-outline">
          <FacebookIcon /> See more on Facebook
        </a>
      </div>

      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={open.title} onClick={() => setOpen(null)}>
          <button className="icon-btn lightbox-close" aria-label="Close" onClick={() => setOpen(null)}>
            <X size={24} />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={open.src} alt={open.title} />
            <figcaption>{open.title}</figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}

export function Specials() {
  return (
    <section className="section specials-wrap" id="specials">
      <div className="container">
        <SectionHead eyebrow="Seasonal specials" title="Save on your next project" center>
          Great discounts all season long for new, loyal, senior &amp; military customers.
          Mention a coupon when you request your estimate.
        </SectionHead>
        <div className="coupon-grid">
          {coupons.map((c) => (
            <div className="coupon" key={c.big}>
              <Ticket size={22} />
              <strong>{c.big}</strong>
              <span>{c.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Guarantees() {
  return (
    <section className="section container" id="guarantees">
      <SectionHead eyebrow="Our promise" title="Work we stand behind">
        Clear policies and real warranties, so you know exactly what you’re getting.
      </SectionHead>
      <div className="guarantee-grid">
        {guarantees.map((g) => (
          <article className="guarantee" key={g.title}>
            <span className="perk-icon"><ShieldCheck size={22} /></span>
            <h3>{g.title}</h3>
            <p>{g.summary}</p>
            <details>
              <summary>View details <ChevronDown size={16} /></summary>
              <ul>
                {g.terms.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </details>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Reviews() {
  return (
    <section className="container">
      <div className="reviews-band">
        <div className="stars" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => <Star key={i} size={22} fill="currentColor" />)}
        </div>
        <h2>Loved by neighbors across Grand Rapids</h2>
        <p>Read what our customers say. We have tons of reviews and references on our Facebook page.</p>
        <a href={business.facebook} target="_blank" rel="noreferrer" className="btn btn-light">
          <FacebookIcon /> Read our reviews
        </a>
      </div>
    </section>
  )
}

export function ServiceArea() {
  return (
    <section className="section container" id="area">
      <SectionHead eyebrow="Service area" title="Serving the Greater Grand Rapids area" center>
        Including these communities and all surrounding areas.
      </SectionHead>
      <ul className="area-list">
        {serviceAreas.map((a) => (
          <li key={a}><MapPin size={14} /> {a}</li>
        ))}
      </ul>
    </section>
  )
}
