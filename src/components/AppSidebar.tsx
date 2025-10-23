import { Shield, Users, Search, ArrowLeftRight, AlertTriangle, HeartPulse, UserCheck, FileText, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const menuItems = [
  { title: "Cadastro de Custodiados", url: "/cadastro", icon: Users },
  { title: "Consultar / Editar Registros", url: "/consulta", icon: Search },
  { title: "Transferências", url: "/transferencias", icon: ArrowLeftRight },
  { title: "Ocorrências", url: "/ocorrencias", icon: AlertTriangle },
  { title: "Saúde e Psicologia", url: "/saude", icon: HeartPulse },
  { title: "Visitas", url: "/visitas", icon: UserCheck },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Usuários e Acessos", url: "/usuarios", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/auth");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="bg-sidebar-ring rounded-full p-2">
            <Shield className="w-6 h-6 text-sidebar-background" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">SIGPEN</h2>
              <p className="text-xs text-sidebar-foreground/80">CME / BEP</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenuButton onClick={handleLogout} className="w-full">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sair do Sistema</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}