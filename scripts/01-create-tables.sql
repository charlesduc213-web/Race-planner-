-- RACE PLANNER Database Schema
-- Tables for users, clubs, races, and race participants

-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  club_id UUID REFERENCES clubs(id),
  strava_connected BOOLEAN DEFAULT false,
  strava_athlete_id VARCHAR(50),
  theme_preference VARCHAR(10) DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark')),
  language_preference VARCHAR(5) DEFAULT 'fr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Races table
CREATE TABLE IF NOT EXISTS races (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location VARCHAR(200),
  distance_km DECIMAL(6,2),
  elevation_gain_m INTEGER,
  race_type VARCHAR(50) DEFAULT 'road' CHECK (race_type IN ('road', 'mountain', 'gravel', 'track', 'cyclocross')),
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  registration_url TEXT,
  private_notes TEXT, -- Only visible to race creator
  is_public BOOLEAN DEFAULT true, -- Visible to club members
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'registered', 'completed', 'cancelled')),
  result_time INTERVAL,
  result_position INTEGER,
  result_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Race participants (for club visibility)
CREATE TABLE IF NOT EXISTS race_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id UUID REFERENCES races(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'interested' CHECK (status IN ('interested', 'registered', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(race_id, user_id)
);

-- Add foreign key constraint for club_id in users table
ALTER TABLE users ADD CONSTRAINT fk_users_club FOREIGN KEY (club_id) REFERENCES clubs(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_races_user_id ON races(user_id);
CREATE INDEX IF NOT EXISTS idx_races_date ON races(date);
CREATE INDEX IF NOT EXISTS idx_races_club_visibility ON races(user_id, is_public);
CREATE INDEX IF NOT EXISTS idx_users_club_id ON users(club_id);
CREATE INDEX IF NOT EXISTS idx_race_participants_race_id ON race_participants(race_id);
