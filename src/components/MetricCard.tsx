import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon,
  variant = "default" 
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const getCardVariant = () => {
    switch (variant) {
      case "success":
        return "border-success/20";
      case "warning":
        return "border-warning/20";
      case "danger":
        return "border-destructive/20";
      default:
        return "";
    }
  };

  return (
    <Card className={cn("shadow-soft hover:shadow-medium transition-shadow duration-300", getCardVariant())}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className={cn("flex items-center gap-1 text-xs mt-1", getTrendColor())}>
          {getTrendIcon()}
          <span>{Math.abs(change)}%</span>
          <span className="text-muted-foreground">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}