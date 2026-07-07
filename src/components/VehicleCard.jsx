import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Card, Button } from './UI';
import { motion } from 'framer-motion';

export const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();

  const handleQuickBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/checkout', { state: { vehicleId: vehicle._id, rentalDays: 1 } });
  };

  return (
    <div className="block h-full">
      <Card className="p-0 overflow-hidden flex flex-col h-full group relative">
        {/* Availability & Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {vehicle.available ? (
            <Badge variant="success" className="shadow-sm">Available</Badge>
          ) : (
            <Badge variant="error" className="shadow-sm">Booked</Badge>
          )}
          {vehicle.badge && (
            <Badge variant="info" className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-none shadow-sm capitalize">
              {vehicle.badge}
            </Badge>
          )}
        </div>

        {/* Wishlist Placeholder */}
        <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm flex items-center justify-center text-neutral-400 hover:text-rose-500 transition-colors shadow-sm">
          <span className="icon-rounded text-lg">favorite</span>
        </button>

        {/* Image Container */}
        <Link to={`/vehicle/${vehicle._id}`} className="relative h-48 md:h-56 overflow-hidden block">
          <img 
            src={vehicle.image} 
            alt={vehicle.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-300" />
          
          {/* Quick Book Overlap (Desktop Only) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
            <Button 
              size="sm" 
              className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl"
              onClick={handleQuickBook}
            >
              Quick Book
            </Button>
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50 mb-1 leading-tight group-hover:text-brand-blue transition-colors">
                {vehicle.name}
              </h3>
              <p className="text-xs text-neutral-500">{vehicle.type} · {vehicle.year}</p>
            </div>
            <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800 px-2 py-1 rounded-lg">
              <span className="icon-rounded text-amber-400 text-sm">star</span>
              <span className="text-xs font-bold">{vehicle.rating}</span>
              <span className="text-[10px] text-neutral-400 font-normal">({vehicle.reviews})</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-2 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-neutral-500">
              <span className="icon-rounded text-lg">settings</span>
              <span className="text-xs font-medium">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500">
              <span className="icon-rounded text-lg">local_gas_station</span>
              <span className="text-xs font-medium">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500">
              <span className="icon-rounded text-lg">person</span>
              <span className="text-xs font-medium">{vehicle.seats} Adults</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500">
              <span className="icon-rounded text-lg">speed</span>
              <span className="text-xs font-medium">{vehicle.specs?.maxSpeed || '220 km/h'}</span>
            </div>
          </div>

          <div className="mt-auto pt-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Price / Day</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-neutral-900 dark:text-neutral-50">₹{(vehicle.pricePerDay || 0).toLocaleString('en-IN')}</span>
                <span className="text-xs text-neutral-500 font-medium">excl. GST</span>
              </div>
            </div>
            <Link to={`/vehicle/${vehicle._id}`}>
              <Button variant="ghost" className="p-2 min-w-0 h-10 w-10 md:hidden">
                <span className="icon-rounded">arrow_forward</span>
              </Button>
              <Button variant="ghost" size="sm" className="hidden md:flex font-bold text-xs uppercase tracking-wider">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
