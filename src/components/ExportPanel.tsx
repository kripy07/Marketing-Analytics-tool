import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, Table, BarChart3 } from "lucide-react";
import { useState } from "react";

interface ExportPanelProps {
  onExport: (format: string, fields: string[]) => void;
}

export function ExportPanel({ onExport }: ExportPanelProps) {
  const [exportFormat, setExportFormat] = useState("csv");
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "name", "status", "budget", "spent", "conversions", "clicks"
  ]);

  const availableFields = [
    { id: "name", label: "Campaign Name" },
    { id: "status", label: "Status" },
    { id: "budget", label: "Budget" },
    { id: "spent", label: "Amount Spent" },
    { id: "target", label: "Target" },
    { id: "achieved", label: "Achieved" },
    { id: "conversions", label: "Conversions" },
    { id: "clicks", label: "Clicks" },
    { id: "cpa", label: "Cost Per Acquisition" },
    { id: "ctr", label: "Click Through Rate" },
    { id: "conversionRate", label: "Conversion Rate" },
    { id: "roi", label: "Return on Investment" }
  ];

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(f => f !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleExport = () => {
    onExport(exportFormat, selectedFields);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  CSV File
                </div>
              </SelectItem>
              <SelectItem value="xlsx">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Excel File
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  PDF Report
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Field Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Include Fields</label>
            <Badge variant="secondary">
              {selectedFields.length} selected
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {availableFields.map((field) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={selectedFields.includes(field.id)}
                  onCheckedChange={() => handleFieldToggle(field.id)}
                />
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Selection Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedFields(availableFields.map(f => f.id))}
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedFields([])}
          >
            Select None
          </Button>
        </div>

        {/* Export Button */}
        <Button 
          onClick={handleExport}
          className="w-full"
          disabled={selectedFields.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export {exportFormat.toUpperCase()}
        </Button>
      </CardContent>
    </Card>
  );
}