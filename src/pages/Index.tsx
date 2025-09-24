import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { CampaignCard } from "@/components/CampaignCard";
import { ComparisonChart } from "@/components/ComparisonChart";
import { mockCampaigns, comparisonData, weeklyPerformance, budgetUtilization } from "@/data/mockData";
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Eye,
  ShoppingCart,
  BarChart3
} from "lucide-react";

const Index = () => {
  // Calculate summary metrics from mock data
  const totalBudget = mockCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = mockCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalConversions = mockCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const totalClicks = mockCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  
  const budgetUtilizationPercent = (totalSpent / totalBudget) * 100;
  const avgConversionRate = (totalConversions / totalClicks) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardHeader />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${(totalSpent * 1.8).toLocaleString()}`}
            change={23.4}
            changeLabel="vs last month"
            icon={<DollarSign className="h-4 w-4" />}
            variant="success"
          />
          <MetricCard
            title="Cost Per Acquisition"
            value={`$${(totalSpent / totalConversions).toFixed(2)}`}
            change={-8.2}
            changeLabel="vs last month"
            icon={<Target className="h-4 w-4" />}
            variant="success"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${avgConversionRate.toFixed(2)}%`}
            change={15.7}
            changeLabel="vs last month"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricCard
            title="Budget Utilization"
            value={`${budgetUtilizationPercent.toFixed(1)}%`}
            change={4.1}
            changeLabel="vs last month"
            icon={<BarChart3 className="h-4 w-4" />}
            variant={budgetUtilizationPercent > 85 ? "warning" : "default"}
          />
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Impressions"
            value="2.4M"
            change={18.2}
            changeLabel="vs last month"
            icon={<Eye className="h-4 w-4" />}
          />
          <MetricCard
            title="Total Clicks"
            value={totalClicks.toLocaleString()}
            change={12.8}
            changeLabel="vs last month"
            icon={<MousePointer className="h-4 w-4" />}
          />
          <MetricCard
            title="Total Conversions"
            value={totalConversions.toLocaleString()}
            change={21.5}
            changeLabel="vs last month"
            icon={<Users className="h-4 w-4" />}
          />
          <MetricCard
            title="Return on Ad Spend"
            value="3.2x"
            change={9.4}
            changeLabel="vs last month"
            icon={<ShoppingCart className="h-4 w-4" />}
            variant="success"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComparisonChart
            title="Campaign Performance Comparison"
            data={comparisonData}
            type="bar"
          />
          <ComparisonChart
            title="Weekly Performance Trend"
            data={weeklyPerformance}
            type="line"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ComparisonChart
            title="Budget Utilization by Channel"
            data={budgetUtilization}
            type="bar"
          />
        </div>

        {/* Campaign Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Active Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCampaigns.map((campaign, index) => (
              <CampaignCard key={index} {...campaign} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;