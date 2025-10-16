import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { HelpCircle, RefreshCw, Trophy } from 'lucide-react';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  silhouette: string;
}

const GuessThePokemon = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadNewPokemon();
  }, [user, navigate]);

  const loadNewPokemon = async () => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      
      setPokemon({
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        silhouette: data.sprites.other['official-artwork'].front_default
      });
      
      const pokemonHints = [
        `Type: ${data.types[0].type.name}`,
        `Height: ${(data.height / 10).toFixed(1)}m`,
        `Weight: ${(data.weight / 10).toFixed(1)}kg`,
        `Generation: ${speciesData.generation.name.split('-')[1].toUpperCase()}`
      ];
      
      setHints(pokemonHints);
      setGuess('');
      setRevealed(false);
      setHintsUsed(0);
    } catch (error) {
      console.error('Failed to load Pokémon:', error);
      toast.error('Failed to load Pokémon');
    }
  };

  const checkGuess = () => {
    if (!pokemon || !guess.trim()) return;
    
    const isCorrect = guess.toLowerCase().trim() === pokemon.name.toLowerCase();
    
    if (isCorrect) {
      const points = Math.max(10 - (hintsUsed * 2), 2);
      setScore(score + points);
      setStreak(streak + 1);
      toast.success(`Correct! +${points} points`);
      setRevealed(true);
      setTimeout(loadNewPokemon, 2000);
    } else {
      toast.error('Wrong! Try again!');
      setStreak(0);
    }
  };

  const showHint = () => {
    if (hintsUsed < hints.length) {
      setHintsUsed(hintsUsed + 1);
      toast.info(hints[hintsUsed]);
    }
  };

  const skipPokemon = () => {
    setRevealed(true);
    setStreak(0);
    setTimeout(loadNewPokemon, 2000);
  };

  if (!pokemon) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Guess That Pokémon!</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-3xl font-bold">{score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold">🔥 {streak}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hints Used</p>
                <p className="text-xl">{hintsUsed}/{hints.length}</p>
              </div>
            </div>
          </Card>

          {/* Main Game */}
          <Card className="lg:col-span-2 p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={pokemon.image}
                  alt="Mystery Pokémon"
                  className={`w-64 h-64 mx-auto transition-all duration-300 ${
                    revealed ? 'filter-none' : 'brightness-0'
                  }`}
                />
              </div>
            </div>

            {revealed && (
              <h2 className="text-3xl font-bold text-center mb-4 capitalize">
                #{pokemon.id} {pokemon.name}
              </h2>
            )}

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Pokémon name..."
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkGuess()}
                  disabled={revealed}
                  className="text-lg"
                />
                <Button onClick={checkGuess} disabled={revealed || !guess.trim()}>
                  Guess
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={showHint} 
                  disabled={hintsUsed >= hints.length || revealed}
                  className="flex-1"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Hint ({hints.length - hintsUsed} left)
                </Button>
                <Button variant="outline" onClick={skipPokemon} disabled={revealed} className="flex-1">
                  Skip
                </Button>
                <Button variant="default" onClick={loadNewPokemon} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>

              {hintsUsed > 0 && (
                <Card className="p-4 bg-muted">
                  <h3 className="font-semibold mb-2">Hints:</h3>
                  <ul className="space-y-1">
                    {hints.slice(0, hintsUsed).map((hint, index) => (
                      <li key={index} className="text-sm">• {hint}</li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </Card>
        </div>

        {/* How to Play */}
        <Card className="p-6 mt-8 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-4">How to Play</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Identify the Pokémon from its silhouette</li>
            <li>• Use hints if you're stuck (each hint reduces your points)</li>
            <li>• Build up streaks for bragging rights!</li>
            <li>• Points: 10 (no hints), 8 (1 hint), 6 (2 hints), 4 (3 hints), 2 (4 hints)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default GuessThePokemon;
