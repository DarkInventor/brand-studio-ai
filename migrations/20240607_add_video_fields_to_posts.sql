-- Add type, video_url, video_duration, aspect_ratio, and quality fields to posts
ALTER TABLE posts
ADD COLUMN type TEXT DEFAULT 'image',
ADD COLUMN video_url TEXT,
ADD COLUMN video_duration INTEGER,
ADD COLUMN aspect_ratio TEXT,
ADD COLUMN quality TEXT;

-- Optionally, backfill type for existing rows
UPDATE posts SET type = 'image' WHERE type IS NULL; 