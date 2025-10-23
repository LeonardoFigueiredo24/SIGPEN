import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Ocorrencias() {
  const navigate = useNavigate();
  const [presidiarios, setPresidiarios] = useState<any[]>([]);
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
    id_presidiario: string;
    tipo: "Fuga" | "Briga" | "Outros";
    descricao: string;
    data_ocorrencia: string;
  }>({
    id_presidiario: "",
    tipo: "Outros",
    descricao: "",
    data_ocorrencia: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchPresidiarios();
    fetchOcorrencias();
  }, []);

  const fetchPresidiarios = async () => {
    const { data } = await supabase
      .from("presidiarios")
      .select("id_presidiario, nome_completo")
      .order("nome_completo");
    setPresidiarios(data || []);
  };

  const fetchOcorrencias = async () => {
    const { data } = await supabase
      .from("ocorrencias")
      .select(`
        *,
        presidiarios (nome_completo)
      `)
      .order("data_ocorrencia", { ascending: false });
    setOcorrencias(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("ocorrencias").insert([{
        ...formData,
        id_presidiario: parseInt(formData.id_presidiario)
      }]);

      if (error) throw error;
      toast.success("Ocorrência registrada com sucesso");
      setFormData({
        id_presidiario: "",
        tipo: "Outros",
        descricao: "",
        data_ocorrencia: new Date().toISOString().split('T')[0]
      });
      fetchOcorrencias();
    } catch (error) {
      toast.error("Erro ao registrar ocorrência");
    }
  };

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      "Fuga": "bg-red-500",
      "Briga": "bg-orange-500",
      "Indisciplina": "bg-yellow-500",
      "Outros": "bg-gray-500"
    };
    return colors[tipo] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ocorrências</h1>
          <p className="text-muted-foreground">Registrar e consultar ocorrências disciplinares</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Ocorrência</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Custodiado *</Label>
                <Select
                  value={formData.id_presidiario}
                  onValueChange={(value) => setFormData({ ...formData, id_presidiario: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o custodiado" />
                  </SelectTrigger>
                  <SelectContent>
                    {presidiarios.map((p) => (
                      <SelectItem key={p.id_presidiario} value={p.id_presidiario.toString()}>
                        {p.nome_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fuga">Fuga</SelectItem>
                    <SelectItem value="Briga">Briga</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Data da Ocorrência *</Label>
                <Input
                  type="date"
                  value={formData.data_ocorrencia}
                  onChange={(e) => setFormData({ ...formData, data_ocorrencia: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label>Descrição *</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Ocorrência
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Ocorrências</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Custodiado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ocorrencias.map((o) => (
                <TableRow key={o.id_ocorrencia}>
                  <TableCell>{new Date(o.data_ocorrencia).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{o.presidiarios?.nome_completo}</TableCell>
                  <TableCell>
                    <Badge className={getTipoBadge(o.tipo)}>{o.tipo}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate">{o.descricao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
