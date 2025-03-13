import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Journey to the
          <span className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Stars Begins Here
          </span>
        </motion.h1>

        <motion.p 
          className="mt-6 text-xl md:text-2xl text-gray-300 max-w-2xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Experience luxury space travel from Dubai to orbital stations, lunar hotels, and beyond.
        </motion.p>

        <motion.button 
          className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full text-lg font-semibold transition-colors"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Book Your Space Adventure
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;