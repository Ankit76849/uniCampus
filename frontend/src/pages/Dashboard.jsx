import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart2, Award, CreditCard, Bell, Calendar, BookOpen,
  TrendingUp, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { dashboardAPI, attendanceAPI, resultsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard, Card, Badge, LoadingSpinner, PageHeader } from '../components/UI';

const cgpaData = [
  { semester: 'Sem 1', cgpa: 8.2 },
  { semester: 'Sem 2', cgpa: 8.35 },
  { semester: 'Sem 3', cgpa: 8.5 },
  { semester: 'Sem 4', cgpa: 8.65 },
  { semester: 'Sem 5', cgpa: 8.8 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

const Dashboard = () => {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardAPI.getStats(),
      attendanceAPI.get(),
    ]).then(([statsRes, attRes]) => {
      setStats(statsRes.data.stats);
      setAttendance(attRes.data.attendance || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const avgAttendance = stats?.avgAttendance || 0;
  const cgpa = stats?.cgpa || 0;
  const pendingDues = stats?.pendingDues || 0;
  const unreadNotifs = stats?.unreadNotifications || 0;

  const pieData = attendance.map((a, i) => ({
    name: a.subjectCode || a.subjectName,
    value: a.attendedClasses,
    pct: a.percentage
  }));

  const attendanceTrend = attendance.length > 0 && attendance[0].monthlyData
    ? attendance[0].monthlyData.map(m => ({
        month: m.month,
        ...Object.fromEntries(attendance.slice(0, 3).map(a => [
          a.subjectCode,
          a.monthlyData?.find(md => md.month === m.month)
            ? Math.round((a.monthlyData.find(md => md.month === m.month).attended /
               a.monthlyData.find(md => md.month === m.month).total) * 100)
            : 0
        ]))
      }))
    : [];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants}>
        <PageHeader
          title={`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, ${student?.name?.split(' ')[0]} 👋`}
          subtitle={`${student?.branch} • Semester ${student?.semester} • ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
        />
      </motion.div>

      {/* Alert banner */}
      {avgAttendance < 80 && (
        <motion.div variants={itemVariants} className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Attendance Alert:</strong> Your overall attendance is {avgAttendance}%, below the required 80%. Please attend classes regularly.
          </p>
        </motion.div>
      )}

      {/* Stat cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Avg Attendance"
          value={`${avgAttendance}%`}
          subtitle="Overall this semester"
          icon={BarChart2}
          color={avgAttendance < 75 ? 'red' : avgAttendance < 80 ? 'orange' : 'green'}
          onClick={() => navigate('/attendance')}
        />
        <StatCard
          title="CGPA"
          value={cgpa || '—'}
          subtitle="Cumulative Grade Point"
          icon={Award}
          color="indigo"
          trend={0.15}
          onClick={() => navigate('/results')}
        />
        <StatCard
          title="Pending Dues"
          value={pendingDues ? `₹${pendingDues.toLocaleString()}` : '₹0'}
          subtitle={pendingDues > 0 ? 'Clear before exams' : 'All clear!'}
          icon={CreditCard}
          color={pendingDues > 500 ? 'red' : 'green'}
          onClick={() => navigate('/dues')}
        />
        <StatCard
          title="Notifications"
          value={unreadNotifs}
          subtitle="Unread alerts"
          icon={Bell}
          color="purple"
          onClick={() => navigate('/notifications')}
        />
      </motion.div>

      {/* Charts row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* CGPA Progress */}
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1 text-sm">CGPA Progression</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Academic performance over semesters</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cgpaData}>
              <defs>
                <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
              <XAxis dataKey="semester" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[7, 10]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v) => [v, 'CGPA']}
              />
              <Area type="monotone" dataKey="cgpa" stroke="#6366f1" strokeWidth={2.5} fill="url(#cgpaGrad)" dot={{ fill: '#6366f1', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Attendance Pie */}
        <Card>
          <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1 text-sm">Attendance Breakdown</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">By subject</p>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n, p) => [`${p.payload.pct}%`, p.payload.name]} contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {pieData.slice(0, 4).map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="truncate text-gray-600 dark:text-gray-400 flex-1">{d.name}</span>
                    <span className={`font-medium flex-shrink-0 ${d.pct < 75 ? 'text-red-500' : d.pct < 80 ? 'text-orange-500' : 'text-emerald-600'}`}>{d.pct}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="text-center py-8 text-gray-400 text-sm">No data</div>}
        </Card>
      </motion.div>

      {/* Bottom row: Upcoming events & quick actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upcoming exams */}
        <Card>
          <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4 text-sm flex items-center gap-2">
            <Clock size={15} className="text-indigo-500" /> Upcoming Exams
          </h3>
          <div className="space-y-3">
            {[
              { sub: 'Machine Learning', code: 'CS601', date: 'Apr 20', time: '10:00 AM', room: 'Exam Hall A' },
              { sub: 'Computer Networks', code: 'CS602', date: 'Apr 22', time: '10:00 AM', room: 'Exam Hall B' },
              { sub: 'Database Systems', code: 'CS603', date: 'Apr 24', time: '10:00 AM', room: 'Exam Hall A' },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 leading-none">{e.date.split(' ')[1]}</span>
                  <span className="text-xs text-indigo-400 leading-none">{e.date.split(' ')[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{e.sub}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{e.time} • {e.room}</p>
                </div>
                <Badge color="indigo">{e.code}</Badge>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/exam-schedule')} className="mt-3 w-full text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-center">
            View full schedule →
          </button>
        </Card>

        {/* Quick links + alerts */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-500" /> Alerts
            </h3>
            <div className="space-y-2">
              {[
                { icon: '⚠️', msg: 'Networks attendance: 71% (below 80%)', color: 'red', link: '/attendance' },
                { icon: '📚', msg: 'Library book overdue — ₹50 fine', color: 'orange', link: '/library' },
                { icon: '📝', msg: 'Exam registration open — Last date: Mar 31', color: 'blue', link: '/exam-registration' },
                { icon: '💳', msg: 'Pending dues: ₹1,550', color: 'yellow', link: '/dues' },
              ].map((a, i) => {
                const colors = { red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300', orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300', blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300', yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' };
                return (
                  <button key={i} onClick={() => navigate(a.link)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-opacity hover:opacity-80 ${colors[a.color]}`}>
                    <span>{a.icon}</span>
                    <span className="text-xs font-medium">{a.msg}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-3 text-sm">Quick Access</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: BookOpen, label: 'Timetable', path: '/timetable', color: 'indigo' },
                { icon: BarChart2, label: 'Attendance', path: '/attendance', color: 'green' },
                { icon: Award, label: 'Results', path: '/results', color: 'purple' },
                { icon: Calendar, label: 'Events', path: '/events', color: 'orange' },
                { icon: TrendingUp, label: 'Resources', path: '/resources', color: 'blue' },
                { icon: CheckCircle, label: 'Exam Reg.', path: '/exam-registration', color: 'red' },
              ].map((q, i) => {
                const Icon = q.icon;
                const bgMap = { indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600', green: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600', purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600', orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600', blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600', red: 'bg-red-50 dark:bg-red-900/30 text-red-600' };
                return (
                  <button key={i} onClick={() => navigate(q.path)} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl hover:opacity-80 transition-opacity ${bgMap[q.color]}`}>
                    <Icon size={18} />
                    <span className="text-xs font-medium leading-tight text-center">{q.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
