import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Zap, Target, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-pokemon.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="text-xs md:text-sm font-heading text-primary uppercase tracking-wider sparkle">
                🌟 Trainer Mode Activated! 🌟
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-tight">
              <span className="gradient-text">Gotta Catch</span>
              <br />
              <span className="text-accent">'Em All!</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your Pokémon collection, explore the complete Pokédex, and become the ultimate Pokémon Master!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/pokedex">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Explore Pokédex
                </Button>
              </Link>
              
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-bold text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
                >
                  <Target className="mr-2 h-5 w-5" />
                  Start Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading text-center mb-12">
            <span className="gradient-text">Trainer Features</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Target,
                title: "Complete Pokédex",
                description: "Browse all Pokémon from Gen 1 to the latest generation with detailed stats and info"
              },
              {
                icon: TrendingUp,
                title: "Track Progress",
                description: "Monitor your collection and see how close you are to becoming a Pokémon Master"
              },
              {
                icon: Zap,
                title: "Real-Time Updates",
                description: "Stay up-to-date with the latest Pokémon data from the official PokéAPI"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover-float border border-border"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-3xl p-8 md:p-12 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-heading">
              Ready to Start Your
              <br />
              <span className="gradient-text">Pokémon Journey?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of trainers tracking their Pokémon collections!
            </p>
            <Link to="/auth">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Become a Trainer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
