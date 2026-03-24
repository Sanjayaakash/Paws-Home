import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  MapPin,
  Search,
  Filter,
  Heart,
  Dog,
  Cat,
  DollarSign,
  Loader2,
  Sparkles
} from "lucide-react";

interface Pet {
  id: string;
  pet_name: string;
  pet_species: string;
  pet_breed: string;
  pet_location: string;
  amount: number;
  main_image_url: string;
  health_condition: string;
  owner_id: string;
  profiles?: {
    full_name: string;
    id: string;
  };
}

interface FilterState {
  search: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}

export const AdoptPetList = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pets_for_adoption")
        .select("*, profiles!pets_for_adoption_owner_id_fkey(full_name, id)")
        .eq("is_approved", true)
        .eq("is_adopted", false);

      if (error) throw error;

      setPets(data || []);
      setFilteredPets(data || []);
    } catch (error) {
      console.error("Error loading pets:", error);
      toast.error("Could not load pets. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...pets];
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (pet) =>
          pet.pet_species.toLowerCase().includes(query) ||
          pet.pet_breed.toLowerCase().includes(query) ||
          pet.pet_name.toLowerCase().includes(query)
      );
    }
    if (filters.location) {
      result = result.filter((pet) =>
        pet.pet_location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.minPrice) {
      result = result.filter((pet) => pet.amount >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((pet) => pet.amount <= parseFloat(filters.maxPrice));
    }
    setFilteredPets(result);
  }, [filters, pets]);

  const handleInterest = async (pet: Pet) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to contact the owner");
      return;
    }
    setSubmittingId(pet.id);
    try {
      const { error } = await supabase
        .from("adoption_interests")
        .insert({ pet_id: pet.id, interested_user_id: user.id });

      if (error) {
        if (error.code === '23505') {
          toast.info("You have already expressed interest in this pet!");
          return;
        }
        throw error;
      }

      await supabase.functions.invoke("send-interest-notification", {
        body: {
          ownerId: pet.owner_id,
          petName: pet.pet_name,
          petType: pet.pet_species,
          interestedUserName: user.email,
          interestedUserEmail: user.email,
        },
      });

      toast.success(`Interest sent to ${pet.profiles?.full_name || 'the owner'}!`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmittingId(null);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-8">

      {/* --- Floating Glass Filter Bar --- */}
      <div className="sticky top-24 z-30 glass rounded-2xl p-4 shadow-xl border border-white/40 ring-1 ring-black/5 animate-in slide-in-from-top-4 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              placeholder="Search by name, breed..."
              className="pl-10 bg-white/80 border-white/20 focus:bg-white transition-all rounded-xl h-12 text-gray-900 placeholder:text-gray-600"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div className="md:col-span-3 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              placeholder="Location"
              className="pl-10 bg-white/80 border-white/20 focus:bg-white transition-all rounded-xl h-12 text-gray-900 placeholder:text-gray-600"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">$</span>
              <Input
                type="number"
                placeholder="Min"
                className="pl-6 bg-white/80 border-white/20 focus:bg-white transition-all rounded-xl h-12 text-gray-900 placeholder:text-gray-600"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="Max"
                className="bg-white/80 border-white/20 focus:bg-white transition-all rounded-xl h-12 text-gray-900 placeholder:text-gray-600"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <Button
              variant="ghost"
              className="w-full h-12 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
              onClick={() => setFilters({ search: "", location: "", minPrice: "", maxPrice: "" })}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* --- Results --- */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-sm bg-white">
                <Skeleton className="h-[300px] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="bg-primary/5 p-6 rounded-full ring-8 ring-primary/5">
              <Search className="h-12 w-12 text-primary/40" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-display">No pets found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find more friends.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setFilters({ search: "", location: "", minPrice: "", maxPrice: "" })}
              className="rounded-full"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onInterest={handleInterest}
                isSubmitting={submittingId === pet.id}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PetCard = ({
  pet,
  onInterest,
  isSubmitting,
  formatPrice
}: {
  pet: Pet;
  onInterest: (p: Pet) => void;
  isSubmitting: boolean;
  formatPrice: (n: number) => string;
}) => {
  return (
    <Card className="group relative overflow-hidden border-0 bg-white shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 rounded-[2rem]">
      {/* Image Container */}
      <div className="relative h-[320px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opactiy-60" />
        <img
          src={pet.main_image_url}
          alt={pet.pet_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/600x600?text=No+Image";
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <Badge className="backdrop-blur-xl bg-black/30 border-0 text-white hover:bg-black/40 font-medium px-3 py-1.5 h-auto rounded-full">
            {formatPrice(pet.amount)}
          </Badge>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-display font-bold text-2xl tracking-tight mb-1">{pet.pet_name}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            {pet.pet_species === 'Dog' ? <Dog className="h-4 w-4" /> : <Cat className="h-4 w-4" />}
            <span>{pet.pet_breed}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
            <div className="flex items-center text-xs text-white/90 bg-white/20 backdrop-blur-md p-2 rounded-lg">
              <MapPin className="h-3 w-3 mr-1.5" />
              <span className="truncate">{pet.pet_location}</span>
            </div>
            <div className="flex items-center text-xs text-white/90 bg-white/20 backdrop-blur-md p-2 rounded-lg">
              <Sparkles className="h-3 w-3 mr-1.5" />
              <span className="truncate">{pet.health_condition}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4">
        <Button
          onClick={() => onInterest(pet)}
          className="w-full h-12 rounded-xl gap-2 font-bold text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5 fill-current" />}
          {isSubmitting ? "Sending..." : "Meet " + pet.pet_name}
        </Button>
      </div>
    </Card>
  );
};