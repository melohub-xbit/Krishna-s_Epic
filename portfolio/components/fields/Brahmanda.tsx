"use client";
import KolamField from "@/components/fields/KolamField";

/**
 * The background field.
 *
 * Previously: NebulaField + StarField + RingField -- three competing depth layers
 * that read as objects in front of the viewer rather than as a backdrop.
 * Now: a single flat kolam+screentone plane parked far behind the chakra.
 */
export default function Brahmanda() {
  return <KolamField />;
}
