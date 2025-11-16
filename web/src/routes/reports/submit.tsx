import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const reportSchema = z.object({
  pairingId: z.string().min(1, "Please select a pairing"),
  workload: z.enum(["light", "moderate", "heavy", "very-heavy"], {
    required_error: "Please select workload level",
  }),
  workType: z.string().min(1, "Please describe the type of work"),
  mood: z.enum(["excellent", "good", "okay", "challenging", "difficult"], {
    required_error: "Please select mood",
  }),
  wins: z.string().min(1, "Please describe at least one win"),
  completions: z.string().min(1, "Please list completions"),
  pending: z.string().optional(),
  dailySync: z.enum(["yes", "no"], {
    required_error: "Please indicate if you had a daily sync",
  }),
  difficulties: z.string().optional(),
  supportNeeded: z.string().optional(),
  notes: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface Pairing {
  id: string;
  clientId: string;
  clientName: string;
}

export const Route = createFileRoute("/reports/submit")({
  component: SubmitReportPage,
});

function SubmitReportPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get current user's EA ID (from session)
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await apiGet<{ user: { id: string; role: string } | null }>("/api/auth/get-session");
      return response.user || { id: "", role: "" };
    },
  });

  // Get EA's active pairings
  const { data: pairingsData } = useQuery<{ pairings: Pairing[] }>({
    queryKey: ["ea-pairings", user?.id],
    queryFn: () => apiGet(`/api/pairings/ea/${user?.id}`),
    enabled: !!user?.id && user.role === "EA",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormData) => {
    if (!user?.id) {
      setError("User session not found");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiPost("/api/reports/submit", {
        ...data,
        eaId: user.id,
        reportDate: Math.floor(Date.now() / 1000),
      });
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/dashboard/ea" as any });
      }, 2000);
    } catch (err: any) {
      setError(err.error || "Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Report Submitted Successfully</CardTitle>
            <CardDescription>Your end of day report has been submitted.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>End of Day Report</CardTitle>
            <CardDescription>Submit your daily report for today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Pairing Selection */}
              <div className="space-y-2">
                <Label htmlFor="pairingId">Client Pairing *</Label>
                <select
                  id="pairingId"
                  {...register("pairingId")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="">Select a client pairing</option>
                  {pairingsData?.pairings.map((pairing) => (
                    <option key={pairing.id} value={pairing.id}>
                      {pairing.clientName}
                    </option>
                  ))}
                </select>
                {errors.pairingId && (
                  <p className="text-sm text-destructive">{errors.pairingId.message}</p>
                )}
              </div>

              {/* Workload */}
              <div className="space-y-2">
                <Label htmlFor="workload">Workload Level *</Label>
                <select
                  id="workload"
                  {...register("workload")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="">Select workload level</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="heavy">Heavy</option>
                  <option value="very-heavy">Very Heavy</option>
                </select>
                {errors.workload && (
                  <p className="text-sm text-destructive">{errors.workload.message}</p>
                )}
              </div>

              {/* Work Type */}
              <div className="space-y-2">
                <Label htmlFor="workType">Type of Work Today *</Label>
                <Textarea
                  id="workType"
                  {...register("workType")}
                  placeholder="Describe the type of work you did today..."
                  disabled={isLoading}
                  rows={3}
                />
                {errors.workType && (
                  <p className="text-sm text-destructive">{errors.workType.message}</p>
                )}
              </div>

              {/* Mood */}
              <div className="space-y-2">
                <Label htmlFor="mood">How was your day? *</Label>
                <select
                  id="mood"
                  {...register("mood")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="">Select mood</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="okay">Okay</option>
                  <option value="challenging">Challenging</option>
                  <option value="difficult">Difficult</option>
                </select>
                {errors.mood && (
                  <p className="text-sm text-destructive">{errors.mood.message}</p>
                )}
              </div>

              {/* Wins */}
              <div className="space-y-2">
                <Label htmlFor="wins">Wins Today *</Label>
                <Textarea
                  id="wins"
                  {...register("wins")}
                  placeholder="What went well today?"
                  disabled={isLoading}
                  rows={3}
                />
                {errors.wins && (
                  <p className="text-sm text-destructive">{errors.wins.message}</p>
                )}
              </div>

              {/* Completions */}
              <div className="space-y-2">
                <Label htmlFor="completions">Completed Tasks *</Label>
                <Textarea
                  id="completions"
                  {...register("completions")}
                  placeholder="List tasks you completed today..."
                  disabled={isLoading}
                  rows={3}
                />
                {errors.completions && (
                  <p className="text-sm text-destructive">{errors.completions.message}</p>
                )}
              </div>

              {/* Pending */}
              <div className="space-y-2">
                <Label htmlFor="pending">Pending Tasks (Optional)</Label>
                <Textarea
                  id="pending"
                  {...register("pending")}
                  placeholder="Tasks that are still pending..."
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              {/* Daily Sync */}
              <div className="space-y-2">
                <Label htmlFor="dailySync">Did you have a daily sync today? *</Label>
                <select
                  id="dailySync"
                  {...register("dailySync")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.dailySync && (
                  <p className="text-sm text-destructive">{errors.dailySync.message}</p>
                )}
              </div>

              {/* Internal Questions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Internal Notes (Not visible to client)</h3>

                {/* Difficulties */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="difficulties">Difficulties Encountered (Optional)</Label>
                  <Textarea
                    id="difficulties"
                    {...register("difficulties")}
                    placeholder="Any challenges or difficulties you faced..."
                    disabled={isLoading}
                    rows={3}
                  />
                </div>

                {/* Support Needed */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="supportNeeded">Support Needed (Optional)</Label>
                  <Textarea
                    id="supportNeeded"
                    {...register("supportNeeded")}
                    placeholder="What support or resources would help?"
                    disabled={isLoading}
                    rows={3}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Any other notes or observations..."
                    disabled={isLoading}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/dashboard/ea" as any })}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

