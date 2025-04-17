
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SolanaWalletProps {
  walletAddress?: string;
  onConnect: () => void;
}

const SolanaWallet = ({ walletAddress, onConnect }: SolanaWalletProps) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate fetching balance
  useEffect(() => {
    if (walletAddress) {
      setIsLoading(true);
      // In a real app, this would be a call to Solana RPC
      setTimeout(() => {
        setBalance(Math.random() * 10);
        setIsLoading(false);
      }, 1000);
    }
  }, [walletAddress]);

  return (
    <Card className="overflow-hidden border-2 border-cosmic-purple/20 bg-gradient-to-br from-cosmic-black/80 to-cosmic-slate/90">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-zinc-50">Solana Wallet</span>
          <Badge variant="outline" className="bg-blockchain-solana/10 text-blockchain-solana border-blockchain-solana/30">
            Solana
          </Badge>
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Connect your wallet to interact with CECLE
        </CardDescription>
      </CardHeader>
      <CardContent>
        {walletAddress ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Address</span>
              <code className="rounded bg-zinc-800/50 px-2 py-1 text-xs text-zinc-300">
                {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Balance</span>
              {isLoading ? (
                <div className="h-5 w-20 animate-pulse rounded bg-zinc-800/50"></div>
              ) : (
                <span className="font-mono text-sm text-zinc-300">{balance?.toFixed(4)} SOL</span>
              )}
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-zinc-400">
            <p>No wallet connected</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-cosmic-black/30 pt-2">
        <Button 
          onClick={onConnect} 
          className="w-full bg-gradient-to-r from-blockchain-solana to-cosmic-violet hover:from-blockchain-solana/80 hover:to-cosmic-violet/80"
        >
          {walletAddress ? 'Disconnect' : 'Connect Wallet'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SolanaWallet;
