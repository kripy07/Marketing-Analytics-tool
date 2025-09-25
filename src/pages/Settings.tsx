import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { currencies, countries, projectTypes, timezones, languages } from "@/data/constants";
import { DataImport } from "@/components/DataImport";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Users,
  Key,
  Save,
  RefreshCw,
  Upload,
  Palette,
  Mail,
  Lock,
  Monitor,
  Smartphone
} from "lucide-react";

const Settings = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  // General Settings
  const [companyName, setCompanyName] = useState("Marketing Analytics Pro");
  const [timezone, setTimezone] = useState("UTC-8");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("US");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [performanceAlerts, setPerformanceAlerts] = useState(true);
  const [budgetThreshold, setBudgetThreshold] = useState("80");

  // API Settings
  const [googleAdsConnected, setGoogleAdsConnected] = useState(false);
  const [facebookAdsConnected, setFacebookAdsConnected] = useState(false);
  const [linkedinAdsConnected, setLinkedinAdsConnected] = useState(false);
  const [twitterAdsConnected, setTwitterAdsConnected] = useState(false);
  const [bingAdsConnected, setBingAdsConnected] = useState(false);
  const [snapchatAdsConnected, setSnapchatAdsConnected] = useState(false);

  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("24");
  const [passwordExpiry, setPasswordExpiry] = useState("90");
  const [loginAttempts, setLoginAttempts] = useState("5");
  const [ipWhitelisting, setIpWhitelisting] = useState(false);

  // Display Settings
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [defaultProjectView, setDefaultProjectView] = useState("grid");

  // Data Settings
  const [dataRetention, setDataRetention] = useState("365");
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataExportFormat, setDataExportFormat] = useState("csv");

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };

  const handleConnectAPI = (platform: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin access required to manage API connections",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "API Connection",
      description: `${platform} connection would be configured here. Connect Supabase to manage secure API keys.`,
    });
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            Admin access is required to view and modify settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your analytics dashboard and integrations
          </p>
        </div>
        <Badge className="bg-primary text-primary-foreground">
          Admin Panel
        </Badge>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="data">Data Import</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input
                      id="companyWebsite"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://www.company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyIndustry">Industry</Label>
                    <Select value={companyIndustry} onValueChange={setCompanyIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map(tz => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map(curr => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.code} ({curr.symbol}) - {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                        <SelectItem value="MM-DD-YYYY">MM-DD-YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Campaign Updates</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive campaign status updates via email
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Digest</Label>
                    <div className="text-sm text-muted-foreground">
                      Daily summary of all campaign performance
                    </div>
                  </div>
                  <Switch
                    checked={dailyDigest}
                    onCheckedChange={setDailyDigest}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <div className="text-sm text-muted-foreground">
                      Automated weekly performance reports
                    </div>
                  </div>
                  <Switch
                    checked={weeklyReports}
                    onCheckedChange={setWeeklyReports}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Performance Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Alerts for significant performance changes
                    </div>
                  </div>
                  <Switch
                    checked={performanceAlerts}
                    onCheckedChange={setPerformanceAlerts}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Push & Budget Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Browser Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Real-time browser push notifications
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Budget Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Alerts when campaigns exceed budget thresholds
                    </div>
                  </div>
                  <Switch
                    checked={budgetAlerts}
                    onCheckedChange={setBudgetAlerts}
                  />
                </div>

                {budgetAlerts && (
                  <div className="space-y-2 ml-4 p-4 bg-muted/50 rounded-lg">
                    <Label htmlFor="budgetThreshold">Budget Alert Threshold (%)</Label>
                    <Select value={budgetThreshold} onValueChange={setBudgetThreshold}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50% of budget</SelectItem>
                        <SelectItem value="70">70% of budget</SelectItem>
                        <SelectItem value="80">80% of budget</SelectItem>
                        <SelectItem value="90">90% of budget</SelectItem>
                        <SelectItem value="95">95% of budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Major Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Major Advertising Platforms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Google Ads</Label>
                    <div className="text-sm text-muted-foreground">
                      Search, Display, Shopping & YouTube campaigns
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {googleAdsConnected && (
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        Connected
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnectAPI("Google Ads")}
                    >
                      {googleAdsConnected ? "Reconnect" : "Connect"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Meta Ads (Facebook & Instagram)</Label>
                    <div className="text-sm text-muted-foreground">
                      Facebook and Instagram advertising campaigns
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {facebookAdsConnected && (
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        Connected
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnectAPI("Meta Ads")}
                    >
                      {facebookAdsConnected ? "Reconnect" : "Connect"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>LinkedIn Ads</Label>
                    <div className="text-sm text-muted-foreground">
                      LinkedIn Campaign Manager for B2B marketing
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {linkedinAdsConnected && (
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        Connected
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnectAPI("LinkedIn Ads")}
                    >
                      {linkedinAdsConnected ? "Reconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Additional Platforms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Microsoft Ads (Bing)</Label>
                    <div className="text-sm text-muted-foreground">
                      Bing search advertising campaigns
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bingAdsConnected && (
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        Connected
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnectAPI("Microsoft Ads")}
                    >
                      {bingAdsConnected ? "Reconnect" : "Connect"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Twitter Ads</Label>
                    <div className="text-sm text-muted-foreground">
                      Twitter advertising campaigns
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {twitterAdsConnected && (
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        Connected
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnectAPI("Twitter Ads")}
                    >
                      {twitterAdsConnected ? "Reconnect" : "Connect"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Snapchat Ads</Label>
                    <div className="text-sm text-muted-foreground">
                      Snapchat advertising for younger demographics
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {snapchatAdsConnected && (
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        Connected
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnectAPI("Snapchat Ads")}
                    >
                      {snapchatAdsConnected ? "Reconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Authentication Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <div className="text-sm text-muted-foreground">
                      Require 2FA for all user logins
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout</Label>
                    <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="72">3 days</SelectItem>
                        <SelectItem value="168">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                    <Select value={loginAttempts} onValueChange={setLoginAttempts}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Select value={passwordExpiry} onValueChange={setPasswordExpiry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="never">Never expire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Whitelisting</Label>
                    <div className="text-sm text-muted-foreground">
                      Restrict access to specific IP addresses
                    </div>
                  </div>
                  <Switch
                    checked={ipWhitelisting}
                    onCheckedChange={setIpWhitelisting}
                  />
                </div>

                {ipWhitelisting && (
                  <div className="space-y-2 ml-4 p-4 bg-muted/50 rounded-lg">
                    <Label htmlFor="ipAddresses">Allowed IP Addresses</Label>
                    <Textarea
                      id="ipAddresses"
                      placeholder="192.168.1.1&#10;10.0.0.1/24&#10;203.0.113.0/24"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter one IP address or CIDR block per line
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    View Security Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="display" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme & Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Use dark theme across the application
                    </div>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Reduce spacing for more content per screen
                    </div>
                  </div>
                  <Switch
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable smooth transitions and animations
                    </div>
                  </div>
                  <Switch
                    checked={animations}
                    onCheckedChange={setAnimations}
                  />
                </div>
              </CardContent>
            </Card>

            {/* View Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  View Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultProjectView">Default Project View</Label>
                  <Select value={defaultProjectView} onValueChange={setDefaultProjectView}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid View</SelectItem>
                      <SelectItem value="list">List View</SelectItem>
                      <SelectItem value="table">Table View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataImport />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;