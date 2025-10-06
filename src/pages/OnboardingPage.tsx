import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { parseExcelOrCSV, importCampaignsToDatabase, downloadTemplate } from "@/utils/importUtils";
import { Upload, FileSpreadsheet, Sheet, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [companyName, setCompanyName] = useState("");
  const [createdOrgId, setCreatedOrgId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);

    // Pre-fill company name if available
    if (data?.company_name) {
      setCompanyName(data.company_name);
    }
  };

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect if onboarding already completed
  if (profile?.onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleComplete = async () => {
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your company name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: companyName,
          settings: {}
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Create user role as admin
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user!.id,
          organization_id: orgData.id,
          role: 'admin'
        });

      if (roleError) throw roleError;

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_name: companyName,
          onboarding_completed: true,
        })
        .eq('id', user!.id);

      if (profileError) throw profileError;

      // Create attribution settings
      const { error: attributionError } = await supabase
        .from('attribution_settings')
        .insert({
          organization_id: orgData.id,
          model: 'last_touch',
          lookback_window_days: 30,
        });

      if (attributionError) throw attributionError;

      // Store the created organization ID for imports
      setCreatedOrgId(orgData.id);

      toast({
        title: "Welcome!",
        description: "Your account has been set up. You can now import your data or skip to dashboard.",
      });
      
    } catch (error: any) {
      console.error('Error completing setup:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileImport = async (file: File) => {
    if (!createdOrgId) {
      toast({
        title: "Please Complete Setup First",
        description: "Click 'Get Started' to set up your account before importing data.",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    
    try {
      const data = await parseExcelOrCSV(file);
      
      if (data.length === 0) {
        toast({
          title: "No Data Found",
          description: "The file appears to be empty or in an incorrect format.",
          variant: "destructive"
        });
        return;
      }

      const result = await importCampaignsToDatabase(data, createdOrgId);
      
      if (result.success > 0) {
        toast({
          title: "Import Successful",
          description: `Imported ${result.success} campaign(s). Redirecting to dashboard...`,
        });

        // Navigate after successful import
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } else {
        toast({
          title: "Import Failed",
          description: "No campaigns were imported. Please check your file format.",
          variant: "destructive"
        });
      }
      
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to process file.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleGoogleSheets = () => {
    toast({
      title: "Google Sheets Integration",
      description: "This feature requires additional OAuth setup. Use Excel/CSV for now, or add data from the dashboard.",
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Marketing Analytics</CardTitle>
          <CardDescription>
            Get started by setting up your company and importing your data
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
              />
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-lg font-semibold">Import Your Marketing Data</h3>
              <p className="text-sm text-muted-foreground">
                Choose how you want to import your campaign data:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileImport(file);
                  }}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={triggerFileInput}
                  disabled={isSubmitting || importing || !createdOrgId}
                >
                  <FileSpreadsheet className="h-8 w-8" />
                  <span>{importing ? "Importing..." : "Import Excel/CSV"}</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={handleGoogleSheets}
                  disabled={isSubmitting || !createdOrgId}
                >
                  <Sheet className="h-8 w-8" />
                  <span>Google Sheets</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={downloadTemplate}
                  disabled={isSubmitting}
                >
                  <Upload className="h-8 w-8" />
                  <span>Download Template</span>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                You can import data later from your dashboard
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            {createdOrgId && (
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard', { replace: true })}
                size="lg"
              >
                Skip to Dashboard
              </Button>
            )}
            <Button
              onClick={handleComplete}
              disabled={isSubmitting || !companyName.trim() || createdOrgId !== null}
              size="lg"
              className="ml-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : createdOrgId ? (
                "✓ Setup Complete"
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}