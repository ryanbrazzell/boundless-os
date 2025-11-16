import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface Assistant {
  eaId: string;
  name: string;
  recentAlertsCount: number;
  attendanceStatus: string;
  reportSubmissionRate: number;
  healthIndicator: "good" | "warning" | "critical";
}

export const Route = createFileRoute("/dashboard/assistants")({
  component: AssistantsDashboardPage,
});

function AssistantsDashboardPage() {
  const navigate = useNavigate();
  const { data: assistantsData, isLoading } = useQuery<{ assistants: Assistant[] }>({
    queryKey: ["assistants-dashboard"],
    queryFn: () => apiGet("/api/dashboard/assistants"),
  });

  const getHealthIcon = (indicator: string) => {
    switch (indicator) {
      case "good":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "critical":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getHealthColor = (indicator: string) => {
    switch (indicator) {
      case "good":
        return "border-green-500";
      case "warning":
        return "border-yellow-500";
      case "critical":
        return "border-red-500";
      default:
        return "border-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Assistants Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Assistants Dashboard</h1>

        {!assistantsData?.assistants || assistantsData.assistants.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No assistants found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assistantsData.assistants.map((assistant) => (
              <Card
                key={assistant.eaId}
                className={`cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${getHealthColor(assistant.healthIndicator)}`}
                onClick={() => navigate({ to: `/dashboard/assistants/${assistant.eaId}` as any })}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{assistant.name}</CardTitle>
                    {getHealthIcon(assistant.healthIndicator)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Recent Alerts (7 days):</span>
                      <span className={assistant.recentAlertsCount > 0 ? "font-semibold text-destructive" : ""}>
                        {assistant.recentAlertsCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Attendance:</span>
                      <span className="font-semibold">{assistant.attendanceStatus}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Report Submission Rate:</span>
                      <span className="font-semibold">{assistant.reportSubmissionRate}%</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: `/dashboard/assistants/${assistant.eaId}` as any });
                    }}
                  >
                    View Profile
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

