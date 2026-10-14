import { getSupabaseClient } from './supabase';
import {
  AppUser,
  AccessProfile,
  Deal,
  Contact,
  Expense,
  MusicRegistration,
  ClientSubscription,
} from './types';
import { DEFAULT_ROLE_PERMISSIONS } from './user-presets';

export const SupabaseService = {
  async testConnection(): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase não está configurado. Insira a URL e Anon Key.' };
    }
    try {
      const { error } = await client.from('deals').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        return { success: true, message: `Conectado ao Supabase (Tabela deals: ${error.message || 'ok'})` };
      }
      return { success: true, message: 'Conexão com Supabase estabelecida com sucesso!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao conectar com o Supabase.' };
    }
  },

  async fetchDeals(): Promise<Deal[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('deals').select('*');
      if (error || !data) return null;
      return data.map((d: any) => ({
        id: String(d.id || `deal-${Math.random()}`),
        name: d.name || d.title || 'Negócio Comercial',
        organization: d.organization || d.company || 'Geral',
        value: Number(d.value || 0),
        stage: d.stage || 'Prospecção & Lead',
        priority: d.priority || 'Média',
        probability: Number(d.probability || 50),
        closeDate: d.closeDate || d.expected_close_date || d.close_date || '30 dias',
        createdAt: d.createdAt || d.created_at || new Date().toISOString().split('T')[0],
        ownerName: d.ownerName || d.owner_name || 'Comercial',
        contactName: d.contactName || d.contact_name || 'Contato Principal',
        contactEmail: d.contactEmail || d.contact_email || '',
        contactPhone: d.contactPhone || d.contact_phone || '',
        tags: Array.isArray(d.tags) ? d.tags : [],
        notes: d.notes || '',
      }));
    } catch {
      return null;
    }
  },

  async saveDeal(deal: Deal): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('deals').upsert(deal);
      return !error;
    } catch {
      return false;
    }
  },

  async deleteDeal(dealId: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('deals').delete().eq('id', dealId);
      return !error;
    } catch {
      return false;
    }
  },

  async fetchContacts(): Promise<Contact[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('contacts').select('*');
      if (error || !data) return null;
      return data.map((c: any) => ({
        id: String(c.id || `contact-${Math.random()}`),
        name: c.name || 'Contato',
        email: c.email || '',
        phone: c.phone || '',
        role: c.role || 'Artista',
        organization: c.organization || c.company || 'Independente',
        dealCount: Number(c.dealCount || c.deal_count || 0),
        totalValue: Number(c.totalValue || c.total_value || 0),
        createdAt: c.createdAt || c.created_at || new Date().toISOString().split('T')[0],
        status: c.status || 'Ativo',
      }));
    } catch {
      return null;
    }
  },

  async saveContact(contact: Contact): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('contacts').upsert(contact);
      return !error;
    } catch {
      return false;
    }
  },

  async fetchMusicRegistrations(): Promise<MusicRegistration[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('music_registrations').select('*');
      if (error || !data) return null;
      return data.map((m: any) => ({
        id: String(m.id || `reg-${Math.random()}`),
        title: m.title || m.work_title || 'Obra Sem Título',
        artistName: m.artistName || m.artist_name || m.client_name || 'Artista Independente',
        genre: m.genre || m.literary_genre || 'Geral',
        releaseYear: Number(m.releaseYear || m.release_year || new Date().getFullYear()),
        type: m.type || m.registration_type || 'Single',
        status: m.status || 'ISRC Emitido',
        isrcCode: m.isrcCode || m.isrc_code || '',
        iswcCode: m.iswcCode || m.iswc_code || '',
        registrationDate: m.registrationDate || m.registration_date || m.created_at || new Date().toISOString().split('T')[0],
        durationSeconds: Number(m.durationSeconds || m.duration_seconds || 180),
        splits: Array.isArray(m.splits) ? m.splits : Array.isArray(m.authors_split) ? m.authors_split : [],
        notes: m.notes || m.lyrics_text || '',
      }));
    } catch {
      return null;
    }
  },

  async saveMusicRegistration(registration: MusicRegistration): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('music_registrations').upsert(registration);
      return !error;
    } catch {
      return false;
    }
  },

  async fetchExpenses(): Promise<Expense[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('expenses').select('*');
      if (error || !data) return null;
      return data.map((e: any) => ({
        id: String(e.id || `exp-${Math.random()}`),
        title: e.title || e.description || 'Despesa',
        category: e.category || 'Outros',
        amount: Number(e.amount || 0),
        date: e.date || new Date().toISOString().split('T')[0],
        artistOrProject: e.artistOrProject || e.artist_or_project || e.vendor || 'Geral',
        status: e.status === 'pago' ? 'Pago' : e.status === 'pendente' ? 'Pendente' : (e.status || 'Pago'),
      }));
    } catch {
      return null;
    }
  },

  async saveExpense(expense: Expense): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('expenses').upsert(expense);
      return !error;
    } catch {
      return false;
    }
  },

  async fetchSubscriptions(): Promise<ClientSubscription[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('client_subscriptions').select('*');
      if (error || !data) return null;
      return data.map((s: any) => ({
        id: String(s.id || `sub-${Math.random()}`),
        clientName: s.clientName || s.client_name || 'Cliente',
        email: s.email || s.client_email || '',
        planName: s.planName || s.plan_name || 'Pro Distribuição',
        status: s.status === 'ativa' ? 'Ativa' : (s.status || 'Ativa'),
        monthlyValue: Number(s.monthlyValue || s.price || 180),
        nextBillingDate: s.nextBillingDate || s.next_renewal_date || 'Próximo mês',
        registeredTracksCount: Number(s.registeredTracksCount || s.used_credits || 0),
      }));
    } catch {
      return null;
    }
  },

  async fetchUsers(): Promise<AppUser[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('users').select('*');
      if (error || !data) return null;
      return data.map((u: any) => ({
        id: String(u.id),
        name: u.name || 'Usuário',
        email: u.email || '',
        role: u.role || 'producer',
        profileId: u.profileId || u.profile_id || 'profile-producer',
        permissions: u.permissions || DEFAULT_ROLE_PERMISSIONS[u.role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || DEFAULT_ROLE_PERMISSIONS.producer,
        active: u.status === 'Ativo' || u.active === true,
      }));
    } catch {
      return null;
    }
  },

  async fetchProfiles(): Promise<AccessProfile[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('profiles').select('*');
      if (error || !data) return null;
      return data.map((p: any) => ({
        id: String(p.id),
        name: p.name || 'Perfil',
        description: p.description || '',
        role: p.role_key || p.role || 'producer',
        permissions: p.permissions || DEFAULT_ROLE_PERMISSIONS.producer,
      }));
    } catch {
      return null;
    }
  },

  async saveUser(user: AppUser): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const payload: any = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_id: user.profileId,
        role_title: user.role,
        initials: (user.name || 'US').slice(0, 2).toUpperCase(),
        status: user.active ? 'Ativo' : 'Inativo',
        permissions: user.permissions,
        password_hash: user.password || '123',
      };
      const { error } = await client.from('users').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  },

  async deleteUser(userId: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('users').delete().eq('id', userId);
      return !error;
    } catch {
      return false;
    }
  },

  async saveProfile(profile: AccessProfile): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const payload: any = {
        id: profile.id,
        name: profile.name,
        role_key: profile.role,
        description: profile.description,
        permissions: profile.permissions,
        level_name: profile.name,
      };
      const { error } = await client.from('profiles').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  },

  async deleteProfile(profileId: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('profiles').delete().eq('id', profileId);
      return !error;
    } catch {
      return false;
    }
  },

  async authenticateUser(
    email: string,
    passwordAttempt: string
  ): Promise<{ success: boolean; user?: AppUser; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = passwordAttempt.trim();

    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('users')
          .select('*')
          .ilike('email', cleanEmail)
          .limit(1);

        if (!error && data && data.length > 0) {
          const dbUser = data[0];
          const expectedPass = dbUser.password_hash || dbUser.password || '123';

          if (cleanPass !== expectedPass) {
            return {
              success: false,
              message: 'Senha incorreta. Verifique suas credenciais de acesso.',
            };
          }

          if (dbUser.status === 'Inativo') {
            return {
              success: false,
              message: 'Este usuário está inativo no sistema.',
            };
          }

          const user: AppUser = {
            id: String(dbUser.id),
            name: dbUser.name || 'Usuário',
            email: dbUser.email,
            role: dbUser.role || 'admin',
            profileId: dbUser.profile_id || 'profile-admin',
            permissions:
              dbUser.permissions ||
              DEFAULT_ROLE_PERMISSIONS[dbUser.role as keyof typeof DEFAULT_ROLE_PERMISSIONS] ||
              DEFAULT_ROLE_PERMISSIONS.admin,
            active: dbUser.status !== 'Inativo',
            password: expectedPass,
          };

          return { success: true, user };
        }
      } catch (err) {
        console.warn('[Supabase Auth] Fallback to local accounts check:', err);
      }
    }

    return {
      success: false,
      message: 'Usuário não cadastrado no banco de dados.',
    };
  },
};
