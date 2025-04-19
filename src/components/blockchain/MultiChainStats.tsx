
// Added React import and fixed Badge typing usage and imports
import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BlockchainStats } from "@/lib/types";

// Mock data
const mockBlockchainData: Record<string, BlockchainStats> = {
  solana: {
    chain: "Solana",
    blockHeight: 218945632,
    tps: 2456,
    validators: 1872,
    price: 138.42,
    marketCap: 65.8,
    change24h: 4.2
  },
  ethereum: {
    chain: "Ethereum",
    blockHeight: 19234567,
    tps: 30,
    validators: 889453,
    price: 3428.15,
    marketCap: 412.5,
    change24h: -1.8
  },
  binance: {
    chain: "Binance",
    blockHeight: 32654789,
    tps: 160,
    validators: 21,
    price: 548.92,
    marketCap: 85.3,
    change24h: 2.1
  },
  bitcoin: {
    chain: "Bitcoin",
    blockHeight: 832654,
    tps: 7,
    validators: 12045,
    price: 61237.45,
    marketCap: 1204.7,
    change24h: 0.5
  }
};

const chainColors = {
  solana: "blockchain-solana",
  ethereum: "blockchain-ethereum",
  binance: "blockchain-binance", 
  bitcoin: "blockchain-bitcoin"
};

const MultiChainStats = () => {
  const [activeChain, setActiveChain] = useState<string>("solana");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [activeChain]);

  return (
    <Card className="overflow-hidden border-2 border-cosmic-purple/20 bg-gradient-to-br from-cosmic-black/80 to-cosmic-slate/90">
      <CardHeader className="pb-2">
        <CardTitle className="text-zinc-50">Multi-Chain Dashboard</CardTitle>
        <CardDescription className="text-zinc-400">
          Monitor key metrics across multiple blockchains
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="solana"
          value={activeChain}
          onValueChange={setActiveChain}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-cosmic-slate/30">
            <TabsTrigger value="solana" className="data-[state=active]:bg-blockchain-solana/20">Solana</TabsTrigger>
            <TabsTrigger value="ethereum" className="data-[state=active]:bg-blockchain-ethereum/20">Ethereum</TabsTrigger>
            <TabsTrigger value="binance" className="data-[state=active]:bg-blockchain-binance/20">Binance</TabsTrigger>
            <TabsTrigger value="bitcoin" className="data-[state=active]:bg-blockchain-bitcoin/20">Bitcoin</TabsTrigger>
          </TabsList>
          
          {Object.keys(mockBlockchainData).map((chain) => (
            <TabsContent key={chain} value={chain} className="space-y-4 pt-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex animate-pulse justify-between">
                      <div className="h-5 w-24 rounded bg-cosmic-slate/30"></div>
                      <div className="h-5 w-16 rounded bg-cosmic-slate/30"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-zinc-200">
                      {mockBlockchainData[chain].chain}
                    </h3>
                    <Badge 
                      className={`bg-${chainColors[chain as keyof typeof chainColors]}/20 border-${chainColors[chain as keyof typeof chainColors]}/30 text-${chainColors[chain as keyof typeof chainColors]}`}
                    >
                      Live
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2">
                    <div>
                      <div className="text-xs text-zinc-400">Block Height</div>
                      <div className="font-mono text-sm text-zinc-200">
                        #{mockBlockchainData[chain].blockHeight.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400">TPS</div>
                      <div className="font-mono text-sm text-zinc-200">
                        {mockBlockchainData[chain].tps}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400">Validators</div>
                      <div className="font-mono text-sm text-zinc-200">
                        {mockBlockchainData[chain].validators.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400">Price</div>
                      <div className="font-mono text-sm text-zinc-200">
                        ${mockBlockchainData[chain].price.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400">Market Cap</div>
                      <div className="font-mono text-sm text-zinc-200">
                        ${mockBlockchainData[chain].marketCap.toLocaleString()}B
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400">24h Change</div>
                      <div className={`font-mono text-sm ${
                        mockBlockchainData[chain].change24h >= 0 
                          ? "text-green-400" 
                          : "text-red-400"
                      }`}>
                        {mockBlockchainData[chain].change24h >= 0 ? "+" : ""}
                        {mockBlockchainData[chain].change24h}%
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultiChainStats;
