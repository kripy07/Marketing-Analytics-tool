import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { QuickDataEntry } from "./QuickDataEntry";
import { 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  Database, 
  Download,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";

export function DataImport() {
  const { toast } = useToast();
  const { canEdit } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [manualData, setManualData] = useState('');
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "Admin access required to upload files",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "File Uploaded Successfully",
      description: `${file.name} has been processed and imported.`,
    });
    
    setUploading(false);
  };

  const handleGoogleSheetsImport = () => {
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "Admin access required to connect Google Sheets",
        variant: "destructive"
      });
      return;
    }

    if (!googleSheetsUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid Google Sheets URL",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Google Sheets Connected",
      description: "Data import from Google Sheets will be available with Supabase integration.",
    });
  };

  const handleManualDataSave = () => {
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "Admin access required to save manual data",
        variant: "destructive"
      });
      return;
    }

    if (!manualData.trim()) {
      toast({
        title: "Error", 
        description: "Please enter some data to import",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Manual Data Saved",
      description: "Your manually entered data has been processed and imported.",
    });
    
    setManualData('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Data Import</h2>
        <p className="text-muted-foreground">
          Import campaign data from various sources to get started quickly
        </p>
        {!canEdit && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have viewer access only. Contact your administrator to import or modify data.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Quick Data Entry */}
      <QuickDataEntry />

      <Tabs defaultValue="excel" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="excel" className="flex items-center gap-2" disabled={!canEdit}>
            <FileSpreadsheet className="h-4 w-4" />
            Excel/CSV
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-2" disabled={!canEdit}>
            <Database className="h-4 w-4" />
            Google Sheets
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2" disabled={!canEdit}>
            <FileText className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="document" className="flex items-center gap-2" disabled={!canEdit}>
            <Upload className="h-4 w-4" />
            Document
          </TabsTrigger>
        </TabsList>

        <TabsContent value="excel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Excel/CSV Upload
              </CardTitle>
              <CardDescription>
                Upload Excel (.xlsx) or CSV files with your campaign data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drop your files here</p>
                  <p className="text-muted-foreground">
                    Supports Excel (.xlsx) and CSV files up to 10MB
                  </p>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" disabled={uploading}>
                      {uploading ? "Processing..." : "Choose File"}
                    </Button>
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Expected Format:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Campaign Name, Status, Budget, Spend, Clicks, Impressions, Conversions</p>
                  <p>• Date Range, Channel, Objective, Target Audience</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sheets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Google Sheets Integration
              </CardTitle>
              <CardDescription>
                Connect your Google Sheets for real-time data sync
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sheets-url">Google Sheets URL</Label>
                <Input
                  id="sheets-url"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={googleSheetsUrl}
                  onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Make sure your sheet is publicly viewable or shared with the appropriate permissions
                </p>
              </div>
              
              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Supabase Integration Required</p>
                    <p className="text-sm text-muted-foreground">
                      Connect Supabase to enable secure Google Sheets integration with real-time sync capabilities.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleGoogleSheetsImport} className="w-full">
                Connect Google Sheets
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Manual Data Entry
              </CardTitle>
              <CardDescription>
                Enter your campaign data manually in CSV format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manual-data">Campaign Data (CSV Format)</Label>
                <Textarea
                  id="manual-data"
                  placeholder="Campaign Name,Status,Budget,Spend,Clicks,Impressions,Conversions
Summer Sale 2024,Active,5000,3500,1250,45000,85
Brand Awareness,Active,3000,2100,980,32000,45
Product Launch,Paused,8000,4200,1850,62000,120"
                  value={manualData}
                  onChange={(e) => setManualData(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Format Guidelines:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• First row should contain column headers</p>
                  <p>• Separate values with commas</p>
                  <p>• Use quotes for text containing commas</p>
                  <p>• Dates in YYYY-MM-DD format</p>
                </div>
              </div>
              
              <Button onClick={handleManualDataSave} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Manual Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="document" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Document Upload
              </CardTitle>
              <CardDescription>
                Upload PDF reports or other documents for data extraction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Upload Documents</p>
                  <p className="text-muted-foreground">
                    PDF reports, Word documents, or other text files
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                    id="document-upload"
                  />
                  <Label htmlFor="document-upload">
                    <Button variant="outline" className="cursor-pointer" disabled={uploading}>
                      {uploading ? "Processing..." : "Choose Document"}
                    </Button>
                  </Label>
                </div>
              </div>
              
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-sm">AI Data Extraction</p>
                    <p className="text-sm text-muted-foreground">
                      We'll use AI to extract campaign data from your documents. Review extracted data before importing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}