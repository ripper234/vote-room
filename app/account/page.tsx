import type { Metadata } from "next";
import { chatGPTSignInPath, getChatGPTUser } from "../chatgpt-auth";

export const metadata: Metadata = {
  title: "יצירת חשבון | חדר בחירה",
  description: "איך לשמור את מפת הבחירה בין מכשירים, או להמשיך כאורח בלי חשבון.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getChatGPTUser();

  return (
    <main className="shell account-page">
      <section className="panel">
        <div className="panel-body">
          <h1>{user ? "החשבון שלך מוכן" : "יצירת חשבון"}</h1>
          {user ? (
            <>
              <p className="account-lead">מחובר/ת עם {user.email}. הבחירות וההתלבטויות שלך יישמרו בחשבון ותוכל/י להמשיך במכשיר אחר.</p>
              <a className="button welcome-cta" href="/map" target="_top">להמשיך למפה ←</a>
            </>
          ) : (
            <>
              <p className="account-lead"><strong>כרגע הכניסה היחידה לחשבון היא עם ChatGPT.</strong> אין עדיין Google או אימייל עצמאי.</p>
              <p className="account-detail">עם חשבון אפשר לחזור לבחירות שלך ממכשיר אחר. כאורח, הן נשמרות במכשיר הזה.</p>
              <div className="welcome-actions">
                <a className="button welcome-cta" href={chatGPTSignInPath("/map")} target="_top">כניסה עם ChatGPT ←</a>
                <a className="button secondary welcome-guest-cta" href="/map" target="_top">כניסה כאורח</a>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
