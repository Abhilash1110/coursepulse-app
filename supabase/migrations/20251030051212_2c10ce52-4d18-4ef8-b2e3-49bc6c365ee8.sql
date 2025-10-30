-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  roll_number TEXT,
  department TEXT NOT NULL,
  subject TEXT NOT NULL,
  faculty_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback (for student submissions)
CREATE POLICY "Anyone can submit feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read feedback (for dashboard viewing)
CREATE POLICY "Anyone can view feedback" 
ON public.feedback 
FOR SELECT 
USING (true);

-- Create index for common queries
CREATE INDEX idx_feedback_subject ON public.feedback(subject);
CREATE INDEX idx_feedback_faculty ON public.feedback(faculty_name);
CREATE INDEX idx_feedback_department ON public.feedback(department);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at DESC);