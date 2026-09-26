"use client";

import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useMemo, useState } from "react";

import { portOptions, portRepresentatives } from "@/data/company";

export function PortPlanner() {
  const [activePortId, setActivePortId] = useState(portOptions[0].id);
  const activePort = portOptions.find((port) => port.id === activePortId) ?? portOptions[0];
  const representative = useMemo(
    () => portRepresentatives.find((person) => person.id === activePort.representativeId)!,
    [activePort.representativeId],
  );

  return (
    <div className="port-planner">
      <div className="port-choice-grid" role="list" aria-label="Cambodia port options">
        {portOptions.map((port) => {
          const active = port.id === activePort.id;
          return (
            <button
              type="button"
              key={port.id}
              className={`port-choice ${active ? "port-choice--active" : ""}`}
              aria-pressed={active}
              onClick={() => setActivePortId(port.id)}
            >
              <span>{port.number} / {port.category}</span>
              <strong>{port.name}</strong>
              <small>View local contact <ArrowUpRight size={16} /></small>
            </button>
          );
        })}
      </div>

      <aside className="port-contact" aria-live="polite">
        <div className="port-contact__marker"><MapPin size={22} /></div>
        <div>
          <p className="eyebrow">Your contact for {activePort.name}</p>
          <h3>{representative.name}</h3>
          <p className="port-contact__role">{representative.role} · {representative.languages}</p>
          <div className="port-contact__links">
            {representative.phones.map((phone) => (
              <a key={phone} href={`tel:${phone.replaceAll(" ", "")}`}><Phone size={17} />{phone}</a>
            ))}
            <a href={`mailto:${representative.email}`}><Mail size={17} />{representative.email}</a>
          </div>
        </div>
        <a className="button-primary" href={`/contact?port=${encodeURIComponent(activePort.name)}#pda-form`}>
          Request PDA <ArrowUpRight size={17} />
        </a>
      </aside>
    </div>
  );
}
