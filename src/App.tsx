import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedTrips from './components/FeaturedTrips';
import Testimonials from './components/Testimonials';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <FeaturedTrips />
      <Testimonials />
    </div>
  );
}

export default App;