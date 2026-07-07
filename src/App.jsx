import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useRideFleetStore } from './store/ridefleet';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Browse from './pages/Browse';
import VehicleDetail from './pages/VehicleDetail';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import Login from './pages/Login';
import AdminHub from './pages/AdminHub';
import { Toast } from './components/UI';

// Protected Admin Route
const ProtectedAdminRoute = ({ element }) => {
  const adminAuthenticated = useRideFleetStore((state) => state.adminAuthenticated);
  return adminAuthenticated ? element : <Navigate to="/admin/login" replace />;
};

// Protected User/Member Route
const ProtectedUserRoute = ({ element }) => {
  const isAuthenticated = useRideFleetStore((state) => state.isAuthenticated);
  const location = useLocation();
  return isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { toastMessage, setToastMessage } = useRideFleetStore();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<ProtectedUserRoute element={<Dashboard />} />} />
          
          {/* Unified Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdminRoute element={<AdminHub />} />} />
          <Route path="/admin/hub" element={<ProtectedAdminRoute element={<AdminHub />} />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage.text} 
            type={toastMessage.type} 
            onHide={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

function App() {
  const theme = useRideFleetStore((state) => state.theme);

  return (
    <Router>
      <AppContent theme={theme} />
    </Router>
  );
}

const AppContent = ({ theme }) => {
  const location = useLocation();
  const isAdminHub = location.pathname === '/admin/hub';

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col font-sans transition-colors duration-300">
        {!isAdminHub && <Navbar />}
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        {!isAdminHub && <Footer />}
      </div>
    </div>
  );
}

export default App;
