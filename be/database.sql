CREATE TABLE IF NOT EXISTS booking_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  pickup_time TIMESTAMPTZ NOT NULL,
  direction TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  bed_type TEXT NOT NULL,
  bed_quantity INTEGER NOT NULL,
  passenger_count INTEGER NOT NULL,
  preferred_floor TEXT NOT NULL DEFAULT 'no_preference',
  preferred_position TEXT NOT NULL DEFAULT 'no_preference',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
