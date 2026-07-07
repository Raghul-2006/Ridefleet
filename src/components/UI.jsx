import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  iconBefore, 
  iconAfter,
  isLoading = false,
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-sm',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700',
    ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800',
    outline: 'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white',
    orange: 'bg-brand-orange text-white hover:bg-brand-orange/90 shadow-sm',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : iconBefore && <span className="icon-rounded mr-2">{iconBefore}</span>}
      {children}
      {!isLoading && iconAfter && <span className="icon-rounded ml-2">{iconAfter}</span>}
    </button>
  );
};

export const Input = ({ label, icon, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 ml-1">{label}</label>}
      <div className="relative group">
        {icon && (
          <span className="icon-rounded absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-blue transition-colors">
            {icon}
          </span>
        )}
        <input
          className={`
            w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2 px-3 transition-all duration-200
            focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none
            placeholder:text-neutral-400 text-neutral-900 dark:text-neutral-100 text-sm
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-rose-500 focus:ring-rose-500/10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

export const Select = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 ml-1">{label}</label>}
      <select
        className={`
          w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-2 px-3 transition-all duration-200
          focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none
          text-neutral-900 dark:text-neutral-100 text-sm
          ${error ? 'border-rose-500 focus:ring-rose-500/10' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

export const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    info: 'bg-brand-blue/10 text-brand-blue',
    success: 'bg-emerald-500/10 text-emerald-600',
    warning: 'bg-brand-orange/10 text-brand-orange',
    error: 'bg-rose-500/10 text-rose-600',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`
      bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 transition-all duration-200
      ${hover ? 'hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                <span className="icon-rounded text-2xl">close</span>
              </button>
            </div>
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-neutral-900 shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                <span className="icon-rounded text-2xl">close</span>
              </button>
            </div>
            <div className="p-6 h-full overflow-y-auto pb-24">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Skeleton = ({ className = '', circle = false }) => {
  return (
    <div 
      className={`
        relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 
        ${circle ? 'rounded-full' : 'rounded-lg'} 
        ${className}
      `}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent shadow-[20px_0_20px_rgba(255,255,255,0.1)]" />
    </div>
  );
};

export const Toast = ({ message, type = 'info', onHide }) => {
  useEffect(() => {
    const timer = setTimeout(onHide, 3000);
    return () => clearTimeout(timer);
  }, [onHide]);

  const variants = {
    info: 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900',
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed bottom-8 right-8 z-[60] px-6 py-3 rounded-xl font-bold shadow-xl ${variants[type]}`}
    >
      {message}
    </motion.div>
  );
};

export const StatusBadge = ({ status }) => {
  const statusVariants = {
    available: { variant: 'success', label: 'Available' },
    booked: { variant: 'warning', label: 'Booked' },
    maintenance: { variant: 'error', label: 'Maintenance' },
    active: { variant: 'info', label: 'Active' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'error', label: 'Cancelled' }
  };

  const { variant, label } = statusVariants[status.toLowerCase()] || { variant: 'info', label: status };

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
};

