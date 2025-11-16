import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date";

interface Report {
  id: string;
  pairingId: string;
  reportDate: number;
  workload: string;
  workType: string;
  mood: string;
  wins: string;
  completions: string;
  pending: string | null;
  dailySync: string;
  difficulties: string | null;
  supportNeeded: string | null;
  notes: string | null;
}

export const Route = createFileRoute("/reports/history")({
  component: ReportHistoryPage,
});

function ReportHistoryPage() {
  // Get current user's EA ID
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await apiGet<{ user: { id: string; role: string } | null }>("/api/auth/get-session");
      return response.user || { id: "", role: "" };
    },
  });

  const { data: reportsData, isLoading } = useQuery<{ reports: Report[] }>({
    queryKey: ["report-history", user?.id],
    queryFn: () => apiGet(`/api/reports/history?eaId=${user?.id}`),
    enabled: !!user?.id && user.role === "EA",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>Loading your reports...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Report History</CardTitle>
            <CardDescription>Your end of day reports from the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {!reportsData?.reports || reportsData.reports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reports found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reportsData.reports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {formatDate(report.reportDate)}
                      </CardTitle>
                      <CardDescription>
                        Workload: {report.workload} | Mood: {report.mood} | Sync: {report.dailySync}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Type of Work:</h4>
                        <p className="text-sm text-muted-foreground">{report.workType}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Wins:</h4>
                        <p className="text-sm text-muted-foreground">{report.wins}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Completions:</h4>
                        <p className="text-sm text-muted-foreground">{report.completions}</p>
                      </div>
                      {report.pending && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Pending:</h4>
                          <p className="text-sm text-muted-foreground">{report.pending}</p>
                        </div>
                      )}
                      {report.difficulties && (
                        <div className="border-t pt-3">
                          <h4 className="font-semibold text-sm mb-1">Difficulties:</h4>
                          <p className="text-sm text-muted-foreground">{report.difficulties}</p>
                        </div>
                      )}
                      {report.supportNeeded && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Support Needed:</h4>
                          <p className="text-sm text-muted-foreground">{report.supportNeeded}</p>
                        </div>
                      )}
                      {report.notes && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Notes:</h4>
                          <p className="text-sm text-muted-foreground">{report.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

