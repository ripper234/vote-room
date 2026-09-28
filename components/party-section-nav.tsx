"use client";

import { useEffect, useRef, useState } from "react";

export type PartySection = { id: string; label: string };

export function PartySectionNav({ partyName, sections }: { partyName: string; sections: PartySection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let frame = 0;
    function updateActive() {
      frame = 0;
      const desktop = window.matchMedia("(min-width: 851px)").matches;
      let current = sections[0]?.id ?? "";
      for (const section of sections) {
        if (desktop && section.id === "my-impression") continue;
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 95) current = section.id;
      }
      setActive(current);
    }
    function schedule() { if (!frame) frame = window.requestAnimationFrame(updateActive); }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  const activeLabel = sections.find((section) => section.id === active)?.label ?? sections[0]?.label;

  return (
    <nav className="party-section-nav" aria-label="ניווט בדף הרשימה">
      <span className="party-section-name" title={partyName}>{partyName}</span>
      <details ref={menu} className="party-section-menu">
        <summary aria-label={`איפה אני בדף: ${activeLabel}. פתיחת רשימת האזורים`}>כאן: {activeLabel} <span aria-hidden="true">▾</span></summary>
        <div className="party-section-options">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              onClick={() => { setActive(section.id); menu.current?.removeAttribute("open"); }}
            >{section.label}</a>
          ))}
        </div>
      </details>
      <a className="party-section-back" href="/map">למפה ←</a>
    </nav>
  );
}
