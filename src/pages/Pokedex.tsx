import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoiceSearch } from "@/components/VoiceSearch";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
  types: string[];
}

const typeColors: Record<string, string> = {
  fire: "bg-[hsl(var(--type-fire))]",
  water: "bg-[hsl(var(--type-water))]",
  grass: "bg-[hsl(var(--type-grass))]",
  electric: "bg-[hsl(var(--type-electric))]",
  psychic: "bg-[hsl(var(--type-psychic))]",
  normal: "bg-[hsl(var(--type-normal))]",
  fighting: "bg-[hsl(var(--type-fighting))]",
  flying: "bg-[hsl(var(--type-flying))]",
  poison: "bg-[hsl(var(--type-poison))]",
  ground: "bg-[hsl(var(--type-ground))]",
  rock: "bg-[hsl(var(--type-rock))]",
  bug: "bg-[hsl(var(--type-bug))]",
  ghost: "bg-[hsl(var(--type-ghost))]",
  steel: "bg-[hsl(var(--type-steel))]",
  dragon: "bg-[hsl(var(--type-dragon))]",
  dark: "bg-[hsl(var(--type-dark))]",
  fairy: "bg-[hsl(var(--type-fairy))]",
  ice: "bg-[hsl(var(--type-ice))]",
};

const Pokedex = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    const filtered = pokemon.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [searchTerm, pokemon]);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      // Fetch all Pokemon (1-1025 for now)
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
      const data = await response.json();

      // Fetch details for each Pokemon
      const pokemonDetails = await Promise.all(
        data.results.map(async (p: { name: string; url: string }) => {
          const details = await fetch(p.url);
          const detailsData = await details.json();
          return {
            name: p.name,
            url: p.url,
            id: detailsData.id,
            image: detailsData.sprites.other["official-artwork"].front_default ||
                   detailsData.sprites.front_default,
            types: detailsData.types.map((t: any) => t.type.name),
          };
        })
      );

      setPokemon(pokemonDetails);
      setFilteredPokemon(pokemonDetails);
    } catch (error) {
      toast({
        title: "Error loading Pokémon",
        description: "Failed to fetch Pokémon data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading mb-4">
              <span className="gradient-text">Pokédex</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore all {pokemon.length} Pokémon!
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-2 max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-full border-2"
              />
            </div>
            <VoiceSearch onSearch={setSearchTerm} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}

          {/* Pokemon Grid */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredPokemon.map((p) => (
                <Card
                  key={p.id}
                  onClick={() => navigate(`/pokemon/${p.id}`)}
                  className="hover-float cursor-pointer border-2 border-border hover:border-primary transition-all bg-card overflow-hidden group"
                >
                  <CardContent className="p-4">
                    <div className="relative">
                      <div className="absolute top-2 right-2 bg-muted/90 rounded-full px-2 py-1">
                        <span className="text-xs font-bold">#{p.id.toString().padStart(3, "0")}</span>
                      </div>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-32 md:h-40 object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h3 className="font-heading text-sm md:text-base mt-2 capitalize text-center">
                      {p.name}
                    </h3>
                    <div className="flex gap-1 justify-center mt-2 flex-wrap">
                      {p.types.map((type) => (
                        <Badge
                          key={type}
                          className={`${
                            typeColors[type] || "bg-muted"
                          } text-white text-xs capitalize`}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredPokemon.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No Pokémon found. Try a different search!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
