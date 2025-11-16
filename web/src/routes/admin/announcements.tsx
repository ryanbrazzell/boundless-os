import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiGet, apiPost, apiPut, apiPatch } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  expiresAt: number | null;
  createdAt: number;
  createdBy: string;
}

export const Route = createFileRoute("/admin/announcements")({
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const { data: announcementsData, isLoading } = useQuery<{ announcements: Announcement[] }>({
    queryKey: ["announcements"],
    queryFn: () => apiGet("/api/announcements"),
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: (data: AnnouncementFormData) => apiPost("/api/announcements", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setShowCreateForm(false);
    },
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AnnouncementFormData> }) =>
      apiPut(`/api/announcements/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setEditingAnnouncement(null);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiPatch(`/api/announcements/${id}/status`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema) as any,
    defaultValues: {
      isActive: true,
    },
  });

  const onSubmit = async (data: AnnouncementFormData) => {
    try {
      if (editingAnnouncement) {
        await updateAnnouncementMutation.mutateAsync({
          id: editingAnnouncement.id,
          data,
        });
      } else {
        await createAnnouncementMutation.mutateAsync(data);
      }
      reset();
      setShowCreateForm(false);
      setEditingAnnouncement(null);
    } catch (error) {
      console.error("Failed to save announcement:", error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowCreateForm(true);
    reset({
      title: announcement.title,
      content: announcement.content,
      expiresAt: announcement.expiresAt
        ? new Date(announcement.expiresAt * 1000).toISOString().split("T")[0]
        : "",
      isActive: announcement.isActive,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Company Announcements</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Company Announcements</h1>
          <Button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingAnnouncement(null);
              reset();
            }}
          >
            {showCreateForm ? "Cancel" : "Create Announcement"}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea id="content" {...register("content")} rows={6} />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                  <Input id="expiresAt" type="date" {...register("expiresAt")} />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="isActive" {...register("isActive")} />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={createAnnouncementMutation.isPending}>
                    {editingAnnouncement ? "Update" : "Create"} Announcement
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingAnnouncement(null);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcementsData?.announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <Switch
                    checked={announcement.isActive}
                    onCheckedChange={(checked) =>
                      toggleActiveMutation.mutate({ id: announcement.id, isActive: checked })
                    }
                  />
                </div>
                <CardDescription>
                  Created: {new Date(announcement.createdAt * 1000).toLocaleDateString()}
                  {announcement.expiresAt && (
                    <> • Expires: {new Date(announcement.expiresAt * 1000).toLocaleDateString()}</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">
                  {announcement.content}
                </p>
                <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

