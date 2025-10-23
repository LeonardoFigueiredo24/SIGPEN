import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function Saude() {
  const navigate = useNavigate();
  const [presidiarios, setPresidiarios] = useState<any[]>([]);
  const [registros, setRegistros] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id_presidiario: "",
    condicoes_saude: "",
    medicamentos: "",
    avaliacoes_psicologicas: "",
    risco_suicidio: false,
    observacoes: "",
    data_atualizacao: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchPresidiarios();
    fetchRegistros();
  }, []);

  const fetchPresidiarios = async () => {
    const { data } = await supabase
      .from("presidiarios")
      .select("id_presidiario, nome_completo")
      .order("nome_completo");
    setPresidiarios(data || []);
  };

  const fetchRegistros = async () => {
    const { data } = await supabase
      .from("saude_psicologia")
      .select(`
        *,
        presidiarios (nome_completo)
      `)
      .order("data_atualizacao", { ascending: false });
    setRegistros(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("saude_psicologia").insert([{
        ...formData,
        id_presidiario: parseInt(formData.id_presidiario)
      }]);

      if (error) throw error;
      toast.success("Registro de saúde adicionado com sucesso");
      setFormData({
        id_presidiario: "",
        condicoes_saude: "",
        medicamentos: "",
        avaliacoes_psicologicas: "",
        risco_suicidio: false,
        observacoes: "",
        data_atualizacao: new Date().toISOString().split('T')[0]
      });
      fetchRegistros();
    } catch (error) {
      toast.error("Erro ao adicionar registro");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Saúde e Psicologia</h1>
          <p className="text-muted-foreground">Registros médicos e psicológicos dos custodiados</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Registro de Saúde</CardTitle>
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
                <Label>Data da Atualização *</Label>
                <Input
                  type="date"
                  value={formData.data_atualizacao}
                  onChange={(e) => setFormData({ ...formData, data_atualizacao: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label>Condições de Saúde</Label>
                <Textarea
                  value={formData.condicoes_saude}
                  onChange={(e) => setFormData({ ...formData, condicoes_saude: e.target.value })}
                  placeholder="Descreva as condições de saúde do custodiado"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Medicamentos em Uso</Label>
                <Textarea
                  value={formData.medicamentos}
                  onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
                  placeholder="Liste os medicamentos e dosagens"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Avaliações Psicológicas</Label>
                <Textarea
                  value={formData.avaliacoes_psicologicas}
                  onChange={(e) => setFormData({ ...formData, avaliacoes_psicologicas: e.target.value })}
                  placeholder="Registre avaliações e observações psicológicas"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Observações Gerais</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2 md:col-span-2 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <Label htmlFor="risco" className="text-red-900 dark:text-red-100">Risco de Suicídio</Label>
                <Switch
                  id="risco"
                  checked={formData.risco_suicidio}
                  onCheckedChange={(checked) => setFormData({ ...formData, risco_suicidio: checked })}
                />
              </div>
            </div>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Registro
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registros de Saúde</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Custodiado</TableHead>
                <TableHead>Condições</TableHead>
                <TableHead>Risco</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.map((r) => (
                <TableRow key={r.id_registro}>
                  <TableCell>{new Date(r.data_atualizacao).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{r.presidiarios?.nome_completo}</TableCell>
                  <TableCell className="max-w-md truncate">{r.condicoes_saude || "-"}</TableCell>
                  <TableCell>
                    {r.risco_suicidio ? (
                      <Badge className="bg-red-500">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Alto Risco
                      </Badge>
                    ) : (
                      <Badge variant="outline">Normal</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
