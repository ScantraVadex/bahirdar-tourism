'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', visitors: 1420, itineraries: 320 },
  { month: 'Feb', visitors: 1850, itineraries: 410 },
  { month: 'Mar', visitors: 1200, itineraries: 290 },
  { month: 'Apr', visitors: 980, itineraries: 180 },
  { month: 'May', visitors: 850, itineraries: 150 },
  { month: 'Jun', visitors: 720, itineraries: 130 },
  { month: 'Jul', visitors: 900, itineraries: 210 },
  { month: 'Aug', visitors: 1600, itineraries: 380 },
  { month: 'Sep', visitors: 2200, itineraries: 540 },
  { month: 'Oct', visitors: 2800, itineraries: 720 },
  { month: 'Nov', visitors: 3100, itineraries: 890 },
  { month: 'Dec', visitors: 3400, itineraries: 960 },
];

const categoryData = [
  { name: 'Nature & Falls', count: 8, color: '#0284c7' },
  { name: 'Monasteries', count: 12, color: '#8b5cf6' },
  { name: 'Culture & Food', count: 6, color: '#10b981' },
  { name: 'Palaces & History', count: 4, color: '#f59e0b' },
  { name: 'Lake Safaris', count: 5, color: '#ec4899' },
];

export default function AdminCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Trends */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tourist Interest & Trip Itineraries
            </h3>
            <p className="text-xs text-slate-500">
              Monthly seasonal distribution of Bahir Dar visitors
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-sky-600">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
              Visitor Inquiries
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              Trip Itineraries
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorItineraries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#0284c7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisitors)"
              />
              <Area
                type="monotone"
                dataKey="itineraries"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorItineraries)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Attraction Categories
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Distribution of registered destinations
          </p>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          {categoryData.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </span>
              <span className="font-bold text-slate-900">{cat.count} sites</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
