"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  File,
  MessageSquare,
  Paperclip,
  Pencil,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  aiService,
  AiChatItem,
  AiUsageInfo,
} from "@services/api";

type Attachment = { id: string; name: string; size: number };
type Message = {
  id: string;
  sender: "worker" | "ai";
  text: string;
  attachments?: Attachment[];
};
const sizeLabel = (bytes: number) =>
  bytes < 1048576
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1048576).toFixed(1)} MB`;

function TypingIndicator() {
  return (
    <div className="max-w-[80%]">
      <p className="mb-1 text-xs font-semibold text-teal-700">AI</p>
      <div
        aria-label="AI is typing"
        className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm"
      >
        <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500" />
      </div>
    </div>
  );
}

export default function SharedAiAssistant() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [chats, setChats] = useState<AiChatItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [usage, setUsage] = useState<AiUsageInfo | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const userId = user?.id ?? user?.email ?? null;
  const workerName = useMemo(
    () =>
      `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
      user?.email?.split("@")[0] ||
      "Worker",
    [user],
  );
  const activeChat = chats.find((c) => c.session_id === activeSessionId) ?? null;
  const limitReached = usage?.limit_reached ?? false;

  const loadChats = async () => {
    if (!userId) return;
    setLoadingChats(true);
    try {
      const list = await aiService.listChats(userId);
      setChats(list);
    } catch {
      toast.error("Could not load your chat history.");
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    void loadChats();
    aiService
      .getUsage(userId)
      .then(setUsage)
      .catch(() => setUsage(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!userId || !activeSessionId) return;
    let cancelled = false;
    setLoadingMessages(true);
    aiService
      .getMessages(activeSessionId, userId)
      .then((history) => {
        if (cancelled) return;
        setMessages(
          history.map((m) => ({
            id: m.id,
            sender: m.role === "user" ? "worker" : "ai",
            text: m.content,
          })),
        );
      })
      .catch(() => {
        toast.error("Could not load messages for this chat.");
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, activeSessionId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const newChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setPrompt("");
    setAttachments([]);
  };

  const selectChat = (session_id: string) => {
    if (session_id === activeSessionId) return;
    setRenamingId(null);
    setActiveSessionId(session_id);
    setAttachments([]);
  };

  const removeChat = async (chat: AiChatItem) => {
    if (!userId) return;
    try {
      await aiService.deleteChat(chat.session_id, userId);
      setChats((current) =>
        current.filter((c) => c.session_id !== chat.session_id),
      );
      if (activeSessionId === chat.session_id) {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch {
      toast.error("Could not delete this chat. Please try again.");
    }
  };

  const submitRename = async (chat: AiChatItem) => {
    const title = renameValue.trim();
    setRenamingId(null);
    if (!userId || !title || title === chat.title) return;
    try {
      await aiService.renameChat(chat.session_id, userId, title);
      setChats((current) =>
        current.map((c) =>
          c.session_id === chat.session_id ? { ...c, title } : c,
        ),
      );
    } catch {
      toast.error("Could not rename this chat.");
    }
  };

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setAttachments((current) => [
      ...current,
      ...files.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        size: file.size,
      })),
    ]);
    event.target.value = "";
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const text = prompt.trim();
    if (!text || typing || !userId || limitReached) return;
    const sentAttachments = attachments;
    setMessages((current) => [
      ...current,
      {
        id: `worker-${Date.now()}`,
        sender: "worker",
        text,
        attachments: sentAttachments,
      },
    ]);
    setPrompt("");
    setAttachments([]);
    setTyping(true);
    try {
      const response = await aiService.chat({
        user_id: userId,
        message: text,
        session_id: activeSessionId,
      });
      setMessages((current) => [
        ...current,
        { id: `ai-${Date.now()}`, sender: "ai", text: response.reply },
      ]);
      setUsage(response.usage);
      if (!activeSessionId) {
        setActiveSessionId(response.session_id);
        void loadChats();
      }
    } catch (err) {
      const detail = (
        err as { response?: { data?: { detail?: unknown } } }
      )?.response?.data?.detail;
      const failureText =
        typeof detail === "string"
          ? detail
          : "The AI service could not be reached. Please try again shortly.";
      setMessages((current) => [
        ...current,
        { id: `error-${Date.now()}`, sender: "ai", text: failureText },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const disabled = !userId || typing || limitReached;

  return (
    <main className="h-full min-h-0 overflow-hidden bg-[#f8fcfb] p-0">
      <div className="mx-auto grid h-full min-h-0 w-full max-w-6xl gap-3 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-4">
        <aside className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:rounded-2xl">
          <button
            type="button"
            onClick={newChat}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1A2380] px-4 text-sm font-medium text-white hover:bg-[#11185f]"
          >
            <Plus size={17} />
            New chat
          </button>
          <div className="mt-3 min-h-0 lg:flex lg:flex-1 lg:flex-col">
            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Previous chats
            </p>
            <nav
              aria-label="Previous chats"
              className="mt-2 flex gap-2 overflow-x-auto pb-1 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden"
            >
              {loadingChats && chats.length === 0 ? (
                <p className="px-2 py-3 text-sm text-slate-500">
                  Loading chats...
                </p>
              ) : chats.length === 0 ? (
                <p className="px-2 py-3 text-sm text-slate-500">
                  No previous chats.
                </p>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.session_id}
                    className={`group flex min-w-44 items-center gap-1 rounded-lg ${
                      activeSessionId === chat.session_id
                        ? "bg-teal-50 text-teal-900"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {renamingId === chat.session_id ? (
                      <input
                        value={renameValue}
                        autoFocus
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void submitRename(chat);
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        onBlur={() => void submitRename(chat)}
                        className="min-h-11 w-full rounded-md border border-teal-300 px-2 text-sm outline-none focus:ring-2 focus:ring-teal-600/30"
                        aria-label="Rename chat"
                      />
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => selectChat(chat.session_id)}
                          className="flex min-h-11 flex-1 items-center gap-2 truncate px-2 text-left text-sm"
                        >
                          <MessageSquare size={15} className="shrink-0" />
                          <span className="truncate">{chat.title}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRenamingId(chat.session_id);
                            setRenameValue(chat.title);
                          }}
                          aria-label={`Rename chat ${chat.title}`}
                          className="rounded p-1.5 text-slate-400 opacity-100 hover:bg-teal-50 hover:text-teal-600 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeChat(chat)}
                          aria-label={`Delete chat ${chat.title}`}
                          className="mr-1 rounded p-1.5 text-slate-400 opacity-100 hover:bg-red-50 hover:text-red-600 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                ))
              )}
            </nav>
          </div>
        </aside>
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-[#f8fcfb] shadow-sm lg:rounded-2xl">
          <header className="shrink-0 border-b bg-white px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full">
                <Image
                  src="/auth_logo.svg"
                  alt="PrivaCure"
                  width={48}
                  height={48}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-semibold text-gray-800">AI Assistant</h1>
                <p className="truncate text-xs text-gray-500">
                  {activeChat?.title ??
                    (activeSessionId ? "Conversation" : "Start a new chat")}
                </p>
              </div>
              {usage && (
                <p
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
                    limitReached
                      ? "bg-red-50 text-red-600"
                      : "bg-teal-50 text-teal-700"
                  }`}
                  title={`Resets in ${usage.resets_in} (UTC: ${usage.resets_at_utc})`}
                >
                  {limitReached
                    ? `Daily limit reached · resets in ${usage.resets_in}`
                    : `${usage.tokens_remaining.toLocaleString()} / ${usage.daily_limit.toLocaleString()} tokens left today`}
                </p>
              )}
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {loadingMessages ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-slate-500">
                  Loading conversation...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="mx-auto flex max-w-md flex-col items-center py-6 text-center sm:py-10">
                <Image
                  src="/auth_logo.svg"
                  alt="PrivaCure"
                  width={56}
                  height={56}
                />
                <h2 className="mt-3 text-lg font-medium text-gray-800">
                  How can I help you today,{" "}
                  <span className="font-semibold text-teal-600">
                    {workerName}
                  </span>
                  ?
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Start a new chat or select a previous conversation.
                </p>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-4 pb-3">
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`flex flex-col ${
                      message.sender === "worker" ? "items-end" : "items-start"
                    }`}
                  >
                    <p
                      className={`mb-1 text-xs font-semibold ${
                        message.sender === "worker"
                          ? "text-[#1A2380]"
                          : "text-teal-700"
                      }`}
                    >
                      {message.sender === "worker" ? workerName : "AI"}
                    </p>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[85%] ${
                        message.sender === "worker"
                          ? "max-w-[90%] whitespace-pre-wrap rounded-br-sm bg-[#1A2380] text-white"
                          : "max-w-[90%] rounded-bl-sm bg-white text-gray-700"
                      }`}
                    >
                      {message.sender === "ai" ? (
                        // AI replies arrive as markdown (headings, lists,
                        // tables, code) — render them formatted.
                        <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:mb-1 prose-headings:mt-2 prose-headings:font-semibold prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-pre:my-2 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none prose-table:my-2 prose-blockquote:border-teal-400">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({ node, ...props }) => (
                                <a
                                  {...props}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 underline"
                                />
                              ),
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="leading-relaxed">{message.text}</p>
                      )}
                      {message.attachments?.length ? (
                        <ul className="mt-3 space-y-1.5 border-t border-white/20 pt-2">
                          {message.attachments.map((attachment) => (
                            <li
                              key={attachment.id}
                              className="flex items-center gap-2 text-xs"
                            >
                              <File size={13} />
                              <span className="truncate">
                                {attachment.name}
                              </span>
                              <span className="ml-auto whitespace-nowrap opacity-80">
                                {sizeLabel(attachment.size)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </article>
                ))}
                {typing && <TypingIndicator />}
                <div ref={endRef} />
              </div>
            )}
          </div>
          {attachments.length > 0 && (
            <div className="shrink-0 flex flex-wrap gap-2 border-t bg-white px-4 pt-2 sm:px-6">
              {attachments.map((attachment) => (
                <span
                  key={attachment.id}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border bg-slate-50 px-3 py-1 text-xs text-gray-600"
                >
                  <File size={13} className="shrink-0 text-teal-600" />
                  <span className="max-w-32 truncate">{attachment.name}</span>
                  <span className="text-gray-400">
                    {sizeLabel(attachment.size)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${attachment.name}`}
                    onClick={() =>
                      setAttachments((current) =>
                        current.filter((item) => item.id !== attachment.id),
                      )
                    }
                    className="rounded text-gray-400 hover:text-red-600"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <form
            onSubmit={submit}
            className="shrink-0 flex items-center gap-3 border-t bg-white px-4 py-2.5 sm:px-6 sm:py-3"
          >
            <label
              htmlFor="assistant-files"
              className="cursor-pointer rounded p-1 text-gray-400 hover:text-teal-600"
              aria-label="Attach files"
            >
              <Paperclip className="w-5" />
              <input
                id="assistant-files"
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                className="sr-only"
                onChange={addFiles}
              />
            </label>
            <label className="sr-only" htmlFor="shared-ai-prompt">
              Message AI
            </label>
            <input
              id="shared-ai-prompt"
              value={prompt}
              disabled={disabled}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={
                !userId
                  ? "Sign in to chat with the AI"
                  : limitReached
                    ? `Daily token limit reached — resets in ${usage?.resets_in ?? "24h"}`
                    : `Message as ${workerName}`
              }
              className="min-h-10 flex-1 rounded-full bg-slate-100 px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-teal-600/30 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!prompt.trim() || disabled}
              className="rounded-full p-2 text-teal-600 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="w-5" />
            </button>
          </form>
          <p className="shrink-0 bg-white px-4 pb-2 text-center text-[11px] text-gray-500 sm:px-6 sm:pb-3">
            Attachments stay on this device — only your message text is sent to
            the AI. Do not include sensitive patient information.
          </p>
        </section>
      </div>
    </main>
  );
}
