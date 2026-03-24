import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportLostPet } from "@/components/lostfound/ReportLostPet";
import { ReportFoundPet } from "@/components/lostfound/ReportFoundPet";
import { LostPetsList } from "@/components/lostfound/LostPetsList";
import { FoundPetsList } from "@/components/lostfound/FoundPetsList";
import { AlertCircle, Search, MapPin, Radio } from "lucide-react";

const LostFound = () => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-black">
      <Navigation />

      <div className="pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-16 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Live Alerts</span>
            </div>
            <h1 className="font-display text-6xl md:text-9xl font-black text-white leading-none">
              LOST <span className="text-white/20">&</span> <span className="text-primary">FOUND</span>
            </h1>
          </div>

          <Tabs defaultValue="lost" className="w-full">
            {/* Editorial Tab Switcher */}
            <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
              <TabsList className="bg-transparent h-auto p-0 flex-col items-start gap-4">
                <TabsTrigger
                  value="lost"
                  className="bg-transparent border border-white/20 text-white rounded-none px-8 py-4 text-xl font-bold uppercase hover:bg-white hover:text-black data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:border-red-600 transition-all w-full md:w-auto justify-between"
                >
                  Report Missing <AlertCircle className="ml-4 w-5 h-5" />
                </TabsTrigger>
                <TabsTrigger
                  value="found"
                  className="bg-transparent border border-white/20 text-white rounded-none px-8 py-4 text-xl font-bold uppercase hover:bg-white hover:text-black data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600 transition-all w-full md:w-auto justify-between"
                >
                  Report Found <MapPin className="ml-4 w-5 h-5" />
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 bg-white/5 p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <Radio className="w-8 h-8 text-primary animate-pulse" />
                  <div>
                    <h4 className="font-bold text-white uppercase text-lg mb-1">Community Watch</h4>
                    <p className="text-muted-foreground text-sm">
                      Alerts are broadcast to all users in a 10km radius immediately. Please provide accurate details.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
              {/* Left: Input Forms */}
              <div className="lg:col-span-4">
                <div className="bg-card rounded-none border border-white/10 p-1">
                  <div className="bg-background border border-white/5 p-6">
                    <TabsContent value="lost" className="mt-0">
                      <h3 className="text-2xl font-black text-white mb-6 uppercase">Missing Report</h3>
                      <ReportLostPet />
                    </TabsContent>
                    <TabsContent value="found" className="mt-0">
                      <h3 className="text-2xl font-black text-white mb-6 uppercase">Found Report</h3>
                      <ReportFoundPet />
                    </TabsContent>
                  </div>
                </div>
              </div>

              {/* Right: Feeds */}
              <div className="lg:col-span-8">
                <TabsContent value="lost" className="mt-0">
                  <div className="border-l-4 border-red-600 pl-6 mb-8">
                    <h2 className="text-4xl font-black text-white uppercase">Missing Pets</h2>
                    <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Urgent Assistance Needed</p>
                  </div>
                  <LostPetsList />
                </TabsContent>

                <TabsContent value="found" className="mt-0">
                  <div className="border-l-4 border-green-600 pl-6 mb-8">
                    <h2 className="text-4xl font-black text-white uppercase">Found Pets</h2>
                    <p className="text-green-400 font-bold uppercase tracking-widest text-sm">Reuniting owners</p>
                  </div>
                  <FoundPetsList />
                </TabsContent>
              </div>
            </div>
          </Tabs>

        </div>
      </div>
    </div>
  );
};

export default LostFound;