import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Crown, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CollectionPokemon {
  pokemon_id: number;
  pokemon_name: string;
  caught_at?: string;
  added_at?: string;
}

const Collection = () => {
  const navigate = useNavigate();
  const [caught, setCaught] = useState<CollectionPokemon[]>([]);
  const [shiny, setShiny] = useState<CollectionPokemon[]>([]);
  const [legendary, setLegendary] = useState<CollectionPokemon[]>([]);
  const [favorites, setFavorites] = useState<CollectionPokemon[]>([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const [caughtData, shinyData, legendaryData, favData] = await Promise.all([
      supabase.from('caught_pokemon').select('*').eq('user_id', user.id),
      supabase.from('shiny_pokemon').select('*').eq('user_id', user.id),
      supabase.from('legendary_pokemon').select('*').eq('user_id', user.id),
      supabase.from('favorites').select('*').eq('user_id', user.id)
    ]);

    setCaught(caughtData.data || []);
    setShiny(shinyData.data || []);
    setLegendary(legendaryData.data || []);
    setFavorites(favData.data || []);
  };

  const renderPokemonList = (list: CollectionPokemon[], emptyMessage: string) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {list.length > 0 ? (
        list.map((poke) => (
          <Card
            key={poke.pokemon_id}
            className="p-4 text-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate(`/pokemon/${poke.pokemon_id}`)}
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.pokemon_id}.png`}
              alt={poke.pokemon_name}
              className="w-full h-32 object-contain"
            />
            <p className="font-semibold capitalize mt-2">{poke.pokemon_name}</p>
            <p className="text-xs text-muted-foreground">
              #{poke.pokemon_id.toString().padStart(3, '0')}
            </p>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">My Collection</h1>

        <Tabs defaultValue="caught" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="caught">
              <Star className="w-4 h-4 mr-2" />
              Caught ({caught.length})
            </TabsTrigger>
            <TabsTrigger value="shiny">
              <Sparkles className="w-4 h-4 mr-2" />
              Shiny ({shiny.length})
            </TabsTrigger>
            <TabsTrigger value="legendary">
              <Crown className="w-4 h-4 mr-2" />
              Legendary ({legendary.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="w-4 h-4 mr-2" />
              Favorites ({favorites.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="caught" className="mt-6">
            {renderPokemonList(caught, 'No Pokémon caught yet. Start your journey!')}
          </TabsContent>

          <TabsContent value="shiny" className="mt-6">
            {renderPokemonList(shiny, 'No shiny Pokémon found yet. Keep searching!')}
          </TabsContent>

          <TabsContent value="legendary" className="mt-6">
            {renderPokemonList(legendary, 'No legendary Pokémon caught yet. Seek them out!')}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {renderPokemonList(favorites, 'No favorites added yet. Add some favorites!')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Collection;
