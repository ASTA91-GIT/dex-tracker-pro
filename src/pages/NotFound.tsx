import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="text-8xl md:text-9xl font-heading">
            <span className="gradient-text">404</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-heading">
            You used Fly...
          </h1>
          <p className="text-xl text-muted-foreground">
            but there's no route here!
          </p>
          <Link to="/">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
