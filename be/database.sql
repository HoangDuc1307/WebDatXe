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

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_user_id BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_sessions_user_id_idx ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS blocked_dates (
  blocked_date DATE PRIMARY KEY,
  reason TEXT NOT NULL DEFAULT '',
  created_by BIGINT NOT NULL REFERENCES admin_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT blocked_dates_reason_length CHECK (char_length(reason) <= 200)
);
