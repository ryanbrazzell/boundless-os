import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/clients/$clientId")({
  component: ClientDetailPage,
});

type ClientHealthStatus = "GREEN" | "YELLOW" | "RED";

type ClientDetailResponse = {
  client: {
    id: string;
    name: string;
  };
  pairings: Array<{
    id: string;
    eaName: string | null;
    healthStatus: ClientHealthStatus;
    activeAlertsCount: number;
  }>;
};

function ClientDetailPage() {
  const navigate = useNavigate();
  const { clientId } = Route.useParams();
  const { data: clientData, isLoading } = useQuery<ClientDetailResponse>({
    queryKey: ["client-detail", clientId],
    queryFn: () => apiGet(`/api/dashboard/clients/${clientId}`),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const client = clientData?.client;
  const pairings = clientData?.pairings || [];

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "GREEN":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "YELLOW":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "RED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{client?.name || "Client Details"}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pairings List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Pairings ({pairings.length})</CardTitle>
                <CardDescription>All EA-Client pairings for this client</CardDescription>
              </CardHeader>
              <CardContent>
                {pairings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pairings found</p>
                ) : (
                  <div className="space-y-3">
                    {pairings.map((pairing: any) => (
                      <Card
                        key={pairing.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate({ to: `/dashboard/pairings/${pairing.id}` as any })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{pairing.eaName || "Unknown EA"}</div>
                              <div className="text-sm text-muted-foreground">
                                Health: {pairing.healthStatus} • Alerts: {pairing.activeAlertsCount}
                              </div>
                            </div>
                            {getHealthIcon(pairing.healthStatus)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Client Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Client Name</div>
                    <div className="font-semibold">{client?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Pairings</div>
                    <div className="font-semibold">{pairings.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

