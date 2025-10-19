import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PokemonLore = () => {
  const legendaryLore = [
    {
      name: 'Arceus',
      title: 'The Original One',
      type: 'Normal',
      lore: 'According to legend, Arceus emerged from an egg in a place where there was nothing, then shaped the world and created the Pokémon universe. It is said to have created Dialga, Palkia, and Giratina, as well as the lake guardians Uxie, Mesprit, and Azelf.'
    },
    {
      name: 'Dialga',
      title: 'The Temporal Pokémon',
      type: 'Steel/Dragon',
      lore: 'Dialga has the power to control time. It is rumored that time began moving when Dialga was born. In ancient Sinnoh lore, Dialga is said to have been born from the chest of Arceus.'
    },
    {
      name: 'Palkia',
      title: 'The Spatial Pokémon',
      type: 'Water/Dragon',
      lore: 'Palkia has the ability to distort space. It is described as a deity in Sinnoh mythology and is said to live in a gap in the spatial dimension parallel to ours.'
    },
    {
      name: 'Giratina',
      title: 'The Renegade Pokémon',
      type: 'Ghost/Dragon',
      lore: 'Giratina was banished to the Distortion World for its violence. It silently gazed upon the old world from the Distortion World. It is said to appear in old cemeteries.'
    },
    {
      name: 'Rayquaza',
      title: 'The Sky High Pokémon',
      type: 'Dragon/Flying',
      lore: 'Rayquaza is said to have lived for hundreds of millions of years in the ozone layer. It descends to the ground only when Kyogre and Groudon engage in battle, stopping them with its overwhelming power.'
    },
    {
      name: 'Kyogre',
      title: 'The Sea Basin Pokémon',
      type: 'Water',
      lore: 'Ancient mythology says Kyogre expanded the seas by covering the land with torrential rains and towering tidal waves. It took to sleep after a cataclysmic battle with Groudon.'
    },
    {
      name: 'Groudon',
      title: 'The Continent Pokémon',
      type: 'Ground',
      lore: 'Groudon is said to be the personification of the land itself. Legends tell of its many clashes against Kyogre, as each sought to gain the power of nature. It slumbered for ages after causing volcanic eruptions.'
    },
    {
      name: 'Mewtwo',
      title: 'The Genetic Pokémon',
      type: 'Psychic',
      lore: 'Mewtwo was created by a scientist after years of horrific gene splicing and DNA engineering experiments based on Mew. It is said to have the most savage heart among all Pokémon.'
    }
  ];

  const regions = [
    {
      name: 'Kanto',
      description: 'The region where it all began. Home to the Indigo League and the first 151 Pokémon. Notable locations include Pallet Town, Viridian Forest, Mt. Moon, and the Safari Zone.'
    },
    {
      name: 'Johto',
      description: 'Known for its traditional architecture and diverse ecosystems. Features the Burnt Tower, Tin Tower, and introduces Dark and Steel types. Connected to Kanto via Victory Road.'
    },
    {
      name: 'Hoenn',
      description: 'A tropical region with extensive water routes. Home to ancient Pokémon legends involving Groudon, Kyogre, and Rayquaza. Features the Battle Frontier.'
    },
    {
      name: 'Sinnoh',
      description: 'A region steeped in mythology about the creation of the Pokémon universe. Features Mt. Coronet at its center and is home to many legendary Pokémon including Arceus.'
    },
    {
      name: 'Unova',
      description: 'Based on New York City, featuring a modern metropolitan setting. First region without any previous generation Pokémon in its initial Pokédex.'
    },
    {
      name: 'Kalos',
      description: 'A region inspired by France, introducing Fairy-type Pokémon and Mega Evolution. Features the legendary Xerneas and Yveltal.'
    },
    {
      name: 'Alola',
      description: 'A tropical archipelago with four main islands. Features regional variants, Z-Moves, and Ultra Beasts from Ultra Space.'
    },
    {
      name: 'Galar',
      description: 'Inspired by Great Britain, featuring the Dynamax phenomenon. Home to the Darkest Day legend and Eternatus.'
    }
  ];

  const historicalEvents = [
    {
      title: 'The Darkest Day',
      region: 'Galar',
      description: 'A catastrophic event 3,000 years ago when Eternatus brought darkness to Galar. The heroes used Zacian and Zamazenta to seal away the threat.'
    },
    {
      title: 'The Ultimate Weapon',
      region: 'Kalos',
      description: 'Built 3,000 years ago by AZ to end a war. Powered by Pokémon life force, it granted immortality to AZ and his Floette but at a terrible cost.'
    },
    {
      title: 'The Burning of the Brass Tower',
      region: 'Johto',
      description: 'A tower in Ecruteak City struck by lightning 150 years ago. Three Pokémon perished but were revived by Ho-Oh, becoming the legendary beasts.'
    },
    {
      title: 'The Draconid People',
      region: 'Hoenn',
      description: 'Ancient people who called upon Rayquaza to stop the primal battle between Kyogre and Groudon, saving the region from destruction.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Pokémon Lore & Mythology</h1>

        <Tabs defaultValue="legendary" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="legendary">Legendary Pokémon</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="events">Historical Events</TabsTrigger>
          </TabsList>

          <TabsContent value="legendary" className="mt-6">
            <div className="grid gap-6">
              {legendaryLore.map((pokemon) => (
                <Card key={pokemon.name} className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={`https://img.pokemondb.net/artwork/large/${pokemon.name.toLowerCase()}.jpg`}
                      alt={pokemon.name}
                      className="w-32 h-32 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{pokemon.name}</h2>
                      <p className="text-muted-foreground italic mb-2">{pokemon.title}</p>
                      <Badge className="mb-3">{pokemon.type}</Badge>
                      <p className="text-sm leading-relaxed">{pokemon.lore}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="regions" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {regions.map((region) => (
                <Card key={region.name} className="p-6">
                  <h2 className="text-2xl font-bold mb-3">{region.name}</h2>
                  <p className="text-sm leading-relaxed">{region.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="grid gap-6">
              {historicalEvents.map((event) => (
                <Card key={event.title} className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{event.title}</h2>
                    <Badge variant="outline">{event.region}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed">{event.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PokemonLore;
