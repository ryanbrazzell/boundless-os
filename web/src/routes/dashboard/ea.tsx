import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Calendar } from "lucide-react";

interface EAStatus {
  onTimeStatus: "on-time" | "late" | "not-logged";
  healthcareEligibilityDate: number | null;
  lastStartOfDayLog: {
    loggedAt: number;
    wasLate: boolean;
    minutesLate: number | null;
  } | null;
  expectedShowUpTime: string | null;
  timezone: string | null;
}

interface CoachingNote {
  id: string;
  content: string;
  updatedAt: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

export const Route = createFileRoute("/dashboard/ea")({
  component: EADashboardPage,
});

function EADashboardPage() {
  const { data: status, isLoading: statusLoading } = useQuery<EAStatus>({
    queryKey: ["ea-status"],
    queryFn: () => apiGet("/api/dashboard/ea/status"),
  });

  const { data: coachingNote } = useQuery<{ coachingNote: CoachingNote | null }>({
    queryKey: ["ea-coaching-note"],
    queryFn: () => apiGet("/api/dashboard/ea/coaching-notes"),
  });

  const { data: announcements } = useQuery<{ announcements: Announcement[] }>({
    queryKey: ["announcements"],
    queryFn: () => apiGet("/api/dashboard/announcements"),
  });

  const handleStartDay = () => {
    window.location.href = "/start-day";
  };

  const getStatusColor = () => {
    if (!status) return "bg-gray-100";
    if (status.onTimeStatus === "on-time") return "bg-green-100 text-green-800";
    if (status.onTimeStatus === "late") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusText = () => {
    if (!status) return "Loading...";
    if (status.onTimeStatus === "on-time") return "On Time";
    if (status.onTimeStatus === "late") return "Late";
    return "Not Logged";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">EA Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Status</CardTitle>
              <CardDescription>Your start of day status</CardDescription>
            </CardHeader>
            <CardContent>
              {statusLoading ? (
                <div>Loading...</div>
              ) : (
                <div className="space-y-4">
                  <div className={`px-4 py-2 rounded-md ${getStatusColor()}`}>
                    <div className="font-semibold">{getStatusText()}</div>
                  </div>
                  {status?.lastStartOfDayLog && (
                    <div className="text-sm text-muted-foreground">
                      Logged at: {new Date(status.lastStartOfDayLog.loggedAt * 1000).toLocaleTimeString()}
                    </div>
                  )}
                  {status?.expectedShowUpTime && (
                    <div className="text-sm text-muted-foreground">
                      Expected: {status.expectedShowUpTime}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleStartDay} className="w-full" variant="default">
                <Clock className="mr-2 h-4 w-4" />
                Start My Day
              </Button>
              <Button className="w-full" variant="outline" onClick={() => window.location.href = "/reports/submit"}>
                <FileText className="mr-2 h-4 w-4" />
                Submit End of Day Report
              </Button>
              <Button className="w-full" variant="outline" onClick={() => window.location.href = "/reports/history"}>
                <Calendar className="mr-2 h-4 w-4" />
                View My Reports
              </Button>
            </CardContent>
          </Card>

          {/* Healthcare Eligibility Card */}
          {status?.healthcareEligibilityDate && (
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Eligibility</CardTitle>
                <CardDescription>Your eligibility date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {new Date(status.healthcareEligibilityDate * 1000).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coaching Notes Card */}
          {coachingNote?.coachingNote && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Coaching Notes</CardTitle>
                <CardDescription>Notes from your manager</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{coachingNote.coachingNote.content}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Announcements */}
          {announcements?.announcements && announcements.announcements.length > 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Company Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.announcements.map((announcement) => (
                    <div key={announcement.id} className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(announcement.createdAt * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

