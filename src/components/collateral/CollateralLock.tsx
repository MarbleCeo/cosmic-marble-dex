
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CollateralLockProps {
  isWalletConnected: boolean;
  cecleBalance?: number;
}

const CollateralLock = ({ isWalletConnected, cecleBalance = 0 }: CollateralLockProps) => {
  const [lockAmount, setLockAmount] = useState(0);
  const [isLocking, setIsLocking] = useState(false);
  const [lockedAmount, setLockedAmount] = useState(0);

  const handleLock = () => {
    if (lockAmount <= 0 || lockAmount > (cecleBalance - lockedAmount)) return;
    
    setIsLocking(true);
    // In a real app, this would be a transaction to Solana blockchain
    // with CECLE token address: 5vmiteBPb7SYj4s1HmNFbb3kWSuaUu4waENx4vSQDmbs
    setTimeout(() => {
      setLockedAmount(prev => prev + lockAmount);
      setLockAmount(0);
      setIsLocking(false);
    }, 2000);
  };

  const handleSliderChange = (value: number[]) => {
    setLockAmount(value[0]);
  };

  return (
    <Card className="overflow-hidden border-2 border-cosmic-purple/20 bg-gradient-to-br from-cosmic-black/80 to-cosmic-slate/90">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-zinc-50">CECLE Collateral</CardTitle>
          <Badge className="bg-cosmic-cyan/20 text-cosmic-cyan border-cosmic-cyan/30">
            Solana Asset
          </Badge>
        </div>
        <CardDescription className="text-zinc-400">
          Lock CECLE tokens as collateral at address: 5vmiteBPb7SYj4s1HmNFbb3kWSuaUu4waENx4vSQDmbs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isWalletConnected ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Available CECLE</span>
              <span className="font-mono text-sm text-zinc-300">{(cecleBalance - lockedAmount).toFixed(2)} CECLE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Currently Locked</span>
              <span className="font-mono text-sm text-cosmic-cyan">{lockedAmount.toFixed(2)} CECLE</span>
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="lockAmount" className="text-zinc-300">Lock Amount</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="lockAmount"
                  defaultValue={[0]}
                  max={cecleBalance - lockedAmount}
                  step={0.1}
                  value={[lockAmount]}
                  onValueChange={handleSliderChange}
                  className="flex-grow"
                />
                <Input
                  type="number"
                  value={lockAmount}
                  onChange={(e) => setLockAmount(Number(e.target.value))}
                  className="w-24 bg-cosmic-slate/30 border-cosmic-purple/30"
                  min={0}
                  max={cecleBalance - lockedAmount}
                  step={0.1}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="py-6 text-center text-zinc-400">
            <p>Connect your wallet to lock CECLE tokens</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-cosmic-black/30 pt-2">
        <Button
          onClick={handleLock}
          disabled={!isWalletConnected || lockAmount <= 0 || lockAmount > (cecleBalance - lockedAmount) || isLocking}
          className="w-full bg-gradient-to-r from-cosmic-cyan to-cosmic-blue hover:from-cosmic-cyan/80 hover:to-cosmic-blue/80"
        >
          {isLocking ? "Locking..." : "Lock CECLE as Collateral"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CollateralLock;
