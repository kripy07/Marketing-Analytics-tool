import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Plus,
  Settings,
  Download,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalSpend: 0,
    totalConversions: 0,
    averageCPA: 0,
    totalROAS: 0,
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch user's organization
      const { data: userRoleData } = await supabase
        .from('user_roles')
        .select('organization_id, role, organizations(*)')
        .eq('user_id', user.id)
        .single();

      if (userRoleData) {
        setOrganization(userRoleData.organizations);

        // Fetch campaigns for the organization
        const { data: campaignsData } = await supabase
          .from('campaigns')
          .select(`
            *,
            campaign_metrics(*)
          `)
          .eq('organization_id', userRoleData.organization_id)
          .limit(10);

        setCampaigns(campaignsData || []);

        // Calculate metrics
        if (campaignsData) {
          let totalSpend = 0;
          let totalConversions = 0;
          let totalRevenue = 0;

          campaignsData.forEach(campaign => {
            campaign.campaign_metrics.forEach((metric: any) => {
              totalSpend += parseFloat(metric.spend || 0);
              totalConversions += metric.conversions || 0;
              totalRevenue += parseFloat(metric.revenue || 0);
            });
          });

          setMetrics({
            totalSpend,
            totalConversions,
            averageCPA: totalConversions > 0 ? totalSpend / totalConversions : 0,
            totalROAS: totalSpend > 0 ? totalRevenue / totalSpend : 0,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  const handleCreateCampaign = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Campaign creation will be available soon!",
    });
  };

  const handleConnectAccount = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Ad account connections will be available soon!",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Data export will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Marketing Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.first_name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalSpend.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Across all campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalConversions}</div>
              <p className="text-xs text-muted-foreground">
                Total conversions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average CPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.averageCPA.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Cost per acquisition
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROAS</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalROAS.toFixed(2)}x</div>
              <p className="text-xs text-muted-foreground">
                Return on ad spend
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Campaigns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Campaigns</CardTitle>
                    <CardDescription>
                      Your latest marketing campaigns
                    </CardDescription>
                  </div>
                  <Button onClick={handleCreateCampaign}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Campaign
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {campaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No campaigns yet. Create your first campaign to get started!
                    </p>
                    <Button onClick={handleCreateCampaign}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {campaign.utm_source} • {campaign.utm_medium}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">${campaign.budget}</p>
                            <p className="text-sm text-muted-foreground">Budget</p>
                          </div>
                          <Badge variant={
                            campaign.status === 'active' ? 'default' :
                            campaign.status === 'paused' ? 'secondary' :
                            campaign.status === 'completed' ? 'default' : 'outline'
                          }>
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={handleCreateCampaign}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={handleConnectAccount}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Connect Ad Account
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Set Up Alerts
                </Button>
              </CardContent>
            </Card>

            {/* Organization Info */}
            {organization && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">{organization.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {organization.domain || 'No domain set'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}