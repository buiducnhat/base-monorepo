import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavHeader() {
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <img alt="" className="size-8" height={64} src="/logo.png" width={64} />
        {open && <span className="font-semibold text-lg">ERP</span>}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
