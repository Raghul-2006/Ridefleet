import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRideFleetStore } from '../store/ridefleet';
import { Button, Card, Badge, Modal, Input } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const { bookings, logout, rewardPoints, user, fetchBookings, submitFeedback, setToastMessage } = useRideFleetStore();

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenFeedback = (booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setComment('');
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedBooking) return;
    setSubmitting(true);
    const result = await submitFeedback(selectedBooking._id || selectedBooking.id, rating, comment);
    setSubmitting(false);
    
    if (result.success) {
      setIsFeedbackModalOpen(false);
      setToastMessage({ text: 'Thank you for your feedback!', type: 'success' });
      fetchBookings(); // Refresh bookings
      fetchVehicles(); // Refresh vehicles to update ratings
    } else {
      setToastMessage({ text: result.message || 'Failed to submit feedback.', type: 'error' });
    }
  };

  const stats = [
    {
      label: 'Welcome',
      value: user?.name?.split(' ')[0] || 'Member',
      icon: 'person',
      color: 'text-brand-orange'
    },
    {
      label: 'Active Bookings',
      value: bookings?.filter(b => b.status === 'confirmed' || b.status === 'active').length || 0,
      icon: 'directions_car',
      color: 'text-brand-blue'
    },
    {
      label: 'Total Completed',
      value: bookings?.filter(b => b.status === 'completed').length || 0,
      icon: 'task_alt',
      color: 'text-emerald-500'
    },
    {
      label: 'Reward Points',
      value: (rewardPoints || 0).toLocaleString(),
      icon: 'stars',
      color: 'text-amber-500'
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Member Dashboard</h1>
            <p className="text-neutral-500 text-sm font-medium">
              Welcome back, {user?.name || 'valued member'}. Managing your professional mobility fleet.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => navigate('/browse')}>New Booking</Button>
            <Button variant="outline" className="text-neutral-500" onClick={handleLogout}>Sign Out</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="flex flex-col items-center text-center p-6">
                <div className={`w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4 ${stat.color}`}>
                  <span className="icon-rounded text-2xl">{stat.icon}</span>
                </div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Recent Reservations</h2>
              <Button variant="ghost" size="sm" className="text-brand-blue">View All</Button>
            </div>

            <Card className="p-0 overflow-hidden border-neutral-100 dark:border-neutral-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
                      <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Vehicle</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status / Feedback</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                    {bookings && bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <tr key={booking._id || booking.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img src={booking.image} alt="" className="w-12 h-8 object-cover rounded shadow-sm bg-neutral-200 dark:bg-neutral-800" />
                              <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-brand-blue transition-colors">
                                {booking.vehicleName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-neutral-500">
                            {booking.startDate}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <Badge
                                variant={
                                  booking.status === 'confirmed' || booking.status === 'active' ? 'success' :
                                  booking.status === 'completed' ? 'info' :
                                  booking.status === 'cancelled' ? 'error' : 'secondary'
                                }
                                className="capitalize"
                              >
                                {booking.status}
                              </Badge>
                              
                              {booking.status === 'completed' && !booking.rating && (
                                <button 
                                  onClick={() => handleOpenFeedback(booking)}
                                  className="text-[10px] font-bold text-brand-blue uppercase hover:underline"
                                >
                                  Rate Your Ride
                                </button>
                              )}

                              {booking.rating && (
                                <div className="flex items-center gap-1 text-amber-500">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className="icon-rounded text-[10px]">
                                      {i < booking.rating ? 'star' : 'star_outline'}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                              ₹{(booking.totalAmount || booking.totalPrice || 0).toLocaleString('en-IN')}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-6 text-neutral-300 dark:text-neutral-700">
                              <span className="icon-rounded text-4xl">calendar_today</span>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2">Your fleet is currently idle</h3>
                            <p className="text-neutral-500 text-sm font-medium mb-8 max-w-xs mx-auto">
                              You haven't made any reservations yet. Professional mobility is just a few clicks away.
                            </p>
                            <Button size="md" variant="primary" onClick={() => navigate('/browse')} iconAfter="arrow_forward">
                              Browse Vehicles
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-8 bg-brand-blue text-white shadow-xl shadow-brand-blue/20">
              <h3 className="text-lg font-bold mb-4">Silver Membership</h3>
              <p className="text-xs text-white/80 leading-relaxed mb-6 font-medium">
                You are 1,500 points away from Gold status. Gold members enjoy free airport pick-ups and priority booking.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[75%] rounded-full shadow-sm" />
                </div>
              </div>
              <Button variant="ghost" className="w-full text-white bg-white/10 hover:bg-white/20 border-white/20 text-xs font-bold uppercase tracking-widest">
                Learn More
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-base font-bold mb-4">Personal Concierge</h3>
              <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <span className="icon-rounded text-xl">support_agent</span>
                </div>
                <div>
                  <p className="text-sm font-bold">24/7 Priority Support</p>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Available Now</p>
                </div>
              </div>
              <Button className="w-full" variant="outline">Start Conversation</Button>
            </Card>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
              <div className="flex items-start gap-3">
                <span className="icon-rounded text-amber-500">info</span>
                <div>
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">
                    Reward Points
                  </p>
                  <p className="text-xs text-amber-700/70 dark:text-amber-300/60 leading-relaxed">
                    You have <strong>{(rewardPoints || 0).toLocaleString()} pts</strong> = ₹{((rewardPoints || 0) * 10).toLocaleString()} value. Earn 10 pts per booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <Modal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
        title="Rate Your Ride"
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-neutral-500 font-medium mb-6">
              How was your experience with the <span className="text-brand-blue font-bold">{selectedBooking?.vehicleName}</span>?
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${rating >= s ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'}`}
                >
                  <span className="icon-rounded text-2xl">{rating >= s ? 'star' : 'star_outline'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Your Feedback</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your trip..."
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-blue/10 transition-all h-32 outline-none"
            />
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              className="w-full shadow-xl shadow-brand-blue/20" 
              onClick={handleSubmitFeedback}
              loading={submitting}
            >
              Submit Feedback
            </Button>
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={() => setIsFeedbackModalOpen(false)}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
