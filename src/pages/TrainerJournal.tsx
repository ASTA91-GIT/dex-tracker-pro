import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const TrainerJournal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonId, setPokemonId] = useState("");
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchEntries();
  }, [user, navigate]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('trainer_journal')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error("Failed to load journal entries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pokemonName || !pokemonId || !note) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('trainer_journal')
          .update({
            pokemon_name: pokemonName,
            pokemon_id: parseInt(pokemonId),
            note: note,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success("Entry updated!");
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('trainer_journal')
          .insert([{
            user_id: user!.id,
            pokemon_name: pokemonName,
            pokemon_id: parseInt(pokemonId),
            note: note,
          }]);

        if (error) throw error;
        toast.success("Entry added to journal!");
      }

      setPokemonName("");
      setPokemonId("");
      setNote("");
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error("Failed to save entry");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trainer_journal')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Entry deleted");
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error("Failed to delete entry");
    }
  };

  const handleEdit = (entry: any) => {
    setPokemonName(entry.pokemon_name);
    setPokemonId(entry.pokemon_id.toString());
    setNote(entry.note);
    setEditingId(entry.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-heading gradient-text">
                Trainer Journal
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Record your memories with each Pokémon
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Entry" : "New Entry"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pokemonName">Pokémon Name</Label>
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
                  <Label htmlFor="note">Your Memory</Label>
                  <Textarea
                    id="note"
                    placeholder="Write about your experience with this Pokémon..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {editingId ? "Update Entry" : "Add Entry"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setPokemonName("");
                        setPokemonId("");
                        setNote("");
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-heading">Your Entries</h2>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : entries.length === 0 ? (
              <Card className="border-2">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No entries yet. Start writing your journey!</p>
                </CardContent>
              </Card>
            ) : (
              entries.map((entry) => (
                <Card key={entry.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-heading">{entry.pokemon_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          #{entry.pokemon_id} • {new Date(entry.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">{entry.note}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerJournal;
