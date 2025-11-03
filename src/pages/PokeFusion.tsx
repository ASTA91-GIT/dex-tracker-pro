import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const PokeFusion = () => {
  const [pokemon1Name, setPokemon1Name] = useState("");
  const [pokemon2Name, setPokemon2Name] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [fusion, setFusion] = useState<any>(null);

  const generateFusion = async () => {
    if (!pokemon1Name || !pokemon2Name) {
      toast.error("Please enter both Pokémon names");
      return;
    }

    setIsGenerating(true);
    setFusion(null);

    try {
      // Fetch Pokemon data from PokeAPI
      const [poke1Response, poke2Response] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon1Name.toLowerCase()}`),
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon2Name.toLowerCase()}`)
      ]);

      if (!poke1Response.ok || !poke2Response.ok) {
        throw new Error("One or both Pokémon not found");
      }

      const [poke1Data, poke2Data] = await Promise.all([
        poke1Response.json(),
        poke2Response.json()
      ]);

      const pokemon1 = {
        name: poke1Data.name,
        stats: {
          hp: poke1Data.stats[0].base_stat,
          attack: poke1Data.stats[1].base_stat,
          defense: poke1Data.stats[2].base_stat,
          specialAttack: poke1Data.stats[3].base_stat,
          specialDefense: poke1Data.stats[4].base_stat,
          speed: poke1Data.stats[5].base_stat,
        }
      };

      const pokemon2 = {
        name: poke2Data.name,
        stats: {
          hp: poke2Data.stats[0].base_stat,
          attack: poke2Data.stats[1].base_stat,
          defense: poke2Data.stats[2].base_stat,
          specialAttack: poke2Data.stats[3].base_stat,
          specialDefense: poke2Data.stats[4].base_stat,
          speed: poke2Data.stats[5].base_stat,
        }
      };

      const { data, error } = await supabase.functions.invoke('pokemon-fusion', {
        body: { pokemon1, pokemon2 }
      });

      if (error) throw error;

      setFusion(data);
      toast.success("Fusion created successfully!");
    } catch (error: any) {
      console.error('Fusion error:', error);
      if (error.message?.includes('429')) {
        toast.error("Too many requests. Please wait a moment.");
      } else if (error.message?.includes('402')) {
        toast.error("AI credits exhausted. Please add credits.");
      } else {
        toast.error(error.message || "Failed to generate fusion");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-heading gradient-text">
                AI PokéFusion Lab
              </h1>
              <Zap className="h-10 w-10 text-accent animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg">
              Combine two Pokémon to create something extraordinary!
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Select Parent Pokémon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pokemon1">First Pokémon</Label>
                  <Input
                    id="pokemon1"
                    placeholder="e.g., Pikachu"
                    value={pokemon1Name}
                    onChange={(e) => setPokemon1Name(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pokemon2">Second Pokémon</Label>
                  <Input
                    id="pokemon2"
                    placeholder="e.g., Charizard"
                    value={pokemon2Name}
                    onChange={(e) => setPokemon2Name(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <Button
                onClick={generateFusion}
                disabled={isGenerating}
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-accent"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Fusing Pokémon...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Fusion
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {fusion && (
            <Card className="border-2 border-primary/50 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <CardTitle className="text-3xl text-center gradient-text">
                  {fusion.name}
                </CardTitle>
                <p className="text-center text-sm text-muted-foreground">
                  Fusion of {fusion.parents.join(" + ")}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {fusion.image && (
                  <div className="flex justify-center">
                    <img
                      src={fusion.image}
                      alt={fusion.name}
                      className="max-w-md w-full rounded-2xl shadow-2xl border-4 border-primary/20"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-heading mb-2">Description</h3>
                    <p className="text-muted-foreground">{fusion.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-heading mb-2">Type</h3>
                      <div className="flex gap-2">
                        <span className="px-4 py-2 bg-primary/20 rounded-full text-sm font-medium">
                          {fusion.primaryType}
                        </span>
                        {fusion.secondaryType && (
                          <span className="px-4 py-2 bg-accent/20 rounded-full text-sm font-medium">
                            {fusion.secondaryType}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-heading mb-2">Abilities</h3>
                      <div className="space-y-1">
                        {fusion.fusedAbilities?.map((ability: string, idx: number) => (
                          <p key={idx} className="text-sm text-muted-foreground">• {ability}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading mb-3">Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(fusion.stats).map(([stat, value]) => (
                        <div key={stat} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{stat.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="font-bold">{value as number}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent"
                              style={{ width: `${Math.min((value as number / 255) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokeFusion;
