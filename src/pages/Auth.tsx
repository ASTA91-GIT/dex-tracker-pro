import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import pokeballIcon from "@/assets/pokeball-icon.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    if (!email || !email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!isLogin && (!username || username.length < 3)) {
      newErrors.username = "Username must be at least 3 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
      }
    } catch (error: any) {
      setErrors({ submit: error.message || "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />

      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
                <img 
                  src={pokeballIcon} 
                  alt="Pokéball" 
                  className="relative w-64 h-64 object-contain animate-float drop-shadow-2xl"
                />
              </div>
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-heading gradient-text">
                  Welcome, Trainer!
                </h2>
                <p className="text-muted-foreground text-lg">
                  Your Pokémon journey awaits
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full">
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-border p-8 md:p-12">
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-heading mb-2 gradient-text">
                    {isLogin ? "Sign In" : "Create Account"}
                  </h1>
                  <p className="text-muted-foreground">
                    {isLogin ? "Continue your adventure" : "Begin your journey"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Trainer Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="Ash Ketchum"
                          className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                        />
                      </div>
                      {errors.username && (
                        <p className="text-sm text-destructive animate-fade-in">{errors.username}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="trainer@pokemon.com"
                        className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-all"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.password}</p>
                    )}
                  </div>

                  {isLogin && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline transition-all"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {errors.submit && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                      <p className="text-sm text-destructive text-center animate-fade-in">
                        {errors.submit}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg hover:shadow-xl group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Loading..."
                    ) : (
                      <>
                        {isLogin ? "Sign In" : "Create Account"}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setErrors({});
                      }}
                      className="ml-2 text-primary font-semibold hover:underline transition-all"
                    >
                      {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
