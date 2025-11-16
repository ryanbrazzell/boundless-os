import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { getCurrentUser } from "@/lib/auth";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  beforeLoad: async ({ location }) => {
    // Don't redirect if already on login/forgot-password/reset-password/verify-email/coming-soon
    const publicRoutes = ["/login", "/forgot-password", "/reset-password", "/verify-email", "/coming-soon"];
    if (publicRoutes.includes(location.pathname)) {
      return;
    }

    // Check authentication for protected routes
    const user = await getCurrentUser();
    if (!user && location.pathname !== "/") {
      throw redirect({ to: "/login" as any });
    }
  },
});

