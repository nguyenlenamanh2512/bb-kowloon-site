"use client";

import { ArrowUpRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent } from "react";

import { company, portOptions } from "@/data/company";

export function PdaInquiryForm() {
  const searchParams = useSearchParams();
  const portFromQuery = searchParams.get("port");
  const defaultPort = portFromQuery && portOptions.some((option) => option.name === portFromQuery) ? portFromQuery : "";

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = `PDA inquiry - ${values.get("Port")} - ${values.get("Vessel name")}`;
    const body = [
      `Port: ${values.get("Port")}`,
      `Vessel name: ${values.get("Vessel name")}`,
      `Estimated arrival: ${values.get("Estimated arrival")}`,
      `Gross tonnage (GT): ${values.get("Gross tonnage") || "Not provided"}`,
      `LOA (m): ${values.get("LOA") || "Not provided"}`,
      `Arrival draft (m): ${values.get("Arrival draft") || "Not provided"}`,
      `Operation: ${values.get("Operation")}`,
      `Cargo type and quantity: ${values.get("Cargo")}`,
      `Sender email: ${values.get("Email")}`,
      "",
      `Additional details: ${values.get("Additional details") || "None"}`,
    ].join("\n");
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form id="pda-form" className="pda-form" onSubmit={submitInquiry}>
      <div className="pda-form__heading">
        <p className="eyebrow">Port disbursement estimate</p>
        <h2>Request a port PDA</h2>
        <p>Fields marked * are required.</p>
      </div>

      <div className="pda-form__wide">
        <label htmlFor="pda-port">Port *</label>
        <select id="pda-port" name="Port" required defaultValue={defaultPort}>
          <option value="">Select a port</option>
          {portOptions.map((port) => <option key={port.id} value={port.name}>{port.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="pda-vessel">Vessel name *</label>
        <input id="pda-vessel" name="Vessel name" placeholder="MV Example" required />
      </div>
      <div>
        <label htmlFor="pda-eta">Estimated arrival *</label>
        <input id="pda-eta" name="Estimated arrival" type="date" required />
      </div>
      <div>
        <label htmlFor="pda-gt">Gross tonnage (GT)</label>
        <input id="pda-gt" name="Gross tonnage" inputMode="decimal" placeholder="e.g. 12,500" />
      </div>
      <div>
        <label htmlFor="pda-loa">LOA (m)</label>
        <input id="pda-loa" name="LOA" inputMode="decimal" placeholder="e.g. 145" />
      </div>
      <div>
        <label htmlFor="pda-draft">Arrival draft (m)</label>
        <input id="pda-draft" name="Arrival draft" inputMode="decimal" placeholder="e.g. 7.2" />
      </div>
      <div>
        <label htmlFor="pda-operation">Operation *</label>
        <select id="pda-operation" name="Operation" required>
          <option value="">Select operation</option>
          <option>Load</option>
          <option>Discharge</option>
          <option>Transit / husbandry only</option>
          <option>Other</option>
        </select>
      </div>
      <div className="pda-form__wide">
        <label htmlFor="pda-cargo">Cargo type and quantity *</label>
        <input id="pda-cargo" name="Cargo" placeholder="e.g. 5,000 MT bulk cargo" required />
      </div>
      <div className="pda-form__wide">
        <label htmlFor="pda-email">Your email *</label>
        <input id="pda-email" name="Email" type="email" autoComplete="email" placeholder="name@company.com" required />
      </div>
      <div className="pda-form__wide">
        <label htmlFor="pda-details">Additional details</label>
        <textarea id="pda-details" name="Additional details" rows={5} placeholder="Terminal, expected stay, services required, or other information" />
      </div>
      <div className="pda-form__wide pda-form__submit">
        <button type="submit" className="button-primary">Prepare PDA inquiry <ArrowUpRight size={17} /></button>
        <p>Your details stay in your browser until your email application opens. You can review the draft before sending.</p>
      </div>
    </form>
  );
}
