/**
 * Stats Card Component
 * Displays individual stat cards in the dashboard
 */

interface StatsCardProps {
  label: string;
  value: number;
  colorClass: string;
}

export default function StatsCard({ label, value, colorClass }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
      <h3 className={`${colorClass} text-sm font-semibold uppercase mb-2`}>{label}</h3>
      <div className="text-4xl font-bold text-gray-800">{value}</div>
    </div>
  );
}
