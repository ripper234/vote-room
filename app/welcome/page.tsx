import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ברוכים הבאים | חדר בחירה",
  description: "להכיר את המפלגות והאנשים, לראות סרטונים קצרים ולשמור את ההתלבטות שלך.",
};

const alternatives = [
  {
    name: "מצפן הבחירות של mako",
    description: "שאלון עמדות, קצר או מלא.",
    url: "https://electionsvote.mako.co.il/",
  },
  {
    name: "מצפן הבחירות של ישראל היום",
    description: "14 שאלות על עמדותיך.",
    url: "https://electionsquiz.israelhayom.co.il/",
  },
  {
    name: "שאלון הבחירות של וואלה",
    description: "10 שאלות והתאמה למפלגות.",
    url: "https://dcx.walla.co.il/walla_news_files/elections2026/political_match_quiz.html",
  },
  {
    name: "בחירומט 2026",
    description: "30 טענות, הסברים ומקורות.",
    url: "https://www.bchiromat.com/",
  },
];

export default function Welcome() {
  return (
    <main className="shell welcome-page">
      <section className="welcome-hero" aria-labelledby="welcome-title">
        <div>
          <h1 id="welcome-title">למה עוד אתר בחירות?</h1>
          <p>תקציר לפי מה שחשוב לך, סרטונים קצרים של המובילים וקישורים לעמודים האישיים שלהם. אפשר לשמור את ההתלבטות ולחזור אליה.</p>
          <div className="welcome-actions">
            <a className="button welcome-cta" href="/account" target="_top">יצירת חשבון <span aria-hidden="true">←</span></a>
            <a className="button secondary welcome-guest-cta" href="/map" target="_top">כניסה כאורח</a>
          </div>
        </div>
      </section>
      <section className="welcome-section welcome-alternatives" aria-labelledby="alternatives-title">
        <div className="welcome-section-heading">
          <h2 id="alternatives-title">עוד כלים לבחירות</h2>
        </div>
        <div className="welcome-alternative-grid">
          {alternatives.map((item) => (
            <a className="welcome-alternative" href={item.url} target="_blank" rel="noopener noreferrer" key={item.url}>
              <strong>{item.name} <span aria-hidden="true">↗</span></strong>
              <span>{item.description}</span>
            </a>
          ))}
        </div>
        <p className="welcome-link-note">קישורים חיצוניים · נבדקו בספטמבר 2026.</p>
      </section>
      <p className="welcome-source-note">הקוד פתוח. <a href="https://github.com/ripper234/vote-room" target="_blank" rel="noopener noreferrer">מצאת טעות? אפשר להציע תיקון ב־GitHub ↗</a></p>
    </main>
  );
}
