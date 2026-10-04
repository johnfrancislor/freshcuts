import { Leaf } from 'lucide-react'

export default function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`}>
      <span className="logo-mark"><Leaf size={18} strokeWidth={2.2} /></span>
      <span className="logo-text">
        <strong>Fresh Cuts</strong>
        <small>Lawn Care &amp; Landscaping</small>
      </span>
    </span>
  )
}
