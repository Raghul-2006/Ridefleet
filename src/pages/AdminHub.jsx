import React, { useState, useEffect } from 'react';
import { useRideFleetStore } from '../store/ridefleet';
import { Badge, Card, Button, Input, Modal, Select } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWithinInterval, parseISO, isSameMonth
} from 'date-fns';

const AdminHub = () => {
  const navigate = useNavigate();
  const { 
    vehicles, bookings, adminLogout, fetchVehicles, fetchBookings,
    addVehicle, deleteVehicle, updateVehicle, setToastMessage 
  } = useRideFleetStore();
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    brand: '',
    type: 'Sedan',
    year: 2024,
    pricePerDay: 2000,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    specs: { maxSpeed: '220 km/h', acceleration: '6.5s', engine: 'Standard' }
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
  }, [fetchVehicles, fetchBookings]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleAddVehicle = async () => {
    const result = await addVehicle(newVehicle);
    if (result.success) {
      setIsAddModalOpen(false);
      setToastMessage({ text: 'Vehicle added to fleet successfully.', type: 'success' });
      setNewVehicle({
        name: '', brand: '', type: 'Sedan', year: 2024, pricePerDay: 2000, seats: 5,
        transmission: 'Automatic', fuelType: 'Petrol',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
        specs: { maxSpeed: '220 km/h', acceleration: '6.5s', engine: 'Standard' }
      });
    } else {
      setToastMessage({ text: result.message || 'Failed to add vehicle.', type: 'error' });
    }
  };

  const handleRemoveVehicle = async (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      const result = await deleteVehicle(id);
      if (result.success) {
        setToastMessage({ text: 'Vehicle removed from fleet.', type: 'error' });
      }
    }
  };

  // --- DATA CALCULATIONS ---
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || b.totalPrice || 0), 0);
  const availableVehicles = vehicles.filter(v => v.available).length;

  const topStats = [
    { label: 'Total Fleet', value: vehicles.length.toString(), icon: 'garage', color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
    { label: 'Active Rentals', value: confirmedBookings.length.toString(), icon: 'key', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: 'payments', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Available Assets', value: availableVehicles.toString(), icon: 'check_circle', color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const bookingTrend = days.map(day => {
    const count = bookings.filter(b => {
      const date = new Date(b.createdAt);
      return days[date.getDay()] === day;
    }).length;
    return { name: day, value: count || 0 };
  });

  const featuredVehicle = (selectedFeatureId ? vehicles.find(v => v._id === selectedFeatureId) : vehicles[vehicles.length - 1]) || {
    name: 'Empty Garage',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    seats: 0, pricePerDay: 0, fuelType: 'N/A'
  };

  const navItems = [
    { label: 'Overview', icon: 'grid_view' },
    { label: 'Fleet Hub', icon: 'garage' },
    { label: 'Bookings', icon: 'calendar_today' },
    { label: 'Settings', icon: 'settings' },
  ];

  // --- VIEWS ---
  
  const OverviewDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-0 overflow-hidden bg-white dark:bg-[#16191F] border-none shadow-sm relative h-[450px]">
            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-2">{featuredVehicle.name}</h2>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Fleet Asset</p>
                </div>
                <Badge variant={featuredVehicle.available ? "success" : "error"} className="uppercase tracking-widest">
                  {featuredVehicle.available ? "Live" : "In Service"}
                </Badge>
              </div>

              <div className="flex-grow flex items-center justify-center relative">
                <motion.img 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={featuredVehicle.image} 
                  alt={featuredVehicle.name} 
                  className="max-h-56 object-contain z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/5 to-transparent rounded-full blur-3xl opacity-50" />
              </div>

              <div className="grid grid-cols-4 gap-4 mt-auto">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E232B] text-center border border-neutral-100 dark:border-neutral-800">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Seats</p>
                  <p className="text-xs font-black text-neutral-900 dark:text-white">{featuredVehicle.seats || 4}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E232B] text-center border border-neutral-100 dark:border-neutral-800">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Daily Rate</p>
                  <p className="text-xs font-black text-brand-blue">₹{featuredVehicle.pricePerDay?.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E232B] text-center border border-neutral-100 dark:border-neutral-800">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Fuel Type</p>
                  <p className="text-xs font-black text-neutral-900 dark:text-white">{featuredVehicle.fuelType}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E232B] text-center border border-neutral-100 dark:border-neutral-800">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Top Speed</p>
                  <p className="text-xs font-black text-brand-orange">{featuredVehicle.specs?.maxSpeed || '220 KM/H'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* NEW: Fleet Fast-Switcher */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Inventory Status</h3>
                <span className="text-[10px] font-bold text-brand-blue">Click to view details</span>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {vehicles.map(v => (
                   <button 
                    key={v._id} 
                    onClick={() => setSelectedFeatureId(v._id)}
                    className={`
                      relative flex-shrink-0 w-32 group transition-all duration-300
                      ${selectedFeatureId === v._id || (!selectedFeatureId && vehicles[vehicles.length-1]?._id === v._id) ? 'scale-105' : 'opacity-60 hover:opacity-100'}
                    `}
                   >
                      <div className={`
                        aspect-[4/3] rounded-2xl overflow-hidden border-2 mb-2 transition-all
                        ${selectedFeatureId === v._id || (!selectedFeatureId && vehicles[vehicles.length-1]?._id === v._id) ? 'border-brand-blue shadow-lg shadow-brand-blue/20' : 'border-transparent bg-white dark:bg-neutral-900'}
                      `}>
                         <img src={v.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <p className="text-[10px] font-black text-center truncate px-1 uppercase tracking-tighter">{v.name}</p>
                      <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${v.available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                   </button>
                ))}
             </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white px-2">Recent Transactions</h2>
            <Card className="p-0 overflow-hidden bg-white dark:bg-[#16191F] border-none shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-50 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#1E232B]">
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total Price</th>
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                  {bookings.slice(-4).reverse().map(b => (
                    <tr key={b._id} className="group hover:bg-neutral-50 dark:hover:bg-[#1E232B] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">{b.user?.name || 'Member'}</span>
                          <span className="text-[10px] text-neutral-400">{b.user?.email || 'verified@ridefleet.com'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'} className="capitalize">
                          {b.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-neutral-900 dark:text-white">₹{(b.totalAmount || b.totalPrice || 0).toLocaleString('en-IN')}</td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => { setSelectedBooking(b); setIsDetailsModalOpen(true); }}
                          className="px-3 py-1.5 bg-brand-blue/10 text-brand-blue rounded-lg text-[10px] font-black uppercase hover:bg-brand-blue hover:text-white transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <Card className="bg-white dark:bg-[#16191F] border-none shadow-sm pb-8">
              <div className="flex justify-between items-center mb-6 border-b border-neutral-50 dark:border-neutral-800 pb-4">
                <h3 className="text-lg font-black tracking-tight text-neutral-900 dark:text-white">Rental Calendar</h3>
                <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 text-neutral-500 hover:text-brand-blue transition-all">
                    <span className="icon-rounded text-lg">chevron_left</span>
                  </button>
                  <button onClick={handleNextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 text-neutral-500 hover:text-brand-blue transition-all">
                    <span className="icon-rounded text-lg">chevron_right</span>
                  </button>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <span className="text-sm font-black text-brand-blue uppercase tracking-widest italic">{format(currentMonth, 'MMMM yyyy')}</span>
              </div>

              <div className="grid grid-cols-7 gap-y-4 text-center">
                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <span key={day} className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{day}</span>
                 ))}
                 {(() => {
                    const monthStart = startOfMonth(currentMonth);
                    const monthEnd = endOfMonth(monthStart);
                    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
                    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
                    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

                    return calendarDays.map((date, i) => {
                      const isCurrentM = isSameMonth(date, monthStart);
                      const isTod = isSameDay(date, new Date());
                      
                      const hasBooking = bookings.some(b => {
                        if (b.status !== 'confirmed' && b.status !== 'completed') return false;
                        const bStart = parseISO(b.startDate);
                        const bEnd = parseISO(b.endDate);
                        return (isWithinInterval(date, { start: bStart, end: bEnd }) || isSameDay(date, bStart) || isSameDay(date, bEnd));
                      });

                      return (
                        <button 
                          key={i} 
                          className={`
                            w-10 h-10 mx-auto flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all relative
                            ${!isCurrentM ? 'text-neutral-200 dark:text-neutral-800 opacity-20' : 'text-neutral-900 dark:text-neutral-400'}
                            ${isTod ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'}
                          `}
                        >
                          {format(date, 'd')}
                          {hasBooking && !isTod && (
                             <span className="absolute bottom-1.5 w-1 h-1 bg-brand-orange rounded-full" />
                          )}
                        </button>
                      );
                    });
                 })()}
              </div>
            </Card>

            <Card className="bg-white dark:bg-[#16191F] border-none shadow-sm p-8 h-[380px]">
              <h3 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white mb-8">Booking Trends</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F022" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={16}>
                      {bookingTrend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563EB' : '#F43F5E'} fillOpacity={index % 2 === 0 ? 1 : 0.6} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
        </div>
      </div>
    </div>
  );

  const FleetView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">Fleet Inventory</h2>
          <p className="text-sm text-neutral-400 font-bold">Manager your company's high-performance assets.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} iconBefore="add" className="shadow-xl shadow-brand-blue/20">Add Vehicle</Button>
      </div>

      <Card className="p-0 overflow-hidden bg-white dark:bg-[#16191F] border-none shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 dark:bg-[#1E232B] border-b border-neutral-100 dark:border-neutral-800">
              <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Vehicle Model</th>
              <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">Seats</th>
              <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Daily Rate</th>
              <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
            {vehicles.map(v => (
              <tr key={v._id} className="group hover:bg-neutral-50 dark:hover:bg-[#1E232B] transition-all">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-4">
                      <img src={v.image} className="w-14 h-10 object-cover rounded-xl shadow-sm" alt="" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-neutral-900 dark:text-white">{v.name}</span>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">{v.brand}</span>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-neutral-400">{v.type}</td>
                <td className="px-8 py-5 text-sm font-black text-center text-neutral-900 dark:text-white">{v.seats}</td>
                <td className="px-8 py-5 text-sm font-black text-brand-blue">₹{v.pricePerDay?.toLocaleString('en-IN')}</td>
                <td className="px-8 py-5">
                   <Badge variant={v.available ? "success" : "error"} className="border-none shadow-sm uppercase italic">
                      {v.available ? "Active" : "Booked"}
                   </Badge>
                </td>
                <td className="px-8 py-5 text-right">
                   <div className="flex justify-end gap-2">
                     <button className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-brand-blue transition-colors">
                       <span className="icon-rounded text-lg">edit</span>
                     </button>
                     <button 
                       onClick={() => handleRemoveVehicle(v._id)}
                       className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-rose-500 transition-colors"
                     >
                       <span className="icon-rounded text-lg">delete</span>
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  const BookingsView = () => {
    const updateBookingStatus = useRideFleetStore((state) => state.updateBookingStatus);
    const setToastMessage = useRideFleetStore((state) => state.setToastMessage);

    const handleComplete = async (id) => {
      const result = await updateBookingStatus(id, 'completed');
      if (result.success) {
        setToastMessage({ text: 'Trip marked as completed.', type: 'success' });
      }
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="px-2">
          <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">Rental Ledger</h2>
          <p className="text-sm text-neutral-400 font-bold">Reviewing all historical and upcoming customer trips.</p>
        </div>

        <Card className="p-0 overflow-hidden bg-white dark:bg-[#16191F] border-none shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 dark:bg-[#1E232B] border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Customer ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Vehicle</th>
                <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Duration</th>
                <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status / Rating</th>
                <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
              {bookings.length > 0 ? bookings.map(b => (
                <tr key={b._id} className="hover:bg-neutral-50 dark:hover:bg-[#1E232B] transition-all">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-neutral-900 dark:text-white">{b.user?.name || 'Member'}</span>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter truncate max-w-[150px]">{b.user?.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-neutral-900 dark:text-white">{b.vehicleName || vehicles.find(v => v._id === b.vehicle)?.name || 'Standard Vehicle'}</span>
                      <span className="text-[10px] text-brand-blue font-bold tracking-widest uppercase italic">{b.city || 'Express'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <Badge variant="info" className="bg-white/10 border-none shadow-sm">{b.rentalDays || 1} Days</Badge>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-neutral-900 dark:text-white">₹{(b.totalAmount || b.totalPrice || 0).toLocaleString('en-IN')}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2">
                      <Badge variant={b.status === 'completed' ? 'success' : b.status === 'confirmed' ? 'info' : 'warning'} className="uppercase">
                        {b.status}
                      </Badge>
                      {b.rating && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <span className="icon-rounded text-xs">star</span>
                          <span className="text-[10px] font-black">{b.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {b.status === 'confirmed' && (
                        <button 
                          onClick={() => handleComplete(b._id)}
                          className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          Complete Trip
                        </button>
                      )}
                      <button 
                        onClick={() => { setSelectedBooking(b); setIsDetailsModalOpen(true); }}
                        className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-lg text-[10px] font-black uppercase hover:text-brand-blue transition-all"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="py-20 text-center font-black text-neutral-400">Zero booking records found in the ledger.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F3F5F7] dark:bg-[#0F1115] overflow-hidden transition-colors duration-300 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#16191F] border-r border-neutral-100 dark:border-neutral-800 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/20">
            <span className="icon-rounded">directions_car</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase italic">RideFleet</span>
        </div>

        <nav className="flex-grow space-y-2">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all
                ${activeTab === item.label 
                  ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20' 
                  : 'text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-600 dark:hover:text-neutral-200'}
              `}
            >
              <span className="icon-rounded text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => navigate('/')}
          className="mt-auto flex items-center gap-4 px-4 py-3 text-brand-blue hover:bg-brand-blue/5 rounded-xl font-bold transition-all mb-2"
        >
          <span className="icon-rounded">home</span>
          <span className="text-sm">Main Page</span>
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl font-bold transition-all"
        >
          <span className="icon-rounded">logout</span>
          <span className="text-sm">Log Out</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow overflow-y-auto no-scrollbar pt-8 pb-12 px-8">
        {/* TOP SEARCH / PROFILE BAR */}
        <div className="flex items-center justify-between mb-10">
          <div className="relative w-96 group">
            <span className="icon-rounded absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-blue transition-colors">search</span>
            <input 
              type="text" 
              placeholder={`Search in ${activeTab}...`} 
              className="w-full bg-white dark:bg-[#16191F] border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder:text-neutral-400"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 rounded-xl bg-white dark:bg-[#16191F] flex items-center justify-center text-neutral-400 shadow-sm hover:text-brand-blue transition-colors">
              <span className="icon-rounded">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#16191F]" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-black text-neutral-900 dark:text-white">Admin Hub</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Enterprise Master</p>
              </div>
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* TOP TILES (Constant across all management views) */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {topStats.map(stat => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-[#16191F] p-6 rounded-3xl shadow-sm border border-neutral-50 dark:border-neutral-800 flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <span className="icon-rounded text-2xl">{stat.icon}</span>
              </div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* SUB VIEW RENDERING */}
        {activeTab === 'Overview' && <OverviewDashboard />}
        {activeTab === 'Fleet Hub' && <FleetView />}
        {activeTab === 'Bookings' && <BookingsView />}
        {activeTab === 'Settings' && (
           <Card className="flex flex-col items-center justify-center py-24 text-center">
             <span className="icon-rounded text-6xl text-neutral-200 dark:text-neutral-800 mb-6">tune</span>
             <h3 className="text-xl font-black text-neutral-900 dark:text-white">System Settings</h3>
             <p className="text-sm font-bold text-neutral-400">Configure global enterprise parameters.</p>
           </Card>
        )}
      </main>

      {/* RE-IMPLEMENTED ADD VEHICLE MODAL */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Fleet Asset"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Vehicle Name" 
              placeholder="e.g. Audi Q8" 
              value={newVehicle.name}
              onChange={e => setNewVehicle({...newVehicle, name: e.target.value})}
            />
            <Input 
              label="Brand" 
              placeholder="e.g. Audi" 
              value={newVehicle.brand}
              onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Type" 
              options={[
                { label: 'Sedan', value: 'Sedan' },
                { label: 'SUV', value: 'SUV' },
                { label: 'Electric', value: 'Electric' }
              ]}
              value={newVehicle.type}
              onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}
            />
            <Input 
              label="Daily Rate (₹)" 
              type="number"
              value={newVehicle.pricePerDay}
              onChange={e => setNewVehicle({...newVehicle, pricePerDay: parseInt(e.target.value)})}
            />
          </div>
          <Input 
            label="Image URL" 
            placeholder="Unsplash URL..." 
            value={newVehicle.image}
            onChange={e => setNewVehicle({...newVehicle, image: e.target.value})}
          />
          <div className="grid grid-cols-3 gap-4">
            <Select label="Transmission" options={[{ label: 'Automatic', value: 'Automatic' }, { label: 'Manual', value: 'Manual' }]} value={newVehicle.transmission} onChange={e => setNewVehicle({...newVehicle, transmission: e.target.value})} />
            <Select label="Fuel" options={[{ label: 'Petrol', value: 'Petrol' }, { label: 'Diesel', value: 'Diesel' }, { label: 'Electric', value: 'Electric' }]} value={newVehicle.fuelType} onChange={e => setNewVehicle({...newVehicle, fuelType: e.target.value})} />
            <Input label="Seats" type="number" value={newVehicle.seats} onChange={e => setNewVehicle({...newVehicle, seats: parseInt(e.target.value)})} />
          </div>
          <div className="pt-6 flex gap-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAddVehicle}>Register Vehicle</Button>
          </div>
        </div>
      </Modal>

      {/* NEW: BOOKING DETAILS MODAL */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Transaction Summary"
      >
        {selectedBooking && (
          <div className="space-y-8">
            <div className="flex items-start gap-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-24 h-16 rounded-xl overflow-hidden shadow-md bg-neutral-200 dark:bg-neutral-800">
                <img src={selectedBooking.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <h4 className="text-lg font-black text-neutral-900 dark:text-white">{selectedBooking.vehicleName}</h4>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">{selectedBooking.user?.name || 'Verified Member'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Rental Period</p>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">{selectedBooking.startDate} to {selectedBooking.endDate}</p>
                <p className="text-[10px] text-brand-blue font-black uppercase tracking-tighter">{selectedBooking.rentalDays || 1} Total Days</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Payment Meta</p>
                <p className="text-xs font-bold text-neutral-900 dark:text-white capitalize">{selectedBooking.paymentMethod}</p>
                <Badge variant="success" className="text-[8px] uppercase">Verified Settlement</Badge>
              </div>
            </div>

            {selectedBooking.addOns && selectedBooking.addOns.length > 0 && (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-900">
                <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-3">Service Extensions</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.addOns.map((addon, i) => (
                    <span key={i} className="px-3 py-1 bg-white dark:bg-neutral-900 rounded-lg text-[10px] font-bold text-neutral-600 dark:text-neutral-300 border border-neutral-100 dark:border-neutral-800">
                      {addon}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Total Transaction</p>
                <p className="text-3xl font-black text-brand-blue">₹{(selectedBooking.totalAmount || selectedBooking.totalPrice || 0).toLocaleString('en-IN')}</p>
              </div>
              <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>Close Summary</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminHub;
