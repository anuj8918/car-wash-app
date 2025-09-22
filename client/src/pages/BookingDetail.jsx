import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaCalendarAlt, FaClock, FaCar, FaInfoCircle, FaRupeeSign, FaTags, FaPencilAlt, FaTrash, 
  FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaHourglassHalf, FaUser, FaTools 
} from 'react-icons/fa';


const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-medium text-gray-900">Confirm Action</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-4 flex justify-end space-x-3">
          <button onClick={onClose} className="btn-secondary w-auto">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger w-auto">
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};


const DetailItem = ({ icon, label, value }) => (
  <div className="flex flex-col">
    <dt className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
      {icon} {label}
    </dt>
    <dd className="text-gray-900 font-semibold">{value}</dd>
  </div>
);

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusConfig = {
    Pending: { icon: FaHourglassHalf, text: 'text-yellow-800', bg: 'bg-yellow-100' },
    Confirmed: { icon: FaCheckCircle, text: 'text-green-800', bg: 'bg-green-100' },
    Completed: { icon: FaCheckCircle, text: 'text-blue-800', bg: 'bg-blue-100' },
    Cancelled: { icon: FaTimesCircle, text: 'text-red-800', bg: 'bg-red-100' },
  };
  const currentStatus = statusConfig[booking?.status] || { icon: FaExclamationCircle, text: 'text-gray-800', bg: 'bg-gray-100' };
  const CurrentStatusIcon = currentStatus.icon;

  useEffect(() => {
    axios.get(`https://car-wash-app-09rp.onrender.com/api/bookings/${id}`)
      .then(response => setBooking(response.data))
      .catch(err => setError('Booking not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setIsModalOpen(false); 
    try {
      await axios.delete(`https://car-wash-app-09rp.onrender.com/api/bookings/${id}`);
      navigate('/');
    } catch (err) {
      setError('Failed to delete booking.');
    }
  };
  
  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-12">{error}</div>;
  if (!booking) return null;

  return (
    <>
      
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to permanently delete this booking?"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-2 mb-4">
          <FaArrowLeft /> Back to all bookings
        </Link>

        
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{booking.customerName}</h1>
              <p className="text-md text-gray-500">{booking.serviceType}</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
              <CurrentStatusIcon />
              <span>{booking.status}</span>
            </div>
          </div>
          <div className="border-t my-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt />
              <span>{new Date(booking.date).toLocaleDateString('en-GB')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaClock />
              <span>{booking.timeSlot}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaCar />
              <span>{booking.carMake} {booking.carModel}</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <FaRupeeSign />
              <span>{booking.price}</span>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FaCar /> Vehicle Details</h2>
            <dl className="space-y-4">
              <DetailItem label="Make & Model" value={`${booking.carMake} ${booking.carModel}`} />
              <DetailItem label="Type" value={booking.carType} />
              <DetailItem label="Year" value={booking.carYear} />
            </dl>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FaTools /> Service Details</h2>
            <dl className="space-y-4">
              <DetailItem label="Service Type" value={booking.serviceType} />
              <DetailItem label="Add-ons" value={booking.addons.length > 0 ? booking.addons.join(', ') : 'None'} />
              <DetailItem label="Duration" value={`${booking.duration} minutes`} />
            </dl>
          </div>
        </div>

        
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row gap-4">
          <button onClick={() => navigate(`/edit/${booking._id}`)} className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
            <FaPencilAlt /> Edit Booking
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-danger w-full md:w-auto flex items-center justify-center gap-2">
            <FaTrash /> Delete Booking
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingDetail;