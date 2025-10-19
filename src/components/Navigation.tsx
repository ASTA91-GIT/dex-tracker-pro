import { Link } from "react-router-dom";
import pokeballIcon from "@/assets/pokeball-icon.png";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={pokeballIcon} alt="Poké Ball" className="w-8 h-8" />
            <span className="font-heading text-base gradient-text">PokéTrack</span>
          </Link>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pokedex" className="cursor-pointer">Pokédex</Link>
                </DropdownMenuItem>
                {user && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/collection" className="cursor-pointer">My Collection</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/team-builder" className="cursor-pointer">Team Builder</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/type-calculator" className="cursor-pointer">Type Calculator</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/evolution-stones" className="cursor-pointer">Evolution Stones</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/quiz" className="cursor-pointer">Quiz</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/guess" className="cursor-pointer">Guess Pokémon</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/battle" className="cursor-pointer">Battle Simulator</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/leaderboard" className="cursor-pointer">Leaderboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/characters" className="cursor-pointer">Characters</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/lore" className="cursor-pointer">Lore</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/random" className="cursor-pointer">Random Generator</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/news" className="cursor-pointer">News</Link>
                </DropdownMenuItem>
                {!user ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/auth" className="cursor-pointer">Trainer Login</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
