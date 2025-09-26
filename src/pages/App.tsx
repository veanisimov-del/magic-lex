import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import NavBar from '@/components/NavBar'
import { load } from '@/lib/db'

export default function App() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  // simple first-run redirect
  if (pathname === '/' && !localStorage.getItem('magiclex_v1')) {
    load() // initializes seed
    nav('/onboarding')
  }
  return (
    <div className="min-h-screen pb-28">
      <header className="max-w-md mx-auto px-4 py-4">
        <Link to="/" className="text-lg font-semibold">✨ MagicLex</Link>
      </header>
      <main className="max-w-md mx-auto px-4 space-y-4">
        <Outlet />
      </main>
      <NavBar />
    </div>
  )
}
