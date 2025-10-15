import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import pokeballIcon from "@/assets/pokeball-icon.png";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = user
    ? [
        { path: "/", label: "Home" },
        { path: "/pokedex", label: "Pokédex" },
        { path: "/dashboard", label: "Dashboard" },
      ]
    : [
        { path: "/", label: "Home" },
        { path: "/pokedex", label: "Pokédex" },
        { path: "/auth", label: "Trainer Login" },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={pokeballIcon} alt="Poké Ball" className="w-8 h-8" />
            <span className="font-heading text-sm md:text-base gradient-text">
              PokéTrack
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 md:gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm md:text-base font-medium transition-colors hover:text-primary",
                  location.pathname === item.path
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-sm md:text-base"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
