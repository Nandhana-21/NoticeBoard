import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import NoticeCard from "./NoticeCard";
import { Notice, NoticeCategory, NoticePriority } from "./types";

const categories: NoticeCategory[] = [
  "Academics",
  "Examinations",
  "Placements",
  "Events & Workshops",
  "Projects",
  "Faculty Announcements",
];

const navigation = [
  { label: "Dashboard", icon: "dashboard", view: "dashboard" },
  { label: "All notices", icon: "notices", view: "all" },
  { label: "Academics", icon: "academics", view: "Academics" },
  { label: "Examination updates", icon: "exams", view: "Examinations" },
  { label: "Placements & internships", icon: "placements", view: "Placements" },
  { label: "Events & workshops", icon: "events", view: "Events & Workshops" },
  { label: "Projects & hackathons", icon: "projects", view: "Projects" },
  { label: "Timetable", icon: "timetable", view: "Timetable" },
  { label: "Faculty announcements", icon: "faculty", view: "Faculty Announcements" },
  { label: "Settings", icon: "settings", view: "Settings" },
];

const demonstrationNotices: Notice[] = [
  {
    _id: "sample-project-review",
    title: "Final-year project review: preparation checklist",
    message:
      "Use this demonstration notice to preview how a project review announcement will appear. Faculty should publish verified review dates and submission instructions through the faculty portal.",
    category: "Projects",
    priority: "Important",
    author: "Sample content · not an official notice",
    publishedAt: "2026-10-06T09:00:00.000Z",
    pinned: true,
    isSample: true,
  },
  {
    _id: "sample-workshop",
    title: "AI & machine learning workshop — sample listing",
    message:
      "A sample announcement showing where workshop information belongs. This is demonstration content only; no real event, registration, or date is being announced.",
    category: "Events & Workshops",
    priority: "Normal",
    author: "Sample content · not an official notice",
    publishedAt: "2026-10-04T09:00:00.000Z",
    eventDate: "2026-10-21T09:00:00.000Z",
    isSample: true,
  },
  {
    _id: "sample-placement",
    title: "Campus placement preparation resources — sample",
    message:
      "A demonstration placement update. Check with the department placement coordinator for verified company announcements and deadlines.",
    category: "Placements",
    priority: "Normal",
    author: "Sample content · not an official notice",
    publishedAt: "2026-10-01T09:00:00.000Z",
    isSample: true,
  },
  {
    _id: "sample-examination",
    title: "Internal assessment schedule — sample notice",
    message:
      "Demonstration only: a sample place for an internal assessment timetable. Check official faculty announcements for confirmed dates, rooms, and examination instructions.",
    category: "Examinations",
    priority: "Important",
    author: "Sample content · not an official notice",
    publishedAt: "2026-09-28T09:00:00.000Z",
    isSample: true,
  },
  {
    _id: "sample-academics",
    title: "Laboratory schedule and assignment reminders — sample",
    message:
      "This non-official example demonstrates how academic deadlines and practical schedules may be shared on the portal.",
    category: "Academics",
    priority: "Normal",
    author: "Sample content · not an official notice",
    publishedAt: "2026-09-25T09:00:00.000Z",
    isSample: true,
  },
  {
    _id: "sample-faculty",
    title: "Department circular — sample content",
    message:
      "Example only. Faculty announcements should be published by authorized department personnel after details have been verified.",
    category: "Faculty Announcements",
    priority: "Normal",
    author: "Sample content · not an official notice",
    publishedAt: "2026-09-22T09:00:00.000Z",
    isSample: true,
  },
];

const categoryIcons: Record<string, string> = {
  Academics: "academics",
  Examinations: "exams",
  Placements: "placements",
  "Events & Workshops": "events",
  Projects: "projects",
  "Faculty Announcements": "faculty",
};

const iconContents: Record<string, ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
  notices: <><path d="M8 4h8l4 4v12H4V4h4" /><path d="M14 4v5h5M8 13h8M8 17h8" /></>,
  academics: <><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v17H5.5A2.5 2.5 0 0 0 3 22V5.5ZM21 5.5A2.5 2.5 0 0 0 18.5 3H12v17h6.5A2.5 2.5 0 0 1 21 22V5.5Z" /></>,
  exams: <><path d="M8 3h8l4 4v14H4V3h4" /><path d="M14 3v5h5M8 13h8M8 17h5" /></>,
  placements: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
  events: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h2M14 14h2M8 17h2" /></>,
  projects: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></>,
  timetable: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  faculty: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6" /></>,
  settings: <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  pin: <><path d="m16 3 5 5-4 1-5 5-1 5-2-2-2-2-2-2 5-1 5-5 1-4ZM6 18l-3 3" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  attachment: <><path d="m21 11.5-8.5 8.5a5 5 0 0 1-7.1-7.1l9.2-9.2a3.3 3.3 0 0 1 4.7 4.7l-9.2 9.2a1.7 1.7 0 0 1-2.4-2.4l8.5-8.5" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>,
};

