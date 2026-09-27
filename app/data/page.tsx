import type { Metadata } from "next";
import DataControls from "./data-controls";

export const metadata: Metadata = {
  title: "הנתונים שלי | חדר בחירה",
  description: "הורדה ומחיקה של מפת הבחירה והיסטוריית השינויים שלך.",
};

export default function DataPage() {
  return <DataControls />;
}
