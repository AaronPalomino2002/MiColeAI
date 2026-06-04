"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { api } from "@/lib/api";

interface AgentSubject {
    name: string;
    iconName: string;
    colorTheme: string;
}

interface Agent {
    id: string;
    name: string;
    subject: AgentSubject;
}

interface Message {
    id: string;
    sender: "STUDENT" | "AGENT";
    content: string;
    sentAt: string;
}

// Student messages may be plain text or JSON { text, imageUrl }
function parseContent(raw: string): { text: string; imageUrl?: string } {
    try {
        const parsed = JSON.parse(raw) as { text: string; imageUrl?: string };
        if (typeof parsed === "object" && parsed !== null) return parsed;
    } catch {
        // plain text
    }
    return { text: raw };
}

function ChatContent() {
    const t = useTranslations("Chat");
    const searchParams = useSearchParams();
    const agentId = searchParams.get("agentId");

    const [agent, setAgent] = useState<Agent | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [loadingSession, setLoadingSession] = useState(true);

    // Image state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!agentId) { setLoadingSession(false); return; }

        async function init() {
            try {
                const agentData: Agent = await api.get(`/agents/${agentId}`);
                setAgent(agentData);

                const sessions: Array<{ id: string; agentId: string }> = await api.get("/chat/sessions");
                const existing = sessions.find((s) => s.agentId === agentId);

                let sid: string;
                if (existing) {
                    sid = existing.id;
                } else {
                    const newSession: { id: string } = await api.post("/chat/sessions", { agentId });
                    sid = newSession.id;
                }

                setSessionId(sid);
                const msgs: Message[] = await api.get(`/chat/sessions/${sid}/messages`);
                setMessages(msgs);
            } catch (e) {
                console.error("Chat init error:", e);
            } finally {
                setLoadingSession(false);
            }
        }

        init();
    }, [agentId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        // reset input so same file can be re-selected
        e.target.value = "";
    }

    function removeImage() {
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    }

    async function handleSend() {
        if ((!input.trim() && !selectedFile) || !sessionId || sending) return;
        const content = input.trim();
        setInput("");
        setSending(true);

        const optimisticId = `opt-${Date.now()}`;
        const optimisticContent = selectedFile
            ? JSON.stringify({ text: content, imageUrl: previewUrl })
            : content;

        setMessages((prev) => [
            ...prev,
            { id: optimisticId, sender: "STUDENT", content: optimisticContent, sentAt: new Date().toISOString() },
        ]);

        // Clear image preview immediately for UX
        const fileToUpload = selectedFile;
        removeImage();

        try {
            const form = new FormData();
            form.append("content", content);
            if (fileToUpload) form.append("image", fileToUpload);

            const aiMessage: Message = await api.postForm(
                `/chat/sessions/${sessionId}/messages`,
                form,
            );

            setMessages((prev) => [
                ...prev.filter((m) => m.id !== optimisticId),
                {
                    id: `student-${Date.now()}`,
                    sender: "STUDENT",
                    content: previewUrl ? JSON.stringify({ text: content, imageUrl: previewUrl }) : content,
                    sentAt: new Date().toISOString(),
                },
                aiMessage,
            ]);
        } catch (e) {
            console.error("Send error:", e);
            setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        } finally {
            setSending(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex h-full overflow-hidden bg-white dark:bg-slate-950">
            <main className="flex-1 flex flex-col">
                {/* Chat Header */}
                <header className="h-20 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined">
                                {agent?.subject?.iconName ?? "smart_toy"}
                            </span>
                        </div>
                        <div>
                            <h2 className="font-black text-lg">{agent ? agent.name : t("title")}</h2>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {t("status")}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {loadingSession ? (
                        <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            Cargando...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex gap-4 max-w-3xl">
                            <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined">smart_toy</span>
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t("aiRole")}</p>
                                <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl rounded-tl-none border border-slate-200/50 dark:border-slate-800/50 prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-1">
                                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                        {t("greeting", { subject: agent?.name ?? "" })}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const { text, imageUrl } = parseContent(msg.content);
                            if (msg.sender === "STUDENT") {
                                return (
                                    <div key={msg.id} className="flex gap-4 max-w-3xl ml-auto justify-end">
                                        <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none max-w-xl space-y-2">
                                            {imageUrl && (
                                                <Image
                                                    src={imageUrl}
                                                    alt="imagen adjunta"
                                                    width={300}
                                                    height={200}
                                                    className="rounded-xl object-cover max-h-52 w-auto"
                                                    unoptimized
                                                />
                                            )}
                                            {text && <p className="text-sm leading-relaxed">{text}</p>}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div key={msg.id} className="flex gap-4 max-w-3xl">
                                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                                        <span className="material-symbols-outlined">smart_toy</span>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t("aiRole")}</p>
                                        <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl rounded-tl-none border border-slate-200/50 dark:border-slate-800/50 prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-1">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {sending && (
                        <div className="flex gap-4 max-w-3xl">
                            <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
                                <span className="material-symbols-outlined">smart_toy</span>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl rounded-tl-none border border-slate-200/50 dark:border-slate-800/50">
                                <span className="flex gap-1 items-center">
                                    <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                                    <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                                    <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Bar */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    {/* Image preview */}
                    {previewUrl && (
                        <div className="max-w-4xl mx-auto mb-3">
                            <div className="relative inline-block">
                                <Image
                                    src={previewUrl}
                                    alt="preview"
                                    width={120}
                                    height={80}
                                    className="rounded-xl object-cover h-20 w-auto border-2 border-primary/30"
                                    unoptimized
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 size-5 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xs" style={{ fontSize: 14 }}>close</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="max-w-4xl mx-auto flex gap-3 items-center">
                        {/* Image attach button */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={!sessionId || sending}
                            className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border-2 border-transparent hover:border-primary/30 flex items-center justify-center text-slate-400 hover:text-primary transition-all disabled:opacity-50 shrink-0"
                            title="Adjuntar imagen"
                        >
                            <span className="material-symbols-outlined">image</span>
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t("inputPlaceholder")}
                            disabled={!sessionId || sending}
                            className="flex-1 bg-slate-100 dark:bg-slate-900 border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-primary/20 transition-all outline-none text-slate-900 dark:text-slate-100 disabled:opacity-50"
                        />

                        <button
                            onClick={handleSend}
                            disabled={(!input.trim() && !selectedFile) || !sessionId || sending}
                            className="bg-primary text-white size-14 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Cargando chat...
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
