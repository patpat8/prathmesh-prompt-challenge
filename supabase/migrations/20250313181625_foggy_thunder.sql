/*
  # Space Travel Booking System Schema

  1. New Tables
    - `trips`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `duration` (text)
      - `price` (integer, in cents)
      - `image_url` (text)
      - `available_seats` (integer)
      - `departure_dates` (array of timestamps)
      - `created_at` (timestamp)
      
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `trip_id` (uuid, references trips)
      - `departure_date` (timestamp)
      - `status` (enum: pending, confirmed, cancelled)
      - `stripe_payment_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create trip status enum
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Create trips table
CREATE TABLE trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  duration text NOT NULL,
  price integer NOT NULL,
  image_url text NOT NULL,
  available_seats integer NOT NULL,
  departure_dates timestamptz[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  trip_id uuid REFERENCES trips NOT NULL,
  departure_date timestamptz NOT NULL,
  status booking_status DEFAULT 'pending',
  stripe_payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Trips policies
CREATE POLICY "Trips are viewable by everyone"
  ON trips FOR SELECT
  TO public
  USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample trip data
INSERT INTO trips (title, description, duration, price, image_url, available_seats, departure_dates)
VALUES
  (
    'Orbital Space Station Orion',
    'Experience zero gravity in our state-of-the-art space station',
    '3 Days',
    7500000,
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    20,
    ARRAY['2025-06-15 10:00:00+00'::timestamptz, '2025-07-15 10:00:00+00'::timestamptz]
  ),
  (
    'Lunar Hotel Artemis',
    'Luxury accommodation with Earth-rise views',
    '7 Days',
    25000000,
    'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    10,
    ARRAY['2025-08-01 10:00:00+00'::timestamptz, '2025-09-01 10:00:00+00'::timestamptz]
  );