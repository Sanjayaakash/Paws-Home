import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapViewer } from "@/components/map/MapViewer";
import { DollarSign, MapPin } from "lucide-react";

export const LostPetsList = () => {
  const [lostPets, setLostPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLostPets();
  }, []);

  const loadLostPets = async () => {
    const { data, error } = await supabase
      .from("lost_pets")
      .select("*, owner:profiles(full_name)")
      .eq("is_found", false)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLostPets(data);
    }
    setLoading(false);
  };

  const mapLocations = lostPets
    .filter(pet => pet.lost_location_lat && pet.lost_location_lng)
    .map(pet => ({
      id: pet.id,
      lat: parseFloat(pet.lost_location_lat),
      lng: parseFloat(pet.lost_location_lng),
      title: pet.pet_name,
      description: `${pet.pet_species} - Last seen: ${new Date(pet.created_at).toLocaleDateString()}`,
      imageUrl: pet.image_url,
    }));

  if (loading) return <Card className="p-6"><p>Loading...</p></Card>;

  return (
    <div className="space-y-6">
      {mapLocations.length > 0 && (
        <MapViewer locations={mapLocations} height="400px" />
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lostPets.map((pet) => (
          <Card key={pet.id} className="overflow-hidden">
            <img src={pet.image_url} alt={pet.pet_name} className="w-full h-48 object-cover" />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {pet.pet_name}
                <Badge variant="destructive">Lost</Badge>
              </CardTitle>
              <CardDescription>
                {pet.pet_species} • {pet.pet_breed}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{pet.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span className="text-muted-foreground">{pet.lost_location}</span>
              </div>
              {pet.reward_amount && (
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <DollarSign className="h-4 w-4" />
                  <span>${pet.reward_amount} Reward</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Reported by: {pet.owner?.full_name || "Unknown"}
              </p>
              <p className="text-xs text-muted-foreground">
                Last seen: {new Date(pet.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {lostPets.length === 0 && (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">No lost pets reported</p>
        </Card>
      )}
    </div>
  );
};
