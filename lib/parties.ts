export type PartyVideo = { name: string; title: string; id: string; date: string; duration: string; excerpt?: { start: number; end: number } };
export type PublicVoice = {
  person: string;
  role: string;
  stance: "support" | "against";
  statement: string;
  date: string;
  url: string;
};

export type Party = {
  slug: string;
  name: string;
  leaders: string;
  color: string;
  bloc: "change" | "continue" | "other";
  summary: string;
  tldr: string;
  context: string;
  electionStatus?: { text: string; url: string };
  manifestoSummary: string;
  program?: { label: string; url: string };
  extraSources?: { label: string; url: string }[];
  highlights: { topic: string; text: string; url: string }[];
  videos: { name: string; title: string; id: string; date: string }[];
  featuredVideos?: PartyVideo[];
  publicVoices?: PublicVoice[];
  people: { name: string; x: string }[];
  check: string[];
};

export const parties: Party[] = [
  {
    slug: "yahad",
    name: "ביחד",
    leaders: "נפתלי בנט ויאיר לפיד",
    color: "#339184",
    bloc: "change",
    summary: "רשימה משותפת של בנט ולפיד",
    tldr: "רשימה משותפת של שני ראשי ממשלה לשעבר, עם תכניות מפורטות בתחומי שירות, כלכלה, חינוך ובריאות.",
    context: "בנט ולפיד רצים ברשימה אחת. לכן בחירה בכל אחד מהם אינה אפשרות נפרדת בקלפי.",
    manifestoSummary: "באתר הרשימה מופיעות תכניות לשירות, הורדת יוקר המחיה, שיקום יישובי קו העימות, בריאות, חינוך, עסקים קטנים ויחסי דת ומדינה. אלו תכניות מוצהרות; חשוב לבדוק עלות, סדר עדיפויות ופשרות קואליציוניות.",
    program: { label: "התכניות באתר ביחד", url: "https://be-yahad.org.il/plans/" },
    highlights: [
      { topic: "שותפות עם מפלגות ערביות", text: "בנט אמר שלא יקים ממשלה שתלויה בתמיכת מפלגות ערביות אחרי 7 באוקטובר; בדוק אם זו גם עמדת הרשימה המשותפת כיום.", url: "https://www.mako.co.il/news-politics/2026_q1/Article-528136008722c91027.htm" },
      { topic: "דמוקרטיה וחוקה", text: "מפורסמת הצעה לחוקה על בסיס מגילת העצמאות.", url: "https://be-yahad.org.il/the-scroll/" },
      { topic: "כלכלה ויוקר המחיה", text: "מפורסמת תכנית להורדת יוקר המחיה ולעסקים קטנים.", url: "https://be-yahad.org.il/plans/" },
      { topic: "דת ומדינה", text: "מפורסמת תכנית להסדרת יחסי דת ומדינה.", url: "https://be-yahad.org.il/plans/" },
      { topic: "ביטחון ומדיניות חוץ", text: "מפורסמות תכניות לשירות ולשיקום יישובי קו העימות.", url: "https://be-yahad.org.il/plans/" },
      { topic: "בריאות הנפש", text: "תכנית שיקום כוללת קיצור תורים והרחבת טיפול נפשי, בעיקר בהקשר של נפגעי שירות ובני משפחותיהם.", url: "https://be-yahad.org.il/plans/rehabilitation/" },
    ],
    videos: [
      { name: "נפתלי בנט", title: "נאום בכנס ״מנצחים ביחד״", id: "vTB0FJ1kqJA", date: "12.5.2026" },
      { name: "יאיר לפיד", title: "נאום באותו כנס", id: "YSfX3YG-lWs", date: "12.5.2026" },
    ],
    featuredVideos: [
      { name: "נפתלי בנט", title: "שיחה עם הציבור בחולון", id: "VqRghIjij_E", date: "5.8.2026", duration: "4:02" },
      { name: "יאיר לפיד", title: "על תקציב המדינה בכנסת", id: "jdS8QRtkX6s", date: "28.1.2026", duration: "3:43" },
    ],
    people: [
      { name: "נפתלי בנט", x: "https://x.com/naftalibennett" },
      { name: "יאיר לפיד", x: "https://x.com/yairlapid" },
    ],
    check: ["איזה חלק בהחלטות יובל בידי בנט, ואיזה בידי לפיד?", "מהי העמדה המעשית שלהם על הרכב הקואליציה?", "אילו תכניות כלכליות ומשילות חשובות לך במיוחד?"],
  },
  {
    slug: "yashar",
    name: "ישר!",
    leaders: "גדי איזנקוט",
    color: "#e1a931",
    bloc: "change",
    summary: "רשימתו של גדי איזנקוט",
    tldr: "עשרת הצעדים של ישר! מדגישים ביטחון, שיקום שירות ציבורי, משילות, שירות לכל ומאבק ביוקר המחיה.",
    context: "במסמך עשרת הצעדים מופיעים בין היתר חוק יסוד החקיקה, שינוי השירות הציבורי, מאבק ביוקר המחיה ובפשיעה, ושירות ממלכתי לכל.",
    manifestoSummary: "המסמך מציע ועדת חקירה ממלכתית, חוק שירות ממלכתי לכל, מאבק בפשיעה, פתיחת המשק לתחרות, חוק יסוד החקיקה והגבלת כהונת ראש ממשלה לשתי קדנציות.",
    program: { label: "עשרת הצעדים של ישר!", url: "https://yasharwitheisenkot.com/agenda_point/" },
    highlights: [
      { topic: "שותפות עם מפלגות ערביות", text: "עמדת הרשימה על כניסת רע״ם לממשלה אינה חד־משמעית במקורות שנבדקו; דווח כי ישר! הכחישה הבטחה לצרף אותה.", url: "https://www.mako.co.il/news-israel-elections/2026/Article-8dbf01e28b8a0a1027.htm" },
      { topic: "משילות ושירות ציבורי", text: "התכנית מבטיחה מאבק בפשיעה המאורגנת ושיקום שירות ציבורי מקצועי.", url: "https://yasharwitheisenkot.com/agenda_point/" },
      { topic: "דמוקרטיה וחוקה", text: "מוצעים חוק יסוד החקיקה, עצמאות המשפט והגבלת כהונת ראש הממשלה.", url: "https://yasharwitheisenkot.com/agenda_point/" },
      { topic: "כלכלה ויוקר המחיה", text: "התכנית מציעה לפרק ריכוזיות, להגביר תחרות ולאמץ תקינה בינלאומית.", url: "https://yasharwitheisenkot.com/agenda_point/" },
      { topic: "בריאות הנפש", text: "יש תכנית לשיקום פוסט טראומה, עם טיפול בבוגרי שירות וגם תכניות חוסן ומעקב בקהילה.", url: "https://yasharwitheisenkot.com/principles/post-traumatic-stress-recovery/" },
    ],
    videos: [
      { name: "גדי איזנקוט", title: "נאום השקת מסע הבחירות", id: "AzbeSJB8JUs", date: "30.6.2026" },
    ],
    featuredVideos: [
      { name: "גדי איזנקוט", title: "מדוע הקים את ישר! ומה ירצה לקדם", id: "AzbeSJB8JUs", date: "30.6.2026", duration: "3:53", excerpt: { start: 452, end: 685 } },
    ],
    publicVoices: [
      { person: "אפרים ארליך", role: "נצ״מ בדימוס", stance: "support", statement: "אמר בשיחה ברדיו שיצביע לגדי איזנקוט, לצד תמיכה בצעד של יואב סגלוביץ׳ לחבור לרע״ם.", date: "6.9.2026", url: "https://103fm.yaniv.tv/media/741337/%D7%91%D7%9E%D7%93%D7%99%D7%A0%D7%AA-%D7%94%D7%92%D7%9E%D7%93%D7%99%D7%9D-%D7%A8%D7%A2%D7%A9-%D7%9E%D7%94%D7%95%D7%9E%D7%94" },
    ],
    people: [{ name: "גדי איזנקוט", x: "https://x.com/gadi_eisenkot" }],
    check: ["מה פירוש ״משילות״ בתכנית מול עצמאות מוסדות המשפט?", "כיצד מתורגמים הצעדים הכלכליים לתקציב?", "האם עמדת הקואליציה שלו תואמת את הקווים האדומים שלך?"],
  },
  {
    slug: "democrats",
    name: "הדמוקרטים",
    leaders: "יאיר גולן",
    color: "#e65775",
    bloc: "change",
    summary: "רשימה בהובלת יאיר גולן",
    tldr: "מצע מפורט שמציג קו חברתי וליברלי בנושאי דמוקרטיה, ביטחון, כלכלה, דת ומדינה וחינוך.",
    context: "למפלגה מצע מפורט בנושאי ביטחון, דמוקרטיה, כלכלה, דת ומדינה, חינוך ואקלים. כדאי לקרוא את הסעיפים החשובים לך ולהבחין בין הצהרה לבין יכולת מימוש.",
    manifestoSummary: "המצע עוסק בביטחון, חיזוק הדמוקרטיה, מדיניות כלכלית וחברתית, יחסי דת ומדינה, חינוך, סביבה וזכויות אזרח. בדף המקור ניתן לקרוא את הניסוחים וההתחייבויות המדויקים.",
    program: { label: "המצע המלא, PDF", url: "https://democrats.org.il/wp-content/uploads/2026/08/plan-8-26-he.pdf" },
    highlights: [
      { topic: "שותפות עם מפלגות ערביות", text: "גולן אמר במאי 2026 שרע״ם היא שותפה לגיטימית להקמת ממשלה. זו הצהרה מתוארכת, לא התחייבות להסכם עתידי.", url: "https://www.c14.co.il/article/1547280" },
      { topic: "דמוקרטיה וחוקה", text: "המצע מקדיש פרק לדמוקרטיה, שלטון החוק וזכויות אזרח.", url: "https://democrats.org.il/wp-content/uploads/2026/08/plan-8-26-he.pdf" },
      { topic: "דת ומדינה", text: "המצע כולל הצעות בתחום יחסי דת ומדינה.", url: "https://democrats.org.il/wp-content/uploads/2026/08/plan-8-26-he.pdf" },
      { topic: "כלכלה ויוקר המחיה", text: "המצע כולל פרק כלכלי וחברתי מפורט.", url: "https://democrats.org.il/wp-content/uploads/2026/08/plan-8-26-he.pdf" },
    ],
    videos: [
      { name: "יאיר גולן", title: "ראיון בכנס INSS", id: "H0S_8YTEDZo", date: "27.7.2026" },
    ],
    featuredVideos: [
      { name: "יאיר גולן", title: "על שנת 2026 כשנת מפנה ותיקון", id: "IJCFSk1ogDU", date: "29.12.2025", duration: "3:21" },
    ],
    publicVoices: [
      { person: "טובה הרצל", role: "שגרירה לשעבר", stance: "support", statement: "כתבה שתצביע לדמוקרטים משום שהיא מבקשת לחזק עמדה מדינית ברורה, גם אם תשמח לראות את איזנקוט בראשות הממשלה.", date: "7.7.2026", url: "https://www.zman.co.il/701195/" },
      { person: "בן כספית", role: "עיתונאי ובעל טור", stance: "against", statement: "כתב שלא יצביע לדמוקרטים כי יאיר גולן ממוקם שמאלה ממנו, אף שהוא מעריך את גולן ואת חלק מאנשי הרשימה.", date: "7.8.2026", url: "https://www.walla.co.il/news/opinions/3859036" },
    ],
    people: [{ name: "יאיר גולן", x: "https://x.com/YairGolan1" }],
    check: ["איזו פשרה קואליציונית תהיה מקובלת עליך?", "איזה סעיף במצע הוא תנאי מבחינתך?", "מה ההבדל בין הכיוון הערכי לבין היכולת לבצע?"],
  },
  {
    slug: "beytenu",
    name: "ישראל ביתנו",
    leaders: "אביגדור ליברמן",
    color: "#5e72ac",
    bloc: "change",
    summary: "רשימה בראשות אביגדור ליברמן",
    tldr: "מצע ישראל ביתנו מדגיש ביטחון, שירות, כלכלה אזרחית ויחסי דת ומדינה; כדאי להבחין בין המצע לבין תנאי הקואליציה בפועל.",
    context: "ישראל ביתנו היא אחת מארבע הרשימות המזוהות עם גוש השינוי. אפשר לכלול אותה במפת ההשוואה או להוציא אותה, בלי למחוק את ההתלבטות הקודמת.",
    manifestoSummary: "באתר המפלגה מוצגים המצע ותכנית לממשלה הבאה. כדאי לקרוא את ההצעות בנושאי ביטחון, גיוס, כלכלה ודת ומדינה לצד הצהרות עדכניות על שותפים לקואליציה.",
    program: { label: "מצע ישראל ביתנו", url: "https://beytenu.org.il/party-platform/" },
    highlights: [
      { topic: "שותפות עם מפלגות ערביות", text: "המצע הרשמי אומר שהממשלה הבאה תורכב ממפלגות ציוניות בלבד.", url: "https://beytenu.org.il/party-platform/" },
      { topic: "דת ומדינה", text: "המצע כולל פרק על יחסי דת ומדינה.", url: "https://beytenu.org.il/party-platform/" },
      { topic: "ביטחון ומדיניות חוץ", text: "תכנית המפלגה עוסקת בביטחון ובשירות.", url: "https://beytenu.org.il/party-platform-israel-beytenu-next-government/" },
      { topic: "כלכלה ויוקר המחיה", text: "תכנית הממשלה הבאה כוללת צעדים כלכליים.", url: "https://beytenu.org.il/party-platform-israel-beytenu-next-government/" },
    ],
    videos: [
      { name: "אביגדור ליברמן", title: "ראיון בכנס INSS", id: "UDlqqiYEOOE", date: "27.7.2026" },
    ],
    featuredVideos: [
      { name: "אביגדור ליברמן", title: "מדוע הוא מבקש להוביל את המדינה", id: "AjS3_Y-6pnI", date: "7.9.2026", duration: "4:52" },
    ],
    publicVoices: [
      { person: "אילן כץ", role: "אל״מ במיל׳ ועורך דין", stance: "support", statement: "כתב שיצביע לליברמן ולישראל ביתנו, בין היתר בשל ניסיונו הביטחוני ועמדתו על שירות לכל.", date: "30.6.2026", url: "https://www.news1.co.il/Archive/0026-D-184604-00.html" },
    ],
    people: [{ name: "אביגדור ליברמן", x: "https://x.com/AvigdorLiberman" }],
    check: ["מה עמדתה המעשית לגבי שותפים קואליציוניים?", "אילו צעדים במצע חשובים לך?", "האם יש פער בין ההבטחות לבין היכולת לממשן?"],
  },
  {
    slug: "likud",
    name: "הליכוד",
    leaders: "בנימין נתניהו",
    color: "#2864bb",
    bloc: "continue",
    summary: "רשימת הליכוד בראשות ראש הממשלה",
    tldr: "הליכוד מוביל את הממשלה הנוכחית. באתר הרשמי יש עקרונות ורשימת מועמדים, אך לא איתרנו מצע מפורט ועדכני לבחירות האלה.",
    context: "אפשר לבחון את ההנהגה דרך המעשים בתקופת כהונתה, לצד התחייבויות חדשות. העדר מצע מפורט במקור שנבדק הוא פער מידע, לא עמדה בנושא מסוים.",
    manifestoSummary: "באתר הרשמי מוצגים עקרונות כלליים ורשימת המועמדים לכנסת ה־26. לא איתרנו שם מסמך מצע 2026 מפורט שמשווה תחום לתחום.",
    program: { label: "רשימת המועמדים באתר הרשמי", url: "https://www.likud.org.il/בחירות/כנסת/knesset26" },
    highlights: [],
    videos: [
      { name: "בנימין נתניהו", title: "הצהרה על המצב בלבנון, 2:13 דקות", id: "J9nXLpLo7yg", date: "14.9.2026" },
      { name: "בנימין נתניהו", title: "ראיון בערוץ 14", id: "J5-qzqsRwxY", date: "30.6.2026" },
    ],
    featuredVideos: [
      { name: "בנימין נתניהו", title: "על אלטלנה והימנעות ממלחמת אחים", id: "sO4Clz1j2Pg", date: "24.8.2026", duration: "4:45" },
    ],
    publicVoices: [
      { person: "אלי אוחנה", role: "כדורגלן עבר ומגיש רדיו", stance: "support", statement: "אמר שיצביע לליכוד גם אם נתניהו יעזוב את המפלגה; תמיכתו היא בליכוד כמפלגה.", date: "7.5.2026", url: "https://x.com/radio103fm/status/2052283347099898272" },
    ],
    people: [{ name: "בנימין נתניהו", x: "https://x.com/netanyahu" }],
    check: ["איזה הישג של הממשלה חשוב לך במיוחד?", "מה היית רוצה שייעשה אחרת?", "איזו התחייבות קונקרטית תרצה לראות לבחירות האלה?"],
  },
  {
    slug: "otzma",
    name: "עוצמה יהודית",
    leaders: "איתמר בן גביר",
    color: "#3c4c66",
    bloc: "continue",
    summary: "רשימה בראשות איתמר בן גביר",
    tldr: "המפלגה מבקשת ממשלת ימין בראשות נתניהו. האתר הרשמי מציג את זהותה ועקרונותיה; לא איתרנו מצע 2026 מפורט לכל נושא.",
    context: "הסרטון מציג את המנהיג במילותיו. לצד ההצהרות, כדאי להשוות בין מטרות, סמכויות ותוצאות בפועל.",
    manifestoSummary: "עמוד ״מי אנחנו״ באתר המפלגה מציג כיוון כללי. הוא אינו מחליף מצע מפורט ומעודכן לכל תחומי המדיניות.",
    program: { label: "על המפלגה באתר הרשמי", url: "https://www.ozma-yeudit.co.il/מי-אנחנו/" },
    highlights: [],
    videos: [{ name: "איתמר בן גביר", title: "ראיון על מדיניותו", id: "vaqbl1iWRik", date: "20.9.2026" }],
    featuredVideos: [
      { name: "איתמר בן גביר", title: "שיחה בכנס ירושלים", id: "bfQ76_h0NkY", date: "7.9.2026", duration: "2:45" },
    ],
    publicVoices: [
      { person: "ברוך מרזל", role: "פעיל ימין ושותף פוליטי בעבר", stance: "against", statement: "אמר בריאיון שלא יצביע לעוצמה יהודית בבחירות הקרובות, משום שלדעתו בן גביר התרחק מעמדותיו בעבר.", date: "31.8.2026", url: "https://www.emess.co.il/radio/1923111" },
    ],
    people: [{ name: "איתמר בן גביר", x: "https://x.com/itamarbengvir" }],
    check: ["אילו תוצאות בתחום הביטחון האישי חשובות לך?", "מהו הגבול בין כוח שלטוני לבין ביקורת עליו?", "מהי הפשרה הקואליציונית האפשרית מבחינתך?"],
  },
  {
    slug: "rz-zehut",
    name: "הציונות הדתית וזהות",
    leaders: "בצלאל סמוטריץ׳ ומשה פייגלין",
    color: "#7c5aa2",
    bloc: "continue",
    summary: "רשימה משותפת של שתי מסגרות פוליטיות",
    tldr: "סמוטריץ׳ ופייגלין ברשימה אחת. לשני השותפים מסמכי מדיניות נפרדים; אין לייחס אוטומטית כל סעיף של אחד למצע משותף.",
    context: "זהות נמצאת ברשימת הציונות הדתית, ולא מתמודדת בנפרד. כדאי להקשיב לשני המנהיגים ולבדוק על מה הסכימו בפועל.",
    manifestoSummary: "לציונות הדתית מצע באתרה, ולזהות תקציר מצע באתרה. אלה מקורות של השותפים, ולא מסמך אחיד מאומת של הרשימה המשותפת.",
    program: { label: "מצע הציונות הדתית", url: "https://zionutdatit.org.il/מצע-המפלגה/" },
    extraSources: [{ label: "תקציר מצע זהות", url: "https://www.zehut.org.il/platform/summary" }],
    highlights: [
      { topic: "כלכלה ויוקר המחיה", text: "אפשר להשוות בין התכניות הכלכליות הנפרדות של השותפים; טרם אומת מצע משותף בנושא.", url: "https://www.zehut.org.il/platform/summary" },
    ],
    videos: [
      { name: "בצלאל סמוטריץ׳", title: "ראיון", id: "q3MZdt_Jk7U", date: "2026" },
      { name: "משה פייגלין", title: "ראיון", id: "Hn8fhh2SEZM", date: "11.9.2026" },
    ],
    featuredVideos: [
      { name: "בצלאל סמוטריץ׳", title: "דברים בישיבת סיעה", id: "bnrGE6vajNs", date: "19.1.2026", duration: "2:20" },
      { name: "משה פייגלין", title: "על תפקיד זהות בממשלה", id: "gMSpH57itBU", date: "29.8.2026", duration: "2:55" },
    ],
    people: [
      { name: "בצלאל סמוטריץ׳", x: "https://x.com/bezalelsm" },
      { name: "משה פייגלין", x: "https://x.com/moshefeiglin" },
    ],
    check: ["אילו סעיפים מוסכמים על שני השותפים?", "מה מיקומו והשפעתו של כל שותף ברשימה?", "איזו תכנית אפשרית במסגרת קואליציה?"],
  },
  {
    slug: "shas",
    name: "ש״ס",
    leaders: "אריה דרעי",
    color: "#48718c",
    bloc: "continue",
    summary: "רשימה בראשות אריה דרעי",
    tldr: "ש״ס מביעה תמיכה בהמשך הנהגת נתניהו, עם דרישות קואליציוניות משלה. לא איתרנו מצע 2026 מפורט באתר רשמי.",
    context: "כדי להעריך את הרשימה, כדאי לבדוק את ההסכמים וההצעות הקונקרטיות שלה לצד דברי המנהיג.",
    manifestoSummary: "בשלב זה אין בדף מצע רשמי מפורט ומאומת לבחירות 2026. הקישור מוביל לרשימה שהוגשה, והסרטון מאפשר להקשיב לדברי דרעי.",
    program: { label: "הרשימות שהוגשו לכנסת", url: "https://www.knesset.tv/main-articles/61384/94592/" },
    highlights: [],
    videos: [
      { name: "אריה דרעי", title: "ראיון לקראת הבחירות בערוץ 14", id: "FT7v-SSEGW8", date: "26.8.2026" },
      { name: "אריה דרעי", title: "שיחה בפודקאסט ״מפגש״", id: "Ld-F2nVF6ow", date: "2026" },
    ],
    featuredVideos: [
      { name: "אריה דרעי", title: "פתיחת ראיון לקראת הבחירות", id: "FT7v-SSEGW8", date: "26.8.2026", duration: "4:00", excerpt: { start: 0, end: 240 } },
    ],
    publicVoices: [
      { person: "הרב יצחק יוסף", role: "הרב הראשי לשעבר", stance: "support", statement: "קרא באירוע בעכו לתמוך בנציגי ש״ס בהובלת דרעי, בשל מחויבותם לדרכו הדתית.", date: "16.9.2026", url: "https://www.jdn.co.il/news/2730089/" },
    ],
    people: [{ name: "אריה דרעי", x: "https://x.com/ariyederi" }],
    check: ["מהן הדרישות הקואליציוניות החשובות של ש״ס?", "אילו הצעות כלכליות וחברתיות מעשיות הוצגו?", "איפה עשויה להיות פשרה ואיפה קו אדום?"],
  },
  {
    slug: "utj",
    name: "יהדות התורה",
    leaders: "יעקב אשר בראש הרשימה שהוגשה",
    color: "#66787f",
    bloc: "continue",
    summary: "רשימה חרדית; עמדת הקואליציה מותנית",
    tldr: "הרשימה השתתפה בגוש נתניהו, אך הצהרות עדכניות מצביעות על כך שהתמיכה בהמשך השותפות אינה אוטומטית.",
    context: "הסיווג כאן משקף את ההשתייכות האחרונה לקואליציה, לא התחייבות ודאית לממשלה הבאה.",
    manifestoSummary: "לא איתרנו מצע רשמי מפורט ועדכני לבחירות האלה. יש לבדוק הצהרות והסכמים, במיוחד בנושא חוק הגיוס.",
    program: { label: "הרשימה שהוגשה לכנסת", url: "https://www.knesset.tv/main-articles/61384/94592/" },
    highlights: [],
    videos: [{ name: "יעקב אשר", title: "ראיון על שותפות קואליציונית", id: "i6MWJ9fUWa8", date: "21.7.2026" }],
    featuredVideos: [
      { name: "יעקב אשר", title: "נאום בכנסת על סוגיות דת ומדינה", id: "Fi1yeP8PAdI", date: "29.1.2026", duration: "2:47" },
    ],
    people: [],
    check: ["מה התנאים לשותפות בממשלה?", "איזה נוסח של חוק גיוס תקדם הרשימה?", "מהי עמדת הנציגים בנושאים החשובים לך?"],
  },
  {
    slug: "amcha",
    name: "עמך ישראל",
    leaders: "עופר וינטר",
    color: "#566c4c",
    bloc: "other",
    summary: "רשימה חדשה בראשות עופר וינטר",
    tldr: "וינטר ממליץ על הנהגת נתניהו אך מציב תנאים לשותפות, ובהם חקיקת שירות לכל. לכן היא מוצגת כאפשרות נוספת, עם הקשר קואליציוני מותנה.",
    context: "רשימה חדשה שהוגשה לבחירות. כדאי לבחון את תנאי השותפות בפועל ואת הצוות והמדיניות מעבר להצהרת הכיוון.",
    manifestoSummary: "האתר הרשמי מציג את הרשימה וכיוונה. מסמך המדיניות המלא צריך להיבחן לפי הסעיפים והתוקף שלהם.",
    program: { label: "אתר עמך ישראל", url: "https://amchaisrael.co.il/" },
    highlights: [],
    videos: [{ name: "עופר וינטר", title: "השקת הרשימה", id: "yFkwVcLi_W4", date: "2026" }],
    featuredVideos: [
      { name: "עופר וינטר", title: "על כיוון הרשימה והמלצתו לראש הממשלה", id: "mV-ikAcrqZk", date: "27.8.2026", duration: "3:55" },
    ],
    people: [],
    check: ["מהם התנאים המפורשים לכניסה לקואליציה?", "כיצד תיראה תכנית השירות לכל?", "איזו השפעה תהיה לרשימה חדשה?"],
  },
  {
    slug: "raam",
    name: "רע״ם",
    leaders: "מנסור עבאס",
    color: "#40a36e",
    bloc: "other",
    summary: "רשימה בראשות מנסור עבאס",
    tldr: "עבאס מדגיש שותפות אזרחית והשפעה דרך השתתפות בממשלה. ההחלטה על שותפות עתידית תלויה בהסכמות פוליטיות.",
    context: "אם נושא השותפות עם מפלגות ערביות חשוב לך, כדאי לשמוע את עבאס במילותיו ולבדוק גם את עמדות השותפים האפשריים.",
    electionStatus: { text: "ועדת הבחירות החליטה ב־23.9 לפסול את רשימת רע״ם. נכון ל־26.9 זו אינה הכרעה סופית; כשירות הרשימה תלויה בהכרעת בית המשפט העליון.", url: "https://www.knesset.tv/main-articles/61384/94753/" },
    manifestoSummary: "לא איתרנו כאן מצע מפורט ועדכני של הרשימה לבחירות 2026. מקור המועמדים והראיון זמינים להמשך בדיקה.",
    program: { label: "הרשימה שהוגשה לכנסת", url: "https://www.knesset.tv/main-articles/61384/94592/" },
    highlights: [],
    videos: [{ name: "מנסור עבאס", title: "ראיון בכנס INSS", id: "zrdkNa3s0f0", date: "27.7.2026" }],
    featuredVideos: [
      { name: "מנסור עבאס", title: "משיב לשאלה על התנועה האסלאמית", id: "Rb-TKn-YqUU", date: "24.11.2025", duration: "4:55" },
    ],
    people: [{ name: "מנסור עבאס", x: "https://x.com/mnsorabbas" }],
    check: ["איזה סוג שותפות קואליציונית אפשרי מבחינתך?", "אילו יעדים אזרחיים מציעה הרשימה?", "מה תהיה יכולתה להשפיע בממשלה או באופוזיציה?"],
  },
  {
    slug: "joint",
    name: "הרשימה המשותפת",
    leaders: "יוסף ג׳בארין, אחמד טיבי וסאמי אבו שחאדה",
    color: "#b64f47",
    bloc: "other",
    summary: "רשימה משותפת של כמה מסגרות פוליטיות",
    tldr: "יוסף ג׳בארין עומד בראש הרשימה שהוגשה. עקרונות חד״ש זמינים, אך הם אינם בהכרח מצע מוסכם של כל השותפים.",
    context: "לרשימה כמה הנהגות וגישות. רצוי לבחון גם את ההסכמות המשותפות וגם את ההבדלים בין השותפים.",
    electionStatus: { text: "ועדת הבחירות החליטה ב־23.9 לפסול את הרשימה המשותפת ואת מועמדות סאמי אבו שחאדה ועופר כסיף. נכון ל־26.9 ההכרעה הסופית עוד בפני בית המשפט העליון.", url: "https://www.knesset.tv/main-articles/61384/94753/" },
    manifestoSummary: "עמוד העקרונות של חד״ש עוסק בשוויון, שלום, זכויות עובדים ודמוקרטיה. אין לייחס אותו במלואו לכל הרשימה המשותפת בלי מסמך משותף עדכני.",
    program: { label: "עקרונות חד״ש", url: "https://hadash.org.il/" },
    extraSources: [{ label: "מועמדי חד״ש ברשימה", url: "https://hadash.org.il/list" }],
    highlights: [
      { topic: "דמוקרטיה וחוקה", text: "עקרונות חד״ש מדגישים שוויון אזרחי ודמוקרטיה; יש לבדוק מה אומץ בידי הרשימה כולה.", url: "https://hadash.org.il/" },
    ],
    videos: [{ name: "יוסף ג׳בארין", title: "ראיון בערוץ חד״ש", id: "AMnEOCd71Uo", date: "2026" }],
    featuredVideos: [
      { name: "יוסף ג׳בארין", title: "על הקמת הרשימה המשותפת", id: "GPfYVwKkd48", date: "14.6.2026", duration: "4:07" },
      { name: "אחמד טיבי", title: "על הקמת רשימה משותפת", id: "4rRnPwT35V0", date: "8.6.2026", duration: "2:03" },
    ],
    people: [
      { name: "יוסף ג׳בארין", x: "https://x.com/DrJabareen" },
      { name: "אחמד טיבי", x: "https://x.com/Ahmad_tibi" },
    ],
    check: ["מהו המצע המוסכם של השותפים?", "איך תבחר הרשימה להשפיע לאחר הבחירות?", "אילו הבדלים בין מרכיביה חשובים לך?"],
  },
  {
    slug: "bluewhite",
    name: "כחול לבן",
    leaders: "בני גנץ",
    color: "#5a86b4",
    bloc: "other",
    summary: "רשימה בראשות בני גנץ",
    tldr: "גנץ מדבר על ממשלת הסכמות ואינו פוסל מראש שותפות עם נתניהו. לכן הרשימה לא מסווגת כאן אוטומטית לאחד משני המחנות.",
    context: "העמדה הקואליציונית היא שאלה מכרעת בדף הזה: בדוק מה ייחשב להסכמה מספקת ומה יישאר קו אדום.",
    manifestoSummary: "מסמך העקרונות מ־2025 מציג הצעות בדמוקרטיה, משילות, כלכלה ודת ומדינה. בספטמבר 2026 פורסמה גם תכנית ממשלית־חוקתית בהסכמה. כדאי לקרוא את שני המסמכים ולבדוק מה מתחייבת הרשימה לקדם.",
    program: { label: "עקרונות כחול לבן, PDF מ־2025", url: "https://kachollavan.org.il/wp-content/uploads/2025/07/20527_3_A5_Hoveret_Ekronot_ONE_PAGE_A.pdf" },
    extraSources: [{ label: "תכנית ממשלית־חוקתית, ספטמבר 2026", url: "https://kachollavan.org.il/7659/" }],
    highlights: [
      { topic: "משילות ושירות ציבורי", text: "מסמך העקרונות מ־2025 מציע חיזוק אכיפה וביטחון פנים וביזור סמכויות לשלטון המקומי.", url: "https://kachollavan.org.il/wp-content/uploads/2025/07/20527_3_A5_Hoveret_Ekronot_ONE_PAGE_A.pdf" },
      { topic: "דמוקרטיה וחוקה", text: "מסמך העקרונות מ־2025 מציע לשמור על עצמאות מערכת המשפט, לקדם חוק יסוד: החקיקה ולעגן שוויון בזכויות הפרט.", url: "https://kachollavan.org.il/wp-content/uploads/2025/07/20527_3_A5_Hoveret_Ekronot_ONE_PAGE_A.pdf" },
      { topic: "כלכלה ויוקר המחיה", text: "מסמך העקרונות מ־2025 מציע לפתוח את המשק לתחרות ולייבוא כדי להתמודד עם יוקר המחיה.", url: "https://kachollavan.org.il/wp-content/uploads/2025/07/20527_3_A5_Hoveret_Ekronot_ONE_PAGE_A.pdf" },
      { topic: "דת ומדינה", text: "מסמך העקרונות מ־2025 מדבר על זהות יהודית לצד חירות אישית ועל סמכות מקומית לעצב את השבת.", url: "https://kachollavan.org.il/wp-content/uploads/2025/07/20527_3_A5_Hoveret_Ekronot_ONE_PAGE_A.pdf" },
    ],
    videos: [{ name: "בני גנץ", title: "שיחה בפודקאסט", id: "ib2581vhsn8", date: "2026" }],
    featuredVideos: [
      { name: "בני גנץ", title: "על הקמת ממשלה חלופית", id: "HtyPrIkRd-8", date: "11.5.2026", duration: "3:43" },
    ],
    people: [{ name: "בני גנץ", x: "https://x.com/gantzbe" }],
    check: ["עם מי תהיה מוכנה לשבת?", "מהם התנאים לממשלת הסכמות?", "אילו תכניות מפורטות פורסמו בתחומים החשובים לך?"],
  },
  {
    slug: "reservists",
    name: "המילואימניקים והכלכלית",
    leaders: "יועז הנדל וירון זליכה",
    color: "#a36f42",
    bloc: "other",
    summary: "רשימה משותפת בראשות הנדל וזליכה",
    tldr: "הרשימה ממצבת את עצמה כחלופה שאינה מחויבת מראש לאחד משני הגושים. כדאי לברר את תנאי השותפות ואת ההסכמות בין מרכיביה.",
    context: "שתי מסגרות חברו לרשימה אחת. אתר המילואימניקים מייצג אחד מן השותפים, ולא בהכרח מצע משותף מלא.",
    manifestoSummary: "באתר המילואימניקים מוצגים עקרונות שירות ומשילות. יש לבדוק מה הוסכם עם השותף הכלכלי לפני שמייחסים לרשימה מצע משותף.",
    program: { label: "עקרונות המילואימניקים, אחד משותפי הרשימה", url: "https://www.themiluimnikim.org.il/platform/" },
    highlights: [
      { topic: "שותפות עם מפלגות ערביות", text: "במצע המילואימניקים, אחד משותפי הרשימה, נכתב על ממשלה שאינה מסתמכת על מפלגות לא ציוניות, כולל ערביות. יש לבדוק מה הוסכם עם השותף הכלכלי.", url: "https://www.themiluimnikim.org.il/platform/" },
      { topic: "משילות ושירות ציבורי", text: "עקרונות המילואימניקים מציעים שירות לכל ושינויים מבניים במערכות המדינה; עמדת הרשימה המשותפת צריכה אימות.", url: "https://www.themiluimnikim.org.il/platform/" },
    ],
    videos: [
      { name: "יועז הנדל", title: "ראיון", id: "s7ROzA1HYSY", date: "2026" },
      { name: "ירון זליכה", title: "הרצאה על כלכלה", id: "gK0Wltq9rMs", date: "18.12.2025" },
    ],
    featuredVideos: [
      { name: "יועז הנדל", title: "על תנאי שותפות בקואליציה", id: "UaTfJGFiJ8c", date: "11.9.2026", duration: "4:55" },
      { name: "ירון זליכה", title: "על הגישה הכלכלית שלו ויישום שינוי", id: "nbP4sT1goAo", date: "14.9.2026", duration: "2:48" },
    ],
    people: [
      { name: "יועז הנדל", x: "https://x.com/YoazHendel1" },
      { name: "ירון זליכה", x: "https://x.com/PZelekha" },
    ],
    check: ["מה המצע המשותף של שני המרכיבים?", "אילו צעדים כלכליים ישימים בטווח הקרוב?", "מה תנאי השותפות עם כל גוש?"],
  },
];

