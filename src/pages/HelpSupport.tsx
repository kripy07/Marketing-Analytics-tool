import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Search,
  Send,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Video,
  FileText,
  Mail,
  Phone,
  Clock
} from "lucide-react";

export function HelpSupport() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [supportTicket, setSupportTicket] = useState({
    subject: "",
    category: "",
    priority: "",
    description: ""
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSubmitTicket = () => {
    if (!supportTicket.subject || !supportTicket.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Support Ticket Submitted",
      description: "We'll get back to you within 24 hours. Ticket #MT-2024-001",
    });

    setSupportTicket({
      subject: "",
      category: "",
      priority: "",
      description: ""
    });
  };

  const faqs = [
    {
      question: "How do I connect my advertising accounts?",
      answer: "Go to Settings > Integrations and click 'Connect Account' for your platform. You'll need admin access to your ad accounts. Follow the OAuth flow to authorize the connection."
    },
    {
      question: "Why are my campaign metrics not updating?",
      answer: "Metrics typically update every 4-6 hours. Check your ad account connection status in Settings > Integrations. If the issue persists, try reconnecting your account or check if you have the required permissions."
    },
    {
      question: "How do I create custom reports?",
      answer: "Navigate to Reports > Create New Report. Select your desired metrics, dimensions, and date range. You can save and schedule reports for automatic delivery."
    },
    {
      question: "What's the difference between user roles?",
      answer: "Admins have full access to all features including settings, user management, and billing. Editors can create and modify campaigns but can't access admin settings. Viewers can only view reports and dashboards."
    },
    {
      question: "How do I set up automated alerts?",
      answer: "Go to Alerts > Create Alert. Define your conditions (spend threshold, performance drops, etc.) and choose notification methods. Alerts are checked every hour and sent via email or push notifications."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! Go to Reports > Export Data or Account Settings > Data & Privacy > Export All Data. You can export in CSV, Excel, or JSON formats."
    }
  ];

  const quickLinks = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough for new users",
      href: "/docs/getting-started",
      icon: Book
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      href: "/docs/tutorials",
      icon: Video
    },
    {
      title: "API Documentation",
      description: "Integration and API reference",
      href: "/docs/api",
      icon: FileText
    },
    {
      title: "Feature Updates",
      description: "Latest features and improvements",
      href: "/docs/updates",
      icon: Lightbulb
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions, browse our documentation, or get in touch with our support team
          </p>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              System Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Search our knowledge base for quick answers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFaqs.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No FAQs found matching "{searchQuery}". Try different keywords or contact support.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickLinks.map((link, index) => (
                <Card key={index} className="group hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <link.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span>{link.title}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Popular Articles</CardTitle>
                <CardDescription>
                  Most viewed help articles this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Setting up Facebook Ads integration", views: "2.1k views" },
                    { title: "Understanding attribution models", views: "1.8k views" },
                    { title: "Creating custom dashboards", views: "1.5k views" },
                    { title: "Troubleshooting data sync issues", views: "1.2k views" },
                    { title: "Managing team permissions", views: "980 views" }
                  ].map((article, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{article.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{article.views}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>
                    Get instant help from our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="default" className="mb-2">Available 9 AM - 6 PM EST</Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    Average response time: 2 minutes
                  </p>
                  <Button className="w-full">
                    Start Live Chat
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription>
                    Send us a detailed message
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="secondary" className="mb-2">24/7 Support</Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    Average response time: 4 hours
                  </p>
                  <Button variant="outline" className="w-full">
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Phone Support</CardTitle>
                  <CardDescription>
                    Speak directly with our team
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="outline" className="mb-2">Enterprise Only</Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    Available for Enterprise customers
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Upgrade Required
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>
                  Describe your issue and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={supportTicket.subject}
                      onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={supportTicket.category} onValueChange={(value) => setSupportTicket({...supportTicket, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="account">Account Management</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="integration">Integration Help</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={supportTicket.priority} onValueChange={(value) => setSupportTicket({...supportTicket, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General question</SelectItem>
                      <SelectItem value="medium">Medium - Minor issue</SelectItem>
                      <SelectItem value="high">High - Major issue</SelectItem>
                      <SelectItem value="urgent">Urgent - System down</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide as much detail as possible about your issue, including steps to reproduce if applicable..."
                    rows={6}
                    value={supportTicket.description}
                    onChange={(e) => setSupportTicket({...supportTicket, description: e.target.value})}
                  />
                </div>

                <Button onClick={handleSubmitTicket} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  System Status - All Systems Operational
                </CardTitle>
                <CardDescription>
                  Real-time status of our services and infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { service: "Analytics Dashboard", status: "operational", uptime: "99.9%" },
                    { service: "Data Processing", status: "operational", uptime: "99.8%" },
                    { service: "API Services", status: "operational", uptime: "99.9%" },
                    { service: "Ad Platform Integrations", status: "operational", uptime: "99.7%" },
                    { service: "Report Generation", status: "operational", uptime: "99.6%" },
                    { service: "Email Notifications", status: "operational", uptime: "99.9%" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'operational' ? 'bg-green-500' : 
                          item.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">{item.service}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {item.uptime} uptime
                        </span>
                        <Badge 
                          variant={item.status === 'operational' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Recent Incidents</h3>
                  <p className="text-sm text-muted-foreground">
                    No recent incidents to report. Check our status page for historical data and maintenance schedules.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Status Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}