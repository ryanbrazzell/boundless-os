import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/coming-soon")({
  component: ComingSoonPage,
});

function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Coming Soon - Client Portal</CardTitle>
          <CardDescription>
            The client portal is currently under development. You'll be able to view your EA reports, 
            track relationship health, and communicate with your Executive Assistant here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We're working hard to bring you an amazing experience. Check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

