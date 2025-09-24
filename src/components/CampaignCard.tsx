import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Target, DollarSign, Users, MousePointer } from "lucide-react";

interface CampaignCardProps {
  name: string;
  status: "active" | "completed" | "paused";
  budget: number;
  spent: number;
  target: number;
  achieved: number;
  conversions: number;
  clicks: number;
  startDate: string;
  endDate: string;
}

export function CampaignCard({
  name,
  status,
  budget,
  spent,
  target,
  achieved,
  conversions,
  clicks,
  startDate,
  endDate
}: CampaignCardProps) {
  const budgetProgress = (spent / budget) * 100;
  const targetProgress = (achieved / target) * 100;
  
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "completed":
        return "bg-primary text-primary-foreground";
      case "paused":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTargetStatus = () => {
    if (targetProgress >= 100) return "text-success";
    if (targetProgress >= 75) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="shadow-soft hover:shadow-medium transition-all duration-300 hover:border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <Badge className={getStatusColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {startDate} - {endDate}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Budget</span>
            </div>
            <span className="font-medium">
              ${spent.toLocaleString()} / ${budget.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={budgetProgress} 
            className="h-2"
          />
          <div className="text-xs text-muted-foreground text-right">
            {budgetProgress.toFixed(1)}% used
          </div>
        </div>

        {/* Target Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>Target Achievement</span>
            </div>
            <span className={cn("font-medium", getTargetStatus())}>
              {achieved.toLocaleString()} / {target.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={Math.min(targetProgress, 100)} 
            className="h-2"
          />
          <div className={cn("text-xs text-right", getTargetStatus())}>
            {targetProgress.toFixed(1)}% achieved
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-info" />
            <div>
              <p className="text-sm font-medium">{conversions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Conversions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MousePointer className="h-4 w-4 text-info" />
            <div>
              <p className="text-sm font-medium">{clicks.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Clicks</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}