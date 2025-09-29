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
  X,
  Sparkles,
  Award,
  Globe,
  Lock,
  Clock,
  Smartphone
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-dashboard.jpg";
import heroBg from "@/assets/hero-background.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
              <Button variant="ghost" onClick={() => navigate(user ? '/dashboard' : '/auth')}>
                {user ? 'Dashboard' : 'Login'}
              </Button>
              <Button onClick={() => navigate(user ? '/dashboard' : '/auth')}>
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Button>
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
                <Button variant="ghost" onClick={() => navigate(user ? '/dashboard' : '/auth')} className="justify-start">
                  {user ? 'Dashboard' : 'Login'}
                </Button>
                <Button onClick={() => navigate(user ? '/dashboard' : '/auth')} className="justify-start">
                  {user ? 'Go to Dashboard' : 'Get Started'}
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
          
          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-16 h-16 bg-primary/20 rounded-full animate-float" />
          <div className="absolute top-40 right-32 w-8 h-8 bg-purple-400/30 rounded-full animate-bounce-gentle" />
          <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-blue-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className={`max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-shimmer bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 bg-[length:200%_100%]">
              <Sparkles className="h-4 w-4" />
              Trusted by 10,000+ marketing teams worldwide
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent leading-tight">
              One dashboard for all your marketing campaigns
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Track ROI, budget & growth in real time. Stop switching between tools and get the complete picture of your marketing performance with AI-powered insights.
            </p>

            {/* Value Props with enhanced design */}
            <div className="grid md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
              {[
                { icon: Database, text: "Multi-channel aggregation", color: "text-blue-500" },
                { icon: TrendingUp, text: "AI-powered insights", color: "text-green-500" },
                { icon: Shield, text: "Real-time alerts", color: "text-purple-500" },
                { icon: FileSpreadsheet, text: "Instant exports", color: "text-orange-500" }
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-3 text-left p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-soft ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-foreground font-semibold text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Enhanced CTAs */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105 animate-glow" 
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
              >
                {user ? 'Go to Dashboard' : 'Start Free 14-Day Trial'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-10 py-7 bg-white/50 backdrop-blur-sm border-2 hover:bg-white/80 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch 2-Min Demo
              </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Setup in 5 minutes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`mt-20 relative max-w-6xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-primary/20 to-purple-500/20 p-1">
              <img 
                src={heroImage} 
                alt="Analytics Pro Dashboard" 
                className="w-full h-auto rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl" />
            </div>
            
            {/* Floating testimonial cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg p-4 shadow-xl animate-float hidden lg:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs font-medium">5.0</span>
              </div>
              <p className="text-xs text-muted-foreground">"Increased our ROAS by 40%"</p>
              <p className="text-xs font-medium">Sarah, Marketing Director</p>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg p-4 shadow-xl animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">$2.4M</span>
              </div>
              <p className="text-xs text-muted-foreground">Ad spend optimized</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">Everything you need to scale your marketing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed to give you complete control over your marketing data and performance with enterprise-grade security.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {features.map((feature, index) => (
              <div key={index} className={`animate-fade-in ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`} style={{ animationDelay: `${index * 0.2}s` }}>
                <Card className="p-10 h-full group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50/50 hover:scale-105">
                  <CardHeader className="pb-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:animate-bounce-gentle shadow-glow">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-display font-bold mb-4">{feature.title}</CardTitle>
                    <CardDescription className="text-lg leading-relaxed text-muted-foreground">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-primary">
                      <ArrowRight className="h-4 w-4" />
                      <span className="font-medium">Learn more about {feature.title.toLowerCase()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-32 grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Active Users", icon: Users },
              { number: "$50M+", label: "Ad Spend Managed", icon: TrendingUp },
              { number: "99.9%", label: "Uptime SLA", icon: Shield },
              { number: "24/7", label: "Expert Support", icon: Clock }
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold font-display text-foreground mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Use Cases */}
      <section className="py-32 bg-gradient-to-br from-background to-primary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target className="h-4 w-4" />
              Success Stories
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">Built for every type of business</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From startups to enterprises, see how marketing teams use Analytics Pro to drive growth and maximize ROI.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-8 group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50/50 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader className="pb-6">
                  <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center mb-4 group-hover:animate-bounce-gentle">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-display font-bold mb-3">{useCase.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20 px-3 py-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {useCase.metrics}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Customer Stories
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">Loved by marketing teams worldwide</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of marketing professionals who trust Analytics Pro to optimize their campaigns and drive growth.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50/50 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="pt-6">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-20 flex flex-wrap justify-center items-center gap-12 opacity-60">
            {['SOC 2', 'GDPR', 'ISO 27001', 'PCI DSS'].map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5" />
                <span className="font-medium">{badge} Compliant</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing */}
      <section id="pricing" className="py-32 bg-gradient-to-br from-background to-primary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-info/10 text-info px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Flexible Pricing
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your business needs. Start free, upgrade when you're ready to scale.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`p-10 relative group transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50/50 hover:scale-105 animate-fade-in ${plan.popular ? 'ring-2 ring-primary shadow-2xl scale-105' : 'hover:shadow-2xl'}`} style={{ animationDelay: `${index * 0.2}s` }}>
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white px-6 py-2 text-sm font-semibold shadow-glow animate-glow">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-soft ${plan.popular ? 'bg-gradient-primary' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                    {plan.name === 'Starter' && <Smartphone className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-primary'}`} />}
                    {plan.name === 'Professional' && <Globe className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-primary'}`} />}
                    {plan.name === 'Enterprise' && <Shield className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-primary'}`} />}
                  </div>
                  <CardTitle className="text-3xl font-display font-bold mb-3">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-bold font-display">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-muted-foreground text-lg">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="text-base text-muted-foreground">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full py-6 text-base font-semibold transition-all duration-300 ${plan.popular ? 'bg-gradient-primary hover:shadow-glow transform hover:scale-105' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate(user ? '/dashboard' : '/auth')}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : (user ? "Upgrade Now" : "Start Free Trial")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6">
              All plans include 14-day free trial • No setup fees • Cancel anytime
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>Global CDN</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-20 bg-gradient-to-br from-muted/50 to-background border-t">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold font-display">Analytics Pro</span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
                The complete marketing analytics platform for growing businesses. Track, optimize, and scale your marketing campaigns with confidence.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-semibold">f</span>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-semibold">t</span>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-semibold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-foreground">Product</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-foreground">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-foreground">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Analytics Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Made with ❤️ for marketers</span>
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>SOC 2 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;