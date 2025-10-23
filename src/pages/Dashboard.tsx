import { useState, useEffect } from "react";
import { Users, DoorOpen, AlertTriangle, HeartPulse, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    proximosSair: 0,
    ocorrencias: 0,
    casosMedicos: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Total de presidiários
      const { count: total } = await supabase
        .from("presidiarios")
        .select("*", { count: "exact", head: true });

      // Próximos a sair (faltam 30 dias ou menos)
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 30);
      
      const { count: proximosSair } = await supabase
        .from("presidiarios")
        .select("*", { count: "exact", head: true })
        .lte("data_prevista_soltura", dataLimite.toISOString().split('T')[0])
        .gte("data_prevista_soltura", new Date().toISOString().split('T')[0]);

      // Ocorrências recentes (últimos 7 dias)
      const dataOcorrencias = new Date();
      dataOcorrencias.setDate(dataOcorrencias.getDate() - 7);
      
      const { count: ocorrencias } = await supabase
        .from("ocorrencias")
        .select("*", { count: "exact", head: true })
        .gte("data_ocorrencia", dataOcorrencias.toISOString().split('T')[0]);

      // Casos médicos ativos (com risco de suicídio)
      const { count: casosMedicos } = await supabase
        .from("saude_psicologia")
        .select("*", { count: "exact", head: true })
        .eq("risco_suicidio", true);

      setStats({
        total: total || 0,
        proximosSair: proximosSair || 0,
        ocorrencias: ocorrencias || 0,
        casosMedicos: casosMedicos || 0
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const statCards = [
    {
      title: "Controle total de custodiados",
      value: stats.total,
      icon: Users,
      color: "text-stat-primary",
      bgColor: "bg-stat-primary/10"
    },
    {
      title: "Controle atual de custodiados",
      value: stats.proximosSair,
      icon: DoorOpen,
      color: "text-stat-warning",
      bgColor: "bg-stat-warning/10"
    },
    {
      title: "Controle de custodiados soltos",
      value: stats.ocorrencias,
      icon: AlertTriangle,
      color: "text-stat-danger",
      bgColor: "bg-stat-danger/10"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel Geral</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>
        <Button 
          size="lg" 
          className="bg-secondary hover:bg-secondary/90"
          onClick={() => navigate("/cadastro")}
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cadastro de Custodiado
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-20"
            onClick={() => navigate("/cadastro")}
          >
            <div className="text-center">
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Novo Cadastro</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-20"
            onClick={() => navigate("/consulta")}
          >
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Consultar Registros</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-20"
            onClick={() => navigate("/relatorios")}
          >
            <div className="text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Gerar Relatório</p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}