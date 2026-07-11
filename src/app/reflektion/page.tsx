"use client";
import { useState } from "react";
import { Header } from "@/components/Header";

export default function ReflectionPage() {
  const [understanding, setUnderstanding] = useState(3);
  const [independence, setIndependence] = useState(3);
  const recommendation = understanding <= 2 ? "Upprepa passet med en förenklad variant." : independence <= 2 ? "Fortsätt inom samma tema och ge fler repetitioner." : understanding >= 4 && independence >= 4 ? "Gå vidare till nästa progression." : "Upprepa temat med något högre krav.";
  return <><Header title="Reflektion" /><section className="card formCard"><label>Spelarnas förståelse <strong>{understanding}/5</strong><input type="range" min="1" max="5" value={understanding} onChange={(event) => setUnderstanding(Number(event.target.value))} /></label><label>Självständiga beslut <strong>{independence}/5</strong><input type="range" min="1" max="5" value={independence} onChange={(event) => setIndependence(Number(event.target.value))} /></label><label>Vad fungerade bra?<textarea placeholder="Kort anteckning" /></label></section><section className="section"><h2>Rekommendation</h2><div className="heroCard"><p>{recommendation}</p></div></section></>;
}
