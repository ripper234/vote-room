"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Party, PartyVideo, PublicVoice } from "@/lib/parties";
import { fairReadings } from "@/lib/fair-readings";
import { SaveIndicator, SaveNavigationWarning, useDecision } from "@/lib/use-decision";

const statuses = [
  { value: "open", label: "פתוח לבדיקה" },
  { value: "positive", label: "נראה מתאים" },
  { value: "concerned", label: "יש לי הסתייגויות" },
  { value: "out", label: "לא בכיוון כרגע" },
];
const assessments = [
  { value: "aligned", label: "נראה תואם" },
  { value: "unclear", label: "עוד לא ברור" },
  { value: "misaligned", label: "נראה לא תואם" },
];

function Video({ video }: { video: PartyVideo }) {
  const segment = video.excerpt;
  const params = new URLSearchParams({ rel: "0" });
  if (segment) {
    params.set("start", String(segment.start));
    params.set("end", String(segment.end));
  }
  return (
    <div>
      <div className="video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?${params.toString()}`}
          title={`${video.name}: ${video.title}, ${video.duration}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <p className="muted small" style={{ margin: "11px 0 0", lineHeight: 1.5 }}>
        {video.name} · {video.title} · {video.duration} · {video.date}.
        {segment && " קטע מתוזמן מתוך סרטון ארוך יותר."}
        {" "}<a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">למקור המלא ↗</a>
      </p>
    </div>
  );
}

function VoiceColumn({ title, items, empty }: { title: string; items: PublicVoice[]; empty: string }) {
  return (
    <div className="voice-column">
      <h3>{title}</h3>
      {items.length ? <ul className="voice-list">{items.map((item) => (
        <li key={`${item.person}-${item.date}`}>
          <strong>{item.person}</strong><span className="muted small">{item.role} · {item.date}</span>
          <p>{item.statement}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer">למקור ההצהרה ↗</a>
        </li>
      ))}</ul> : <p className="muted small">{empty}</p>}
    </div>
  );
}

export default function PartyDetail({ party }: { party: Party }) {
  const { state, saveState, update, retry, waitForSave } = useDecision();
  const [draft, setDraft] = useState<string | null>(null);
  const [blockedBack, setBlockedBack] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareDraft, setShareDraft] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const shareTextarea = useRef<HTMLTextAreaElement>(null);
  const note = state?.partyNotes[party.slug] ?? "";
  useEffect(() => {
    if (draft === null || !state || draft === note) return;
    const timer = window.setTimeout(() => saveNote(draft), 650);
    return () => window.clearTimeout(timer);
  }, [draft, note, update, party.slug]);
  function saveNote(value: string) {
    if (!state || value === note) return;
    void update((previous) => ({ ...previous, partyNotes: { ...previous.partyNotes, [party.slug]: value } }), "party_note");
    setDraft((current) => current === value ? null : current);
  }
  async function goBack(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (await waitForSave()) window.location.assign("/map");
    else setBlockedBack(true);
  }
  const relevant = party.highlights.filter((item) => state?.priorities.includes(item.topic));
  const unfilled = state?.priorities.filter((tag) => !party.highlights.some((item) => item.topic === tag)) ?? [];
  const ratings = state?.issueAssessments?.[party.slug] ?? {};
  const aligned = state?.priorities.filter((tag) => ratings[tag] === "aligned") ?? [];
  const misaligned = state?.priorities.filter((tag) => ratings[tag] === "misaligned") ?? [];
  const unclear = state?.priorities.filter((tag) => ratings[tag] === "unclear") ?? [];
  const featuredVideos = party.featuredVideos ?? [];
  const fairReading = fairReadings[party.slug];
  const supportingVoices = party.publicVoices?.filter((voice) => voice.stance === "support") ?? [];
  const opposingVoices = party.publicVoices?.filter((voice) => voice.stance === "against") ?? [];

  function openShare() {
    const impression = state?.partyStatus[party.slug];
    const opening = impression === "positive" ? `כרגע ${party.name} נראית לי אפשרות רצינית.`
      : impression === "concerned" ? `אני בודק/ת את ${party.name}, ויש לי גם הסתייגויות.`
      : impression === "out" ? `בדקתי את ${party.name}, וכרגע היא פחות מתאימה לי.`
      : `אני בודק/ת את ${party.name} לקראת הבחירות.`;
    const lines = [opening];
    if (state?.priorities.length) lines.push(`הנושאים שחשובים לי: ${state.priorities.join(" · ")}.`);
    if (aligned.length) lines.push(`לפי ההתרשמות שלי, יש התאמה ב: ${aligned.join(" · ")}.`);
    if (misaligned.length) lines.push(`יש לי פערים ב: ${misaligned.join(" · ")}.`);
    if (unclear.length) lines.push(`עוד לא ברור לי לגבי: ${unclear.join(" · ")}.`);
    if (!state?.priorities.length) lines.push("אני עדיין מנסה להבין מה מתאים לי ולמה.");
    lines.push(`דף הרשימה והמקורות: ${window.location.origin}/party/${party.slug}`);
    setShareDraft(lines.join("\n\n"));
    setCopyMessage("");
    setShareOpen(true);
  }

  async function copyShare() {
    if (!shareDraft.trim()) { setCopyMessage("כתוב משהו לפני ההעתקה."); return; }
    try {
      await navigator.clipboard.writeText(shareDraft);
      setCopyMessage("הועתק. עכשיו אפשר להדביק בפייסבוק.");
    } catch {
      shareTextarea.current?.focus();
      shareTextarea.current?.select();
      setCopyMessage("ההעתקה לא הצליחה. הטקסט מסומן כדי שתוכל/י להעתיק ידנית.");
    }
  }

  return (
    <main className="shell">
      <div className="detail-hero" style={{ "--party-accent": party.color } as React.CSSProperties}>
        <a href="/map" onClick={goBack} style={{ color: "#c7d8ff", textUnderlineOffset: 4 }}>← חזרה למפה שלי</a>
        <div className="eyebrow" style={{ marginTop: 22 }}>דף רשימה · מידע עד 26.9.2026</div>
        <h1>{party.name}</h1>
        <p>{party.leaders} · {party.summary}</p>
      </div>
      <section className="panel brief-panel" aria-labelledby="brief-title">
        <div className="panel-header"><h2 id="brief-title">בקצרה</h2><SaveIndicator status={saveState === "error" ? "error" : draft !== null && draft !== note ? "saving" : saveState} retry={retry} /></div>
        <div className="panel-body">
          <p className="brief-lead">{party.tldr}</p>
          {party.electionStatus && <p className="election-status"><strong>מצב ההתמודדות: </strong>{party.electionStatus.text}{" "}<a href={party.electionStatus.url} target="_blank" rel="noopener noreferrer">מקור ↗</a></p>}
          {state && (
            <>
            {state.orientation !== "explore" && state.orientation !== party.bloc && <p className="muted small" style={{ marginTop: -6, lineHeight: 1.5 }}>הרשימה מחוץ למסלול הפתיחה שבחרת, אבל עדיין אפשר לבדוק אותה.</p>}
            <div className="brief-grid">
              <div>
                <span className="field-label">מה חשוב לי כאן</span>
                {state.priorities.length ? (
                  <>
                    {aligned.length + misaligned.length + unclear.length > 0 && <p className="muted small" style={{ lineHeight: 1.5 }}>
                      סימנת {aligned.length} תואמים, {misaligned.length} לא תואמים ו־{unclear.length} לא ברורים.
                      {misaligned.length > 0 && ` הפערים שסימנת: ${misaligned.join(" · ")}.`}
                    </p>}
                    {relevant.length ? <ul className="source-list">
                      {relevant.slice(0, 4).map((item) => <li key={item.topic}><strong>{item.topic}:</strong> {item.text}{" "}
                        <a href={item.url} target="_blank" rel="noopener noreferrer">מקור ↗</a></li>)}
                    </ul> : <p className="muted small">לא סיכמנו כאן עדיין עמדה בנושאים שבחרת. אפשר לפתוח את המצע ולבדוק.</p>}
                  </>
                ) : <p className="muted small">בחר נושאים במפה כדי לראות כאן מידע שרלוונטי לך.</p>}
              </div>
              <div>
                {unfilled.length > 0 && <><span className="field-label">מה חסר</span>
                  <p className="muted small" style={{ lineHeight: 1.55 }}>אין כאן עדיין מקור מסוכם עבור: {unfilled.slice(0, 4).join(" · ")}{unfilled.length > 4 ? " ועוד" : ""}.</p></>}
                {state.partyNotes[party.slug] && <p className="your-note"><strong>המחשבה ששמרת:</strong> {state.partyNotes[party.slug]}</p>}
              </div>
            </div>
            </>
          )}
        </div>
      </section>
      <div className="detail-grid">
        <div className="section-stack detail-primary">
          <section className="panel">
            <div className="panel-header"><h2>להקשיב לאנשים · 2–5 דקות</h2></div>
            <div className="panel-body">
              {featuredVideos.length > 1 ? (
                <Tabs defaultValue={featuredVideos[0].id}>
                  <TabsList aria-label="בחר דובר" style={{ marginBottom: 10 }}>
                    {featuredVideos.map((video) => <TabsTrigger key={video.id} value={video.id}>{video.name}</TabsTrigger>)}
                  </TabsList>
                  {featuredVideos.map((video) => <TabsContent key={video.id} value={video.id}><Video video={video} /></TabsContent>)}
                </Tabs>
              ) : featuredVideos.length ? <Video video={featuredVideos[0]} /> : <p className="muted small">עדיין לא נבחר כאן קטע קצר שאפשר לאמת. סרטונים ארוכים יותר מופיעים בהמשך הדף.</p>}
              <div className="video-follow"><span className="field-label">לעקוב אחרי המועמדים</span>
              {party.people.length ? <div className="link-list">{party.people.map((person) => (
                <a className="outlink" href={person.x} key={person.name} target="_blank" rel="noopener noreferrer">{person.name} ב־X ↗</a>
              ))}</div> : <p className="muted small">לא אומת חשבון אישי של המנהיג בדף הזה. הראיון למעלה הוא דרך להכיר את קולו.</p>}
              </div>
            </div>
          </section>
          {fairReading && <section className="panel fair-reading" aria-labelledby="fair-reading-title">
            <div className="panel-header">
              <h2 id="fair-reading-title">הטיעון בעד · הטיעון נגד</h2>
              <a className="small" href="/about#fair-reading-method">איך ניסחנו את זה?</a>
            </div>
            <div className="panel-body">
              <p className="muted small fair-reading-note">שני ניסוחים שלנו, על בסיס המקורות. לא ציטוטים או המלצת הצבעה.</p>
              <div className="fair-reading-grid">
                <div>
                  <span className="field-label">הטיעון החזק בעד</span>
                  <p>{fairReading.argument}</p>
                </div>
                <div>
                  <span className="field-label">הטיעון החזק נגד</span>
                  <p>{fairReading.counterargument}</p>
                </div>
              </div>
              <div className="fair-reading-sources">{fairReading.sources.map((source) =>
                <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>
              )}</div>
              <details className="fair-reading-more">
                <summary>עוד שאלה לחשיבה</summary>
                <p><strong>מה מתנגש כאן?</strong> {fairReading.needs}</p>
                <p><strong>מה לשאול?</strong> {fairReading.question}</p>
                <p>לשיחה: מה שמעתי, מה חשוב לי, ומה ארצה לברר?</p>
              </details>
            </div>
          </section>}
        </div>
        <aside className="section-stack detail-aside">
          <section className="panel">
            <div className="panel-header"><h2>ההתרשמות שלי</h2><SaveIndicator status={saveState === "error" ? "error" : draft !== null && draft !== note ? "saving" : saveState} retry={retry} /></div>
            {!state ? <div className="panel-body">{saveState === "error" ? <p>המפה האישית לא נטענה. אפשר לקרוא את דף הרשימה ולנסות שוב, או <a href="/account">ליצור חשבון</a>. <button type="button" className="button secondary" onClick={retry}>נסה שוב</button></p> : <div className="loading">טוען את ההתרשמות שלך…</div>}</div> : (
              <div className="panel-body">
                <span className="field-label">איפה היא עומדת אצלי כרגע?</span>
                <RadioGroup
                  value={state.partyStatus[party.slug] ?? ""}
                  onValueChange={(value) => update((previous) => ({ ...previous, partyStatus: { ...previous.partyStatus, [party.slug]: value } }), "party_status")}
                  className="choice-list"
                  aria-label="ההתרשמות שלך מהרשימה"
                >
                  {statuses.map((item) => <label className="choice-row" key={item.value} htmlFor={`status-${item.value}`}><RadioGroupItem id={`status-${item.value}`} value={item.value} aria-label={item.label} /><span>{item.label}</span></label>)}
                </RadioGroup>
                <hr className="divider" />
                <label className="field-label" htmlFor="party-note">מה הרגשתי? מה עוד לא ברור?</label>
                <textarea
                  id="party-note"
                  className="field"
                  placeholder="דברים שקלטת מהנאום, קו אדום, שאלה פתוחה…"
                  value={draft ?? note}
                  onChange={(event) => setDraft(event.target.value)}
                  onBlur={() => draft !== null && saveNote(draft)}
                  maxLength={5000}
                />
                <p className="muted small" style={{ margin: "8px 0 0" }}>ההתרשמות נשמרת אוטומטית.</p>
                <button type="button" className="button secondary share-from-detail" onClick={openShare}>שתף את ההתלבטות שלי</button>
              </div>
            )}
          </section>
        </aside>
        <div className="section-stack detail-more">
          <section className="panel" aria-labelledby="voices-title">
            <div className="panel-header"><h2 id="voices-title">מי תומך, מי מסתייג</h2></div>
            <div className="panel-body">
              <p className="muted small" style={{ marginTop: 0, lineHeight: 1.55 }}>הצהרות פומביות עם תאריך ומקור. הכיסוי חלקי.</p>
              <div className="voice-grid">
                <VoiceColumn title="הביעו תמיכה או כוונת הצבעה" items={supportingVoices} empty="עדיין לא אומתה כאן הצהרת תמיכה אישית." />
                <VoiceColumn title="הצהירו שלא יצביעו לרשימה" items={opposingVoices} empty="עדיין לא אומתה כאן הצהרה אישית נגד הצבעה לרשימה." />
              </div>
            </div>
          </section>
          <section className="panel">
            <div className="panel-header"><h2>המצע בקצרה</h2></div>
            <div className="panel-body">
              <p style={{ lineHeight: 1.6 }}>{party.manifestoSummary}</p>
              <p className="muted small" style={{ lineHeight: 1.55 }}>{party.context}</p>
              <div className="link-list">
                {party.program && <a className="outlink" href={party.program.url} target="_blank" rel="noopener noreferrer">{party.program.label} ↗</a>}
                {party.extraSources?.map((source) => <a className="outlink" key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}
              </div>
              <hr className="divider" />
              <span className="field-label">שאלות לבדיקה</span>
              <ul className="source-list">{party.check.map((question) => <li key={question}>{question}</li>)}</ul>
            </div>
          </section>
          {state && state.priorities.length > 0 && (
            <section className="panel">
              <div className="panel-header"><h2>הנושאים שחשובים לי</h2></div>
              <div className="panel-body">
                <p className="muted small">סמן מה נראה לך אחרי שבדקת. אפשר גם לבחור ״עוד לא ברור״.</p>
                {state.priorities.map((tag, index) => (
                  <div className="issue-row" key={tag}>
                    <span className="field-label">{tag}</span>
                    <RadioGroup
                      value={state.issueAssessments?.[party.slug]?.[tag] ?? ""}
                      onValueChange={(value) => update((previous) => ({
                        ...previous,
                        issueAssessments: {
                          ...previous.issueAssessments,
                          [party.slug]: { ...previous.issueAssessments?.[party.slug], [tag]: value },
                        },
                      }), "issue_assessment")}
                      className="issue-choices"
                      aria-label={`ההתרשמות שלך מ${party.name} בנושא ${tag}`}
                    >
                      {assessments.map((item) => (
                        <label className="choice-row" key={item.value} htmlFor={`issue-${index}-${item.value}`}>
                          <RadioGroupItem id={`issue-${index}-${item.value}`} value={item.value} aria-label={item.label} />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="panel" id="more-videos">
            <div className="panel-header"><h2>עוד לצפייה</h2></div>
            <div className="panel-body">
              <p className="muted small">נאומים וראיונות נוספים להעמקה. אורכם עשוי לעלות על חמש דקות:</p>
              <ul className="source-list">
                {party.videos.map((video) => (
                  <li key={video.id}><a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">{video.name}: {video.title} ↗</a></li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
      {blockedBack && <SaveNavigationWarning destination="/map" retry={retry} waitForSave={waitForSave} onClose={() => setBlockedBack(false)} />}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="share-dialog" dir="rtl">
          <DialogTitle>טיוטה לשיתוף</DialogTitle>
          <DialogDescription>אפשר לערוך הכול, במיוחד את הסיבה האישית שלך. שום דבר לא מתפרסם אוטומטית.</DialogDescription>
          <label className="field-label" htmlFor="share-draft">הטקסט שלך</label>
          <textarea
            ref={shareTextarea}
            id="share-draft"
            className="field share-textarea"
            value={shareDraft}
            onChange={(event) => { setShareDraft(event.target.value); setCopyMessage(""); }}
            rows={10}
          />
          {copyMessage && <p className="share-feedback" role="status">{copyMessage}</p>}
          <div className="share-actions">
            <button type="button" className="button" onClick={copyShare}>העתק טקסט</button>
            <DialogClose asChild><button type="button" className="button secondary">סגור</button></DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
