export const mockCampaigns = [
  {
    name: "Holiday Shopping Campaign",
    status: "active" as const,
    budget: 50000,
    spent: 42000,
    target: 1000,
    achieved: 1150,
    conversions: 1150,
    clicks: 23400,
    startDate: "2024-01-15",
    endDate: "2024-02-15"
  },
  {
    name: "Q1 Brand Awareness",
    status: "completed" as const,
    budget: 35000,
    spent: 33500,
    target: 750,
    achieved: 692,
    conversions: 692,
    clicks: 18200,
    startDate: "2024-01-01",
    endDate: "2024-01-31"
  },
  {
    name: "Product Launch Campaign",
    status: "active" as const,
    budget: 75000,
    spent: 45000,
    target: 1500,
    achieved: 1280,
    conversions: 1280,
    clicks: 31500,
    startDate: "2024-02-01",
    endDate: "2024-03-01"
  },
  {
    name: "Retargeting Campaign",
    status: "paused" as const,
    budget: 25000,
    spent: 18000,
    target: 500,
    achieved: 420,
    conversions: 420,
    clicks: 8900,
    startDate: "2024-01-20",
    endDate: "2024-02-20"
  },
  {
    name: "Summer Promo Campaign",
    status: "active" as const,
    budget: 60000,
    spent: 28000,
    target: 1200,
    achieved: 980,
    conversions: 980,
    clicks: 19600,
    startDate: "2024-02-10",
    endDate: "2024-03-10"
  },
  {
    name: "Mobile App Install",
    status: "completed" as const,
    budget: 40000,
    spent: 39200,
    target: 800,
    achieved: 856,
    conversions: 856,
    clicks: 16800,
    startDate: "2024-01-05",
    endDate: "2024-02-05"
  }
];

export const comparisonData = [
  { name: "Impressions", current: 245000, previous: 198000 },
  { name: "Clicks", current: 12400, previous: 9800 },
  { name: "Conversions", current: 1240, previous: 980 },
  { name: "Revenue", current: 48000, previous: 38000 },
];

export const weeklyPerformance = [
  { name: "Week 1", current: 8400, previous: 6200 },
  { name: "Week 2", current: 9200, previous: 7100 },
  { name: "Week 3", current: 11800, previous: 8900 },
  { name: "Week 4", current: 13600, previous: 10200 },
];

export const budgetUtilization = [
  { name: "Search Ads", current: 28000, previous: 24000 },
  { name: "Display", current: 18000, previous: 16000 },
  { name: "Social Media", current: 22000, previous: 19000 },
  { name: "Video", current: 15000, previous: 12000 },
];