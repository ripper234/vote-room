"use client";

import { clearDeviceDecisionKeys } from "@/lib/decision-key";

export default function SignOutLink({ href }: { href: string }) {
  return <a href={href} target="_top" onClick={clearDeviceDecisionKeys}>התנתקות</a>;
}
