import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

export interface CampaignImportRow {
  name: string;
  status?: string;
  budget?: number;
  spend?: number;
  clicks?: number;
  impressions?: number;
  conversions?: number;
  revenue?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
  platform_campaign_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export async function parseExcelOrCSV(file: File): Promise<CampaignImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<any>(firstSheet);
        
        // Normalize column names (convert to lowercase and replace spaces with underscores)
        const normalizedData = jsonData.map((row: any) => {
          const normalizedRow: any = {};
          Object.keys(row).forEach(key => {
            const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
            normalizedRow[normalizedKey] = row[key];
          });
          return normalizedRow as CampaignImportRow;
        });
        
        resolve(normalizedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export async function importCampaignsToDatabase(
  data: CampaignImportRow[],
  organizationId: string
): Promise<{ success: number; failed: number; errors: string[] }> {
  // For large imports (>100 rows), use background processing via Edge Function
  if (data.length > 100) {
    try {
      const { data: result, error } = await supabase.functions.invoke('process-csv-import', {
        body: {
          campaigns: data,
          organizationId,
        },
      });

      if (error) throw error;
      
      return {
        success: result.success || 0,
        failed: result.errors || 0,
        errors: result.errorMessages || [],
      };
    } catch (error: any) {
      console.error('Background import failed, falling back to direct import:', error);
      // Fall through to direct import on error
    }
  }

  // Direct import for small datasets (<= 100 rows)
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const row of data) {
    try {
      if (!row.name) {
        errors.push(`Row skipped: Campaign name is required`);
        failed++;
        continue;
      }

      const campaignData: any = {
        organization_id: organizationId,
        name: row.name,
        status: (row.status?.toLowerCase() || 'active') as any,
        budget: row.budget || null,
        start_date: row.start_date || row.date || null,
        end_date: row.end_date || null,
        platform_campaign_id: row.platform_campaign_id || null,
        utm_source: row.utm_source || null,
        utm_medium: row.utm_medium || null,
        utm_campaign: row.utm_campaign || row.name,
      };

      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .upsert(campaignData, {
          onConflict: 'platform_campaign_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (campaignError) {
        errors.push(`Failed to import "${row.name}": ${campaignError.message}`);
        failed++;
        continue;
      }

      if (campaign && (row.spend || row.clicks || row.impressions || row.conversions || row.revenue)) {
        const metricsData = {
          campaign_id: campaign.id,
          date: row.date || new Date().toISOString().split('T')[0],
          spend: row.spend || 0,
          clicks: row.clicks || 0,
          impressions: row.impressions || 0,
          conversions: row.conversions || 0,
          revenue: row.revenue || 0,
        };

        const { error: metricsError } = await supabase
          .from('campaign_metrics')
          .upsert(metricsData, {
            onConflict: 'campaign_id,date',
            ignoreDuplicates: false
          });

        if (metricsError) {
          errors.push(`Campaign "${row.name}" imported but metrics failed: ${metricsError.message}`);
        }
      }

      success++;
    } catch (error: any) {
      errors.push(`Error importing "${row.name}": ${error.message}`);
      failed++;
    }
  }

  return { success, failed, errors };
}

export function generateTemplateCSV(): string {
  const headers = [
    'Campaign Name',
    'Status',
    'Budget',
    'Spend',
    'Clicks',
    'Impressions',
    'Conversions',
    'Revenue',
    'Date',
    'Start Date',
    'End Date',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign'
  ];
  
  const sampleData = [
    [
      'Summer Sale 2024',
      'active',
      '5000',
      '3500',
      '1250',
      '45000',
      '85',
      '12500',
      '2024-01-15',
      '2024-01-01',
      '2024-01-31',
      'google',
      'cpc',
      'summer_sale'
    ],
    [
      'Brand Awareness Q1',
      'active',
      '3000',
      '2100',
      '980',
      '32000',
      '45',
      '8900',
      '2024-01-15',
      '2024-01-01',
      '2024-03-31',
      'facebook',
      'social',
      'brand_awareness'
    ]
  ];

  const csvContent = [
    headers.join(','),
    ...sampleData.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

export function downloadTemplate() {
  const csv = generateTemplateCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'campaign_import_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
