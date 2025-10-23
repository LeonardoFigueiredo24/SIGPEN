export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      logs_sistema: {
        Row: {
          acao: string
          created_at: string | null
          detalhes: Json | null
          id_log: number
          ip_origem: string | null
          user_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string | null
          detalhes?: Json | null
          id_log?: number
          ip_origem?: string | null
          user_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string | null
          detalhes?: Json | null
          id_log?: number
          ip_origem?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ocorrencias: {
        Row: {
          created_at: string | null
          data_ocorrencia: string
          descricao: string
          id_ocorrencia: number
          id_presidiario: number | null
          registrado_por: string | null
          tipo: Database["public"]["Enums"]["tipo_ocorrencia"] | null
        }
        Insert: {
          created_at?: string | null
          data_ocorrencia: string
          descricao: string
          id_ocorrencia?: number
          id_presidiario?: number | null
          registrado_por?: string | null
          tipo?: Database["public"]["Enums"]["tipo_ocorrencia"] | null
        }
        Update: {
          created_at?: string | null
          data_ocorrencia?: string
          descricao?: string
          id_ocorrencia?: number
          id_presidiario?: number | null
          registrado_por?: string | null
          tipo?: Database["public"]["Enums"]["tipo_ocorrencia"] | null
        }
        Relationships: [
          {
            foreignKeyName: "ocorrencias_id_presidiario_fkey"
            columns: ["id_presidiario"]
            isOneToOne: false
            referencedRelation: "presidiarios"
            referencedColumns: ["id_presidiario"]
          },
        ]
      }
      presidiarios: {
        Row: {
          ala: string | null
          apelido: string | null
          cadastrado_por: string | null
          cela: string | null
          cpf: string | null
          created_at: string | null
          crime: string[] | null
          data_nascimento: string | null
          data_prevista_soltura: string | null
          data_prisao: string | null
          estado_civil: Database["public"]["Enums"]["estado_civil"] | null
          filiacao_mae: string | null
          filiacao_pai: string | null
          foto_url: string | null
          id_presidiario: number
          juiz_responsavel: string | null
          naturalidade: string | null
          nome_completo: string
          observacoes: string | null
          pena_total: string | null
          processo_numero: string[] | null
          regime: Database["public"]["Enums"]["regime_prisional"] | null
          religiao: string | null
          rg: string | null
          situacao: Database["public"]["Enums"]["situacao_juridica"] | null
          unidade_origem: string | null
          updated_at: string | null
          vara_responsavel: string | null
        }
        Insert: {
          ala?: string | null
          apelido?: string | null
          cadastrado_por?: string | null
          cela?: string | null
          cpf?: string | null
          created_at?: string | null
          crime?: string[] | null
          data_nascimento?: string | null
          data_prevista_soltura?: string | null
          data_prisao?: string | null
          estado_civil?: Database["public"]["Enums"]["estado_civil"] | null
          filiacao_mae?: string | null
          filiacao_pai?: string | null
          foto_url?: string | null
          id_presidiario?: number
          juiz_responsavel?: string | null
          naturalidade?: string | null
          nome_completo: string
          observacoes?: string | null
          pena_total?: string | null
          processo_numero?: string[] | null
          regime?: Database["public"]["Enums"]["regime_prisional"] | null
          religiao?: string | null
          rg?: string | null
          situacao?: Database["public"]["Enums"]["situacao_juridica"] | null
          unidade_origem?: string | null
          updated_at?: string | null
          vara_responsavel?: string | null
        }
        Update: {
          ala?: string | null
          apelido?: string | null
          cadastrado_por?: string | null
          cela?: string | null
          cpf?: string | null
          created_at?: string | null
          crime?: string[] | null
          data_nascimento?: string | null
          data_prevista_soltura?: string | null
          data_prisao?: string | null
          estado_civil?: Database["public"]["Enums"]["estado_civil"] | null
          filiacao_mae?: string | null
          filiacao_pai?: string | null
          foto_url?: string | null
          id_presidiario?: number
          juiz_responsavel?: string | null
          naturalidade?: string | null
          nome_completo?: string
          observacoes?: string | null
          pena_total?: string | null
          processo_numero?: string[] | null
          regime?: Database["public"]["Enums"]["regime_prisional"] | null
          religiao?: string | null
          rg?: string | null
          situacao?: Database["public"]["Enums"]["situacao_juridica"] | null
          unidade_origem?: string | null
          updated_at?: string | null
          vara_responsavel?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          nivel_acesso: Database["public"]["Enums"]["app_role"] | null
          nome_completo: string
          ultimo_login: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          nivel_acesso?: Database["public"]["Enums"]["app_role"] | null
          nome_completo: string
          ultimo_login?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nivel_acesso?: Database["public"]["Enums"]["app_role"] | null
          nome_completo?: string
          ultimo_login?: string | null
        }
        Relationships: []
      }
      saude_psicologia: {
        Row: {
          atualizado_por: string | null
          avaliacoes_psicologicas: string | null
          condicoes_saude: string | null
          data_atualizacao: string | null
          id_presidiario: number | null
          id_registro: number
          medicamentos: string | null
          observacoes: string | null
          risco_suicidio: boolean | null
          updated_at: string | null
        }
        Insert: {
          atualizado_por?: string | null
          avaliacoes_psicologicas?: string | null
          condicoes_saude?: string | null
          data_atualizacao?: string | null
          id_presidiario?: number | null
          id_registro?: number
          medicamentos?: string | null
          observacoes?: string | null
          risco_suicidio?: boolean | null
          updated_at?: string | null
        }
        Update: {
          atualizado_por?: string | null
          avaliacoes_psicologicas?: string | null
          condicoes_saude?: string | null
          data_atualizacao?: string | null
          id_presidiario?: number | null
          id_registro?: number
          medicamentos?: string | null
          observacoes?: string | null
          risco_suicidio?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saude_psicologia_id_presidiario_fkey"
            columns: ["id_presidiario"]
            isOneToOne: false
            referencedRelation: "presidiarios"
            referencedColumns: ["id_presidiario"]
          },
        ]
      }
      transferencias: {
        Row: {
          created_at: string | null
          data_transferencia: string
          id_presidiario: number | null
          id_transferencia: number
          motivo: string | null
          responsavel: string | null
          unidade_destino: string | null
          unidade_origem: string | null
        }
        Insert: {
          created_at?: string | null
          data_transferencia: string
          id_presidiario?: number | null
          id_transferencia?: number
          motivo?: string | null
          responsavel?: string | null
          unidade_destino?: string | null
          unidade_origem?: string | null
        }
        Update: {
          created_at?: string | null
          data_transferencia?: string
          id_presidiario?: number | null
          id_transferencia?: number
          motivo?: string | null
          responsavel?: string | null
          unidade_destino?: string | null
          unidade_origem?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_id_presidiario_fkey"
            columns: ["id_presidiario"]
            isOneToOne: false
            referencedRelation: "presidiarios"
            referencedColumns: ["id_presidiario"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitas: {
        Row: {
          created_at: string | null
          data_visita: string
          documento_visitante: string | null
          id_presidiario: number | null
          id_visita: number
          nome_visitante: string
          observacoes: string | null
          parentesco: string | null
          registrado_por: string | null
        }
        Insert: {
          created_at?: string | null
          data_visita: string
          documento_visitante?: string | null
          id_presidiario?: number | null
          id_visita?: number
          nome_visitante: string
          observacoes?: string | null
          parentesco?: string | null
          registrado_por?: string | null
        }
        Update: {
          created_at?: string | null
          data_visita?: string
          documento_visitante?: string | null
          id_presidiario?: number | null
          id_visita?: number
          nome_visitante?: string
          observacoes?: string | null
          parentesco?: string | null
          registrado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitas_id_presidiario_fkey"
            columns: ["id_presidiario"]
            isOneToOne: false
            referencedRelation: "presidiarios"
            referencedColumns: ["id_presidiario"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "operador" | "consulta" | "visitante"
      estado_civil:
        | "Solteiro"
        | "Casado"
        | "Divorciado"
        | "Viúvo"
        | "União Estável"
      regime_prisional: "Fechado" | "Semiaberto" | "Aberto"
      situacao_juridica: "Provisório" | "Condenado" | "Em julgamento"
      tipo_ocorrencia:
        | "Advertência"
        | "Fuga"
        | "Briga"
        | "Boa Conduta"
        | "Outros"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "operador", "consulta", "visitante"],
      estado_civil: [
        "Solteiro",
        "Casado",
        "Divorciado",
        "Viúvo",
        "União Estável",
      ],
      regime_prisional: ["Fechado", "Semiaberto", "Aberto"],
      situacao_juridica: ["Provisório", "Condenado", "Em julgamento"],
      tipo_ocorrencia: [
        "Advertência",
        "Fuga",
        "Briga",
        "Boa Conduta",
        "Outros",
      ],
    },
  },
} as const
