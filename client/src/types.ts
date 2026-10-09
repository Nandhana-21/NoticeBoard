export type NoticeCategory =
  | "Academics"
  | "Examinations"
  | "Placements"
  | "Events & Workshops"
  | "Projects"
  | "Faculty Announcements";

export type NoticePriority = "Normal" | "Important" | "Urgent";

export interface Notice {
  _id: string;
  title: string;
  message: string;
  category?: NoticeCategory;
  priority?: NoticePriority;
  publishedAt?: string;
  expiresAt?: string;
  eventDate?: string;
  author?: string;
  pinned?: boolean;
  isSample?: boolean;
  attachmentUrl?: string;
  createdAt?: string;
}
