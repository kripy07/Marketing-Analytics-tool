import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditCampaignDialog } from "@/components/EditCampaignDialog";
import { useAuth } from "@/contexts/AuthContext";
import { mockCampaigns } from "@/data/mockData";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Play, 
  Pause, 
  DollarSign,
  Target,
  TrendingUp,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
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

const Campaigns = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditCampaign = (campaign: Campaign) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin access required to edit campaigns",
        variant: "destructive"
      });
      return;
    }
    setEditingCampaign(campaign);
    setDialogOpen(true);
  };

  const handleCreateCampaign = () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied", 
        description: "Admin access required to create campaigns",
        variant: "destructive"
      });
      return;
    }
    setEditingCampaign(null);
    setDialogOpen(true);
  };

  const handleSaveCampaign = (updatedCampaign: Campaign) => {
    if (editingCampaign) {
      // Update existing campaign
      setCampaigns(prev => prev.map(campaign => 
        campaign === editingCampaign ? updatedCampaign : campaign
      ));
    } else {
      // Add new campaign
      setCampaigns(prev => [...prev, updatedCampaign]);
    }
  };

  const handleToggleStatus = (campaign: Campaign) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin access required to change campaign status",
        variant: "destructive"
      });
      return;
    }

    const newStatus = campaign.status === "active" ? "paused" : "active";
    setCampaigns(prev => prev.map(c => 
      c === campaign ? { ...c, status: newStatus } : c
    ));
    
    toast({
      title: "Status Updated",
      description: `Campaign ${newStatus === "active" ? "activated" : "paused"} successfully`,
    });
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin access required to delete campaigns",
        variant: "destructive"
      });
      return;
    }

    setCampaigns(prev => prev.filter(c => c !== campaign));
    toast({
      title: "Campaign Deleted",
      description: "Campaign has been successfully deleted",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "completed":
        return <Badge className="bg-primary text-primary-foreground">Completed</Badge>;
      case "paused":
        return <Badge className="bg-warning text-warning-foreground">Paused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Summary statistics
  const totalBudget = filteredCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = filteredCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalConversions = filteredCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const activeCampaigns = filteredCampaigns.filter(c => c.status === "active").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all your marketing campaigns
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleCreateCampaign}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeCampaigns} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${totalSpent.toLocaleString()} spent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Target achievement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns ({filteredCampaigns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Achieved</TableHead>
                  <TableHead>Performance</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign, index) => {
                  const performance = (campaign.achieved / campaign.target) * 100;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.startDate} - {campaign.endDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>${campaign.budget.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>${campaign.spent.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">
                            {((campaign.spent / campaign.budget) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{campaign.target.toLocaleString()}</TableCell>
                      <TableCell>{campaign.achieved.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-medium ${
                            performance >= 100 ? 'text-success' :
                            performance >= 75 ? 'text-warning' : 'text-destructive'
                          }`}>
                            {performance.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCampaign(campaign)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(campaign)}
                            >
                              {campaign.status === "active" ? 
                                <Pause className="h-4 w-4" /> : 
                                <Play className="h-4 w-4" />
                              }
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCampaign(campaign)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Campaign Dialog */}
      <EditCampaignDialog
        campaign={editingCampaign}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveCampaign}
      />
    </div>
  );
};

export default Campaigns;