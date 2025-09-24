import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

interface EditCampaignDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (campaign: Campaign) => void;
}

export function EditCampaignDialog({ campaign, open, onOpenChange, onSave }: EditCampaignDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Campaign>(() => ({
    name: "",
    status: "active",
    budget: 0,
    spent: 0,
    target: 0,
    achieved: 0,
    conversions: 0,
    clicks: 0,
    startDate: "",
    endDate: ""
  }));

  // Update form data when campaign changes
  React.useEffect(() => {
    if (campaign) {
      setFormData(campaign);
    }
  }, [campaign]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Campaign name is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.budget <= 0) {
      toast({
        title: "Validation Error", 
        description: "Budget must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Success",
      description: "Campaign updated successfully",
    });
    onOpenChange(false);
  };

  const updateField = (field: keyof Campaign, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {campaign ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter campaign name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Budget & Targets */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Budget & Targets</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateField("budget", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spent">Amount Spent ($)</Label>
                <Input
                  id="spent"
                  type="number"
                  value={formData.spent}
                  onChange={(e) => updateField("spent", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target Conversions</Label>
                <Input
                  id="target"
                  type="number"
                  value={formData.target}
                  onChange={(e) => updateField("target", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achieved">Achieved Conversions</Label>
                <Input
                  id="achieved"
                  type="number"
                  value={formData.achieved}
                  onChange={(e) => updateField("achieved", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance Metrics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conversions">Total Conversions</Label>
                <Input
                  id="conversions"
                  type="number"
                  value={formData.conversions}
                  onChange={(e) => updateField("conversions", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clicks">Total Clicks</Label>
                <Input
                  id="clicks"
                  type="number"
                  value={formData.clicks}
                  onChange={(e) => updateField("clicks", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}