import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { attendanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, Badge, LoadingSpinner, ProgressBar, Table } from '../components/UI';

const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6'];

export const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceAPI.get().then(r => setAttendance(r.data.attendance || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const low = attendance.filter(a => a.percentage < 80);
  const pieData = attendance.map(a => ({ name: a.subjectCode, value: a.percentage }));

  const monthlyBar = attendance.length > 0 && attendance[0].monthlyData
    ? attendance[0].monthlyData.map(m => {
        const obj = { month: m.month };
        attendance.forEach(a => {
          const md = a.monthlyData?.find(d => d.month === m.month);
          if (md) obj[a.subjectCode] = md.total > 0 ? Math.round((md.attended / md.total) * 100) : 0;
        });
        return obj;
      })
    : [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Attendance" subtitle="Subject-wise attendance tracking" />

      {low.length > 0 && (
        <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">Low Attendance Warning</span>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400">
            {low.map(a => a.subjectName).join(', ')} — below 80% threshold
          </p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Subjects', value: attendance.length, color: 'text-indigo-600' },
          { label: 'Above 80%', value: attendance.filter(a => a.percentage >= 80).length, color: 'text-emerald-600' },
          { label: 'Below 80%', value: low.length, color: 'text-red-600' },
        ].map((s, i) => (
          <Card key={i} className="text-center">
            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Monthly bar chart */}
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white mb-4">Monthly Attendance Trend (%)</h3>
          {monthlyBar.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyBar}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                {attendance.slice(0, 3).map((a, i) => (
                  <Bar key={a.subjectCode} dataKey={a.subjectCode} fill={COLORS[i]} radius={[3,3,0,0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="text-center py-10 text-gray-400 text-sm">No monthly data</div>}
        </Card>

        {/* Pie */}
        <Card>
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white mb-2">Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={65} dataKey="value" paddingAngle={2}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius: 10, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Table */}
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white">Subject-wise Attendance</h3>
        </div>
        <Table headers={['Subject', 'Code', 'Held', 'Attended', 'Attendance', 'Status']}>
          {attendance.map((a, i) => (
            <tr key={i} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 ${a.percentage < 75 ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200 font-medium">{a.subjectName}</td>
              <td className="py-3 px-4 text-xs font-mono text-gray-500 dark:text-gray-400">{a.subjectCode}</td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{a.totalClasses}</td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{a.attendedClasses}</td>
              <td className="py-3 px-4 w-40">
                <ProgressBar value={a.percentage} color="auto" />
              </td>
              <td className="py-3 px-4">
                {a.percentage >= 80
                  ? <Badge color="green"><CheckCircle size={10} className="mr-1" />Good</Badge>
                  : a.percentage >= 75
                  ? <Badge color="yellow"><AlertTriangle size={10} className="mr-1" />Warning</Badge>
                  : <Badge color="red"><AlertTriangle size={10} className="mr-1" />Low</Badge>}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </motion.div>
  );
};

export const TimetablePage = () => {
  const { student } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('Monday');

  useEffect(() => {
    const { timetableAPI } = require('../services/api');
    timetableAPI.get().then(r => setTimetable(r.data.timetable)).finally(() => setLoading(false));
  }, []);

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    if (days.includes(today)) setActiveDay(today);
  }, [today]);

  if (loading) return <LoadingSpinner />;

  const dayData = timetable?.schedule?.find(s => s.day === activeDay);

  const typeColors = {
    Lecture: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
    Lab: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
    Tutorial: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Timetable" subtitle={`${student?.branch} • Semester ${student?.semester} • Section ${student?.section}`} />

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeDay === day
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                : day === today
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-300'
            }`}
          >
            {day.slice(0, 3)}
            {day === today && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-current inline-block align-middle" />}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {dayData?.slots?.length > 0 ? dayData.slots.map((slot, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`border-l-4 ${typeColors[slot.type] || typeColors.Lecture}`}>
              <div className="flex items-center gap-4">
                <div className="text-xs font-mono text-gray-500 dark:text-gray-400 w-28 flex-shrink-0">{slot.time}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{slot.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{slot.faculty} • Room: {slot.room}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Badge color={slot.type === 'Lab' ? 'green' : slot.type === 'Tutorial' ? 'yellow' : 'indigo'}>{slot.type}</Badge>
                  <span className="text-xs font-mono text-gray-400 hidden sm:block">{slot.subjectCode}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )) : (
          <Card className="text-center py-12">
            <p className="text-gray-400 text-sm">No classes scheduled for {activeDay}</p>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export const AcademicsPage = () => {
  const { student } = useAuth();
  const subjects = [
    { code: 'CS601', name: 'Machine Learning', credits: 4, faculty: 'Dr. A. Kumar', type: 'Theory' },
    { code: 'CS602', name: 'Computer Networks', credits: 4, faculty: 'Prof. B. Singh', type: 'Theory' },
    { code: 'CS603', name: 'Database Systems', credits: 4, faculty: 'Dr. C. Nair', type: 'Theory' },
    { code: 'CS604', name: 'Operating Systems', credits: 3, faculty: 'Dr. D. Verma', type: 'Theory' },
    { code: 'CS605', name: 'Software Engineering', credits: 3, faculty: 'Prof. E. Rao', type: 'Theory' },
    { code: 'CS606', name: 'Cloud Computing', credits: 3, faculty: 'Dr. F. Patel', type: 'Elective' },
    { code: 'CS601L', name: 'ML Lab', credits: 2, faculty: 'Dr. A. Kumar', type: 'Lab' },
    { code: 'CS602L', name: 'Networks Lab', credits: 2, faculty: 'Prof. B. Singh', type: 'Lab' },
  ];
  const totalCredits = subjects.reduce((s, sub) => s + sub.credits, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Academics" subtitle="Registered subjects and academic details" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Program', value: student?.program || 'B.Tech' },
          { label: 'Branch', value: student?.branch },
          { label: 'Semester', value: `Semester ${student?.semester}` },
          { label: 'Total Credits', value: totalCredits },
        ].map((item, i) => (
          <Card key={i} className="text-center">
            <p className="text-xl font-display font-bold text-indigo-600 dark:text-indigo-400">{item.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
          </Card>
        ))}
      </div>

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white">Registered Subjects — Semester {student?.semester}</h3>
        </div>
        <Table headers={['Code', 'Subject Name', 'Credits', 'Faculty', 'Type']}>
          {subjects.map((s, i) => (
            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
              <td className="py-3 px-4 text-xs font-mono text-gray-500 dark:text-gray-400">{s.code}</td>
              <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">{s.name}</td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{s.credits}</td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{s.faculty}</td>
              <td className="py-3 px-4">
                <Badge color={s.type === 'Lab' ? 'green' : s.type === 'Elective' ? 'orange' : 'indigo'}>{s.type}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </motion.div>
  );
};
