export interface Env {
  BOT_DB: D1Database;
  BOT_SESSIONS: KVNamespace;
  BOT_APP_NAME?: string;
  BOT_DEFAULT_TIMEZONE?: string;
  TELEGRAM_MINI_APP_URL?: string;
  ADMIN_ALLOWED_EMAILS?: string;
  ADMIN_PANEL_URL?: string;
  TELEGRAM_SECRET_TOKEN?: string;
  TELEGRAM_ALLOWED_USER_IDS?: string;
  TELEGRAM_BOT_TOKEN?: string;
  DO_SPACES_KEY?: string;
  DO_SPACES_SECRET?: string;
  DO_SPACES_BUCKET?: string;
  DO_SPACES_REGION?: string;
  DO_SPACES_ENDPOINT?: string;
  DO_SPACES_PUBLIC_BASE_URL?: string;
  DO_SPACES_UPLOAD_PREFIX?: string;
}

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: string;
}

export interface TelegramMessage {
  message_id: number;
  date?: number;
  text?: string;
  caption?: string;
  photo?: Array<{ file_id: string; file_unique_id?: string; width: number; height: number; file_size?: number }>;
  from?: TelegramUser;
  chat: TelegramChat;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
}

export interface BotSession {
  step: "idle" | "awaiting_new_post_input" | "awaiting_edit_instruction";
  draftId?: string;
  mode?: "idea" | "link";
  editTarget?: string;
  updatedAt: string;
}

export interface DraftRecord {
  id: string;
  telegramUserId: string;
  status: "draft" | "approved" | "published" | "archived";
  mode: "idea" | "link";
  sourceType: "idea" | "link";
  sourceValue: string;
  title: string | null;
  excerpt?: string | null;
  slug: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  contentMarkdown?: string | null;
  contentHtml?: string | null;
  segment: string | null;
  serviceFocus: string | null;
  categoriesJson?: string | null;
  tagsJson?: string | null;
  imageUrl?: string | null;
  imagePrompt?: string | null;
  readingMinutes?: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BotResponse {
  text: string;
  photo?: string;
  reply_markup?: {
    inline_keyboard: Array<
      Array<{ text: string; callback_data?: string; url?: string; web_app?: { url: string } }>
    >;
  };
}
