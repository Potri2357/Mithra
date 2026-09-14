import type { ComponentType } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Check,
  BookOpen,
  Database,
  Search,
  Building2,
  Factory,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Shield,
  ShieldAlert,
  Phone,
  Mail,
  X,
  XCircle,
  Gavel,
  Scale,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  AlertTriangle,
  Upload,
  Plus,
  Home,
  Award,
  FlaskConical,
  Users,
  BarChart3,
  Ship,
  Truck,
  GraduationCap,
  MessageSquare,
  FileText,
  CreditCard,
  Calculator,
  Camera,
  Send,
  Download,
  Trash2,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Filter,
  LayoutGrid,
  List,
  Copy,
  MapPin,
  Landmark,
  CheckSquare,
  HelpCircle,
} from "lucide-react";

type LucideIconComponent = ComponentType<{
  size?: number | string;
  className?: string;
  fill?: string;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
}>;

const ICON_MAP: Record<string, LucideIconComponent> = {
  // Verification & Checks
  verified: CheckCircle2,
  verified_user: ShieldCheck,
  check_circle: CheckCircle2,
  check: Check,
  task_alt: CheckSquare,
  fact_check: CheckSquare,

  // Books & Catalogues
  library_books: BookOpen,
  book: BookOpen,
  database: Database,
  description: FileText,

  // Search & Navigation
  search: Search,
  arrow_forward: ArrowRight,
  arrow_back: ArrowLeft,
  chevron_right: ChevronRight,
  expand_more: ChevronDown,
  menu: Menu,
  close: X,
  cancel: XCircle,
  open_in_new: ExternalLink,

  // Buildings, Industry & Transport
  factory: Factory,
  corporate_fare: Building2,
  domain: Building2,
  apartment: Building2,
  account_balance: Landmark,
  local_shipping: Truck,
  directions_boat: Ship,

  // Dates & Time
  schedule: Clock,
  event: Calendar,

  // Science & Testing
  biotech: FlaskConical,
  science: FlaskConical,

  // Safety & Legal
  shield: Shield,
  health_and_safety: ShieldCheck,
  gpp_bad: ShieldAlert,
  warning: AlertTriangle,
  gavel: Gavel,
  scale: Scale,

  // Communication & Contact
  call: Phone,
  mail: Mail,
  chat: MessageSquare,
  forum: MessageSquare,

  // UI Theme & Media
  dark_mode: Moon,
  light_mode: Sun,
  photo_camera: Camera,
  upload_file: Upload,
  file_upload: Upload,
  mic: Mic,
  mic_off: MicOff,
  volume_up: Volume2,
  volume_off: VolumeX,

  // Actions & Layout
  auto_awesome: Sparkles,
  add: Plus,
  home: Home,
  workspace_premium: Award,
  school: GraduationCap,
  groups: Users,
  group: Users,
  query_stats: BarChart3,
  analytics: BarChart3,
  payments: CreditCard,
  calculate: Calculator,
  send: Send,
  download: Download,
  delete: Trash2,
  progress_activity: Loader2,
  filter_alt: Filter,
  grid_view: LayoutGrid,
  view_list: List,
  content_copy: Copy,
  location_on: MapPin,
};

type MaterialIconProps = {
  name: string;
  className?: string;
  size?: number;
  filled?: boolean;
  "aria-hidden"?: boolean;
};

export default function MaterialIcon({
  name,
  className = "",
  size = 20,
  filled = false,
  "aria-hidden": ariaHidden = true,
}: MaterialIconProps) {
  const normalized = name.trim().toLowerCase();
  const IconComponent = ICON_MAP[normalized] || HelpCircle;

  return (
    <IconComponent
      size={size}
      className={`inline-block flex-shrink-0 ${className}`}
      fill={filled ? "currentColor" : "none"}
      strokeWidth={2}
      aria-hidden={ariaHidden}
    />
  );
}
