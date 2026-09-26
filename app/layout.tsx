import type { Metadata } from "next";
import Link from "next/link";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "./chatgpt-auth";
import "./globals.css";
import "./site.css";

export const metadata: Metadata = {
  title: "חדר בחירה",
  description: "מקום לחשוב לפני שמצביעים: להכיר את המפלגות והאנשים, להשוות עמדות ולשמור את ההתלבטות לאורך הדרך.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getChatGPTUser();
  return (
    <html lang="he" dir="rtl">
      <body>
        <header className="topbar">
          <div className="shell topbar-inner">
            <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">✓</span>חדר בחירה</Link>
            <nav className="nav" aria-label="ניווט ראשי">
              <Link href="/">המפה שלי</Link>
              <Link href="/welcome">איך זה עובד</Link>
              <Link href="/roadmap">לאן ממשיכים</Link>
              {user
                ? <a href={chatGPTSignOutPath("/")} target="_top" title={user.email}>התנתקות</a>
                : <a href={chatGPTSignInPath("/")} target="_top">כניסה ושמירה</a>}
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="shell footer-inner">
            <span>לחשוב יחד, לבחור בעצמך.</span>
            <Link href="/about">אודות והרעיון מאחורי האתר</Link>
            <a href="https://github.com/ripper234/vote-room" target="_blank" rel="noopener noreferrer">הקוד הפתוח ב־GitHub ↗</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
