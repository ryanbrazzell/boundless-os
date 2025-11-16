import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CoachingNote {
  id: string;
  eaId: string | null;
  pairingId: string | null;
  noteType: "EA_LEVEL" | "PAIRING_LEVEL";
  content: string;
  updatedAt: number;
  updatedBy: string;
}

interface EA {
  id: string;
  name: string;
}

interface Pairing {
  id: string;
  eaName: string;
  clientName: string;
}

export const Route = createFileRoute("/admin/coaching-notes")({
  component: CoachingNotesPage,
});

function CoachingNotesPage() {
  const queryClient = useQueryClient();
  const [noteType, setNoteType] = useState<"EA_LEVEL" | "PAIRING_LEVEL">("EA_LEVEL");
  const [selectedEA, setSelectedEA] = useState<string>("");
  const [selectedPairing, setSelectedPairing] = useState<string>("");
  const [content, setContent] = useState("");

  const { data: easData } = useQuery<{ users: EA[] }>({
    queryKey: ["eas"],
    queryFn: () => apiGet("/api/users?role=EA"),
  });

  const { data: pairingsData } = useQuery<{ pairings: Pairing[] }>({
    queryKey: ["pairings"],
    queryFn: () => apiGet("/api/pairings"),
    enabled: noteType === "PAIRING_LEVEL",
  });

  const { data: currentNote } = useQuery<{ coachingNote: CoachingNote | null }>({
    queryKey: ["coaching-note", noteType, selectedEA, selectedPairing],
    queryFn: () => {
      if (noteType === "EA_LEVEL" && selectedEA) {
        return apiGet(`/api/coaching-notes/ea/${selectedEA}`);
      }
      if (noteType === "PAIRING_LEVEL" && selectedPairing) {
        return apiGet(`/api/pairings/${selectedPairing}/coaching-note`);
      }
      return Promise.resolve({ coachingNote: null });
    },
    enabled: (noteType === "EA_LEVEL" && !!selectedEA) || (noteType === "PAIRING_LEVEL" && !!selectedPairing),
  });

  const saveNoteMutation = useMutation({
    mutationFn: async () => {
      const data: any = {
        noteType,
        content,
      };

      if (noteType === "EA_LEVEL") {
        data.eaId = selectedEA;
        if (currentNote?.coachingNote?.id) {
          return apiPut(`/api/coaching-notes/${currentNote.coachingNote.id}`, data);
        }
        return apiPost("/api/coaching-notes", data);
      } else {
        data.pairingId = selectedPairing;
        if (currentNote?.coachingNote?.id) {
          return apiPut(`/api/coaching-notes/${currentNote.coachingNote.id}`, data);
        }
        return apiPost("/api/coaching-notes", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-note"] });
      queryClient.invalidateQueries({ queryKey: ["ea-coaching-note"] });
    },
  });

  // Load existing note content when selection changes
  useEffect(() => {
    if (currentNote?.coachingNote) {
      setContent(currentNote.coachingNote.content);
    } else {
      setContent("");
    }
  }, [currentNote]);

  const handleSave = () => {
    if (!content.trim()) {
      alert("Please enter coaching note content");
      return;
    }
    saveNoteMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Coaching Notes Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>Create or Edit Coaching Note</CardTitle>
            <CardDescription>Manage EA-level and pairing-level coaching notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Note Type Selection */}
            <div className="space-y-2">
              <Label>Note Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="EA_LEVEL"
                    checked={noteType === "EA_LEVEL"}
                    onChange={(e) => {
                      setNoteType(e.target.value as "EA_LEVEL");
                      setSelectedPairing("");
                      setContent("");
                    }}
                  />
                  <span>EA-Level Note</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="PAIRING_LEVEL"
                    checked={noteType === "PAIRING_LEVEL"}
                    onChange={(e) => {
                      setNoteType(e.target.value as "PAIRING_LEVEL");
                      setSelectedEA("");
                      setContent("");
                    }}
                  />
                  <span>Pairing-Level Note</span>
                </label>
              </div>
            </div>

            {/* EA Selection */}
            {noteType === "EA_LEVEL" && (
              <div className="space-y-2">
                <Label htmlFor="ea">Select EA</Label>
                <select
                  id="ea"
                  value={selectedEA}
                  onChange={(e) => {
                    setSelectedEA(e.target.value);
                    setContent("");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select an EA</option>
                  {easData?.users.map((ea) => (
                    <option key={ea.id} value={ea.id}>
                      {ea.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Pairing Selection */}
            {noteType === "PAIRING_LEVEL" && (
              <div className="space-y-2">
                <Label htmlFor="pairing">Select Pairing</Label>
                <select
                  id="pairing"
                  value={selectedPairing}
                  onChange={(e) => {
                    setSelectedPairing(e.target.value);
                    setContent("");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a pairing</option>
                  {pairingsData?.pairings.map((pairing) => (
                    <option key={pairing.id} value={pairing.id}>
                      {pairing.eaName} → {pairing.clientName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Content Editor */}
            {(selectedEA || selectedPairing) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="content">Coaching Note Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    placeholder="Enter coaching note content..."
                  />
                </div>

                {currentNote?.coachingNote && (
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(currentNote.coachingNote.updatedAt * 1000).toLocaleString()}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={handleSave} disabled={saveNoteMutation.isPending}>
                    {saveNoteMutation.isPending ? "Saving..." : "Save Note"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

