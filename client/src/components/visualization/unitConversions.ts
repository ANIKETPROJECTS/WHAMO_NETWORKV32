import type { DisplayUnit } from "./DisplayUnitToggle";

export type SourceUnits = "english" | "metric";

const FEET_TO_METERS = 0.3048;
const CFS_TO_CMS = 0.028316846592;
const PSI_TO_KPA = 6.894757293168;

export function displayUnitFromSource(source: SourceUnits): DisplayUnit {
  return source === "metric" ? "SI" : "FPS";
}

export function convertElevation(value: number, source: SourceUnits, target: DisplayUnit): number {
  if (source === "english" && target === "SI") return value * FEET_TO_METERS;
  if (source === "metric" && target === "FPS") return value / FEET_TO_METERS;
  return value;
}

export function convertDischarge(value: number, source: SourceUnits, target: DisplayUnit): number {
  if (source === "english" && target === "SI") return value * CFS_TO_CMS;
  if (source === "metric" && target === "FPS") return value / CFS_TO_CMS;
  return value;
}

export function convertHistoryMeasurement(
  value: number,
  sourceUnit: string,
  target: DisplayUnit,
): { value: number; unit: string } {
  const normalized = sourceUnit.trim().toUpperCase();
  switch (normalized) {
    case "FT":
    case "FEET":
      return target === "SI"
        ? { value: value * FEET_TO_METERS, unit: "m" }
        : { value, unit: "ft" };
    case "M":
    case "METER":
    case "METERS":
    case "METRE":
    case "METRES":
      return target === "FPS"
        ? { value: value / FEET_TO_METERS, unit: "ft" }
        : { value, unit: "m" };
    case "CFS":
      return target === "SI"
        ? { value: value * CFS_TO_CMS, unit: "m³/s" }
        : { value, unit: "cfs" };
    case "CMS":
      return target === "FPS"
        ? { value: value / CFS_TO_CMS, unit: "cfs" }
        : { value, unit: "m³/s" };
    case "FPS":
      return target === "SI"
        ? { value: value * FEET_TO_METERS, unit: "m/s" }
        : { value, unit: "ft/s" };
    case "MPS":
      return target === "FPS"
        ? { value: value / FEET_TO_METERS, unit: "ft/s" }
        : { value, unit: "m/s" };
    case "PSI":
      return target === "SI"
        ? { value: value * PSI_TO_KPA, unit: "kPa" }
        : { value, unit: "psi" };
    case "KPA":
      return target === "FPS"
        ? { value: value / PSI_TO_KPA, unit: "psi" }
        : { value, unit: "kPa" };
    default:
      return { value, unit: sourceUnit };
  }
}
