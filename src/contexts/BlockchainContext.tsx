
import { createContext, useState, useContext, ReactNode } from "react";
import { CollateralAsset, DockerHost } from "@/lib/types";

interface BlockchainContextType {
  // Wallet states
  walletAddress: string | null;
  isWalletConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  
  // Solana/CECLE states
  cecleBalance: number;
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
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  // Wallet states
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // Solana/CECLE states
  const [cecleBalance, setCecleBalance] = useState(100); // Mock balance
  const [collateralAssets, setCollateralAssets] = useState<CollateralAsset[]>([
    {
      tokenAddress: "5vmiteBPb7SYj4s1HmNFbb3kWSuaUu4waENx4vSQDmbs",
      symbol: "CECLE",
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
    // In production, this would call an actual Solana transaction
    try {
      setCollateralAssets(assets => 
        assets.map(a => 
          a.tokenAddress === asset 
            ? { ...a, amount: a.amount + amount, locked: true } 
            : a
        )
      );
      return true;
    } catch (error) {
      console.error("Error locking collateral:", error);
      return false;
    }
  };
  
  const unlockCollateral = async (asset: string, amount: number): Promise<boolean> => {
    // In production, this would call an actual Solana transaction
    try {
      setCollateralAssets(assets => 
        assets.map(a => {
          if (a.tokenAddress === asset) {
            const newAmount = Math.max(0, a.amount - amount);
            return { 
              ...a, 
              amount: newAmount,
              locked: newAmount > 0
            };
          }
          return a;
        })
      );
      return true;
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
  
  const value = {
    walletAddress,
    isWalletConnected,
    connectWallet,
    disconnectWallet,
    
    cecleBalance,
    collateralAssets,
    lockCollateral,
    unlockCollateral,
    
    dockerHosts,
    myDockerHosts,
    rentDockerHost,
    registerDockerHost,
    
    cmxBalance,
    cmxEarnings,
    claimCmxEarnings
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
