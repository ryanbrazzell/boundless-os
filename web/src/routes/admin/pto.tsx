import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ptoSchema = z.object({
  eaId: z.string().min(1, "Please select an EA"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().optional(),
});

type PTOFormData = z.infer<typeof ptoSchema>;

interface PTORecord {
  id: string;
  eaId: string;
  eaName: string;
  startDate: number;
  endDate: number;
  reason: string | null;
  createdAt: number;
}

interface EA {
  id: string;
  name: string;
}

export const Route = createFileRoute("/admin/pto")({
  component: PTOManagementPage,
});

function PTOManagementPage() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: easData } = useQuery<{ users: EA[] }>({
    queryKey: ["eas"],
    queryFn: () => apiGet("/api/users?role=EA"),
  });

  const { data: ptoData, isLoading } = useQuery<{ ptoRecords: PTORecord[] }>({
    queryKey: ["pto-records"],
    queryFn: () => apiGet("/api/pto"),
  });

  const createPTOMutation = useMutation({
    mutationFn: (data: PTOFormData) =>
      apiPost("/api/pto", {
        ...data,
        startDate: Math.floor(new Date(data.startDate).getTime() / 1000),
        endDate: Math.floor(new Date(data.endDate).getTime() / 1000),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pto-records"] });
      setShowCreateForm(false);
    },
  });

  const deletePTOMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/pto/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pto-records"] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PTOFormData>({
    resolver: zodResolver(ptoSchema),
  });

  const onSubmit = async (data: PTOFormData) => {
    try {
      await createPTOMutation.mutateAsync(data);
      reset();
    } catch (error) {
      console.error("Failed to create PTO record:", error);
    }
  };

  const now = Math.floor(Date.now() / 1000);
  const activePTO = ptoData?.ptoRecords.filter(
    (pto) => pto.startDate <= now && pto.endDate >= now
  ) || [];
  const upcomingPTO = ptoData?.ptoRecords.filter((pto) => pto.startDate > now) || [];
  const pastPTO = ptoData?.ptoRecords.filter((pto) => pto.endDate < now) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">PTO Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">PTO / Out of Office Management</h1>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "Cancel" : "Add PTO Record"}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create PTO Record</CardTitle>
              <CardDescription>Mark an EA as out of office</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eaId">EA *</Label>
                  <select
                    id="eaId"
                    {...register("eaId")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select an EA</option>
                    {easData?.users.map((ea) => (
                      <option key={ea.id} value={ea.id}>
                        {ea.name}
                      </option>
                    ))}
                  </select>
                  {errors.eaId && (
                    <p className="text-sm text-destructive">{errors.eaId.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input id="startDate" type="date" {...register("startDate")} />
                    {errors.startDate && (
                      <p className="text-sm text-destructive">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input id="endDate" type="date" {...register("endDate")} />
                    {errors.endDate && (
                      <p className="text-sm text-destructive">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Textarea id="reason" {...register("reason")} rows={3} />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={createPTOMutation.isPending}>
                    {createPTOMutation.isPending ? "Creating..." : "Create PTO Record"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Active PTO */}
        {activePTO.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Currently Out of Office ({activePTO.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activePTO.map((pto) => (
                  <div
                    key={pto.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200"
                  >
                    <div>
                      <div className="font-semibold">{pto.eaName}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(pto.startDate * 1000).toLocaleDateString()} -{" "}
                        {new Date(pto.endDate * 1000).toLocaleDateString()}
                        {pto.reason && <> • {pto.reason}</>}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePTOMutation.mutate(pto.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming PTO */}
        {upcomingPTO.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upcoming PTO ({upcomingPTO.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingPTO.map((pto) => (
                  <div
                    key={pto.id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200"
                  >
                    <div>
                      <div className="font-semibold">{pto.eaName}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(pto.startDate * 1000).toLocaleDateString()} -{" "}
                        {new Date(pto.endDate * 1000).toLocaleDateString()}
                        {pto.reason && <> • {pto.reason}</>}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePTOMutation.mutate(pto.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Past PTO */}
        {pastPTO.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Past PTO Records ({pastPTO.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pastPTO.map((pto) => (
                  <div
                    key={pto.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                  >
                    <div>
                      <div className="font-semibold">{pto.eaName}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(pto.startDate * 1000).toLocaleDateString()} -{" "}
                        {new Date(pto.endDate * 1000).toLocaleDateString()}
                        {pto.reason && <> • {pto.reason}</>}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePTOMutation.mutate(pto.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

