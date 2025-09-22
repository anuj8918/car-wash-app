
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BookingCard from '../components/BookingCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';

const HomePage = () => {
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        ...filters, search: searchQuery, sort: sortOption, page: currentPage, limit: 9,
      });
      for (const [key, value] of params.entries()) { if (!value) { params.delete(key); } }
      const response = await axios.get(`http://localhost:5000/api/bookings?${params.toString()}`);
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, sortOption, currentPage]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleFilterChange = useCallback((newFilters) => {
    setCurrentPage(1); setFilters(newFilters);
  }, []);
  
  const handleSearch = useCallback((query) => {
    setCurrentPage(1); setSearchQuery(query);
  }, []);

  return (
    
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
      
      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <div className="sticky top-24">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>
      </aside>

      
      <div className="flex-grow">
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <select onChange={(e) => setSortOption(e.target.value)} value={sortOption} className="w-full input-style">
                <option value="createdAt">Sort by Newest</option>
                <option value="price">Sort by Price</option>
                <option value="duration">Sort by Duration</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>

        {loading && <p className="text-center text-gray-500 mt-8">Loading...</p>}
        {error && <p className="text-center text-red-500 mt-8">{error}</p>}
        
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bookings.length > 0 ? (
                bookings.map(booking => <BookingCard key={booking._id} booking={booking} />)
              ) : (
                <div className="col-span-full text-center text-gray-500 mt-8 p-10 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold">No Bookings Found</h3>
                  <p>Try changing your filters or create a new booking.</p>
                </div>
              )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;