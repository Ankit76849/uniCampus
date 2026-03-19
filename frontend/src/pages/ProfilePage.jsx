import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Heart, Book, Users, Save, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { PageHeader, Card, Button, Badge } from '../components/UI';

const InfoRow = ({ label, value }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
    <span className="text-xs text-gray-500 dark:text-gray-400 w-36 flex-shrink-0 mt-0.5">{label}</span>
    <span className="text-sm text-gray-800 dark:text-gray-200 font-medium flex-1">{value || '—'}</span>
  </div>
);

const ProfilePage = () => {
  const { student, updateStudent } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: student?.phone || '', localGuardianPhone: student?.localGuardianPhone || '', address: student?.address || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateStudent(res.data.student);
      setEditing(false);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const avatarInitials = student?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="My Profile" subtitle="View and manage your personal information" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Avatar card */}
        <Card className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
            {avatarInitials}
          </div>
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">{student?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{student?.email}</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <Badge color="indigo">{student?.program}</Badge>
            <Badge color="blue">{student?.branch}</Badge>
            <Badge color="purple">Sem {student?.semester}</Badge>
          </div>
          <div className="mt-4 w-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Reg. No.</span>
              <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{student?.registrationNumber}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Roll No.</span>
              <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{student?.rollNumber}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Section</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{student?.section || '—'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Year</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{student?.year}{student?.year === 1 ? 'st' : student?.year === 2 ? 'nd' : student?.year === 3 ? 'rd' : 'th'} Year</span>
            </div>
          </div>
        </Card>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-indigo-500" />
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Personal Information</h3>
            </div>
            <InfoRow label="Full Name" value={student?.name} />
            <InfoRow label="Date of Birth" value={student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
            <InfoRow label="Gender" value={student?.gender} />
            <InfoRow label="Blood Group" value={student?.bloodGroup} />
            <InfoRow label="Religion" value={student?.religion} />
            <InfoRow label="Caste" value={student?.caste} />
          </Card>

          {/* Contact - editable */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-indigo-500" />
                <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Contact Information</h3>
              </div>
              <Button variant={editing ? 'secondary' : 'outline'} size="sm" onClick={() => setEditing(!editing)}>
                <Edit2 size={13} /> {editing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
            {editing ? (
              <div className="space-y-3">
                {[
                  { label: 'Phone Number', key: 'phone', type: 'tel' },
                  { label: 'Local Guardian Phone', key: 'localGuardianPhone', type: 'tel' },
                  { label: 'Address', key: 'address', type: 'textarea' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">{label}</label>
                    {type === 'textarea' ? (
                      <textarea
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                      />
                    ) : (
                      <input
                        type={type}
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    )}
                  </div>
                ))}
                <Button onClick={handleSave} disabled={saving} className="mt-1">
                  <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            ) : (
              <>
                <InfoRow label="Phone" value={student?.phone} />
                <InfoRow label="Guardian Phone" value={student?.localGuardianPhone} />
                <InfoRow label="Address" value={student?.address} />
                <InfoRow label="Email" value={student?.email} />
              </>
            )}
          </Card>

          {/* Family */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Users size={16} className="text-indigo-500" />
                <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Father's Details</h3>
              </div>
              <InfoRow label="Name" value={student?.father?.name} />
              <InfoRow label="Phone" value={student?.father?.phone} />
              <InfoRow label="Occupation" value={student?.father?.occupation} />
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Heart size={16} className="text-pink-500" />
                <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Mother's Details</h3>
              </div>
              <InfoRow label="Name" value={student?.mother?.name} />
              <InfoRow label="Phone" value={student?.mother?.phone} />
              <InfoRow label="Occupation" value={student?.mother?.occupation} />
            </Card>
          </div>

          {/* Faculty Advisor */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Book size={16} className="text-indigo-500" />
              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Faculty Advisor</h3>
            </div>
            <InfoRow label="Name" value={student?.facultyAdvisor?.name} />
            <InfoRow label="Phone" value={student?.facultyAdvisor?.phone} />
            <InfoRow label="Email" value={student?.facultyAdvisor?.email} />
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