export const coreParties = parties.filter((party) => party.bloc === "change");
export const priorityOptions = [
  "שותפות עם מפלגות ערביות",
  "משילות ושירות ציבורי",
  "דמוקרטיה וחוקה",
  "כלכלה ויוקר המחיה",
  "ביטחון ומדיניות חוץ",
  "דת ומדינה",
  "בריאות הנפש",
  "יושרה ואמון",
  "יכולת להרכיב ממשלה",
];

export type DecisionState = {
  orientation: string;
  priorities: string[];
  customTags: string[];
  arabCoalition: string;
  netanyahuCoalition: string;
  partyStatus: Record<string, string>;
  issueAssessments: Record<string, Record<string, string>>;
  partyNotes: Record<string, string>;
  generalNotes: string;
  includeLieberman: boolean;
};

export const emptyDecision: DecisionState = {
  orientation: "",
  priorities: [],
  customTags: [],
  arabCoalition: "",
  netanyahuCoalition: "",
  partyStatus: {},
  issueAssessments: {},
  partyNotes: {},
  generalNotes: "",
  includeLieberman: true,
};

export const orientationChoices = [
  { value: "change", title: "מעדיף/ה ממשלה בלי נתניהו", subtitle: "מתחילים ברשימות גוש השינוי" },
  { value: "continue", title: "מעדיף/ה ממשלה בראשות נתניהו", subtitle: "מתחילים ברשימות התומכות בהמשך כהונתו" },
  { value: "explore", title: "לראות את כל הרשימות", subtitle: "לא יודע/ת, או שנתניהו אינו הקריטריון שלי" },
];

export const coalitionChoices = [
  { value: "yes", label: "חשוב לי שתהיה פתיחות לשותפות עם מפלגות ערביות" },
  { value: "depends", label: "תלוי במפלגה, בהסכם ובנסיבות" },
  { value: "no", label: "חשוב לי שלא תהיה שותפות כזו" },
  { value: "undecided", label: "אני עוד בודק את העמדה שלי" },
];

export const netanyahuChoices = [
  { value: "must_no", label: "קו אדום: לא לשבת בממשלה בראשות נתניהו" },
  { value: "prefer_no", label: "אני מעדיף שלא, אבל רוצה לבחון נסיבות" },
  { value: "open", label: "אינני פוסל זאת מראש" },
  { value: "undecided", label: "עוד לא החלטתי" },
];
