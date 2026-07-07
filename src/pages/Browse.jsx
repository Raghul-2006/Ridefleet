import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Badge, Drawer, Skeleton, Select } from '../components/UI';
import { VehicleCard } from '../components/VehicleCard';
import { useRideFleetStore } from '../store/ridefleet';
import { motion } from 'framer-motion';

const Browse = () => {
  const vehicles = useRideFleetStore((state) => state.vehicles) || [];
  const filters = useRideFleetStore((state) => state.filters) || {};
  const setFilters = useRideFleetStore((state) => state.setFilters);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');

  const fetchVehicles = useRideFleetStore((state) => state.fetchVehicles);

  useEffect(() => {
    fetchVehicles().then(() => setIsLoading(false));
  }, [fetchVehicles]);

  const categories = ['All', 'Sedan', 'SUV', 'Electric', 'MPV', 'Luxury'];

  const filteredVehicles = (vehicles || []).filter(v => {
    const matchesCategory = !filters?.type || filters?.type === 'All' || v?.type?.includes(filters?.type);
    const matchesSearch = !filters?.search || v?.name?.toLowerCase().includes(filters?.search?.toLowerCase());
    const matchesPrice = v?.pricePerDay >= (filters?.priceRange?.[0] || 0) && v?.pricePerDay <= (filters?.priceRange?.[1] || 100000);
    const matchesFuel = !filters?.fuel || v?.specs?.fuel === filters?.fuel;
    return matchesCategory && matchesSearch && matchesPrice && matchesFuel;
  });

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === 'price_asc') return a.pricePerDay - b.pricePerDay;
    if (sortBy === 'price_desc') return b.pricePerDay - a.pricePerDay;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Popularity (default)
  });

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Vehicle Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilters({ ...filters, type: cat })}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                (filters.type || 'All') === cat 
                ? 'bg-brand-blue text-white shadow-md' 
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'
              }`}
            >
              {cat}
              <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                (filters.type || 'All') === cat ? 'bg-white/20' : 'bg-neutral-100 dark:bg-neutral-800'
              }`}>
                {cat === 'All' ? vehicles.length : vehicles.filter(v => v.type.includes(cat)).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Fuel Type</h3>
        <Select 
          options={[
            { label: 'All Fuel Types', value: '' },
            { label: 'Petrol', value: 'Petrol' },
            { label: 'Diesel', value: 'Diesel' },
            { label: 'Electric', value: 'Electric' }
          ]}
          value={filters.fuel || ''}
          onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Max Daily Rate</h3>
        <div className="px-2">
          <input 
            type="range" 
            min="500" 
            max="10000" 
            step="500"
            className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
            value={filters.priceRange?.[1] || 10000}
            onChange={(e) => setFilters({ ...filters, priceRange: [500, parseInt(e.target.value)] })}
          />
          <div className="flex justify-between mt-3 text-xs font-bold text-neutral-400">
            <span>₹500</span>
            <span className="text-brand-blue">Up to ₹{(filters.priceRange?.[1] || 10000).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Card className="bg-brand-blue/5 border-brand-blue/10 p-6 text-center">
           <h4 className="font-bold text-sm mb-2">Need Help Choosing?</h4>
           <p className="text-xs text-neutral-500 mb-4">Our mobility experts are available 24/7 to assist you.</p>
           <Button variant="outline" size="sm" className="w-full">Contact Support</Button>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 dark:bg-neutral-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-3 tracking-tight">
              Explore Our <span className="text-brand-blue">Collection</span>
            </h1>
            <p className="text-neutral-500 font-medium text-sm">Professional mobility across major Indian cities. Choose from over 50+ verified vehicle models.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-grow md:min-w-[400px]">
              <Input 
                placeholder="Search models (e.g. BMW, Tesla...)" 
                icon="search" 
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <Button 
                variant="secondary" 
                iconBefore="tune" 
                className="lg:hidden" 
                onClick={() => setIsFilterDrawerOpen(true)}
            >
              Filters
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block">
            <FilterContent />
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Sorting & Stats */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 dark:border-neutral-900">
              <p className="text-xs font-bold text-neutral-400">
                Found <span className="text-neutral-900 dark:text-neutral-50 font-black">{sortedVehicles.length}</span> verified options
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-400">Sort by:</span>
                <select 
                  className="bg-transparent text-xs font-bold text-brand-blue outline-none cursor-pointer p-1"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-8">
              {isLoading ? (
                // Skeletons
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="p-0 overflow-hidden h-full">
                    <Skeleton className="h-56 w-full rounded-none" />
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                      <Skeleton className="h-4 w-1/3" />
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="flex justify-between items-end pt-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-10 circle" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : sortedVehicles.length > 0 ? (
                sortedVehicles.map(vehicle => (
                  <motion.div
                    key={vehicle._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VehicleCard vehicle={vehicle} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                    <span className="icon-rounded text-4xl">search_off</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">No matches found</h3>
                  <p className="text-neutral-500 mb-6">Try adjusting your filters or search keywords.</p>
                  <Button variant="secondary" onClick={() => setFilters({ search: '', type: 'All', priceRange: [500, 100000] })}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination Placeholder */}
            {!isLoading && sortedVehicles.length > 0 && (
              <div className="mt-16 flex justify-center gap-2">
                <Button variant="secondary" size="sm" disabled>Previous</Button>
                <Button variant="secondary" size="sm" className="bg-brand-blue text-white hover:bg-brand-blue/90">1</Button>
                <Button variant="secondary" size="sm">2</Button>
                <Button variant="secondary" size="sm">Next</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Refine Search"
      >
        <FilterContent />
        <div className="mt-10">
           <Button className="w-full" onClick={() => setIsFilterDrawerOpen(false)}>Apply Filters</Button>
        </div>
      </Drawer>
    </div>
  );
};

export default Browse;