function Icon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconContents[name] ?? iconContents.notices}
    </svg>
  );
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token = "",
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "error" in result &&
      typeof result.error === "string"
        ? result.error
        : "The request could not be completed.";
    throw new Error(message);
  }
  if (result === null) throw new Error("The server returned an unreadable response.");
  return result as T;
}

function dateInputValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 16);
}

function formatDate(value?: string, options: Intl.DateTimeFormatOptions = {}) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Date to be announced";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(value));
}

function App() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [view, setView] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [sortOrder, setSortOrder] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSamplePreview, setIsSamplePreview] = useState(false);
  const [accessToken, setAccessToken] = useState(
    () => window.sessionStorage.getItem("cse-faculty-token") ?? "",
  );
  const [facultyName, setFacultyName] = useState("");
  const [authVerified, setAuthVerified] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dialog, setDialog] = useState<"login" | "editor" | "detail" | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    message: "",
    category: categories[0],
    priority: "Normal" as NoticePriority,
    publishedAt: dateInputValue(new Date().toISOString()),
    expiresAt: "",
    eventDate: "",
    pinned: false,
  });

  const loadNotices = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await apiRequest<Notice[]>("/api/notices");
      if (!Array.isArray(data)) throw new Error("The server returned an unexpected notice list.");
      setIsSamplePreview(data.length === 0);
      setNotices(data.length === 0 ? demonstrationNotices : data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load department notices.");
      setNotices([]);
      setIsSamplePreview(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotices();
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setAuthVerified(true);
      return;
    }
    let cancelled = false;
    apiRequest<{ name: string }>("/api/auth/session", {}, accessToken)
      .then((session) => {
        if (!cancelled) {
          setFacultyName(session.name);
          setAuthVerified(true);
        }
      })
      .catch(() => {
        window.sessionStorage.removeItem("cse-faculty-token");
        if (!cancelled) {
          setAccessToken("");
          setFacultyName("");
          setAuthVerified(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDialog(null);
        setProfileOpen(false);
        setNotificationsOpen(false);
        setMobileMenuOpen(false);
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => window.removeEventListener("keydown", handleKeyboardShortcuts);
  }, []);

  const activeNotices = useMemo(
    () =>
      notices.filter(
        (notice) => {
          const publishedAt = new Date(notice.publishedAt ?? notice.createdAt ?? 0).getTime();
          const expiresAt = notice.expiresAt ? new Date(notice.expiresAt).getTime() : Infinity;
          return publishedAt <= Date.now() && expiresAt >= Date.now();
        },
      ),
    [notices],
  );

  const upcomingEvents = useMemo(
    () =>
      activeNotices
        .filter(
          (notice) =>
            notice.category === "Events & Workshops" &&
            notice.eventDate &&
            new Date(notice.eventDate).getTime() >= Date.now(),
        )
        .sort(
          (left, right) =>
            new Date(left.eventDate ?? "").getTime() - new Date(right.eventDate ?? "").getTime(),
        )
        .slice(0, 3),
    [activeNotices],
  );

  const activeCategory =
    view === "Timetable" ? "Academics" : categories.includes(view as NoticeCategory) ? view : "";
  const query = search.trim().toLocaleLowerCase();
  const filteredNotices = useMemo(() => {
    let result = activeNotices.filter((notice) => {
      const matchesSearch = !query || `${notice.title} ${notice.message} ${notice.author} ${notice.category}`
        .toLocaleLowerCase()
        .includes(query);
      const matchesCategory =
        (!activeCategory || notice.category === activeCategory) &&
        (categoryFilter === "All categories" || notice.category === categoryFilter);
      return matchesSearch && matchesCategory;
    });
    if (sortOrder === "oldest") {
      result = [...result].sort(
        (left, right) =>
          new Date(left.publishedAt ?? left.createdAt ?? 0).getTime() -
          new Date(right.publishedAt ?? right.createdAt ?? 0).getTime(),
      );
    } else if (sortOrder === "priority") {
      const priority = { Urgent: 0, Important: 1, Normal: 2 };
      result = [...result].sort(
        (left, right) => priority[left.priority ?? "Normal"] - priority[right.priority ?? "Normal"],
      );
    } else {
      result = [...result].sort(
        (left, right) =>
          new Date(right.publishedAt ?? right.createdAt ?? 0).getTime() -
          new Date(left.publishedAt ?? left.createdAt ?? 0).getTime(),
      );
    }
    return result;
  }, [activeCategory, activeNotices, categoryFilter, query, sortOrder]);

  const pinnedNotice =
    activeNotices.find((notice) => notice.priority === "Urgent") ??
    activeNotices.find((notice) => notice.pinned);
  const urgentNotices = activeNotices.filter((notice) => notice.priority === "Urgent");
  const isDashboard = view === "dashboard";
  const selectedNavigation = navigation.find((item) => item.view === view);

  const openEditor = (notice?: Notice) => {
    if (notice?.isSample) return;
    setEditingNotice(notice ?? null);
    setShowPreview(false);
    setForm(
      notice
        ? {
            title: notice.title,
            message: notice.message,
            category: notice.category ?? categories[0],
            priority: notice.priority ?? "Normal",
            publishedAt: dateInputValue(notice.publishedAt ?? notice.createdAt),
            expiresAt: dateInputValue(notice.expiresAt),
            eventDate: dateInputValue(notice.eventDate),
            pinned: notice.pinned ?? false,
          }
        : {
            title: "",
            message: "",
            category: categories[0],
            priority: "Normal",
            publishedAt: dateInputValue(new Date().toISOString()),
            expiresAt: "",
            eventDate: "",
            pinned: false,
          },
    );
    setDialog("editor");
  };

  const handlePublish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken || !form.title.trim() || !form.message.trim()) return;
    setIsSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        message: form.message.trim(),
        category: form.category,
        priority: form.priority,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
        eventDate: form.eventDate ? new Date(form.eventDate).toISOString() : undefined,
        pinned: form.pinned,
      };
      const saved = await apiRequest<Notice>(
        editingNotice ? `/api/notices/${editingNotice._id}` : "/api/notices",
        {
          method: editingNotice ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
        accessToken,
      );
      setNotices((current) => {
        const remaining = current.filter((notice) => notice._id !== editingNotice?._id);
        return [
          saved,
          ...remaining.filter(
            (notice) => !notice.isSample && notice._id !== saved._id,
          ),
        ];
      });
      setIsSamplePreview(false);
      setDialog(null);
      setToast(editingNotice ? "Notice updated successfully." : "Notice published successfully.");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Could not save the notice.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (notice: Notice) => {
    if (notice.isSample || !accessToken) return;
    if (!window.confirm(`Delete “${notice.title}”? This action cannot be undone.`)) return;
    try {
      await apiRequest<{ success: boolean }>(
        `/api/notices/${notice._id}`,
        { method: "DELETE" },
        accessToken,
      );
      setNotices((current) => current.filter((item) => item._id !== notice._id));
      setSelectedNotice(null);
      setDialog(null);
      setToast("Notice deleted.");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Could not delete this notice.");
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const session = await apiRequest<{ token: string; name: string }>("/api/auth/session", {
        method: "POST",
        body: JSON.stringify({ accessCode }),
      });
      window.sessionStorage.setItem("cse-faculty-token", session.token);
      setAccessToken(session.token);
      setFacultyName(session.name);
      setAccessCode("");
      setDialog(null);
      setToast(`Welcome, ${session.name}. Faculty publishing is enabled.`);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Faculty sign-in failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    window.sessionStorage.removeItem("cse-faculty-token");
    setAccessToken("");
    setFacultyName("");
    setAuthVerified(true);
    setProfileOpen(false);
    setToast("You have been signed out.");
  };

  const navigate = (nextView: string) => {
    setView(nextView);
    setCategoryFilter("All categories");
    setSearch("");
    setMobileMenuOpen(false);
  };

  const openDetail = (notice: Notice) => {
    setSelectedNotice(notice);
    setDialog("detail");
  };

  const visibleTitle =
    view === "dashboard"
      ? "Good morning, CSE students"
      : view === "Settings"
        ? "Portal settings"
        : view === "Timetable"
          ? "Timetable"
          : selectedNavigation?.label ?? view;

  const showToast = (message: string) => setToast(message);

  return (
    <div className="portal">
      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-scrim"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside className={`sidebar${mobileMenuOpen ? " sidebar-open" : ""}`}>
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate("dashboard"); }}>
          <span className="brand-mark"><Icon name="projects" size={22} /></span>
          <span className="brand-copy"><strong>BYTE<span>BOARD</span></strong><small>DEPARTMENT PORTAL</small></span>
          <span className="brand-version">CSE</span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>
        <nav aria-label="Main navigation" className="side-navigation">
          {navigation.map((item, index) => (
            <div key={item.view}>
              {index === 2 && <div className="sidebar-label sidebar-section-label">DEPARTMENT</div>}
              {index === 7 && <div className="sidebar-label sidebar-section-label">RESOURCES</div>}
              <button
                type="button"
                className={`nav-item${view === item.view ? " nav-item-active" : ""}`}
                onClick={() => navigate(item.view)}
                aria-current={view === item.view ? "page" : undefined}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
                {item.view === "Examinations" && urgentNotices.length > 0 && (
                  <span className="nav-count">{urgentNotices.length}</span>
                )}
              </button>
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon"><Icon name="academics" size={17} /></div>
            <strong>Need a hand?</strong>
            <p>Contact your department office for assistance.</p>
            <button type="button" onClick={() => showToast("Contact your CSE department office through your college’s official directory.")}>Get in touch <Icon name="arrow" size={13} /></button>
          </div>
          <div className="sidebar-foot"><span className="online-dot" />CSE DEPARTMENT <span>·</span> 2026</div>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
            ><Icon name="dashboard" /></button>
            <div className="breadcrumb"><span>Department</span><Icon name="chevron" size={13} /><strong>{selectedNavigation?.label ?? "Overview"}</strong></div>
          </div>
          <div className="topbar-actions">
            <label className="global-search">
              <Icon name="search" size={17} />
              <input
                type="search"
                ref={searchInputRef}
                aria-label="Search department notices"
                placeholder="Search anything..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <kbd>Ctrl K</kbd>
            </label>
            <div className="popover-anchor">
              <button
                type="button"
                className={`icon-button notification-button${notificationsOpen ? " icon-button-selected" : ""}`}
                aria-label={`Notifications${urgentNotices.length ? `, ${urgentNotices.length} urgent` : ""}`}
                aria-expanded={notificationsOpen}
                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
              >
                <Icon name="bell" />
                {urgentNotices.length > 0 && <span className="notification-dot" />}
              </button>
              {notificationsOpen && (
                <div className="popover notification-popover">
                  <div className="popover-heading"><strong>Notifications</strong><span>{urgentNotices.length} urgent</span></div>
                  {urgentNotices.length === 0 ? (
                    <p className="popover-empty">You’re all caught up. Urgent notices will appear here.</p>
                  ) : urgentNotices.slice(0, 4).map((notice) => (
                    <button
                      type="button"
                      className="notification-item"
                      key={notice._id}
                      onClick={() => { setNotificationsOpen(false); openDetail(notice); }}
                    ><span className="notification-item-dot" /><span><strong>{notice.title}</strong><small>{notice.category}</small></span></button>
                  ))}
                </div>
              )}
            </div>
            <span className="topbar-divider" />
            <div className="popover-anchor">
              <button
                type="button"
                className="profile-trigger"
                aria-expanded={profileOpen}
                onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
              >
                <span className="avatar">{authVerified && accessToken ? "F" : "S"}</span>
                <span className="profile-label"><strong>{authVerified && accessToken ? facultyName : "CSE Student"}</strong><small>{authVerified && accessToken ? "Faculty access" : "Student portal"}</small></span>
                <span className="profile-chevron">⌄</span>
              </button>
              {profileOpen && (
                <div className="popover profile-popover">
                  <div className="profile-popover-title">Signed in as</div>
                  <strong>{authVerified && accessToken ? facultyName : "CSE Student"}</strong>
                  {authVerified && accessToken ? (
                    <button type="button" className="popover-action" onClick={handleSignOut}><Icon name="logout" size={16} />Sign out</button>
                  ) : (
                    <button type="button" className="popover-action" onClick={() => { setProfileOpen(false); setDialog("login"); }}><Icon name="faculty" size={16} />Faculty sign in</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content">
          {loadError && (
            <div className="connection-banner" role="alert">
              <span className="connection-indicator" />
              <div><strong>Notice service unavailable</strong><p>{loadError} Check that the Express API and MongoDB are running, then try again.</p></div>
              <button type="button" className="button button-small button-outline" onClick={() => void loadNotices()}>Retry</button>
            </div>
          )}

          {isSamplePreview && !loadError && (
            <div className="sample-banner"><strong>DEMO CONTENT</strong><span>These clearly labelled examples are not official department announcements. Published notices will appear here once available.</span></div>
          )}

          <section className="welcome-row">
            <div className="welcome-copy">
              <div className="eyebrow"><span className="eyebrow-line" />COMPUTER SCIENCE & ENGINEERING</div>
              <h1>{visibleTitle}<span className="welcome-period">.</span></h1>
              <p>{isDashboard ? "Your hub for academic updates, opportunities, and innovation." : `The latest ${view === "all" ? "department" : selectedNavigation?.label.toLowerCase() ?? "department"} information, all in one place.`}</p>
            </div>
            {authVerified && accessToken ? (
              <button type="button" className="button button-primary publish-button" onClick={() => openEditor()}><Icon name="plus" size={17} />Publish a notice</button>
            ) : (
              <button type="button" className="button button-outline faculty-entry" onClick={() => setDialog("login")}><Icon name="faculty" size={17} />Faculty access</button>
            )}
          </section>

          {isDashboard && (
            <>
              <section className="summary-grid" aria-label="Department notice summary">
                <article className="summary-card">
                  <div className="summary-top"><span className="summary-icon icon-blue"><Icon name="notices" /></span><span className="summary-trend"><span className="status-dot" />LIVE</span></div>
                  <div className="summary-number">{loading ? "—" : activeNotices.length}</div>
                  <div className="summary-label">Active notices <span>in the department</span></div>
                  <div className="summary-footer"><span className="summary-line blue-line" /><span>{isSamplePreview ? "Sample preview" : "Current announcements"}</span></div>
                </article>
                <article className="summary-card">
                  <div className="summary-top"><span className="summary-icon icon-gold"><Icon name="events" /></span><span className="summary-overline">ON THE CALENDAR</span></div>
                  <div className="summary-number">{loading ? "—" : upcomingEvents.length.toString().padStart(2, "0")}</div>
                  <div className="summary-label">Upcoming events <span>department-wide</span></div>
                  <div className="summary-footer"><span className="summary-line gold-line" /><span>Scheduled department events</span></div>
                </article>
                <article className="summary-card">
                  <div className="summary-top"><span className="summary-icon icon-green"><Icon name="placements" /></span><span className="summary-overline">CAREER CENTRE</span></div>
                  <div className="summary-number">{loading ? "—" : activeNotices.filter((notice) => notice.category === "Placements").length.toString().padStart(2, "0")}</div>
                  <div className="summary-label">Placement updates <span>opportunities & news</span></div>
                  <div className="summary-footer"><span className="summary-line green-line" /><span>Recruitment & internships</span></div>
                </article>
              </section>

              {pinnedNotice && (
                <section className={`featured-notice${pinnedNotice.priority === "Urgent" ? " featured-urgent" : ""}`}>
                  <div className="featured-mark"><Icon name={pinnedNotice.priority === "Urgent" ? "bell" : "pin"} size={17} /></div>
                  <div className="featured-content">
                    <div className="featured-kicker"><span>{pinnedNotice.priority === "Urgent" ? "PRIORITY ANNOUNCEMENT" : "PINNED ANNOUNCEMENT"}</span>{pinnedNotice.isSample && <span className="sample-label">SAMPLE</span>}</div>
                    <h2>{pinnedNotice.title}</h2>
                    <p>{pinnedNotice.message}</p>
                    <button type="button" className="text-link" onClick={() => openDetail(pinnedNotice)}>Read full announcement <span>→</span></button>
                  </div>
                  <div className="featured-date"><Icon name="calendar" size={15} />Published {formatDate(pinnedNotice.publishedAt ?? pinnedNotice.createdAt)}</div>
                </section>
              )}

              <div className="dashboard-grid">
                <section className="content-panel latest-panel">
                  <div className="panel-heading">
                    <div><div className="section-kicker">STAY IN THE LOOP</div><h2>Latest announcements</h2></div>
                    <button type="button" className="text-link panel-view-all" onClick={() => navigate("all")}>View all notices <span>→</span></button>
                  </div>
                  {loading ? <NoticeSkeletons count={3} /> : loadError ? <RetryState onRetry={() => void loadNotices()} /> : (
                    <div className="latest-list">
                      {activeNotices.slice(0, 4).map((notice) => (
                        <NoticeCard
                          key={notice._id}
                          notice={notice}
                          onReadMore={() => openDetail(notice)}
                          onEdit={authVerified && accessToken ? () => openEditor(notice) : undefined}
                          onDelete={authVerified && accessToken && !notice.isSample ? () => void handleDelete(notice) : undefined}
                          compact
                        />
                      ))}
                      {!activeNotices.length && <EmptyState onClear={() => navigate("all")} />}
                    </div>
                  )}
                </section>

                <aside className="right-rail">
                  <section className="content-panel events-panel">
                    <div className="panel-heading panel-heading-small"><div><div className="section-kicker">SAVE THE DATE</div><h2>Upcoming events</h2></div><button type="button" className="icon-button panel-icon-button" aria-label="View events" onClick={() => navigate("Events & Workshops")}><Icon name="arrow" size={16} /></button></div>
                    {loading ? <div className="event-skeletons"><span /><span /><span /></div> : upcomingEvents.length > 0 ? (
                      <div className="event-list">
                        {upcomingEvents.map((event) => (
                          <button type="button" className="event-item" key={event._id} onClick={() => openDetail(event)}>
                            <span className="event-date"><strong>{new Date(event.eventDate!).toLocaleDateString("en-IN", { day: "2-digit" })}</strong><small>{new Date(event.eventDate!).toLocaleDateString("en-IN", { month: "short" }).toUpperCase()}</small></span>
                            <span className="event-details"><strong>{event.title}</strong><small><Icon name="calendar" size={13} />{formatDate(event.eventDate, { year: undefined })}</small></span>
                            <Icon name="chevron" size={15} className="event-chevron" />
                          </button>
                        ))}
                      </div>
                    ) : <div className="events-empty"><span className="events-empty-icon"><Icon name="events" size={20} /></span><strong>No upcoming events</strong><p>New department events will show up here.</p></div>}
                    <button type="button" className="event-footer-link" onClick={() => navigate("Events & Workshops")}>Explore events <span>→</span></button>
                  </section>

                  <section className="quick-links-panel">
                    <div className="quick-links-heading"><div className="section-kicker">YOUR TOOLKIT</div><h2>Quick links</h2></div>
                    <div className="quick-links-grid">
                      {[
                        { label: "Timetable", icon: "timetable", destination: "Timetable" },
                        { label: "Syllabus", icon: "academics", destination: "Academics" },
                        { label: "Lab schedules", icon: "projects", destination: "Academics" },
                        { label: "Project guide", icon: "notices", destination: "Projects" },
                      ].map((link) => (
                        <button type="button" className="quick-link" key={link.label} onClick={() => navigate(link.destination)}><span><Icon name={link.icon} size={17} /></span><strong>{link.label}</strong><Icon name="arrow" size={13} className="quick-link-arrow" /></button>
                      ))}
                    </div>
                    <p className="resource-note">Resources are shared through department announcements.</p>
                  </section>
                </aside>
              </div>
            </>
          )}

          {!isDashboard && view !== "Settings" && (
            <section className="content-panel notices-panel">
              <div className="panel-heading notice-list-heading">
                <div><div className="section-kicker">{activeCategory ? "DEPARTMENT UPDATES" : "EVERYTHING IN ONE PLACE"}</div><h2>{view === "all" ? "All notices" : view === "Timetable" ? "Academic resources" : selectedNavigation?.label ?? "Notices"}</h2><p className="panel-subtitle">{loading ? "Loading the latest department updates…" : `${filteredNotices.length} ${filteredNotices.length === 1 ? "announcement" : "announcements"}${isSamplePreview ? " · sample content" : ""}`}</p></div>
                {authVerified && accessToken && <button type="button" className="button button-primary" onClick={() => openEditor()}><Icon name="plus" size={17} />New notice</button>}
              </div>
              <div className="notice-toolbar">
                <label className="filter-search"><Icon name="search" size={17} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notices..." aria-label="Search notices" /></label>
                <label className="select-label"><span>Category</span><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                <label className="select-label"><span>Sort by</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="latest">Latest first</option><option value="oldest">Oldest first</option><option value="priority">Priority</option></select></label>
              </div>
              {loading ? <NoticeSkeletons count={4} /> : loadError ? <RetryState onRetry={() => void loadNotices()} /> : filteredNotices.length > 0 ? (
                <div className="notices-list">
                  {filteredNotices.map((notice) => (
                    <NoticeCard
                      key={notice._id}
                      notice={notice}
                      onReadMore={() => openDetail(notice)}
                      onEdit={authVerified && accessToken ? () => openEditor(notice) : undefined}
                      onDelete={authVerified && accessToken && !notice.isSample ? () => void handleDelete(notice) : undefined}
                    />
                  ))}
                </div>
              ) : <EmptyState onClear={() => { setSearch(""); setCategoryFilter("All categories"); }} />}
            </section>
          )}

          {view === "Settings" && (
            <section className="content-panel settings-panel">
              <div className="section-kicker">PREFERENCES</div><h2>Portal settings</h2><p>Personalize how you browse CSE department announcements.</p>
              <div className="settings-row"><span><strong>Account access</strong><small>{authVerified && accessToken ? `Signed in as ${facultyName}` : "You are browsing as a student."}</small></span>{authVerified && accessToken ? <button type="button" className="button button-outline" onClick={handleSignOut}>Sign out</button> : <button type="button" className="button button-outline" onClick={() => setDialog("login")}>Faculty sign in</button>}</div>
              <div className="settings-row"><span><strong>Department</strong><small>Computer Science & Engineering</small></span><span className="settings-chip">CSE</span></div>
              <div className="settings-row"><span><strong>Notice updates</strong><small>Updates are loaded live from the department notice service.</small></span><button type="button" className="button button-outline" onClick={() => void loadNotices()}>Refresh</button></div>
            </section>
          )}

          <footer className="page-footer"><span>© 2026 CSE Department <span className="footer-dot">·</span> Notice Board Portal</span><span>Built for the next generation of engineers <span className="footer-spark">✳</span></span></footer>
        </div>
      </main>

      {dialog === "login" && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <section className="modal-card auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button className="modal-close" type="button" aria-label="Close" onClick={() => setDialog(null)}><Icon name="close" /></button>
            <div className="modal-icon"><Icon name="faculty" size={22} /></div><div className="section-kicker">AUTHORIZED PERSONNEL</div><h2 id="auth-title">Faculty sign in</h2><p>Enter the faculty access code provided by your department administrator. Student accounts cannot publish notices.</p>
            <form onSubmit={handleLogin} className="auth-form"><label htmlFor="access-code">Faculty access code</label><input autoFocus id="access-code" type="password" autoComplete="current-password" value={accessCode} onChange={(event) => setAccessCode(event.target.value)} required /><button className="button button-primary" type="submit" disabled={isSaving}>{isSaving ? "Verifying…" : "Continue securely"}</button></form>
            <div className="auth-footnote"><span className="online-dot" />Your access is verified securely by the department server.</div>
          </section>
        </div>
      )}

      {dialog === "editor" && (
        <div className="modal-backdrop modal-backdrop-editor" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) setDialog(null); }}>
          <section className="modal-card editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-title">
            <div className="editor-heading"><div><div className="section-kicker">FACULTY PUBLISHING</div><h2 id="editor-title">{editingNotice ? "Edit announcement" : "Create an announcement"}</h2><p>Share accurate, verified information with the CSE department.</p></div><button className="modal-close" type="button" aria-label="Close" onClick={() => setDialog(null)}><Icon name="close" /></button></div>
            {showPreview ? (
              <div className="preview-pane"><div className="preview-label">STUDENT PREVIEW <span>THIS NOTICE IS NOT PUBLISHED</span></div><NoticeCard notice={{ ...form, _id: "preview", author: facultyName || "CSE Faculty", isSample: false }} onReadMore={() => showToast("This is a preview. Publish the notice to share it.")} /><button type="button" className="button button-outline" onClick={() => setShowPreview(false)}>Back to editing</button></div>
            ) : (
              <form className="editor-form" onSubmit={handlePublish}>
                <label className="form-field form-field-full"><span>Notice title <i>*</i></span><input maxLength={120} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="A clear, specific headline" required /></label>
                <label className="form-field form-field-full"><span>Details <i>*</i></span><textarea maxLength={4000} rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Include the important details students need to know…" required /></label>
                <div className="form-two-col">
                  <label className="form-field"><span>Category</span><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as NoticeCategory })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                  <label className="form-field"><span>Priority</span><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as NoticePriority })}><option>Normal</option><option>Important</option><option>Urgent</option></select></label>
                  <label className="form-field"><span>Publish date</span><input type="datetime-local" value={form.publishedAt} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} /></label>
                  <label className="form-field"><span>Expiry date <small>(optional)</small></span><input type="datetime-local" value={form.expiresAt} onChange={(event) => setForm({ ...form, expiresAt: event.target.value })} /></label>
                  {form.category === "Events & Workshops" && <label className="form-field form-field-full"><span>Event date <small>(optional)</small></span><input type="datetime-local" value={form.eventDate} onChange={(event) => setForm({ ...form, eventDate: event.target.value })} /></label>}
                </div>
                <label className="pin-checkbox"><input type="checkbox" checked={form.pinned} onChange={(event) => setForm({ ...form, pinned: event.target.checked })} /><span className="pin-check-mark"><Icon name="pin" size={15} /></span><span><strong>Pin to dashboard</strong><small>Highlight this announcement at the top of the student dashboard.</small></span></label>
                <div className="attachment-note"><Icon name="attachment" size={16} /><span>PDF attachments are not enabled by the current backend.</span></div>
                <div className="editor-actions"><button type="button" className="button button-outline" onClick={() => setShowPreview(true)}>Preview notice</button><button type="submit" className="button button-primary" disabled={isSaving || !form.title.trim() || !form.message.trim()}>{isSaving ? "Saving…" : editingNotice ? "Save changes" : "Publish notice"}<span>→</span></button></div>
              </form>
            )}
          </section>
        </div>
      )}

      {dialog === "detail" && selectedNotice && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <article className="modal-card detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button className="modal-close" type="button" aria-label="Close" onClick={() => setDialog(null)}><Icon name="close" /></button>
            <div className="detail-topline"><span className={`category-badge category-${categoryIcons[selectedNotice.category ?? ""] ?? "notices"}`}><Icon name={categoryIcons[selectedNotice.category ?? ""] ?? "notices"} size={13} />{selectedNotice.category ?? "Academics"}</span><span className={`priority-badge priority-${(selectedNotice.priority ?? "Normal").toLowerCase()}`}>{selectedNotice.priority ?? "Normal"} priority</span>{selectedNotice.isSample && <span className="sample-label">SAMPLE CONTENT</span>}</div>
            <h2 id="detail-title">{selectedNotice.title}</h2><p className="detail-author">Published by <strong>{selectedNotice.author || "CSE Department"}</strong></p>
            <div className="detail-meta"><span><Icon name="calendar" size={15} />Published {formatDate(selectedNotice.publishedAt ?? selectedNotice.createdAt)}</span>{selectedNotice.expiresAt && <span><Icon name="timetable" size={15} />Expires {formatDate(selectedNotice.expiresAt)}</span>}</div>
            <div className="detail-message">{selectedNotice.message}</div>
            {selectedNotice.eventDate && <div className="detail-event-date"><Icon name="events" size={17} /><span><strong>Event date</strong><small>{formatDate(selectedNotice.eventDate, { hour: "numeric", minute: "2-digit" })}</small></span></div>}
            {selectedNotice.attachmentUrl && <a className="attachment-link" href={selectedNotice.attachmentUrl} target="_blank" rel="noreferrer"><Icon name="attachment" size={16} />View attached document <Icon name="arrow" size={14} /></a>}
            <div className="detail-actions">{authVerified && accessToken && !selectedNotice.isSample && <><button type="button" className="button button-outline" onClick={() => openEditor(selectedNotice)}>Edit notice</button><button type="button" className="button button-danger" onClick={() => void handleDelete(selectedNotice)}>Delete notice</button></>}<button type="button" className="button button-primary" onClick={() => setDialog(null)}>Done</button></div>
          </article>
        </div>
      )}

      {toast && <div className="toast-message" role="status"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  );
}

function NoticeSkeletons({ count }: { count: number }) {
  return (
    <div className="skeleton-list" aria-label="Loading notices" aria-busy="true">
      {Array.from({ length: count }, (_, index) => <div className="notice-skeleton" key={index}><span /><div><i /><i /><i /></div></div>)}
    </div>
  );
}

function RetryState({ onRetry }: { onRetry: () => void }) {
  return <div className="empty-state"><span className="empty-state-icon"><Icon name="notices" size={21} /></span><h3>We couldn’t load notices</h3><p>Check the API connection and try again.</p><button type="button" className="button button-outline" onClick={onRetry}>Try again</button></div>;
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return <div className="empty-state"><span className="empty-state-icon"><Icon name="search" size={21} /></span><h3>No notices match your search</h3><p>Try another keyword or clear the selected filters.</p><button type="button" className="button button-outline" onClick={onClear}>Clear search & filters</button></div>;
}

export default App;
