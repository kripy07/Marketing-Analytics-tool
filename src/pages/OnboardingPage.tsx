import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Building2, Users, Target, Upload } from "lucide-react";

const ONBOARDING_STEPS = [
  { id: 'company', title: 'Company Info', icon: Building2 },
  { id: 'data-sources', title: 'Data Sources', icon: Upload },
  { id: 'goals', title: 'Goals & Targets', icon: Target },
  { id: 'team', title: 'Invite Team', icon: Users },
];

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    companyName: "",
    goals: {
      targetRoas: "",
      targetCpa: "",
      monthlyBudget: "",
    },
    dataSources: {
      googleAds: false,
      facebookAds: false,
      linkedinAds: false,
      twitterAds: false,
      csvImport: false,
    },
    teamEmails: [""],
  });

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

    // Pre-fill form data if available
    if (data?.company_name) {
      setFormData(prev => ({
        ...prev,
        companyName: data.company_name
      }));
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

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.companyName,
          settings: {
            goals: formData.goals,
            data_sources: formData.dataSources,
          }
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
          company_name: formData.companyName,
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

      toast({
        title: "Welcome aboard!",
        description: "Your account has been set up successfully.",
      });

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as object),
        [field]: value
      }
    }));
  };

  const addTeamEmail = () => {
    setFormData(prev => ({
      ...prev,
      teamEmails: [...prev.teamEmails, ""]
    }));
  };

  const updateTeamEmail = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamEmails: prev.teamEmails.map((email, i) => i === index ? value : email)
    }));
  };

  const removeTeamEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamEmails: prev.teamEmails.filter((_, i) => i !== index)
    }));
  };

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const StepIcon = currentStepData.icon;
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <StepIcon className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Welcome to Marketing Analytics</CardTitle>
          </div>
          <CardDescription>
            Step {currentStep + 1} of {ONBOARDING_STEPS.length}: {currentStepData.title}
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Which platforms do you want to connect?</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries({
                  googleAds: 'Google Ads',
                  facebookAds: 'Facebook/Meta Ads',
                  linkedinAds: 'LinkedIn Ads',
                  twitterAds: 'Twitter/X Ads',
                  csvImport: 'CSV Import'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={formData.dataSources[key as keyof typeof formData.dataSources]}
                      onCheckedChange={(checked) => 
                        handleNestedInputChange('dataSources', key, checked)
                      }
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Set your marketing goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetRoas">Target ROAS</Label>
                  <Input
                    id="targetRoas"
                    type="number"
                    step="0.1"
                    value={formData.goals.targetRoas}
                    onChange={(e) => handleNestedInputChange('goals', 'targetRoas', e.target.value)}
                    placeholder="e.g., 4.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetCpa">Target CPA ($)</Label>
                  <Input
                    id="targetCpa"
                    type="number"
                    step="0.01"
                    value={formData.goals.targetCpa}
                    onChange={(e) => handleNestedInputChange('goals', 'targetCpa', e.target.value)}
                    placeholder="e.g., 50.00"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="monthlyBudget">Monthly Budget ($)</Label>
                  <Input
                    id="monthlyBudget"
                    type="number"
                    value={formData.goals.monthlyBudget}
                    onChange={(e) => handleNestedInputChange('goals', 'monthlyBudget', e.target.value)}
                    placeholder="e.g., 10000"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Invite your team (optional)</h3>
              {formData.teamEmails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => updateTeamEmail(index, e.target.value)}
                    placeholder="team@example.com"
                  />
                  {formData.teamEmails.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeTeamEmail(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTeamEmail}
              >
                Add Another Email
              </Button>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                isSubmitting ? "Setting up..." : "Complete Setup"
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}