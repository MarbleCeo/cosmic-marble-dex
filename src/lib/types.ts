
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

// DEX related types
export interface TokenPair {
  baseToken: Token;
  quoteToken: Token;
  pairAddress: string;
  liquidity: number;
  volume24h: number;
  priceChange24h: number;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  price: number;
  chain: 'solana' | 'ethereum' | 'binance' | 'cosmic';
}

export interface TradeOrder {
  id: string;
  type: 'buy' | 'sell';
  tokenPair: string;
  amount: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: number;
}

export interface LiquidityPool {
  id: string;
  tokenA: Token;
  tokenB: Token;
  amountA: number;
  amountB: number;
  totalSupply: number;
  apy: number;
}

export interface MintDetails {
  symbol: string;
  name: string;
  initialSupply: number;
  decimals: number;
  description: string;
  logoUrl?: string;
}

export interface CrossChainBridge {
  sourceChain: string;
  targetChain: string;
  sourceToken: string;
  targetToken: string;
  fee: number;
  minAmount: number;
  maxAmount: number;
  estimatedTime: string;
}
