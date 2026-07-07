import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRideFleetStore } from '../store/ridefleet';
import { Button, Card, Input } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
  const navigate = useNavigate();
  const login = useRideFleetStore((state) => state.login);
  const register = useRideFleetStore((state) => state.register);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isRegister) {
      result = await register(name, email, password, 'admin', secretKey);
    } else {
      result = await login(email, password);
    }

    setLoading(false);
    
    if (result.success) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        const state = useRideFleetStore.getState();
        if (state.adminAuthenticated || state.userRole === 'admin') {
          navigate('/admin/hub');
        } else {
          setError('Access denied. This portal is for administrators only.');
        }
      }, 100);
    } else {
      setError(result.message || (isRegister ? 'Registration failed.' : 'Invalid administrative credentials.'));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue shadow-lg shadow-brand-blue/20 mb-6 font-black italic text-white text-2xl">
            RF
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            {isRegister ? 'Admin Registration' : 'Administrative Access'}
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            {isRegister ? 'Create a new administrative profile.' : 'Please authenticate to access the fleet control center.'}
          </p>
        </div>

        <Card className="p-10 shadow-2xl border-neutral-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
          <form onSubmit={handleAuth} className="space-y-6">
            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div
                  key="reg-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <Input 
                    label="Full Name"
                    placeholder="Admin Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input 
                    label="Secret Admin Key"
                    type="password"
                    placeholder="Enter security passcode" 
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input 
              label="Admin Email"
              type="email"
              placeholder="admin@ridefleet.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={!isRegister}
            />

            <Input 
              label="Password"
              type="password"
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-start gap-3"
              >
                <span className="icon-rounded text-red-500 text-lg">error_outline</span>
                <p className="text-xs font-bold text-red-700 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            <Button 
                type="submit" 
                className="w-full py-4 text-sm font-bold uppercase tracking-widest"
                isLoading={loading}
            >
              {isRegister ? 'Create Admin Account' : 'Authorize Entry'}
            </Button>

            <div className="pt-4 text-center">
               <button 
                 type="button"
                 onClick={() => { setIsRegister(!isRegister); setError(''); }}
                 className="text-[10px] text-brand-blue font-bold uppercase tracking-widest hover:underline"
               >
                  {isRegister ? 'Back to Login' : 'Need Administrative Access? Register Here'}
               </button>
            </div>
          </form>
        </Card>

        <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/')} 
              className="text-xs font-bold text-neutral-400 hover:text-brand-blue transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <span className="icon-rounded text-sm">arrow_back</span>
              Return to Public Site
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
