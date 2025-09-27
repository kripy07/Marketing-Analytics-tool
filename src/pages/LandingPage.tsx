import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Shield, 
  Zap, 
  Users, 
  Database, 
  FileSpreadsheet,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Database,
      title: "Multi-channel Data Aggregation",
      description: "Connect all your marketing channels in one dashboard. Google Ads, Facebook, email campaigns, and more.",
      image: "/api/placeholder/400/300"
    },
    {
      icon: TrendingUp,
      title: "Advanced Attribution Models",
      description: "Understand the full customer journey with first-touch, last-touch, and multi-touch attribution.",
      image: "/api/placeholder/400/300"
    },
    {
      icon: Shield,
      title: "Real-time Alerts & Thresholds",
      description: "Never miss critical changes. Set custom alerts for budget, performance, and conversion thresholds.",
      image: "/api/placeholder/400/300"
    },
    {
      icon: FileSpreadsheet,
      title: "Flexible Data Export",
      description: "Export to CSV, Excel, or connect via API. Your data, your way, whenever you need it.",
      image: "/api/placeholder/400/300"
    }
  ];

  const useCases = [
    {
      title: "E-commerce Brands",
      description: "Track ROAS across multiple channels, optimize product campaigns, and scale profitable ad spend.",
      metrics: "Average 34% increase in ROAS"
    },
    {
      title: "Marketing Agencies",
      description: "Manage multiple client accounts, create white-label reports, and prove campaign effectiveness.",
      metrics: "Save 15+ hours per week on reporting"
    },
    {
      title: "SaaS Companies",
      description: "Monitor customer acquisition costs, track lifecycle value, and optimize conversion funnels.",
      metrics: "Reduce CAC by up to 28%"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director, TechFlow",
      content: "Analytics Pro transformed how we track our campaigns. ROI visibility across all channels in one place.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Agency Owner, GrowthLab",
      content: "Our clients love the automated reports. We've saved 20 hours per week and improved client retention.",
      rating: 5
    },
    {
      name: "Lisa Park",
      role: "CMO, EcoShop",
      content: "The attribution modeling helped us discover our most profitable channels. 40% budget reallocation resulted.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$49",
      period: "per month",
      description: "Perfect for small businesses and startups",
      features: [
        "Up to 3 marketing channels",
        "Basic attribution models",
        "Email alerts",
        "CSV export",
        "7-day data retention"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$149",
      period: "per month",
      description: "Ideal for growing businesses and agencies",
      features: [
        "Unlimited marketing channels",
        "Advanced attribution models",
        "Real-time alerts & thresholds",
        "API access & webhooks",
        "90-day data retention",
        "White-label reports",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations with complex needs",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Unlimited data retention",
        "Advanced security & compliance",
        "Dedicated account manager",
        "Custom training & onboarding",
        "SLA guarantee"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Analytics Pro</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#resources" className="text-muted-foreground hover:text-foreground transition-colors">Resources</a>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>Login</Button>
              <Button onClick={() => navigate('/dashboard')}>Get Started</Button>
            </nav>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-muted-foreground">Features</a>
                <a href="#pricing" className="text-muted-foreground">Pricing</a>
                <a href="#resources" className="text-muted-foreground">Resources</a>
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="justify-start">Login</Button>
                <Button onClick={() => navigate('/dashboard')} className="justify-start">Get Started</Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent leading-tight">
              One dashboard for all your marketing campaigns
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Track ROI, budget & growth in real time. Stop switching between tools and get the complete picture of your marketing performance.
            </p>

            {/* Value Props */}
            <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 text-left">
                <Database className="h-8 w-8 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">Multi-channel aggregation</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <TrendingUp className="h-8 w-8 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">Attribution models</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Shield className="h-8 w-8 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">Alerts & thresholds</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <FileSpreadsheet className="h-8 w-8 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">CSV/API export</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/dashboard')}>
                Try Free for 14 Days
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Setup in 5 minutes • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to scale your marketing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to give you complete control over your marketing data and performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {features.map((feature, index) => (
              <div key={index} className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                <Card className="p-8 h-full">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-lg">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for every type of business</h2>
            <p className="text-xl text-muted-foreground">
              From startups to enterprises, see how teams use Analytics Pro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-8">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <CardDescription className="text-base">{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {useCase.metrics}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by marketing teams worldwide</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`p-8 relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate('/dashboard')}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-muted/50 border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Analytics Pro</span>
              </div>
              <p className="text-muted-foreground">
                The complete marketing analytics platform for growing businesses.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">GDPR</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Analytics Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;