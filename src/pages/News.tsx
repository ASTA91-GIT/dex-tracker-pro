import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Newspaper, Gamepad2, Tv } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  category: 'game' | 'anime' | 'event' | 'update';
  date: string;
  content: string;
  image: string;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    title: 'Pokémon Scarlet and Violet DLC Announced',
    category: 'game',
    date: '2024-01-15',
    content: 'Nintendo announces new DLC expansion featuring new Pokémon, regions, and story content for Pokémon Scarlet and Violet.',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1008.png'
  },
  {
    id: 2,
    title: 'New Pokémon Anime Series Revealed',
    category: 'anime',
    date: '2024-01-10',
    content: 'A brand new Pokémon anime series focusing on the Paldea region has been officially announced with new characters and storylines.',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/906.png'
  },
  {
    id: 3,
    title: 'Pokémon GO Community Day Schedule',
    category: 'event',
    date: '2024-01-08',
    content: 'Check out the upcoming Community Day featuring Bulbasaur with exclusive moves and shiny encounters!',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
  },
  {
    id: 4,
    title: 'Pokémon TCG Pocket Launch',
    category: 'game',
    date: '2024-01-05',
    content: 'The new digital Pokémon Trading Card Game app is now available for iOS and Android devices worldwide.',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
  },
  {
    id: 5,
    title: 'Legendary Pokémon Distribution Event',
    category: 'event',
    date: '2024-01-01',
    content: 'Special distribution event for Shiny Rayquaza available for Pokémon Scarlet and Violet players.',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png'
  },
  {
    id: 6,
    title: 'Pokémon World Championships 2024',
    category: 'event',
    date: '2023-12-28',
    content: 'Registration opens for the 2024 Pokémon World Championships. Compete in VGC, TCG, and GO battles!',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png'
  }
];

const categoryIcons = {
  game: Gamepad2,
  anime: Tv,
  event: Calendar,
  update: Newspaper
};

const categoryColors = {
  game: 'bg-blue-500',
  anime: 'bg-purple-500',
  event: 'bg-green-500',
  update: 'bg-orange-500'
};

const News = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Pokémon News & Updates</h1>

        <div className="max-w-4xl mx-auto space-y-6">
          {newsData.map((news) => {
            const Icon = categoryIcons[news.category];
            return (
              <Card key={news.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full md:w-48 h-48 object-contain rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{news.title}</h2>
                        <div className="flex gap-2 items-center">
                          <Badge className={categoryColors[news.category]}>
                            <Icon className="w-3 h-3 mr-1" />
                            {news.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(news.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground">{news.content}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Stay Updated!</h2>
          <p className="text-muted-foreground">
            Check back regularly for the latest news on Pokémon games, anime series, special events, 
            and competitive tournaments. Never miss an update in the world of Pokémon!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default News;
