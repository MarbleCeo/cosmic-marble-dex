
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { TokenPair, Token } from "@/lib/types";
import { getTokenPairs, executeSwap } from "@/lib/blockchain-utils";
import { useBlockchain } from "@/contexts/BlockchainContext";

const TokenExchange = () => {
  const { toast } = useToast();
  const { isWalletConnected, walletAddress } = useBlockchain();
  
  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null);
  const [swapDirection, setSwapDirection] = useState<'base_to_quote' | 'quote_to_base'>('base_to_quote');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);
  
  // Fetch token pairs
  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const pairs = await getTokenPairs();
        setTokenPairs(pairs);
        if (pairs.length > 0) {
          setSelectedPair(pairs[0]);
        }
      } catch (error) {
        console.error("Error fetching token pairs:", error);
        toast({
          title: "Error",
          description: "Failed to load trading pairs",
          variant: "destructive",
        });
      }
    };
    
    fetchPairs();
  }, [toast]);
  
  // Update to amount when from amount or pair changes
  useEffect(() => {
    if (!selectedPair || !fromAmount) {
      setToAmount('');
      return;
    }
    
    const rate = swapDirection === 'base_to_quote' 
      ? selectedPair.baseToken.price / selectedPair.quoteToken.price
      : selectedPair.quoteToken.price / selectedPair.baseToken.price;
    
    setToAmount((parseFloat(fromAmount) * rate).toFixed(6));
  }, [fromAmount, selectedPair, swapDirection]);
  
  const handlePairSelect = (pairAddress: string) => {
    const pair = tokenPairs.find(p => p.pairAddress === pairAddress);
    if (pair) {
      setSelectedPair(pair);
      setFromAmount('');
      setToAmount('');
    }
  };
  
  const handleSwapDirectionToggle = () => {
    setSwapDirection(prev => prev === 'base_to_quote' ? 'quote_to_base' : 'base_to_quote');
    setFromAmount('');
    setToAmount('');
  };
  
  const handleFromAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };
  
  const handleSwap = async () => {
    if (!isWalletConnected || !selectedPair || !fromAmount || parseFloat(fromAmount) <= 0) {
      return;
    }
    
    setIsSwapping(true);
    
    try {
      const fromToken = swapDirection === 'base_to_quote' 
        ? selectedPair.baseToken.address 
        : selectedPair.quoteToken.address;
      
      const toToken = swapDirection === 'base_to_quote'
        ? selectedPair.quoteToken.address
        : selectedPair.baseToken.address;
      
      const result = await executeSwap(
        walletAddress || '',
        fromToken,
        toToken,
        parseFloat(fromAmount)
      );
      
      if (result.success) {
        toast({
          title: "Swap Successful",
          description: `Received ${result.receivedAmount?.toFixed(6)} tokens`,
        });
        
        // Reset form
        setFromAmount('');
        setToAmount('');
      } else {
        toast({
          title: "Swap Failed",
          description: "Failed to execute swap transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error executing swap:", error);
      toast({
        title: "Error",
        description: "An error occurred during the swap",
        variant: "destructive",
      });
    } finally {
      setIsSwapping(false);
    }
  };
  
  return (
    <Card className="overflow-hidden border-2 border-cosmic-purple/20 bg-gradient-to-br from-cosmic-black/80 to-cosmic-slate/90">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-zinc-50">Cosmic DEX</CardTitle>
          <Badge className="bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/30">
            Multi-Chain
          </Badge>
        </div>
        <CardDescription className="text-zinc-400">
          Swap tokens across Solana, Ethereum, Binance, and Cosmic Marble networks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="swap" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-cosmic-slate/30">
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            <TabsTrigger value="mint">Mint Token</TabsTrigger>
          </TabsList>
          
          <TabsContent value="swap" className="space-y-4 pt-4">
            {isWalletConnected ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400">Select Pair</label>
                  <Select 
                    value={selectedPair?.pairAddress} 
                    onValueChange={handlePairSelect}
                  >
                    <SelectTrigger className="bg-cosmic-slate/30 border-cosmic-purple/30">
                      <SelectValue placeholder="Select a trading pair" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokenPairs.map((pair) => (
                        <SelectItem key={pair.pairAddress} value={pair.pairAddress}>
                          {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedPair && (
                  <>
                    <div className="rounded-lg bg-cosmic-slate/20 p-3">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>Price:</span>
                        <span>
                          1 {swapDirection === 'base_to_quote' ? selectedPair.baseToken.symbol : selectedPair.quoteToken.symbol} = {' '}
                          {swapDirection === 'base_to_quote' 
                            ? (selectedPair.baseToken.price / selectedPair.quoteToken.price).toFixed(6) 
                            : (selectedPair.quoteToken.price / selectedPair.baseToken.price).toFixed(6)
                          } {' '}
                          {swapDirection === 'base_to_quote' ? selectedPair.quoteToken.symbol : selectedPair.baseToken.symbol}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                        <span>24h Change:</span>
                        <span className={selectedPair.priceChange24h >= 0 ? "text-green-400" : "text-red-400"}>
                          {selectedPair.priceChange24h >= 0 ? "+" : ""}{selectedPair.priceChange24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-zinc-400">From</label>
                          <span className="text-xs text-zinc-400">
                            {swapDirection === 'base_to_quote' ? selectedPair.baseToken.symbol : selectedPair.quoteToken.symbol}
                          </span>
                        </div>
                        <Input
                          type="text"
                          value={fromAmount}
                          onChange={(e) => handleFromAmountChange(e.target.value)}
                          className="bg-cosmic-slate/30 border-cosmic-purple/30"
                          placeholder="0.0"
                        />
                      </div>
                      
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSwapDirectionToggle}
                          className="h-8 w-8 rounded-full bg-cosmic-slate/50"
                        >
                          <span className="text-lg">↓↑</span>
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-zinc-400">To</label>
                          <span className="text-xs text-zinc-400">
                            {swapDirection === 'base_to_quote' ? selectedPair.quoteToken.symbol : selectedPair.baseToken.symbol}
                          </span>
                        </div>
                        <Input
                          type="text"
                          value={toAmount}
                          readOnly
                          className="bg-cosmic-slate/30 border-cosmic-purple/30"
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-center text-zinc-400">Connect your wallet to swap tokens</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="liquidity" className="h-64 flex items-center justify-center">
            <div className="text-center text-zinc-400">
              <p>Liquidity provision coming soon</p>
              <p className="mt-2 text-xs">Add liquidity to earn trading fees</p>
            </div>
          </TabsContent>
          
          <TabsContent value="mint" className="h-64 flex items-center justify-center">
            <div className="text-center text-zinc-400">
              <p>Token minting coming soon</p>
              <p className="mt-2 text-xs">Create your own token on Cosmic Marble</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-cosmic-black/30 pt-2">
        <Button
          onClick={handleSwap}
          disabled={!isWalletConnected || !selectedPair || !fromAmount || parseFloat(fromAmount) <= 0 || isSwapping}
          className="w-full bg-gradient-to-r from-cosmic-blue to-cosmic-cyan hover:from-cosmic-blue/80 hover:to-cosmic-cyan/80"
        >
          {isSwapping ? "Processing..." : "Swap Tokens"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TokenExchange;
