import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  
  
  carMake: { type: String, trim: true },
  carModel: { type: String, trim: true },
  carYear: Number,
  carType: String,

  serviceType: { type: String, enum: ["Basic Wash", "Deluxe Wash", "Full Detailing"], required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  duration: { type: Number, default: 30 },
  price: { type: Number, default: 25 },
  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
  rating: Number,
  addons: [String],
}, { timestamps: true });


if (mongoose.models && mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;