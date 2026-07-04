import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-4xl mb-3">404</h1>
      <p className="text-ink-soft mb-6">This page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Back home
      </Link>
    </div>
  )
}
