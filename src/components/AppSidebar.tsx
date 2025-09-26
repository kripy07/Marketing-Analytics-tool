import { useState } from "react";
import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import { UserSwitcher } from "./UserSwitcher";
import {
  BarChart3,
  Settings,
  Users,
  Target,
  TrendingUp,
  FileText,
  Bell,
  LogOut,
  ChevronDown,
  Home,
  Check,
  Building
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Global navigation items (when not in a project)
const globalNavigationItems = [
  {
    title: "All Projects",
    url: "/",
    icon: Home,
    adminOnly: false
  },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
    adminOnly: true
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    adminOnly: true
  }
];

// Project-specific navigation items
const projectNavigationItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: BarChart3,
    adminOnly: false
  },
  {
    title: "Campaigns",
    url: "campaigns",
    icon: Target,
    adminOnly: false
  },
  {
    title: "Analytics",
    url: "analytics",
    icon: TrendingUp,
    adminOnly: false
  },
  {
    title: "Reports",
    url: "reports",
    icon: FileText,
    adminOnly: false
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, canEdit, logout } = useAuth();
  const { currentProject, projects } = useProject();
  const currentPath = location.pathname;
  const [projectSwitcherOpen, setProjectSwitcherOpen] = useState(false);

  // Determine if we're in a project context
  const isInProject = Boolean(projectId && currentProject);
  
  // Get appropriate navigation items
  const navigationItems = isInProject ? projectNavigationItems : globalNavigationItems;
  
  const isActive = (path: string) => {
    if (isInProject) {
      // For project routes, check if the current path ends with the item path
      return currentPath.includes(`/project/${projectId}/${path}`);
    } else {
      // For global routes
      if (path === "/") {
        return currentPath === "/";
      }
      return currentPath.startsWith(path);
    }
  };

  const buildUrl = (path: string) => {
    if (isInProject) {
      return `/project/${projectId}/${path}`;
    }
    return path;
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-soft" 
      : "hover:bg-accent hover:text-accent-foreground";

  const visibleItems = navigationItems.filter(item => 
    !item.adminOnly || canEdit
  );

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        {state !== "collapsed" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Analytics Pro</h2>
                <p className="text-xs text-muted-foreground">Marketing Dashboard</p>
              </div>
            </div>
            
            {/* User Switcher */}
            <UserSwitcher />
            
            {/* Project Switcher */}
            {isInProject && currentProject && (
              <Popover open={projectSwitcherOpen} onOpenChange={setProjectSwitcherOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={projectSwitcherOpen}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span className="truncate">{currentProject.name}</span>
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search projects..." />
                    <CommandList>
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {projects.map((project) => (
                          <CommandItem
                            key={project.id}
                            value={project.name}
                            onSelect={() => {
                              navigate(`/project/${project.id}/dashboard`);
                              setProjectSwitcherOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                currentProject.id === project.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <div className="flex flex-col">
                              <span>{project.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {project.type} • {project.campaignCount} campaigns
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
        {state === "collapsed" && (
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={buildUrl(item.url)} 
                      end={item.url === "/" || item.url === "dashboard"} 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {canEdit && state !== "collapsed" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4" />
                  <span>System Status: Active</span>
                </div>
                <div className="text-xs">
                  Last sync: 2 minutes ago
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        {state !== "collapsed" && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-auto p-2">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {state === "collapsed" && user && (
          <div className="flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}