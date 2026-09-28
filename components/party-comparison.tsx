"use client";

import type { MouseEventHandler } from "react";
import type { Party } from "@/lib/parties";

type Props = {
  parties: Party[];
  selectedTopics: string[];
  assessments: Record<string, Record<string, string>>;
  partyStatus: Record<string, string>;
  chosenSlugs: string[];
  onChooseSlugs: (next: string[]) => void;
  onOpenParty?: MouseEventHandler<HTMLAnchorElement>;
};

const ratingLabels: Record<string, string> = {
  aligned: "נראה לי תואם",
  unclear: "עוד לא ברור לי",
  misaligned: "נראה לי לא תואם",
};

function selfRating(party: Party, topics: string[], assessments: Props["assessments"]) {
  const ratings = assessments[party.slug] ?? {};
  const marked = topics.filter((topic) => ratingLabels[ratings[topic]]);
  if (marked.length < 2) return null;
  return {
    count: marked.length,
    score: Math.round(marked.reduce((sum, topic) =>
      sum + (ratings[topic] === "aligned" ? 100 : ratings[topic] === "unclear" ? 50 : 0), 0) / marked.length),
  };
}

export function PartyComparison({ parties, selectedTopics, assessments, partyStatus, chosenSlugs, onChooseSlugs, onOpenParty }: Props) {
  const topics = selectedTopics.length ? selectedTopics : ["משילות ושירות ציבורי", "כלכלה ויוקר המחיה", "דמוקרטיה וחוקה"];
  const eligible = parties.filter((party) => partyStatus[party.slug] !== "out");
  const ranked = eligible.map((party, index) => ({
    party,
    index,
    rating: selfRating(party, selectedTopics, assessments),
    coverage: selectedTopics.filter((topic) => party.highlights.some((item) => item.topic === topic)).length,
  })).sort((a, b) =>
    Number(partyStatus[b.party.slug] === "positive") - Number(partyStatus[a.party.slug] === "positive") ||
    Number(Boolean(b.rating)) - Number(Boolean(a.rating)) ||
    (b.rating?.score ?? 0) - (a.rating?.score ?? 0) ||
    b.coverage - a.coverage || a.index - b.index);

  const count = Math.min(3, ranked.length);
  const chosen: Party[] = [];
  for (let index = 0; index < count; index++) {
    const manual = eligible.find((party) => party.slug === chosenSlugs[index] && !chosen.includes(party));
    const next = manual ?? ranked.find(({ party }) => !chosen.includes(party))?.party;
    if (next) chosen.push(next);
  }

  function choose(index: number, slug: string) {
    const next = chosen.map((party) => party.slug);
    next[index] = slug;
    onChooseSlugs(next);
  }

  return <section className="panel party-comparison" id="comparison" aria-labelledby="comparison-title">
    <div className="panel-header"><h2 id="comparison-title" tabIndex={-1}>השוואה לפי נושאים</h2></div>
    <div className="comparison-intro">
      <p>עד שלוש רשימות, זו לצד זו. אפשר להחליף כל אחת. רשימות שסימנת ״לא מתאים״ לא מוצגות כאן.</p>
      <p className="muted small">נקודת הפתיחה נשענת על הסימונים שלך ועל כיסוי המקורות, לא על המלצת הצבעה.</p>
      {!selectedTopics.length && <p className="muted small">אלה שלושה נושאים לדוגמה. <a href="#my-compass">בחר/י את הנושאים שלך</a> כדי להתאים את ההשוואה.</p>}
      <p className="comparison-swipe-hint">במסך קטן: החליקו הצידה לעוד רשימות ←</p>
      {chosenSlugs.length > 0 && <button type="button" className="comparison-reset" onClick={() => onChooseSlugs([])}>חזרה לבחירה אוטומטית</button>}
    </div>
    {chosen.length ? <div className="comparison-scroll" role="region" aria-label="השוואת רשימות; אפשר לגלול לצדדים" tabIndex={0}>
      <table className="comparison-table" style={{ "--comparison-width": `${270 * chosen.length}px` } as React.CSSProperties}>
        <thead><tr><th scope="col">תחום</th>{chosen.map((party, index) => <th scope="col" key={party.slug} style={{ "--party-accent": party.color } as React.CSSProperties}>
          <label className="comparison-selector-label" htmlFor={`comparison-slot-${index}`}>רשימה {index + 1}</label>
          <select id={`comparison-slot-${index}`} aria-label={`רשימה ${index + 1} להשוואה`} value={party.slug} onChange={(event) => choose(index, event.target.value)}>
            {eligible.filter((candidate) => candidate.slug === party.slug || !chosen.some((item) => item.slug === candidate.slug)).map((candidate) =>
              <option key={candidate.slug} value={candidate.slug}>{candidate.name}</option>)}
          </select>
          <small>{party.leaders}</small>
          <a href={`/party/${party.slug}`} onClick={onOpenParty}>לדף הרשימה ←</a>
        </th>)}</tr></thead>
        <tbody>
          <tr><th scope="row">בקצרה</th>{chosen.map((party) => <td key={party.slug}><strong className="comparison-cell-name">{party.name}</strong>{party.tldr}{party.program && <a href={party.program.url} target="_blank" rel="noopener noreferrer">{party.program.label} ↗</a>}</td>)}</tr>
          <tr><th scope="row">ההתרשמות שלי</th>{chosen.map((party) => {
            const rating = selfRating(party, selectedTopics, assessments);
            return <td key={party.slug}><strong className="comparison-cell-name">{party.name}</strong>{rating ? `דירוג עצמי ${rating.score}/100 · ${rating.count} מתוך ${selectedTopics.length} נושאים` : "עוד לא דירגתי שני נושאים ברשימה הזו."}</td>;
          })}</tr>
          {topics.map((topic) => <tr key={topic}><th scope="row">{topic}</th>{chosen.map((party) => {
            const highlight = party.highlights.find((item) => item.topic === topic);
            const marked = ratingLabels[assessments[party.slug]?.[topic]];
            return <td key={party.slug}>
              <strong className="comparison-cell-name">{party.name}</strong>
              {highlight ? <>{highlight.text}<a href={highlight.url} target="_blank" rel="noopener noreferrer">למקור ↗</a></> : <span className="comparison-missing">אין לנו עדיין סיכום מבוסס מקור בנושא הזה.</span>}
              {marked && <span className="comparison-rating">הסימון שלי: {marked}</span>}
            </td>;
          })}</tr>)}
        </tbody>
      </table>
    </div> : <p className="comparison-empty">אין במסלול הזה רשימות זמינות להשוואה. אפשר להחזיר רשימה שסומנה ״לא מתאים״ או לראות רשימות נוספות.</p>}
    <p className="comparison-footnote">היעדר סיכום הוא פער בכיסוי שלנו, ולא הוכחה שלרשימה אין עמדה. המקורות עשויים להיות מצעים, הצהרות מתוארכות או דיווחים; בדקו את הניסוח המלא במקור.</p>
  </section>;
}
