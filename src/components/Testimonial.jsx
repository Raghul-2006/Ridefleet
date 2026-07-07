import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const Testimonial = ({ name, role, content, rating, avatar }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-white dark:bg-white/5 rounded-[32px] p-8 h-full flex flex-col border border-primary/5 dark:border-white/5 hover:border-accent-start/30 dark:hover:border-white/10 transition-all shadow-lg hover:shadow-2xl"
  >
    {/* Rating */}
    <div className="flex gap-2 mb-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`w-5 h-5 rounded-full flex items-center justify-center ${i < rating ? 'bg-amber-400' : 'bg-gray-200 dark:bg-white/10'}`}>
          {i < rating && <span className="text-[10px]">★</span>}
        </div>
      ))}
    </div>

    {/* Content */}
    <p className="text-primary/70 dark:text-white/60 mb-8 flex-grow italic text-lg leading-relaxed font-bold">\"{content}\"</p>

    {/* Author */}
    <div className="flex items-center gap-4 pt-8 border-t border-primary/5 dark:border-white/5\">
      <img
        src={avatar}
        alt={name}
        className=\"w-14 h-14 rounded-full object-cover ring-2 ring-accent-start/20 shadow-md\"
      />
      <div>\n        <h4 className=\"font-heading font-black text-primary dark:text-white text-sm uppercase tracking-tight\">{name}</h4>
        <p className=\"text-primary/40 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest\">{role}</p>
      </div>
    </div>
  </motion.div>
)

export default Testimonial
