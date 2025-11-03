-- Create trainer_journal table for personal notes
CREATE TABLE public.trainer_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pokemon_id INTEGER NOT NULL,
  pokemon_name TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trainer_journal ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own journal entries"
ON public.trainer_journal
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
ON public.trainer_journal
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
ON public.trainer_journal
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
ON public.trainer_journal
FOR DELETE
USING (auth.uid() = user_id);

-- Create habit_tracker table
CREATE TABLE public.habit_tracker (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pokemon_id INTEGER NOT NULL,
  pokemon_name TEXT NOT NULL,
  habit_name TEXT NOT NULL,
  description TEXT,
  completed_dates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.habit_tracker ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own habits"
ON public.habit_tracker
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits"
ON public.habit_tracker
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
ON public.habit_tracker
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
ON public.habit_tracker
FOR DELETE
USING (auth.uid() = user_id);

-- Create daily_mystery table for guess challenges
CREATE TABLE public.daily_mystery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  pokemon_id INTEGER NOT NULL,
  guessed BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_mystery ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own mystery progress"
ON public.daily_mystery
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mystery progress"
ON public.daily_mystery
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mystery progress"
ON public.daily_mystery
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_trainer_journal_updated_at
BEFORE UPDATE ON public.trainer_journal
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_habit_tracker_updated_at
BEFORE UPDATE ON public.habit_tracker
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();