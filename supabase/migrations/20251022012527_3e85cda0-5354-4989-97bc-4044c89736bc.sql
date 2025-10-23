-- SIGPEN - Sistema Integrado de Gestão Penitenciária
-- Banco de Dados Completo

-- 1. Enum para roles de usuários
CREATE TYPE app_role AS ENUM ('admin', 'operador', 'consulta');

-- 2. Enum para regime prisional
CREATE TYPE regime_prisional AS ENUM ('Fechado', 'Semiaberto', 'Aberto');

-- 3. Enum para situação jurídica
CREATE TYPE situacao_juridica AS ENUM ('Provisório', 'Condenado', 'Em julgamento');

-- 4. Enum para estado civil
CREATE TYPE estado_civil AS ENUM ('Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União Estável');

-- 5. Enum para tipo de ocorrência
CREATE TYPE tipo_ocorrencia AS ENUM ('Advertência', 'Fuga', 'Briga', 'Boa Conduta', 'Outros');

-- 6. Tabela de perfis de usuários (policiais)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL,
  nivel_acesso app_role DEFAULT 'operador',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ultimo_login TIMESTAMPTZ
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. Tabela de roles de usuários (segurança adicional)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 8. Tabela principal de presidiários
CREATE TABLE presidiarios (
  id_presidiario SERIAL PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  apelido TEXT,
  cpf TEXT,
  rg TEXT,
  data_nascimento DATE,
  naturalidade TEXT,
  filiacao_pai TEXT,
  filiacao_mae TEXT,
  foto_url TEXT,
  estado_civil estado_civil,
  religiao TEXT,
  processo_numero TEXT,
  crime TEXT,
  pena_total TEXT,
  data_prisao DATE,
  data_prevista_soltura DATE,
  regime regime_prisional DEFAULT 'Fechado',
  situacao situacao_juridica DEFAULT 'Provisório',
  vara_responsavel TEXT,
  juiz_responsavel TEXT,
  unidade_origem TEXT,
  ala TEXT,
  cela TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cadastrado_por UUID REFERENCES auth.users(id)
);

ALTER TABLE presidiarios ENABLE ROW LEVEL SECURITY;

-- 9. Tabela de transferências
CREATE TABLE transferencias (
  id_transferencia SERIAL PRIMARY KEY,
  id_presidiario INTEGER REFERENCES presidiarios(id_presidiario) ON DELETE CASCADE,
  unidade_origem TEXT,
  unidade_destino TEXT,
  motivo TEXT,
  data_transferencia DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responsavel UUID REFERENCES auth.users(id)
);

ALTER TABLE transferencias ENABLE ROW LEVEL SECURITY;

-- 10. Tabela de ocorrências
CREATE TABLE ocorrencias (
  id_ocorrencia SERIAL PRIMARY KEY,
  id_presidiario INTEGER REFERENCES presidiarios(id_presidiario) ON DELETE CASCADE,
  tipo tipo_ocorrencia DEFAULT 'Outros',
  descricao TEXT NOT NULL,
  data_ocorrencia DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  registrado_por UUID REFERENCES auth.users(id)
);

ALTER TABLE ocorrencias ENABLE ROW LEVEL SECURITY;

-- 11. Tabela de saúde e psicologia
CREATE TABLE saude_psicologia (
  id_registro SERIAL PRIMARY KEY,
  id_presidiario INTEGER REFERENCES presidiarios(id_presidiario) ON DELETE CASCADE,
  condicoes_saude TEXT,
  medicamentos TEXT,
  avaliacoes_psicologicas TEXT,
  risco_suicidio BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  data_atualizacao DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  atualizado_por UUID REFERENCES auth.users(id)
);

ALTER TABLE saude_psicologia ENABLE ROW LEVEL SECURITY;

-- 12. Tabela de visitas
CREATE TABLE visitas (
  id_visita SERIAL PRIMARY KEY,
  id_presidiario INTEGER REFERENCES presidiarios(id_presidiario) ON DELETE CASCADE,
  nome_visitante TEXT NOT NULL,
  parentesco TEXT,
  documento_visitante TEXT,
  data_visita DATE NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  registrado_por UUID REFERENCES auth.users(id)
);

ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;

-- 13. Tabela de logs do sistema
CREATE TABLE logs_sistema (
  id_log SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  acao TEXT NOT NULL,
  detalhes JSONB,
  ip_origem TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE logs_sistema ENABLE ROW LEVEL SECURITY;

-- Função para verificar roles
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, nome_completo, nivel_acesso)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'nivel_acesso')::app_role, 'operador'::app_role)
  );
  
  INSERT INTO user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'nivel_acesso')::app_role, 'operador'::app_role)
  );
  
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers para updated_at
CREATE TRIGGER update_presidiarios_updated_at
  BEFORE UPDATE ON presidiarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saude_updated_at
  BEFORE UPDATE ON saude_psicologia
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- POLÍTICAS RLS

-- Profiles: usuários podem ver seu próprio perfil, admins veem todos
CREATE POLICY "Usuários podem ver próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar perfis"
  ON profiles FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- User roles: apenas admins gerenciam
CREATE POLICY "Admins gerenciam roles"
  ON user_roles FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Presidiários: operadores e admins podem gerenciar
CREATE POLICY "Usuários autenticados veem presidiários"
  ON presidiarios FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Operadores e admins criam presidiários"
  ON presidiarios FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'operador'));

CREATE POLICY "Operadores e admins atualizam presidiários"
  ON presidiarios FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'operador'));

CREATE POLICY "Apenas admins deletam presidiários"
  ON presidiarios FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Transferências
CREATE POLICY "Usuários autenticados veem transferências"
  ON transferencias FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Operadores e admins criam transferências"
  ON transferencias FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'operador'));

-- Ocorrências
CREATE POLICY "Usuários autenticados veem ocorrências"
  ON ocorrencias FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Operadores e admins criam ocorrências"
  ON ocorrencias FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'operador'));

-- Saúde (acesso mais restrito)
CREATE POLICY "Apenas admins veem saúde"
  ON saude_psicologia FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Apenas admins gerenciam saúde"
  ON saude_psicologia FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Visitas
CREATE POLICY "Usuários autenticados veem visitas"
  ON visitas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Operadores e admins registram visitas"
  ON visitas FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'operador'));

-- Logs (apenas admins)
CREATE POLICY "Apenas admins veem logs"
  ON logs_sistema FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Sistema registra logs"
  ON logs_sistema FOR INSERT
  TO authenticated
  WITH CHECK (true);