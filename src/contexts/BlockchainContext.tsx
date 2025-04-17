
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { CollateralAsset, DockerHost, TokenPair, Token, LiquidityPool } from "@/lib/types";
import { 
  CECLE_TOKEN_ADDRESS, 
  MARBLE_TOKEN_ADDRESS,
  lockToken, 
  unlockToken, 
  getTokenPairs,
  executeSwap,
  addLiquidity,
  removeLiquidity,
  mintToken
} from "@/lib/blockchain-utils";

interface BlockchainContextType {
  // Wallet states
  walletAddress: string | null;
  isWalletConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  
  // Solana/CECLE states
  cecleBalance: number;
  marbleBalance: number;
  collateralAssets: CollateralAsset[];
  lockCollateral: (asset: string, amount: number) => Promise<boolean>;
  unlockCollateral: (asset: string, amount: number) => Promise<boolean>;
  
  // VMIA (Proof of Host) states
  dockerHosts: DockerHost[];
  myDockerHosts: DockerHost[];
  rentDockerHost: (hostId: string, duration: number) => Promise<boolean>;
  registerDockerHost: (hostSpecs: Partial<DockerHost>) => Promise<boolean>;
  
  // CMX token states
  cmxBalance: number;
  cmxEarnings: number;
  claimCmxEarnings: () => Promise<boolean>;
  
  // DEX states
  tokenPairs: TokenPair[];
  availableTokens: Token[];
  liquidityPools: LiquidityPool[];
  swapTokens: (fromToken: string, toToken: string, amount: number) => Promise<boolean>;
  addTokenLiquidity: (tokenA: string, tokenB: string, amountA: number, amountB: number) => Promise<boolean>;
  removeTokenLiquidity: (tokenA: string, tokenB: string, lpTokens: number) => Promise<boolean>;
  createToken: (name: string, symbol: string, initialSupply: number, decimals: number) => Promise<boolean>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  // Wallet states
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // Solana/Token states
  const [cecleBalance, setCecleBalance] = useState(1000); // Mock balance
  const [marbleBalance, setMarbleBalance] = useState(500); // Mock balance
  const [collateralAssets, setCollateralAssets] = useState<CollateralAsset[]>([
    {
      tokenAddress: CECLE_TOKEN_ADDRESS,
      symbol: "CECLE",
      amount: 0,
      usdValue: 0,
      locked: false
    },
    {
      tokenAddress: MARBLE_TOKEN_ADDRESS,
      symbol: "MARBLE",
      amount: 0,
      usdValue: 0,
      locked: false
    }
  ]);
  
  // VMIA states
  const [dockerHosts, setDockerHosts] = useState<DockerHost[]>([
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
  ]);
  const [myDockerHosts, setMyDockerHosts] = useState<DockerHost[]>([]);
  
  // CMX token states
  const [cmxBalance, setCmxBalance] = useState(0);
  const [cmxEarnings, setCmxEarnings] = useState(0);
  
