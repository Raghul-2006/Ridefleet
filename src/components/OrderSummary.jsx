import React from 'react'
import { motion } from 'framer-motion'
import { DollarSign, CheckCircle } from 'lucide-react'

const OrderSummary = ({ vehicle, days, basePrice, addons, addonPrices, taxes, totalPrice, promoDiscount = 0 }) => {
  const addonsList = Object.keys(addons).filter(key => addons[key])
  const addonsTotal = addonsList.reduce((sum, key) => sum + (addonPrices[key] || 0), 0)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=\"bg-primary-light dark:bg-white/5 rounded-[40px] p-8 border border-primary/5 dark:border-white/5 sticky top-24 shadow-2xl transition-colors duration-500\"
    >
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className=\"text-2xl font-heading font-black text-primary dark:text-white mb-8 uppercase tracking-tighter italic\"
      >
        Order Summary
      </motion.h3>
      
      {vehicle && (
        <div className=\"space-y-6\">
          {/* Vehicle & Duration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className=\"pb-6 border-b border-primary/10 dark:border-white/10\"
          >
            <div className=\"flex justify-between items-start mb-4\">
              <div>
                <p className=\"font-heading font-black text-primary dark:text-white uppercase tracking-tight mb-1\">{vehicle.name}</p>
                <p className=\"text-[10px] font-bold text-primary/40 dark:text-white/30 uppercase tracking-widest\">For {days} day{days > 1 ? 's' : ''}</p>
              </div>
              <span className=\"text-2xl font-heading font-black text-accent-start\">₹{basePrice.toLocaleString('en-IN')}</span>
            </div>
            <p className=\"text-[10px] font-bold text-primary/40 dark:text-white/30 uppercase tracking-widest\">@ ₹{vehicle.dailyRate?.toLocaleString('en-IN')}/day</p>
          </motion.div>

          {/* Add-ons */}
          {addonsList.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className=\"pb-6 border-b border-primary/10 dark:border-white/10\"
            >
              <p className=\"text-[10px] font-black text-primary/40 dark:text-white/30 uppercase tracking-[0.3em] mb-4\">Add-ons & Upgrades</p>
              <div className=\"space-y-3\">
                {addonsList.map((addon) => {
                  const addonNames = {
                    gps: '🛰️ GPS Navigation System',
                    childSeat: '👶 Child Safety Seat',
                    extraDriver: '👤 Extra Driver License',
                    insurance: '🛡️ Premium Insurance Shield'
                  }
                  return (
                    <div key={addon} className=\"flex justify-between items-center text-sm bg-white/50 dark:bg-black/30 p-4 rounded-2xl border border-primary/5 dark:border-white/5\">
                      <span className=\"font-bold text-primary/70 dark:text-white/70\">{addonNames[addon]}</span>
                      <span className=\"text-accent-start font-heading font-black\">+₹{addonPrices[addon]?.toLocaleString('en-IN')}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Pricing Breakdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className=\"space-y-4 pb-6 border-b border-primary/10 dark:border-white/10\"
          >
            <div className=\"flex justify-between text-[10px] font-black uppercase tracking-widest\">
              <span className=\"text-primary/40 dark:text-white/30\">Subtotal</span>
              <span className=\"text-primary dark:text-white\">₹{(basePrice + addonsTotal).toLocaleString('en-IN')}</span>
            </div>
            <div className=\"flex justify-between text-[10px] font-black uppercase tracking-widest\">
              <span className=\"text-primary/40 dark:text-white/30\">Tax (18% GST)</span>
              <span className=\"text-primary dark:text-white\">₹{taxes?.toLocaleString('en-IN')}</span>
            </div>
            {promoDiscount > 0 && (
              <div className=\"flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400\">
                <span className=\"flex items-center gap-2\">
                  ✓ Promo Discount
                </span>
                <span>-₹{promoDiscount?.toLocaleString('en-IN')}</span>
              </div>
            )}
          </motion.div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className=\"bg-gradient-to-br from-accent-start/10 to-accent-end/5 dark:from-white/5 dark:to-white/5 rounded-[32px] p-8 border border-accent-start/20 dark:border-white/10\"
          >
            <div className=\"flex justify-between items-center\">
              <span className=\"font-heading font-black text-primary dark:text-white uppercase text-sm tracking-tight\">Total Amount</span>
              <span className=\"text-4xl font-heading font-black text-accent-start tracking-tighter italic\">₹{totalPrice?.toLocaleString('en-IN')}</span>
            </div>
            <p className=\"text-[9px] text-primary/40 dark:text-white/30 mt-3 font-bold uppercase tracking-[0.2em]\">Including all charges & taxes</p>
          </motion.div>

          {/* Trust Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className=\"pt-6 space-y-3\"
          >
            <div className=\"flex items-start gap-3 p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl border border-emerald-200 dark:border-emerald-500/20\">\n              <span className=\"text-emerald-600 dark:text-emerald-400 text-lg flex-shrink-0 mt-0.5\">✓</span>
              <span className=\"text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest\">Encrypted secure payment</span>
            </div>
            <div className=\"flex items-start gap-3 p-3 bg-blue-100 dark:bg-blue-500/10 rounded-2xl border border-blue-200 dark:border-blue-500/20\">
              <span className=\"text-blue-600 dark:text-blue-400 text-lg flex-shrink-0 mt-0.5\">✓</span>
              <span className=\"text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest\">Free cancellation (24 hours)</span>
            </div>
            <div className=\"flex items-start gap-3 p-3 bg-amber-100 dark:bg-amber-500/10 rounded-2xl border border-amber-200 dark:border-amber-500/20\">
              <span className=\"text-amber-600 dark:text-amber-400 text-lg flex-shrink-0 mt-0.5\">✓</span>
              <span className=\"text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest\">No hidden charges</span>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default OrderSummary
