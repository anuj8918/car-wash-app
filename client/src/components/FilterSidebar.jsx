import React,{ useState, useEffect } from 'react';
import { FaBroom } from 'react-icons/fa';

const FilterSidebar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    serviceType: '', carType: '', status: '', startDate: '', endDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, onFilterChange]);

  const handleClearFilters = () => {
    setFilters({
      serviceType: '', carType: '', status: '', startDate: '', endDate: '',
    });
  };

  return (
    
    <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Filter Bookings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Type</label>
          <select name="serviceType" value={filters.serviceType} onChange={handleChange} className="mt-1 input-style">
            <option value="">All Services</option>
            <option value="Basic Wash">Basic Wash</option>
            <option value="Deluxe Wash">Deluxe Wash</option>
            <option value="Full Detailing">Full Detailing</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Car Type</label>
          <select name="carType" value={filters.carType} onChange={handleChange} className="mt-1 input-style">
            <option value="">All Car Types</option>
            <option value="sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" value={filters.status} onChange={handleChange} className="mt-1 input-style">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">From Date</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} className="mt-1 input-style" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To Date</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} className="mt-1 input-style" />
        </div>
      </div>
      
      <button onClick={handleClearFilters} className="mt-6 btn-secondary flex items-center justify-center gap-2">
        <FaBroom />
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSidebar;