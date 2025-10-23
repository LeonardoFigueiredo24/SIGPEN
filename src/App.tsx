import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Cadastro from "./pages/Cadastro";
import Consulta from "./pages/Consulta";
import Transferencias from "./pages/Transferencias";
import Ocorrencias from "./pages/Ocorrencias";
import Saude from "./pages/Saude";
import Visitas from "./pages/Visitas";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios";
import DetalhePresidiario from "./pages/DetalhePresidiario";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/cadastro" element={<DashboardLayout><Cadastro /></DashboardLayout>} />
        <Route path="/consulta" element={<DashboardLayout><Consulta /></DashboardLayout>} />
        <Route path="/transferencias" element={<DashboardLayout><Transferencias /></DashboardLayout>} />
        <Route path="/ocorrencias" element={<DashboardLayout><Ocorrencias /></DashboardLayout>} />
        <Route path="/saude" element={<DashboardLayout><Saude /></DashboardLayout>} />
        <Route path="/visitas" element={<DashboardLayout><Visitas /></DashboardLayout>} />
        <Route path="/relatorios" element={<DashboardLayout><Relatorios /></DashboardLayout>} />
        <Route path="/usuarios" element={<DashboardLayout><Usuarios /></DashboardLayout>} />
        <Route path="/detalhe/:id" element={<DashboardLayout><DetalhePresidiario /></DashboardLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
