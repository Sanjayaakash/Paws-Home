import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, ArrowRight, PawPrint } from "lucide-react";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent, type: 'signin' | 'signup') => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'signup') {
        authSchema.parse({ email, password, fullName });
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Account created! Please check your email.");
      } else {
        authSchema.omit({ fullName: true }).parse({ email, password });
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (error: any) {
      const msg = error instanceof z.ZodError ? error.errors[0].message : error.message;
      toast.error(msg || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary selection:text-black">
      <div className="grid lg:grid-cols-2 min-h-screen">
        
        {/* Left Side: Editorial Image */}
        <div className="hidden lg:block relative border-r-4 border-primary">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Editorial Pet"
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>
          <div className="absolute top-10 left-10 z-10">
            <Link to="/" className="inline-flex items-center text-white bg-black/50 px-6 py-2 border-2 border-white/20 hover:bg-primary hover:text-black transition-colors font-bold uppercase rounded-none">
              <ArrowLeft className="mr-3 w-5 h-5" /> Return Home
            </Link>
          </div>
          <div className="absolute bottom-10 left-10 p-8 border-l-4 border-primary bg-black/80 backdrop-blur-md max-w-md z-10">
            <p className="text-primary font-bold tracking-widest text-xs uppercase mb-2">Editor's Pick</p>
            <h2 className="text-white font-display text-4xl leading-none uppercase">
              Your <span className="text-primary italic font-script lowercase">dream</span> pet awaits.
            </h2>
          </div>
        </div>

        {/* Right Side: Brutalist Auth Form */}
        <div className="relative flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background">
          <div className="absolute top-8 left-8 lg:hidden">
            <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors font-bold uppercase text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Home
            </Link>
          </div>

          <div className="w-full max-w-xl">
            {/* Header */}
            <div className="mb-12">
              <div className="bg-primary text-black px-4 py-1 inline-block mb-6 font-bold tracking-widest text-xs uppercase">
                Access System
              </div>
              <h1 className="text-6xl md:text-7xl font-black uppercase leading-[0.85] text-foreground mb-4">
                WELCOME <br />
                <span className="text-primary italic font-script">Back</span>
              </h1>
              <p className="text-muted-foreground font-medium text-lg border-l-4 border-primary pl-4">
                Enter your credentials to access the Pet Gallery and adoption features.
              </p>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-transparent border-2 border-foreground h-14 rounded-none p-0">
                <TabsTrigger 
                  value="signin" 
                  className="rounded-none h-full font-bold uppercase tracking-wider data-[state=active]:bg-foreground data-[state=active]:text-background transition-colors"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="rounded-none h-full font-bold uppercase tracking-wider data-[state=active]:bg-foreground data-[state=active]:text-background transition-colors"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="animate-in fade-in duration-500">
                <form onSubmit={(e) => handleAuth(e, 'signin')} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="uppercase font-bold tracking-wider text-xs">Email Address</Label>
                    <Input 
                      type="email" 
                      placeholder="NAME@EXAMPLE.COM" 
                      className="bg-transparent border-2 border-foreground/20 focus-visible:border-primary focus-visible:ring-0 rounded-none h-14 font-medium uppercase text-lg px-4 transition-all" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-bold tracking-wider text-xs">Password</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-transparent border-2 border-foreground/20 focus-visible:border-primary focus-visible:ring-0 rounded-none h-14 font-medium px-4 transition-all tracking-widest text-xl" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-primary text-black border-2 border-primary rounded-none font-black text-xl uppercase tracking-wider hover:bg-transparent hover:text-primary transition-all hover:scale-[1.02]" 
                    disabled={loading}
                  >
                    {loading ? "Authenticating..." : "Sign In"} <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>

                  <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t-2 border-foreground/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
                      <span className="bg-background px-4 text-muted-foreground">Or Connect With</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGoogleSignIn} 
                      className="h-14 border-2 border-foreground/20 rounded-none uppercase font-bold tracking-wider hover:bg-foreground hover:text-background transition-all"
                    >
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => toast.info("Phone auth coming soon!")} 
                      className="h-14 border-2 border-foreground/20 rounded-none uppercase font-bold tracking-wider hover:bg-foreground hover:text-background transition-all"
                    >
                      <PawPrint className="mr-3 h-5 w-5" />
                      Phone
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="animate-in fade-in duration-500">
                <form onSubmit={(e) => handleAuth(e, 'signup')} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="uppercase font-bold tracking-wider text-xs">Full Name</Label>
                    <Input 
                      placeholder="JOHN DOE" 
                      className="bg-transparent border-2 border-foreground/20 focus-visible:border-primary focus-visible:ring-0 rounded-none h-14 font-medium uppercase text-lg px-4 transition-all" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-bold tracking-wider text-xs">Email Address</Label>
                    <Input 
                      type="email" 
                      placeholder="NAME@EXAMPLE.COM" 
                      className="bg-transparent border-2 border-foreground/20 focus-visible:border-primary focus-visible:ring-0 rounded-none h-14 font-medium uppercase text-lg px-4 transition-all" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-bold tracking-wider text-xs">Create Password</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-transparent border-2 border-foreground/20 focus-visible:border-primary focus-visible:ring-0 rounded-none h-14 font-medium px-4 transition-all tracking-widest text-xl" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-16 bg-primary text-black border-2 border-primary rounded-none font-black text-xl uppercase tracking-wider hover:bg-transparent hover:text-primary transition-all hover:scale-[1.02]" 
                    disabled={loading}
                  >
                    {loading ? "Initializing..." : "Create Identity"} <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;