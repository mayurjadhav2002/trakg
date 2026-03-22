// app/(dashboard)/layout.tsx or wherever your dashboard layout lives
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata = {
  title: "Trakg - Dashboard",
};

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar className="bg-[#F4F5F4]" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
