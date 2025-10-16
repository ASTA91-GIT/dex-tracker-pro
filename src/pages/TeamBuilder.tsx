import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Trash2, Plus, X } from 'lucide-react';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

interface Team {
  id?: string;
  team_name: string;
  pokemon_slots: Pokemon[];
}

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400', fighting: 'bg-red-600', flying: 'bg-blue-400',
  poison: 'bg-purple-500', ground: 'bg-yellow-600', rock: 'bg-yellow-800',
  bug: 'bg-green-500', ghost: 'bg-purple-700', steel: 'bg-gray-500',
  fire: 'bg-orange-500', water: 'bg-blue-500', grass: 'bg-green-600',
  electric: 'bg-yellow-400', psychic: 'bg-pink-500', ice: 'bg-cyan-400',
  dragon: 'bg-indigo-600', dark: 'bg-gray-800', fairy: 'bg-pink-300'
};

const TeamBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team>({ team_name: '', pokemon_slots: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserTeams();
  }, [user, navigate]);

  const fetchUserTeams = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', user.id);
    
    if (!error && data) {
      setTeams(data.map(t => ({ ...t, pokemon_slots: (t.pokemon_slots as any) as Pokemon[] })));
    }
  };

  const searchPokemon = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        const pokemon: Pokemon = {
          id: data.id,
          name: data.name,
          image: data.sprites.other['official-artwork'].front_default,
          types: data.types.map((t: any) => t.type.name)
        };
        setSearchResults([pokemon]);
      }
    } catch (error) {
      toast.error('Pokémon not found!');
    }
    setLoading(false);
  };

  const addToTeam = (pokemon: Pokemon) => {
    if (currentTeam.pokemon_slots.length >= 6) {
      toast.error('Team is full! Maximum 6 Pokémon per team.');
      return;
    }
    setCurrentTeam({
      ...currentTeam,
      pokemon_slots: [...currentTeam.pokemon_slots, pokemon]
    });
    toast.success(`${pokemon.name} added to team!`);
  };

  const removeFromTeam = (index: number) => {
    setCurrentTeam({
      ...currentTeam,
      pokemon_slots: currentTeam.pokemon_slots.filter((_, i) => i !== index)
    });
  };

  const saveTeam = async () => {
    if (!user || !currentTeam.team_name.trim()) {
      toast.error('Please name your team!');
      return;
    }
    if (currentTeam.pokemon_slots.length === 0) {
      toast.error('Add at least one Pokémon!');
      return;
    }

    const { error } = await supabase.from('teams').insert({
      user_id: user.id,
      team_name: currentTeam.team_name,
      pokemon_slots: currentTeam.pokemon_slots as any
    });

    if (!error) {
      toast.success('Team saved successfully!');
      fetchUserTeams();
      setCurrentTeam({ team_name: '', pokemon_slots: [] });
    } else {
      toast.error('Failed to save team');
    }
  };

  const deleteTeam = async (teamId: string) => {
    const { error } = await supabase.from('teams').delete().eq('id', teamId);
    if (!error) {
      toast.success('Team deleted!');
      fetchUserTeams();
    }
  };

  const loadTeam = (team: Team) => {
    setCurrentTeam(team);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Team Builder</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Team Builder */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Build Your Team</h2>
            <Input
              placeholder="Team Name"
              value={currentTeam.team_name}
              onChange={(e) => setCurrentTeam({ ...currentTeam, team_name: e.target.value })}
              className="mb-4"
            />
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="relative border-2 border-dashed rounded-lg p-4 min-h-[150px] flex items-center justify-center">
                  {currentTeam.pokemon_slots[index] ? (
                    <div className="text-center">
                      <img 
                        src={currentTeam.pokemon_slots[index].image} 
                        alt={currentTeam.pokemon_slots[index].name}
                        className="w-20 h-20 mx-auto"
                      />
                      <p className="font-bold capitalize mt-2">{currentTeam.pokemon_slots[index].name}</p>
                      <div className="flex gap-1 justify-center mt-1">
                        {currentTeam.pokemon_slots[index].types.map(type => (
                          <Badge key={type} className={typeColors[type]}>{type}</Badge>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeFromTeam(index)}
                        className="mt-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>

            <Button onClick={saveTeam} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Team
            </Button>
          </Card>

          {/* Pokémon Search */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Add Pokémon</h2>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search Pokémon by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchPokemon()}
              />
              <Button onClick={searchPokemon} disabled={loading}>
                Search
              </Button>
            </div>

            {searchResults.map(pokemon => (
              <Card key={pokemon.id} className="p-4 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={pokemon.image} alt={pokemon.name} className="w-16 h-16" />
                    <div>
                      <p className="font-bold capitalize">#{pokemon.id} {pokemon.name}</p>
                      <div className="flex gap-1">
                        {pokemon.types.map(type => (
                          <Badge key={type} className={typeColors[type]}>{type}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => addToTeam(pokemon)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </Card>
        </div>

        {/* Saved Teams */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Saved Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => (
              <Card key={team.id} className="p-4">
                <h3 className="font-bold text-xl mb-2">{team.team_name}</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {team.pokemon_slots.map((pokemon, idx) => (
                    <img key={idx} src={pokemon.image} alt={pokemon.name} className="w-full" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => loadTeam(team)} className="flex-1">Load</Button>
                  <Button size="sm" variant="destructive" onClick={() => team.id && deleteTeam(team.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;
