import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface Character {
  name: string;
  region: string;
  role: string;
  team: string[];
  series: string;
  image: string;
}

const characters: Character[] = [
  {
    name: 'Ash Ketchum',
    region: 'Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar',
    role: 'Protagonist',
    team: ['Pikachu', 'Charizard', 'Greninja', 'Lucario', 'Infernape', 'Sceptile'],
    series: 'Original Series - Journeys',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
  },
  {
    name: 'Misty',
    region: 'Kanto, Johto',
    role: 'Gym Leader',
    team: ['Psyduck', 'Staryu', 'Starmie', 'Gyarados', 'Corsola', 'Azurill'],
    series: 'Original Series',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png'
  },
  {
    name: 'Brock',
    region: 'Kanto, Johto, Hoenn, Sinnoh',
    role: 'Gym Leader / Pokémon Doctor',
    team: ['Onix', 'Geodude', 'Crobat', 'Marshtomp', 'Sudowoodo', 'Croagunk'],
    series: 'Original Series - Diamond & Pearl',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png'
  },
  {
    name: 'May',
    region: 'Hoenn, Kanto, Johto',
    role: 'Coordinator',
    team: ['Blaziken', 'Beautifly', 'Skitty', 'Munchlax', 'Venusaur', 'Glaceon'],
    series: 'Advanced Generation',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/257.png'
  },
  {
    name: 'Dawn',
    region: 'Sinnoh',
    role: 'Coordinator',
    team: ['Piplup', 'Buneary', 'Pachirisu', 'Mamoswine', 'Quilava', 'Togekiss'],
    series: 'Diamond & Pearl',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png'
  },
  {
    name: 'Serena',
    region: 'Kalos',
    role: 'Performer',
    team: ['Braixen', 'Pancham', 'Sylveon', 'Delphox'],
    series: 'XY',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/655.png'
  },
  {
    name: 'Clemont',
    region: 'Kalos',
    role: 'Gym Leader / Inventor',
    team: ['Dedenne', 'Bunnelby', 'Chespin', 'Luxray', 'Heliolisk'],
    series: 'XY',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/meta/sprites/pokemon/other/official-artwork/702.png'
  },
  {
    name: 'Iris',
    region: 'Unova',
    role: 'Dragon Master / Champion',
    team: ['Axew', 'Excadrill', 'Emolga', 'Dragonite', 'Haxorus'],
    series: 'Best Wishes',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/612.png'
  },
  {
    name: 'Cilan',
    region: 'Unova',
    role: 'Gym Leader / Connoisseur',
    team: ['Pansage', 'Crustle', 'Stunfisk', 'Simisage'],
    series: 'Best Wishes',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/511.png'
  },
  {
    name: 'Goh',
    region: 'Kanto, Various',
    role: 'Pokémon Researcher',
    team: ['Cinderace', 'Inteleon', 'Grookey', 'Suicune', 'Eternatus'],
    series: 'Journeys',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/815.png'
  },
  {
    name: 'Chloe',
    region: 'Kanto',
    role: 'Trainer',
    team: ['Eevee', 'Yamper'],
    series: 'Journeys',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png'
  },
  {
    name: 'Leon',
    region: 'Galar',
    role: 'Champion',
    team: ['Charizard', 'Dragapult', 'Rillaboom', 'Cinderace', 'Inteleon', 'Mr. Rime'],
    series: 'Journeys',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png'
  },
  {
    name: 'Cynthia',
    region: 'Sinnoh',
    role: 'Champion',
    team: ['Garchomp', 'Lucario', 'Spiritomb', 'Milotic', 'Togekiss', 'Roserade'],
    series: 'Diamond & Pearl, Journeys',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png'
  }
];

const Characters = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    char.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    char.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Anime Characters Database</h1>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, region, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => (
            <Card key={character.name} className="p-6 hover:scale-105 transition-transform">
              <div className="text-center mb-4">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-32 h-32 mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{character.name}</h2>
                <Badge className="mb-2">{character.role}</Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Region(s)</p>
                  <p className="text-sm">{character.region}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Series</p>
                  <p className="text-sm">{character.series}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Signature Team</p>
                  <div className="flex flex-wrap gap-1">
                    {character.team.map((pokemon) => (
                      <Badge key={pokemon} variant="outline" className="text-xs">
                        {pokemon}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No characters found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Characters;
