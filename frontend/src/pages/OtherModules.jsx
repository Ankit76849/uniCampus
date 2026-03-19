import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Globe, FileText, Shield, Mail, Bell, Sun, Briefcase, ClipboardCheck,
  MessageSquare, Download, Upload, Trash2, Eye, Plus, Send, CheckCircle,
  AlertTriangle, Search, Filter
} from 'lucide-react';
import {
  eventsAPI, resourcesAPI, documentsAPI, inboxAPI,
  notificationsAPI, holidaysAPI, practiceSchoolAPI, examAPI
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, Badge, Button, Modal, LoadingSpinner, EmptyState } from '../components/UI';

// ======================== EVENTS PAGE ========================
export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsAPI.get().then(r => setEvents(r.data.events || [])).finally(() => setLoading(false));
  }, []);

  const categoryColor = { Cultural: 'purple', Technical: 'blue', Sports: 'green', Academic: 'indigo', Other: 'gray' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Events" subtitle="Upcoming college events and activities" />
      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Card padding={false} className="overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-indigo-400 to-purple-600 relative flex items-end">
                  {event.poster && (
                    <img src={event.poster} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="relative p-3">
                    <Badge color={categoryColor[event.category] || 'gray'}>{event.category}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">{event.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{event.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{event.location}</p>
                    </div>
                    {event.registrationLink && (
                      <Button size="sm" variant="outline">Register</Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          {events.length === 0 && <div className="col-span-3"><EmptyState icon={Globe} title="No upcoming events" /></div>}
        </div>
      )}
    </motion.div>
  );
};

// ======================== STUDY RESOURCES PAGE ========================
export const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ subject: '', type: '' });

  useEffect(() => {
    resourcesAPI.get(filter).then(r => setResources(r.data.resources || [])).finally(() => setLoading(false));
  }, []);

  const typeColors = { Notes: 'indigo', PYQ: 'purple', 'Lab Manual': 'green', Reference: 'blue', Assignment: 'orange' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Study Resources" subtitle="Notes, PYQs, and reference materials" />

      <div className="flex gap-3 mb-5 flex-wrap">
        {['', 'Notes', 'PYQ', 'Lab Manual', 'Reference'].map(t => (
          <button key={t} onClick={() => setFilter(f => ({ ...f, type: t }))}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${filter.type === t ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>
            {t || 'All'}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res, i) => (
            <motion.div key={i} whileHover={{ y: -1 }}>
              <Card>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{res.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{res.subject} • Sem {res.semester}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge color={typeColors[res.type] || 'gray'}>{res.type}</Badge>
                    <span className="text-xs text-gray-400">{res.fileSize}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">{res.downloads}</span>
                    <button className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          {resources.length === 0 && <div className="col-span-3"><EmptyState icon={FileText} title="No resources found" /></div>}
        </div>
      )}
    </motion.div>
  );
};

// ======================== DOCUMENT VAULT PAGE ========================
export const VaultPage = () => {
  const [vault, setVault] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Aadhar' });

  useEffect(() => {
    documentsAPI.get().then(r => setVault(r.data.vault)).finally(() => setLoading(false));
  }, []);

  const handleUpload = async () => {
    try {
      await documentsAPI.upload(form);
      const res = await documentsAPI.get();
      setVault(res.data.vault);
      setShowModal(false);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    await documentsAPI.delete(docId);
    const res = await documentsAPI.get();
    setVault(res.data.vault);
  };

  const docs = vault?.documents || [];
  const typeIcons = { Aadhar: '🪪', PAN: '💳', 'Driving License': '🚗', Certificate: '📜', Marksheet: '📋', Other: '📄' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Document Vault" subtitle="Secure personal document storage"
        action={<Button onClick={() => setShowModal(true)}><Upload size={14} /> Upload</Button>}
      />

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {docs.map((doc, i) => (
            <Card key={i} className="text-center group">
              <div className="text-4xl mb-3">{typeIcons[doc.type] || '📄'}</div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{doc.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{doc.type}</p>
              <p className="text-xs text-gray-400 mt-0.5">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-IN') : '—'}</p>
              <div className="flex gap-2 mt-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-100 transition-colors">
                  <Eye size={12} />
                </button>
                <button onClick={() => handleDelete(doc._id)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </Card>
          ))}
          {docs.length === 0 && <div className="col-span-4"><EmptyState icon={Shield} title="No documents" description="Upload your personal documents securely." /></div>}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Document">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Document Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Aadhar Card Front"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Document Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {['Aadhar','PAN','Driving License','Certificate','Marksheet','Other'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <Upload size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Click to select or drag & drop</p>
            <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG up to 10MB</p>
          </div>
          <Button onClick={handleUpload} className="w-full justify-center">Save Document</Button>
        </div>
      </Modal>
    </motion.div>
  );
};

// ======================== INBOX PAGE ========================
export const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inboxAPI.get().then(r => setMessages(r.data.messages || [])).finally(() => setLoading(false));
  }, []);

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      await inboxAPI.markRead(msg._id);
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
    }
  };

  const roleColors = { Faculty: 'indigo', Admin: 'blue', HOD: 'purple', Principal: 'red' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Inbox" subtitle="Messages from faculty and administration" />
      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} onClick={() => handleSelect(msg)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${selected?._id === msg._id ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'} ${!msg.isRead ? 'border-l-4 border-l-indigo-500' : ''}`}>
                <div className="flex items-start gap-2 mb-1">
                  <p className="flex-1 font-semibold text-xs text-gray-900 dark:text-white truncate">{msg.subject}</p>
                  {!msg.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-0.5" />}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{msg.sender}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            ))}
            {messages.length === 0 && <EmptyState icon={Mail} title="No messages" />}
          </div>
          <div className="lg:col-span-3">
            {selected ? (
              <Card>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 text-sm font-bold text-indigo-600">
                    {selected.sender[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">{selected.subject}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{selected.sender}</p>
                    <div className="flex gap-2 mt-1">
                      {selected.senderRole && <Badge color={roleColors[selected.senderRole] || 'gray'}>{selected.senderRole}</Badge>}
                      <span className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selected.message}</p>
                </div>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center">
                <EmptyState icon={Mail} title="Select a message" description="Click on a message to read it." />
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ======================== NOTIFICATIONS PAGE ========================
export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsAPI.get().then(r => setNotifications(r.data.notifications || [])).finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await notificationsAPI.markRead(id);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const typeIcon = { Attendance: '📊', Dues: '💳', Exam: '📝', Library: '📚', Event: '🎉', General: '📢', Alert: '⚠️' };
  const priorityColor = { Critical: 'red', High: 'orange', Medium: 'blue', Low: 'gray' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Notifications" subtitle="Alerts and important updates" />
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`flex items-start gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${!n.isRead ? 'border-l-4 border-l-indigo-500' : ''}`}
                onClick={() => !n.isRead && markRead(n._id)}>
                <span className="text-2xl flex-shrink-0 mt-0.5">{typeIcon[n.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                    <Badge color={priorityColor[n.priority] || 'gray'}>{n.priority}</Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                </div>
              </Card>
            </motion.div>
          ))}
          {notifications.length === 0 && <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />}
        </div>
      )}
    </motion.div>
  );
};

// ======================== HOLIDAYS PAGE ========================
export const HolidaysPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    holidaysAPI.get().then(r => setHolidays(r.data.holidays || [])).finally(() => setLoading(false));
  }, []);

  const typeColors = { National: 'indigo', Regional: 'blue', Festival: 'orange', College: 'green', Restricted: 'yellow' };
  const months = [...new Set(holidays.map(h => new Date(h.date).toLocaleString('default', { month: 'long', year: 'numeric' })))];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Holiday List" subtitle={`Academic Year 2024-25 — ${holidays.length} holidays`} />
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-6">
          {months.map(month => {
            const monthHols = holidays.filter(h => new Date(h.date).toLocaleString('default', { month: 'long', year: 'numeric' }) === month);
            return (
              <div key={month}>
                <h3 className="font-display font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Sun size={15} className="text-amber-500" /> {month}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {monthHols.map((h, i) => (
                    <Card key={i} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-amber-600 leading-none">{new Date(h.date).getDate()}</span>
                        <span className="text-xs text-amber-400">{new Date(h.date).toLocaleString('default', { weekday: 'short' })}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{h.name}</p>
                        {h.description && <p className="text-xs text-gray-500">{h.description}</p>}
                      </div>
                      <Badge color={typeColors[h.type] || 'gray'}>{h.type}</Badge>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

// ======================== PRACTICE SCHOOL PAGE ========================
export const PracticeSchoolPage = () => {
  const [ps, setPs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    practiceSchoolAPI.get().then(r => setPs(r.data.practiceSchool)).finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Practice School" subtitle="Internship and industry training details" />
      {loading ? <LoadingSpinner /> : ps ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <Briefcase size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{ps.company}</p>
                <p className="text-xs text-gray-500">{ps.role}</p>
              </div>
            </div>
            {[
              { label: 'Location', value: ps.location },
              { label: 'Duration', value: `${ps.startDate ? new Date(ps.startDate).toLocaleDateString('en-IN') : '—'} to ${ps.endDate ? new Date(ps.endDate).toLocaleDateString('en-IN') : '—'}` },
              { label: 'Stipend', value: ps.stipend ? `₹${ps.stipend.toLocaleString()}/month` : '—' },
              { label: 'Status', value: ps.status },
              { label: 'Grade', value: ps.grade || '—' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</span>
              </div>
            ))}
          </Card>
          <Card>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-4">Industry Mentor</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold">
                {ps.mentor?.name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{ps.mentor?.name}</p>
                <p className="text-xs text-gray-500">{ps.mentor?.email}</p>
                <p className="text-xs text-gray-500">{ps.mentor?.phone}</p>
              </div>
            </div>
            <Badge color={ps.status === 'Completed' ? 'green' : ps.status === 'Ongoing' ? 'blue' : 'gray'}>
              {ps.status}
            </Badge>
          </Card>
        </div>
      ) : (
        <EmptyState icon={Briefcase} title="No internship assigned" description="Your practice school details will appear here once assigned." />
      )}
    </motion.div>
  );
};

// ======================== EXAM REGISTRATION PAGE ========================
export const ExamRegistrationPage = () => {
  const { student } = useAuth();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const subjects = [
    { subjectCode: 'CS601', subjectName: 'Machine Learning', credits: 4, type: 'Regular' },
    { subjectCode: 'CS602', subjectName: 'Computer Networks', credits: 4, type: 'Regular' },
    { subjectCode: 'CS603', subjectName: 'Database Systems', credits: 4, type: 'Regular' },
    { subjectCode: 'CS604', subjectName: 'Operating Systems', credits: 3, type: 'Regular' },
    { subjectCode: 'CS605', subjectName: 'Software Engineering', credits: 3, type: 'Regular' },
    { subjectCode: 'CS606', subjectName: 'Cloud Computing', credits: 3, type: 'Regular' },
  ];

  useEffect(() => {
    examAPI.getRegistration().then(r => setRegistration(r.data.registration)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await examAPI.submitRegistration({
        semester: student?.semester, examType: 'Regular', registeredSubjects: subjects, examFee: 1500
      });
      setRegistration(res.data.registration);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const statusColors = { Draft: 'gray', Submitted: 'blue', Approved: 'green', AdmitCardGenerated: 'indigo' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Exam Registration" subtitle={`Semester ${student?.semester} — End Semester Examination`} />

      {registration?.status && (
        <div className="mb-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle size={16} className="text-blue-500" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Registration Status: <strong>{registration.status}</strong>
            {registration.examFee && ` • Exam Fee: ₹${registration.examFee} (${registration.paymentStatus})`}
          </p>
        </div>
      )}

      <Card className="mb-5">
        <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white mb-4">Subjects for Registration</h3>
        <div className="space-y-2">
          {subjects.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.subjectName}</p>
                <p className="text-xs text-gray-500">{s.subjectCode} • {s.credits} Credits</p>
              </div>
              <Badge color="green">{s.type}</Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits: <strong>{subjects.reduce((s, sub) => s + sub.credits, 0)}</strong></p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Exam Fee: <strong>₹1,500</strong></p>
          </div>
          {!registration || registration.status === 'Draft' ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Registration'}
            </Button>
          ) : (
            <Badge color={statusColors[registration.status] || 'gray'}>{registration.status}</Badge>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// ======================== ANTI RAGGING PAGE ========================
export const AntiRaggingPage = () => {
  const [form, setForm] = useState({ incident: '', date: '', location: '', description: '', contact: '' });
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Anti-Ragging" subtitle="Report incidents and learn about your rights" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {[
          { title: 'Zero Tolerance Policy', icon: '🚫', desc: 'Our institution maintains a strict zero-tolerance policy against ragging in any form.' },
          { title: 'Immediate Action', icon: '⚡', desc: 'All complaints are investigated within 24 hours and strict action is taken against offenders.' },
          { title: 'Confidentiality', icon: '🔒', desc: 'Your identity is completely protected. All reports are handled with strict confidentiality.' },
          { title: 'Support System', icon: '🤝', desc: 'Counseling and mental health support is available 24/7 for affected students.' },
        ].map((item, i) => (
          <Card key={i} className="flex items-start gap-3">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">Emergency Contacts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Anti-Ragging Helpline', number: '1800-180-5522', color: 'red' },
            { label: 'Campus Security', number: '+91 80 4567 8900', color: 'blue' },
            { label: 'Student Welfare Officer', number: '+91 80 4567 8901', color: 'green' },
          ].map((c, i) => (
            <div key={i} className={`p-3 rounded-xl bg-${c.color}-50 dark:bg-${c.color}-900/20 border border-${c.color}-100 dark:border-${c.color}-800`}>
              <p className="text-xs text-gray-500 mb-0.5">{c.label}</p>
              <p className="font-bold text-gray-900 dark:text-white">{c.number}</p>
            </div>
          ))}
        </div>

        <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white mb-4">File a Complaint</h3>
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle size={40} className="text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-900 dark:text-white">Complaint Submitted</p>
            <p className="text-sm text-gray-500 mt-1">Your complaint has been received. We will take action within 24 hours.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { label: 'Type of Incident', key: 'incident', type: 'select', options: ['Physical Ragging', 'Verbal Abuse', 'Cyberbullying', 'Harassment', 'Other'] },
              { label: 'Date of Incident', key: 'date', type: 'date' },
              { label: 'Location', key: 'location', type: 'text', placeholder: 'Where did it happen?' },
              { label: 'Description', key: 'description', type: 'textarea', placeholder: 'Describe the incident in detail...' },
              { label: 'Contact (optional)', key: 'contact', type: 'text', placeholder: 'Phone or email for follow-up' },
            ].map(({ label, key, type, options, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">{label}</label>
                {type === 'select' ? (
                  <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select type</option>
                    {options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : type === 'textarea' ? (
                  <textarea value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} rows={3} placeholder={placeholder}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                ) : (
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                )}
              </div>
            ))}
            <Button onClick={() => setSubmitted(true)} variant="danger">
              <Send size={14} /> Submit Complaint Confidentially
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
