import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaSave, FaUser, FaCar, FaTools, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

const addonOptions = ["Interior Cleaning", "Wax Polishing", "Tire Shine"];
const timeSlotOptions = [
  "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM"
];

const BookingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    customerName: '', carMake: '', carModel: '', carYear: new Date().getFullYear(),
    carType: 'sedan', serviceType: 'Basic Wash', date: '', timeSlot: '',
    duration: 30, price: 25, status: 'Pending', addons: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      axios.get(`https://car-wash-app-09rp.onrender.com/api/bookings/${id}`)
        .then(response => {
          const bookingData = {
            ...response.data,
            date: response.data.date ? new Date(response.data.date).toISOString().split('T')[0] : ''
          };
          setFormData(bookingData);
        })
        .catch(err => setError('Failed to fetch booking details.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddonToggle = (addon) => {
    setFormData(prev => ({
        ...prev,
        addons: prev.addons.includes(addon)
          ? prev.addons.filter(item => item !== addon)
          : [...prev.addons, addon]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.customerName.trim()) newErrors.customerName = "Customer name is required.";
    if (!formData.carMake.trim()) newErrors.carMake = "Car make is required.";
    if (!formData.carModel.trim()) newErrors.carModel = "Car model is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    else if (formData.date < today) newErrors.date = "Date cannot be in the past.";
    if (!formData.timeSlot) newErrors.timeSlot = "Time slot is required.";
    if (formData.price <= 0) newErrors.price = "Price must be a positive number.";
    if (formData.duration <= 0) newErrors.duration = "Duration must be a positive number.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await axios.put(`https://car-wash-app-09rp.onrender.com/api/bookings/${id}`, formData);
      } else {
        await axios.post('https://car-wash-app-09rp.onrender.com/api/bookings', formData);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div className="text-center mt-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to={isEditing ? `/bookings/${id}` : "/"} className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-2 mb-4">
        <FaArrowLeft /> Back
      </Link>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">{isEditing ? 'Edit Booking' : 'Create New Booking'}</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</div>}

        <div className="space-y-8">
          
          <fieldset>
            <legend className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FaUser /> Customer & Vehicle</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} className={`mt-1 input-style ${errors.customerName && 'border-red-500'}`} />
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Make</label>
                <input type="text" name="carMake" value={formData.carMake} onChange={handleChange} className={`mt-1 input-style ${errors.carMake && 'border-red-500'}`} />
                {errors.carMake && <p className="text-red-500 text-xs mt-1">{errors.carMake}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Model</label>
                <input type="text" name="carModel" value={formData.carModel} onChange={handleChange} className={`mt-1 input-style ${errors.carModel && 'border-red-500'}`} />
                {errors.carModel && <p className="text-red-500 text-xs mt-1">{errors.carModel}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Year</label>
                <input type="number" name="carYear" value={formData.carYear} onChange={handleChange} className="mt-1 input-style" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Type</label>
                <select name="carType" value={formData.carType} onChange={handleChange} className="mt-1 input-style">
                  <option value="sedan">Sedan</option> <option value="SUV">SUV</option> <option value="hatchback">Hatchback</option> <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
          </fieldset>
          
          
          <fieldset>
            <legend className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FaCalendarAlt /> Service & Schedule</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-1 input-style">
                  <option>Basic Wash</option>
                  <option>Deluxe Wash</option>
                  <option>Full Detailing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className={`mt-1 input-style ${errors.date && 'border-red-500'}`} />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} className={`mt-1 input-style ${errors.timeSlot && 'border-red-500'}`}>
                  <option value="">Select a time</option>
                  {timeSlotOptions.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                </select>
                {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 input-style">
                  <option>Pending</option> <option>Confirmed</option> <option>Completed</option> <option>Cancelled</option>
                </select>
              </div>
            </div>
          </fieldset>

          
           <fieldset>
            <legend className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FaTools /> Add-ons & Billing</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Add-ons</label>
                <div className="mt-2 flex flex-wrap gap-4">
                  {addonOptions.map(addon => (
                    <div key={addon} className="flex items-center">
                      <input id={addon} type="checkbox" checked={formData.addons.includes(addon)} onChange={() => handleAddonToggle(addon)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                      <label htmlFor={addon} className="ml-2 block text-sm text-gray-900">{addon}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} className={`mt-1 input-style ${errors.duration && 'border-red-500'}`} />
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className={`mt-1 input-style ${errors.price && 'border-red-500'}`} />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
            </div>
          </fieldset>
        </div>

        <div className="pt-6 mt-8 border-t">
          <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
            <FaSave />
            {loading ? 'Saving...' : (isEditing ? 'Update Booking' : 'Create Booking')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;