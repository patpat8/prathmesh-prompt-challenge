import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Hotel, Plane as Planet, AlertCircle } from 'lucide-react';
import { supabase, Trip } from '../lib/supabase';
import BookingModal from './BookingModal';

const FeaturedTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setError(null);
        const { data, error: supabaseError } = await supabase
          .from('trips')
          .select('*')
          .order('created_at', { ascending: true });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (!data) {
          throw new Error('No trips found');
        }

        // Validate the data structure
        const validatedTrips = data.map(trip => {
          if (!trip.id || !trip.title || !trip.description || !trip.price || !trip.image_url) {
            throw new Error('Invalid trip data structure');
          }
          return trip;
        });

        setTrips(validatedTrips);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trips');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleBookNow = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl text-red-400 mb-2">Failed to Load Trips</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Featured Space Adventures
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="relative h-48">
                <img 
                  src={trip.image_url} 
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {trip.title.includes('Orbital') ? (
                    <Rocket className="h-6 w-6 text-purple-500 mr-2" />
                  ) : trip.title.includes('Lunar') ? (
                    <Hotel className="h-6 w-6 text-purple-500 mr-2" />
                  ) : (
                    <Planet className="h-6 w-6 text-purple-500 mr-2" />
                  )}
                  <h3 className="text-xl font-semibold">{trip.title}</h3>
                </div>
                <p className="text-gray-400 mb-4">{trip.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-400">{trip.duration}</span>
                  <span className="font-bold text-white">
                    ${(trip.price / 100).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleBookNow(trip)}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedTrip && (
        <BookingModal
          trip={selectedTrip}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default FeaturedTrips;