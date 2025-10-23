import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: "",
    apelido: "",
    cpf: "",
    rg: "",
    data_nascimento: "",
    naturalidade: "",
    filiacao_pai: "",
    filiacao_mae: "",
    estado_civil: "",
    religiao: "",
    processo_numero: [] as string[],
    crime: [] as string[],
    pena_total: "",
    data_prisao: "",
    data_prevista_soltura: "",
    regime: "Fechado",
    situacao: "Provisório",
    vara_responsavel: "",
    juiz_responsavel: "",
    unidade_origem: "",
    ala: "",
    cela: "",
    observacoes: ""
  });

  const [processoInput, setProcessoInput] = useState("");
  const [crimeInput, setCrimeInput] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const insertData: any = {
        ...formData,
        cadastrado_por: user.id
      };
      
      // Remove campos vazios
      Object.keys(insertData).forEach(key => {
        if (insertData[key] === '') {
          insertData[key] = null;
        }
      });

      const { error } = await supabase
        .from("presidiarios")
        .insert([insertData]);

      if (error) throw error;

      // Registrar log
      await supabase
        .from("logs_sistema")
        .insert([{
          user_id: user.id,
          acao: "Cadastro de presidiário",
          detalhes: { nome: formData.nome_completo }
        }]);

      toast.success("Presidiário cadastrado com sucesso!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar presidiário");
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
          <h1 className="text-3xl font-bold">Novo Cadastro de Presidiário</h1>
          <p className="text-muted-foreground">Preencha todos os dados do interno</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="pessoais">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="penais">Dados Penais</TabsTrigger>
                <TabsTrigger value="observacoes">Observações</TabsTrigger>
              </TabsList>

              <TabsContent value="pessoais" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome_completo">Nome completo *</Label>
                    <Input
                      id="nome_completo"
                      value={formData.nome_completo}
                      onChange={(e) => handleInputChange("nome_completo", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apelido">Apelido</Label>
                    <Input
                      id="apelido"
                      value={formData.apelido}
                      onChange={(e) => handleInputChange("apelido", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => handleInputChange("cpf", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rg">RG</Label>
                    <Input
                      id="rg"
                      value={formData.rg}
                      onChange={(e) => handleInputChange("rg", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data_nascimento">Data de nascimento</Label>
                    <Input
                      id="data_nascimento"
                      type="date"
                      value={formData.data_nascimento}
                      onChange={(e) => handleInputChange("data_nascimento", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="naturalidade">Naturalidade</Label>
                    <Input
                      id="naturalidade"
                      value={formData.naturalidade}
                      onChange={(e) => handleInputChange("naturalidade", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filiacao_pai">Nome do Pai</Label>
                    <Input
                      id="filiacao_pai"
                      value={formData.filiacao_pai}
                      onChange={(e) => handleInputChange("filiacao_pai", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filiacao_mae">Nome da Mãe</Label>
                    <Input
                      id="filiacao_mae"
                      value={formData.filiacao_mae}
                      onChange={(e) => handleInputChange("filiacao_mae", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado_civil">Estado Civil</Label>
                    <Select onValueChange={(value) => handleInputChange("estado_civil", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="Casado">Casado(a)</SelectItem>
                        <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                        <SelectItem value="União Estável">União Estável</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="religiao">Religião</Label>
                    <Input
                      id="religiao"
                      value={formData.religiao}
                      onChange={(e) => handleInputChange("religiao", e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="penais" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="processo_numero">Número do Processo</Label>
                    <Input
                      id="processo_numero"
                      value={formData.processo_numero}
                      onChange={(e) => handleInputChange("processo_numero", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crime">Crime</Label>
                    <Input
                      id="crime"
                      value={formData.crime}
                      onChange={(e) => handleInputChange("crime", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pena_total">Pena Total</Label>
                    <Input
                      id="pena_total"
                      placeholder="Ex: 5 anos e 3 meses"
                      value={formData.pena_total}
                      onChange={(e) => handleInputChange("pena_total", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data_prisao">Data da Prisão</Label>
                    <Input
                      id="data_prisao"
                      type="date"
                      value={formData.data_prisao}
                      onChange={(e) => handleInputChange("data_prisao", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data_prevista_soltura">Data Prevista de Soltura</Label>
                    <Input
                      id="data_prevista_soltura"
                      type="date"
                      value={formData.data_prevista_soltura}
                      onChange={(e) => handleInputChange("data_prevista_soltura", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regime">Regime</Label>
                    <Select onValueChange={(value) => handleInputChange("regime", value)} defaultValue="Fechado">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fechado">Fechado</SelectItem>
                        <SelectItem value="Semiaberto">Semiaberto</SelectItem>
                        <SelectItem value="Aberto">Aberto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="situacao">Situação</Label>
                    <Select onValueChange={(value) => handleInputChange("situacao", value)} defaultValue="Provisório">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Provisório">Provisório</SelectItem>
                        <SelectItem value="Condenado">Condenado</SelectItem>
                        <SelectItem value="Em julgamento">Em julgamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vara_responsavel">Vara Responsável</Label>
                    <Input
                      id="vara_responsavel"
                      value={formData.vara_responsavel}
                      onChange={(e) => handleInputChange("vara_responsavel", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="juiz_responsavel">Juiz Responsável</Label>
                    <Input
                      id="juiz_responsavel"
                      value={formData.juiz_responsavel}
                      onChange={(e) => handleInputChange("juiz_responsavel", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unidade_origem">Unidade de Origem</Label>
                    <Input
                      id="unidade_origem"
                      value={formData.unidade_origem}
                      onChange={(e) => handleInputChange("unidade_origem", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ala">Ala</Label>
                    <Input
                      id="ala"
                      value={formData.ala}
                      onChange={(e) => handleInputChange("ala", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cela">Cela</Label>
                    <Input
                      id="cela"
                      value={formData.cela}
                      onChange={(e) => handleInputChange("cela", e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="observacoes" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações Gerais</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Insira observações relevantes sobre o interno..."
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    rows={10}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 mt-6">
              <Button 
                type="submit" 
                className="bg-secondary hover:bg-secondary/90"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Cadastro"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}