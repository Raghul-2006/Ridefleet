import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Home, Mail, Share2, Clock, Calendar, Copy, Check } from 'lucide-react'

const Confetti = () => {
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    angle: Math.random() * 360,
    distance: 100 + Math.random() * 200
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            x: Math.cos((item.angle * Math.PI) / 180) * item.distance,
            y: -item.distance
          }}
          transition={{ duration: item.duration, delay: item.delay, ease: 'easeOut' }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][Math.floor(Math.random() * 5)]
          }}
        />
      ))}
    </div>
  )
}

const ConfirmationScreen = ({ bookingId, booking, onBackHome }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4 transition-colors duration-500"
    >
      <Confetti />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Main Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-primary via-primary to-[#001c4a] dark:from-white/10 dark:via-white/5 dark:to-white/5 border border-accent-start/30 dark:border-white/10 rounded-[48px] p-8 md:p-12 shadow-2xl text-white"
        >
          {/* Success Icon with Animation */}
          <motion.div
            variants={itemVariants}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
            className="flex justify-center mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                <CheckCircle size={56} className="text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-emerald-400 opacity-50"
              />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-heading font-black mb-4 tracking-tighter uppercase italic\">
              Reservation<span className=\"text-emerald-400\"> Confirmed</span>
            </h1>
            <p className="text-lg text-white/80 font-bold uppercase tracking-widest text-[10px]\">Your premium journey awaits</p>
          </motion.div>

          {/* Booking ID Card */}
          <motion.div
            variants={itemVariants}
            className="mb-10 bg-white/10 dark:bg-black/40 rounded-[32px] border border-white/20 dark:border-white/10 p-8 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300"
          >
            <p className=\"text-emerald-300 text-[10px] font-black uppercase tracking-[0.3em] mb-3\">Your Booking Reference</p>
            <div className=\"flex items-center justify-between gap-4\">
              <p className=\"text-white text-4xl font-heading font-black tracking-wider font-mono\">{bookingId}</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className=\"p-4 bg-white/10 hover:bg-emerald-500/20 rounded-2xl transition-all border border-white/20 hover:border-emerald-400/50\"
                title=\"Copy booking ID\"
                aria-label=\"Copy booking ID\"
              >
                {copied ? (
                  <Check className=\"w-6 h-6 text-emerald-400\" />
                ) : (
                  <Copy className=\"w-6 h-6 text-white/60 hover:text-emerald-400\" />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Booking Details Grid */}
          {booking && (
            <motion.div variants={itemVariants} className=\"mb-10 grid grid-cols-2 md:grid-cols-3 gap-4\">
              <div className=\"bg-white/5 dark:bg-black/30 rounded-[28px] p-6 border border-white/10 hover:border-white/20 transition-all\">
                <p className=\"text-white/60 text-[9px] uppercase font-black tracking-[0.2em] mb-3\">Vehicle</p>
                <p className=\"font-heading font-black text-emerald-300 text-lg\">
                  {booking.car || booking.vehicle || 'Elite Sedan'}
                </p>
              </div>
              <div className=\"bg-white/5 dark:bg-black/30 rounded-[28px] p-6 border border-white/10 hover:border-white/20 transition-all\">
                <p className=\"text-white/60 text-[9px] uppercase font-black tracking-[0.2em] mb-3\">Duration</p>
                <p className=\"font-heading font-black text-emerald-300 text-lg\">
                  {booking.duration || booking.days || 3} <span className=\"text-[10px] text-white/40\">days</span>
                </p>
              </div>
              <div className=\"bg-white/5 dark:bg-black/30 rounded-[28px] p-6 border border-white/10 hover:border-white/20 transition-all\">
                <p className=\"text-white/60 text-[9px] uppercase font-black tracking-[0.2em] mb-3\">Amount</p>
                <p className=\"font-heading font-black text-emerald-300 text-xl\">₹{booking.totalPrice || booking.total || '—'}</p>
              </div>
            </motion.div>
          )}

          {/* What Happens Next */}
          <motion.div variants={itemVariants} className=\"mb-10\">
            <h3 className=\"text-2xl font-heading font-black text-white mb-6 uppercase tracking-tighter italic\">\n              What's Next?\n            </h3>
            <div className=\"space-y-3\">
              {[
                { num: 1, text: 'Confirmation email with full details', delay: 0.05 },
                { num: 2, text: '24-hour reminder before pickup date', delay: 0.1 },
                { num: 3, text: 'Arrive early for vehicle inspection', delay: 0.15 },
                { num: 4, text: 'Complete docs and enjoy your ride', delay: 0.2 }
              ].map((step) => (
                <motion.div
                  key={step.num}
                  variants={itemVariants}
                  transition={{ delay: step.delay }}
                  className=\"flex items-start gap-4 p-4 bg-white/5 dark:bg-black/30 rounded-2xl border border-white/10 hover:border-emerald-400/30 hover:bg-emerald-500/5 transition-all\"
                >
                  <div className=\"flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center\">
                    <span className=\"text-emerald-300 font-black text-sm\">{step.num}</span>
                  </div>
                  <p className=\"text-white/80 pt-1 font-semibold\">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            variants={itemVariants}
            className=\"mb-10 p-6 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/30 dark:border-emerald-500/20 rounded-[28px] backdrop-blur-sm\"
          >
            <p className=\"text-emerald-200 text-sm font-bold leading-relaxed\">
              <span className=\"inline-block mr-2\">📧</span>
              Confirmation details sent to your email. Save your booking ID for reference and easy access to your reservation.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-8\"
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className=\"flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 dark:hover:bg-white/10 border border-white/20 text-white py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest\"
            >
              <Mail className=\"w-5 h-5\" />
              Receipt
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className=\"flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 dark:hover:bg-white/10 border border-white/20 text-white py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest\"
            >
              <Share2 className=\"w-5 h-5\" />
              Share
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackHome}
              className=\"flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/50 text-primary py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest\"
            >
              <Home className=\"w-5 h-5\" />
              Continue
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className=\"text-center text-white/50 text-sm font-bold tracking-wider\"
          >
            Questions? Contact <span className=\"text-emerald-300 cursor-pointer hover:text-emerald-200 transition-colors\">RideFleet Support</span> • Available 24/7
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default ConfirmationScreen
