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
  return { title: party ? `${party.name} | חדר בחירה` : "חדר בחירה" };
}

export default async function PartyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const party = parties.find((item) => item.slug === slug);
  if (!party) notFound();
  return <PartyDetail key={party.slug} party={party} />;
}
