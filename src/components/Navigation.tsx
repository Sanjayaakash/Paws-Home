import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ADOPT", path: "/adopt" },
    { name: "PET HOSTING", path: "/hosting" },
    { name: "LOST & FOUND", path: "/lost-found" },
    { name: "Services", path: "/features" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 text-white">
      <nav
        className={`w-full px-6 py-4 flex items-center justify-between transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
          }`}
      >
        {/* LOGO */}
        <Link to="/" className="group">
          <span className="font-display text-3xl tracking-tighter uppercase relative z-10">
            Paws<span className="text-primary font-script lowercase text-4xl ml-1">Home</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase ${location.pathname === link.path ? "text-primary border-b-2 border-primary" : "text-white"
                }`}
            >
              {link.name}
            </Link>
          ))}

          <Link to="/auth">
            <Button
              variant="outline"
              className="rounded-none border-white text-white hover:bg-primary hover:text-background hover:border-primary transition-all font-bold uppercase tracking-wider"
            >
              Sign In
            </Button>
          </Link>

          <button className="text-white hover:text-primary transition-colors">
            <ShoppingBag className="w-6 h-6" />
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-white hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background z-40 flex flex-col justify-center items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display text-5xl text-white hover:text-primary hover:italic transition-all uppercase"
            >
              {link.name}
            </Link>
          ))}
          <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="rounded-none bg-primary text-background px-8 py-6 text-xl font-bold uppercase">
              Sign In Account
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navigation;