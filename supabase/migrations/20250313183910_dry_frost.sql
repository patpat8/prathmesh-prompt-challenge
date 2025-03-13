/*
  # Add initial trips data

  1. Data Changes
    - Add initial space travel packages to the trips table
    - Each trip includes:
      - Title
      - Description
      - Duration
      - Price (in cents)
      - Image URL
      - Available seats
      - Departure dates
  
  2. Notes
    - Prices are stored in cents (e.g., $10,000 = 1000000)
    - Multiple departure dates are stored as an array
    - Images are from Unsplash space photography collection
*/

-- Insert initial trips if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM trips LIMIT 1) THEN
    INSERT INTO trips (title, description, duration, price, image_url, available_seats, departure_dates) VALUES
    (
      'Orbital Experience',
      'Experience the breathtaking views of Earth from low Earth orbit. Perfect for first-time space travelers.',
      '3 Days',
      1000000,
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
      20,
      ARRAY['2025-06-15 10:00:00+00', '2025-07-20 10:00:00+00', '2025-08-25 10:00:00+00']::timestamptz[]
    ),
    (
      'Lunar Hotel Stay',
      'Spend a luxurious week at the first lunar hotel. Includes guided moonwalks and Earth-rise viewing.',
      '7 Days',
      5000000,
      'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
      10,
      ARRAY['2025-09-01 10:00:00+00', '2025-10-15 10:00:00+00', '2025-11-30 10:00:00+00']::timestamptz[]
    ),
    (
      'Mars Flyby Adventure',
      'Be among the first to see the Red Planet up close in this groundbreaking flyby mission.',
      '14 Days',
      10000000,
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
      5,
      ARRAY['2025-12-10 10:00:00+00', '2026-01-20 10:00:00+00', '2026-02-28 10:00:00+00']::timestamptz[]
    );
  END IF;
END $$;