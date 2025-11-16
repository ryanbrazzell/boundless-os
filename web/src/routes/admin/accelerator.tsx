import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiGet, apiPatch } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const acceleratorSchema = z.object({
  acceleratorEnabled: z.boolean(),
  acceleratorWeek: z.number().min(1).max(4).optional(),
  week1Goal: z.string().optional(),
  week2Goal: z.string().optional(),
  week3Goal: z.string().optional(),
  week4Goal: z.string().optional(),
});

type AcceleratorFormData = z.infer<typeof acceleratorSchema>;

interface Pairing {
  id: string;
  eaId: string;
  clientId: string;
  eaName: string;
  clientName: string;
  acceleratorEnabled: boolean;
  acceleratorWeek: number | null;
  week1Goal: string | null;
  week2Goal: string | null;
  week3Goal: string | null;
  week4Goal: string | null;
}

export const Route = createFileRoute("/admin/accelerator")({
  component: AcceleratorManagementPage,
});

function AcceleratorManagementPage() {
  const queryClient = useQueryClient();
  const [selectedPairing, setSelectedPairing] = useState<string>("");

  const { data: pairingsData, isLoading } = useQuery<{ pairings: Pairing[] }>({
    queryKey: ["pairings"],
    queryFn: () => apiGet("/api/pairings"),
  });

  const { data: pairingDetail } = useQuery<{ pairing: Pairing }>({
    queryKey: ["pairing-detail", selectedPairing],
    queryFn: () => apiGet(`/api/pairings/${selectedPairing}`),
    enabled: !!selectedPairing,
  });

  const updateAcceleratorMutation = useMutation({
    mutationFn: ({ pairingId, data }: { pairingId: string; data: Partial<AcceleratorFormData> }) =>
      apiPatch(`/api/pairings/${pairingId}/accelerator`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pairings"] });
      queryClient.invalidateQueries({ queryKey: ["pairing-detail"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<AcceleratorFormData>({
    resolver: zodResolver(acceleratorSchema),
    defaultValues: {
      acceleratorEnabled: false,
    },
  });

  const acceleratorEnabled = watch("acceleratorEnabled");

  // Load pairing data into form
  useEffect(() => {
    if (pairingDetail?.pairing) {
      const pairing = pairingDetail.pairing;
      reset({
        acceleratorEnabled: pairing.acceleratorEnabled,
        acceleratorWeek: pairing.acceleratorWeek ?? undefined,
        week1Goal: pairing.week1Goal || "",
        week2Goal: pairing.week2Goal || "",
        week3Goal: pairing.week3Goal || "",
        week4Goal: pairing.week4Goal || "",
      });
    }
  }, [pairingDetail, reset]);

  const onSubmit = async (data: AcceleratorFormData) => {
    if (!selectedPairing) {
      alert("Please select a pairing");
      return;
    }

    try {
      await updateAcceleratorMutation.mutateAsync({
        pairingId: selectedPairing,
        data,
      });
    } catch (error) {
      console.error("Failed to update accelerator:", error);
    }
  };

  const handleProgressWeek = async (direction: "next" | "previous") => {
    if (!selectedPairing || !pairingDetail?.pairing) return;

    const currentWeek = pairingDetail.pairing.acceleratorWeek || 1;
    let newWeek = currentWeek;

    if (direction === "next") {
      newWeek = Math.min(4, currentWeek + 1);
    } else {
      newWeek = Math.max(1, currentWeek - 1);
    }

    await updateAcceleratorMutation.mutateAsync({
      pairingId: selectedPairing,
      data: { acceleratorWeek: newWeek },
    });
  };

  const handleComplete = async () => {
    if (!selectedPairing) return;
    await updateAcceleratorMutation.mutateAsync({
      pairingId: selectedPairing,
      data: { acceleratorWeek: undefined, acceleratorEnabled: false },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">4-Week Accelerator Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const pairing = pairingDetail?.pairing;
  const currentWeek = pairing?.acceleratorWeek || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">4-Week Accelerator Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pairing Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Pairing</CardTitle>
                <CardDescription>Choose a pairing to manage accelerator</CardDescription>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedPairing}
                  onChange={(e) => {
                    setSelectedPairing(e.target.value);
                    reset();
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a pairing</option>
                  {pairingsData?.pairings.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.eaName} → {p.clientName}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          </div>

          {/* Accelerator Configuration */}
          <div className="lg:col-span-2">
            {selectedPairing && pairing ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Accelerator: {pairing.eaName} → {pairing.clientName}
                  </CardTitle>
                  <CardDescription>Configure 4-week accelerator goals and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Enable/Disable */}
                    <div className="flex items-center space-x-2">
                      <Switch id="acceleratorEnabled" {...register("acceleratorEnabled")} />
                      <Label htmlFor="acceleratorEnabled">Enable Accelerator</Label>
                    </div>

                    {acceleratorEnabled && (
                      <>
                        {/* Week Progress */}
                        <div className="border-t pt-4">
                          <Label>Current Week</Label>
                          <div className="flex items-center gap-4 mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleProgressWeek("previous")}
                              disabled={currentWeek <= 1}
                            >
                              ← Previous
                            </Button>
                            <div className="text-2xl font-bold">
                              {currentWeek > 0 ? `Week ${currentWeek}` : "Not Started"}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleProgressWeek("next")}
                              disabled={currentWeek >= 4}
                            >
                              Next →
                            </Button>
                            {currentWeek >= 4 && (
                              <Button
                                type="button"
                                variant="default"
                                onClick={handleComplete}
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Weekly Goals */}
                        <div className="border-t pt-4 space-y-4">
                          <h3 className="font-semibold">Weekly Goals</h3>

                          <div className="space-y-2">
                            <Label htmlFor="week1Goal">Week 1 Goal</Label>
                            <Textarea
                              id="week1Goal"
                              {...register("week1Goal")}
                              rows={2}
                              placeholder="Enter Week 1 goal..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="week2Goal">Week 2 Goal</Label>
                            <Textarea
                              id="week2Goal"
                              {...register("week2Goal")}
                              rows={2}
                              placeholder="Enter Week 2 goal..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="week3Goal">Week 3 Goal</Label>
                            <Textarea
                              id="week3Goal"
                              {...register("week3Goal")}
                              rows={2}
                              placeholder="Enter Week 3 goal..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="week4Goal">Week 4 Goal</Label>
                            <Textarea
                              id="week4Goal"
                              {...register("week4Goal")}
                              rows={2}
                              placeholder="Enter Week 4 goal..."
                            />
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button type="submit" disabled={updateAcceleratorMutation.isPending}>
                            {updateAcceleratorMutation.isPending ? "Saving..." : "Save Goals"}
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">
                    Select a pairing from the list to configure accelerator
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

