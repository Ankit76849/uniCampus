import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, AlertTriangle, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { resultsAPI, examAPI, libraryAPI } from '../services/api';
import { PageHeader, Card, Badge, LoadingSpinner, Table, EmptyState } from '../components/UI';

// ======================== RESULTS PAGE ========================
export const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [activeSem, setActiveSem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resultsAPI.get().then(r => {
      const data = r.data.results || [];
      setResults(data);
      if (data.length) setActiveSem(data[data.length - 1].semester);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!results.length) return <EmptyState icon={Award} title="No results" description="Results will appear here once published." />;

  const cgpaData = results.map(r => ({ semester: `Sem ${r.semester}`, cgpa: r.cgpa, sgpa: r.sgpa }));
  const activeResult = results.find(r => r.semester === activeSem);

  const gradeColor = (g) => {
    if (!g) return 'gray';
    if (g === 'O') return 'indigo';
    if (g.startsWith('A')) return 'green';
    if (g.startsWith('B')) return 'blue';
    if (g.startsWith('C')) return 'yellow';
    return 'red';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Academic Results" subtitle="Grade sheets and CGPA progress" />

      {/* CGPA cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <Card className="sm:col-span-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current CGPA</p>
          <p className="text-4xl font-display font-bold text-indigo-600 dark:text-indigo-400">
            {results[results.length - 1]?.cgpa?.toFixed(2) || '—'}
          </p>
          <p className="text-xs text-emerald-600 mt-1">↑ Improving trend</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Latest SGPA</p>
          <p className="text-3xl font-display font-bold text-purple-600 dark:text-purple-400">
            {results[results.length - 1]?.sgpa?.toFixed(1) || '—'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Sem {results[results.length - 1]?.semester}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Semesters</p>
          <p className="text-3xl font-display font-bold text-gray-700 dark:text-gray-300">{results.length}</p>
          <p className="text-xs text-gray-400 mt-1">Completed</p>
        </Card>
      </div>

      {/* CGPA Graph */}
      <Card className="mb-5">
        <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white mb-4">CGPA & SGPA Progression</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={cgpaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
            <XAxis dataKey="semester" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[7, 10]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
            <Line type="monotone" dataKey="cgpa" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} name="CGPA" />
            <Line type="monotone" dataKey="sgpa" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} strokeDasharray="4 2" name="SGPA" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Semester tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {results.map(r => (
          <button key={r.semester} onClick={() => setActiveSem(r.semester)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeSem === r.semester ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>
            Sem {r.semester}
            <span className="ml-1.5 text-xs opacity-70">{r.sgpa}</span>
          </button>
        ))}
      </div>

      {activeResult && (
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white">Semester {activeResult.semester} Grade Sheet</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">SGPA: {activeResult.sgpa} • Result: <span className="text-emerald-600 font-medium">{activeResult.result}</span></p>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              <Download size={13} /> Download
            </button>
          </div>
          <Table headers={['Subject', 'Code', 'Credits', 'Internal', 'Quiz', 'ST', 'TA', 'End Sem', 'Total', 'Grade']}>
            {activeResult.subjects.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-200 max-w-xs">{s.subjectName}</td>
                <td className="py-3 px-4 text-xs font-mono text-gray-500">{s.subjectCode}</td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{s.credits}</td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{s.internalMarks}</td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{s.quizMarks}</td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{s.surpriseTest}</td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{s.teacherAssessment}</td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{s.endSemMarks}</td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-800 dark:text-gray-200">{s.totalMarks}</td>
                <td className="py-3 px-4"><Badge color={gradeColor(s.grade)}>{s.grade}</Badge></td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </motion.div>
  );
};

// ======================== EXAM SCHEDULE PAGE ========================
export const ExamSchedulePage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examAPI.getSchedule().then(r => setExams(r.data.exams || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const allSubjects = exams.flatMap(e => e.subjects?.map(s => ({ ...s, examName: e.examName, examType: e.examType })) || []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Exam Schedule" subtitle="Upcoming examinations timetable" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Exams', value: allSubjects.length, color: 'text-indigo-600' },
          { label: 'Theory Papers', value: allSubjects.filter(s => !s.subjectCode?.endsWith('L')).length, color: 'text-blue-600' },
          { label: 'Practical', value: allSubjects.filter(s => s.subjectCode?.endsWith('L')).length, color: 'text-emerald-600' },
        ].map((s, i) => (
          <Card key={i} className="text-center">
            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {allSubjects.sort((a, b) => new Date(a.date) - new Date(b.date)).map((sub, i) => {
          const examDate = new Date(sub.date);
          const isUpcoming = examDate >= new Date();
          const daysLeft = Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24));
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`flex items-center gap-4 ${!isUpcoming ? 'opacity-60' : ''}`}>
                <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-lg font-display font-bold text-indigo-600 dark:text-indigo-400 leading-none">{examDate.getDate()}</span>
                  <span className="text-xs text-indigo-400 leading-none">{examDate.toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{sub.subjectName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {sub.startTime} – {sub.endTime} • {sub.room} • {sub.duration}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge color="indigo">{sub.subjectCode}</Badge>
                  {isUpcoming && daysLeft >= 0 && (
                    <span className={`text-xs font-medium ${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {daysLeft === 0 ? 'Today!' : `${daysLeft}d left`}
                    </span>
                  )}
                  {!isUpcoming && <span className="text-xs text-gray-400">Completed</span>}
                </div>
              </Card>
            </motion.div>
          );
        })}
        {allSubjects.length === 0 && <EmptyState icon={BookOpen} title="No exam schedule" description="Exam schedule will be published here." />}
      </div>
    </motion.div>
  );
};

// ======================== LIBRARY PAGE ========================
export const LibraryPage = () => {
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    libraryAPI.get().then(r => setLibrary(r.data.library)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  const books = library?.books || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Library" subtitle="Issued books and fine history" />

      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Issued', value: books.filter(b => b.status === 'Issued').length, color: 'text-blue-600' },
          { label: 'Overdue', value: books.filter(b => b.status === 'Overdue').length, color: 'text-red-600' },
          { label: 'Total Fine', value: `₹${books.reduce((s, b) => s + (b.fine || 0), 0)}`, color: 'text-orange-600' },
        ].map((s, i) => (
          <Card key={i} className="text-center">
            <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {books.filter(b => b.status === 'Overdue').length > 0 && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">
            You have {books.filter(b => b.status === 'Overdue').length} overdue book(s). Please return immediately to avoid additional fines.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className={`${book.status === 'Overdue' ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{book.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{book.author}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Issued</span>
                  <span className="text-gray-700 dark:text-gray-300">{book.issueDate ? new Date(book.issueDate).toLocaleDateString('en-IN') : '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Due Date</span>
                  <span className={book.status === 'Overdue' ? 'text-red-600 font-medium' : 'text-gray-700 dark:text-gray-300'}>
                    {book.dueDate ? new Date(book.dueDate).toLocaleDateString('en-IN') : '—'}
                  </span>
                </div>
                {book.fine > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Fine</span>
                    <span className="text-red-600 font-semibold">₹{book.fine}</span>
                  </div>
                )}
                <div className="flex justify-end mt-1">
                  <Badge color={book.status === 'Issued' ? 'blue' : book.status === 'Overdue' ? 'red' : 'green'}>
                    {book.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {books.length === 0 && <div className="col-span-3"><EmptyState icon={BookOpen} title="No books issued" description="Books you borrow will appear here." /></div>}
      </div>
    </motion.div>
  );
};
