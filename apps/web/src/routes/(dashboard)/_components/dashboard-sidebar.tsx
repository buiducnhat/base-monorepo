import {
  IconArmchair,
  IconBrandAuth0,
  IconLayoutDashboard,
  IconSettings,
  IconSitemap,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const routes = [
    {
      title: "Dashboard",
      url: "/",
      icon: IconLayoutDashboard,
    },
    {
      title: "Employees",
      url: "/employees",
      icon: IconUsersGroup,
      items: [
        {
          title: "List",
          url: "/employees/list",
          icon: IconUsers,
        },
        {
          title: "Departments",
          url: "/employees/departments",
          icon: IconSitemap,
        },
        {
          title: "Positions",
          url: "/employees/positions",
          icon: IconArmchair,
        },
      ],
    },
  ];

  const adminRoutes = [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
      items: [{ title: "Roles", url: "/settings/roles", icon: IconBrandAuth0 }],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routes} />
        <NavMain items={adminRoutes} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
