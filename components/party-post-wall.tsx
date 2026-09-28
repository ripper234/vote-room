"use client";

import { useEffect, useRef, useState } from "react";
import type { PartyPost } from "@/lib/party-posts";

type XWidgets = { widgets: { createTweet: (id: string, target: HTMLElement, options: Record<string, unknown>) => Promise<HTMLElement | undefined> } };
declare global { interface Window { twttr?: XWidgets } }

let widgetLoader: Promise<XWidgets> | null = null;
function loadWidget(): Promise<XWidgets> {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr);
  if (!widgetLoader) widgetLoader = new Promise<XWidgets>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => { script.remove(); reject(new Error("X widget timed out")); }, 8000);
    script.src = "https://platform.x.com/widgets.js";
    script.async = true;
    script.onload = () => { window.clearTimeout(timeout); window.twttr?.widgets ? resolve(window.twttr) : reject(new Error("X widget unavailable")); };
    script.onerror = () => { window.clearTimeout(timeout); reject(new Error("X widget blocked")); };
    document.head.appendChild(script);
  }).catch((error) => { widgetLoader = null; throw error; });
  return widgetLoader!;
}

function PostCard({ post }: { post: PartyPost }) {
  const card = useRef<HTMLElement>(null);
  const embedTarget = useRef<HTMLDivElement>(null);
  const autoAttempted = useRef(false);
  const loading = useRef(false);
  const [embedState, setEmbedState] = useState<"idle" | "loading" | "shown" | "error">("idle");

  useEffect(() => {
    if (!card.current || autoAttempted.current) return;
    if (typeof IntersectionObserver === "undefined") { autoAttempted.current = true; void showOriginal(); return; }
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || autoAttempted.current) return;
      autoAttempted.current = true;
      observer.disconnect();
      void showOriginal();
    }, { rootMargin: "80px", threshold: 0.1 });
    observer.observe(card.current);
    return () => observer.disconnect();
  }, [post.url]);

  async function showOriginal() {
    if (!embedTarget.current || loading.current) return;
    if (embedState === "shown") { embedTarget.current.replaceChildren(); setEmbedState("idle"); return; }
    loading.current = true;
    setEmbedState("loading");
    let timeout = 0;
    try {
      const widgets = await loadWidget();
      const id = post.url.match(/\/status\/(\d+)/)?.[1];
      if (!id) throw new Error("Invalid post link");
      embedTarget.current.replaceChildren();
      const result = await Promise.race([
        widgets.widgets.createTweet(id, embedTarget.current, { lang: "he", dnt: true, conversation: "none" }),
        new Promise<undefined>((_, reject) => { timeout = window.setTimeout(() => reject(new Error("X post timed out")), 8000); }),
      ]);
      if (!result) throw new Error("Post unavailable");
      setEmbedState("shown");
    } catch {
      embedTarget.current?.replaceChildren();
      setEmbedState("error");
    } finally {
      if (timeout) window.clearTimeout(timeout);
      loading.current = false;
    }
  }

  return <article ref={card} className="post-card" dir="rtl" data-has-excerpt={Boolean(post.excerpt)}>
    <div className="post-card-meta"><a className="post-author" href={post.url} target="_blank" rel="noopener noreferrer" aria-label={`לקריאת הפוסט המקורי של ${post.author} ב־X`}>{post.author} ↗</a><time dateTime={post.date}>{new Date(`${post.date}T12:00:00Z`).toLocaleDateString("he-IL", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time></div>
    {post.excerpt && embedState !== "shown" && <div className="post-excerpt-wrap"><span>קטע מהפוסט</span><blockquote className="post-excerpt" dir="auto">{post.excerpt}</blockquote></div>}
    {embedState === "loading" && <p className="post-embed-loading" role="status">טוען את הפוסט המקורי…</p>}
    <div ref={embedTarget} className={embedState === "shown" ? "post-embed shown" : "post-embed"} />
    <p className="post-summary">{post.summary}</p>
    <p className="post-reason"><strong>למה כאן?</strong> {post.reason}</p>
    {post.context && <p className="post-context">{post.context}</p>}
    <div className="post-actions">
      <a href={post.url} target="_blank" rel="noopener noreferrer">לפוסט ב־X ↗</a>
      <button type="button" onClick={showOriginal} disabled={embedState === "loading"} aria-pressed={embedState === "shown"}>
        {embedState === "loading" ? "טוען…" : embedState === "shown" ? "הסתר את המקור" : embedState === "error" ? "נסה להציג כאן שוב" : "הצג כאן"}
      </button>
    </div>
    {embedState === "error" && <p className="post-embed-error" role="status">לא הצלחנו להציג כאן את הפוסט מ־X. ייתכן שהפוסט אינו זמין או שהדפדפן חוסם הטמעה. {post.excerpt ? "הציטוט והסיכום" : "הסיכום"} שלמעלה נשארים לקריאה; <a href={post.url} target="_blank" rel="noopener noreferrer">אפשר לנסות לפתוח את הפוסט המקורי ב־X ↗</a>.</p>}
  </article>;
}

export function PartyPostWall({ posts, partyName, partyColor, coverageNote }: { posts: PartyPost[]; partyName: string; partyColor: string; coverageNote?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const sectionId = "party-posts-title";

  function goTo(index: number) {
    const target = track.current?.children[index] as HTMLElement | undefined;
    if (!target) return;
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", inline: "start", block: "nearest" });
    setActive(index);
  }

  function updatePosition() {
    if (!track.current) return;
    const edge = track.current.getBoundingClientRect().right;
    const nearest = Array.from(track.current.children).reduce((best, child, index) =>
      Math.abs(child.getBoundingClientRect().right - edge) < Math.abs((track.current?.children[best] as Element).getBoundingClientRect().right - edge) ? index : best, 0);
    setActive(nearest);
  }

  return <section className="panel post-wall" aria-labelledby={sectionId} style={{ "--party-accent": partyColor } as React.CSSProperties}>
    <div className="post-wall-heading">
      <div><span className="post-wall-kicker">הקול שלהם, במקור</span><h2 id={sectionId}>פוסטים נבחרים של {partyName}</h2><p>פוסטים שבחרנו ידנית. המקור נטען מ־X כשמגיעים לאזור, ולצדו הסבר קצר שלנו.</p>{coverageNote && <p style={{ marginTop: 10, color: "#795a0d" }}><strong>כיסוי הפוסטים:</strong> {coverageNote}</p>}</div>
      {posts.length > 1 && <div className="post-wall-controls" aria-label="מעבר בין פוסטים">
        <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="לפוסט הקודם">→</button>
        <span aria-live="polite">{active + 1} / {posts.length}</span>
        <button type="button" onClick={() => goTo(active + 1)} disabled={active === posts.length - 1} aria-label="לפוסט הבא">←</button>
      </div>}
    </div>
    {posts.length ? <>
      <div className="post-track" ref={track} onScroll={updatePosition} role="region" aria-label={`פוסטים נבחרים של ${partyName}; אפשר להחליק הצידה`} tabIndex={0}>
        {posts.map((post) => <PostCard key={post.url} post={post} />)}
      </div>
      <p className="post-wall-hint">החליקו הצידה לעוד פוסטים. אם X חוסם הצגה, הציטוט, הסיכום והקישור למקור נשארים זמינים.</p>
    </> : <p className="post-wall-empty">עוד לא מצאנו פוסט ישיר ומאומת של הרשימה או מועמדיה שמתאים לאזור הזה. נעדכן כשנמצא מקור טוב.</p>}
  </section>;
}
