import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  Utensils, 
  Activity, 
  Loader2,
  Syringe,
  HandHeart
} from "lucide-react";

// --- Types ---
interface HostingPet {
  id: string;
  pet_name: string;
  pet_species: string;
  pet_breed: string;
  pet_location: string;
  amount_per_day: number;
  number_of_days: number;
  daily_food: string;
  walking_frequency: string;
  is_vaccinated: boolean;
  main_image_url: string;
  owner_id: string;
  owner?: {
    full_name: string;
  };
}

interface FilterState {
  search: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}

export const HostingList = () => {
  const [hostingPets, setHostingPets] = useState<HostingPet[]>([]);
  const [filteredPets, setFilteredPets] = useState<HostingPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    loadHostingPets();
  }, []);

  // Optimized Filter Logic
  useEffect(() => {
    let result = [...hostingPets];

    // Combine Species/Breed/Name into one robust search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(pet => 
        pet.pet_species.toLowerCase().includes(q) || 
        pet.pet_breed.toLowerCase().includes(q) ||
        pet.pet_name.toLowerCase().includes(q)
      );
    }

    if (filters.location) {
      result = result.filter(pet => 
        pet.pet_location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      result = result.filter(pet => pet.amount_per_day >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(pet => pet.amount_per_day <= parseFloat(filters.maxPrice));
    }

    setFilteredPets(result);
  }, [filters, hostingPets]);

  const loadHostingPets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("hosting_pets")
        .select("*, owner:profiles(full_name)")
        .eq("is_hosted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setHostingPets(data || []);
      setFilteredPets(data || []);
    } catch (error) {
      console.error("Error loading hosting pets:", error);
      toast.error("Unable to load pet list. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async (pet: HostingPet) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in to express interest");
      return;
    }

    // UI Loading State
    setSubmittingId(pet.id);

    try {
      // 1. Get User Profile
      const { data: interestedProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      // 2. Trigger Notification (Edge Function)
      // Note: In a real prod environment, we would trigger this via Database Webhooks,
      // not client-side, to prevent exposing owner emails.
      // Keeping consistent with your architecture:
      const { data: ownerData } = await supabase.auth.admin.getUserById(pet.owner_id);

      if (ownerData?.user?.email && interestedProfile) {
        await supabase.functions.invoke("send-interest-notification", {
          body: {
            ownerEmail: ownerData.user.email,
            ownerName: pet.owner?.full_name || "Pet Owner",
            petName: pet.pet_name,
            petType: `${pet.pet_species} (Hosting Request)`,
            interestedUserName: interestedProfile.full_name,
            interestedUserEmail: user.email || "",
          },
        });
        toast.success(`Request sent to ${pet.pet_name}'s owner!`);
      } else {
        toast.error("Could not reach pet owner details.");
      }
    } catch (error) {
      console.error("Interest Error:", error);
      toast.error("Failed to send request. Try again.");
    } finally {
      setSubmittingId(null);
    }
  };

  // Helper: Currency Formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hosting Opportunities</h2>
          <p className="text-muted-foreground mt-2">
            Earn money and love by hosting pets while their owners are away.
          </p>
        </div>
        {/* Reset Filters Quick Action */}
        {(filters.search || filters.location || filters.minPrice) && (
             <Button variant="ghost" onClick={() => setFilters({ search: "", location: "", minPrice: "", maxPrice: "" })} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                Clear Filters
             </Button>
        )}
      </div>

      {/* --- Search & Filters Bar --- */}
      <Card className="p-4 bg-background/60 backdrop-blur-sm border-muted shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by breed, name..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Location"
              className="pl-9"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          <div className="flex gap-2 col-span-1 md:col-span-2 lg:col-span-2">
             <div className="relative flex-1">
                <span className="absolute left-3 top-2 text-sm text-muted-foreground">$</span>
                <Input
                type="number"
                placeholder="Min / day"
                className="pl-6"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
             </div>
             <div className="relative flex-1">
                <span className="absolute left-3 top-2 text-sm text-muted-foreground">$</span>
                <Input
                type="number"
                placeholder="Max / day"
                className="pl-6"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
             </div>
          </div>
        </div>
      </Card>

      {/* --- Main Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Skeleton Loading State
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-1/4" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))
        ) : filteredPets.length === 0 ? (
          // Empty State
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            <Filter className="h-10 w-10 mb-4 opacity-20" />
            <p className="text-lg font-medium text-foreground">No hosting requests found</p>
            <p className="text-sm">Try adjusting your filters or location.</p>
          </div>
        ) : (
          // Result Cards
          filteredPets.map((pet) => (
            <HostingCard 
                key={pet.id} 
                pet={pet} 
                onInterest={handleInterest}
                isSubmitting={submittingId === pet.id}
                formatCurrency={formatCurrency}
            />
          ))
        )}
      </div>
    </div>
  );
};

// --- Sub-Component: Hosting Card ---
// Extracted for readability and maintainability
const HostingCard = ({ 
    pet, 
    onInterest, 
    isSubmitting,
    formatCurrency
}: { 
    pet: HostingPet; 
    onInterest: (p: HostingPet) => void;
    isSubmitting: boolean;
    formatCurrency: (n: number) => string;
}) => {
    return (
        <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-muted/60 hover:border-primary/40">
            {/* Image Section */}
            <div className="relative h-48 bg-muted">
                <img 
                    src={pet.main_image_url} 
                    alt={pet.pet_name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Pet"}
                />
                {/* Price Badge Overlay */}
                <div className="absolute top-3 right-3">
                    <Badge className="bg-white/95 text-black hover:bg-white shadow-sm backdrop-blur-md px-3 py-1">
                        <span className="font-bold">{formatCurrency(pet.amount_per_day)}</span>
                        <span className="font-normal text-muted-foreground ml-1">/ day</span>
                    </Badge>
                </div>
                {/* Vaccine Badge Overlay */}
                {pet.is_vaccinated && (
                    <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-emerald-500/90 text-white hover:bg-emerald-600 backdrop-blur-sm gap-1">
                            <Syringe className="h-3 w-3" /> Vaccinated
                        </Badge>
                    </div>
                )}
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-xl">{pet.pet_name}</h3>
                        <p className="text-sm text-muted-foreground">{pet.pet_species} • {pet.pet_breed}</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-grow space-y-3">
                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{pet.number_of_days} Days</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                         <MapPin className="h-4 w-4 mr-2 text-primary" />
                         <span className="truncate">{pet.pet_location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground col-span-2">
                        <Utensils className="h-4 w-4 mr-2 text-primary" />
                        <span className="truncate">Food: {pet.daily_food}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground col-span-2">
                        <Activity className="h-4 w-4 mr-2 text-primary" />
                        <span className="truncate">Activity: {pet.walking_frequency}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <Button 
                    className="w-full gap-2 font-medium" 
                    onClick={() => onInterest(pet)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <HandHeart className="h-4 w-4" />}
                    {isSubmitting ? "Sending..." : "Apply to Host"}
                </Button>
            </CardFooter>
        </Card>
    );
}