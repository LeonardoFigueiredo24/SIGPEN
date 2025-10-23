import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, UserPlus, Shield } from "lucide-react";
import { toast } from "sonner";

const SUPER_ADMIN_EMAIL = "bepp2.pmpa@hotmail.com";

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome_completo: "",
    nivel_acesso: "operador"
  });

  useEffect(() => {
    checkUserAccess();
    fetchUsuarios();
  }, []);

  const checkUserAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserEmail(user.email || "");
      setIsSuperAdmin(user.email === SUPER_ADMIN_EMAIL);
    }
  };

  const fetchUsuarios = async () => {
    const { data } = await supabase
      .from("profiles")
      .select(`
        *,
        user_roles (role)
      `)
      .order("created_at", { ascending: false });
    setUsuarios(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSuperAdmin) {
      toast.error("Apenas o super administrador pode criar usuários");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome_completo: formData.nome_completo,
            nivel_acesso: formData.nivel_acesso
          }
        }
      });

      if (error) throw error;
      
      toast.success("Usuário criado com sucesso");
      setFormData({
        email: "",
        password: "",
        nome_completo: "",
        nivel_acesso: "operador"
      });
      fetchUsuarios();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar usuário");
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      "admin": "bg-red-500",
      "operador": "bg-blue-500",
      "visitante": "bg-gray-500"
    };
    const labels: Record<string, string> = {
      "admin": "Administrador",
      "operador": "Operador",
      "visitante": "Visitante"
    };
    return { color: colors[role] || "bg-gray-500", label: labels[role] || role };
  };

  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Usuários e Acessos</h1>
            <p className="text-muted-foreground">Gerenciar usuários do sistema</p>
          </div>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Apenas o super administrador ({SUPER_ADMIN_EMAIL}) pode gerenciar usuários do sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Usuários e Acessos</h1>
          <p className="text-muted-foreground">Gerenciar usuários e permissões do sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Super Administrador: {currentUserEmail}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome Completo *</Label>
                <Input
                  value={formData.nome_completo}
                  onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>E-mail *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Senha *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label>Nível de Acesso *</Label>
                <Select
                  value={formData.nivel_acesso}
                  onValueChange={(value) => setFormData({ ...formData, nivel_acesso: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="operador">Operador</SelectItem>
                    <SelectItem value="visitante">Visitante (Somente Leitura)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit">
              <UserPlus className="w-4 h-4 mr-2" />
              Criar Usuário
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Nível de Acesso</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Cadastrado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => {
                const role = usuario.user_roles?.[0]?.role || usuario.nivel_acesso || "operador";
                const badge = getRoleBadge(role);
                return (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nome_completo}</TableCell>
                    <TableCell>
                      <Badge className={badge.color}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {usuario.ultimo_login 
                        ? new Date(usuario.ultimo_login).toLocaleString('pt-BR')
                        : "Nunca"}
                    </TableCell>
                    <TableCell>
                      {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
