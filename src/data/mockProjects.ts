export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed";
  type: "E-commerce" | "SaaS" | "Lead Gen" | "Brand" | "Mobile App";
  campaignCount: number;
  totalBudget: number;
  lastActivity: string;
  avatar?: string;
  createdAt: string;
  owner: string;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Growth",
    description: "Complete marketing analytics for our online store, tracking conversions, revenue, and customer acquisition across all channels.",
    status: "active",
    type: "E-commerce",
    campaignCount: 12,
    totalBudget: 85000,
    lastActivity: "2 hours ago",
    createdAt: "2024-01-15",
    owner: "Sarah Chen"
  },
  {
    id: "2", 
    name: "SaaS Launch Campaign",
    description: "Product launch analytics for our new SaaS platform, focusing on trial conversions and user acquisition metrics.",
    status: "active",
    type: "SaaS",
    campaignCount: 8,
    totalBudget: 45000,
    lastActivity: "1 day ago",
    createdAt: "2024-02-01",
    owner: "Mike Johnson"
  },
  {
    id: "3",
    name: "Lead Generation Hub",
    description: "B2B lead generation campaign analytics, tracking MQLs, SQLs, and conversion rates across LinkedIn, Google, and email campaigns.",
    status: "active",
    type: "Lead Gen",
    campaignCount: 6,
    totalBudget: 32000,
    lastActivity: "3 hours ago",
    createdAt: "2024-01-28",
    owner: "Emily Rodriguez"
  },
  {
    id: "4",
    name: "Brand Awareness Q1",
    description: "Brand awareness campaign analysis for Q1, measuring reach, engagement, and brand sentiment across social media channels.",
    status: "completed",
    type: "Brand",
    campaignCount: 15,
    totalBudget: 125000,
    lastActivity: "1 week ago",
    createdAt: "2024-01-01",
    owner: "David Kim"
  },
  {
    id: "5",
    name: "Mobile App Install",
    description: "Mobile app install campaign tracking with focus on cost per install, retention rates, and in-app conversion metrics.",
    status: "paused",
    type: "Mobile App",
    campaignCount: 9,
    totalBudget: 28000,
    lastActivity: "5 days ago",
    createdAt: "2024-02-10",
    owner: "Lisa Zhang"
  },
  {
    id: "6",
    name: "Holiday Campaign 2024",
    description: "Seasonal marketing analytics for holiday campaigns, tracking performance across Black Friday, Cyber Monday, and Christmas promotions.",
    status: "active",
    type: "E-commerce",
    campaignCount: 18,
    totalBudget: 95000,
    lastActivity: "30 minutes ago",
    createdAt: "2024-02-15",
    owner: "Alex Thompson"
  }
];