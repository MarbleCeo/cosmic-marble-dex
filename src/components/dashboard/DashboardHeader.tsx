
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlockchain } from "@/contexts/BlockchainContext";

const DashboardHeader = () => {
  const { 
    isWalletConnected, 
    walletAddress, 
    connectWallet, 
    disconnectWallet,
    cmxBalance,
    cecleBalance,
    marbleBalance
  } = useBlockchain();

  return (
    <header className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50 md:text-3xl">
          Cosmic Marble <span className="text-cosmic-purple">Nexus</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Multi-chain ecosystem with VMIA (Proof of Host) for Docker rentals
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        {isWalletConnected ? (
          <>
            <div className="hidden flex-col items-end space-y-1 md:flex">
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-cosmic-fuchsia/20 text-cosmic-fuchsia border-cosmic-fuchsia/30">
                  <span>{cmxBalance.toFixed(2)} CMX</span>
                </Badge>
                <Badge variant="default" className="bg-blockchain-solana/20 text-blockchain-solana border-blockchain-solana/30">
                  <span>{cecleBalance.toFixed(2)} CECLE</span>
                </Badge>
                <Badge variant="default" className="bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/30">
                  <span>{marbleBalance.toFixed(2)} MARBLE</span>
                </Badge>
              </div>
              <div className="flex items-center text-xs text-zinc-400">
                <span className="mr-1">Wallet:</span>
                <code className="text-zinc-300">
                  {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : ""}
                </code>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnectWallet}
              className="border-cosmic-purple/30 bg-cosmic-purple/10 text-cosmic-purple hover:bg-cosmic-purple/20"
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            onClick={connectWallet}
            className="bg-gradient-to-r from-cosmic-purple to-cosmic-indigo hover:from-cosmic-purple/90 hover:to-cosmic-indigo/90"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;

