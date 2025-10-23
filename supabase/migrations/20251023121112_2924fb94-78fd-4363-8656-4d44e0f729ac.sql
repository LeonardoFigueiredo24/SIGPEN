-- Adicionar role 'visitante' ao enum app_role
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND typcategory = 'E') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'operador', 'visitante');
  ELSIF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'visitante') THEN
    ALTER TYPE app_role ADD VALUE 'visitante';
  END IF;
END $$;

-- Alterar tabela presidiarios para suportar múltiplos processos e crimes
ALTER TABLE presidiarios 
  ALTER COLUMN processo_numero TYPE TEXT[] USING CASE 
    WHEN processo_numero IS NULL OR processo_numero = '' THEN ARRAY[]::TEXT[]
    ELSE ARRAY[processo_numero]
  END,
  ALTER COLUMN crime TYPE TEXT[] USING CASE 
    WHEN crime IS NULL OR crime = '' THEN ARRAY[]::TEXT[]
    ELSE ARRAY[crime]
  END;

-- Criar bucket de storage para fotos dos presidiários
INSERT INTO storage.buckets (id, name, public) 
VALUES ('presidiario-fotos', 'presidiario-fotos', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para fotos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Operadores e admins podem fazer upload de fotos'
  ) THEN
    CREATE POLICY "Operadores e admins podem fazer upload de fotos"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'presidiario-fotos' AND
      (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'operador'::app_role))
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Usuários autenticados podem ver fotos'
  ) THEN
    CREATE POLICY "Usuários autenticados podem ver fotos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'presidiario-fotos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Operadores e admins podem atualizar fotos'
  ) THEN
    CREATE POLICY "Operadores e admins podem atualizar fotos"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'presidiario-fotos' AND
      (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'operador'::app_role))
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Apenas admins podem deletar fotos'
  ) THEN
    CREATE POLICY "Apenas admins podem deletar fotos"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'presidiario-fotos' AND
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;