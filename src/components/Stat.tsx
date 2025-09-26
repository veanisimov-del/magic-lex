export default function Stat({ label, value }: { label: string, value: string|number }) {
  return (
    <div className="stat">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs opacity-70 mt-1">{label}</div>
    </div>
  )
}
