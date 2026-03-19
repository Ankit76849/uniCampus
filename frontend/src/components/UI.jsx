import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Stat Card
export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo', trend, onClick }) => {
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-emerald-500 to-emerald-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
  };
  const bgMap = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
    green: 'bg-emerald-50 dark:bg-emerald-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
  };
  return (
    <motion.div
      whileHover={{ y: -2, shadow: 'lg' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="mt-1.5 text-2xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last semester
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${bgMap[color]} flex items-center justify-center flex-shrink-0`}>
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
            <Icon size={14} className="text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Page Header
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

// Card
export const Card = ({ children, className = '', padding = true }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm ${padding ? 'p-5' : ''} ${className}`}>
    {children}
  </div>
);

// Badge
export const Badge = ({ children, color = 'gray' }) => {
  const colorMap = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[color]}`}>
      {children}
    </span>
  );
};

// Progress Bar
export const ProgressBar = ({ value, max = 100, color = 'indigo', showLabel = true }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colorMap = {
    indigo: 'bg-indigo-500',
    green: 'bg-emerald-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-400',
  };
  const trackColor = pct < 75 ? (pct < 60 ? 'bg-red-500' : 'bg-orange-500') : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color === 'auto' ? trackColor : colorMap[color]}`}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-9 text-right">{pct}%</span>}
    </div>
  );
};

// Loading spinner
export const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <Loader2 size={32} className="animate-spin text-indigo-500" />
    <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
  </div>
);

// Empty State
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
    )}
    <p className="font-semibold text-gray-700 dark:text-gray-300">{title}</p>
    {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// Button
export const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', type = 'button' }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 dark:shadow-none',
    secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-medium rounded-xl transition-all duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Modal
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full ${sizeMap[size]} bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
};

// Table
export const Table = ({ headers, children, className = '' }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 dark:border-gray-700">
          {headers.map((h, i) => (
            <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
        {children}
      </tbody>
    </table>
  </div>
);

// Star Rating
export const StarRating = ({ value, onChange, max = 5 }) => (
  <div className="flex gap-1">
    {Array.from({ length: max }).map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onChange && onChange(i + 1)}
        className={`text-xl transition-colors ${i < value ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} ${onChange ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}
      >
        ★
      </button>
    ))}
  </div>
);

// Section title
export const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-base font-display font-semibold text-gray-900 dark:text-white">{title}</h2>
    {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
  </div>
);
