import { useRouterState } from "@tanstack/react-router";
import * as React from "react";
import {
  type BreadcrumbItem,
  useBreadcrumbsStore,
} from "@/store/breadcrumbs.store";

export const useDashboardBreadcrumb = () => {
  const breadcrumbs = useBreadcrumbsStore((state) => state.breadcrumbs);
  const setBreadcrumbs = useBreadcrumbsStore((state) => state.setBreadcrumbs);
  const state = useRouterState();

  // Generate default breadcrumb items based on current path
  const generateBreadcrumbs = React.useCallback(() => {
    const pathSegments = state.location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add subsequent path segments
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const href = `/${pathSegments.slice(0, i + 1).join("/")}`;

      // Format segment name (capitalize and replace hyphens with spaces)
      const label =
        segment
          ?.split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") ?? "";

      breadcrumbs.push({
        label,
        href,
      });
    }

    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs, state.location.pathname]);

  React.useEffect(() => {
    generateBreadcrumbs();
  }, [generateBreadcrumbs]);

  return {
    breadcrumbs,
  };
};
