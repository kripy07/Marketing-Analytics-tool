import { createContext, useContext, useState, ReactNode } from "react";
import { Project, mockProjects } from "@/data/mockProjects";

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  getProjectById: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects] = useState<Project[]>(mockProjects);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        currentProject, 
        setCurrentProject, 
        getProjectById 
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}