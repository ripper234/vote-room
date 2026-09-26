export const metadata = { title: "אודות | חדר בחירה" };

export default function About() {
  return (
    <main className="shell about-page">
      <span className="eyebrow">אודות</span>
      <h1>לצמצם פערים, לא לפרק אחד את השני</h1>
      <div className="panel panel-body">
        <p>בואו נעשה כאן דמוקרטיה. אפשר להכיר אנשים ומפלגות, לבדוק מקורות ולשמור את ההתלבטות שלך. הבחירה נשארת שלך.</p>
        <p>המסלול שבחרת הוא רק נקודת פתיחה. אפשר לשנות אותו בכל רגע. כשחסר מידע, נגיד שחסר.</p>
        <section className="about-method" id="fair-reading-method"><h2>להבין לפני שמחליטים</h2><p>סטילמן הוא ניסיון לנסח עמדה כך שמי שמחזיק בה יזהה אותה, גם אם חולקים עליה. בהשראת תקשורת מקרבת, אנחנו שואלים מה נאמר, מה חשוב לאנשים ומה אפשר לבקש או לברר. הניסוחים בדפים הם פרשנות שלנו, לא ציטוטים; לא ננחש מניעים ולא נוותר על בדיקת עובדות. <a href="https://ethics.org.au/ethics-explainer-the-principle-of-charity/" target="_blank" rel="noopener noreferrer">על סטילמן ↗</a> · <a href="https://www.cnvc.org/about/purpose-of-nvc" target="_blank" rel="noopener noreferrer">על תקשורת מקרבת ↗</a></p></section>
        <details className="about-details"><summary>איך נשמרות הבחירות שלי?</summary><p>כאורח, מפתח פרטי שנשמר בדפדפן מקשר את ההעדפות והיסטוריית השינויים למסד הנתונים. כניסה עם ChatGPT מאפשרת להמשיך במכשיר אחר. בכניסה הראשונה המפה המקומית מועתקת רק אם החשבון ריק; אם כבר יש בו מפה, המפה המקומית נשארת בנפרד. כתובת האימייל אינה נשמרת עם ההחלטות.</p></details>
        <p>לשיחה על פוליטיקה בלי לפרק אחד את השני: <a href="https://www.facebook.com/share/g/1EfWByqptf/" target="_blank" rel="noopener noreferrer">NVDC Politics בפייסבוק ↗</a></p>
      </div>
    </main>
  );
}
