export type Party = {
  slug: string;
  name: string;
  leaders: string;
  color: string;
  bloc: "change" | "continue" | "other";
  summary: string;
  tldr: string;
  context: string;
  manifestoSummary: string;
  program?: { label: string; url: string };
  extraSources?: { label: string; url: string }[];
  highlights: { topic: string; text: string; url: string }[];
  videos: { name: string; title: string; id: string; date: string }[];
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
    program: { label: "האתר הרשמי ורשימת המועמדים", url: "https://www.likud.org.il/" },
    highlights: [],
    videos: [{ name: "בנימין נתניהו", title: "דברים בערוץ הרשמי", id: "J5-qzqsRwxY", date: "30.6.2026" }],
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
    videos: [{ name: "איתמר בן גביר", title: "מסר בחירות של המפלגה", id: "3_iRZGlZAvw", date: "16.8.2026" }],
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
    videos: [{ name: "אריה דרעי", title: "דברים לציבור", id: "ZwrpwyuvNGA", date: "26.8.2026" }],
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
    manifestoSummary: "לא איתרנו כאן מצע מפורט ועדכני של הרשימה לבחירות 2026. מקור המועמדים והראיון זמינים להמשך בדיקה.",
    program: { label: "הרשימה שהוגשה לכנסת", url: "https://www.knesset.tv/main-articles/61384/94592/" },
    highlights: [],
    videos: [{ name: "מנסור עבאס", title: "ראיון בכנס INSS", id: "zrdkNa3s0f0", date: "27.7.2026" }],
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
    manifestoSummary: "עמוד העקרונות של חד״ש עוסק בשוויון, שלום, זכויות עובדים ודמוקרטיה. אין לייחס אותו במלואו לכל הרשימה המשותפת בלי מסמך משותף עדכני.",
    program: { label: "עקרונות חד״ש", url: "https://hadash.org.il/" },
    extraSources: [{ label: "מועמדי חד״ש ברשימה", url: "https://hadash.org.il/list" }],
    highlights: [
      { topic: "דמוקרטיה וחוקה", text: "עקרונות חד״ש מדגישים שוויון אזרחי ודמוקרטיה; יש לבדוק מה אומץ בידי הרשימה כולה.", url: "https://hadash.org.il/" },
    ],
    videos: [{ name: "יוסף ג׳בארין", title: "ראיון בערוץ חד״ש", id: "AMnEOCd71Uo", date: "2026" }],
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
    manifestoSummary: "האתר הרשמי מציג את הרשימה ואת מסריה. יש לבדוק אם פורסם מצע בחירות מפורט ועדכני בנושאים שמעניינים אותך.",
    program: { label: "אתר כחול לבן", url: "https://kachollavan.org.il/" },
    highlights: [],
    videos: [{ name: "בני גנץ", title: "שיחה בפודקאסט", id: "ib2581vhsn8", date: "2026" }],
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
    program: { label: "אתר המילואימניקים", url: "https://www.themiluimnikim.org.il/" },
    highlights: [],
    videos: [
      { name: "יועז הנדל", title: "ראיון", id: "s7ROzA1HYSY", date: "2026" },
      { name: "ירון זליכה", title: "הרצאה על כלכלה", id: "gK0Wltq9rMs", date: "2026" },
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
  { value: "explore", title: "לא יודע/ת, או שזה לא הקריטריון שלי", subtitle: "רואים אפשרויות מכל המסלולים" },
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
