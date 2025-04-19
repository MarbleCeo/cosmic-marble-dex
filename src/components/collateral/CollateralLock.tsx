
// Added React imports and fixed Badge typings and imports
import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CECLE_TOKEN_ADDRESS, MARBLE_TOKEN_ADDRESS } from "@/lib/blockchain-utils";
import { useBlockchain } from "@/contexts/BlockchainContext";

interface CollateralLockProps {
  isWalletConnected: boolean;
  cecleBalance?: number;
}

const CollateralLock = ({ isWalletConnected }: CollateralLockProps) => {
  const { toast } = useToast();
  const { 
    cecleBalance,
    marbleBalance,
    collateralAssets,
    lockCollateral,
    unlockCollateral
  } = useBlockchain();
  
  const [selectedToken, setSelectedToken] = useState<'cecle' | 'marble'>('cecle');
  const [lockAmount, setLockAmount] = useState(0);
  const [unlockAmount, setUnlockAmount] = useState(0);
  const [isLocking, setIsLocking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  
  const cecleAsset = collateralAssets.find(a => a.tokenAddress === CECLE_TOKEN_ADDRESS);
  const marbleAsset = collateralAssets.find(a => a.tokenAddress === MARBLE_TOKEN_ADDRESS);
  
  const currentBalance = selectedToken === 'cecle' ? cecleBalance : marbleBalance;
  const currentAsset = selectedToken === 'cecle' ? cecleAsset : marbleAsset;
  const tokenAddress = selectedToken === 'cecle' ? CECLE_TOKEN_ADDRESS : MARBLE_TOKEN_ADDRESS;
  
  const handleLock = async () => {
    if (lockAmount <= 0 || lockAmount > (currentBalance || 0)) return;
    
    setIsLocking(true);
    try {
      const success = await lockCollateral(tokenAddress, lockAmount);
      
      if (success) {
        toast({
          title: "Collateral Locked",
          description: `Successfully locked ${lockAmount} ${selectedToken.toUpperCase()} tokens`,
        });
        setLockAmount(0);
      } else {
        toast({
          title: "Transaction Failed",
          description: "Failed to lock collateral",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error locking collateral:", error);
      toast({
        title: "Error",
        description: "An error occurred while locking collateral",
        variant: "destructive",
      });
    } finally {
      setIsLocking(false);
    }
  };
  
  const handleUnlock = async () => {
    if (unlockAmount <= 0 || unlockAmount > (currentAsset?.amount || 0)) return;
    
    setIsUnlocking(true);
    try {
      const success = await unlockCollateral(tokenAddress, unlockAmount);
      
      if (success) {
        toast({
          title: "Collateral Unlocked",
          description: `Successfully unlocked ${unlockAmount} ${selectedToken.toUpperCase()} tokens`,
        });
        setUnlockAmount(0);
      } else {
        toast({
          title: "Transaction Failed",
          description: "Failed to unlock collateral",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error unlocking collateral:", error);
      toast({
        title: "Error",
        description: "An error occurred while unlocking collateral",
        variant: "destructive",
      });
    } finally {
      setIsUnlocking(false);
    }
  };
  
  const handleLockSliderChange = (value: number[]) => {
    setLockAmount(value[0]);
  };
  
  const handleUnlockSliderChange = (value: number[]) => {
    setUnlockAmount(value[0]);
  };

  return (
    <Card className="overflow-hidden border-2 border-cosmic-purple/20 bg-gradient-to-br from-cosmic-black/80 to-cosmic-slate/90">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-zinc-50">Token Collateral</CardTitle>
          <Badge variant="default" className="bg-cosmic-cyan/20 text-cosmic-cyan border-cosmic-cyan/30">
            <span>Solana Assets</span>
          </Badge>
        </div>
        <CardDescription className="text-zinc-400">
          Lock CECLE or MARBLE tokens as collateral to earn CMX rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isWalletConnected ? (
          <>
            <Tabs
              value={selectedToken}
              onValueChange={(value) => setSelectedToken(value as 'cecle' | 'marble')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-cosmic-slate/30">
                <TabsTrigger value="cecle">CECLE</TabsTrigger>
                <TabsTrigger value="marble">MARBLE</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cecle" className="space-y-4 pt-2">
                <div className="rounded-lg bg-cosmic-slate/20 p-3 text-xs">
                  <p className="text-zinc-300">CECLE Token - Cosmic Electricity (5vmiteBPb7SYj4s1HmNFbb3kWSuaUu4waENx4vSQDmbs)</p>
                  <p className="mt-1 text-cosmic-cyan">Lock to earn 5% in CMX rewards</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Available CECLE</span>
                  <span className="font-mono text-sm text-zinc-300">{cecleBalance?.toFixed(2)} CECLE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Currently Locked</span>
                  <span className="font-mono text-sm text-cosmic-cyan">{cecleAsset?.amount.toFixed(2)} CECLE</span>
                </div>
              </TabsContent>
              
              <TabsContent value="marble" className="space-y-4 pt-2">
                <div className="rounded-lg bg-cosmic-slate/20 p-3 text-xs">
                  <p className="text-zinc-300">MARBLE Token (B9NYKkHRa1VfgWeKXTiGLaBz7V1URQSGnaEPb4gGFsXA)</p>
                  <p className="mt-1 text-cosmic-fuchsia">Lock to earn 8% in CMX rewards</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Available MARBLE</span>
                  <span className="font-mono text-sm text-zinc-300">{marbleBalance?.toFixed(2)} MARBLE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Currently Locked</span>
                  <span className="font-mono text-sm text-cosmic-fuchsia">{marbleAsset?.amount.toFixed(2)} MARBLE</span>
                </div>
              </TabsContent>
            </Tabs>
            
            <Tabs defaultValue="lock" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-cosmic-slate/30">
                <TabsTrigger value="lock">Lock</TabsTrigger>
                <TabsTrigger value="unlock">Unlock</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lock" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="lockAmount" className="text-zinc-300">Lock Amount</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="lockAmount"
                      defaultValue={[0]}
                      max={currentBalance || 0}
                      step={0.1}
                      value={[lockAmount]}
                      onValueChange={handleLockSliderChange}
                      className="flex-grow"
                    />
                    <Input
                      type="number"
                      value={lockAmount}
                      onChange={(e) => setLockAmount(Number(e.target.value))}
                      className="w-24 bg-cosmic-slate/30 border-cosmic-purple/30"
                      min={0}
                      max={currentBalance || 0}
                      step={0.1}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleLock}
                  disabled={!isWalletConnected || lockAmount <= 0 || lockAmount > (currentBalance || 0) || isLocking}
                  className="w-full bg-gradient-to-r from-cosmic-cyan to-cosmic-blue hover:from-cosmic-cyan/80 hover:to-cosmic-blue/80"
                >
                  {isLocking ? "Processing..." : `Lock ${selectedToken.toUpperCase()} as Collateral`}
                </Button>
              </TabsContent>
              
              <TabsContent value="unlock" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="unlockAmount" className="text-zinc-300">Unlock Amount</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="unlockAmount"
                      defaultValue={[0]}
                      max={currentAsset?.amount || 0}
                      step={0.1}
                      value={[unlockAmount]}
                      onValueChange={handleUnlockSliderChange}
                      className="flex-grow"
                    />
                    <Input
                      type="number"
                      value={unlockAmount}
                      onChange={(e) => setUnlockAmount(Number(e.target.value))}
                      className="w-24 bg-cosmic-slate/30 border-cosmic-purple/30"
                      min={0}
                      max={currentAsset?.amount || 0}
                      step={0.1}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleUnlock}
                  disabled={!isWalletConnected || unlockAmount <= 0 || unlockAmount > (currentAsset?.amount || 0) || isUnlocking}
                  className="w-full bg-gradient-to-r from-cosmic-slate to-cosmic-indigo hover:from-cosmic-slate/80 hover:to-cosmic-indigo/80"
                >
                  {isUnlocking ? "Processing..." : `Unlock ${selectedToken.toUpperCase()} Collateral`}
                </Button>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="py-6 text-center text-zinc-400">
            <p>Connect your wallet to lock tokens as collateral</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-cosmic-black/30 pt-2">
        <div className="w-full text-center text-xs text-zinc-400">
          Earn CMX rewards: CECLE (5%), MARBLE (8%)
        </div>
      </CardFooter>
    </Card>
  );
};

export default CollateralLock;
