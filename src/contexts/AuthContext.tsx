import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "viewer";
  avatar?: string;
}


// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@company.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
  },
  {
    id: "2", 
    name: "Marketing Manager",
    email: "manager@company.com",
    role: "viewer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=manager"
  }
];

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isViewer: boolean;
  canEdit: boolean;
  canView: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateUser: (updates: Partial<User>) => void;
  availableUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Auto-login as admin for demo purposes
    setUser(mockUsers[0]);
  }, []);

  const switchUser = (userId: string) => {
    const selectedUser = mockUsers.find(u => u.id === userId);
    if (selectedUser) {
      setUser(selectedUser);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const value = {
    user,
    isAdmin: user?.role === "admin",
    isViewer: user?.role === "viewer",
    canEdit: user?.role === "admin",
    canView: user !== null,
    login,
    logout,
    switchUser,
    updateUser,
    availableUsers: mockUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}