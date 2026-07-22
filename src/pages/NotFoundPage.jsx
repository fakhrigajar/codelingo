import { Link } from 'react-router-dom'
import FadeIn from '../components/common/FadeIn'

export default function NotFoundPage() {
  return (
    <FadeIn delay={0.05} className="py-24 text-center">
      <h1 className="text-4xl mb-3">404</h1>
      <p className="text-ink-soft dark:text-white/60 mb-6">This page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Back home
      </Link>
    </FadeIn>
  )
}
