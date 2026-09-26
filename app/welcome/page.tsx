import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ברוכים הבאים | חדר בחירה",
  description: "מה מיוחד בחדר בחירה, איך משתמשים בו, ואילו כלי בחירות נוספים כדאי להכיר.",
};

const alternatives = [
  {
    name: "מצפן הבחירות של mako",
    description: "שאלון עמדות עם מסלול קצר או מלא, ובסופו מפלגות הקרובות לתשובות שלך.",
    url: "https://electionsvote.mako.co.il/",
  },
  {
    name: "מצפן הבחירות של ישראל היום",
    description: "שאלון קצר של 14 שאלות לבדיקת קרבה למפלגות.",
    url: "https://electionsquiz.israelhayom.co.il/",
  },
  {
    name: "שאלון הבחירות של וואלה",
    description: "עשר שאלות על סוגיות ציבוריות ותוצאות התאמה למפלגות.",
    url: "https://dcx.walla.co.il/walla_news_files/elections2026/political_match_quiz.html",
  },
  {
    name: "בחירומט 2026",
    description: "30 טענות, עם הסברים ומקורות לעמדות שמאחורי התוצאות.",
    url: "https://www.bchiromat.com/",
  },
];

export default function Welcome() {
  return (
    <main className="shell welcome-page">
      <section className="welcome-hero" aria-labelledby="welcome-title">
        <div>
          <span className="welcome-kicker">למה עוד אתר בחירות?</span>
          <h1 id="welcome-title">כי בחירה לא נגמרת בשאלון.</h1>
          <p>כאן מכירים את האנשים ואת העמדות, שומרים שאלות והתרשמויות, וחוזרים אליהן כשמשהו משתנה.</p>
          <Link className="button welcome-cta" href="/map">למפת הבחירה שלי <span aria-hidden="true">←</span></Link>
          <span className="welcome-guest-note">אפשר להתחיל בלי חשבון.</span>
        </div>
      </section>
      <div className="welcome-principle" aria-label="איך מתקבלת התמונה האישית">
        <span className="welcome-principle-label">העיקרון</span>
        <strong>את ההתרשמות מסמנים אתם.</strong>
        <p>ציון אישי מופיע רק אחרי דירוג נושאים בדפי הרשימות, ומחושב מהסימונים שלכם. ההחלטה נשארת שלכם.</p>
      </div>

      <section className="welcome-section" aria-labelledby="welcome-how-title">
        <div className="welcome-section-heading">
          <span className="eyebrow">מה יש כאן</span>
          <h2 id="welcome-how-title">כל שלבי הבירור במקום אחד</h2>
        </div>
        <div className="welcome-feature-grid">
          <article className="welcome-feature"><span>01</span><h3>להתחיל מאיפה שנוח לך</h3><p>בוחרים נקודת פתיחה, רואים רשימות, ויכולים לעבור למסלול אחר או להציג את כולן בכל רגע.</p></article>
          <article className="welcome-feature"><span>02</span><h3>להכיר לפני שמדרגים</h3><p>בכל דף רשימה יש תקציר, מקורות, סרטון של מנהיג או מנהיגים וקישורים אישיים לעקוב אחריהם כשנמצא חשבון מתאים.</p></article>
          <article className="welcome-feature"><span>03</span><h3>לשמור גם את סימני השאלה</h3><p>מסמנים נושאים חשובים, התרשמות, הסתייגויות ומחשבות. אפשר לחזור ולעדכן; השינויים נשמרים לאורך זמן.</p></article>
        </div>
      </section>

      <section className="welcome-section welcome-alternatives" aria-labelledby="alternatives-title">
        <div className="welcome-section-heading">
          <span className="eyebrow">עוד דרכים לבדוק</span>
          <h2 id="alternatives-title">כלים נוספים לבחירות</h2>
          <p>אפשר להיעזר גם בשאלונים ובמקורות אחרים, ולחזור לכאן עם שאלות חדשות. הקישורים מובילים לאתרים חיצוניים.</p>
        </div>
        <div className="welcome-alternative-grid">
          {alternatives.map((item) => (
            <a className="welcome-alternative" href={item.url} target="_blank" rel="noopener noreferrer" key={item.url}>
              <strong>{item.name} <span aria-hidden="true">↗</span></strong>
              <span>{item.description}</span>
            </a>
          ))}
        </div>
        <p className="welcome-link-note">הקישורים והיקף הכיסוי של הכלים נבדקו בספטמבר 2026; תוכן הבחירות עשוי להשתנות.</p>
      </section>

      <section className="welcome-open-source" aria-labelledby="open-source-title">
        <div>
          <span className="eyebrow">הקוד פתוח</span>
          <h2 id="open-source-title">אפשר לבדוק איך זה עובד.</h2>
          <p>הקוד והתוכן הציבורי של חדר בחירה זמינים ב־GitHub. אפשר לקרוא, להציע תיקון או לפתוח דיון.</p>
        </div>
        <a className="button secondary" href="https://github.com/ripper234/vote-room" target="_blank" rel="noopener noreferrer">למאגר ב־GitHub ↗</a>
      </section>
    </main>
  );
}
