// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingDetail from './pages/BookingDetail';
import BookingForm from './components/BookingForm';
import Layout from './components/Layout'; 

function App() {
  return (
    <Router>
      
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />
          <Route path="/create" element={<BookingForm />} />
          <Route path="/edit/:id" element={<BookingForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;