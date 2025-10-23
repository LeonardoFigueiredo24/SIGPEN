import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Search, Eye, Edit } from "lucide-react";
import { toast } from "sonner";

export default function Consulta() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [presidiarios, setPresidiarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPresidiarios();
  }, []);

  const fetchPresidiarios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("presidiarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPresidiarios(data || []);
    } catch (error: any) {
      toast.error("Erro ao buscar registros");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchPresidiarios();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("presidiarios")
        .select("*")
        .or(`nome_completo.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%,processo_numero.ilike.%${searchTerm}%,ala.ilike.%${searchTerm}%,cela.ilike.%${searchTerm}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPresidiarios(data || []);
    } catch (error: any) {
      toast.error("Erro na busca");
    } finally {
      setLoading(false);
    }
  };

  const getRegimeBadge = (regime: string) => {
    const colors = {
      "Fechado": "bg-red-100 text-red-800",
      "Semiaberto": "bg-yellow-100 text-yellow-800",
      "Aberto": "bg-green-100 text-green-800"
    };
    return colors[regime as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Consultar / Editar Registros</h1>
          <p className="text-muted-foreground">Busque e visualize informações dos internos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Presidiário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Pesquisar por nome, CPF, processo, ala ou cela..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" onClick={fetchPresidiarios}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados ({presidiarios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando...</p>
            </div>
          ) : presidiarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum registro encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Crime</TableHead>
                    <TableHead>Regime</TableHead>
                    <TableHead>Ala</TableHead>
                    <TableHead>Cela</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {presidiarios.map((presidiario) => (
                    <TableRow key={presidiario.id_presidiario}>
                      <TableCell className="font-mono">
                        {String(presidiario.id_presidiario).padStart(4, '0')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {presidiario.nome_completo}
                      </TableCell>
                      <TableCell>{presidiario.crime || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getRegimeBadge(presidiario.regime)}>
                          {presidiario.regime}
                        </Badge>
                      </TableCell>
                      <TableCell>{presidiario.ala || "-"}</TableCell>
                      <TableCell>{presidiario.cela || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{presidiario.situacao}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/detalhe/${presidiario.id_presidiario}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}