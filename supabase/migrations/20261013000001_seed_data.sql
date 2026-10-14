-- ==============================================================================
-- SUPABASE MIGRATION: 20261013000001_seed_data.sql
-- SISTEMA: SONORA CRM • REGISTRO DE MÚSICA & GESTÃO DE ROYALTIES
-- DESCRIÇÃO: Carga inicial de dados de demonstração (Perfis RBAC, Usuários,
--            Despesas Operacionais, Registros de Música e Assinaturas).
-- ==============================================================================

-- 1. SEED DE PERFIS DE ACESSO
INSERT INTO public.profiles (id, name, role_key, level, level_name, description, badge_bg, badge_text, is_system_profile, permissions)
VALUES
('profile-admin', 'Administrador / Desenvolvedor', 'admin', 1, 'Nível 1 - Acesso Total', 'Acesso irrestrito a todas as telas, relatórios, governança, despesas e cadastros.', 'bg-indigo-50 border-indigo-200', 'text-indigo-700', TRUE, '{"allowedTabs": ["dashboard", "client-dashboard", "music-registration", "expenses", "subscriptions", "pipeline", "contacts", "deal-details", "reports", "settings"], "canCreateDeals": true, "canManageContacts": true, "canExportData": true, "canAccessSettings": true, "canDeleteRecords": true}'::jsonb),
('profile-manager', 'Gerente Comercial', 'manager', 2, 'Nível 2 - Gestão & Relatórios', 'Gestão comercial, pipeline, relatórios financeiros e despesas operacionais.', 'bg-emerald-50 border-emerald-200', 'text-emerald-700', TRUE, '{"allowedTabs": ["dashboard", "client-dashboard", "music-registration", "expenses", "subscriptions", "pipeline", "contacts", "deal-details", "reports"], "canCreateDeals": true, "canManageContacts": true, "canExportData": true, "canAccessSettings": false, "canDeleteRecords": false}'::jsonb),
('profile-seller', 'Executivo de Vendas', 'seller', 3, 'Nível 3 - Operacional Comercial', 'Acesso ao funil de cotações, carteira de clientes e novas oportunidades.', 'bg-blue-50 border-blue-200', 'text-blue-700', TRUE, '{"allowedTabs": ["dashboard", "client-dashboard", "music-registration", "pipeline", "contacts", "subscriptions", "deal-details"], "canCreateDeals": true, "canManageContacts": true, "canExportData": false, "canAccessSettings": false, "canDeleteRecords": false}'::jsonb),
('profile-viewer', 'Visualizador / Auditor', 'viewer', 4, 'Nível 4 - Somente Leitura', 'Acesso de consulta ao dashboard de royalties e relatórios para auditoria.', 'bg-amber-50 border-amber-200', 'text-amber-800', TRUE, '{"allowedTabs": ["dashboard", "contacts", "reports"], "canCreateDeals": false, "canManageContacts": false, "canExportData": false, "canAccessSettings": false, "canDeleteRecords": false}'::jsonb),
('profile-client', 'Usuário de Serviço / Artista', 'client', 5, 'Nível 5 - Artista & Compositor', 'Área exclusiva do cliente: saldo de créditos, registro de músicas e assinaturas.', 'bg-purple-50 border-purple-200', 'text-purple-700', TRUE, '{"allowedTabs": ["client-dashboard", "music-registration", "subscriptions"], "canCreateDeals": false, "canManageContacts": false, "canExportData": true, "canAccessSettings": false, "canDeleteRecords": false}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    permissions = EXCLUDED.permissions;

-- 2. SEED DE USUÁRIOS
INSERT INTO public.users (id, name, email, password_hash, role, profile_id, role_title, avatar, initials, avatar_bg, status, permissions, credits_balance)
VALUES
('user-1', 'Edcarlos Lima', 'edcarloscael@gmail.com', '123', 'admin', 'profile-admin', 'Desenvolvedor & Admin', '/images/avatar_rodrigo.jpg', 'EL', 'bg-blue-600 text-white', 'Ativo', '{"allowedTabs": ["dashboard", "client-dashboard", "music-registration", "expenses", "subscriptions", "pipeline", "contacts", "deal-details", "reports", "settings"], "canCreateDeals": true, "canManageContacts": true, "canExportData": true, "canAccessSettings": true, "canDeleteRecords": true}'::jsonb, 50),
('user-2', 'Beatriz Lima', 'beatriz.lima@auracrm.com', '123', 'manager', 'profile-manager', 'Gerente Comercial', '/images/avatar_beatriz.jpg', 'BL', 'bg-purple-600 text-white', 'Ativo', '{"allowedTabs": ["dashboard", "client-dashboard", "music-registration", "expenses", "subscriptions", "pipeline", "contacts", "deal-details", "reports"], "canCreateDeals": true, "canManageContacts": true, "canExportData": true, "canAccessSettings": false, "canDeleteRecords": false}'::jsonb, 30),
('user-3', 'Lucas Amaral', 'lucas.amaral@auracrm.com', '123', 'seller', 'profile-seller', 'Executivo de Vendas', '/images/avatar_guilherme.jpg', 'LA', 'bg-emerald-600 text-white', 'Ativo', '{"allowedTabs": ["dashboard", "client-dashboard", "music-registration", "pipeline", "contacts", "subscriptions", "deal-details"], "canCreateDeals": true, "canManageContacts": true, "canExportData": false, "canAccessSettings": false, "canDeleteRecords": false}'::jsonb, 15),
('user-4', 'Marina Sol (Artista)', 'marina.sol@music.com', '123', 'client', 'profile-client', 'Compositora & Cantora', NULL, 'MS', 'bg-pink-600 text-white', 'Ativo', '{"allowedTabs": ["client-dashboard", "music-registration", "subscriptions"], "canCreateDeals": false, "canManageContacts": false, "canExportData": true, "canAccessSettings": false, "canDeleteRecords": false}'::jsonb, 8)
ON CONFLICT (id) DO UPDATE SET 
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions;

-- 3. SEED DE DESPESAS (ANÚNCIOS & SERVIÇOS DIGITAIS)
INSERT INTO public.expenses (id, description, amount, date, category, type, vendor, status, created_by, notes)
VALUES
('exp-1', 'Campanha Meta Ads - Lançamento Single "Mar Aberto"', 1450.00, '2026-10-01', 'anuncios', 'Meta Ads (Instagram & Facebook)', 'Meta Platforms Inc.', 'pago', 'Edcarlos Lima', 'Anúncios de tráfego direto para Spotify e pré-save no Instagram.'),
('exp-2', 'Campanha Google Ads - Palavras-chave "Registro ISRC"', 890.00, '2026-10-05', 'anuncios', 'Google Ads', 'Google Brasil', 'pago', 'Beatriz Lima', 'Campanha de busca focada em compositores independentes.'),
('exp-3', 'Hospedagem Servidores Cloud & API Aura HUB', 420.00, '2026-10-02', 'servicos_digitais', 'Hospedagem em Nuvem', 'Amazon Web Services (AWS)', 'pago', 'Edcarlos Lima', 'Infraestrutura de banco de dados, storage de áudio e hash SHA-256.'),
('exp-4', 'Lote de Registros e Protocolos ECAD / UBC', 1250.00, '2026-10-08', 'servicos_digitais', 'Taxas de Registro de Música (ISRC/ECAD)', 'UBC / ECAD Autoral', 'pago', 'Edcarlos Lima', 'Taxas de homologação e certidões de anterioridade lote Outubro.'),
('exp-5', 'Renovação Domínio e Certificados SSL sonoramusc.com', 189.00, '2026-09-28', 'servicos_digitais', 'Domínios e APIs Externas', 'Registro.br', 'pago', 'Edcarlos Lima', 'Renovação anual de segurança criptográfica.')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED DE REGISTROS DE MÚSICA
INSERT INTO public.music_registrations (id, client_id, client_name, work_title, registration_type, status, certificate_code, hash_sha256, isrc_code, iswc_code, literary_genre, lyrics_text, duration_seconds, authors_split)
VALUES
('reg-1', 'user-1', 'Edcarlos Lima', 'Mar Aberto (Versão Acústica)', 'audio_lyrics', 'autenticado', 'CERT-2026-8841-BR', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'BR-S9M-26-00182', 'T-312.459.882-1', 'MPB Contemporânea', 'O mar que bate na falésia não tem medo de quebrar / Minha canção corre nas águas para te encontrar...', 214, '[{"name": "Edcarlos Lima", "role": "Autor / Letra e Melodia", "percentage": 70}, {"name": "Marina Sol", "role": "Intérprete", "percentage": 30}]'::jsonb),
('reg-2', 'user-1', 'Edcarlos Lima', 'O Vento das Quatro Horas', 'lyrics_poetry', 'autenticado', 'CERT-2026-9932-BR', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', NULL, 'T-982.112.404-9', 'Poesia Lírica', 'Quando o relógio bate quatro na matriz deserta / Uma folha cai no chão como uma carta aberta / Guardei teu nome no silêncio da colina...', 0, '[{"name": "Edcarlos Lima", "role": "Autor da Obra Lírica", "percentage": 100}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED DE ASSINATURAS DE CLIENTES
INSERT INTO public.client_subscriptions (id, client_id, client_name, client_email, plan_name, monthly_credits, used_credits, remaining_credits, price, status, next_renewal_date, invoices)
VALUES
('sub-1', 'user-1', 'Edcarlos Lima', 'edcarloscael@gmail.com', 'Plano Selo & Editora (Label Pro)', 30, 2, 28, 149.00, 'ativa', '2026-11-15', '[{"id": "inv-101", "date": "15/10/2026", "amount": 149.00, "status": "Pago", "pdfUrl": "#"}]'::jsonb),
('sub-2', 'user-4', 'Marina Sol (Artista)', 'marina.sol@music.com', 'Plano Compositor Independente', 5, 1, 4, 49.00, 'ativa', '2026-11-01', '[{"id": "inv-102", "date": "01/10/2026", "amount": 49.00, "status": "Pago", "pdfUrl": "#"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;
