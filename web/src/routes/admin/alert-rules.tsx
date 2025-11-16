import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPut } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface AlertRule {
  id: string;
  name: string;
  ruleType: "LOGIC" | "AI_TEXT_ANALYSIS";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  isEnabled: boolean;
  triggerCondition: string;
  adjustableThresholds: Record<string, number> | null;
  alertTitle: string;
  alertDescription: string;
  suggestedAction: string | null;
}

export const Route = createFileRoute("/admin/alert-rules")({
  component: AlertRulesPage,
});

function AlertRulesPage() {
  const queryClient = useQueryClient();
  const [selectedRule, setSelectedRule] = useState<AlertRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: rulesData, isLoading } = useQuery<{ rules: AlertRule[] }>({
    queryKey: ["alert-rules"],
    queryFn: () => apiGet("/api/alert-rules"),
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ ruleId, data }: { ruleId: string; data: Partial<AlertRule> }) =>
      apiPut(`/api/alert-rules/${ruleId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-rules"] });
      setIsEditing(false);
    },
  });

  const toggleRuleMutation = useMutation({
    mutationFn: ({ ruleId, isEnabled }: { ruleId: string; isEnabled: boolean }) =>
      apiPut(`/api/alert-rules/${ruleId}`, { isEnabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-rules"] });
    },
  });

  const handleToggle = (rule: AlertRule) => {
    toggleRuleMutation.mutate({ ruleId: rule.id, isEnabled: !rule.isEnabled });
  };

  const handleSave = (data: Partial<AlertRule>) => {
    if (!selectedRule) return;
    updateRuleMutation.mutate({ ruleId: selectedRule.id, data });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Alert Rules</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const rules = rulesData?.rules || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Alert Rules Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rules List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Rules ({rules.length})</CardTitle>
                <CardDescription>Select a rule to view or edit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {rules.map((rule) => (
                    <Card
                      key={rule.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedRule?.id === rule.id ? "border-primary" : ""
                      }`}
                      onClick={() => {
                        setSelectedRule(rule);
                        setIsEditing(false);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm">{rule.name}</h3>
                          <Switch
                            checked={rule.isEnabled}
                            onCheckedChange={() => handleToggle(rule)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className={`px-2 py-1 rounded ${
                            rule.severity === "CRITICAL" ? "bg-red-100 text-red-800" :
                            rule.severity === "HIGH" ? "bg-orange-100 text-orange-800" :
                            rule.severity === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {rule.severity}
                          </span>
                          <span>{rule.ruleType}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rule Detail */}
          <div className="lg:col-span-2">
            {selectedRule ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedRule.name}</CardTitle>
                      <CardDescription>
                        {selectedRule.ruleType} • {selectedRule.severity}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <RuleEditForm rule={selectedRule} onSave={handleSave} />
                  ) : (
                    <RuleDetailView rule={selectedRule} />
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">
                    Select a rule from the list to view details
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

function RuleDetailView({ rule }: { rule: AlertRule }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Status</Label>
        <div className="mt-1">
          <span
            className={`px-3 py-1 rounded text-sm ${
              rule.isEnabled
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {rule.isEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      <div>
        <Label>Alert Title</Label>
        <p className="mt-1 text-sm">{rule.alertTitle}</p>
      </div>

      <div>
        <Label>Alert Description</Label>
        <p className="mt-1 text-sm text-muted-foreground">{rule.alertDescription}</p>
      </div>

      {rule.suggestedAction && (
        <div>
          <Label>Suggested Action</Label>
          <p className="mt-1 text-sm text-muted-foreground">{rule.suggestedAction}</p>
        </div>
      )}

      <div>
        <Label>Trigger Condition</Label>
        <pre className="mt-1 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
          {rule.triggerCondition}
        </pre>
      </div>

      {rule.adjustableThresholds && Object.keys(rule.adjustableThresholds).length > 0 && (
        <div>
          <Label>Adjustable Thresholds</Label>
          <div className="mt-1 space-y-1">
            {Object.entries(rule.adjustableThresholds).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RuleEditForm({
  rule,
  onSave,
}: {
  rule: AlertRule;
  onSave: (data: Partial<AlertRule>) => void;
}) {
  const [formData, setFormData] = useState({
    name: rule.name,
    severity: rule.severity,
    isEnabled: rule.isEnabled,
    alertTitle: rule.alertTitle,
    alertDescription: rule.alertDescription,
    suggestedAction: rule.suggestedAction || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Rule Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="severity">Severity</Label>
        <select
          id="severity"
          value={formData.severity}
          onChange={(e) =>
            setFormData({ ...formData, severity: e.target.value as AlertRule["severity"] })
          }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="enabled"
          checked={formData.isEnabled}
          onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
        />
        <Label htmlFor="enabled">Enabled</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alertTitle">Alert Title</Label>
        <Input
          id="alertTitle"
          value={formData.alertTitle}
          onChange={(e) => setFormData({ ...formData, alertTitle: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alertDescription">Alert Description</Label>
        <Textarea
          id="alertDescription"
          value={formData.alertDescription}
          onChange={(e) => setFormData({ ...formData, alertDescription: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="suggestedAction">Suggested Action (Optional)</Label>
        <Textarea
          id="suggestedAction"
          value={formData.suggestedAction}
          onChange={(e) => setFormData({ ...formData, suggestedAction: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}

