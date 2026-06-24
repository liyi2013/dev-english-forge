import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Code2,
  MessageSquareCode,
  Briefcase,
  Mic,
  RotateCcw,
  User,
  Search,
  Bell,
  Flame,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const navItems = [
  { to: "/", labelKey: "nav.dashboard", icon: LayoutDashboard, end: true },
  { to: "/learning", labelKey: "nav.learning", icon: GraduationCap },
  { to: "/technical-english", labelKey: "nav.technical", icon: Code2 },
  { to: "/interview-english", labelKey: "nav.interview", icon: MessageSquareCode },
  { to: "/workplace-english", labelKey: "nav.workplace", icon: Briefcase },
  { to: "/ai-interview", labelKey: "nav.aiInterview", icon: Mic },
  { to: "/review", labelKey: "nav.review", icon: RotateCcw },
  { to: "/profile", labelKey: "nav.profile", icon: User },
];

function SidebarContent({ onNavigate, t }: { onNavigate?: () => void; t: (k: string) => string }) {
  return (
    <>
      <div className="h-14 flex items-center gap-2 px-5 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-mono text-sm font-bold">
          {`</>`}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">DevEnglish</span>
          <span className="text-[10px] text-muted-foreground tracking-wide uppercase">{t('nav.home')}</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {t('nav.workspace')}
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-md transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="panel p-3 bg-accent border-transparent">
          <div className="flex items-center gap-2 text-xs font-medium text-accent-foreground">
            <Flame className="w-3.5 h-3.5" />
            {t('nav.streak')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">{t('nav.streakHint')}</p>
        </div>
      </div>
    </>
  );
}

function TopHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const current = navItems.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to))) ?? navItems[0];
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query || "cache")}`);
  };

  return (
    <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden h-8 w-8 inline-flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="text-muted-foreground hidden sm:inline">DevEnglish</span>
          <span className="text-muted-foreground hidden sm:inline">/</span>
          <span className="font-medium text-foreground truncate">{t(current.labelKey)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {/* Desktop search */}
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="h-8 w-72 pl-8 pr-3 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring"
          />
        </form>
        {/* Mobile search icon */}
        <button
          onClick={() => navigate('/search')}
          className="md:hidden h-8 w-8 inline-flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
          aria-label={t('common.search')}
        >
          <Search className="w-4 h-4" />
        </button>
        <LanguageSwitcher />
        <Link to="/notifications" aria-label={t("common.notifications")} className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
          <Bell className="w-4 h-4" />
        </Link>
        <Link to="/profile" className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold border border-border">
          JL
        </Link>
      </div>
    </header>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="h-screen flex bg-background text-foreground">
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-border bg-sidebar flex-col">
        <SidebarContent t={t} />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 max-w-[80%] bg-sidebar border-r border-border flex flex-col shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent t={t} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 lg:pb-0">
          <div className="w-full max-w-[1400px] min-w-0 mx-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-card border-t border-border flex items-stretch justify-around px-1">
        {[navItems[0], navItems[1], navItems[5], navItems[6], navItems[7]].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            <span className="truncate max-w-full px-1">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
