import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              nome_completo: nomeCompleto,
              nivel_acesso: 'operador'
            }
          }
        });

        if (error) throw error;
        
        toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-primary rounded-full p-4 w-20 h-20 flex items-center justify-center">
            <Shield className="w-12 h-12 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">SIGPEN</CardTitle>
            <CardDescription className="text-base mt-2">
              Sistema Integrado de Gestão Penitenciária
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-1">
              Comando de Missões Especiais - BAP
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  required={isSignUp}
                  disabled={loading}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Institucional</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@instituicao.gov.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-secondary/90"
              disabled={loading}
            >
              {loading ? "Carregando..." : (isSignUp ? "Cadastrar" : "Entrar")}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline"
                disabled={loading}
              >
                {isSignUp ? "Já tem conta? Faça login" : "Não tem conta? Cadastre-se"}
              </button>
            </div>

            <p className="text-xs text-center text-muted-foreground pt-4 border-t">
              🔒 Acesso restrito - somente policiais autorizados
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}