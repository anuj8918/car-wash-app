
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaClock, FaTag, FaRupeeSign, FaUser, FaArrowRight } from 'react-icons/fa';

const BookingCard = ({ booking }) => {
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-green-100 text-green-800',
    Completed: 'bg-blue-100 text-blue-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  const carMake = booking.carMake || 'N/A';
  const carModel = booking.carModel || '';
  
  return (
    
    <div className="bg-white rounded-lg border border-gray-200 transition-shadow duration-300 hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm font-medium text-indigo-600">{booking.serviceType}</p>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaUser className="text-gray-400" /> {booking.customerName}
            </h3>
          </div>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[booking.status]}`}>
            {booking.status}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mt-4">
          <p className="flex items-center gap-2"><FaCar className="text-gray-400" /> {carMake} {carModel} ({booking.carType})</p>
          <p className="flex items-center gap-2"><FaClock className="text-gray-400" /> {new Date(booking.date).toLocaleDateString()}</p>
          <p className="flex items-center gap-2"><FaTag className="text-gray-400" /> {booking.addons.length > 0 ? booking.addons.join(', ') : 'No add-ons'}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center">
        <p className="text-xl font-bold text-gray-900 flex items-center">
            
            <FaRupeeSign className="mr-1"/>{booking.price}
        </p>
        
        <Link to={`/bookings/${booking._id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <span>View Details</span>
            <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;