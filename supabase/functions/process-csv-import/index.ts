import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CampaignData {
  name: string;
  platform?: string;
  status?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  [key: string]: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { campaigns, organizationId } = await req.json();

    console.log(`Starting CSV import for org ${organizationId}: ${campaigns.length} campaigns`);

    // Process in batches to avoid timeouts
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < campaigns.length; i += batchSize) {
      const batch = campaigns.slice(i, i + batchSize);
      
      try {
        const { data: insertedCampaigns, error: insertError } = await supabaseClient
          .from('campaigns')
          .insert(
            batch.map((campaign: CampaignData) => ({
              organization_id: organizationId,
              name: campaign.name,
              platform_campaign_id: campaign.platform_campaign_id || null,
              status: campaign.status || 'active',
              budget: campaign.budget || null,
              start_date: campaign.start_date || null,
              end_date: campaign.end_date || null,
              utm_source: campaign.utm_source || null,
              utm_medium: campaign.utm_medium || null,
              utm_campaign: campaign.utm_campaign || null,
            }))
          )
          .select();

        if (insertError) {
          console.error(`Batch ${i / batchSize + 1} error:`, insertError);
          errorCount += batch.length;
          errors.push(`Batch ${i / batchSize + 1}: ${insertError.message}`);
          continue;
        }

        // Process metrics if available
        if (insertedCampaigns && insertedCampaigns.length > 0) {
          const metricsToInsert = [];
          
          for (let j = 0; j < batch.length; j++) {
            const campaign = batch[j];
            const insertedCampaign = insertedCampaigns[j];
            
            if (campaign.impressions || campaign.clicks || campaign.conversions || campaign.spend || campaign.revenue) {
              metricsToInsert.push({
                campaign_id: insertedCampaign.id,
                date: campaign.date || new Date().toISOString().split('T')[0],
                impressions: campaign.impressions || 0,
                clicks: campaign.clicks || 0,
                conversions: campaign.conversions || 0,
                spend: campaign.spend || 0,
                revenue: campaign.revenue || 0,
              });
            }
          }

          if (metricsToInsert.length > 0) {
            const { error: metricsError } = await supabaseClient
              .from('campaign_metrics')
              .insert(metricsToInsert);

            if (metricsError) {
              console.error(`Metrics error for batch ${i / batchSize + 1}:`, metricsError);
            }
          }
        }

        successCount += batch.length;
        console.log(`Processed batch ${i / batchSize + 1}: ${batch.length} campaigns`);
        
      } catch (batchError: any) {
        console.error(`Batch ${i / batchSize + 1} processing error:`, batchError);
        errorCount += batch.length;
        errors.push(`Batch ${i / batchSize + 1}: ${batchError.message}`);
      }
    }

    console.log(`Import completed: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: successCount,
        errors: errorCount,
        errorMessages: errors.length > 0 ? errors.slice(0, 5) : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('CSV import error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
