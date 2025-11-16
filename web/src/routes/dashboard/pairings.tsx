import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { formatDateReadable } from "@/lib/date";

interface Pairing {
  pairingId: string;
  eaName: string | null;
  clientName: string | null;
  healthStatus: "GREEN" | "YELLOW" | "RED";
  healthStatusOverride: boolean | null;
  lastReportDate: number | null;
  acceleratorStatus: string;
  activeAlertsCount: number;
}

export const Route = createFileRoute("/dashboard/pairings")({
  component: PairingsDashboardPage,
});

function PairingsDashboardPage() {
  const navigate = useNavigate();
  const { data: pairingsData, isLoading } = useQuery<{ pairings: Pairing[] }>({
    queryKey: ["pairings-dashboard"],
    queryFn: () => apiGet("/api/dashboard/pairings"),
  });

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
          <h1 className="text-3xl font-bold mb-6">Pairings Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Pairings Dashboard</h1>

        {!pairingsData?.pairings || pairingsData.pairings.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No pairings found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pairingsData.pairings.map((pairing) => (
              <Card
                key={pairing.pairingId}
                className={`cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${getHealthColor(pairing.healthStatus)}`}
                onClick={() => navigate({ to: `/dashboard/pairings/${pairing.pairingId}` as any })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate({ to: `/dashboard/pairings/${pairing.pairingId}` as any });
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View details for pairing ${pairing.eaName} → ${pairing.clientName}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{pairing.eaName || "Unknown EA"}</CardTitle>
                      <CardDescription>{pairing.clientName || "Unknown Client"}</CardDescription>
                    </div>
                    {getHealthIcon(pairing.healthStatus)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Health Status:</span>
                      <span className="font-semibold">{pairing.healthStatus}</span>
                    </div>
                    {pairing.healthStatusOverride && (
                      <div className="text-xs text-muted-foreground italic">
                        (Manually overridden)
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Alerts:</span>
                      <span className={pairing.activeAlertsCount > 0 ? "font-semibold text-destructive" : ""}>
                        {pairing.activeAlertsCount}
                      </span>
                    </div>
                    {pairing.lastReportDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Report:</span>
                        <span>{formatDateReadable(pairing.lastReportDate)}</span>
                      </div>
                    )}
                    {pairing.acceleratorStatus !== "Disabled" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Accelerator:</span>
                        <span className="font-semibold">{pairing.acceleratorStatus}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: `/dashboard/pairings/${pairing.pairingId}` as any });
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

