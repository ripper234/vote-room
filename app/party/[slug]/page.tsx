import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parties } from "@/lib/parties";
import PartyDetail from "./party-detail";

export function generateStaticParams() {
  return parties.map((party) => ({ slug: party.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const party = parties.find((item) => item.slug === slug);
  if (!party) return { title: "חדר בחירה" };
  const title = `${party.name} | חדר בחירה`;
  const description = party.tldr;
  return {
    title, description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function PartyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const party = parties.find((item) => item.slug === slug);
  if (!party) notFound();
  return <PartyDetail key={party.slug} party={party} />;
}
