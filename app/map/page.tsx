"use client";

import { Fragment, useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { coalitionChoices, coreParties, netanyahuChoices, orientationChoices, parties, priorityOptions } from "@/lib/parties";
import { SaveIndicator, useDecision } from "@/lib/use-decision";

const statusLabels: Record<string, string> = {
  open: "פתוח לבדיקה",
  positive: "נראה מתאים",
  concerned: "יש לי הסתייגויות",
  out: "לא בכיוון כרגע",
};

export default function Home() {
  const { state, saveState, update, retry, waitForSave, recoveryKey, previousRecoveryKey, restoreRecoveryKey, restorePreviousKey, account } = useDecision();
  const [custom, setCustom] = useState("");
  const [generalDraft, setGeneralDraft] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [importKey, setImportKey] = useState("");
  const [keyError, setKeyError] = useState(false);
  const selected = state?.priorities ?? [];
  const pathParties = showAll || state?.orientation === "explore"
    ? parties
    : state?.orientation === "continue"
      ? parties.filter((party) => party.bloc === "continue")
      : coreParties.filter((party) => party.slug !== "beytenu" || state?.includeLieberman);
  const pathSlugs = new Set(pathParties.map((party) => party.slug));
  const visible = parties.filter((party) => pathSlugs.has(party.slug) || state?.partyStatus[party.slug] === "positive");
  const rank = (slug: string) => state?.partyStatus[slug] === "positive" ? 0 : state?.partyStatus[slug] === "out" ? 2 : 1;
  const gradeFor = (slug: string) => {
    const ratings = state?.issueAssessments?.[slug] ?? {};
    const marked = selected.filter((tag) => ratings[tag]);
    if (!marked.length) return "הציון שלי: טרם דירגתי";
    const score = Math.round(marked.reduce((sum, tag) =>
      sum + (ratings[tag] === "aligned" ? 100 : ratings[tag] === "unclear" ? 50 : 0), 0) / marked.length);
    return `הציון שלי: ${score}/100 · על סמך ${marked.length} נושאים שסימנתי`;
  };
  const sortedVisible = [...visible].sort((a, b) => rank(a.slug) - rank(b.slug));
  const hasVotes = sortedVisible.some((party) => rank(party.slug) !== 1);
  const routeLabel = state?.orientation === "change" ? "מתחילים בגוש השינוי" :
    state?.orientation === "continue" ? "מתחילים במפלגות התומכות בהמשך כהונת נתניהו" : "אפשרויות מכל המסלולים";

  useEffect(() => {
    if (generalDraft === null || !state || generalDraft === state.generalNotes) return;
    const timer = window.setTimeout(() => saveThought(generalDraft), 650);
    return () => window.clearTimeout(timer);
  }, [generalDraft, state?.generalNotes, update]);

  function saveThought(value: string) {
    if (!state || value === state.generalNotes) return;
    void update((previous) => ({ ...previous, generalNotes: value }), "general_note");
    setGeneralDraft((current) => current === value ? null : current);
  }

  function removeTag(tag: string) {
    void update((previous) => ({
      ...previous,
      customTags: previous.customTags.filter((item) => item !== tag),
      priorities: previous.priorities.filter((item) => item !== tag),
      issueAssessments: Object.fromEntries(Object.entries(previous.issueAssessments).map(([slug, ratings]) =>
        [slug, Object.fromEntries(Object.entries(ratings).filter(([topic]) => topic !== tag))])),
    }), "custom_tag");
  }

  async function openParty(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const href = event.currentTarget.href;
    if (await waitForSave()) window.location.assign(href);
  }

  function togglePriority(label: string, checked: boolean) {
    update((previous) => ({
      ...previous,
      priorities: checked
        ? [...previous.priorities.filter((item) => item !== label), label]
        : previous.priorities.filter((item) => item !== label),
    }), "priority");
  }

  function addTag(event: React.FormEvent) {
    event.preventDefault();
    const tag = custom.trim().slice(0, 80);
    if (!tag || !state || state.customTags.includes(tag) || priorityOptions.includes(tag) || state.customTags.length >= 20) return;
    update((previous) => ({
      ...previous,
      customTags: [...previous.customTags, tag],
      priorities: [...previous.priorities, tag],
    }), "custom_tag");
    setCustom("");
  }

  function togglePartyVote(slug: string, vote: "positive" | "out") {
    const nextVote = state?.partyStatus[slug] === vote ? null : vote;
    update((previous) => {
      const partyStatus = { ...previous.partyStatus };
      if (nextVote === null) delete partyStatus[slug];
      else partyStatus[slug] = nextVote;
      return { ...previous, partyStatus };
    }, "party_status");
  }

  return (
    <main className="shell">
      <div className="intro">
        <div>
          <span className="eyebrow">מפת בחירה אישית · פתוחה לכולם</span>
          <h1>{state?.orientation ? "מה חשוב לי בבחירות האלה?" : "מאיפה מתחילים?"}</h1>
          <p>{state?.orientation ? "בחר נושאים, הקשב לאנשים, ובדוק מה מתאים לך. אפשר לשנות כיוון בכל רגע." : "שאלה אחת מסדרת את נקודת הפתיחה. היא לא קובעת מה תצביעו."}</p>
        </div>
        <span className="date-stamp">מידע על הרשימות: 25.9.2026</span>
      </div>
      {!state ? (
        <section className="panel loading"><SaveIndicator status={saveState} retry={retry} /> <p style={{ margin: "16px 0 0" }}>טוען את המפה האישית שלך…</p></section>
      ) : !state.orientation ? (
        <section className="panel orientation-panel" aria-labelledby="orientation-title">
          <div className="panel-header"><h2 id="orientation-title">מה היחס שלך להמשך כהונת נתניהו?</h2><SaveIndicator status={saveState} retry={retry} /></div>
          <div className="orientation-options">
            {orientationChoices.map((choice) => (
              <button key={choice.value} type="button" className="orientation-card"
                onClick={() => update((previous) => ({ ...previous, orientation: choice.value }), "orientation")}>
                <strong>{choice.title}</strong><span>{choice.subtitle}</span><b aria-hidden="true">←</b>
              </button>
            ))}
          </div>
          <p className="muted small" style={{ padding: "0 24px 22px", margin: 0 }}>אפשר להמשיך בלי חשבון. הבחירות נשמרות במכשיר; <a href="/signin-with-chatgpt?return_to=%2Fmap" target="_top">כניסה עם ChatGPT</a> תאפשר להמשיך גם במכשיר אחר.</p>
        </section>
      ) : <>
      <div className="path-bar">
        <span><strong>{routeLabel}</strong><small>המסלול הוא מסנן ראשוני, לא שיוך סופי לכל מפלגה.</small></span>
        <button type="button" className="button secondary" onClick={() => { setShowAll(false); update((previous) => ({ ...previous, orientation: "" }), "orientation"); }}>שנה נקודת פתיחה</button>
      </div>
      <div className="account-message">
        {account ? `מחובר לחשבון ${account.email}. המפה נשמרת גם למכשיר הבא.` : <>מומלץ <a href="/signin-with-chatgpt?return_to=%2Fmap" target="_top">להיכנס לחשבון</a> כדי להמשיך ממכשיר אחר. אפשר להמשיך בלי כניסה.</>}
      </div>
      <div className="workspace-grid">
        <div className="section-stack">
          <section className="panel" id="results" aria-labelledby="parties-title">
            <div className="panel-header">
              <h2 id="parties-title">התמונה שלי · רשימות לבדיקה</h2>
              <span className="result-header-meta"><span className="muted small">{visible.length} רשימות</span><SaveIndicator status={saveState === "error" ? "error" : generalDraft !== null && generalDraft !== state.generalNotes ? "saving" : saveState} retry={retry} /></span>
            </div>
            <div className="result-intro">
              <span>{selected.length ? `נושאים שחשובים לי: ${selected.join(" · ")}` : "אפשר להתחיל להכיר את הרשימות, או למלא את המצפן כדי להתמקד בנושאים שלך."}</span>
              <a href="#my-compass" className="button secondary">מלא את המצפן ↓</a>
              {state.generalNotes && <p className="muted small"><strong>המחשבה שלי:</strong> {state.generalNotes}</p>}
              <small>הציון מחושב רק מהדירוגים שלך בדפי הרשימות: תואם 100, לא ברור 50, לא תואם 0. אין ציון לפני דירוג.</small>
            </div>
            <div className="party-list">
              {sortedVisible.map((party, index) => (
                <Fragment key={party.slug}>
                {hasVotes && (index === 0 || rank(party.slug) !== rank(sortedVisible[index - 1].slug)) && (
                  <div className="party-group-title">
                    {rank(party.slug) === 0 ? "מתאימות לי" : rank(party.slug) === 2 ? "לא בכיוון כרגע" : "עוד לבדיקה"}
                  </div>
                )}
                {!hasVotes && (showAll || state.orientation === "explore") && (index === 0 || party.bloc !== sortedVisible[index - 1].bloc) && (
                  <div className="party-group-title">
                    {party.bloc === "change" ? "גוש השינוי" : party.bloc === "continue" ? "רשימות סביב המשך הנהגת נתניהו" : "אפשרויות נוספות ועמדות מותנות"}
                  </div>
                )}
                <div className="party-card" data-reaction={rank(party.slug) === 0 ? "like" : rank(party.slug) === 2 ? "dislike" : undefined} style={{ "--party-accent": party.color } as React.CSSProperties}>
                  <span className="party-band" aria-hidden="true" />
                  <a className="party-card-link" href={`/party/${party.slug}`} onClick={openParty}>
                    <div className="party-card-main">
                      <h3>{party.name}</h3>
                      <p>{party.leaders} · {party.summary}</p>
                      <div className="personal-result">
                        <strong>{gradeFor(party.slug)}</strong>
                        <span>{party.highlights.find((item) => selected.includes(item.topic))
                          ? party.highlights.find((item) => selected.includes(item.topic))!.text
                          : selected.length ? "אין כאן עדיין מקור מסוכם לנושאים שבחרת; בדוק את דף הרשימה." : party.tldr}</span>
                      </div>
                      {(state.partyStatus[party.slug] || state.priorities.length > 0 || (hasVotes && (showAll || state.orientation === "explore"))) && <div className="meta">
                        {[
                          state.partyStatus[party.slug] ? statusLabels[state.partyStatus[party.slug]] : null,
                          state.priorities.length > 0 ? `${Object.keys(state.issueAssessments?.[party.slug] ?? {}).filter((tag) => state.priorities.includes(tag)).length}/${state.priorities.length} נושאים נבדקו` : null,
                          hasVotes && (showAll || state.orientation === "explore") ? party.bloc === "change" ? "גוש השינוי" : party.bloc === "continue" ? "המשך הנהגת נתניהו" : "אפשרויות נוספות" : null,
                        ].filter(Boolean).join(" · ")}
                      </div>}
                    </div>
                    <span className="arrow" aria-hidden="true">←</span>
                  </a>
                  <div className="party-votes" role="group" aria-label={`סימון ${party.name}`}>
                    <button type="button" className="vote-button" aria-label={`${party.name}: מתאים לי`} aria-pressed={state.partyStatus[party.slug] === "positive"} onClick={() => togglePartyVote(party.slug, "positive")}>
                      <ThumbsUp size={17} aria-hidden="true" /><span>מתאים לי</span>
                    </button>
                    <button type="button" className="vote-button" aria-label={`${party.name}: לא מתאים לי`} aria-pressed={state.partyStatus[party.slug] === "out"} onClick={() => togglePartyVote(party.slug, "out")}>
                      <ThumbsDown size={17} aria-hidden="true" /><span>לא מתאים</span>
                    </button>
                  </div>
                </div>
                </Fragment>
              ))}
            </div>
          </section>
          {state.orientation === "change" && !showAll && <div className="notice">
            <strong>בנט ולפיד מתמודדים יחד.</strong> ארבע רשימות מזוהות עם גוש השינוי. אפשר להחליט אם לכלול את ישראל ביתנו בהשוואה.{" "}
            <a href="https://www.zman.co.il/727390/" target="_blank" rel="noopener noreferrer">מקור להרכב הרשימות ↗</a>
              <label className="choice-row" style={{ marginTop: 12 }}>
                <Checkbox checked={state.includeLieberman} onCheckedChange={(value) => update((previous) => ({ ...previous, includeLieberman: value === true }), "shortlist")} />
                <span>להציג גם את ישראל ביתנו</span>
              </label>
          </div>}
          {state.orientation !== "explore" && (
            <button type="button" className="button secondary" onClick={() => setShowAll((value) => !value)}>
              {showAll ? "חזור למסלול שבחרתי" : "ראה גם רשימות מחוץ למסלול"}
            </button>
          )}
          <div className="notice" style={{ background: "#fff", borderStyle: "dashed" }}>
            מוצגות כאן רשימות מרכזיות מתוך הרשימות שהוגשו, לא כל הרשימות שהוגשו. האישור הסופי והעמדות עשויים להשתנות עד הבחירות.{" "}
            <a href="https://www.knesset.tv/main-articles/61384/94592/" target="_blank" rel="noopener noreferrer">לכל הרשימות שהוגשו ↗</a>
          </div>
        </div>

        <section className="panel" id="my-compass" aria-labelledby="priorities-title">
          <div className="panel-header">
            <h2 id="priorities-title">המצפן שלי</h2>
            <SaveIndicator status={saveState === "error" ? "error" : generalDraft !== null && generalDraft !== state.generalNotes ? "saving" : saveState} retry={retry} />
          </div>
            <div className="panel-body">
              <p className="muted small">מה הנושאים שתרצה להחזיק מול העיניים? הבחירות שלך נשמרות, כולל השינויים לאורך הדרך.</p>
              <div className="tags" aria-label="נושאים חשובים">
                {priorityOptions.map((label) => (
                  <label key={label} className="tag" data-active={selected.includes(label)}>
                    <Checkbox
                      checked={selected.includes(label)}
                      onCheckedChange={(value) => togglePriority(label, value === true)}
                      aria-label={label}
                      className="ml-1 border-current data-[state=checked]:bg-white data-[state=checked]:text-[#2444d8]"
                    />
                    {label}
                  </label>
                ))}
                {state.customTags.map((label) => (
                  <span key={label} className="custom-tag">
                    <label className="tag" data-active={selected.includes(label)}>
                      <Checkbox checked={selected.includes(label)} onCheckedChange={(value) => togglePriority(label, value === true)} aria-label={label} className="ml-1 border-current data-[state=checked]:bg-white data-[state=checked]:text-[#2444d8]" />
                      {label}
                    </label>
                    <button type="button" className="remove-tag" aria-label={`הסר נושא ${label}`} onClick={() => removeTag(label)}>×</button>
                  </span>
                ))}
              </div>
              <form className="input-row" style={{ marginTop: 14 }} onSubmit={addTag}>
                <input className="field" value={custom} onChange={(event) => setCustom(event.target.value)} maxLength={80} placeholder="נושא נוסף שחשוב לי" aria-label="נושא נוסף" />
                <button className="button secondary" type="submit">הוסף</button>
              </form>
              <hr className="divider" />
              <span className="field-label">שיתוף פעולה עם מפלגות ערביות</span>
              <RadioGroup
                value={state.arabCoalition}
                onValueChange={(value) => update((previous) => ({ ...previous, arabCoalition: value }), "arab_coalition")}
                className="choice-list"
                aria-label="עמדה על שיתוף פעולה עם מפלגות ערביות"
              >
                {coalitionChoices.map((choice) => (
                  <label className="choice-row" key={choice.value} htmlFor={`coalition-${choice.value}`}>
                    <RadioGroupItem id={`coalition-${choice.value}`} value={choice.value} aria-label={choice.label} />
                    <span>{choice.label}</span>
                  </label>
                ))}
              </RadioGroup>
              <hr className="divider" />
              <span className="field-label">ישיבה בממשלת נתניהו</span>
              <RadioGroup
                value={state.netanyahuCoalition}
                onValueChange={(value) => update((previous) => ({ ...previous, netanyahuCoalition: value }), "netanyahu_coalition")}
                className="choice-list"
                aria-label="עמדה על ישיבה בממשלת נתניהו"
              >
                {netanyahuChoices.map((choice) => (
                  <label className="choice-row" key={choice.value} htmlFor={`netanyahu-${choice.value}`}>
                    <RadioGroupItem id={`netanyahu-${choice.value}`} value={choice.value} aria-label={choice.label} />
                    <span>{choice.label}</span>
                  </label>
                ))}
              </RadioGroup>
              <hr className="divider" />
              <label className="field-label" htmlFor="general-note">מה עוד מטריד או מסקרן אותי?</label>
              <textarea
                id="general-note"
                className="field"
                value={generalDraft ?? state.generalNotes}
                onChange={(event) => setGeneralDraft(event.target.value)}
                onBlur={() => generalDraft !== null && saveThought(generalDraft)}
                placeholder="שאלה, קו אדום, או מחשבה שתרצה לזכור…"
                maxLength={10000}
              />
              <p className="muted small" style={{ margin: "8px 0 0" }}>המחשבה נשמרת אוטומטית.</p>
              <a className="button result-action" href="#results">הצג את התוצאות שלי ↑</a>
              <hr className="divider" />
              {!account && <details className="recovery-details">
                <summary>גיבוי והעברה למכשיר אחר</summary>
                <p className="muted small">המפתח הזה נותן גישה להחלטות שלך בלי חשבון. שמור אותו במקום פרטי. אפשר גם להיכנס לחשבון כדי להמשיך ממכשיר אחר.</p>
                <div className="input-row">
                  <input className="field" type="password" readOnly value={recoveryKey ?? ""} aria-label="מפתח השחזור שלך" onFocus={(event) => event.currentTarget.type = "text"} onBlur={(event) => event.currentTarget.type = "password"} />
                  <button className="button secondary" type="button" onClick={() => recoveryKey && navigator.clipboard.writeText(recoveryKey)}>העתק</button>
                </div>
                <p className="muted small" style={{ margin: "16px 0 8px" }}>כבר יש לך מפתח ממכשיר אחר?</p>
                <form className="input-row" onSubmit={(event) => { event.preventDefault(); setKeyError(!restoreRecoveryKey(importKey)); }}>
                  <input className="field" value={importKey} onChange={(event) => setImportKey(event.target.value)} placeholder="הדבק מפתח שחזור" aria-label="מפתח שחזור ממכשיר אחר" />
                  <button className="button secondary" type="submit">שחזר</button>
                </form>
                {keyError && <p role="alert" style={{ color: "#b42335", marginTop: 8 }}>המפתח צריך להכיל 64 תווים. בדוק שהועתק במלואו.</p>}
                {previousRecoveryKey && <button className="button secondary" style={{ marginTop: 12 }} type="button" onClick={restorePreviousKey}>חזור למפה הקודמת במכשיר הזה</button>}
              </details>}
            </div>
        </section>

      </div>
      </>}
    </main>
  );
}
