import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, FileText, Activity, Heart, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";

export default function DetalhePresidiario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presidiario, setPresidiario] = useState<any>(null);
  const [transferencias, setTransferencias] = useState<any[]>([]);
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [saude, setSaude] = useState<any[]>([]);
  const [visitas, setVisitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPresidiarioDetails();
    }
  }, [id]);

  const fetchPresidiarioDetails = async () => {
    try {
      setLoading(true);

      const { data: presData, error: presError } = await supabase
        .from("presidiarios")
        .select("*")
        .eq("id_presidiario", id)
        .single();

      if (presError) throw presError;
      setPresidiario(presData);

      const { data: transData } = await supabase
        .from("transferencias")
        .select("*")
        .eq("id_presidiario", parseInt(id))
        .order("data_transferencia", { ascending: false });
      setTransferencias(transData || []);

      const { data: ocorData } = await supabase
        .from("ocorrencias")
        .select("*")
        .eq("id_presidiario", parseInt(id))
        .order("data_ocorrencia", { ascending: false });
      setOcorrencias(ocorData || []);

      const { data: saudeData } = await supabase
        .from("saude_psicologia")
        .select("*")
        .eq("id_presidiario", parseInt(id))
        .order("data_atualizacao", { ascending: false });
      setSaude(saudeData || []);

      const { data: visitasData } = await supabase
        .from("visitas")
        .select("*")
        .eq("id_presidiario", parseInt(id))
        .order("data_visita", { ascending: false });
      setVisitas(visitasData || []);

    } catch (error: any) {
      toast.error("Erro ao buscar detalhes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!presidiario) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Custodiado não encontrado</p>
      </div>
    );
  }

  const getRegimeBadge = (regime: string) => {
    const colors: Record<string, string> = {
      "Fechado": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      "Semiaberto": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      "Aberto": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    };
    return colors[regime] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/consulta")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ficha do Custodiado</h1>
          <p className="text-muted-foreground">
            ID: {String(presidiario.id_presidiario).padStart(4, '0')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 text-center">
            {presidiario.foto_url ? (
              <img 
                src={presidiario.foto_url} 
                alt={presidiario.nome_completo}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2">{presidiario.nome_completo}</h2>
            {presidiario.apelido && (
              <p className="text-muted-foreground mb-4">"{presidiario.apelido}"</p>
            )}
            <Badge className={getRegimeBadge(presidiario.regime)}>
              {presidiario.regime}
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">CPF</p>
              <p className="font-medium">{presidiario.cpf || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">RG</p>
              <p className="font-medium">{presidiario.rg || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Nascimento</p>
              <p className="font-medium">
                {presidiario.data_nascimento 
                  ? new Date(presidiario.data_nascimento).toLocaleDateString('pt-BR')
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Naturalidade</p>
              <p className="font-medium">{presidiario.naturalidade || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado Civil</p>
              <p className="font-medium">{presidiario.estado_civil || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Religião</p>
              <p className="font-medium">{presidiario.religiao || "-"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Filiação</p>
              <p className="font-medium">
                Pai: {presidiario.filiacao_pai || "-"}<br />
                Mãe: {presidiario.filiacao_mae || "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="penal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="penal">
            <FileText className="w-4 h-4 mr-2" />
            Dados Penais
          </TabsTrigger>
          <TabsTrigger value="transferencias">
            <Activity className="w-4 h-4 mr-2" />
            Transferências
          </TabsTrigger>
          <TabsTrigger value="ocorrencias">
            <Activity className="w-4 h-4 mr-2" />
            Ocorrências
          </TabsTrigger>
          <TabsTrigger value="saude">
            <Heart className="w-4 h-4 mr-2" />
            Saúde
          </TabsTrigger>
          <TabsTrigger value="visitas">
            <UsersIcon className="w-4 h-4 mr-2" />
            Visitas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="penal">
          <Card>
            <CardHeader>
              <CardTitle>Informações Penais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Número(s) do Processo</p>
                <p className="font-medium">
                  {Array.isArray(presidiario.processo_numero) && presidiario.processo_numero.length > 0
                    ? presidiario.processo_numero.join(", ")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crime(s)</p>
                <p className="font-medium">
                  {Array.isArray(presidiario.crime) && presidiario.crime.length > 0
                    ? presidiario.crime.join(", ")
                    : "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pena Total</p>
                  <p className="font-medium">{presidiario.pena_total || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Regime</p>
                  <Badge className={getRegimeBadge(presidiario.regime)}>
                    {presidiario.regime}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data de Prisão</p>
                  <p className="font-medium">
                    {presidiario.data_prisao 
                      ? new Date(presidiario.data_prisao).toLocaleDateString('pt-BR')
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Previsão de Soltura</p>
                  <p className="font-medium">
                    {presidiario.data_prevista_soltura 
                      ? new Date(presidiario.data_prevista_soltura).toLocaleDateString('pt-BR')
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ala</p>
                  <p className="font-medium">{presidiario.ala || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cela</p>
                  <p className="font-medium">{presidiario.cela || "-"}</p>
                </div>
              </div>
              {presidiario.observacoes && (
                <div>
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="font-medium whitespace-pre-wrap">{presidiario.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transferencias">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transferências ({transferencias.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {transferencias.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma transferência registrada
                </p>
              ) : (
                <div className="space-y-4">
                  {transferencias.map((t) => (
                    <div key={t.id_transferencia} className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-semibold">
                        {new Date(t.data_transferencia).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm">
                        {t.unidade_origem || "N/A"} → {t.unidade_destino}
                      </p>
                      <p className="text-sm text-muted-foreground">{t.motivo}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ocorrencias">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Ocorrências ({ocorrencias.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {ocorrencias.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma ocorrência registrada
                </p>
              ) : (
                <div className="space-y-4">
                  {ocorrencias.map((o) => (
                    <div key={o.id_ocorrencia} className="border-l-4 border-red-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold">
                          {new Date(o.data_ocorrencia).toLocaleDateString('pt-BR')}
                        </p>
                        <Badge variant="outline">{o.tipo}</Badge>
                      </div>
                      <p className="text-sm mt-2">{o.descricao}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saude">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Saúde ({saude.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {saude.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum registro de saúde
                </p>
              ) : (
                <div className="space-y-4">
                  {saude.map((s) => (
                    <div key={s.id_registro} className="border rounded-lg p-4">
                      <p className="font-semibold mb-2">
                        {new Date(s.data_atualizacao).toLocaleDateString('pt-BR')}
                      </p>
                      {s.condicoes_saude && (
                        <div className="mb-2">
                          <p className="text-sm font-medium">Condições:</p>
                          <p className="text-sm">{s.condicoes_saude}</p>
                        </div>
                      )}
                      {s.medicamentos && (
                        <div className="mb-2">
                          <p className="text-sm font-medium">Medicamentos:</p>
                          <p className="text-sm">{s.medicamentos}</p>
                        </div>
                      )}
                      {s.risco_suicidio && (
                        <Badge className="bg-red-500">⚠️ Risco de Suicídio</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visitas">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Visitas ({visitas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {visitas.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma visita registrada
                </p>
              ) : (
                <div className="space-y-4">
                  {visitas.map((v) => (
                    <div key={v.id_visita} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="font-semibold">
                        {new Date(v.data_visita).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm">
                        {v.nome_visitante}
                        {v.parentesco && ` (${v.parentesco})`}
                      </p>
                      {v.documento_visitante && (
                        <p className="text-sm text-muted-foreground">
                          Doc: {v.documento_visitante}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
