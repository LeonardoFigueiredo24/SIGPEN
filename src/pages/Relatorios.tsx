import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { toast } from "sonner";

export default function Relatorios() {
  const navigate = useNavigate();
  const [tipoRelatorio, setTipoRelatorio] = useState("");
  const [loading, setLoading] = useState(false);

  const gerarRelatorio = async () => {
    if (!tipoRelatorio) {
      toast.error("Selecione um tipo de relatório");
      return;
    }

    setLoading(true);
    try {
      let dados: any[] = [];
      let titulo = "";

      switch (tipoRelatorio) {
        case "todos":
          const { data: todos } = await supabase
            .from("presidiarios")
            .select("*")
            .order("nome_completo");
          dados = todos || [];
          titulo = "Relatório Geral de Custodiados";
          break;
        
        case "regime":
          const { data: regimes } = await supabase
            .from("presidiarios")
            .select("regime, nome_completo, crime, data_prisao")
            .order("regime");
          dados = regimes || [];
          titulo = "Relatório por Regime";
          break;
        
        case "ala":
          const { data: alas } = await supabase
            .from("presidiarios")
            .select("ala, cela, nome_completo")
            .order("ala");
          dados = alas || [];
          titulo = "Relatório por Localização (Ala/Cela)";
          break;
        
        case "soltura":
          const { data: soltura } = await supabase
            .from("presidiarios")
            .select("*")
            .not("data_prevista_soltura", "is", null)
            .order("data_prevista_soltura");
          dados = soltura || [];
          titulo = "Relatório de Previsão de Soltura";
          break;
      }

      // Gerar CSV
      if (dados.length > 0) {
        const headers = Object.keys(dados[0]).join(",");
        const rows = dados.map(obj => 
          Object.values(obj).map(val => 
            typeof val === 'string' && val.includes(',') ? `"${val}"` : val
          ).join(",")
        ).join("\n");
        
        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${titulo.replace(/\s/g, "_")}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        toast.success("Relatório gerado com sucesso");
      } else {
        toast.info("Nenhum dado encontrado para o relatório selecionado");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Gerar relatórios e exportar dados</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Gerar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Tipo de Relatório</Label>
            <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Relatório Geral (Todos os Custodiados)</SelectItem>
                <SelectItem value="regime">Relatório por Regime</SelectItem>
                <SelectItem value="ala">Relatório por Localização (Ala/Cela)</SelectItem>
                <SelectItem value="soltura">Relatório de Previsão de Soltura</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={gerarRelatorio} disabled={loading} size="lg">
            <Download className="w-5 h-5 mr-2" />
            {loading ? "Gerando..." : "Gerar e Baixar Relatório (CSV)"}
          </Button>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Informações sobre os Relatórios:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Relatório Geral:</strong> Exporta todos os dados dos custodiados cadastrados</li>
              <li><strong>Por Regime:</strong> Agrupa custodiados por regime prisional (Fechado, Semiaberto, Aberto)</li>
              <li><strong>Por Localização:</strong> Lista custodiados organizados por ala e cela</li>
              <li><strong>Previsão de Soltura:</strong> Lista custodiados com data de soltura prevista</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
