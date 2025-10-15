import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, Target, TrendingUp, Heart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Profile {
  username: string;
  level: number;
  xp: number;
  avatar_url?: string;
}

interface PokemonItem {
  id: string;
  pokemon_id: number;
  pokemon_name: string;
  caught_at?: string;
  added_at?: string;
}

interface BadgeItem {
  id: string;
  badge_name: string;
  badge_type: string;
  earned_at: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [caughtPokemon, setCaughtPokemon] = useState<PokemonItem[]>([]);
  const [favorites, setFavorites] = useState<PokemonItem[]>([]);
  const [wanted, setWanted] = useState<PokemonItem[]>([]);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      loadUserData();
    }
  }, [user, authLoading, navigate]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Fetch caught pokemon
      const { data: caughtData } = await supabase
        .from("caught_pokemon")
        .select("*")
        .eq("user_id", user.id)
        .order("caught_at", { ascending: false });

      if (caughtData) setCaughtPokemon(caughtData);

      // Fetch favorites
      const { data: favData } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });

      if (favData) setFavorites(favData);

      // Fetch wanted
      const { data: wantedData } = await supabase
        .from("wanted_pokemon")
        .select("*")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });

      if (wantedData) setWanted(wantedData);

      // Fetch badges
      const { data: badgesData } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

      if (badgesData) setBadges(badgesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load trainer data");
    } finally {
      setLoading(false);
    }
  };

  const getTrainerRank = (level: number) => {
    if (level >= 50) return "PokéMaster";
    if (level >= 30) return "Champion";
    if (level >= 20) return "Gym Leader";
    if (level >= 10) return "Ace Trainer";
    return "Rookie Trainer";
  };

  const completionPercentage = (caughtPokemon.length / 1025) * 100;
  const xpForNextLevel = (profile?.level || 1) * 100;
  const xpProgress = ((profile?.xp || 0) / xpForNextLevel) * 100;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-16 flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Trainer Data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-heading mb-2">
              <span className="gradient-text">Trainer Dashboard</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, {profile?.username || "Trainer"}!
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-2 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="h-8 w-8 text-primary" />
                  <Badge className="bg-primary text-primary-foreground">
                    Level {profile?.level || 1}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{getTrainerRank(profile?.level || 1)}</p>
                <Progress value={xpProgress} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {profile?.xp || 0} / {xpForNextLevel} XP
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-secondary/10 to-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-8 w-8 text-secondary" />
                </div>
                <p className="text-2xl font-bold">{caughtPokemon.length}</p>
                <p className="text-sm text-muted-foreground">Pokémon Caught</p>
                <Progress value={completionPercentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {completionPercentage.toFixed(1)}% Complete
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-accent/10 to-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <p className="text-2xl font-bold">{favorites.length}</p>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-2xl font-bold">{badges.length}</p>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="caught" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="caught">Caught ({caughtPokemon.length})</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
              <TabsTrigger value="wanted">Wanted ({wanted.length})</TabsTrigger>
              <TabsTrigger value="badges">Badges ({badges.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="caught">
              {caughtPokemon.length === 0 ? (
                <Card className="border-2">
                  <CardContent className="p-12 text-center">
                    <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl font-heading mb-2">No Pokémon Caught Yet!</p>
                    <p className="text-muted-foreground">
                      Start exploring the Pokédex to catch your first Pokémon!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {caughtPokemon.map((pokemon) => (
                    <Card key={pokemon.id} className="hover-float cursor-pointer border-2">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                          #{pokemon.pokemon_id.toString().padStart(3, "0")}
                        </p>
                        <p className="font-heading text-sm capitalize">{pokemon.pokemon_name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites">
              {favorites.length === 0 ? (
                <Card className="border-2">
                  <CardContent className="p-12 text-center">
                    <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl font-heading mb-2">No Favorites Yet!</p>
                    <p className="text-muted-foreground">
                      Mark your favorite Pokémon to see them here!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {favorites.map((pokemon) => (
                    <Card key={pokemon.id} className="hover-float cursor-pointer border-2">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                          #{pokemon.pokemon_id.toString().padStart(3, "0")}
                        </p>
                        <p className="font-heading text-sm capitalize">{pokemon.pokemon_name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="wanted">
              {wanted.length === 0 ? (
                <Card className="border-2">
                  <CardContent className="p-12 text-center">
                    <Zap className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl font-heading mb-2">No Wanted Pokémon!</p>
                    <p className="text-muted-foreground">
                      Add Pokémon to your wanted list to track your goals!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {wanted.map((pokemon) => (
                    <Card key={pokemon.id} className="hover-float cursor-pointer border-2">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                          #{pokemon.pokemon_id.toString().padStart(3, "0")}
                        </p>
                        <p className="font-heading text-sm capitalize">{pokemon.pokemon_name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="badges">
              {badges.length === 0 ? (
                <Card className="border-2">
                  <CardContent className="p-12 text-center">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl font-heading mb-2">No Badges Earned Yet!</p>
                    <p className="text-muted-foreground">
                      Complete challenges to earn badges!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {badges.map((badge) => (
                    <Card key={badge.id} className="hover-float border-2">
                      <CardContent className="p-6 text-center">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Trophy className="h-8 w-8 text-primary" />
                        </div>
                        <p className="font-heading text-sm mb-1">{badge.badge_name}</p>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {badge.badge_type}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
