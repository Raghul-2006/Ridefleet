import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRideFleetStore } from '../store/ridefleet';
import { Button, Card, Input } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useRideFleetStore((state) => state.login);
  const register = useRideFleetStore((state) => state.register);
  const isAuthenticated = useRideFleetStore((state) => state.isAuthenticated);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in (using useEffect to avoid render-phase navigation)
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let result;
    if (isRegister) {
      result = await register(name, email, password);
    } else {
      result = await login(email, password);
    }
    
    setLoading(false);
    
    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      alert(result.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 shadow-xl shadow-brand-blue/5 mb-6">
             <span className="icon-rounded text-brand-blue text-2xl font-black italic">RF</span>
          </div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-neutral-500 font-medium mt-1">Access your premium fleet and rewards.</p>
        </div>

        <Card className="p-10 shadow-2xl border-neutral-100 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl">
          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input 
                    label="Full Name"
                    placeholder="Rahul Sharma" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input 
              label="Email Address"
              type="email"
              placeholder="rahul@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Password</label>
                {!isRegister && (
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">Forgot?</button>
                )}
              </div>
              <Input 
                type="password"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
                type="submit" 
                className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-xl shadow-brand-blue/20"
                isLoading={loading}
            >
              {isRegister ? 'Join Membership' : 'Sign In to RideFleet'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 text-center">
             <p className="text-xs text-neutral-500 font-medium">
               {isRegister ? 'Already a member?' : 'New to RideFleet?'} 
               <button 
                 type="button"
                 onClick={() => setIsRegister(!isRegister)}
                 className="text-brand-blue font-bold ml-1"
               >
                 {isRegister ? 'Sign In' : 'Join Membership'}
               </button>
             </p>
          </div>
        </Card>

        <p className="mt-8 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-[2px]">
          Secure Professional Sessions
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
