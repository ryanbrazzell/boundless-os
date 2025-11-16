import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatDateReadable } from "@/lib/date";

interface Client {
  clientId: string;
  name: string;
  healthStatus: "GREEN" | "YELLOW" | "RED";
  activeAlertsCount: number;
  pairingsCount: number;
  lastReportDate: number | null;
}

export const Route = createFileRoute("/dashboard/clients")({
  component: ClientsDashboardPage,
});

function ClientsDashboardPage() {
  const navigate = useNavigate();
  const { data: clientsData, isLoading } = useQuery<{ clients: Client[] }>({
    queryKey: ["clients-dashboard"],
    queryFn: () => apiGet("/api/dashboard/clients"),
  });

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "GREEN":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "YELLOW":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "RED":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case "GREEN":
        return "border-green-500";
      case "YELLOW":
        return "border-yellow-500";
      case "RED":
        return "border-red-500";
      default:
        return "border-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Clients Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Clients Dashboard</h1>

        {!clientsData?.clients || clientsData.clients.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No clients found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientsData.clients.map((client) => (
              <Card
                key={client.clientId}
                className={`cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${getHealthColor(client.healthStatus)}`}
                      onClick={() => navigate({ to: `/dashboard/clients/${client.clientId}` as any })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigate({ to: `/dashboard/clients/${client.clientId}` as any });
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${client.name}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{client.name}</CardTitle>
                    {getHealthIcon(client.healthStatus)}
                  </div>
                  <CardDescription>
                    {client.pairingsCount} {client.pairingsCount === 1 ? "pairing" : "pairings"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Health Status:</span>
                      <span className="font-semibold">{client.healthStatus}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Alerts:</span>
                      <span className={client.activeAlertsCount > 0 ? "font-semibold text-destructive" : ""}>
                        {client.activeAlertsCount}
                      </span>
                    </div>
                    {client.lastReportDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Report:</span>
                        <span>{formatDateReadable(client.lastReportDate)}</span>
                      </div>
                    )}
                  </div>
                  {client.activeAlertsCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ to: `/dashboard/clients/${client.clientId}` as any });
                      }}
                    >
                      View Details
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

