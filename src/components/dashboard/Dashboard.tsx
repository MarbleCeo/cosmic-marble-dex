
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "./DashboardHeader";
import SolanaWallet from "../solana/SolanaWallet";
import CollateralLock from "../collateral/CollateralLock";
import DockerRental from "../vmia/DockerRental";
import MultiChainStats from "../blockchain/MultiChainStats";
import { useBlockchain } from "@/contexts/BlockchainContext";

const Dashboard = () => {
  const { 
    isWalletConnected, 
    walletAddress, 
    connectWallet,
    disconnectWallet,
    cecleBalance
  } = useBlockchain();
  
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cosmic-black to-cosmic-slate/90 text-zinc-50">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/4 top-1/5 h-24 w-24 rounded-full bg-cosmic-purple opacity-20 blur-3xl cosmic-pulse"></div>
        <div className="absolute right-1/3 top-1/4 h-32 w-32 rounded-full bg-cosmic-blue opacity-20 blur-3xl cosmic-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 h-36 w-36 rounded-full bg-cosmic-cyan opacity-10 blur-3xl cosmic-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 h-28 w-28 rounded-full bg-cosmic-violet opacity-15 blur-3xl cosmic-pulse"></div>
      </div>
      <div className="container relative z-10 mx-auto max-w-6xl px-4 py-8">
        <DashboardHeader />
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-cosmic-slate/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="collateral">Collateral</TabsTrigger>
            <TabsTrigger value="vmia">VMIA (PoH)</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchains</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <SolanaWallet 
                walletAddress={walletAddress || undefined} 
                onConnect={isWalletConnected ? disconnectWallet : connectWallet} 
              />
              <CollateralLock
                isWalletConnected={isWalletConnected}
                cecleBalance={cecleBalance}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <DockerRental />
              <MultiChainStats />
            </div>
          </TabsContent>
          
          <TabsContent value="collateral" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <SolanaWallet 
                walletAddress={walletAddress || undefined} 
                onConnect={isWalletConnected ? disconnectWallet : connectWallet} 
              />
              <CollateralLock
                isWalletConnected={isWalletConnected}
                cecleBalance={cecleBalance}
              />
            </div>
            <div className="rounded-lg border border-cosmic-purple/20 bg-cosmic-black/30 p-6">
              <h2 className="mb-4 text-xl font-semibold text-zinc-50">Collateral Benefits</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-medium text-cosmic-cyan">Enhanced Yield</h3>
                  <p className="text-sm text-zinc-400">Lock CECLE tokens to earn additional CMX rewards</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-cosmic-cyan">Governance Rights</h3>
                  <p className="text-sm text-zinc-400">Participate in ecosystem decisions</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-cosmic-cyan">Priority Access</h3>
                  <p className="text-sm text-zinc-400">Get first access to new features and services</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="vmia" className="space-y-6">
            <DockerRental />
            <div className="rounded-lg border border-cosmic-purple/20 bg-cosmic-black/30 p-6">
              <h2 className="mb-4 text-xl font-semibold text-zinc-50">VMIA: Proof of Host</h2>
              <p className="mb-4 text-zinc-400">
                VMIA (Verification of Machine Intelligence Allocation) is a Proof of Host consensus mechanism
                that allows Docker machine owners to earn CMX tokens by providing computing resources
                to the Cosmic Marble Network.
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-medium text-cosmic-fuchsia">Register</h3>
                  <p className="text-sm text-zinc-400">Connect your Docker machine to the network</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-cosmic-fuchsia">Validate</h3>
                  <p className="text-sm text-zinc-400">Contribute computing power and storage</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-cosmic-fuchsia">Earn</h3>
                  <p className="text-sm text-zinc-400">Receive CMX tokens for your contributions</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="blockchain" className="space-y-6">
            <MultiChainStats />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-cosmic-purple/20 bg-cosmic-black/30 p-6">
                <h2 className="mb-4 text-xl font-semibold text-zinc-50">Cross-Chain Integration</h2>
                <p className="text-zinc-400">
                  The Cosmic Marble Nexus bridges multiple blockchains, allowing for seamless
                  asset transfer and cross-chain functionality.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge className="bg-blockchain-solana/20 text-blockchain-solana border-blockchain-solana/30">Solana</Badge>
                  <Badge className="bg-blockchain-ethereum/20 text-blockchain-ethereum border-blockchain-ethereum/30">Ethereum</Badge>
                  <Badge className="bg-blockchain-binance/20 text-blockchain-binance border-blockchain-binance/30">Binance</Badge>
                  <Badge className="bg-blockchain-bitcoin/20 text-blockchain-bitcoin border-blockchain-bitcoin/30">Bitcoin</Badge>
                </div>
              </div>
              <div className="rounded-lg border border-cosmic-purple/20 bg-cosmic-black/30 p-6">
                <h2 className="mb-4 text-xl font-semibold text-zinc-50">CECLE Token</h2>
                <p className="text-zinc-400">
                  CECLE is the native token on Solana with address: 5vmiteBPb7SYj4s1HmNFbb3kWSuaUu4waENx4vSQDmbs.
                  It can be used as collateral within the ecosystem.
                </p>
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-zinc-400">Token Address:</div>
                    <div className="overflow-hidden text-ellipsis font-mono text-zinc-300">5vmiteBPb7SYj4s1HmNFbb3kWSuaUu4waENx4vSQDmbs</div>
                    <div className="text-zinc-400">Network:</div>
                    <div className="text-zinc-300">Solana</div>
                    <div className="text-zinc-400">Standard:</div>
                    <div className="text-zinc-300">SPL Token</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
