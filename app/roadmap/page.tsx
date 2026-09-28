export const metadata = { title: "מה מתוכנן לאתר | חדר בחירה" };

export default function Roadmap() {
  return (
    <main className="shell roadmap">
      <div className="intro">
        <div>
          <span className="eyebrow">על האתר</span>
          <h1>מה יש עכשיו, ומה עוד מתוכנן</h1>
          <p>רשימת עבודה קצרה. דברים שמופיעים כאן כ״בהמשך״ עדיין אינם חלק מהאתר.</p>
        </div>
      </div>
      <div className="panel" style={{ padding: "5px 26px 24px" }}>
        <div className="roadmap-item">
          <strong>כבר באתר</strong>
          <div><h2>להכיר ולהשוות</h2><p>השוואת רשימות לפי הנושאים שבחרת, דפי רשימות עם מקורות וסרטונים קצרים, ושמירת ההתרשמות שלך.</p></div>
        </div>
        <div className="roadmap-item">
          <strong>בהמשך</strong>
          <div><h2>כיסוי טוב יותר</h2><p>עוד מקורות בנושאים שחסרים, וסרטונים ופוסטים מאומתים של יותר מועמדים.</p></div>
        </div>
        <div className="roadmap-item">
          <strong>בהמשך</strong>
          <div><h2>כניסה נוספת והיסטוריית החלטות</h2><p>דרך פשוטה להיכנס בלי ChatGPT, ותצוגה של השינויים ששמרת לאורך זמן.</p></div>
        </div>
      </div>
    </main>
  );
}
