import React from 'react';
import { RocketIcon, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-black/20 backdrop-blur-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <RocketIcon className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Dubai to the Stars
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#destinations" className="text-gray-300 hover:text-white transition-colors">
              Destinations
            </a>
            <a href="#packages" className="text-gray-300 hover:text-white transition-colors">
              Packages
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors">
              Book Now
            </button>
          </div>

          <div className="md:hidden">
            <Menu className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;