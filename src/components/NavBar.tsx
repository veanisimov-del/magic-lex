import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const { pathname } = useLocation()
  const Tab = ({ to, label, emoji }: { to: string, label: string, emoji: string }) => (
    <Link to={to} className={`flex-1 text-center py-3 rounded-xl ${pathname===to ? 'bg-white/10' : 'hover:bg-white/5'}`}>
      <div className="text-xl">{emoji}</div>
      <div className="text-xs opacity-80">{label}</div>
    </Link>
  )
  return (
    <div className="fixed bottom-4 left-0 right-0 px-4">
      <div className="mx-auto max-w-md bg-slate-900/70 backdrop-blur border border-white/10 rounded-2xl p-2 flex gap-2">
        <Tab to="/" label="Home" emoji="🏠" />
        <Tab to="/train" label="Train" emoji="🪄" />
        <Tab to="/decks" label="Decks" emoji="📚" />
        <Tab to="/achievements" label="Badges" emoji="🏆" />
        <Tab to="/profile" label="Profile" emoji="🧙" />
      </div>
    </div>
  )
}
