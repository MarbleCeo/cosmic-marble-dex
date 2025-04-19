
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { TokenPair, Token } from "@/lib/types";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { ArrowLeftRight, Wallet, ArrowLeftCircle } from "lucide-react";
import { Link } from "react-router-dom";

const TokenExchange = () => {
  const { toast } = useToast();
  const { 
    isWalletConnected, 
    walletAddress, 
    availableTokens, 
    tokenPairs,
    swapTokens,
  } = useBlockchain();

  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null);
  const [swapDirection, setSwapDirection] = useState<'base_to_quote' | 'quote_to_base'>('base_to_quote');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  // Select first pair by default
  useEffect(() => {
    if (tokenPairs.length && !selectedPair) setSelectedPair(tokenPairs[0]);
  }, [tokenPairs, selectedPair]);

  // Calculate toAmount based on fromAmount and swap direction
  useEffect(() => {
    if (!selectedPair || !fromAmount) {
      setToAmount('');
      return;
    }

    // Get price ratio to calculate estimate
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
    if (value === '' || /^\d*\.?\d*$/.test(value)) setFromAmount(value);
  };

  const handleSwap = async () => {
    if (!isWalletConnected || !selectedPair || !fromAmount || parseFloat(fromAmount) <= 0) return;
    setIsSwapping(true);

    try {
      const fromToken = swapDirection === 'base_to_quote' ? selectedPair.baseToken.address : selectedPair.quoteToken.address;
      const toToken = swapDirection === 'base_to_quote' ? selectedPair.quoteToken.address : selectedPair.baseToken.address;

      const success = await swapTokens(fromToken, toToken, parseFloat(fromAmount));

      if (success) {
        toast({
          title: "Swap Successful",
          description: `Swapped ${fromAmount} ${swapDirection === 'base_to_quote' ? selectedPair.baseToken.symbol : selectedPair.quoteToken.symbol} to ${toAmount} ${swapDirection === 'base_to_quote' ? selectedPair.quoteToken.symbol : selectedPair.baseToken.symbol}`
        });
        setFromAmount('');
        setToAmount('');
      } else {
        toast({
          title: "Swap Failed",
          description: "Failed to execute swap transaction",
          variant: "destructive",
        });
      }
    } catch {
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
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="flex items-center text-zinc-400 hover:text-zinc-200 transition-colors">
          <ArrowLeftCircle className="mr-2 h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-bold text-zinc-50">Cosmic DEX</h1>
      </div>

      <Card className="overflow-hidden border-2 border-cosmic-purple/20 bg-gradient-to-br from-cosmic-black/80 to-cosmic-slate/90">
        <CardHeader className="pb-2">
          <CardTitle className="text-zinc-50">Multi-Chain Exchange</CardTitle>
          <CardDescription className="text-zinc-400">
            Swap tokens across supported blockchain networks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isWalletConnected ? (
            <>
              <div className="space-y-2">
                <label className="text-xs text-zinc-400">Select Pair</label>
                <Select value={selectedPair?.pairAddress} onValueChange={handlePairSelect}>
                  <SelectTrigger className="bg-cosmic-slate/30 border-cosmic-purple/30">
                    <SelectValue placeholder="Select a trading pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokenPairs.map(pair => (
                      <SelectItem key={pair.pairAddress} value={pair.pairAddress}>
                        {pair.baseToken.symbol}/{pair.quoteToken.symbol} ({pair.baseToken.chain}/{pair.quoteToken.chain})
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
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-zinc-400">From</label>
                        <span className="text-xs flex items-center text-zinc-400">
                          <Badge className="mr-1" variant="outline">
                            {swapDirection === 'base_to_quote' ? selectedPair.baseToken.chain : selectedPair.quoteToken.chain}
                          </Badge>
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
                        <ArrowLeftRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-zinc-400">To</label>
                        <span className="text-xs flex items-center text-zinc-400">
                          <Badge className="mr-1" variant="outline">
                            {swapDirection === 'base_to_quote' ? selectedPair.quoteToken.chain : selectedPair.baseToken.chain}
                          </Badge>
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
              <div className="text-center text-zinc-400">
                <Wallet className="mx-auto h-10 w-10 mb-2 text-cosmic-purple/70" />
                <p>Connect your wallet to swap tokens</p>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default TokenExchange;
