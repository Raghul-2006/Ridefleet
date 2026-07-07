import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

export const useRideFleetStore = create(
  persist(
    (set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  userRole: 'customer', // 'customer' or 'admin'
  adminUser: null,
  adminAuthenticated: false,
  
  // Initial mockup data (will be replaced by API calls)
  vehicles: [],
  bookings: [],

  // Indian Cities
  indianCities: [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
    'Lucknow', 'Chandigarh', 'Indore', 'Kochi', 'Visakhapatnam'
  ],

  // Payment Methods
  paymentMethods: [
    { id: 'upi', name: 'UPI (Google Pay, PhonePe, Paytm)' },
    { id: 'card', name: 'Debit/Credit Card' },
    { id: 'netbanking', name: 'Net Banking' },
    { id: 'paytm', name: 'Paytm Wallet' },
    { id: 'cash', name: 'Cash at Pickup' }    
  ],
  
  // Filter state
  filters: {
    type: null,
    search: '',
    priceRange: [500, 50000],
    seats: null,
    transmission: null,
    fuel: null,
    sortBy: 'popularity'
  },

  // UI state
  theme: 'dark',
  sidebarOpen: false,
  toastMessage: null,

  // Reward Points
  rewardPoints: 0,

  // Actions
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
  setUserRole: (role) => set({ userRole: role }),
  setFilters: (filters) => set({ filters }),
  setTheme: (theme) => set({ theme }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setToastMessage: (message) => set({ toastMessage: message }),
  
  deductPoints: (rupeeAmount) => set((state) => ({ 
    rewardPoints: Math.max(0, state.rewardPoints - Math.ceil(rupeeAmount / 10)) 
  })),

  // --- API ACTIONS ---

  // Auth: Register
  register: async (name, email, password, role = 'customer', adminSecret = null) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role, adminSecret });
      
      if (data.role === 'admin') {
        set({
          adminUser: data,
          adminAuthenticated: true,
          userRole: 'admin',
          isAuthenticated: true,
          user: data
        });
      } else {
        set({
          user: data,
          isAuthenticated: true,
          userRole: 'customer',
          rewardPoints: data.rewardPoints
        });
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  // Auth: Login
  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data.role === 'admin') {
        set({
          adminUser: data,
          adminAuthenticated: true,
          userRole: 'admin',
          isAuthenticated: true,
          user: data
        });
      } else {
        set({
          user: data,
          isAuthenticated: true,
          userRole: 'customer',
          rewardPoints: data.rewardPoints
        });
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  // Auth: Logout
  logout: () => set({
    user: null,
    isAuthenticated: false,
    adminUser: null,
    adminAuthenticated: false,
    userRole: 'customer'
  }),
  
  // Vehicles: Fetch
  fetchVehicles: async () => {
    try {
      const { data } = await api.get('/vehicles');
      set({ vehicles: data });
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  },
  
  // Vehicles: Fetch Reviews
  fetchVehicleReviews: async (id) => {
    try {
      const { data } = await api.get(`/vehicles/${id}/reviews`);
      return data;
    } catch (error) {
      console.error('Failed to fetch vehicle reviews:', error);
      return [];
    }
  },

  // Bookings: Fetch
  fetchBookings: async () => {
    try {
      const { data } = await api.get('/bookings');
      set({ bookings: data });
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  },

  // Bookings: Add
  addBooking: async (bookingData) => {
    try {
      const { data } = await api.post('/bookings', bookingData);
      set((state) => ({
        bookings: [...state.bookings, data],
        rewardPoints: state.rewardPoints + 10
      }));
      return { success: true, data: data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Booking failed' 
      };
    }
  },

  // Admin Actions (Vehicle Management)
  addVehicle: async (vehicleData) => {
    try {
      const { data } = await api.post('/vehicles', vehicleData);
      set((state) => ({
        vehicles: [...state.vehicles, data]
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },
  
  updateVehicle: async (id, updates) => {
    try {
      const { data } = await api.patch(`/vehicles/${id}`, updates);
      set((state) => ({
        vehicles: state.vehicles.map(v => v._id === id ? data : v)
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },
  
    deleteVehicle: async (id) => {
      try {
        await api.delete(`/vehicles/${id}`);
        set((state) => ({
          vehicles: state.vehicles.filter(v => v._id !== id)
        }));
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message };
      }
    },

    submitFeedback: async (id, rating, feedback) => {
      try {
        const { data } = await api.patch(`/bookings/${id}/feedback`, { rating, feedback });
        set((state) => ({
          bookings: state.bookings.map(b => b._id === id ? data : b)
        }));
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message };
      }
    },

    updateBookingStatus: async (id, status) => {
      try {
        const { data } = await api.patch(`/bookings/${id}/status`, { status });
        set((state) => ({
          bookings: state.bookings.map(b => b._id === id ? data : b)
        }));
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message };
      }
    }
  }), {
  name: 'ridefleet-storage'
}))
