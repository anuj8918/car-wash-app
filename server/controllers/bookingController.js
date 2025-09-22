import Booking from '../models/Booking.js';


export const getBookings = async (req, res) => {
  try {
    const { serviceType, carType, status, startDate, endDate, search, page = 1, limit = 9, sort = 'createdAt' } = req.query;
    let filter = {};

    if (serviceType) filter.serviceType = serviceType;
    if (status) filter.status = status;
    
    if (carType) filter.carType = carType;
    
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      
      filter.$or = [
        { customerName: searchRegex },
        { carMake: searchRegex },
        { carModel: searchRegex },
      ];
    }

    const sortOptions = {};
    if (sort === 'price') sortOptions.price = 1; 
    else if (sort === 'duration') sortOptions.duration = 1;
    else if (sort === 'status') sortOptions.status = 1;
    else sortOptions.createdAt = -1;

    const skip = (page - 1) * limit;
    const totalBookings = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(totalBookings / limit);

    const bookings = await Booking.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
      
    res.json({ bookings, currentPage: parseInt(page), totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    // console.error("--- BOOKING SAVE ERROR ---", err);
    res.status(400).json({ message: err.message });
  }
};


export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};