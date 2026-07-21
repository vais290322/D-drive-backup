import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LoyaltyPointsProps {
  currentPoints: number;
  pointsToNextReward?: number;
  totalEarned?: number;
}

export function LoyaltyPoints({
  currentPoints,
  pointsToNextReward = 1000,
  totalEarned = 0,
}: LoyaltyPointsProps) {
  const progress = (currentPoints / pointsToNextReward) * 100;

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Loyalty Points</CardTitle>
        <Gift className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-bold font-heading" data-testid="text-current-points">
            {currentPoints.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {pointsToNextReward - currentPoints} points to next reward
          </p>
        </div>
        <Progress value={progress} className="h-2 mb-4" data-testid="progress-loyalty" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium" data-testid="text-total-earned">
                {totalEarned}
              </div>
              <div className="text-xs text-muted-foreground">Total Earned</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">₹{(currentPoints * 0.1).toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Redeem Value</div>
            </div>
          </div>
        </div>
        <Button className="w-full mt-4" variant="outline" data-testid="button-redeem-points">
          Redeem Points
        </Button>
      </CardContent>
    </Card>
  );
}
