import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Visitas() {
  const navigate = useNavigate();
  const [presidiarios, setPresidiarios] = useState<any[]>([]);
  const [visitas, setVisitas] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id_presidiario: "",
    nome_visitante: "",
    parentesco: "",
    documento_visitante: "",
    data_visita: new Date().toISOString().split('T')[0],
    observacoes: ""
  });

  useEffect(() => {
    fetchPresidiarios();
    fetchVisitas();
  }, []);

  const fetchPresidiarios = async () => {
    const { data } = await supabase
      .from("presidiarios")
      .select("id_presidiario, nome_completo")
      .order("nome_completo");
    setPresidiarios(data || []);
  };

  const fetchVisitas = async () => {
    const { data } = await supabase
      .from("visitas")
      .select(`
        *,
        presidiarios (nome_completo)
      `)
      .order("data_visita", { ascending: false });
    setVisitas(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("visitas").insert([{
        ...formData,
        id_presidiario: parseInt(formData.id_presidiario)
      }]);

      if (error) throw error;
      toast.success("Visita registrada com sucesso");
      setFormData({
        id_presidiario: "",
        nome_visitante: "",
        parentesco: "",
        documento_visitante: "",
        data_visita: new Date().toISOString().split('T')[0],
        observacoes: ""
      });
      fetchVisitas();
    } catch (error) {
      toast.error("Erro ao registrar visita");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Controle de Visitas</h1>
          <p className="text-muted-foreground">Registrar e consultar visitas aos custodiados</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Nova Visita</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Custodiado Visitado *</Label>
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
                <Label>Data da Visita *</Label>
                <Input
                  type="date"
                  value={formData.data_visita}
                  onChange={(e) => setFormData({ ...formData, data_visita: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Nome do Visitante *</Label>
                <Input
                  value={formData.nome_visitante}
                  onChange={(e) => setFormData({ ...formData, nome_visitante: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Documento do Visitante</Label>
                <Input
                  value={formData.documento_visitante}
                  onChange={(e) => setFormData({ ...formData, documento_visitante: e.target.value })}
                  placeholder="CPF ou RG"
                />
              </div>
              <div>
                <Label>Parentesco</Label>
                <Input
                  value={formData.parentesco}
                  onChange={(e) => setFormData({ ...formData, parentesco: e.target.value })}
                  placeholder="Ex: Mãe, Irmão, Esposa"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Observações</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações sobre a visita"
                />
              </div>
            </div>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Visita
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Visitas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Custodiado</TableHead>
                <TableHead>Visitante</TableHead>
                <TableHead>Parentesco</TableHead>
                <TableHead>Documento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitas.map((v) => (
                <TableRow key={v.id_visita}>
                  <TableCell>{new Date(v.data_visita).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{v.presidiarios?.nome_completo}</TableCell>
                  <TableCell>{v.nome_visitante}</TableCell>
                  <TableCell>{v.parentesco || "-"}</TableCell>
                  <TableCell>{v.documento_visitante || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
