import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { Layout } from "@/components/Layout";
import Homepage from "./pages/Homepage";
import ProjectDashboard from "./pages/ProjectDashboard";
import Campaigns from "./pages/Campaigns";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProjectLayout from "./components/ProjectLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ProjectProvider>
            <Routes>
              {/* Main homepage */}
              <Route path="/" element={<Layout><Homepage /></Layout>} />
              
              {/* Global admin routes */}
              <Route path="/users" element={<Layout><Settings /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              
              {/* Project-specific routes */}
              <Route path="/project/:projectId/*" element={
                <ProjectLayout>
                  <Routes>
                    <Route path="dashboard" element={<ProjectDashboard />} />
                    <Route path="campaigns" element={<Campaigns />} />
                    <Route path="analytics" element={<ProjectDashboard />} />
                    <Route path="reports" element={<ProjectDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProjectLayout>
              } />
              
              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProjectProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
