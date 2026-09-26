export const metadata = { title: "לאן ממשיכים | חדר בחירה" };

export default function Roadmap() {
  return (
    <main className="shell roadmap">
      <div className="intro">
        <div>
          <span className="eyebrow">מפת דרך</span>
          <h1>לאן האתר הולך</h1>
        </div>
      </div>
      <div className="panel" style={{ padding: "5px 26px 24px" }}>
        <div className="roadmap-item">
          <strong>עכשיו</strong>
          <div><h2>מפה אישית</h2><p>רשימות, סרטונים קצרים, מקורות ושמירת ההעדפות שלך.</p></div>
        </div>
        <div className="roadmap-item">
          <strong>בהמשך</strong>
          <div><h2>יותר קל להשוות</h2><p>עמדות לפי נושא, זו לצד זו. גם היסטוריה של ההתלבטות.</p></div>
        </div>
        <div className="roadmap-item">
          <strong>בהמשך</strong>
          <div><h2>חשבון בלי ChatGPT</h2><p>כניסה פשוטה בדרך נוספת, לצד ייצוא ומחיקה של המידע שלך. אפשרות האורח תישאר.</p></div>
        </div>
      </div>
    </main>
  );
}
