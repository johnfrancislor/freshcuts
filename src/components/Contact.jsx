'use client'

import { useState } from 'react'
import { CalendarCheck, Mail, MapPin, Phone, Send } from 'lucide-react'
import { business, navLinks, serviceGroups } from '../data'
import Logo from './Logo'
import { FacebookIcon } from './Sections'

// Static site: the form opens the visitor's email app with the message pre-filled.
// Swap handleSubmit for a real endpoint (Formspree, Netlify Forms, custom API) when a backend is added.
export function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const subject = `Free estimate request: ${f.get('service')}`
    const body = [
      `Name: ${f.get('name')}`,
      `Phone: ${f.get('phone')}`,
      `Email: ${f.get('email')}`,
      `Service: ${f.get('service')}`,
      '',
      f.get('message'),
    ].join('\n')
    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section className="section container" id="contact">
      <div className="contact">
        <div className="contact-info">
          <p className="eyebrow light">Contact us</p>
          <h2>Get your free estimate</h2>
          <p>Call, email or send the form. We’ll get back to you within 48–72 hours, usually sooner.</p>
          <ul>
            <li>
              <span className="ci-icon"><Phone size={18} /></span>
              <div><small>Call or text</small><a href={business.phoneHref}>{business.phone}</a></div>
            </li>
            <li>
              <span className="ci-icon"><Mail size={18} /></span>
              <div><small>Email</small><a href={`mailto:${business.email}`}>{business.email}</a></div>
            </li>
            <li>
              <span className="ci-icon"><MapPin size={18} /></span>
              <div><small>Address</small><span>{business.address}, {business.city}</span></div>
            </li>
            <li>
              <span className="ci-icon"><CalendarCheck size={18} /></span>
              <div><small>Estimates</small><span>Free, 7 days a week</span></div>
            </li>
          </ul>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <label>Name<input name="name" required autoComplete="name" /></label>
            <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
          </div>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>
            Service needed
            <select name="service" defaultValue="Not sure yet">
              {serviceGroups.map((g) => <option key={g.title}>{g.title}</option>)}
              <option>Snow removal</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <label>Tell us about your project<textarea name="message" rows={4} required /></label>
          <button type="submit" className="btn btn-primary">
            Request my free estimate <Send size={16} />
          </button>
          {sent && <p className="form-note">Your email app should open with your message ready to send.</p>}
        </form>
      </div>

      <div className="map">
        <iframe
          title="Fresh Cuts location map"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(`${business.address}, ${business.city}`)}&z=12&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p>Locally owned lawn care and landscaping serving the Greater Grand Rapids area. Licensed &amp; insured.</p>
          <a href={business.facebook} target="_blank" rel="noreferrer" className="social" aria-label="Facebook">
            <FacebookIcon size={20} />
          </a>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            {navLinks.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
            <li><a href="#guarantees">Warranties</a></li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul>
            <li><a href={business.phoneHref}>{business.phone}</a></li>
            <li><a href={`mailto:${business.email}`}>{business.email}</a></li>
            <li>{business.address}<br />{business.city}</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {YEAR} {business.legalName}. All rights reserved.</span>
      </div>
    </footer>
  )
}
