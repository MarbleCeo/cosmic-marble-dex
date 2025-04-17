
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { TokenPair, Token, MintDetails } from "@/lib/types";
import { 
  getTokenPairs, 
  executeSwap, 
  addLiquidity, 
  removeLiquidity,
  mintToken, 
  bridgeToken, 
  getChainStats 
} from "@/lib/blockchain-utils";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { ArrowLeftRight, ChevronLeft, Wallet, PlusCircle, ArrowLeftCircle } from "lucide-react";
import { Link } from "react-router-dom";

const TokenExchange = () => {
  const { toast } = useToast();
  const { 
    isWalletConnected, 
    walletAddress, 
    availableTokens, 
    tokenPairs,
    swapTokens,
    addTokenLiquidity,
    removeTokenLiquidity,
    createToken,
    cmxBalance
  } = useBlockchain();
  
  // UI States
  const [selectedTab, setSelectedTab] = useState<string>("swap");
  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null);
  const [swapDirection, setSwapDirection] = useState<'base_to_quote' | 'quote_to_base'>('base_to_quote');
  const [isSwapping, setIsSwapping] = useState(false);
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [isRemovingLiquidity, setIsRemovingLiquidity] = useState(false);
  const [isMintingToken, setIsMintingToken] = useState(false);
  const [isBridging, setIsBridging] = useState(false);
  
  // Cross-chain states
  const [sourceChain, setSourceChain] = useState<string>("solana");
  const [targetChain, setTargetChain] = useState<string>("cosmic");
  
  // Swap states
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  
  // Liquidity states
  const [tokenA, setTokenA] = useState<string>('');
  const [tokenB, setTokenB] = useState<string>('');
  const [amountA, setAmountA] = useState<string>('');
  const [amountB, setAmountB] = useState<string>('');
  const [lpTokenAmount, setLpTokenAmount] = useState<string>('');
  
  // Token mint states
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenSupply, setTokenSupply] = useState<string>('');
  const [tokenDecimals, setTokenDecimals] = useState<string>('9');
  
  // Bridge states
  const [bridgeAmount, setBridgeAmount] = useState<string>('');
  const [bridgeToken, setBridgeToken] = useState<string>('');
  const [bridgeEstimatedTime, setBridgeEstimatedTime] = useState<number | null>(null);
  
  // Chain options
  const chainOptions = [
    { id: "solana", name: "Solana", logo: "solana-logo.png" },
    { id: "ethereum", name: "Ethereum", logo: "eth-logo.png" },
    { id: "binance", name: "Binance Smart Chain", logo: "bnb-logo.png" },
    { id: "cosmic", name: "Cosmic Marble", logo: "cmx-logo.png" },
  ];
  
  // Fetch token pairs
  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const pairs = await getTokenPairs();
        if (pairs.length > 0 && !selectedPair) {
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
  }, [toast, selectedPair]);
  
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
      
      const success = await swapTokens(fromToken, toToken, parseFloat(fromAmount));
      
      if (success) {
        toast({
          title: "Swap Successful",
          description: `Swapped ${fromAmount} ${swapDirection === 'base_to_quote' 
            ? selectedPair.baseToken.symbol 
            : selectedPair.quoteToken.symbol} to ${toAmount} ${swapDirection === 'base_to_quote' 
            ? selectedPair.quoteToken.symbol 
            : selectedPair.baseToken.symbol}`,
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
  
  const handleAddLiquidity = async () => {
    if (!isWalletConnected || !tokenA || !tokenB || !amountA || !amountB) {
      return;
    }
    
    setIsAddingLiquidity(true);
    
    try {
      const success = await addTokenLiquidity(
        tokenA,
        tokenB,
        parseFloat(amountA),
        parseFloat(amountB)
      );
      
      if (success) {
        toast({
          title: "Liquidity Added",
          description: `Added ${amountA} and ${amountB} to the liquidity pool`,
        });
        
        // Reset form
        setAmountA('');
        setAmountB('');
      } else {
        toast({
          title: "Failed to Add Liquidity",
          description: "Transaction failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding liquidity:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding liquidity",
        variant: "destructive",
      });
    } finally {
      setIsAddingLiquidity(false);
    }
  };
  
  const handleRemoveLiquidity = async () => {
    if (!isWalletConnected || !tokenA || !tokenB || !lpTokenAmount) {
      return;
    }
    
    setIsRemovingLiquidity(true);
    
    try {
      const success = await removeTokenLiquidity(
        tokenA,
        tokenB,
        parseFloat(lpTokenAmount)
      );
      
      if (success) {
        toast({
          title: "Liquidity Removed",
          description: `Removed ${lpTokenAmount} LP tokens from the pool`,
        });
        
        // Reset form
        setLpTokenAmount('');
      } else {
        toast({
          title: "Failed to Remove Liquidity",
          description: "Transaction failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing liquidity:", error);
      toast({
        title: "Error",
        description: "An error occurred while removing liquidity",
        variant: "destructive",
      });
    } finally {
      setIsRemovingLiquidity(false);
    }
  };
  
  const handleMintToken = async () => {
    if (
      !isWalletConnected || 
      !tokenName || 
      !tokenSymbol || 
      !tokenSupply || 
      parseFloat(tokenSupply) <= 0
    ) {
      return;
    }
    
    setIsMintingToken(true);
    
    try {
      const success = await createToken(
        tokenName,
        tokenSymbol,
        parseFloat(tokenSupply),
        parseInt(tokenDecimals)
      );
      
      if (success) {
        toast({
          title: "Token Created",
          description: `Successfully created ${tokenSupply} ${tokenSymbol} tokens`,
        });
        
        // Reset form
        setTokenName('');
        setTokenSymbol('');
        setTokenSupply('');
        setTokenDecimals('9');
      } else {
        toast({
          title: "Token Creation Failed",
          description: "Failed to mint new tokens. Make sure you have enough CMX.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error minting token:", error);
      toast({
        title: "Error",
        description: "An error occurred during token creation",
        variant: "destructive",
      });
    } finally {
      setIsMintingToken(false);
    }
  };
  
  const handleBridgeToken = async () => {
    if (
      !isWalletConnected || 
      !bridgeToken || 
      !bridgeAmount || 
      parseFloat(bridgeAmount) <= 0 ||
      sourceChain === targetChain
    ) {
      return;
    }
    
    setIsBridging(true);
    
    try {
      const result = await bridgeToken(
        walletAddress || '',
        sourceChain,
        targetChain,
        bridgeToken,
        parseFloat(bridgeAmount)
      );
      
      if (result.success) {
        setBridgeEstimatedTime(result.estimatedTimeMinutes || 15);
        
        toast({
          title: "Bridge Initiated",
          description: `Bridging ${bridgeAmount} tokens from ${sourceChain} to ${targetChain}`,
        });
      } else {
        toast({
          title: "Bridge Failed",
          description: "Failed to initiate bridge transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error bridging tokens:", error);
      toast({
        title: "Error",
        description: "An error occurred during the bridge operation",
        variant: "destructive",
      });
    } finally {
      setIsBridging(false);
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-zinc-50">Multi-Chain Exchange</CardTitle>
            <Badge className="bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/30">
              Cross-Chain
            </Badge>
          </div>
          <CardDescription className="text-zinc-400">
            Swap tokens across Solana, Ethereum, Binance, and Cosmic Marble networks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="swap" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4 bg-cosmic-slate/30">
              <TabsTrigger value="swap">Swap</TabsTrigger>
              <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
              <TabsTrigger value="bridge">Bridge</TabsTrigger>
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
                        <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                          <span>24h Change:</span>
                          <span className={selectedPair.priceChange24h >= 0 ? "text-green-400" : "text-red-400"}>
                            {selectedPair.priceChange24h >= 0 ? "+" : ""}{selectedPair.priceChange24h.toFixed(2)}%
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                          <span>24h Volume:</span>
                          <span>${selectedPair.volume24h.toLocaleString()}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                          <span>Liquidity:</span>
                          <span>${selectedPair.liquidity.toLocaleString()}</span>
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
            </TabsContent>
            
            <TabsContent value="liquidity" className="space-y-4 pt-4">
              {isWalletConnected ? (
                <div className="space-y-6">
                  <Tabs defaultValue="add" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-cosmic-slate/20">
                      <TabsTrigger value="add">Add Liquidity</TabsTrigger>
                      <TabsTrigger value="remove">Remove Liquidity</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="add" className="space-y-4 pt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs text-zinc-400">Token A</label>
                            <Select value={tokenA} onValueChange={setTokenA}>
                              <SelectTrigger className="bg-cosmic-slate/30 border-cosmic-purple/30">
                                <SelectValue placeholder="Select token" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTokens.map((token) => (
                                  <SelectItem key={token.address} value={token.address}>
                                    {token.symbol} ({token.chain})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs text-zinc-400">Amount A</label>
                            <Input
                              type="text"
                              value={amountA}
                              onChange={(e) => {
                                if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
                                  setAmountA(e.target.value);
                                }
                              }}
                              className="bg-cosmic-slate/30 border-cosmic-purple/30"
                              placeholder="0.0"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs text-zinc-400">Token B</label>
                            <Select value={tokenB} onValueChange={setTokenB}>
                              <SelectTrigger className="bg-cosmic-slate/30 border-cosmic-purple/30">
                                <SelectValue placeholder="Select token" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTokens.map((token) => (
                                  <SelectItem key={token.address} value={token.address}>
                                    {token.symbol} ({token.chain})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs text-zinc-400">Amount B</label>
                            <Input
                              type="text"
                              value={amountB}
                              onChange={(e) => {
                                if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
                                  setAmountB(e.target.value);
                                }
                              }}
                              className="bg-cosmic-slate/30 border-cosmic-purple/30"
                              placeholder="0.0"
                            />
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleAddLiquidity}
                          disabled={!tokenA || !tokenB || !amountA || !amountB || isAddingLiquidity}
                          className="w-full bg-gradient-to-r from-cosmic-blue to-cosmic-cyan hover:from-cosmic-blue/80 hover:to-cosmic-cyan/80"
                        >
                          {isAddingLiquidity ? "Processing..." : "Add Liquidity"}
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="remove" className="space-y-4 pt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs text-zinc-400">Token A</label>
                            <Select value={tokenA} onValueChange={setTokenA}>
                              <SelectTrigger className="bg-cosmic-slate/30 border-cosmic-purple/30">
                                <SelectValue placeholder="Select token" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTokens.map((token) => (
                                  <SelectItem key={token.address} value={token.address}>
                                    {token.symbol} ({token.chain})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs text-zinc-400">Token B</label>
                            <Select value={tokenB} onValueChange={setTokenB}>
                              <SelectTrigger className="bg-cosmic-slate/30 border-cosmic-purple/30">
                                <SelectValue placeholder="Select token" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTokens.map((token) => (
                                  <SelectItem key={token.address} value={token.address}>
                                    {token.symbol} ({token.chain})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs text-zinc-400">LP Token Amount</label>
                          <Input
                            type="text"
                            value={lpTokenAmount}
                            onChange={(e) => {
                              if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
                                setLpTokenAmount(e.target.value);
                              }
                            }}
                            className="bg-cosmic-slate/30 border-cosmic-purple/30"
                            placeholder="0.0"
                          />
                        </div>
                        
                        <Button
                          onClick={handleRemoveLiquidity}
                          disabled={!tokenA || !tokenB || !lpTokenAmount || isRemovingLiquidity}
                          className="w-full bg-gradient-to-r from-cosmic-blue to-cosmic-cyan hover:from-cosmic-blue/80 hover:to-cosmic-cyan/80"
                        >
                          {isRemovingLiquidity ? "Processing..." : "Remove Liquidity"}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <div className="text-center text-zinc-400">
                    <Wallet className="mx-auto h-10 w-10 mb-2 text-cosmic-purple/70" />
                    <p>Connect your wallet to manage liquidity</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bridge" className="space-y-4 pt-4">
              {isWalletConnected ? (
                <>
                  {bridgeEstimatedTime ? (
                    <div className="p-4 rounded-lg bg-cosmic-slate/20 text-center">
                      <h3 className="text-lg font-medium text-cosmic-cyan mb-2">Bridge Initiated!</h3>
                      <p className="text-zinc-300 mb-4">Your tokens are on the way</p>
                      <div className="flex justify-center items-center space-x-2 text-cosmic-purple">
                        <Badge variant="outline" className="px-3 py-1">
                          Estimated time: {bridgeEstimatedTime} minutes
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setBridgeEstimatedTime(null)}
                      >
                        Bridge More Tokens
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-zinc-400">Source Chain</label>
                          <Select value={sourceChain} onValueChange={setSourceChain}>
                            <SelectTrigger className="bg-cosmic-slate/30 border-cosmic-purple/30">
                              <SelectValue placeholder="Select source chain" />
                            </SelectTrigger>
                            <SelectContent>
                              {chainOptions.map((chain) => (
                                <SelectItem key={chain.id} value={chain.id}>
                                  {chain.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs text-zinc-400">Target Chain</label>
                          <Select value={targetChain} onValueChange={setTargetChain}>
                            <SelectTrigger className="bg-cosmic-slate/30 border-cosmic-purple/30">
                              <SelectValue placeholder="Select target chain" />
                            </SelectTrigger>
                            <SelectContent>
                              {chainOptions.map((chain) => (
                                <SelectItem key={chain.id} value={chain.id}>
                                  {chain.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400">Token</label>
                        <Select value={bridgeToken} onValueChange={setBridgeToken}>
                          <SelectTrigger className="bg-cosmic-slate/30 border-cosmic-purple/30">
                            <SelectValue placeholder="Select token" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTokens
                              .filter(token => token.chain === sourceChain)
                              .map((token) => (
                                <SelectItem key={token.address} value={token.address}>
                                  {token.symbol} ({token.name})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400">Amount</label>
                        <Input
                          type="text"
                          value={bridgeAmount}
                          onChange={(e) => {
                            if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
                              setBridgeAmount(e.target.value);
                            }
                          }}
                          className="bg-cosmic-slate/30 border-cosmic-purple/30"
                          placeholder="0.0"
                        />
                      </div>
                      
                      {sourceChain === targetChain && (
                        <div className="p-2 rounded bg-cosmic-red/20 text-cosmic-red text-sm">
                          Source and target chains must be different
                        </div>
                      )}
                      
                      <Button
                        onClick={handleBridgeToken}
                        disabled={
                          !bridgeToken || 
                          !bridgeAmount || 
                          parseFloat(bridgeAmount) <= 0 || 
                          sourceChain === targetChain || 
                          isBridging
                        }
                        className="w-full bg-gradient-to-r from-cosmic-blue to-cosmic-cyan hover:from-cosmic-blue/80 hover:to-cosmic-cyan/80"
                      >
                        {isBridging ? "Processing..." : "Bridge Tokens"}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <div className="text-center text-zinc-400">
                    <Wallet className="mx-auto h-10 w-10 mb-2 text-cosmic-purple/70" />
                    <p>Connect your wallet to bridge tokens</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="mint" className="space-y-4 pt-4">
              {isWalletConnected ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-cosmic-slate/20">
                    <p className="text-xs text-zinc-400">
                      Create your own token on the Cosmic Marble Network. This requires <span className="text-cosmic-cyan font-medium">100 CMX</span> tokens.
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Your CMX Balance:</span>
                      <span className="font-medium text-cosmic-cyan">{cmxBalance.toFixed(2)} CMX</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Token Name</label>
                      <Input
                        type="text"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        className="bg-cosmic-slate/30 border-cosmic-purple/30"
                        placeholder="My Token"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Token Symbol</label>
                      <Input
                        type="text"
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                        className="bg-cosmic-slate/30 border-cosmic-purple/30"
                        placeholder="TKN"
                        maxLength={5}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Initial Supply</label>
                      <Input
                        type="text"
                        value={tokenSupply}
                        onChange={(e) => {
                          if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
                            setTokenSupply(e.target.value);
                          }
                        }}
                        className="bg-cosmic-slate/30 border-cosmic-purple/30"
                        placeholder="1000000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Decimals</label>
                      <Select value={tokenDecimals} onValueChange={setTokenDecimals}>
                        <SelectTrigger className="bg-cosmic-slate/30 border-cosmic-purple/30">
                          <SelectValue placeholder="Decimal places" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="9">9 (Recommended)</SelectItem>
                          <SelectItem value="18">18</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleMintToken}
                    disabled={
                      !tokenName || 
                      !tokenSymbol || 
                      !tokenSupply || 
                      parseFloat(tokenSupply) <= 0 || 
                      cmxBalance < 100 || 
                      isMintingToken
                    }
                    className="w-full bg-gradient-to-r from-cosmic-blue to-cosmic-cyan hover:from-cosmic-blue/80 hover:to-cosmic-cyan/80"
                  >
                    {isMintingToken ? "Processing..." : "Create Token (100 CMX)"}
                  </Button>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <div className="text-center text-zinc-400">
                    <Wallet className="mx-auto h-10 w-10 mb-2 text-cosmic-purple/70" />
                    <p>Connect your wallet to mint tokens</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-cosmic-black/30 pt-2">
          {selectedTab === "swap" && (
            <Button
              onClick={handleSwap}
              disabled={!isWalletConnected || !selectedPair || !fromAmount || parseFloat(fromAmount) <= 0 || isSwapping}
              className="w-full bg-gradient-to-r from-cosmic-blue to-cosmic-cyan hover:from-cosmic-blue/80 hover:to-cosmic-cyan/80"
            >
              {isSwapping ? "Processing..." : "Swap Tokens"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TokenExchange;
