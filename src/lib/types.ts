
// Blockchain related types
export interface SolanaWallet {
  publicKey: string;
  balance: number;
}

export interface CollateralAsset {
  tokenAddress: string;
  symbol: string;
  amount: number;
  usdValue: number;
  locked: boolean;
}

export interface DockerHost {
  id: string;
  name: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
  };
  status: 'online' | 'offline' | 'maintenance';
  earnings: number;
  uptime: number;
}

export interface BlockchainStats {
  chain: string;
  blockHeight: number;
  tps: number;
  validators: number;
  price: number;
  marketCap: number;
  change24h: number;
}
