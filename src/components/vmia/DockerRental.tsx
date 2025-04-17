
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DockerHost } from "@/lib/types";

// Mock data
const mockDockerHosts: DockerHost[] = [
  {
    id: "host1",
    name: "VMIA Node Alpha",
    specs: {
      cpu: "8 cores / 16 threads",
      ram: "32 GB DDR4",
      storage: "1 TB NVMe SSD",
      bandwidth: "1 Gbps"
    },
    status: "online",
    earnings: 156.42,
    uptime: 99.8
  },
  {
    id: "host2",
    name: "VMIA Node Beta",
    specs: {
      cpu: "12 cores / 24 threads",
      ram: "64 GB DDR4",
      storage: "2 TB NVMe SSD",
      bandwidth: "2.5 Gbps"
    },
    status: "online",
    earnings: 283.15,
    uptime: 98.9
  }
];

const DockerRental = () => {
  const [activeHost, setActiveHost] = useState<DockerHost | null>(null);
  const [isRenting, setIsRenting] = useState(false);
  
  const handleRent = () => {
    if (!activeHost) return;
    
    setIsRenting(true);
    // In a production app, this would initiate a blockchain transaction
    setTimeout(() => {
      setIsRenting(false);
      // Show success message
    }, 2000);
  };

  return (
    <Card className="overflow-hidden border-2 border-cosmic-purple/20 bg-gradient-to-br from-cosmic-black/80 to-cosmic-slate/90">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-zinc-50">VMIA Docker Rentals</CardTitle>
          <Badge className="bg-cosmic-fuchsia/20 text-cosmic-fuchsia border-cosmic-fuchsia/30">
            Proof of Host
          </Badge>
        </div>
        <CardDescription className="text-zinc-400">
          Rent Docker machines and earn CMX tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-cosmic-slate/30">
            <TabsTrigger value="available">Available Hosts</TabsTrigger>
            <TabsTrigger value="myHosts">My Hosts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4 pt-4">
            {mockDockerHosts.map((host) => (
              <div 
                key={host.id} 
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  activeHost?.id === host.id 
                    ? "border-cosmic-fuchsia bg-cosmic-fuchsia/10" 
                    : "border-cosmic-slate/20 bg-cosmic-slate/10 hover:bg-cosmic-slate/20"
                }`}
                onClick={() => setActiveHost(host)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-zinc-200">{host.name}</div>
                  <Badge 
                    variant={host.status === "online" ? "default" : "outline"}
                    className={host.status === "online" 
                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {host.status}
                  </Badge>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-zinc-400">CPU:</span> <span className="text-zinc-300">{host.specs.cpu}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">RAM:</span> <span className="text-zinc-300">{host.specs.ram}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Storage:</span> <span className="text-zinc-300">{host.specs.storage}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Bandwidth:</span> <span className="text-zinc-300">{host.specs.bandwidth}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400">Uptime:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={host.uptime} className="h-2 w-24" />
                      <span className="text-xs text-zinc-300">{host.uptime}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400">Earnings (30d):</span>
                    <div className="font-medium text-cosmic-fuchsia">{host.earnings} CMX</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="myHosts" className="min-h-[200px] flex items-center justify-center">
            <div className="text-center text-zinc-400">
              <p>You are not hosting any Docker machines yet</p>
              <p className="text-xs mt-2">Register your machine to start earning CMX tokens</p>
            </div>
          </TabsContent>
        </Tabs>
        
        {activeHost && (
          <>
            <Separator className="bg-cosmic-slate/30" />
            <div className="space-y-2">
              <h4 className="font-medium text-zinc-200">Selected Host: {activeHost.name}</h4>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Rental Rate:</span>
                <span className="font-medium text-cosmic-fuchsia">0.25 CMX/hour</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Min. Duration:</span>
                <span className="text-zinc-300">24 hours</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="bg-cosmic-black/30 pt-2">
        <Button
          onClick={handleRent}
          disabled={!activeHost || isRenting}
          className="w-full bg-gradient-to-r from-cosmic-fuchsia to-cosmic-purple hover:from-cosmic-fuchsia/80 hover:to-cosmic-purple/80"
        >
          {isRenting ? "Processing..." : "Rent Docker Machine"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DockerRental;
