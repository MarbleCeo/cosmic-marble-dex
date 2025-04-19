
// Added React, react-router-dom imports and fixed Badge typings.
import * as React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardHeader from "./DashboardHeader";
import SolanaWallet from "../solana/SolanaWallet";
import CollateralLock from "../collateral/CollateralLock";
import DockerRental from "../vmia/DockerRental";
import MultiChainStats from "../blockchain/MultiChainStats";
import TokenExchange from "../dex/TokenExchange";
import { useBlockchain } from "@/contexts/BlockchainContext";

const Dashboard = () => {
  const { 
    isWalletConnected, 
    walletAddress, 
    connectWallet,
    disconnectWallet,
    cecleBalance,
    marbleBalance
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
          <TabsList className="grid w-full grid-cols-5 bg-cosmic-slate/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="collateral">Collateral</TabsTrigger>
            <TabsTrigger value="vmia">VMIA (PoH)</TabsTrigger>
            <TabsTrigger value="dex">DEX</TabsTrigger>
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
              <div className="space-y-4">
                <MultiChainStats />
                <div className="flex justify-center pt-4">
                  <Link to="/dex">
                    <Button className="bg-gradient-to-r from-cosmic-blue to-cosmic-cyan hover:from-cosmic-blue/80 hover:to-cosmic-cyan/80">
                      <span className="mr-2">🔄</span> Open DEX
                    </Button>
                  </Link>
                </div>
              </div>
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
              <h2 className="mb-4 text-xl font-semibold text-zinc-50">Token Collateral System</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-lg bg-cosmic-slate/20 p-4">
                    <div className="mb-2 flex items-center">
                      <Badge className="mr-2 bg-blockchain-solana/20 text-blockchain-solana border-blockchain-solana/30">Solana</Badge>
                      <h3 className="font-medium text-zinc-50">CECLE Token</h3>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">
                      Lock CECLE tokens from Solana (5vmiteBPb7SYj4s1HmNFbb3kWSuaUu4waENx4vSQDmbs) to earn 5% CMX rewards.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-zinc-400">Token Address:</div>
                      <div className="overflow-hidden text-ellipsis font-mono text-zinc-300">5vmiteBPb7SYj4s1HmNFbb3kWSuaUu4waENx4vSQDmbs</div>
                      <div className="text-zinc-400">Reward Rate:</div>
                      <div className="text-cosmic-cyan">5% in CMX</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-lg bg-cosmic-slate/20 p-4">
                    <div className="mb-2 flex items-center">
                      <Badge className="mr-2 bg-blockchain-solana/20 text-blockchain-solana border-blockchain-solana/30">Solana</Badge>
                      <h3 className="font-medium text-zinc-50">MARBLE Token</h3>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">
                      Lock MARBLE tokens from Solana (B9NYKkHRa1VfgWeKXTiGLaBz7V1URQSGnaEPb4gGFsXA) to earn 8% CMX rewards.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-zinc-400">Token Address:</div>
                      <div className="overflow-hidden text-ellipsis font-mono text-zinc-300">B9NYKkHRa1VfgWeKXTiGLaBz7V1URQSGnaEPb4gGFsXA</div>
                      <div className="text-zinc-400">Reward Rate:</div>
                      <div className="text-cosmic-fuchsia">8% in CMX</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <h3 className="font-medium text-cosmic-cyan">Collateral Benefits</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-zinc-300">Enhanced Yield</h4>
                    <p className="text-sm text-zinc-400">Lock tokens to earn additional CMX rewards</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-zinc-300">Governance Rights</h4>
                    <p className="text-sm text-zinc-400">Participate in ecosystem decisions</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-zinc-300">Priority Access</h4>
                    <p className="text-sm text-zinc-400">Get first access to new features and services</p>
                  </div>
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
          
          <TabsContent value="dex" className="space-y-6">
            <TokenExchange />
            <div className="rounded-lg border border-cosmic-purple/20 bg-cosmic-black/30 p-6">
              <h2 className="mb-4 text-xl font-semibold text-zinc-50">Cosmic DEX</h2>
              <p className="mb-4 text-zinc-400">
                The Cosmic DEX allows users to swap tokens across multiple chains, provide liquidity to earn fees,
                and mint their own tokens using CMX.
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-medium text-cosmic-blue">Swap</h3>
                  <p className="text-sm text-zinc-400">Trade tokens across multiple blockchains</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-cosmic-blue">Provide Liquidity</h3>
                  <p className="text-sm text-zinc-400">Earn fees by providing liquidity to token pairs</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-cosmic-blue">Mint Tokens</h3>
                  <p className="text-sm text-zinc-400">Create your own tokens on the Cosmic Marble Network</p>
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
                <h2 className="mb-4 text-xl font-semibold text-zinc-50">Core Tokens</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-zinc-50">CECLE Token (Solana)</h3>
                    <p className="text-sm text-zinc-400 mb-2">
                      CECLE is a Solana SPL token that can be used as collateral within the ecosystem.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-zinc-400">Token Address:</div>
                      <div className="overflow-hidden text-ellipsis font-mono text-zinc-300">5vmiteBPb7SYj4s1HmNFbb3kWSuaUu4waENx4vSQDmbs</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-zinc-50">MARBLE Token (Solana)</h3>
                    <p className="text-sm text-zinc-400 mb-2">
                      MARBLE is a Solana SPL token that acts as a 1:1 pegged token for the Cosmic Marble blockchain.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-zinc-400">Token Address:</div>
                      <div className="overflow-hidden text-ellipsis font-mono text-zinc-300">B9NYKkHRa1VfgWeKXTiGLaBz7V1URQSGnaEPb4gGFsXA</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-zinc-50">CMX Token (Cosmic)</h3>
                    <p className="text-sm text-zinc-400 mb-2">
                      CMX is the native token of the Cosmic Marble blockchain used for gas fees, governance, and token minting.
                    </p>
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

