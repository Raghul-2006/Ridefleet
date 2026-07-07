import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRideFleetStore } from '../store/ridefleet';
import { Button, Input, Card, Badge, Select } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicles, addBooking, setToastMessage, rewardPoints, deductPoints } = useRideFleetStore();
  
  // Null-safe state handling
  const { vehicleId, rentalDays: initialDays, startDate: passedStart, endDate: passedEnd } = location.state || {};
  const vehicle = vehicles.find(v => v._id === vehicleId) || vehicles[0];
  const rentalDays = initialDays || 1;
  const startDate = passedStart || new Date().toISOString().split('T')[0];
  const endDate = passedEnd || new Date(Date.now() + rentalDays * 86400000).toISOString().split('T')[0];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license: '',
    paymentMethod: 'upi',
    upiId: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [upiTimer, setUpiTimer] = useState(120); // 2 minutes
  const [showQr, setShowQr] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const addOns = [
    { id: 'gps', name: 'GPS Navigation', price: 500, icon: 'map' },
    { id: 'seat', name: 'Child Safety Seat', price: 300, icon: 'child_care' },
    { id: 'driver', name: 'Extra Driver', price: 1000, icon: 'person_add' },
    { id: 'insurance', name: 'Premium Insurance', price: 1500, icon: 'verified_user' }
  ];

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
      if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid phone number is required';
      if (!formData.license.trim()) newErrors.license = 'Driver license ID is required';
    }
    if (currentStep === 3) {
      if (formData.paymentMethod === 'upi' && !formData.upiId.trim()) newErrors.upiId = 'UPI ID is required';
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.expiry.trim()) newErrors.expiry = 'Expiry date is required';
        if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 3) setStep(s => s + 1);
      else handleCompleteBooking();
    }
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const toggleAddOn = (id) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    const vehicleTotal = (vehicle.pricePerDay || 0) * rentalDays;
    const addOnsTotal = selectedAddOns.reduce((acc, id) => {
      const addon = addOns.find(a => a.id === id);
      return acc + (addon ? addon.price : 0);
    }, 0);
    const subtotal = vehicleTotal + addOnsTotal;
    const tax = Math.round(subtotal * 0.18);
    return { subtotal, tax, total: subtotal + tax };
  };

  const { subtotal, tax, total } = calculateTotal();

  useEffect(() => {
    let timer;
    if (showQr && upiTimer > 0) {
      timer = setInterval(() => setUpiTimer(prev => prev - 1), 1000);
    } else if (upiTimer === 0) {
      setShowQr(false);
      setToastMessage({ text: 'UPI Session Expired. Please try again.', type: 'error' });
    }
    return () => clearInterval(timer);
  }, [showQr, upiTimer]);

  const handleCompleteBooking = async () => {
    const booking = {
      vehicle: vehicle._id,
      vehicleName: vehicle.name,
      image: vehicle.image,
      startDate: startDate,
      endDate: endDate,
      rentalDays: rentalDays,
      totalAmount: total,
      paymentMethod: formData.paymentMethod,
      addOns: selectedAddOns.map(id => addOns.find(a => a.id === id).name)
    };

    const result = await addBooking(booking);
    
    if (result.success) {
      setBookingId(result.data?._id || 'RF-' + Math.random().toString(36).substr(2, 9).toUpperCase());
      setIsBookingComplete(true);
      setToastMessage({ message: 'Booking successfully confirmed!', type: 'success' });
    } else {
      setToastMessage({ message: result.message || 'Booking failed', type: 'error' });
    }
  };

  const steps = [
    { id: 1, name: 'Personal Details', icon: 'person' },
    { id: 2, name: 'Add-ons', icon: 'add_task' },
    { id: 3, name: 'Payment', icon: 'payments' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-200 dark:bg-neutral-800 -translate-y-1/2 -z-10" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-brand-blue -translate-y-1/2 -z-10 transition-all duration-500" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-neutral-50 dark:bg-neutral-950 px-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${step >= s.id ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'}
                `}>
                  {step > s.id ? <span className="icon-rounded">check</span> : s.id}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.id ? 'text-brand-blue' : 'text-neutral-400'}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isBookingComplete ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto"
          >
            <Card className="p-12 text-center space-y-8 overflow-hidden relative">
              {/* Animated Success Background */}
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
              
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <span className="icon-rounded text-6xl">check_circle</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-black mb-2">Payment Successful!</h2>
                  <p className="text-neutral-500 font-medium">Your reservation is now confirmed.</p>
                </motion.div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 space-y-4 text-left">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Booking Reference</span>
                  <span className="font-mono font-bold text-brand-blue">{bookingId}</span>
                </div>
                
                <div className="flex gap-4 py-2">
                  <div className="w-20 h-14 bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <img src={vehicle.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{vehicle.name}</h4>
                    <p className="text-[10px] text-neutral-500 font-medium">{startDate} to {endDate}</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Total Paid</p>
                    <p className="text-2xl font-black text-neutral-900 dark:text-white">₹{total.toLocaleString('en-IN')}</p>
                  </div>
                  <Badge variant="success" className="px-3 py-1">Confirmed</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full gap-2 text-xs font-bold" onClick={() => window.print()}>
                  <span className="icon-rounded text-lg">download</span>
                  Receipt
                </Button>
                <Button className="w-full text-xs font-bold shadow-xl shadow-brand-blue/20" onClick={() => navigate('/dashboard')}>
                  My Bookings
                </Button>
              </div>

              <div className="p-3 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 flex items-center justify-center gap-2">
                <span className="icon-rounded text-brand-blue text-lg">stars</span>
                <span className="text-xs font-black text-brand-blue uppercase tracking-wider">You earned 10 Reward Points!</span>
              </div>

              <p className="text-[10px] text-neutral-400 italic">A confirmation email has been sent to {formData.email}</p>
            </Card>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <AnimatePresence mode="wait">
                  {/* ... (keep step 1 & 2 logic) */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                      <header>
                        <h2 className="text-2xl font-bold mb-1">Customer Information</h2>
                        <p className="text-neutral-500 text-sm">Please provide your contact and license details for verification.</p>
                      </header>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Full Name" placeholder="e.g. Rahul Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} error={errors.name} />
                        <Input label="Email Address" type="email" placeholder="rahul@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} error={errors.email} />
                        <Input label="Phone Number" placeholder="9876543210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} error={errors.phone} />
                        <Input label="Driver License ID" placeholder="DL-XXXXXXXXXXXX" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} error={errors.license} />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                      <header>
                        <h2 className="text-2xl font-bold mb-1">Service Extensions</h2>
                        <p className="text-neutral-500 text-sm">Tailor your journey with professional add-on services.</p>
                      </header>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {addOns.map((addon) => (
                          <div 
                            key={addon.id} 
                            onClick={() => toggleAddOn(addon.id)} 
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedAddOns.includes(addon.id) ? 'border-brand-blue bg-brand-blue/5' : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-200'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedAddOns.includes(addon.id) ? 'bg-brand-blue text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'}`}>
                                <span className="icon-rounded text-2xl">{addon.icon}</span>
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-bold text-sm">{addon.name}</h4>
                                <p className="text-brand-blue text-xs font-bold">₹{addon.price}</p>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAddOns.includes(addon.id) ? 'border-brand-blue bg-brand-blue text-white' : 'border-neutral-300 dark:border-neutral-700'}`}>
                                {selectedAddOns.includes(addon.id) && <span className="icon-rounded text-base">check</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                    >
                      <header>
                        <h2 className="text-2xl font-bold mb-1">Secure Payment</h2>
                        <p className="text-neutral-500 text-sm">Review your settlement options and finalize your reservation.</p>
                      </header>

                      <div className="flex flex-wrap gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
                        {[
                          { id: 'upi', label: 'UPI', icon: 'bolt' },
                          { id: 'card', label: 'Card', icon: 'credit_card' },
                          { id: 'rewards', label: 'Rewards', icon: 'stars' },
                          { id: 'cash', label: 'Cash', icon: 'payments' }
                        ].map((method) => (
                          <button 
                            key={method.id}
                            onClick={() => {
                              setFormData({...formData, paymentMethod: method.id});
                              setShowQr(false);
                              setUpiTimer(120);
                            }}
                            className={`
                              flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all 
                              ${formData.paymentMethod === method.id 
                                ? 'bg-white dark:bg-neutral-700 shadow-md text-brand-blue' 
                                : 'text-neutral-400 hover:text-neutral-600'}
                            `}
                          >
                            <span className="icon-rounded text-lg">{method.icon}</span>
                            {method.label}
                          </button>
                        ))}
                      </div>

                      <div className="min-h-[200px] flex flex-col justify-center">
                        {formData.paymentMethod === 'upi' && (
                          <div className="space-y-6">
                            {!showQr ? (
                              <div className="space-y-4">
                                <Input 
                                  label="UPI ID" 
                                  placeholder="username@okaxis" 
                                  icon="alternate_email"
                                  value={formData.upiId}
                                  onChange={e => setFormData({...formData, upiId: e.target.value})}
                                  error={errors.upiId}
                                />
                                <Button 
                                  variant="secondary" 
                                  className="w-full py-3"
                                  onClick={() => {
                                    if (formData.upiId.trim()) setShowQr(true);
                                    else setErrors({ upiId: 'Enter UPI ID first' });
                                  }}
                                >
                                  Generate Payment QR
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="relative p-4 bg-white rounded-2xl shadow-inner border-2 border-neutral-100">
                                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-black">
                                    <span className="icon-rounded text-[10px] animate-pulse">timer</span>
                                    {Math.floor(upiTimer / 60)}:{String(upiTimer % 60).padStart(2, '0')}
                                  </div>
                                  <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${formData.upiId}%26pn=RideFleet%26am=${total}%26cu=INR`}
                                    alt="UPI QR Code"
                                    className="w-32 h-32"
                                  />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Scan QR to pay ₹{total.toLocaleString('en-IN')}</p>
                                  <p className="text-[10px] text-neutral-400 mt-1 italic">Please complete payment within 2 minutes</p>
                                </div>
                                <div className="flex items-center gap-2 text-brand-blue font-bold text-[10px] animate-pulse">
                                  <span className="icon-rounded text-sm">sync</span>
                                  Waiting for bank confirmation...
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {formData.paymentMethod === 'card' && (
                          <div className="space-y-4">
                            <Input 
                              label="Card Number" 
                              placeholder="0000 0000 0000 0000" 
                              icon="credit_card" 
                              value={formData.cardNumber}
                              onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                              error={errors.cardNumber}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <Input 
                                label="Expiry Date" 
                                placeholder="MM/YY" 
                                value={formData.expiry}
                                onChange={e => setFormData({...formData, expiry: e.target.value})}
                                error={errors.expiry}
                              />
                              <Input 
                                label="CVV" 
                                type="password" 
                                placeholder="***" 
                                value={formData.cvv}
                                onChange={e => setFormData({...formData, cvv: e.target.value})}
                                error={errors.cvv}
                              />
                            </div>
                          </div>
                        )}

                        {formData.paymentMethod === 'rewards' && (
                          <div className="p-6 rounded-2xl bg-brand-blue/5 border-2 border-brand-blue/10 space-y-4 text-center">
                            <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center mx-auto">
                              <span className="icon-rounded text-2xl">stars</span>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-neutral-500">Available Balance</p>
                              <h4 className="text-xl font-black text-brand-blue">{rewardPoints} Points</h4>
                              <p className="text-[10px] text-neutral-400 font-bold mt-1">Worth ₹{(rewardPoints * 10).toLocaleString('en-IN')}</p>
                            </div>
                            <div className="pt-4 border-t border-brand-blue/10">
                              {rewardPoints * 10 >= total ? (
                                <p className="text-xs font-bold text-emerald-600">You have sufficient points for this booking!</p>
                              ) : (
                                <p className="text-xs font-bold text-rose-500">Insufficient points. You need {Math.ceil((total - rewardPoints * 10) / 10)} more points.</p>
                              )}
                            </div>
                            <p className="text-[10px] text-neutral-400 italic">1 Point = ₹10</p>
                          </div>
                        )}

                        {formData.paymentMethod === 'cash' && (
                          <div className="p-6 rounded-2xl bg-amber-500/5 border-2 border-amber-500/10 space-y-4 text-center">
                            <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto">
                              <span className="icon-rounded text-2xl">account_balance_wallet</span>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold">Pay at Pickup</h4>
                              <p className="text-xs text-neutral-500 max-w-[200px] mx-auto mt-2 tracking-tight">You can settle the full amount of <span className="font-bold text-neutral-900 dark:text-white">₹{total.toLocaleString('en-IN')}</span> in cash at our counter.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-12 flex justify-between items-center border-t border-neutral-100 dark:border-neutral-800 pt-8">
                  <Button variant="ghost" onClick={prevStep} className={step === 1 ? 'invisible' : ''}>Previous Step</Button>
                  <Button onClick={nextStep} className="px-12" disabled={formData.paymentMethod === 'rewards' && rewardPoints * 10 < total}>
                    {step === 3 ? 'Confirm & Book' : 'Continue'}
                  </Button>
                </div>
              </Card>
            </div>

            <aside className="space-y-6">
              <Card className="p-8 sticky top-24 shadow-xl border-neutral-100 dark:border-neutral-800">
                <h3 className="text-lg font-bold mb-6">Reservation Summary</h3>
                {/* ... (Summary logic stays same) ... */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                  <img src={vehicle.image} alt={vehicle.name} className="w-24 h-16 object-cover rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-sm" />
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{vehicle.name}</h4>
                    <p className="text-neutral-400 text-xs font-medium">{vehicle.type}</p>
                    <p className="text-brand-blue font-bold text-xs mt-2">₹{(vehicle.pricePerDay || 0).toLocaleString('en-IN')} / Day</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-neutral-400">Rental Duration</span>
                    <span className="text-neutral-900 dark:text-neutral-50">{rentalDays} Day{rentalDays > 1 ? 's' : ''}</span>
                  </div>
                  {selectedAddOns.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Service Add-ons</p>
                      {selectedAddOns.map(id => {
                        const addon = addOns.find(a => a.id === id);
                        return (
                          <div key={id} className="flex justify-between text-sm font-medium">
                            <span className="text-neutral-500">{addon.name}</span>
                            <span className="font-bold">₹{addon.price.toLocaleString('en-IN')}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-neutral-500">GST (Corporate Hub 18%)</span>
                    <span className="font-bold">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <span className="font-bold text-neutral-900 dark:text-neutral-50 uppercase text-xs tracking-widest">Final Total</span>
                    <span className="text-3xl font-black text-brand-orange">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-8 flex items-start gap-3 p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl text-[10px] text-brand-blue leading-relaxed font-bold italic">
                  <span className="icon-rounded text-sm">info</span>
                  <p>Corporate accounts may eligible for further tax benefits. Contact support pre-billing for GSTIN integration.</p>
                </div>
              </Card>

              <div className="flex items-center justify-center gap-6 opacity-20 filter grayscale">
                 <img src="https://api.iconify.design/logos:upi.svg" className="h-4" alt="UPI" />
                 <img src="https://api.iconify.design/logos:visa.svg" className="h-3" alt="VISA" />
                 <img src="https://api.iconify.design/logos:mastercard.svg" className="h-6" alt="MASTERCARD" />
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
