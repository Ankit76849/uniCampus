import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, BookOpen, Calendar, BarChart2, ClipboardList,
  Award, Library, Home, CreditCard, Utensils, MessageSquare, Star,
  Bell, Sun, FileText, Briefcase, ClipboardCheck, Shield, ChevronLeft,
  ChevronRight, GraduationCap, Mail, Globe
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/academics', icon: BookOpen, label: 'Academics' },
  { path: '/timetable', icon: Calendar, label: 'Timetable' },
  { path: '/attendance', icon: BarChart2, label: 'Attendance' },
  { path: '/exam-schedule', icon: ClipboardList, label: 'Exam Schedule' },
  { path: '/results', icon: Award, label: 'Results' },
  { path: '/library', icon: Library, label: 'Library' },
  { path: '/hostel', icon: Home, label: 'Hostel' },
  { path: '/dues', icon: CreditCard, label: 'Dues' },
  { path: '/canteen', icon: Utensils, label: 'Canteen' },
  { path: '/feedback', icon: Star, label: 'Faculty Feedback' },
  { path: '/events', icon: Globe, label: 'Events' },
  { path: '/resources', icon: FileText, label: 'Study Resources' },
  { path: '/vault', icon: Shield, label: 'Doc Vault' },
  { path: '/inbox', icon: Mail, label: 'Inbox' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/holidays', icon: Sun, label: 'Holiday List' },
  { path: '/practice-school', icon: Briefcase, label: 'Practice School' },
  { path: '/exam-registration', icon: ClipboardCheck, label: 'Exam Registration' },
  { path: '/anti-ragging', icon: MessageSquare, label: 'Anti Ragging' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <GraduationCap size={20} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="font-display font-bold text-gray-900 dark:text-white text-sm leading-tight whitespace-nowrap">UniCampus</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 whitespace-nowrap">Student Portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : ''}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"
                  transition={{ duration: 0.2 }}
                />
              )}
              <Icon size={18} className={`flex-shrink-0 relative z-10 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="truncate relative z-10 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
