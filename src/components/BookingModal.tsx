import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Loader, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '../lib/supabase';
import { createPaymentSession } from '../lib/stripe';

interface BookingModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ trip, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!selectedDate) {
      setError('Please select a departure date');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const session = await createPaymentSession(trip.id, selectedDate);
      
      if (!session?.url) {
        throw new Error('Invalid payment session response');
      }

      window.location.href = session.url;
    } catch (error) {
      console.error('Booking error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-xl p-6 max-w-lg w-full relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4">{trip.title}</h2>
            <div className="mb-6">
              <p className="text-gray-400">{trip.description}</p>
              <p className="mt-2 text-purple-400">Duration: {trip.duration}</p>
              <p className="font-bold text-white">
                Price: ${(trip.price / 100).toLocaleString()}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Departure Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setError(null);
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              >
                <option value="">Choose a date</option>
                {trip.departure_dates.map((date) => (
                  <option key={date} value={date}>
                    {format(new Date(date), 'PPP')}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg flex items-center gap-2 text-red-200">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={!selectedDate || loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 
                       disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold
                       flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5" />
                  <span>Book Now</span>
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;