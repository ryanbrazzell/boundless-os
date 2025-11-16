import * as React from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { LogOut, Home, Users, AlertCircle, Settings, FileText, Calendar } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const { data: user } = useQuery<User | null>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await apiGet<{ user: User | null }>("/api/auth/get-session");
      return response.user;
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" as any });
  };

  const isAdmin = user?.role && ["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS", "HEAD_EAS"].includes(user.role);
  const isEA = user?.role === "EA";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Boundless OS</h1>
              <div className="ml-8 flex space-x-4">
                {isEA && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/dashboard/ea" as any })}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/reports/submit" as any })}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Submit Report
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/reports/history" as any })}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      History
                    </Button>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/dashboard/clients" as any })}
                    >
                      Clients
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/dashboard/assistants" as any })}
                    >
                      Assistants
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/dashboard/pairings" as any })}
                    >
                      Pairings
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/alerts/kanban" as any })}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Alerts
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/admin/users" as any })}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/admin/alert-rules" as any })}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Rules
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children || <Outlet />}
      </main>
    </div>
  );
};

