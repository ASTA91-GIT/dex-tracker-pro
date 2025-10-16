import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Swords, RefreshCw } from 'lucide-react';

interface BattlePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  currentHp: number;
}

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400', fighting: 'bg-red-600', flying: 'bg-blue-400',
  poison: 'bg-purple-500', ground: 'bg-yellow-600', rock: 'bg-yellow-800',
  bug: 'bg-green-500', ghost: 'bg-purple-700', steel: 'bg-gray-500',
  fire: 'bg-orange-500', water: 'bg-blue-500', grass: 'bg-green-600',
  electric: 'bg-yellow-400', psychic: 'bg-pink-500', ice: 'bg-cyan-400',
  dragon: 'bg-indigo-600', dark: 'bg-gray-800', fairy: 'bg-pink-300'
};

const BattleSimulator = () => {
  const [pokemon1, setPokemon1] = useState<BattlePokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<BattlePokemon | null>(null);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [battling, setBattling] = useState(false);
  const [winner, setWinner] = useState<BattlePokemon | null>(null);

  const loadPokemon = async (searchTerm: string, slot: 1 | 2) => {
    if (!searchTerm.trim()) return;
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      if (!response.ok) throw new Error('Pokémon not found');
      
      const data = await response.json();
      const pokemon: BattlePokemon = {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          speed: data.stats[5].base_stat
        },
        currentHp: data.stats[0].base_stat
      };
      
      if (slot === 1) {
        setPokemon1(pokemon);
        setSearchTerm1('');
      } else {
        setPokemon2(pokemon);
        setSearchTerm2('');
      }
      
      toast.success(`${data.name} loaded!`);
    } catch (error) {
      toast.error('Pokémon not found!');
    }
  };

  const calculateDamage = (attacker: BattlePokemon, defender: BattlePokemon): number => {
    const baseDamage = Math.floor((attacker.stats.attack / defender.stats.defense) * 20);
    const randomFactor = Math.random() * 0.3 + 0.85;
    return Math.floor(baseDamage * randomFactor);
  };

  const simulateBattle = () => {
    if (!pokemon1 || !pokemon2) {
      toast.error('Load both Pokémon first!');
      return;
    }

    setBattling(true);
    setBattleLog([]);
    setWinner(null);

    const p1 = { ...pokemon1, currentHp: pokemon1.stats.hp };
    const p2 = { ...pokemon2, currentHp: pokemon2.stats.hp };
    const log: string[] = [`Battle Start! ${p1.name.toUpperCase()} vs ${p2.name.toUpperCase()}`];

    let turn = p1.stats.speed >= p2.stats.speed ? 1 : 2;
    let round = 1;

    const battleInterval = setInterval(() => {
      if (p1.currentHp <= 0 || p2.currentHp <= 0) {
        clearInterval(battleInterval);
        const battleWinner = p1.currentHp > 0 ? p1 : p2;
        log.push(`${battleWinner.name.toUpperCase()} wins the battle!`);
        setBattleLog([...log]);
        setWinner(battleWinner);
        setPokemon1(p1);
        setPokemon2(p2);
        setBattling(false);
        return;
      }

      if (turn === 1) {
        const damage = calculateDamage(p1, p2);
        p2.currentHp = Math.max(0, p2.currentHp - damage);
        log.push(`Round ${round}: ${p1.name.toUpperCase()} attacks ${p2.name.toUpperCase()} for ${damage} damage!`);
        turn = 2;
      } else {
        const damage = calculateDamage(p2, p1);
        p1.currentHp = Math.max(0, p1.currentHp - damage);
        log.push(`Round ${round}: ${p2.name.toUpperCase()} attacks ${p1.name.toUpperCase()} for ${damage} damage!`);
        turn = 1;
        round++;
      }

      setBattleLog([...log]);
      setPokemon1({ ...p1 });
      setPokemon2({ ...p2 });
    }, 1000);
  };

  const resetBattle = () => {
    if (pokemon1) setPokemon1({ ...pokemon1, currentHp: pokemon1.stats.hp });
    if (pokemon2) setPokemon2({ ...pokemon2, currentHp: pokemon2.stats.hp });
    setBattleLog([]);
    setWinner(null);
    setBattling(false);
  };

  const renderPokemonCard = (pokemon: BattlePokemon | null, slot: 1 | 2) => (
    <Card className="p-6">
      {pokemon ? (
        <div>
          <img src={pokemon.image} alt={pokemon.name} className="w-48 h-48 mx-auto" />
          <h3 className="text-2xl font-bold text-center capitalize mb-2">{pokemon.name}</h3>
          <div className="flex gap-2 justify-center mb-4">
            {pokemon.types.map(type => (
              <Badge key={type} className={typeColors[type]}>{type}</Badge>
            ))}
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>HP</span>
                <span>{pokemon.currentHp}/{pokemon.stats.hp}</span>
              </div>
              <Progress value={(pokemon.currentHp / pokemon.stats.hp) * 100} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">ATK</p>
                <p className="font-bold">{pokemon.stats.attack}</p>
              </div>
              <div>
                <p className="text-muted-foreground">DEF</p>
                <p className="font-bold">{pokemon.stats.defense}</p>
              </div>
              <div>
                <p className="text-muted-foreground">SPD</p>
                <p className="font-bold">{pokemon.stats.speed}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Load a Pokémon</p>
          <div className="flex gap-2">
            <Input
              placeholder="Name or ID..."
              value={slot === 1 ? searchTerm1 : searchTerm2}
              onChange={(e) => slot === 1 ? setSearchTerm1(e.target.value) : setSearchTerm2(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadPokemon(slot === 1 ? searchTerm1 : searchTerm2, slot)}
            />
            <Button onClick={() => loadPokemon(slot === 1 ? searchTerm1 : searchTerm2, slot)}>
              Load
            </Button>
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Battle Simulator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {renderPokemonCard(pokemon1, 1)}
          {renderPokemonCard(pokemon2, 2)}
        </div>

        <div className="text-center mb-8">
          <Button 
            size="lg" 
            onClick={simulateBattle} 
            disabled={!pokemon1 || !pokemon2 || battling}
            className="mr-4"
          >
            <Swords className="w-5 h-5 mr-2" />
            Start Battle!
          </Button>
          <Button size="lg" variant="outline" onClick={resetBattle}>
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        {winner && (
          <Card className="p-6 mb-8 text-center bg-primary/10">
            <h2 className="text-3xl font-bold mb-2">🏆 {winner.name.toUpperCase()} WINS! 🏆</h2>
          </Card>
        )}

        {battleLog.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Battle Log</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {battleLog.map((log, index) => (
                <p key={index} className="text-sm">{log}</p>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BattleSimulator;
