import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateReadable } from "@/lib/date";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/pairings/$pairingId")({
  component: PairingDetailPage,
});

type PairingDetailResponse = {
  pairing: {
    id: string;
    eaName: string | null;
    clientName: string | null;
    healthStatus: string;
    startDate: number;
    acceleratorEnabled: boolean;
    acceleratorWeek: number | null;
  };
  recentReports: Array<{
    id: string;
    reportDate: number;
    workload: string;
    mood: string;
  }>;
  activeAlerts: Array<{
    id: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    alertTitle: string;
    alertDescription: string;
    detectedAt: number;
  }>;
  coachingNotes: Array<{
    id: string;
    content: string;
    updatedAt: number;
  }>;
};

function PairingDetailPage() {
  const { pairingId } = Route.useParams();
  const { data: pairingData, isLoading } = useQuery<PairingDetailResponse>({
    queryKey: ["pairing-detail", pairingId],
    queryFn: () => apiGet(`/api/dashboard/pairings/${pairingId}`),
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

  const pairing = pairingData?.pairing;
  const recentReports = pairingData?.recentReports || [];
  const activeAlerts = pairingData?.activeAlerts || [];
  const coachingNotes = pairingData?.coachingNotes || [];

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "GREEN":
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case "YELLOW":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case "RED":
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Pairing Details</h1>

        {pairing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {pairing.eaName || "Unknown EA"} → {pairing.clientName || "Unknown Client"}
                      </CardTitle>
                      <CardDescription>Pairing Information</CardDescription>
                    </div>
                    {getHealthIcon(pairing.healthStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Health Status</div>
                      <div className="font-semibold">{pairing.healthStatus}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Start Date</div>
                      <div className="font-semibold">
                        {formatDateReadable(pairing.startDate)}
                      </div>
                    </div>
                    {pairing.acceleratorEnabled && (
                      <div>
                        <div className="text-sm text-muted-foreground">Accelerator Status</div>
                        <div className="font-semibold">
                          {pairing.acceleratorWeek ? `Week ${pairing.acceleratorWeek}` : "Complete"}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Last 10 reports</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentReports.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reports yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentReports.map((report: any) => (
                        <div key={report.id} className="border-b pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-sm">
                                {formatDateReadable(report.reportDate)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Workload: {report.workload} | Mood: {report.mood}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Alerts */}
              {activeAlerts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Active Alerts ({activeAlerts.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activeAlerts.map((alert: any) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded border-l-4 ${
                            alert.severity === "CRITICAL"
                              ? "border-red-500 bg-red-50"
                              : alert.severity === "HIGH"
                              ? "border-orange-500 bg-orange-50"
                              : alert.severity === "MEDIUM"
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-blue-500 bg-blue-50"
                          }`}
                        >
                          <div className="font-semibold text-sm">{alert.alertTitle}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {alert.alertDescription}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Detected: {formatDateReadable(alert.detectedAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Coaching Notes */}
              {coachingNotes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Coaching Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {coachingNotes.map((note: any) => (
                        <div key={note.id} className="text-sm">
                          <div className="whitespace-pre-wrap">{note.content}</div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Updated: {formatDateReadable(note.updatedAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

