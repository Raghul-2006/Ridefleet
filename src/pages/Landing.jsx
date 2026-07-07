import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, Card, Input, Select } from '../components/UI';
import { useRideFleetStore } from '../store/ridefleet';

const Landing = () => {
  const navigate = useNavigate();
  const { indianCities } = useRideFleetStore();
  
  const [searchParams, setSearchParams] = useState({
    city: 'Mumbai',
    startDate: '',
    endDate: '',
    type: 'SUV'
  });

  const handleSearch = () => {
    navigate('/browse', { state: searchParams });
  };

  const features = [
    {
      icon: 'verified_user',
      title: 'Secure & Verified',
      desc: 'All vehicles undergo a 120-point inspection before every rental.'
    },
    {
      icon: 'support_agent',
      title: '24/7 Professional Support',
      desc: 'Expert assistance for emergency roadside support and booking help.'
    },
    {
      icon: 'calendar_month',
      title: 'Flexible Bookings',
      desc: 'Modifiable reservations with a clear, professional cancellation policy.'
    }
  ];

  const testimonials = [
    {
       name: 'Arjun Mehta',
       role: 'Corporate CEO',
       text: 'The most professional rental service I have used in India. The BMW X7 was in pristine condition.'
    },
    {
       name: 'Priya Sharma',
       role: 'Business Consultant',
       text: 'Seamless booking experience and on-time delivery. Their EV fleet is impressive and well-maintained.'
    }
  ];

  return (
    <div className="flex flex-col bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Professional Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-neutral-900 border-b border-neutral-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="info" className="mb-6 bg-brand-blue text-white border-none py-1.5 px-4 font-bold tracking-widest uppercase text-[10px]">
                Premium Vehicle Rentals
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                Professional Mobility <br />
                <span className="text-brand-blue">Solutions for Experts</span>
              </h1>
              <p className="text-lg text-neutral-300 mb-10 leading-relaxed font-medium">
                Access a curated fleet of premium vehicles across major Indian hubs. <br className="hidden md:block" /> Guaranteed reliability, transparent pricing, and 24/7 support.
              </p>
            </motion.div>

            {/* Search Widget */}
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 max-w-3xl"
            >
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                  <Select 
                    label="Pickup City" 
                    options={indianCities.map(c => ({ label: c, value: c }))}
                    value={searchParams.city}
                    onChange={e => setSearchParams({...searchParams, city: e.target.value})}
                  />
                  <Input 
                    label="Start Date" 
                    type="date" 
                    value={searchParams.startDate}
                    onChange={e => setSearchParams({...searchParams, startDate: e.target.value})}
                  />
                  <Input 
                    label="End Date" 
                    type="date" 
                    value={searchParams.endDate}
                    onChange={e => setSearchParams({...searchParams, endDate: e.target.value})}
                  />
                  <Select 
                    label="Vehicle Type" 
                    options={[
                      { label: 'Any Type', value: 'Any' },
                      { label: 'Sedan', value: 'Sedan' },
                      { label: 'SUV', value: 'SUV' },
                      { label: 'Luxury', value: 'Luxury' }
                    ]}
                    value={searchParams.type}
                    onChange={e => setSearchParams({...searchParams, type: e.target.value})}
                  />
               </div>
               <div className="mt-8 flex justify-end">
                  <Button size="lg" className="w-full md:w-auto px-12" onClick={handleSearch}>
                    Search Collection
                  </Button>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">The RideFleet Guarantee</h2>
          <p className="text-neutral-500 max-w-lg mx-auto">We prioritize professionalism and vehicle integrity to ensure your mobility is never compromised.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card key={i} className="text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="icon-rounded text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-3">{feature.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-medium">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-neutral-100 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">Client Testimonials</h2>
                <p className="text-neutral-500">Trusted by executives and business professionals across India.</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/browse')}>View All Reviews</Button>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((t, i) => (
                <Card key={i} className="flex flex-col md:flex-row gap-6 p-8">
                  <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 flex items-center justify-center font-bold text-brand-blue">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-4">
                      {[1,2,3,4,5].map(s => <span key={s} className="icon-rounded text-sm">star</span>)}
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium italic mb-6">"{t.text}"</p>
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100">{t.name}</h4>
                    <span className="text-xs text-brand-blue font-bold uppercase tracking-wider">{t.role}</span>
                  </div>
                </Card>
              ))}
           </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <Button size="lg" className="w-full shadow-2xl" onClick={() => navigate('/browse')}>
            Browse Collection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
