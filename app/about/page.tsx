export const metadata = { title: "אודות | חדר בחירה" };

export default function About() {
  return (
    <main className="shell about-page">
      <span className="eyebrow">אודות</span>
      <h1>לצמצם פערים, לא לפרק אחד את השני</h1>
      <div className="panel panel-body">
        <p>בואו נעשה כאן דמוקרטיה. אפשר להכיר אנשים ומפלגות, לבדוק מקורות ולשמור את ההתלבטות שלך. הבחירה נשארת שלך.</p>
        <p>המסלול שבחרת הוא רק נקודת פתיחה. אפשר לשנות אותו בכל רגע. כשחסר מידע, נגיד שחסר.</p>
        <section className="about-method" id="fair-reading-method"><h2>להבין לפני שמחליטים</h2><p>בכל דף ננסה להציג את הטיעון החזק בעד הרשימה ולצדו את הטיעון החזק נגדה. אחריהם אפשר לפתוח שאלה לחשיבה: מה מתנגש כאן ומה עוד כדאי לברר. בהשראת סטילמן ותקשורת מקרבת, אלה ניסוחים שלנו על בסיס מקורות, לא ציטוטים או קביעות על מניעי הבוחרים. הצגת שני הצדדים אינה אומרת שהראיות לכל טענה שוות. <a href="https://ethics.org.au/ethics-explainer-the-principle-of-charity/" target="_blank" rel="noopener noreferrer">על סטילמן ↗</a> · <a href="https://www.cnvc.org/about/purpose-of-nvc" target="_blank" rel="noopener noreferrer">על תקשורת מקרבת ↗</a></p></section>
        <details className="about-details"><summary>איך נשמרות הבחירות שלי?</summary><p>ההעדפות, ההערות והיסטוריית השינויים נשמרות בשרת. כאורח, מפתח פרטי שנשמר בדפדפן נותן גישה למפה. כניסה עם ChatGPT מאפשרת להמשיך במכשיר אחר. אם לחשבון ולדפדפן יש מפות שונות, נבקש ממך לבחור; התנתקות מנקה את מפתח האורח מהמכשיר הזה. כתובת האימייל אינה נשמרת עם ההחלטות. <a href="/data">אפשר להוריד או למחוק את המפה וההיסטוריה שלך</a>.</p></details>
        <p>לשיחה על פוליטיקה בלי לפרק אחד את השני: <a href="https://www.facebook.com/share/g/1EfWByqptf/" target="_blank" rel="noopener noreferrer">NVDC Politics בפייסבוק ↗</a></p>
      </div>
    </main>
  );
}
