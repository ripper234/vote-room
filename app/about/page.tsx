export const metadata = { title: "אודות | חדר בחירה" };

export default function About() {
  return (
    <main className="shell about-page">
      <span className="eyebrow">אודות</span>
      <h1>לצמצם פערים, לא לפרק אחד את השני</h1>
      <div className="panel panel-body">
        <p>בואו נעשה כאן דמוקרטיה. האתר הזה נועד לעזור לכל אדם לברר את הבחירה שלו: להכיר את האנשים, לקרוא את המקורות, לזהות מה חשוב לו ולשמור את ההתלבטות לאורך הדרך.</p>
        <p>הוא לא אומר למי להצביע. נקודת הפתיחה שבחרת היא מסנן שאפשר לשנות, ולא תווית שמגדירה אותך או אנשים אחרים. כשמידע חסר או עמדה עשויה להשתנות, נציין את זה.</p>
        <p>לשיחה נוספת על פוליטיקה ותקשורת בין אנשים: <a href="https://www.facebook.com/share/g/1EfWByqptf/" target="_blank" rel="noopener noreferrer">NVDC Politics בפייסבוק ↗</a></p>
      </div>
    </main>
  );
}
