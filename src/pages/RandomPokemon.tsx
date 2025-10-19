import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shuffle, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: { name: string; value: number }[];
  abilities: string[];
  generation: number;
}

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400', fighting: 'bg-red-600', flying: 'bg-blue-400',
  poison: 'bg-purple-500', ground: 'bg-yellow-600', rock: 'bg-yellow-800',
  bug: 'bg-green-500', ghost: 'bg-purple-700', steel: 'bg-gray-500',
  fire: 'bg-orange-500', water: 'bg-blue-500', grass: 'bg-green-600',
  electric: 'bg-yellow-400', psychic: 'bg-pink-500', ice: 'bg-cyan-400',
  dragon: 'bg-indigo-600', dark: 'bg-gray-800', fairy: 'bg-pink-300'
};

const RandomPokemon = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [pokemonOfDay, setPokemonOfDay] = useState<Pokemon | null>(null);

  const generateRandom = async () => {
    setLoading(true);
    try {
      const randomId = Math.floor(Math.random() * 898) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();

      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      const generation = parseInt(speciesData.generation.url.split('/').slice(-2, -1)[0]);

      const pokemonData: Pokemon = {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
        stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
        abilities: data.abilities.map((a: any) => a.ability.name),
        generation
      };

      setPokemon(pokemonData);
      toast.success(`Discovered ${pokemonData.name}!`);
    } catch (error) {
      toast.error('Failed to fetch random Pokémon');
    } finally {
      setLoading(false);
    }
  };

  const generatePokemonOfDay = async () => {
    const today = new Date().toDateString();
    const cached = localStorage.getItem('pokemonOfDay');
    
    if (cached) {
      const { date, pokemon: cachedPokemon } = JSON.parse(cached);
      if (date === today) {
        setPokemonOfDay(cachedPokemon);
        return;
      }
    }

    const seed = new Date().getDate() + new Date().getMonth() * 31;
    const pokemonId = (seed % 898) + 1;

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const data = await response.json();

      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      const generation = parseInt(speciesData.generation.url.split('/').slice(-2, -1)[0]);

      const pokemonData: Pokemon = {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
        stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
        abilities: data.abilities.map((a: any) => a.ability.name),
        generation
      };

      localStorage.setItem('pokemonOfDay', JSON.stringify({ date: today, pokemon: pokemonData }));
      setPokemonOfDay(pokemonData);
    } catch (error) {
      toast.error('Failed to fetch Pokémon of the Day');
    }
  };

  useState(() => {
    generatePokemonOfDay();
  });

  const renderPokemonCard = (poke: Pokemon | null, title: string, icon: any) => (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {poke ? (
        <div>
          <img src={poke.image} alt={poke.name} className="w-64 h-64 mx-auto" />
          <h3 className="text-3xl font-bold text-center capitalize mb-2">
            #{poke.id.toString().padStart(3, '0')} {poke.name}
          </h3>
          <div className="flex gap-2 justify-center mb-4">
            {poke.types.map(type => (
              <Badge key={type} className={typeColors[type]}>{type}</Badge>
            ))}
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Abilities:</p>
            <div className="flex flex-wrap gap-2">
              {poke.abilities.map(ability => (
                <Badge key={ability} variant="outline" className="capitalize">
                  {ability.replace('-', ' ')}
                </Badge>
              ))}
            </div>
            <p className="font-semibold mt-4">Base Stats:</p>
            {poke.stats.map(stat => (
              <div key={stat.name} className="flex justify-between text-sm">
                <span className="capitalize">{stat.name.replace('-', ' ')}</span>
                <span className="font-bold">{stat.value}</span>
              </div>
            ))}
            <p className="text-sm text-muted-foreground mt-4">Generation {poke.generation}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No Pokémon generated yet</p>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Random Pokémon Generator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderPokemonCard(pokemonOfDay, 'Pokémon of the Day', <Star className="w-6 h-6 text-yellow-500" />)}
          {renderPokemonCard(pokemon, 'Random Pokémon', <Shuffle className="w-6 h-6 text-blue-500" />)}
        </div>

        <div className="text-center mt-8">
          <Button size="lg" onClick={generateRandom} disabled={loading}>
            <Shuffle className="w-5 h-5 mr-2" />
            {loading ? 'Generating...' : 'Generate Random Pokémon'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RandomPokemon;
