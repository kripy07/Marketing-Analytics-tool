import { ReactNode, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import { Badge } from "@/components/ui/badge";
import { Bell, Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProjectLayoutProps {
  children: ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const { projectId } = useParams();
  const { user, isAdmin } = useAuth();
  const { getProjectById, setCurrentProject, currentProject } = useProject();

  useEffect(() => {
    if (projectId) {
      const project = getProjectById(projectId);
      setCurrentProject(project || null);
    }
  }, [projectId, getProjectById, setCurrentProject]);

  if (!projectId || !currentProject) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Project Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-soft">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="hidden lg:block">
                <SidebarTrigger>
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
              </div>
              
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back to Projects</span>
                  </Link>
                </Button>
                <div className="h-6 w-px bg-border" />
                <div>
                  <h1 className="font-semibold text-lg">{currentProject.name}</h1>
                  <p className="text-xs text-muted-foreground">{currentProject.type} • {currentProject.campaignCount} campaigns</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className={`hidden sm:flex ${
                currentProject.status === 'active' ? 'border-green-500 text-green-500' :
                currentProject.status === 'paused' ? 'border-yellow-500 text-yellow-500' :
                'border-blue-500 text-blue-500'
              }`}>
                {currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1)}
              </Badge>
              {isAdmin && (
                <Badge variant="secondary" className="hidden sm:flex">
                  Admin Access
                </Badge>
              )}
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}