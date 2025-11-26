import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/(dashboard)")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/auth/sign-in",
        throw: true,
      });
    }
    return { session };
  },
});

function RouteComponent() {
  return <Outlet />;
}
