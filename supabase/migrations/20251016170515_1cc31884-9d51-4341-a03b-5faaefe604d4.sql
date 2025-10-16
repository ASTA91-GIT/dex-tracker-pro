-- Create teams table for team builder
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_name TEXT NOT NULL,
  pokemon_slots JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own teams"
ON public.teams FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own teams"
ON public.teams FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams"
ON public.teams FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teams"
ON public.teams FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create quiz scores table
CREATE TABLE public.quiz_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scores"
ON public.quiz_scores FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores"
ON public.quiz_scores FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view leaderboard"
ON public.quiz_scores FOR SELECT
USING (true);

-- Create daily challenges table
CREATE TABLE public.daily_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_date DATE NOT NULL,
  challenge_type TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  reward_xp INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, challenge_date, challenge_type)
);

ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own challenges"
ON public.daily_challenges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges"
ON public.daily_challenges FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges"
ON public.daily_challenges FOR UPDATE
USING (auth.uid() = user_id);

-- Create shiny pokemon tracker
CREATE TABLE public.shiny_pokemon (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pokemon_id INTEGER NOT NULL,
  pokemon_name TEXT NOT NULL,
  caught_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pokemon_id)
);

ALTER TABLE public.shiny_pokemon ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shiny pokemon"
ON public.shiny_pokemon FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shiny pokemon"
ON public.shiny_pokemon FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shiny pokemon"
ON public.shiny_pokemon FOR DELETE
USING (auth.uid() = user_id);

-- Create legendary pokemon tracker
CREATE TABLE public.legendary_pokemon (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pokemon_id INTEGER NOT NULL,
  pokemon_name TEXT NOT NULL,
  caught_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pokemon_id)
);

ALTER TABLE public.legendary_pokemon ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own legendary pokemon"
ON public.legendary_pokemon FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own legendary pokemon"
ON public.legendary_pokemon FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own legendary pokemon"
ON public.legendary_pokemon FOR DELETE
USING (auth.uid() = user_id);