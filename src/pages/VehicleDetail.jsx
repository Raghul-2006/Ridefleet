import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRideFleetStore } from '../store/ridefleet';
import { Button, Badge, Card, Skeleton, Input } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { VehicleCard } from '../components/VehicleCard';
import { differenceInCalendarDays, parseISO, addDays, format } from 'date-fns';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicles = useRideFleetStore((state) => state.vehicles) || [];
  const [activeImage, setActiveImage] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [rentalDays, setRentalDays] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const { fetchVehicleReviews, fetchVehicles } = useRideFleetStore();

  const vehicle = vehicles.find(v => v._id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoading(false), 800);
    
    fetchVehicles(); // Ensure we have the latest ratings
    const getReviews = async () => {
      if (id) {
        const data = await fetchVehicleReviews(id);
        setReviews(data || []);
        setReviewsLoading(false);
      }
    };
    getReviews();

    return () => clearTimeout(timer);
  }, [id, fetchVehicleReviews, fetchVehicles]);

  useEffect(() => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    // If start is after end, auto-adjust end to be same day as start
    if (start > end) {
      setEndDate(startDate);
    }

    const diffDays = differenceInCalendarDays(end, start);
    setRentalDays(diffDays > 0 ? diffDays : 1);
  }, [startDate, endDate]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 md:px-6">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="h-[500px] w-full rounded-3xl" />
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
            </div>
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center pt-24">
        <h1 className="text-3xl font-bold mb-4">Vehicle Not Found</h1>
        <p className="text-neutral-500 mb-8 max-w-md">The vehicle you are looking for is no longer in our fleet or has been moved.</p>
        <Button onClick={() => navigate('/browse')}>Browse All Vehicles</Button>
      </div>
    );
  }

  const relatedVehicles = vehicles
    .filter(v => v._id !== vehicle?._id && (v.type === vehicle?.type || v.badge === vehicle?.badge))
    .slice(0, 3);

  const subtotal = (vehicle?.pricePerDay || 0) * rentalDays;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const specs = [
    { label: 'Transmission', value: vehicle?.transmission, icon: 'settings' },
    { label: 'Fuel Type', value: vehicle?.fuelType, icon: 'local_gas_station' },
    { label: 'Seats', value: `${vehicle?.seats || 0} Adults`, icon: 'person' },
    { label: 'Max Speed', value: vehicle?.specs?.maxSpeed, icon: 'speed' },
    { label: 'Year', value: vehicle?.year || '2024', icon: 'calendar_today' },
    { label: 'Category', value: vehicle?.type, icon: 'category' },
  ];

  return (
    <div className="pt-24 pb-20 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-10 flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
          <button onClick={() => navigate('/browse')} className="hover:text-brand-blue transition-colors">Fleet</button>
          <span className="icon-rounded text-sm">chevron_right</span>
          <span className="text-neutral-500">{vehicle?.type}</span>
          <span className="icon-rounded text-sm">chevron_right</span>
          <span className="text-neutral-900 dark:text-neutral-100">{vehicle?.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Visuals & Specifications */}
          <div className="lg:col-span-8 space-y-12">
            {/* Gallery */}
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-[400px] md:h-[550px] rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800"
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage}
                    src={vehicle?.images?.[activeImage] || vehicle?.image} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                    alt={vehicle?.name}
                  />
                </AnimatePresence>
                <div className="absolute top-4 left-4">
                  <Badge variant={vehicle?.available ? 'success' : 'error'} className="px-4 py-1.5 shadow-lg">
                    {vehicle?.available ? 'Available' : 'Currently Booked'}
                  </Badge>
                </div>
              </motion.div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {(vehicle?.images || [vehicle?.image]).map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`
                      relative w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all
                      ${activeImage === idx ? 'border-brand-blue scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}
                    `}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`${vehicle?.name} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Title Section (Mobile Visible Only) */}
            <div className="md:hidden">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">{vehicle?.name}</h1>
              <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="icon-rounded text-sm">star</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">{vehicle?.rating}</span>
                </div>
                <span>·</span>
                <span>{vehicle?.reviews} Verified Reviews</span>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {specs.map(spec => (
                <div key={spec.label} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-brand-blue mb-4">
                    <span className="icon-rounded text-xl">{spec.icon}</span>
                  </div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{spec.label}</p>
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{spec.value || 'N/A'}</p>
                </div>
              ))}
            </div>

            {/* Description & Features */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Vehicle Description</h3>
                <p className="text-neutral-500 leading-relaxed font-medium">
                  {vehicle?.description || `The ${vehicle?.name} represents the pinnacle of its class, offering exceptional performance combined with industry-leading comfort. Ideal for both corporate travel and weekend getaways, this vehicle ensures a professional and safe journey for up to ${vehicle?.specs?.seats} passengers.`}
                </p>
              </div>

              <div className="pt-8 border-t border-neutral-100 dark:border-neutral-900">
                <h3 className="text-lg font-bold mb-6">Included Features</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {['Bluetooth Connectivity', 'Reverse Parking Camera', 'Automatic Climate Control', 'Power Windows', 'ABS & Airbags', 'GPS Navigation Ready'].map(feat => (
                    <div key={feat} className="flex items-center gap-3 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900/50">
                      <span className="icon-rounded text-brand-blue text-sm">check_circle</span>
                      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <Card className="p-8 shadow-2xl border-neutral-100 dark:border-neutral-800">
                <div className="hidden md:block mb-8 pb-8 border-b border-neutral-100 dark:border-neutral-800">
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">{vehicle?.name}</h1>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="icon-rounded text-sm">star</span>
                      <span className="text-neutral-900 dark:text-neutral-100">{vehicle?.rating}</span>
                    </div>
                    <span className="text-neutral-400">{vehicle?.reviews} Reviews</span>
                  </div>
                </div>

                <div className="mb-10">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Standard Daily Rate</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-brand-blue">₹{vehicle?.pricePerDay?.toLocaleString('en-IN')}</span>
                    <span className="text-sm font-bold text-neutral-400">/ Day</span>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Start Date" 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input 
                      label="End Date" 
                      type="date" 
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                    <div className="flex justify-between text-sm font-medium text-neutral-500">
                      <span>Base Rental ({rentalDays} Day{rentalDays > 1 ? 's' : ''})</span>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-neutral-500">
                      <span>Service Tax (18%)</span>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                      <span className="font-bold text-neutral-900 dark:text-neutral-50">Estimated Total</span>
                      <span className="text-2xl font-black text-brand-orange">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full py-4 text-sm font-bold uppercase tracking-widest"
                  onClick={() => navigate('/checkout', { state: { vehicleId: vehicle?._id, rentalDays, startDate, endDate } })}
                >
                  Book Your Ride
                </Button>
                
                <p className="text-center mt-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="icon-rounded text-brand-blue">verified_user</span>
                  Secure Reservation Guarantee
                </p>
              </Card>

              <Card className="p-6 bg-brand-blue text-white shadow-xl shadow-brand-blue/20">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                       <span className="icon-rounded text-2xl">local_fire_department</span>
                    </div>
                    <div>
                       <h4 className="font-bold text-sm">Limited Inventory</h4>
                       <p className="text-[10px] text-white/80 font-medium">This model is in high demand for your selected city.</p>
                    </div>
                 </div>
              </Card>
            </div>
          </aside>
      </div>

        {/* Customer Feedback Section */}
        <div className="mt-32 pt-20 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-2">Customer Experience</h2>
              <p className="text-neutral-500 font-medium">Authentic feedback from verified professional clients.</p>
            </div>
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm">
              <div className="text-center px-4 border-r border-neutral-100 dark:border-neutral-800">
                <p className="text-3xl font-black text-brand-blue">{vehicle?.rating || 0}</p>
                <div className="flex items-center justify-center gap-1 text-amber-500 my-1">
                   {[...Array(5)].map((_, i) => (
                      <span key={i} className="icon-rounded text-sm">
                        {i < Math.round(vehicle?.rating || 0) ? 'star' : 'star_outline'}
                      </span>
                   ))}
                </div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Average Rating</p>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-black text-neutral-900 dark:text-neutral-50">{reviews.length || vehicle?.reviews || 0}</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2">Verified Reviews</p>
              </div>
            </div>
          </div>

          {!reviewsLoading && reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {reviews.map((review, idx) => (
                <motion.div 
                  key={review._id || idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 h-full bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-100 dark:border-neutral-900 hover:border-brand-blue/30 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-sm">
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{review.user?.name || 'Verified Rider'}</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="icon-rounded text-sm">
                            {i < review.rating ? 'star' : 'star_outline'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium italic">
                      "{review.feedback || 'Smooth experience and excellent vehicle maintenance. Highly recommended for business travel.'}"
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : !reviewsLoading && (
            <div className="p-20 text-center rounded-3xl bg-neutral-100/50 dark:bg-neutral-900/20 border-2 border-dashed border-neutral-200 dark:border-neutral-800">
               <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6 text-neutral-300 dark:text-neutral-700">
                  <span className="icon-rounded text-3xl">rate_review</span>
               </div>
               <h3 className="text-lg font-bold mb-2">No Verified Reviews Yet</h3>
               <p className="text-neutral-500 max-w-sm mx-auto text-sm font-medium">Be the first to share your professional experience with this flagship model.</p>
            </div>
          )}
        </div>

        {/* Related Vehicles */}
        {relatedVehicles.length > 0 && (
          <div className="mt-32 pt-20 border-t border-neutral-200 dark:border-neutral-800">
            <h2 className="text-2xl font-bold mb-12">Related Professional Fleet</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedVehicles.map(v => (
                <div key={v._id} onClick={() => navigate(`/vehicle/${v._id}`)} className="cursor-pointer">
                  <VehicleCard vehicle={v} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetail;
