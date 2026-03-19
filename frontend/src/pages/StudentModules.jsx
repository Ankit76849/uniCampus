import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, CreditCard, Utensils, Star, Plus, Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import { hostelAPI, duesAPI, canteenAPI, feedbackAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, Badge, Button, Modal, LoadingSpinner, EmptyState, StarRating, Table } from '../components/UI';

// ======================== HOSTEL PAGE ========================
export const HostelPage = () => {
  const { student } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ leaveType: 'Hostel', fromDate: '', toDate: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    hostelAPI.getLeaves().then(r => setLeaves(r.data.leaves || [])).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await hostelAPI.applyLeave(form);
      setLeaves([res.data.leave, ...leaves]);
      setShowModal(false);
      setForm({ leaveType: 'Hostel', fromDate: '', toDate: '', reason: '' });
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const statusIcon = { Pending: <Clock size={12} />, Approved: <CheckCircle size={12} />, Rejected: <XCircle size={12} /> };
  const statusColor = { Pending: 'yellow', Approved: 'green', Rejected: 'red' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Hostel" subtitle="Room details and leave management"
        action={<Button onClick={() => setShowModal(true)}><Plus size={14} /> Apply Leave</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card className="sm:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Home size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{student?.hostel?.name || 'Not Assigned'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hostel Name</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
              <p className="text-lg font-display font-bold text-gray-800 dark:text-gray-200">{student?.hostel?.roomNumber || '—'}</p>
              <p className="text-xs text-gray-500">Room No.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
              <p className="text-lg font-display font-bold text-gray-800 dark:text-gray-200">{student?.hostel?.bedNumber || '—'}</p>
              <p className="text-xs text-gray-500">Bed No.</p>
            </div>
          </div>
        </Card>
        <Card className="sm:col-span-2">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white mb-4">Leave Applications</h3>
          {loading ? <LoadingSpinner /> : leaves.length > 0 ? (
            <div className="space-y-2">
              {leaves.map((leave, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{leave.reason?.slice(0, 40)}...</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(leave.fromDate).toLocaleDateString('en-IN')} – {new Date(leave.toDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <Badge color={statusColor[leave.status]}>{statusIcon[leave.status]} {leave.status}</Badge>
                </div>
              ))}
            </div>
          ) : <EmptyState icon={Home} title="No leave applications" />}
        </Card>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Apply for Leave">
        <div className="space-y-4">
          {[
            { label: 'Leave Type', key: 'leaveType', type: 'select', options: ['Hostel','Academic','Medical'] },
            { label: 'From Date', key: 'fromDate', type: 'date' },
            { label: 'To Date', key: 'toDate', type: 'date' },
            { label: 'Reason', key: 'reason', type: 'textarea' },
          ].map(({ label, key, type, options }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">{label}</label>
              {type === 'select' ? (
                <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : type === 'textarea' ? (
                <textarea value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              ) : (
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              )}
            </div>
          ))}
          <Button onClick={handleSubmit} disabled={submitting} className="w-full justify-center">
            <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
};

// ======================== DUES PAGE ========================
export const DuesPage = () => {
  const [dues, setDues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    duesAPI.get().then(r => setDues(r.data.dues)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  const allDues = dues?.dues || [];
  const pending = allDues.filter(d => d.status === 'Pending');
  const paid = allDues.filter(d => d.status === 'Paid');
  const totalPending = pending.reduce((s, d) => s + d.amount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Dues & Payments" subtitle="Fee payment history and pending dues" />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card className="text-center">
          <p className="text-2xl font-display font-bold text-red-600">₹{totalPending.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Total Pending</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-display font-bold text-emerald-600">{paid.length}</p>
          <p className="text-xs text-gray-500 mt-1">Paid</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-display font-bold text-orange-600">{pending.length}</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </Card>
      </div>

      {pending.length > 0 && (
        <div className="mb-5">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white mb-3">Pending Dues</h3>
          <div className="space-y-3">
            {pending.map((d, i) => (
              <Card key={i} className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{d.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Due: {d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-IN') : '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600 text-lg">₹{d.amount.toLocaleString()}</p>
                    <Badge color="orange">{d.category}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white mb-3">Payment History</h3>
        <Card padding={false}>
          <Table headers={['Description', 'Category', 'Amount', 'Paid On', 'Receipt', 'Status']}>
            {paid.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">{d.description}</td>
                <td className="py-3 px-4"><Badge color="blue">{d.category}</Badge></td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-800 dark:text-gray-200">₹{d.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{d.paidDate ? new Date(d.paidDate).toLocaleDateString('en-IN') : '—'}</td>
                <td className="py-3 px-4 text-xs font-mono text-indigo-600 dark:text-indigo-400">{d.receiptNumber}</td>
                <td className="py-3 px-4"><Badge color="green">Paid</Badge></td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </motion.div>
  );
};

// ======================== CANTEEN PAGE ========================
export const CanteenPage = () => {
  const [canteen, setCanteen] = useState(null);
  const [prefs, setPrefs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const meals = ['breakfast','lunch','dinner'];
  const options = ['Veg','Non-Veg','Skip'];
  const optionColors = { Veg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', 'Non-Veg': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', Skip: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' };

  useEffect(() => {
    canteenAPI.get().then(r => {
      setCanteen(r.data.canteen);
      if (r.data.canteen?.preferences) {
        const p = {};
        r.data.canteen.preferences.forEach(d => { p[d.day] = { breakfast: d.breakfast, lunch: d.lunch, dinner: d.dinner }; });
        setPrefs(p);
      }
    }).finally(() => setLoading(false));
  }, []);

  const setOption = (day, meal, val) => {
    setPrefs(prev => ({ ...prev, [day]: { ...(prev[day] || {}), [meal]: val } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const preferences = days.map(d => ({ day: d, ...(prefs[d] || { breakfast: 'Veg', lunch: 'Veg', dinner: 'Veg' }) }));
      await canteenAPI.save({ preferences });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Canteen" subtitle="Weekly food preference registration"
        action={<Button onClick={handleSave} disabled={saving} variant={saved ? 'success' : 'primary'}>
          {saved ? <><CheckCircle size={14} /> Saved!</> : saving ? 'Saving...' : 'Save Preferences'}
        </Button>}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Day</th>
              {meals.map(m => <th key={m} className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide capitalize">{m}</th>)}
            </tr>
          </thead>
          <tbody className="space-y-2">
            {days.map(day => (
              <tr key={day} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">{day}</td>
                {meals.map(meal => (
                  <td key={meal} className="py-3 px-4">
                    <div className="flex gap-1.5 justify-center flex-wrap">
                      {options.map(opt => (
                        <button key={opt} onClick={() => setOption(day, meal, opt)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${prefs[day]?.[meal] === opt ? optionColors[opt] + ' border-current' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// ======================== FEEDBACK PAGE ========================
export const FeedbackPage = () => {
  const [submitted, setSubmitted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(null);
  const [ratings, setRatings] = useState({ teachingStyle: 0, punctuality: 0, clarity: 0, interaction: 0, overall: 0 });
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subjects = [
    { code: 'CS601', name: 'Machine Learning', faculty: 'Dr. A. Kumar' },
    { code: 'CS602', name: 'Computer Networks', faculty: 'Prof. B. Singh' },
    { code: 'CS603', name: 'Database Systems', faculty: 'Dr. C. Nair' },
    { code: 'CS604', name: 'Operating Systems', faculty: 'Dr. D. Verma' },
  ];

  useEffect(() => {
    feedbackAPI.get().then(r => setSubmitted(r.data.feedback?.map(f => f.subject) || [])).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!activeSubject) return;
    setSubmitting(true);
    try {
      const sub = subjects.find(s => s.code === activeSubject);
      await feedbackAPI.submit({ subject: sub?.name, faculty: { name: sub?.faculty }, ratings, comments, semester: 6 });
      setSubmitted([...submitted, sub?.name]);
      setActiveSubject(null);
      setRatings({ teachingStyle: 0, punctuality: 0, clarity: 0, interaction: 0, overall: 0 });
      setComments('');
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const ratingFields = [
    { key: 'teachingStyle', label: 'Teaching Style' },
    { key: 'punctuality', label: 'Punctuality' },
    { key: 'clarity', label: 'Subject Clarity' },
    { key: 'interaction', label: 'Student Interaction' },
    { key: 'overall', label: 'Overall Rating' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Faculty Feedback" subtitle="Rate your faculty to help improve teaching quality" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {subjects.map(sub => {
          const isDone = submitted.includes(sub.name);
          const isActive = activeSubject === sub.code;
          return (
            <Card key={sub.code} className={`cursor-pointer transition-all ${isActive ? 'ring-2 ring-indigo-500' : ''} ${isDone ? 'opacity-70' : ''}`}
              onClick={() => !isDone && setActiveSubject(isActive ? null : sub.code)}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                  <Star size={16} className="text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{sub.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{sub.faculty}</p>
                </div>
                {isDone ? <Badge color="green"><CheckCircle size={10} className="mr-1" />Submitted</Badge>
                  : <Badge color={isActive ? 'indigo' : 'gray'}>{isActive ? 'Rating...' : 'Pending'}</Badge>}
              </div>

              <AnimatePresence>
                {isActive && !isDone && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="space-y-3 mb-4">
                      {ratingFields.map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400 w-32">{label}</span>
                          <StarRating value={ratings[key]} onChange={v => setRatings(prev => ({ ...prev, [key]: v }))} />
                        </div>
                      ))}
                    </div>
                    <textarea value={comments} onChange={e => setComments(e.target.value)} rows={2}
                      placeholder="Optional comments..."
                      className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-3" />
                    <Button onClick={handleSubmit} disabled={submitting || Object.values(ratings).some(v => v === 0)} className="w-full justify-center">
                      <Send size={13} /> {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
};
