import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Pokedex from "./pages/Pokedex";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PokemonDetail from "./pages/PokemonDetail";
import TeamBuilder from "./pages/TeamBuilder";
import TypeCalculator from "./pages/TypeCalculator";
import Quiz from "./pages/Quiz";
import GuessThePokemon from "./pages/GuessThePokemon";
import BattleSimulator from "./pages/BattleSimulator";
import Leaderboard from "./pages/Leaderboard";
import Characters from "./pages/Characters";
import News from "./pages/News";
import RandomPokemon from "./pages/RandomPokemon";
import Collection from "./pages/Collection";
import EvolutionStones from "./pages/EvolutionStones";
import PokemonLore from "./pages/PokemonLore";
import PokeFusion from "./pages/PokeFusion";
import TrainerJournal from "./pages/TrainerJournal";
import HabitTracker from "./pages/HabitTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pokedex" element={<Pokedex />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team-builder" element={<TeamBuilder />} />
            <Route path="/type-calculator" element={<TypeCalculator />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/guess" element={<GuessThePokemon />} />
            <Route path="/battle" element={<BattleSimulator />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/news" element={<News />} />
            <Route path="/random" element={<RandomPokemon />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/evolution-stones" element={<EvolutionStones />} />
            <Route path="/lore" element={<PokemonLore />} />
            <Route path="/fusion" element={<PokeFusion />} />
            <Route path="/journal" element={<TrainerJournal />} />
            <Route path="/habits" element={<HabitTracker />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
