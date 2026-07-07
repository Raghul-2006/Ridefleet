import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRideFleetStore } from '../store/ridefleet';
import { Button } from './UI';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useRideFleetStore((state) => state.theme);
  const setTheme = useRideFleetStore((state) => state.setTheme);
  const isAuthenticated = useRideFleetStore((state) => state.isAuthenticated);
  const adminAuthenticated = useRideFleetStore((state) => state.adminAuthenticated);
  const user = useRideFleetStore((state) => state.user);
  const logout = useRideFleetStore((state) => state.logout);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Fleet', path: '/browse' },
    { name: 'Membership', path: '/dashboard' },
    { name: 'Admin Control', path: '/admin' },
  ];

  const isHeroPage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const isLoggedIn = isAuthenticated || adminAuthenticated;

  const textColor = !isScrolled && isHeroPage
    ? 'text-white/80 hover:text-white'
    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 py-3'
          : isHeroPage ? 'bg-transparent py-5' : 'bg-white dark:bg-neutral-950 py-4 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-blue rounded-lg flex items-center justify-center shadow-md shadow-brand-blue/20">
            <span className="icon-rounded text-white text-xl md:text-2xl">directions_car</span>
          </div>
          <span className={`text-xl md:text-2xl font-black tracking-tight ${
            !isScrolled && isHeroPage ? 'text-white' : 'text-neutral-900 dark:text-neutral-50'
          }`}>
            Ride<span className="text-brand-blue">Fleet</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-bold transition-all duration-200 hover:text-brand-blue ${
                location.pathname === link.path
                  ? 'text-brand-blue'
                  : (!isScrolled && isHeroPage ? 'text-white/80 hover:text-white' : 'text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200')
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
              !isScrolled && isHeroPage
                ? 'hover:bg-white/10 text-white/60 hover:text-white'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <span className="icon-rounded text-xl">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <div className={`h-6 w-[1px] ${!isScrolled && isHeroPage ? 'bg-white/20' : 'bg-neutral-200 dark:bg-neutral-800'}`} />

          {isLoggedIn ? (
            <>
              <Link
                to={adminAuthenticated ? '/admin' : '/dashboard'}
                className={`text-sm font-bold px-2 transition-colors ${textColor}`}
              >
                {adminAuthenticated ? 'Admin Panel' : (user?.name ? user.name.split(' ')[0] : 'My Fleet')}
              </Link>
              <Button
                variant="outline"
                className="rounded-lg text-xs px-5 border-neutral-200 dark:border-neutral-700"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={`text-sm font-bold px-4 transition-colors ${textColor}`}>
                Sign In
              </Link>
              <Button className="rounded-lg text-sm px-6" onClick={() => navigate('/browse')}>
                Book Now
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="icon-rounded text-2xl">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg font-bold text-neutral-900 dark:text-neutral-100 py-2 border-b border-neutral-50 dark:border-neutral-900 last:border-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                  <span className="font-bold text-sm">Appearance</span>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <span className="icon-rounded">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {isLoggedIn ? (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => { setIsMobileMenuOpen(false); navigate(adminAuthenticated ? '/admin' : '/dashboard'); }}
                      >
                        {adminAuthenticated ? 'Admin Dashboard' : 'Member Dashboard'}
                      </Button>
                      <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>Sign In</Button>
                      <Button onClick={() => { setIsMobileMenuOpen(false); navigate('/browse'); }}>Book a Ride</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
