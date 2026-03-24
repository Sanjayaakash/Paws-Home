import Navigation from "@/components/Navigation";
import { HostingRequestForm } from "@/components/hosting/HostingRequestForm";
import { HostingList } from "@/components/hosting/HostingList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Hosting = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
              Pet <span className="text-gradient">Hosting</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Temporary pet care services when you need it most. Find a loving host or become one.
            </p>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 p-1 bg-gray-800/50 rounded-xl border border-gray-700">
              <TabsTrigger
                value="browse"
                className="rounded-lg text-base font-medium text-gray-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                Browse Hosting
              </TabsTrigger>
              <TabsTrigger
                value="request"
                className="rounded-lg text-base font-medium text-gray-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                Request Hosting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="animate-in fade-in zoom-in-95 duration-300">
              <HostingList />
            </TabsContent>

            <TabsContent value="request" className="animate-in fade-in zoom-in-95 duration-300">
              <HostingRequestForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Hosting;