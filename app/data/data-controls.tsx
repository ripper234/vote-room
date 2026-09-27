"use client";

import { useState } from "react";
import { clearDeviceDecisionKeys } from "@/lib/decision-key";
import { useDecision } from "@/lib/use-decision";

export default function DataControls() {
  const { state, saveState, retry, waitForSave, recoveryKey, account } = useDecision();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const headers: Record<string, string> = recoveryKey ? { "x-decision-key": recoveryKey } : {};

  async function download() {
    setBusy(true); setMessage("");
    try {
      if (!await waitForSave()) throw new Error("השינויים האחרונים עדיין לא נשמרו. נסה שוב.");
      const response = await fetch("/api/decision/export", { cache: "no-store", headers });
      if (!response.ok) throw new Error("לא הצלחנו להכין את הקובץ. נסה שוב.");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = "vote-room-data.json";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
      setMessage("הקובץ הורד. הוא כולל גם את היסטוריית השינויים שלך.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "ההורדה נכשלה."); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!window.confirm("למחוק את המפה, ההערות וכל היסטוריית השינויים שלך? לא ניתן לבטל את המחיקה.")) return;
    setBusy(true); setMessage("");
    try {
      if (!await waitForSave()) throw new Error("יש שינויים שעדיין לא נשמרו. נסה שוב בעוד רגע.");
      const response = await fetch("/api/decision", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ confirm: "delete_my_decisions" }),
      });
      if (!response.ok) throw new Error("המחיקה נכשלה. המידע עדיין קיים. נסה שוב.");
      clearDeviceDecisionKeys();
      window.location.replace(account ? "/map" : "/");
    } catch (error) { setMessage(error instanceof Error ? error.message : "המחיקה נכשלה."); setBusy(false); }
  }

  return <main className="shell account-page">
    <section className="panel panel-body data-panel">
      <h1>הנתונים שלי</h1>
      <p>ההעדפות, ההערות והיסטוריית השינויים נשמרות בשרת. כאורח, מפתח גישה בדפדפן הזה פותח את המפה; בחשבון ChatGPT אפשר לחזור אליה ממכשיר אחר.</p>
      {state ? <>
        <p className="muted small">{account ? `החשבון המחובר: ${account.email}` : "כרגע זו מפת אורח. מחיקת נתוני הדפדפן ללא מפתח שחזור תנתק אותך ממנה."}</p>
        <div className="data-actions">
          <button type="button" className="button secondary" disabled={busy} onClick={download}>הורד את המפה וההיסטוריה</button>
          <button type="button" className="button danger" disabled={busy} onClick={remove}>מחק את כל הנתונים שלי</button>
        </div>
        <p className="muted small">מחיקה בחשבון מסירה גם את מפת האורח ששמורה בדפדפן הזה, אם יש כזו. אין דרך לשחזר אחרי מחיקה.</p>
      </> : saveState === "error" ? <button type="button" className="button" onClick={retry}>לא הצלחנו לטעון. נסה שוב</button> : <p>טוען…</p>}
      {message && <p role="status" className="form-feedback">{message}</p>}
      <a href="/map">חזרה למפה</a>
    </section>
  </main>;
}
