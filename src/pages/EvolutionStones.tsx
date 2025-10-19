import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gem, Zap, Droplet, Leaf, Moon, Sun, Snowflake, Moon as DarkIcon } from 'lucide-react';

interface EvolutionStone {
  name: string;
  icon: any;
  color: string;
  pokemon: string[];
  description: string;
}

const stones: EvolutionStone[] = [
  {
    name: 'Fire Stone',
    icon: Gem,
    color: 'text-orange-500',
    pokemon: ['Vulpix → Ninetales', 'Growlithe → Arcanine', 'Eevee → Flareon', 'Pansear → Simisear'],
    description: 'A peculiar stone that makes certain species of Pokémon evolve. It burns as red as the evening sun.'
  },
  {
    name: 'Water Stone',
    icon: Droplet,
    color: 'text-blue-500',
    pokemon: ['Poliwhirl → Poliwrath', 'Shellder → Cloyster', 'Staryu → Starmie', 'Eevee → Vaporeon', 'Lombre → Ludicolo'],
    description: 'A peculiar stone that makes certain species of Pokémon evolve. It is as blue as the sea.'
  },
  {
    name: 'Thunder Stone',
    icon: Zap,
    color: 'text-yellow-500',
    pokemon: ['Pikachu → Raichu', 'Eevee → Jolteon', 'Eelektrik → Eelektross'],
    description: 'A peculiar stone that makes certain species of Pokémon evolve. It has a thunderbolt pattern.'
  },
  {
    name: 'Leaf Stone',
    icon: Leaf,
    color: 'text-green-500',
    pokemon: ['Gloom → Vileplume', 'Weepinbell → Victreebel', 'Exeggcute → Exeggutor', 'Nuzleaf → Shiftry', 'Pansage → Simisage'],
    description: 'A peculiar stone that makes certain species of Pokémon evolve. It has a leaf pattern.'
  },
  {
    name: 'Moon Stone',
    icon: Moon,
    color: 'text-purple-500',
    pokemon: ['Nidorina → Nidoqueen', 'Nidorino → Nidoking', 'Clefairy → Clefable', 'Jigglypuff → Wigglytuff', 'Munna → Musharna'],
    description: 'A peculiar stone that makes certain species of Pokémon evolve. It is as black as the night sky.'
  },
  {
    name: 'Sun Stone',
    icon: Sun,
    color: 'text-yellow-400',
    pokemon: ['Gloom → Bellossom', 'Sunkern → Sunflora', 'Cottonee → Whimsicott', 'Petilil → Lilligant', 'Helioptile → Heliolisk'],
    description: 'A peculiar stone that makes certain species of Pokémon evolve. It burns as red as the morning sun.'
  },
  {
    name: 'Shiny Stone',
    icon: Gem,
    color: 'text-pink-400',
    pokemon: ['Togetic → Togekiss', 'Roselia → Roserade', 'Minccino → Cinccino', 'Floette → Florges'],
    description: 'A peculiar stone that makes certain species of Pokémon evolve. It shines with a dazzling light.'
  },
  {
    name: 'Dusk Stone',
    icon: DarkIcon,
    color: 'text-gray-700',
    pokemon: ['Murkrow → Honchkrow', 'Misdreavus → Mismagius', 'Lampent → Chandelure', 'Doublade → Aegislash'],
    description: 'A peculiar stone that makes certain species of Pokémon evolve. It is as dark as dark can be.'
  },
  {
    name: 'Dawn Stone',
    icon: Gem,
    color: 'text-pink-300',
    pokemon: ['Kirlia (male) → Gallade', 'Snorunt (female) → Froslass'],
    description: 'A peculiar stone that makes certain species of Pokémon evolve. It sparkles like a glittering eye.'
  },
  {
    name: 'Ice Stone',
    icon: Snowflake,
    color: 'text-cyan-400',
    pokemon: ['Alolan Sandshrew → Alolan Sandslash', 'Alolan Vulpix → Alolan Ninetales', 'Eevee → Glaceon'],
    description: 'A peculiar stone that makes certain species of Pokémon evolve. It is said to have originated in the Alola region.'
  }
];

const EvolutionStones = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">Evolution Stones & Items</h1>
        <p className="text-center text-muted-foreground mb-8">
          Special items that trigger evolution in certain Pokémon species
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stones.map((stone) => (
            <Card key={stone.name} className="p-6 hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <stone.icon className={`w-12 h-12 ${stone.color}`} />
                <h2 className="text-2xl font-bold">{stone.name}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{stone.description}</p>
              <div>
                <p className="font-semibold mb-2">Evolves:</p>
                <div className="space-y-1">
                  {stone.pokemon.map((evolution, index) => (
                    <Badge key={index} variant="outline" className="block text-center">
                      {evolution}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Other Evolution Methods</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Trade Evolution</h3>
              <p className="text-sm text-muted-foreground">
                Some Pokémon like Machoke, Graveler, Haunter, and Kadabra evolve when traded with another player.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Friendship Evolution</h3>
              <p className="text-sm text-muted-foreground">
                Pokémon like Eevee (to Espeon/Umbreon), Golbat, and Chansey evolve through high friendship levels.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Level + Move</h3>
              <p className="text-sm text-muted-foreground">
                Some Pokémon like Mime Jr., Bonsly, and Aipom evolve when leveled up knowing a specific move.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Location-Based</h3>
              <p className="text-sm text-muted-foreground">
                Pokémon like Eevee (to Leafeon/Glaceon), Magneton, and Nosepass evolve in specific locations.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EvolutionStones;
