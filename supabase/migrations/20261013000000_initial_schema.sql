-- ==============================================================================
-- SUPABASE MIGRATION: 20261013000000_initial_schema.sql
-- SISTEMA: SONORA CRM • REGISTRO DE MÚSICA & GESTÃO DE ROYALTIES
-- AUTOR: Edcarlos Lima (Desenvolvedor & Administrador)
-- DESCRIÇÃO: Criação da estrutura relacional completa, RBAC, chaves estrangeiras,
--            índices de performance e políticas de segurança RLS (Row Level Security).
-- ==============================================================================

-- Habilita extensões necessárias para UUID e criptografia
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABELA DE PERFIS DE ACESSO (RBAC / PROFILES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    role_key VARCHAR(50) NOT NULL DEFAULT 'seller',
    level INTEGER NOT NULL DEFAULT 3,
    level_name VARCHAR(120) NOT NULL,
    description TEXT,
    badge_bg VARCHAR(100) DEFAULT 'bg-blue-50 border-blue-200',
    badge_text VARCHAR(100) DEFAULT 'text-blue-700',
    is_system_profile BOOLEAN DEFAULT FALSE,
    permissions JSONB NOT NULL DEFAULT '{"allowedTabs": ["dashboard"], "canCreateDeals": false, "canManageContacts": false, "canExportData": false, "canAccessSettings": false, "canDeleteRecords": false}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. TABELA DE USUÁRIOS DO SISTEMA (USERS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) DEFAULT '123',
    role VARCHAR(50) NOT NULL DEFAULT 'seller',
    profile_id VARCHAR(64) REFERENCES public.profiles(id) ON DELETE SET NULL,
    role_title VARCHAR(100) NOT NULL,
    avatar TEXT,
    initials VARCHAR(10) NOT NULL,
    avatar_bg VARCHAR(100) DEFAULT 'bg-indigo-600 text-white',
    status VARCHAR(20) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    credits_balance INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TABELA DE CONTATOS & CLIENTES (CONTACTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contacts (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    company VARCHAR(150),
    email VARCHAR(180),
    phone VARCHAR(50),
    role VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Ativo',
    stage VARCHAR(50) DEFAULT 'Lead Qualificado',
    last_activity VARCHAR(100),
    deals_count INTEGER DEFAULT 0,
    total_value NUMERIC(15, 2) DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. TABELA DE NEGÓCIOS & COTAÇÕES (DEALS / CRM PIPELINE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.deals (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(150) NOT NULL,
    value NUMERIC(15, 2) NOT NULL DEFAULT 0,
    stage VARCHAR(80) NOT NULL DEFAULT 'Proposta Enviada',
    probability INTEGER NOT NULL DEFAULT 50,
    close_date DATE,
    owner VARCHAR(120),
    owner_avatar TEXT,
    priority VARCHAR(20) DEFAULT 'Média' CHECK (priority IN ('Alta', 'Média', 'Baixa')),
    score INTEGER DEFAULT 50,
    track_title VARCHAR(150),
    isrc_code VARCHAR(50),
    contact_id VARCHAR(64) REFERENCES public.contacts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. TABELA DE TAREFAS (TASKS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    due_date VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Pendente' CHECK (status IN ('Concluída', 'Pendente', 'Em Atraso')),
    priority VARCHAR(20) DEFAULT 'Média' CHECK (priority IN ('Alta', 'Média', 'Baixa')),
    deal_title VARCHAR(200),
    deal_id VARCHAR(64) REFERENCES public.deals(id) ON DELETE CASCADE,
    assigned_to VARCHAR(120),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. TABELA DE ATIVIDADES & AUDITORIA (ACTIVITIES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activities (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    timestamp VARCHAR(50),
    time_ago VARCHAR(50),
    type VARCHAR(50) NOT NULL,
    action_prompt VARCHAR(150),
    amount NUMERIC(15, 2),
    deal_id VARCHAR(64) REFERENCES public.deals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. TABELA DE DESPESAS (EXPENSES: ANÚNCIOS & SERVIÇOS DIGITAIS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.expenses (
    id VARCHAR(64) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('anuncios', 'servicos_digitais', 'operacional')),
    type VARCHAR(80) NOT NULL,
    vendor VARCHAR(120) NOT NULL,
    status VARCHAR(30) DEFAULT 'pago' CHECK (status IN ('pago', 'pendente', 'cancelado')),
    invoice_url TEXT,
    receipt_ref VARCHAR(100),
    created_by VARCHAR(120),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. TABELA DE REGISTROS DE MÚSICA (MUSIC REGISTRATIONS: ÁUDIO & POESIA)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.music_registrations (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64) REFERENCES public.users(id) ON DELETE CASCADE,
    client_name VARCHAR(150) NOT NULL,
    work_title VARCHAR(200) NOT NULL,
    original_title VARCHAR(200),
    registration_type VARCHAR(50) NOT NULL CHECK (registration_type IN ('audio_lyrics', 'lyrics_poetry')),
    status VARCHAR(30) DEFAULT 'autenticado' CHECK (status IN ('em_analise', 'aprovado', 'autenticado', 'rejeitado')),
    certificate_code VARCHAR(100) UNIQUE NOT NULL,
    hash_sha256 VARCHAR(128) NOT NULL,
    protocol_ecad VARCHAR(100),
    isrc_code VARCHAR(50),
    iswc_code VARCHAR(50),
    literary_genre VARCHAR(80),
    musical_genre VARCHAR(80),
    lyrics_text TEXT,
    duration_seconds INTEGER DEFAULT 0,
    authors_split JSONB NOT NULL DEFAULT '[]'::jsonb,
    audio_file_name VARCHAR(255),
    audio_file_url TEXT,
    sheet_music_url TEXT,
    certificate_issued_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. TABELA DE PLANOS & ASSINATURAS DE CLIENTES (CLIENT SUBSCRIPTIONS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.client_subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64) REFERENCES public.users(id) ON DELETE CASCADE,
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(180) NOT NULL,
    plan_name VARCHAR(80) NOT NULL,
    monthly_credits INTEGER NOT NULL DEFAULT 5,
    used_credits INTEGER NOT NULL DEFAULT 0,
    remaining_credits INTEGER NOT NULL DEFAULT 5,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) DEFAULT 'ativa' CHECK (status IN ('ativa', 'cancelada', 'atrasada', 'pausada')),
    next_renewal_date DATE,
    payment_method VARCHAR(50) DEFAULT 'Cartão de Crédito',
    invoices JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ÍNDICES DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_contact ON public.deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);
CREATE INDEX IF NOT EXISTS idx_music_reg_client ON public.music_registrations(client_id);
CREATE INDEX IF NOT EXISTS idx_music_reg_hash ON public.music_registrations(hash_sha256);
CREATE INDEX IF NOT EXISTS idx_music_reg_cert ON public.music_registrations(certificate_code);
CREATE INDEX IF NOT EXISTS idx_subscriptions_client ON public.client_subscriptions(client_id);

-- ==============================================================================
-- TRIGGER PARA ATUALIZAÇÃO AUTOMÁTICA DE updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_contacts_updated_at ON public.contacts;
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_deals_updated_at ON public.deals;
CREATE TRIGGER trg_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_expenses_updated_at ON public.expenses;
CREATE TRIGGER trg_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_music_reg_updated_at ON public.music_registrations;
CREATE TRIGGER trg_music_reg_updated_at BEFORE UPDATE ON public.music_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.client_subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON public.client_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso público/anon e autenticado no contexto do Aura HUB
CREATE POLICY "Permitir leitura pública de perfis" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Permitir inserção e atualização de perfis" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura de usuários" ON public.users FOR SELECT USING (true);
CREATE POLICY "Permitir gestão de usuários" ON public.users FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo a contatos" ON public.contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo a negócios" ON public.deals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo a tarefas" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo a atividades" ON public.activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo a despesas" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo a registros musicais" ON public.music_registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo a assinaturas" ON public.client_subscriptions FOR ALL USING (true) WITH CHECK (true);
