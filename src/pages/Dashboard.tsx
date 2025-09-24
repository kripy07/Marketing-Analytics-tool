import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { CampaignCard } from "@/components/CampaignCard";
import { ComparisonChart } from "@/components/ComparisonChart";
import { FilterPanel } from "@/components/FilterPanel";
import { ExportPanel } from "@/components/ExportPanel";
import { mockCampaigns, comparisonData, weeklyPerformance, budgetUtilization } from "@/data/mockData";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";
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
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";

const Dashboard = () => {
  // Filter states
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");

  // Filter campaigns based on selected filters
  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter(campaign => {
      // Status filter
      if (selectedStatus !== "all" && campaign.status !== selectedStatus) {
        return false;
      }

      // Date range filter (simplified - in real app you'd check actual dates)
      if (dateRange?.from && dateRange?.to) {
        // For demo purposes, we'll just show all campaigns if date range is selected
        // In real implementation, you'd filter by campaign.startDate and campaign.endDate
      }

      return true;
    });
  }, [selectedStatus, selectedChannel, dateRange]);

  // Calculate metrics from filtered campaigns
  const totalBudget = filteredCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = filteredCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalConversions = filteredCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const totalClicks = filteredCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  
  const budgetUtilizationPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  const activeFiltersCount = [
    dateRange?.from ? 1 : 0,
    selectedStatus !== "all" ? 1 : 0,
    selectedChannel !== "all" ? 1 : 0
  ].reduce((sum, filter) => sum + filter, 0);

  const handleClearFilters = () => {
    setDateRange(undefined);
    setSelectedStatus("all");
    setSelectedChannel("all");
  };

  const handleExport = (format: string, fields: string[]) => {
    if (format === "csv") {
      exportToCSV(filteredCampaigns, fields);
    } else if (format === "pdf") {
      exportToPDF(filteredCampaigns, fields);
    } else {
      // For XLSX, you'd need a library like SheetJS
      alert("Excel export coming soon! Use CSV for now.");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <DashboardHeader />

      {/* Filters and Export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FilterPanel
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
            onClearFilters={handleClearFilters}
            activeFiltersCount={activeFiltersCount}
          />
        </div>
        <div>
          <ExportPanel onExport={handleExport} />
        </div>
      </div>

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
          value={`$${totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : '0.00'}`}
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedStatus === "all" ? "Recent Campaigns" : `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Campaigns`}
          </h2>
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(filteredCampaigns.length, 6)} of {filteredCampaigns.length} campaigns
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.slice(0, 6).map((campaign, index) => (
            <CampaignCard key={index} {...campaign} />
          ))}
        </div>
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No campaigns match your filters</p>
            <p>Try adjusting your filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;