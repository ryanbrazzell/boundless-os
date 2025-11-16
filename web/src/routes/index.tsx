import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  loader: async () => {
    const user = await getCurrentUser();
    if (!user) {
      throw redirect({ to: "/login" as any });
    }
    
    // Redirect based on role
    if (user.role === "EA") {
      throw redirect({ to: "/dashboard/ea" as any });
    } else if (user.role === "CLIENT") {
      throw redirect({ to: "/coming-soon" as any });
    } else {
      // Admin roles - redirect to appropriate dashboard
      throw redirect({ to: "/dashboard/clients" as any });
    }
  },
});

