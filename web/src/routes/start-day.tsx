import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/start-day")({
  component: StartDayPage,
});

function StartDayPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const startDayMutation = useMutation({
    mutationFn: async () => {
      return apiPost("/api/start-of-day/log", {
        loggedAt: Math.floor(Date.now() / 1000),
      });
    },
    onSuccess: () => {
      setSuccess(true);
      // Invalidate EA status query to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ["ea-status"] });
      setTimeout(() => {
        navigate({ to: "/dashboard/ea" as any });
      }, 2000);
    },
    onError: (err: any) => {
      setError(err.error || "Failed to log start of day. Please try again.");
    },
  });

  const handleStartDay = async () => {
    setIsLoading(true);
    setError(null);
    startDayMutation.mutate();
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Day Started Successfully</CardTitle>
            <CardDescription>Your start of day has been logged.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Logged at: {new Date().toLocaleTimeString()}
            </p>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Start My Day</CardTitle>
          <CardDescription>Log your start of day time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="text-center py-8">
            <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-semibold mb-2">
              {new Date().toLocaleTimeString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Click the button below to log your start of day
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/dashboard/ea" as any })}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartDay}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Logging..." : "Start My Day"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

