import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, Search, Home, ShieldCheck, MessageCircle, MapPin } from "lucide-react";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Adoption",
      desc: "Browse verified pet listings and find your perfect companion today.",
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-50",
      action: () => navigate("/adopt"),
      btn: "Browse Pets"
    },
    {
      title: "Lost & Found",
      desc: "Interactive maps and alerts to reunite lost pets with their families.",
      icon: MapPin,
      color: "text-blue-500",
      bg: "bg-blue-50",
      action: () => navigate("/lost-found"),
      btn: "View Map"
    },
    {
      title: "Pet Hosting",
      desc: "Connect with trusted local hosts for temporary pet care services.",
      icon: Home,
      color: "text-green-500",
      bg: "bg-green-50",
      action: () => navigate("/hosting"),
      btn: "Find Host"
    },
    {
      title: "Secure Chat",
      desc: "Chat directly with pet owners and shelters securely within the app.",
      icon: MessageCircle,
      color: "text-purple-500",
      bg: "bg-purple-50",
      action: () => navigate("/messages"),
      btn: "Go to Chat"
    },
    {
      title: "Verified Profiles",
      desc: "All pets and users are verified to ensure a safe community.",
      icon: ShieldCheck,
      color: "text-orange-500",
      bg: "bg-orange-50",
      action: () => navigate("/auth"),
      btn: "Get Verified"
    },
    {
      title: "Smart Search",
      desc: "Filter by breed, age, size, and location to find exactly what you need.",
      icon: Search,
      color: "text-teal-500",
      bg: "bg-teal-50",
      action: () => navigate("/adopt"),
      btn: "Search Now"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20 animate-in slide-in-from-bottom-5 duration-700">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            Everything you need
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Powerful features for <br />
            <span className="text-gradient">pet lovers</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We have built a complete ecosystem to help you adopt, care for, and protect your furry friends.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 rounded-[2rem] bg-gray-900/40 border border-gray-700 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
            >
              <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>

              <h3 className="text-2xl font-bold mb-3 text-white">{f.title}</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                {f.desc}
              </p>

              <Button
                onClick={f.action}
                variant="outline"
                className="w-full rounded-xl h-12 border-2 border-gray-600 text-white hover:bg-primary hover:text-white hover:border-primary transition-all font-semibold"
              >
                {f.btn}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;