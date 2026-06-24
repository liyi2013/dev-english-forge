import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Panel, Button } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getNotifications, type Notification } from "@/data/mockNotifications";
import { cn } from "@/lib/utils";
import { Bell, CheckCheck, ChevronRight, Clock, BookOpen, FileText, RotateCcw, Flame } from "lucide-react";

const typeIcons: Record<string, typeof Bell> = {
  'learning-reminder': BookOpen,
  'report-ready': FileText,
  'review-due': RotateCcw,
  'streak-reminder': Flame,
};

const typeLabels: Record<string, { en: string; zh: string }> = {
  'learning-reminder': { en: 'Learning', zh: '学习提醒' },
  'report-ready': { en: 'Report', zh: '报告' },
  'review-due': { en: 'Review', zh: '复习' },
  'streak-reminder': { en: 'Streak', zh: '连续学习' },
};

export default function Notifications() {
  const { t, locale } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>(() => getNotifications());

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success(t("notifications.allRead"));
  };

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);
  const sorted = [...unread, ...read];

  return (
    <div>
      <PageHeader
        title={t("notifications.title")}
        subtitle={unreadCount > 0 ? t("notifications.unreadCount").replace("{count}", String(unreadCount)) : t("notifications.allCaughtUp")}
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <CheckCheck className="w-3.5 h-3.5" /> {t("notifications.markAllRead")}
            </Button>
          ) : undefined
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title={t("notifications.empty")}
          description={t("notifications.emptyDesc")}
        />
      ) : (
        <div className="space-y-1">
          {sorted.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            const typeLabel = locale === "zh-CN" ? typeLabels[n.type]?.zh || "" : typeLabels[n.type]?.en || "";
            return (
              <div
                key={n.id}
                className={cn(
                  "panel flex items-start gap-3 p-4 transition cursor-pointer hover:bg-accent/50",
                  !n.read && "border-primary/20 bg-accent/30"
                )}
                onClick={() => handleMarkRead(n.id)}
              >
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", !n.read ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground")}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">{typeLabel}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className={cn("text-sm mt-0.5 break-words", !n.read ? "font-medium text-foreground" : "text-muted-foreground")}>
                    {locale === "zh-CN" ? n.titleZh : n.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 break-words leading-relaxed">
                    {locale === "zh-CN" ? n.messageZh : n.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {n.link && (
                      <Link to={n.link} className="text-xs text-primary hover:underline flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                        {t("common.view")} <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
