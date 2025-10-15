import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Star, Target, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  sprites: {
    other: {
      "official-artwork": { front_default: string; front_shiny: string };
      home: { front_default: string; front_shiny: string };
    };
  };
  species: { url: string };
}

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [description, setDescription] = useState("");
  const [isShiny, setIsShiny] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCaught, setIsCaught] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWanted, setIsWanted] = useState(false);

  useEffect(() => {
    fetchPokemonDetails();
  }, [id]);

  useEffect(() => {
    if (user && pokemon) {
      checkUserActions();
    }
  }, [user, pokemon]);

  const fetchPokemonDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      setPokemon(data);

      // Fetch species data for description
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      const englishEntry = speciesData.flavor_text_entries.find(
        (entry: any) => entry.language.name === "en"
      );
      if (englishEntry) {
        setDescription(englishEntry.flavor_text.replace(/\f/g, " "));
      }
    } catch (error) {
      toast.error("Failed to load Pokémon details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserActions = async () => {
    if (!user || !pokemon) return;

    const { data: caught } = await supabase
      .from("caught_pokemon")
      .select("*")
      .eq("user_id", user.id)
      .eq("pokemon_id", pokemon.id)
      .maybeSingle();

    const { data: favorite } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .eq("pokemon_id", pokemon.id)
      .maybeSingle();

    const { data: wanted } = await supabase
      .from("wanted_pokemon")
      .select("*")
      .eq("user_id", user.id)
      .eq("pokemon_id", pokemon.id)
      .maybeSingle();

    setIsCaught(!!caught);
    setIsFavorite(!!favorite);
    setIsWanted(!!wanted);
  };

  const toggleCaught = async () => {
    if (!user || !pokemon) {
      toast.error("Please sign in to track Pokémon");
      return;
    }

    try {
      if (isCaught) {
        await supabase
          .from("caught_pokemon")
          .delete()
          .eq("user_id", user.id)
          .eq("pokemon_id", pokemon.id);
        toast.success("Pokémon released!");
      } else {
        await supabase.from("caught_pokemon").insert({
          user_id: user.id,
          pokemon_id: pokemon.id,
          pokemon_name: pokemon.name,
        });
        toast.success("Catch Successful! ⚡");
      }
      setIsCaught(!isCaught);
    } catch (error) {
      toast.error("Action failed");
      console.error(error);
    }
  };

  const toggleFavorite = async () => {
    if (!user || !pokemon) {
      toast.error("Please sign in to mark favorites");
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("pokemon_id", pokemon.id);
        toast.success("Removed from favorites");
      } else {
        await supabase.from("favorites").insert({
          user_id: user.id,
          pokemon_id: pokemon.id,
          pokemon_name: pokemon.name,
        });
        toast.success("Added to favorites! ❤️");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      toast.error("Action failed");
      console.error(error);
    }
  };

  const toggleWanted = async () => {
    if (!user || !pokemon) {
      toast.error("Please sign in to add to wanted list");
      return;
    }

    try {
      if (isWanted) {
        await supabase
          .from("wanted_pokemon")
          .delete()
          .eq("user_id", user.id)
          .eq("pokemon_id", pokemon.id);
        toast.success("Removed from wanted list");
      } else {
        await supabase.from("wanted_pokemon").insert({
          user_id: user.id,
          pokemon_id: pokemon.id,
          pokemon_name: pokemon.name,
        });
        toast.success("Added to wanted list! ⭐");
      }
      setIsWanted(!isWanted);
    } catch (error) {
      toast.error("Action failed");
      console.error(error);
    }
  };

  if (loading || !pokemon) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-16 flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading PokéStats...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = isShiny
    ? pokemon.sprites.other["official-artwork"].front_shiny ||
      pokemon.sprites.other.home.front_shiny
    : pokemon.sprites.other["official-artwork"].front_default ||
      pokemon.sprites.other.home.front_default;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/pokedex")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pokédex
        </Button>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Image Card */}
            <Card className="border-2 overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-4">
                  <Badge className="mb-2">
                    #{pokemon.id.toString().padStart(3, "0")}
                  </Badge>
                  <h1 className="text-4xl font-heading capitalize mb-4">
                    <span className="gradient-text">{pokemon.name}</span>
                  </h1>
                  <div className="flex gap-2 justify-center mb-4">
                    {pokemon.types.map((t) => (
                      <Badge
                        key={t.type.name}
                        className={`${
                          typeColors[t.type.name] || "bg-muted"
                        } text-white capitalize`}
                      >
                        {t.type.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl p-8 mb-4">
                  <img
                    src={currentImage}
                    alt={pokemon.name}
                    className="w-full h-64 object-contain"
                  />
                </div>

                <div className="flex gap-2 justify-center mb-4">
                  <Button
                    variant={isShiny ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsShiny(!isShiny)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isShiny ? "Shiny" : "Normal"}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={isCaught ? "default" : "outline"}
                    onClick={toggleCaught}
                    className="w-full"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    {isCaught ? "Caught" : "Catch"}
                  </Button>
                  <Button
                    variant={isFavorite ? "default" : "outline"}
                    onClick={toggleFavorite}
                    className="w-full"
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                    Fav
                  </Button>
                  <Button
                    variant={isWanted ? "default" : "outline"}
                    onClick={toggleWanted}
                    className="w-full"
                  >
                    <Star
                      className={`mr-2 h-4 w-4 ${isWanted ? "fill-current" : ""}`}
                    />
                    Want
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <div className="space-y-6">
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="font-heading text-xl mb-4">Overview</h2>
                  <p className="text-muted-foreground mb-4">{description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="text-lg font-bold">
                        {(pokemon.height / 10).toFixed(1)} m
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="text-lg font-bold">
                        {(pokemon.weight / 10).toFixed(1)} kg
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Abilities</p>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.abilities.map((a) => (
                        <Badge
                          key={a.ability.name}
                          variant={a.is_hidden ? "secondary" : "outline"}
                        >
                          {a.ability.name.replace("-", " ")}
                          {a.is_hidden && " (Hidden)"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="font-heading text-xl mb-4">Base Stats</h2>
                  <div className="space-y-3">
                    {pokemon.stats.map((stat) => {
                      const statName = stat.stat.name
                        .replace("special-attack", "Sp. Atk")
                        .replace("special-defense", "Sp. Def")
                        .replace("-", " ");
                      const percentage = (stat.base_stat / 255) * 100;

                      return (
                        <div key={stat.stat.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm capitalize">{statName}</span>
                            <span className="text-sm font-bold">
                              {stat.base_stat}
                            </span>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
