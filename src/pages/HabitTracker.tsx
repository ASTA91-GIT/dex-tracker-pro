import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target, Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const HabitTracker = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonId, setPokemonId] = useState("");
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchHabits();
  }, [user, navigate]);

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habit_tracker')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error("Failed to load habits");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pokemonName || !pokemonId || !habitName) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase
        .from('habit_tracker')
        .insert([{
          user_id: user!.id,
          pokemon_name: pokemonName,
          pokemon_id: parseInt(pokemonId),
          habit_name: habitName,
          description: description,
          completed_dates: []
        }]);

      if (error) throw error;

      toast.success("Habit added!");
      setPokemonName("");
      setPokemonId("");
      setHabitName("");
      setDescription("");
      fetchHabits();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error("Failed to create habit");
    }
  };

  const handleComplete = async (habitId: string, completedDates: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    
    const isCompletedToday = completedDates.includes(today);
    const newDates = isCompletedToday
      ? completedDates.filter(d => d !== today)
      : [...completedDates, today];

    try {
      const { error } = await supabase
        .from('habit_tracker')
        .update({ completed_dates: newDates })
        .eq('id', habitId);

      if (error) throw error;

      toast.success(isCompletedToday ? "Unmarked for today!" : "Great job! Keep it up! 🎉");
      fetchHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error("Failed to update habit");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('habit_tracker')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Habit deleted");
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error("Failed to delete habit");
    }
  };

  const isCompletedToday = (dates: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    return dates.includes(today);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Target className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-heading gradient-text">
                Habit Tracker
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Build habits with your Pokémon companions
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Create New Habit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pokemonName">Companion Pokémon</Label>
                    <Input
                      id="pokemonName"
                      placeholder="e.g., Pikachu"
                      value={pokemonName}
                      onChange={(e) => setPokemonName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pokemonId">Pokémon ID</Label>
                    <Input
                      id="pokemonId"
                      type="number"
                      placeholder="e.g., 25"
                      value={pokemonId}
                      onChange={(e) => setPokemonId(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="habitName">Habit Name *</Label>
                  <Input
                    id="habitName"
                    placeholder="e.g., Morning Run"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your habit goal..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Habit
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-heading">Your Habits</h2>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : habits.length === 0 ? (
              <Card className="border-2">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No habits yet. Create one to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {habits.map((habit) => (
                  <Card 
                    key={habit.id} 
                    className={`border-2 transition-all ${
                      isCompletedToday(habit.completed_dates) 
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-heading">{habit.habit_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            with {habit.pokemon_name} #{habit.pokemon_id}
                          </p>
                          {habit.description && (
                            <p className="text-sm text-muted-foreground mt-2">{habit.description}</p>
                          )}
                          <p className="text-sm text-primary mt-2">
                            Streak: {habit.completed_dates.length} days
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(habit.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <Button
                        onClick={() => handleComplete(habit.id, habit.completed_dates)}
                        className={`w-full ${
                          isCompletedToday(habit.completed_dates) 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : ''
                        }`}
                      >
                        {isCompletedToday(habit.completed_dates) ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Completed Today!
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Mark as Complete
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
