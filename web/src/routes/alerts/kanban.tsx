import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { apiGet, apiPatch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateReadable } from "@/lib/date";
import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";

interface Alert {
  id: string;
  pairingId: string;
  eaName: string | null;
  clientName: string | null;
  ruleId: string;
  ruleName: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "NEW" | "INVESTIGATING" | "WORKING_ON" | "RESOLVED";
  detectedAt: number;
  alertTitle: string;
  alertDescription: string;
  suggestedAction: string | null;
  assignedTo: string | null;
  notes: string | null;
}

const COLUMNS = [
  { id: "NEW", title: "New", color: "bg-blue-50" },
  { id: "INVESTIGATING", title: "Investigating", color: "bg-yellow-50" },
  { id: "WORKING_ON", title: "Working On", color: "bg-orange-50" },
  { id: "RESOLVED", title: "Resolved", color: "bg-green-50" },
] as const;

type AlertStatus = typeof COLUMNS[number]["id"];

function AlertCard({ alert }: { alert: Alert }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: alert.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSeverityIcon = () => {
    switch (alert.severity) {
      case "CRITICAL":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "HIGH":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "MEDIUM":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "LOW":
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSeverityColor = () => {
    switch (alert.severity) {
      case "CRITICAL":
        return "border-red-500";
      case "HIGH":
        return "border-orange-500";
      case "MEDIUM":
        return "border-yellow-500";
      case "LOW":
        return "border-blue-500";
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 cursor-move border-l-4 ${getSeverityColor()}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getSeverityIcon()}
            <span className="text-xs font-semibold">{alert.severity}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDateReadable(alert.detectedAt)}
          </span>
        </div>
        <h4 className="font-semibold text-sm mb-1">{alert.alertTitle}</h4>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {alert.alertDescription}
        </p>
        <div className="text-xs text-muted-foreground">
          <div>{alert.eaName || "Unknown EA"} → {alert.clientName || "Unknown Client"}</div>
          <div className="mt-1">Rule: {alert.ruleName}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Column({ title, alerts, color }: { title: string; alerts: Alert[]; color: string }) {
  return (
    <div className="flex-1 min-w-[300px]">
      <div className={`${color} p-4 rounded-t-lg border-b-2`}>
        <h3 className="font-semibold">
          {title} ({alerts.length})
        </h3>
      </div>
      <div className="bg-gray-50 p-4 rounded-b-lg min-h-[400px]">
        <SortableContext items={alerts.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
          {alerts.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No alerts in this column
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/alerts/kanban")({
  component: AlertKanbanPage,
});

function AlertKanbanPage() {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { data: alertsData, isLoading } = useQuery<{ alerts: Alert[] }>({
    queryKey: ["alerts-kanban"],
    queryFn: () => apiGet("/api/alerts"),
  });

  const updateAlertStatusMutation = useMutation({
    mutationFn: ({ alertId, status }: { alertId: string; status: AlertStatus }) =>
      apiPatch(`/api/alerts/${alertId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts-kanban"] });
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const alertId = active.id as string;
    const newStatus = over.id as AlertStatus;

    // Find the alert's current status
    const alert = alertsData?.alerts.find((a) => a.id === alertId);
    if (!alert || alert.status === newStatus) return;

    updateAlertStatusMutation.mutate({ alertId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Alert Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const alerts = alertsData?.alerts || [];
  const alertsByStatus = COLUMNS.reduce((acc, column) => {
    acc[column.id] = alerts.filter((alert) => alert.status === column.id);
    return acc;
  }, {} as Record<AlertStatus, Alert[]>);

  const activeAlert = activeId ? alerts.find((a) => a.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Alert Management Kanban</h1>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((column) => (
              <div key={column.id} id={column.id} className="flex-1 min-w-[300px]">
                <Column
                  title={column.title}
                  alerts={alertsByStatus[column.id] || []}
                  color={column.color}
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeAlert ? <AlertCard alert={activeAlert} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

