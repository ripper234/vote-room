"use client";

import { useState, type FormEvent } from "react";
import { MessageSquarePlus, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState("idea");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, message, contactEmail, website, pagePath: window.location.pathname }),
      });
      if (!response.ok) {
        setError(response.status === 429
          ? "כבר התקבלו כמה הודעות מהחיבור הזה היום. אפשר לנסות שוב מחר."
          : "לא הצלחנו לשלוח את המשוב כרגע. נסו שוב בעוד רגע.");
        return;
      }
      setSent(true);
      setMessage("");
      setContactEmail("");
      setWebsite("");
    } catch {
      setError("אין חיבור כרגע. נסו שוב כשהרשת תחזור.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (next) { setSent(false); setError(""); } }}>
      <DialogTrigger asChild>
        <button type="button" className="fixed bottom-5 left-5 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#cad7ed] bg-white px-4 py-2 text-sm font-bold text-[#203779] shadow-[0_5px_22px_rgba(20,38,75,.17)] hover:bg-[#eaf0fb] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#91a8f7]" aria-label="שליחת משוב על האתר">
          <MessageSquarePlus aria-hidden="true" size={18} /> משוב
        </button>
      </DialogTrigger>
      <DialogContent dir="rtl" showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto text-right">
        <DialogClose asChild><button type="button" aria-label="סגירה" className="absolute top-4 left-4 rounded-md p-1 text-[#5b6b81] hover:bg-[#eaf0fb] focus-visible:outline-3 focus-visible:outline-[#91a8f7]"><X aria-hidden="true" size={18} /></button></DialogClose>
        <DialogTitle>יש לך משוב?</DialogTitle>
        <DialogDescription className="text-right">בעיה, רעיון או פרט שכדאי לבדוק — נשמח לשמוע. זה לוקח פחות מדקה.</DialogDescription>
        {sent ? (
          <div role="status" className="grid gap-4 text-[#203779]">
            <p className="m-0">תודה! המשוב התקבל.</p>
            <button type="button" className="button justify-self-start" onClick={() => setOpen(false)}>סגירה</button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-3">
            <label className="grid gap-1 font-bold" htmlFor="feedback-kind">על מה המשוב?</label>
            <select id="feedback-kind" className="field" value={kind} onChange={(event) => setKind(event.target.value)}>
              <option value="idea">רעיון או הצעה</option>
              <option value="problem">בעיה באתר</option>
              <option value="correction">מידע שכדאי לבדוק</option>
            </select>
            <label className="grid gap-1 font-bold" htmlFor="feedback-message">מה רצית לומר?</label>
            <textarea id="feedback-message" className="field min-h-28" required minLength={5} maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="כתבו כאן בכמה מילים…" />
            <label className="grid gap-1 font-bold" htmlFor="feedback-email">אימייל לתשובה (לא חובה)</label>
            <input id="feedback-email" className="field" type="email" maxLength={254} autoComplete="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder="name@example.com" dir="ltr" />
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label htmlFor="feedback-website">Website</label>
              <input id="feedback-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
            </div>
            <p className="m-0 text-xs leading-relaxed text-[#5b6b81]">ההודעה, כתובת העמוד והאימייל אם הוספת אותו יישמרו כדי שנוכל לעיין במשוב. אין צורך בחשבון.</p>
            <p aria-live="polite" className="m-0 text-sm text-[#a62935]">{error}</p>
            <button className="button justify-self-start" type="submit" disabled={pending}>{pending ? "שולחים…" : "שליחת משוב"}</button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
