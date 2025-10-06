import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, BarChart3, TrendingUp, DollarSign, Target, FolderOpen, Users, MousePointer, Eye, ShoppingCart } from "lucide-react";
import { DataImport } from "@/components/DataImport";
import { MetricCard } from "@/components/MetricCard";
import { CampaignCard } from "@/components/CampaignCard";
import { ComparisonChart } from "@/components/ComparisonChart";
import { FilterPanel } from "@/components/FilterPanel";
import { ExportPanel } from "@/components/ExportPanel";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";
import { DateRange } from "react-day-picker";

export default function Dashboard() {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");
  
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSpend: 0,
    totalConversions: 0,
    totalClicks: 0,
    totalImpressions: 0,
    totalRevenue: 0,
    avgRoas: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's organizations
      const { data: orgsData, error: orgsError } = await supabase
        .from('user_roles')
        .select(`
          organization_id,
          role,
          organizations (
            id,
            name,
            created_at,
            settings
          )
        `)
        .eq('user_id', user!.id);

      if (orgsError) throw orgsError;

      const orgs = orgsData?.map(item => ({
        ...item.organizations,
        userRole: item.role
      })) || [];

      setOrganizations(orgs);

      // Fetch campaigns and metrics for all user organizations
      if (orgs.length > 0) {
        const orgIds = orgs.map(org => org.id);
        
        const { data: campaignsData } = await supabase
          .from('campaigns')
          .select('*')
          .in('organization_id', orgIds);

        setCampaigns(campaignsData || []);

        const campaignIds = campaignsData?.map(c => c.id) || [];
        
        if (campaignIds.length > 0) {
          const { data: metricsData } = await supabase
            .from('campaign_metrics')
            .select('*')
            .in('campaign_id', campaignIds);

          setMetrics(metricsData || []);

          const totalSpend = metricsData?.reduce((sum, m) => sum + Number(m.spend || 0), 0) || 0;
          const totalConversions = metricsData?.reduce((sum, m) => sum + Number(m.conversions || 0), 0) || 0;
          const totalRevenue = metricsData?.reduce((sum, m) => sum + Number(m.revenue || 0), 0) || 0;
          const totalClicks = metricsData?.reduce((sum, m) => sum + Number(m.clicks || 0), 0) || 0;
          const totalImpressions = metricsData?.reduce((sum, m) => sum + Number(m.impressions || 0), 0) || 0;

          setStats({
            totalProjects: orgs.length,
            totalSpend,
            totalConversions,
            totalClicks,
            totalImpressions,
            totalRevenue,
            avgRoas: totalSpend > 0 ? totalRevenue / totalSpend : 0
          });
        }
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and calculate metrics
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      if (selectedStatus !== "all" && campaign.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [campaigns, selectedStatus]);

  const campaignMetrics = useMemo(() => {
    return filteredCampaigns.map(campaign => {
      const campaignMetricsData = metrics.filter(m => m.campaign_id === campaign.id);
      const spent = campaignMetricsData.reduce((sum, m) => sum + Number(m.spend || 0), 0);
      const conversions = campaignMetricsData.reduce((sum, m) => sum + Number(m.conversions || 0), 0);
      const clicks = campaignMetricsData.reduce((sum, m) => sum + Number(m.clicks || 0), 0);
      const impressions = campaignMetricsData.reduce((sum, m) => sum + Number(m.impressions || 0), 0);
      const revenue = campaignMetricsData.reduce((sum, m) => sum + Number(m.revenue || 0), 0);
      
      return {
        name: campaign.name,
        status: campaign.status,
        budget: Number(campaign.budget || 0),
        spent,
        target: conversions * 1.2, // Target is 20% above current
        achieved: conversions,
        conversions,
        clicks,
        impressions,
        revenue,
        startDate: campaign.start_date,
        endDate: campaign.end_date,
      };
    });
  }, [filteredCampaigns, metrics]);

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
      exportToCSV(campaignMetrics, fields);
    } else if (format === "pdf") {
      exportToPDF(campaignMetrics, fields);
    }
  };

  const handleCreateProject = () => {
    navigate('/onboarding');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  };

  // Show empty state if no campaigns yet
  if (campaigns.length === 0 && !loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.first_name || user?.email}!</h1>
            <p className="text-muted-foreground mt-1">Get started by importing your campaign data</p>
          </div>
          <Button onClick={handleCreateProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">No campaign data yet</h3>
              <p className="text-muted-foreground mb-4">
                Import your campaign data to see beautiful analytics and insights
              </p>
            </div>
          </div>
        </Card>

        {organizations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Import Campaign Data</h2>
            <DataImport />
          </div>
        )}
      </div>
    );
  }

  const avgConversionRate = stats.totalClicks > 0 ? (stats.totalConversions / stats.totalClicks) * 100 : 0;
  const avgCPA = stats.totalConversions > 0 ? stats.totalSpend / stats.totalConversions : 0;
  const budgetUtilization = campaignMetrics.reduce((sum, c) => sum + c.budget, 0);
  const budgetUtilizationPercent = budgetUtilization > 0 ? (stats.totalSpend / budgetUtilization) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.first_name || user?.email}!</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your marketing performance</p>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

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
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={23.4}
          changeLabel="vs last month"
          icon={<DollarSign className="h-4 w-4" />}
          variant="success"
        />
        <MetricCard
          title="Cost Per Acquisition"
          value={`$${avgCPA.toFixed(2)}`}
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
          value={stats.totalImpressions.toLocaleString()}
          change={18.2}
          changeLabel="vs last month"
          icon={<Eye className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          change={12.8}
          changeLabel="vs last month"
          icon={<MousePointer className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Conversions"
          value={stats.totalConversions.toLocaleString()}
          change={21.5}
          changeLabel="vs last month"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Return on Ad Spend"
          value={`${stats.avgRoas.toFixed(2)}x`}
          change={9.4}
          changeLabel="vs last month"
          icon={<ShoppingCart className="h-4 w-4" />}
          variant="success"
        />
      </div>

      {/* Campaign Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedStatus === "all" ? "Recent Campaigns" : `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Campaigns`}
          </h2>
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(campaignMetrics.length, 6)} of {campaignMetrics.length} campaigns
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaignMetrics.slice(0, 6).map((campaign, index) => (
            <CampaignCard key={index} {...campaign} />
          ))}
        </div>
        {campaignMetrics.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No campaigns match your filters</p>
            <p>Try adjusting your filter criteria</p>
          </div>
        )}
      </div>

      {/* Data Import Section */}
      {organizations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Import More Data</h2>
          <DataImport />
        </div>
      )}
    </div>
  );
}