  // DEX states
  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);
  
  // Load initial data
  useEffect(() => {
    if (isWalletConnected) {
      const loadDexData = async () => {
        try {
          const pairs = await getTokenPairs();
          setTokenPairs(pairs);
          
          // Extract unique tokens from pairs
          const tokens = new Map<string, Token>();
          pairs.forEach(pair => {
            tokens.set(pair.baseToken.address, pair.baseToken);
            tokens.set(pair.quoteToken.address, pair.quoteToken);
          });
          setAvailableTokens(Array.from(tokens.values()));
          
          // Mock liquidity pools
          const pools: LiquidityPool[] = [];
          pairs.forEach(pair => {
            pools.push({
              id: `pool-${pair.pairAddress}`,
              tokenA: pair.baseToken,
              tokenB: pair.quoteToken,
              amountA: pair.liquidity / pair.baseToken.price,
              amountB: pair.liquidity / pair.quoteToken.price,
              totalSupply: Math.sqrt(pair.liquidity),
              apy: 10 + Math.random() * 20 // 10-30% APY
            });
          });
          setLiquidityPools(pools);
        } catch (error) {
          console.error("Error loading DEX data:", error);
        }
      };
      
      loadDexData();
    }
  }, [isWalletConnected]);
  
  // Wallet functions
  const connectWallet = () => {
    // In production, this would be integrated with actual Solana wallet adapter
    const mockAddress = "8ZHnPYJMxQJGVb4MjXXrKrE8Qeqy6AqTDkGqv9JRWCHG";
    setWalletAddress(mockAddress);
    setIsWalletConnected(true);
    // In production, we would fetch actual balances here
  };
  
  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsWalletConnected(false);
  };
  
  // Collateral functions
  const lockCollateral = async (asset: string, amount: number): Promise<boolean> => {
    // In production, this would call an actual blockchain transaction
    if (!walletAddress) return false;
    
    try {
      const result = await lockToken(walletAddress, asset, amount);
      
      if (result.success) {
        // Update collateral assets
        setCollateralAssets(assets => 
          assets.map(a => 
            a.tokenAddress === asset 
              ? { ...a, amount: a.amount + amount, locked: true, usdValue: a.usdValue + (amount * 0.12) } 
              : a
          )
        );
        
        // Update token balance
        if (asset === CECLE_TOKEN_ADDRESS) {
          setCecleBalance(prev => prev - amount);
        } else if (asset === MARBLE_TOKEN_ADDRESS) {
          setMarbleBalance(prev => prev - amount);
        }
        
        // Add CMX rewards if any
        if (result.cmxRewards) {
          setCmxEarnings(prev => prev + result.cmxRewards);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error locking collateral:", error);
      return false;
    }
  };
  
  const unlockCollateral = async (asset: string, amount: number): Promise<boolean> => {
    // In production, this would call an actual blockchain transaction
    if (!walletAddress) return false;
    
    try {
      const result = await unlockToken(walletAddress, asset, amount);
      
      if (result.success) {
        // Update collateral assets
        setCollateralAssets(assets => 
          assets.map(a => {
            if (a.tokenAddress === asset) {
              const newAmount = Math.max(0, a.amount - amount);
              return { 
                ...a, 
                amount: newAmount,
                locked: newAmount > 0,
                usdValue: Math.max(0, a.usdValue - (amount * 0.12))
              };
            }
            return a;
          })
        );
        
        // Update token balance
        if (asset === CECLE_TOKEN_ADDRESS) {
          setCecleBalance(prev => prev + amount);
        } else if (asset === MARBLE_TOKEN_ADDRESS) {
          setMarbleBalance(prev => prev + amount);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error unlocking collateral:", error);
      return false;
    }
  };
  
  // Docker host functions
  const rentDockerHost = async (hostId: string, duration: number): Promise<boolean> => {
    // In production, this would call an actual blockchain transaction
    try {
      // Update docker hosts list (mark as rented)
      // Update CMX balance
      return true;
    } catch (error) {
      console.error("Error renting docker host:", error);
      return false;
    }
  };
  
  const registerDockerHost = async (hostSpecs: Partial<DockerHost>): Promise<boolean> => {
    // In production, this would call an actual blockchain transaction
    try {
      const newHost: DockerHost = {
        id: `host-${Date.now()}`,
        name: hostSpecs.name || "Unnamed Host",
        specs: hostSpecs.specs || {
          cpu: "Unknown",
          ram: "Unknown",
          storage: "Unknown",
          bandwidth: "Unknown"
        },
        status: "offline",
        earnings: 0,
        uptime: 0
      };
      
      setMyDockerHosts(prev => [...prev, newHost]);
      return true;
    } catch (error) {
      console.error("Error registering docker host:", error);
      return false;
    }
  };
  
  // CMX token functions
  const claimCmxEarnings = async (): Promise<boolean> => {
    // In production, this would call an actual blockchain transaction
    try {
      setCmxBalance(prev => prev + cmxEarnings);
      setCmxEarnings(0);
      return true;
    } catch (error) {
      console.error("Error claiming CMX earnings:", error);
      return false;
    }
  };
  
  // DEX functions
  const swapTokens = async (fromToken: string, toToken: string, amount: number): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      const result = await executeSwap(walletAddress, fromToken, toToken, amount);
      
      if (result.success && result.receivedAmount) {
        // Update balances based on the tokens involved
        if (fromToken === CECLE_TOKEN_ADDRESS) {
          setCecleBalance(prev => prev - amount);
        } else if (fromToken === MARBLE_TOKEN_ADDRESS) {
          setMarbleBalance(prev => prev - amount);
        } else if (fromToken === "cmx-token-address") {
          setCmxBalance(prev => prev - amount);
        }
        
        if (toToken === CECLE_TOKEN_ADDRESS) {
          setCecleBalance(prev => prev + result.receivedAmount);
        } else if (toToken === MARBLE_TOKEN_ADDRESS) {
          setMarbleBalance(prev => prev + result.receivedAmount);
        } else if (toToken === "cmx-token-address") {
          setCmxBalance(prev => prev + result.receivedAmount);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error swapping tokens:", error);
      return false;
    }
  };
  
  const addTokenLiquidity = async (tokenA: string, tokenB: string, amountA: number, amountB: number): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      const result = await addLiquidity(walletAddress, tokenA, tokenB, amountA, amountB);
      
      if (result.success) {
        // Update token balances
        if (tokenA === CECLE_TOKEN_ADDRESS) {
          setCecleBalance(prev => prev - amountA);
        } else if (tokenA === MARBLE_TOKEN_ADDRESS) {
          setMarbleBalance(prev => prev - amountA);
        }
        
        if (tokenB === CECLE_TOKEN_ADDRESS) {
          setCecleBalance(prev => prev - amountB);
        } else if (tokenB === MARBLE_TOKEN_ADDRESS) {
          setMarbleBalance(prev => prev - amountB);
        }
        
        // Update liquidity pools (in a real app this would come from the blockchain)
        // This is just a mock update
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error adding liquidity:", error);
      return false;
    }
  };
  
  const removeTokenLiquidity = async (tokenA: string, tokenB: string, lpTokens: number): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      const result = await removeLiquidity(walletAddress, tokenA, tokenB, lpTokens);
      
      if (result.success && result.amountA && result.amountB) {
        // Update token balances
        if (tokenA === CECLE_TOKEN_ADDRESS) {
          setCecleBalance(prev => prev + result.amountA!);
        } else if (tokenA === MARBLE_TOKEN_ADDRESS) {
          setMarbleBalance(prev => prev + result.amountA!);
        }
        
        if (tokenB === CECLE_TOKEN_ADDRESS) {
          setCecleBalance(prev => prev + result.amountB!);
        } else if (tokenB === MARBLE_TOKEN_ADDRESS) {
          setMarbleBalance(prev => prev + result.amountB!);
        }
        
        // Update liquidity pools (in a real app this would come from the blockchain)
        // This is just a mock update
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error removing liquidity:", error);
      return false;
    }
  };
  
  const createToken = async (name: string, symbol: string, initialSupply: number, decimals: number): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      // In a real app, we would charge CMX for token creation
      const cmxFee = 100; // Mock fee
      
      if (cmxBalance < cmxFee) {
        return false;
      }
      
      const mintDetails = {
        name,
        symbol,
        initialSupply,
        decimals,
        description: `${name} token created on Cosmic Marble Network`
      };
      
      const result = await mintToken(walletAddress, mintDetails, cmxFee);
      
      if (result.success) {
        // Deduct CMX fee
        setCmxBalance(prev => prev - cmxFee);
        
        // In a real app, we would add the new token to the user's wallet
        // and update available tokens list
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error creating token:", error);
      return false;
    }
  };
  
  const value = {
    walletAddress,
    isWalletConnected,
    connectWallet,
    disconnectWallet,
    
    cecleBalance,
    marbleBalance,
    collateralAssets,
    lockCollateral,
    unlockCollateral,
    
    dockerHosts,
    myDockerHosts,
    rentDockerHost,
    registerDockerHost,
    
    cmxBalance,
    cmxEarnings,
    claimCmxEarnings,
    
    tokenPairs,
    availableTokens,
    liquidityPools,
    swapTokens,
    addTokenLiquidity,
    removeTokenLiquidity,
    createToken
  };
  
  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  
  return context;
};
