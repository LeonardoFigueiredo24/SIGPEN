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

export default function Transferencias() {
  const navigate = useNavigate();
  const [presidiarios, setPresidiarios] = useState<any[]>([]);
  const [transferencias, setTransferencias] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id_presidiario: "",
    unidade_origem: "",
    unidade_destino: "",
    motivo: "",
    data_transferencia: ""
  });

  useEffect(() => {
    fetchPresidiarios();
    fetchTransferencias();
  }, []);

  const fetchPresidiarios = async () => {
    const { data } = await supabase
      .from("presidiarios")
      .select("id_presidiario, nome_completo")
      .order("nome_completo");
    setPresidiarios(data || []);
  };

  const fetchTransferencias = async () => {
    const { data } = await supabase
      .from("transferencias")
      .select(`
        *,
        presidiarios (nome_completo)
      `)
      .order("created_at", { ascending: false });
    setTransferencias(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("transferencias").insert([{
        ...formData,
        id_presidiario: parseInt(formData.id_presidiario)
      }]);

      if (error) throw error;
      toast.success("Transferência registrada com sucesso");
      setFormData({
        id_presidiario: "",
        unidade_origem: "",
        unidade_destino: "",
        motivo: "",
        data_transferencia: ""
      });
      fetchTransferencias();
    } catch (error) {
      toast.error("Erro ao registrar transferência");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Transferências</h1>
          <p className="text-muted-foreground">Registrar e consultar transferências</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Transferência</CardTitle>
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
                <Label>Data da Transferência *</Label>
                <Input
                  type="date"
                  value={formData.data_transferencia}
                  onChange={(e) => setFormData({ ...formData, data_transferencia: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Unidade de Origem</Label>
                <Input
                  value={formData.unidade_origem}
                  onChange={(e) => setFormData({ ...formData, unidade_origem: e.target.value })}
                />
              </div>
              <div>
                <Label>Unidade de Destino *</Label>
                <Input
                  value={formData.unidade_destino}
                  onChange={(e) => setFormData({ ...formData, unidade_destino: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label>Motivo *</Label>
                <Textarea
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Transferência
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transferências</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Custodiado</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferencias.map((t) => (
                <TableRow key={t.id_transferencia}>
                  <TableCell>{new Date(t.data_transferencia).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{t.presidiarios?.nome_completo}</TableCell>
                  <TableCell>{t.unidade_origem || "-"}</TableCell>
                  <TableCell>{t.unidade_destino}</TableCell>
                  <TableCell>{t.motivo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
