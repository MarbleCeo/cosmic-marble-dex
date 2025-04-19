
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { TokenPair, Token } from "@/lib/types";
import {
  CECLE_TOKEN_ADDRESS,
  MARBLE_TOKEN_ADDRESS,
  getTokenPairs,
  executeSwap,
  getSolanaBalance,
  getTokenBalance,
  mintToken,
} from "@/lib/blockchain-utils";

interface BlockchainContextType {
  walletAddress: string | null;
  isWalletConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;

  cecleBalance: number;
  marbleBalance: number;

  tokenPairs: TokenPair[];
  availableTokens: Token[];

  swapTokens: (fromToken: string, toToken: string, amount: number) => Promise<boolean>;
  createToken: (name: string, symbol: string, initialSupply: number, decimals: number) => Promise<boolean>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [cecleBalance, setCecleBalance] = useState(0);
  const [marbleBalance, setMarbleBalance] = useState(0);

  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);

  // Connect wallet mock (in prod replace with real wallet adapter)
  const connectWallet = () => {
    const mockAddress = "8ZHnPYJMxQJGVb4MjXXrKrE8Qeqy6AqTDkGqv9JRWCHG";
    setWalletAddress(mockAddress);
    setIsWalletConnected(true);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsWalletConnected(false);
  };

  // Load token pairs and tokens on wallet connect
  useEffect(() => {
    if (isWalletConnected) {
      (async () => {
        const pairs = await getTokenPairs();
        setTokenPairs(pairs);

        const tokensMap = new Map<string, Token>();
        pairs.forEach(pair => {
          tokensMap.set(pair.baseToken.address, pair.baseToken);
          tokensMap.set(pair.quoteToken.address, pair.quoteToken);
        });
        setAvailableTokens(Array.from(tokensMap.values()));

        // Fetch balances for CECLE and MARBLE tokens (assuming wallet connected)
        if (walletAddress) {
          const cecleBal = await getTokenBalance(walletAddress, CECLE_TOKEN_ADDRESS);
          setCecleBalance(cecleBal);

          const marbleBal = await getTokenBalance(walletAddress, MARBLE_TOKEN_ADDRESS);
          setMarbleBalance(marbleBal);
        }
      })();
    } else {
      setTokenPairs([]);
      setAvailableTokens([]);
      setCecleBalance(0);
      setMarbleBalance(0);
    }
  }, [isWalletConnected, walletAddress]);

  // Swap tokens on chain
  const swapTokens = async (fromToken: string, toToken: string, amount: number): Promise<boolean> => {
    if (!walletAddress) return false;

    try {
      const result = await executeSwap(walletAddress, fromToken, toToken, amount);
      if (result.success && result.receivedAmount) {
        // In real integration, update balances after transaction
        if (fromToken === CECLE_TOKEN_ADDRESS) setCecleBalance(prev => Math.max(0, prev - amount));
        if (toToken === CECLE_TOKEN_ADDRESS) setCecleBalance(prev => prev + result.receivedAmount);

        if (fromToken === MARBLE_TOKEN_ADDRESS) setMarbleBalance(prev => Math.max(0, prev - amount));
        if (toToken === MARBLE_TOKEN_ADDRESS) setMarbleBalance(prev => prev + result.receivedAmount);

        return true;
      }
      return false;
    } catch (error) {
      console.error("swapTokens error:", error);
      return false;
    }
  };

  const createToken = async (
    name: string,
    symbol: string,
    initialSupply: number,
    decimals: number
  ): Promise<boolean> => {
    if (!walletAddress) return false;

    try {
      // Mock fee payment and token creation
      const fee = 100;
      if (cecleBalance < fee) return false; // Insufficient funds

      const mintDetails = { name, symbol, initialSupply, decimals, description: `${name} token` };
      const result = await mintToken(walletAddress, mintDetails, fee);

      if (result.success) {
        // Deduct fee from user balance
        setCecleBalance(prev => Math.max(0, prev - fee));
        return true;
      }
      return false;
    } catch (error) {
      console.error("createToken error:", error);
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

    tokenPairs,
    availableTokens,

    swapTokens,
    createToken,
  };

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) throw new Error("useBlockchain must be used within BlockchainProvider");
  return context;
};
