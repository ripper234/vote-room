"use client";

import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Party } from "@/lib/parties";
import { SaveIndicator, useDecision } from "@/lib/use-decision";

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

function Video({ video }: { video: Party["videos"][number] }) {
  return (
    <div>
      <div className="video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?start=0&end=360&rel=0`}
          title={`${video.name}: ${video.title}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <p className="muted small" style={{ margin: "11px 0 0", lineHeight: 1.5 }}>
        שש הדקות הראשונות מתוך {video.title}, {video.date}.{" "}
        <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">לנאום או לראיון המלא ↗</a>
      </p>
    </div>
  );
}

export default function PartyDetail({ party }: { party: Party }) {
  const { state, saveState, update, retry, waitForSave } = useDecision();
  const [draft, setDraft] = useState<string | null>(null);
  useEffect(() => { setDraft(null); }, [party.slug]);
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
  }
  const relevant = party.highlights.filter((item) => state?.priorities.includes(item.topic));
  const unfilled = state?.priorities.filter((tag) => !party.highlights.some((item) => item.topic === tag)) ?? [];
  const ratings = state?.issueAssessments?.[party.slug] ?? {};
  const aligned = state?.priorities.filter((tag) => ratings[tag] === "aligned") ?? [];
  const misaligned = state?.priorities.filter((tag) => ratings[tag] === "misaligned") ?? [];
  const unclear = state?.priorities.filter((tag) => ratings[tag] === "unclear") ?? [];
  return (
    <main className="shell">
      <div className="detail-hero" style={{ "--party-accent": party.color } as React.CSSProperties}>
        <a href="/map" onClick={goBack} style={{ color: "#c7d8ff", textUnderlineOffset: 4 }}>← חזרה למפה שלי</a>
        <div className="eyebrow" style={{ marginTop: 22 }}>דף רשימה · מידע עד 25.9.2026</div>
        <h1>{party.name}</h1>
        <p>{party.leaders} · {party.summary}</p>
      </div>
      <section className="panel brief-panel" aria-labelledby="brief-title">
        <div className="panel-header"><h2 id="brief-title">בקצרה</h2><SaveIndicator status={saveState === "error" ? "error" : draft !== null && draft !== note ? "saving" : saveState} retry={retry} /></div>
        <div className="panel-body">
          <p className="brief-lead">{party.tldr}</p>
          {state && (
            <>
            <p className="muted small" style={{ marginTop: -6, lineHeight: 1.5 }}>
              {state.orientation === "explore"
                ? "בחרת להתחיל בלי מסנן גושי; הדף הזה עומד להשוואה עם כל הרשימות באתר."
                : state.orientation === party.bloc
                  ? "הרשימה נמצאת במסלול שבחרת להתחיל בו. זה עדיין לא אומר שהיא מתאימה לך בשאר הנושאים."
                  : "הרשימה נמצאת מחוץ למסלול הפתיחה שבחרת. טוב לבדוק אותה בכל זאת אם אחד הנושאים שלה מסקרן אותך."}
            </p>
            <div className="brief-grid">
              <div>
                <span className="field-label">לפי המצפן שלך</span>
                {state.priorities.length ? (
                  <>
                    <p className="muted small" style={{ lineHeight: 1.5 }}>
                      סימנת {aligned.length} נושאים כנראים תואמים, {misaligned.length} כנראים לא תואמים ו־{unclear.length} כלא ברורים.
                      {misaligned.length > 0 && ` הפערים שסימנת: ${misaligned.join(" · ")}.`}
                    </p>
                    {relevant.length ? <ul className="source-list">
                      {relevant.slice(0, 4).map((item) => <li key={item.topic}><strong>{item.topic}:</strong> {item.text}{" "}
                        <a href={item.url} target="_blank" rel="noopener noreferrer">מקור ↗</a></li>)}
                    </ul> : <p className="muted small">עדיין אין בדף הזה סיכום מקור לנושאים שבחרת. כדאי לפתוח את המצע ולסמן את התרשמותך.</p>}
                  </>
                ) : <p className="muted small">בחר נושאים במפה שלך כדי לקבל כאן מקורות רלוונטיים לך. אפשר גם להמשיך ישר לווידאו.</p>}
              </div>
              <div>
                <span className="field-label">מה עדיין דורש בדיקה</span>
                <p className="muted small" style={{ lineHeight: 1.55 }}>
                  {unfilled.length
                    ? `טרם סיכמנו כאן מקור מבוסס עבור: ${unfilled.slice(0, 4).join(" · ")}${unfilled.length > 4 ? " ועוד" : ""}. זה לא אומר שאין למפלגה עמדה.`
                    : "בדוק מה מהדברים יוכל להתממש בהסכם קואליציוני, ומה חשוב לך מעבר למצע."}
                </p>
                {state.partyNotes[party.slug] && <p className="your-note"><strong>המחשבה ששמרת:</strong> {state.partyNotes[party.slug]}</p>}
              </div>
            </div>
            </>
          )}
        </div>
      </section>
      <div className="detail-grid">
        <div className="section-stack">
          <section className="panel">
            <div className="panel-header"><h2>להקשיב לאנשים</h2></div>
            <div className="panel-body">
              {party.videos.length > 1 ? (
                <Tabs defaultValue={party.videos[0].id}>
                  <TabsList aria-label="בחר דובר" style={{ marginBottom: 10 }}>
                    {party.videos.map((video) => <TabsTrigger key={video.id} value={video.id}>{video.name}</TabsTrigger>)}
                  </TabsList>
                  {party.videos.map((video) => <TabsContent key={video.id} value={video.id}><Video video={video} /></TabsContent>)}
                </Tabs>
              ) : <Video video={party.videos[0]} />}
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
                <p className="muted small">סמן את ההתרשמות שלך אחרי שעיינת במקורות. ״עוד לא ברור״ הוא תשובה טובה.</p>
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
          <section className="panel">
            <div className="panel-header"><h2>לעקוב אחרי האנשים</h2></div>
            <div className="panel-body">
              {party.people.length ? <div className="link-list">{party.people.map((person) => (
                <a className="outlink" href={person.x} key={person.name} target="_blank" rel="noopener noreferrer">{person.name} ב־X ↗</a>
              ))}</div> : <p className="muted small">לא אומת חשבון אישי של המנהיג בדף הזה. הראיון למעלה הוא דרך להכיר את קולו.</p>}
            </div>
          </section>
        </div>
        <aside className="section-stack">
          <section className="panel">
            <div className="panel-header"><h2>ההתרשמות שלי</h2><SaveIndicator status={saveState === "error" ? "error" : draft !== null && draft !== note ? "saving" : saveState} retry={retry} /></div>
            {!state ? <div className="loading">טוען את הרשימות שלך…</div> : (
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
              </div>
            )}
          </section>
          <div className="notice">
            זו נקודת פתיחה לבירור, לא קביעה שהרשימה מתאימה לך. קישורים למצע ולדברי המנהיגים הם חומר גלם; גם עמדות על שותפים קואליציוניים עשויות להשתנות.
          </div>
        </aside>
      </div>
    </main>
  );
}
