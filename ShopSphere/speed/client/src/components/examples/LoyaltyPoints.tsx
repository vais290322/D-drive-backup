import { LoyaltyPoints } from "../LoyaltyPoints";

export default function LoyaltyPointsExample() {
  return (
    <div className="p-6 max-w-sm">
      <LoyaltyPoints currentPoints={750} pointsToNextReward={1000} totalEarned={2450} />
    </div>
  );
}
