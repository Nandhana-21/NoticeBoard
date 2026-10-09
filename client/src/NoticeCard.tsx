import { Notice } from "./types";

interface NoticeCardProps {
  notice: Notice;
  onReadMore: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

const categoryClasses: Record<string, string> = {
  Academics: "academics",
  Examinations: "exams",
  Placements: "placements",
  "Events & Workshops": "events",
  Projects: "projects",
  "Faculty Announcements": "faculty",
};

function NoticeCard({ notice, onReadMore, onEdit, onDelete, compact = false }: NoticeCardProps) {
  const category = notice.category ?? "Academics";
  const priority = notice.priority ?? "Normal";

  return (
    <article className={`notice-card${compact ? " notice-card-compact" : ""}${notice.isSample ? " notice-card-sample" : ""}`}>
      <div className="notice-card-top">
        <div className="notice-badges">
          <span className={`category-badge category-${categoryClasses[category] ?? "academics"}`}>
            <span className="category-dot" />
            {category}
          </span>
          {priority !== "Normal" && <span className={`priority-badge priority-${priority.toLowerCase()}`}>{priority}</span>}
          {notice.pinned && <span className="pinned-badge"><span aria-hidden="true">⌖</span> Pinned</span>}
          {notice.isSample && <span className="sample-label">SAMPLE</span>}
        </div>
        {(onEdit || onDelete) && (
          <div className="notice-actions">
            {onEdit && <button type="button" onClick={onEdit} aria-label={`Edit ${notice.title}`}>Edit</button>}
            {onDelete && <button type="button" onClick={onDelete} aria-label={`Delete ${notice.title}`}>Delete</button>}
          </div>
        )}
      </div>
      <button type="button" className="notice-title-button" onClick={onReadMore}>
        <h3>{notice.title}</h3><span aria-hidden="true">↗</span>
      </button>
      <p className="notice-description">{notice.message}</p>
      {notice.attachmentUrl && <div className="notice-attachment"><span aria-hidden="true">↗</span>Document attached</div>}
      <div className="notice-card-footer">
        <div className="notice-author"><span className="author-avatar">{notice.isSample ? "S" : (notice.author ?? "C").charAt(0).toUpperCase()}</span><span><strong>{notice.author ?? "CSE Department"}</strong><small>{notice.isSample ? "Demonstration only" : "Publishing faculty"}</small></span></div>
        <div className="notice-dates"><span>Published {formatPublishedDate(notice.publishedAt ?? notice.createdAt)}</span>{notice.expiresAt && <span>Expires {formatPublishedDate(notice.expiresAt)}</span>}</div>
        <button type="button" className="notice-read-more" onClick={onReadMore}>Read more <span>→</span></button>
      </div>
    </article>
  );
}

function formatPublishedDate(value?: string) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Date to be announced";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default NoticeCard;
