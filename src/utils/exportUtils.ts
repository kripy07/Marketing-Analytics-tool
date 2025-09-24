interface CampaignData {
  name: string;
  status: string;
  budget: number;
  spent: number;
  target: number;
  achieved: number;
  conversions: number;
  clicks: number;
  startDate: string;
  endDate: string;
}

export function exportToCSV(data: CampaignData[], selectedFields: string[]): void {
  // Create headers
  const fieldLabels: Record<string, string> = {
    name: "Campaign Name",
    status: "Status",
    budget: "Budget",
    spent: "Amount Spent",
    target: "Target",
    achieved: "Achieved",
    conversions: "Conversions",
    clicks: "Clicks",
    cpa: "Cost Per Acquisition",
    ctr: "Click Through Rate",
    conversionRate: "Conversion Rate",
    roi: "Return on Investment"
  };

  const headers = selectedFields.map(field => fieldLabels[field] || field);
  
  // Create rows
  const rows = data.map(campaign => {
    return selectedFields.map(field => {
      switch (field) {
        case "name":
          return campaign.name;
        case "status":
          return campaign.status;
        case "budget":
          return `$${campaign.budget.toLocaleString()}`;
        case "spent":
          return `$${campaign.spent.toLocaleString()}`;
        case "target":
          return campaign.target.toLocaleString();
        case "achieved":
          return campaign.achieved.toLocaleString();
        case "conversions":
          return campaign.conversions.toLocaleString();
        case "clicks":
          return campaign.clicks.toLocaleString();
        case "cpa":
          return `$${(campaign.spent / campaign.conversions).toFixed(2)}`;
        case "ctr":
          return `${((campaign.clicks / 100000) * 100).toFixed(2)}%`; // Mock CTR
        case "conversionRate":
          return `${((campaign.conversions / campaign.clicks) * 100).toFixed(2)}%`;
        case "roi":
          return `${(((campaign.conversions * 100 - campaign.spent) / campaign.spent) * 100).toFixed(1)}%`; // Mock ROI
        default:
          return "";
      }
    });
  });

  // Convert to CSV
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(","))
    .join("\n");

  // Download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `campaign-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(data: CampaignData[], selectedFields: string[]): void {
  // For now, we'll create a simple HTML report and print it
  // In a real implementation, you'd use a library like jsPDF
  const fieldLabels: Record<string, string> = {
    name: "Campaign Name",
    status: "Status",
    budget: "Budget",
    spent: "Amount Spent",
    target: "Target",
    achieved: "Achieved",
    conversions: "Conversions",
    clicks: "Clicks",
    cpa: "Cost Per Acquisition",
    ctr: "Click Through Rate",
    conversionRate: "Conversion Rate",
    roi: "Return on Investment"
  };

  const htmlContent = `
    <html>
      <head>
        <title>Campaign Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #f8f9fa; font-weight: bold; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          .date { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>Marketing Campaign Report</h1>
        <p class="date">Generated on: ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              ${selectedFields.map(field => `<th>${fieldLabels[field] || field}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data.map(campaign => `
              <tr>
                ${selectedFields.map(field => {
                  let value = "";
                  switch (field) {
                    case "name": value = campaign.name; break;
                    case "status": value = campaign.status; break;
                    case "budget": value = `$${campaign.budget.toLocaleString()}`; break;
                    case "spent": value = `$${campaign.spent.toLocaleString()}`; break;
                    case "target": value = campaign.target.toLocaleString(); break;
                    case "achieved": value = campaign.achieved.toLocaleString(); break;
                    case "conversions": value = campaign.conversions.toLocaleString(); break;
                    case "clicks": value = campaign.clicks.toLocaleString(); break;
                    case "cpa": value = `$${(campaign.spent / campaign.conversions).toFixed(2)}`; break;
                    case "ctr": value = `${((campaign.clicks / 100000) * 100).toFixed(2)}%`; break;
                    case "conversionRate": value = `${((campaign.conversions / campaign.clicks) * 100).toFixed(2)}%`; break;
                    case "roi": value = `${(((campaign.conversions * 100 - campaign.spent) / campaign.spent) * 100).toFixed(1)}%`; break;
                  }
                  return `<td>${value}</td>`;
                }).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  // Open in new window and trigger print
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}