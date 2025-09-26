import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuickCampaignData {
  name: string;
  status: string;
  budget: string;
  spent: string;
  clicks: string;
  conversions: string;
}

export function QuickDataEntry() {
  const { toast } = useToast();
  const { canEdit } = useAuth();
  const [formData, setFormData] = useState<QuickCampaignData>({
    name: "",
    status: "active",
    budget: "",
    spent: "",
    clicks: "",
    conversions: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "Admin access required to add campaign data",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.budget) {
      toast({
        title: "Missing Information",
        description: "Campaign name and budget are required",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving data
    toast({
      title: "Campaign Added",
      description: `Campaign "${formData.name}" has been added successfully`,
    });

    // Reset form
    setFormData({
      name: "",
      status: "active",
      budget: "",
      spent: "",
      clicks: "",
      conversions: ""
    });
  };

  const updateField = (field: keyof QuickCampaignData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Campaign Entry
          </CardTitle>
          <CardDescription>Add campaign data quickly with this simple form</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Admin access required to add new campaign data. Please contact your administrator.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Campaign Entry
        </CardTitle>
        <CardDescription>Add campaign data quickly with this simple form</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name*</Label>
              <Input
                id="campaign-name"
                placeholder="e.g., Summer Sale 2024"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaign-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                <SelectTrigger id="campaign-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-budget">Budget*</Label>
              <Input
                id="campaign-budget"
                type="number"
                placeholder="5000"
                value={formData.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-spent">Amount Spent</Label>
              <Input
                id="campaign-spent"
                type="number"
                placeholder="2500"
                value={formData.spent}
                onChange={(e) => updateField("spent", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-clicks">Clicks</Label>
              <Input
                id="campaign-clicks"
                type="number"
                placeholder="1250"
                value={formData.clicks}
                onChange={(e) => updateField("clicks", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-conversions">Conversions</Label>
              <Input
                id="campaign-conversions"
                type="number"
                placeholder="85"
                value={formData.conversions}
                onChange={(e) => updateField("conversions", e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Add Campaign
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}