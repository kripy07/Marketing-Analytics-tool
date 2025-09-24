import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, RefreshCw, TrendingUp } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Marketing Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track campaign performance, budgets, and target achievements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-glow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm opacity-90">Active Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">$248K</div>
            <div className="text-sm opacity-90">Total Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">$186K</div>
            <div className="text-sm opacity-90">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <div className="text-2xl font-bold">87%</div>
            </div>
            <div className="text-sm opacity-90">Avg Target Achievement</div>
          </div>
        </div>
      </Card>
    </div>
  );
}