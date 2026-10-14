export type DealStage =
  | 'Prospecção & Lead'
  | 'Qualificação Técnica'
  | 'Proposta Comercial'
  | 'Negociação & Fechamento'
  | 'Contrato Assinado'
  | 'Perdido';

export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export type TabKey =
  | 'dashboard'
  | 'client-dashboard'
  | 'music-registration'
  | 'pipeline'
  | 'contacts'
  | 'expenses'
  | 'subscriptions'
  | 'users'
  | 'profiles'
  | 'landing-admin'
  | 'deal-details'
  | 'reports'
  | 'settings';

export type UserRole = 'admin' | 'manager' | 'artist' | 'producer';

export type RegistrationType = 'Single' | 'EP' | 'Álbum' | 'Obra Literomusical' | 'Fonograma';

export type RegistrationStatus = 'Rascunho' | 'Em Análise' | 'Homologado ECAD' | 'ISRC Emitido' | 'Rejeitado';

export interface RegistrationSplit {
  id: string;
  name: string;
  role: 'Compositor' | 'Intérprete' | 'Músico Acompanhante' | 'Produtor Fonográfico' | 'Editora';
  percentage: number;
  document: string;
  email: string;
  ecadCode?: string;
}

export interface MusicRegistration {
  id: string;
  title: string;
  artistName: string;
  genre: string;
  releaseYear: number;
  type: RegistrationType;
  status: RegistrationStatus;
  isrcCode?: string;
  iswcCode?: string;
  registrationDate: string;
  upcCode?: string;
  durationSeconds?: number;
  splits: RegistrationSplit[];
  lyricSnippet?: string;
  audioFileName?: string;
  notes?: string;
}

export interface Deal {
  id: string;
  name: string;
  organization: string;
  value: number;
  probability: number;
  stage: DealStage;
  closeDate: string;
  ownerName: string;
  ownerAvatar?: string;
  priority: Priority;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  tags: string[];
  notes?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  organization: string;
  dealCount: number;
  totalValue: number;
  avatar?: string;
  status: 'Ativo' | 'Inativo' | 'Lead Quente';
  notes?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  assignedTo: string;
  dealId?: string;
  dealName?: string;
  priority: Priority;
}

export interface Activity {
  id: string;
  dealId?: string;
  dealName?: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'stage_change' | 'isrc_issued';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Estúdio & Gravação' | 'Marketing & Lançamento' | 'Distribuição' | 'Direitos & ECAD' | 'Design & Capa' | 'Outros';
  amount: number;
  date: string;
  artistOrProject: string;
  status: 'Pago' | 'Pendente' | 'Agendado';
  receiptUrl?: string;
}

export type ExpenseCategory = Expense['category'];

export interface ClientSubscription {
  id: string;
  clientName: string;
  email: string;
  planName: 'Básico Artista' | 'Pro Distribuição' | 'Selo Enterprise' | string;
  status: 'Ativa' | 'Atrasada' | 'Cancelada';
  monthlyValue: number;
  nextBillingDate: string;
  registeredTracksCount: number;
}

export interface UserPermissions {
  allowedTabs: TabKey[];
  canEditDeals: boolean;
  canDeleteDeals: boolean;
  canExportReports: boolean;
  canManageUsers: boolean;
  canIssueIsrc: boolean;
  canApproveRegistrations: boolean;
  canManageSettings: boolean;
}

export interface AccessProfile {
  id: string;
  name: string;
  description: string;
  role: UserRole;
  permissions: UserPermissions;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profileId: string;
  permissions: UserPermissions;
  active: boolean;
  password?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  dealsCount: number;
  wonValue: number;
  avatar?: string;
}

export interface LandingPlan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  period: string; // e.g. "/mês"
  description: string;
  features: string[];
  popular?: boolean;
  popularBadge?: string;
  buttonText: string;
  buttonVariant?: 'primary' | 'outline';
  active: boolean;
}

export interface LandingFaq {
  id: string;
  question: string;
  answer: string;
}

export interface LandingMetric {
  id: string;
  value: string;
  label: string;
}

export interface LandingService {
  id: string;
  number: string;
  title: string;
  description: string;
  linkText: string;
  iconName: string;
}

export interface LandingStep {
  id: string;
  step: string;
  title: string;
  description: string;
}

export interface LandingPageConfig {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroTrack: {
    title: string;
    album: string;
    artist: string;
    isrc: string;
    iswc: string;
    status: string;
    splits: { label: string; percentage: number; color: string }[];
    royaltiesTracked: number;
  };
  metrics: LandingMetric[];
  servicesTitle: string;
  servicesSubtitle: string;
  services: LandingService[];
  stepsTitle: string;
  stepsSubtitle: string;
  steps: LandingStep[];
  plansTitle: string;
  plansSubtitle: string;
  plans: LandingPlan[];
  faqsTitle: string;
  faqs: LandingFaq[];
  ctaTitle: string;
  ctaSubtitle: string;
  theme: 'light' | 'dark';
}

