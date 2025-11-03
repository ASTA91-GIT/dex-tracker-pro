import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { 
  Search, 
  Sparkles, 
  GitCompare, 
  Zap, 
  Users, 
  BookOpen, 
  Sword, 
  Award, 
  Shuffle,
  Calculator,
  HelpCircle,
  Eye
} from "lucide-react";
import heroImage from "@/assets/hero-pokemon.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-heading leading-tight">
              <span className="gradient-text">Your Ultimate</span>
              <br />
              <span className="text-accent">Pokédex Hub</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore, track, and master the world of Pokémon with powerful tools and features
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-12 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              { icon: Search, title: "Pokédex", to: "/pokedex", color: "text-red-500" },
              { icon: Sparkles, title: "My Collection", to: "/collection", color: "text-yellow-500" },
              { icon: GitCompare, title: "Compare", to: "/pokedex", color: "text-blue-500" },
              { icon: Zap, title: "Evolution", to: "/evolution-stones", color: "text-purple-500" },
              { icon: Calculator, title: "Type Calculator", to: "/type-calculator", color: "text-green-500" },
              { icon: Sword, title: "Battle", to: "/battle", color: "text-orange-500" },
              { icon: Users, title: "Characters", to: "/characters", color: "text-pink-500" },
              { icon: BookOpen, title: "Lore", to: "/lore", color: "text-indigo-500" },
              { icon: HelpCircle, title: "Quiz", to: "/quiz", color: "text-cyan-500" },
              { icon: Eye, title: "Guess Game", to: "/guess", color: "text-teal-500" },
              { icon: Award, title: "Leaderboard", to: "/leaderboard", color: "text-amber-500" },
              { icon: Shuffle, title: "Random", to: "/random", color: "text-rose-500" },
            ].map((feature, index) => (
              <Link key={index} to={feature.to}>
                <Card className="group h-full hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-card/50 backdrop-blur">
                  <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
                    <div className="bg-primary/10 dark:bg-primary/20 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <h3 className="font-heading text-sm text-center group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-heading">
                <span className="gradient-text">About PokéTrack</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Your comprehensive companion for all things Pokémon. Track your collection, 
                discover evolution paths, battle strategies, and connect with fellow trainers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Search, title: "Complete Database", desc: "Access info on all Pokémon" },
                { icon: Zap, title: "Real-Time Data", desc: "Always up-to-date information" },
                { icon: Users, title: "Community", desc: "Connect with trainers worldwide" }
              ].map((item, idx) => (
                <div key={idx} className="text-center space-y-3 p-6 rounded-2xl bg-background/50">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
