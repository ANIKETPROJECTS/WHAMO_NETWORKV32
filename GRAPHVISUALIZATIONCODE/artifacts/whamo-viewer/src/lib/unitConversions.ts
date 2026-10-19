import type { SimulationNode } from "@/lib/parser";
import type { DisplayUnits } from "@/components/UnitToggle";

const FT_TO_M = 0.3048;
const CFS_TO_CMS = 0.028316846592;

export function convertSummaryNode(
  node: SimulationNode,
  sourceUnits: DisplayUnits,
  targetUnits: DisplayUnits,
): SimulationNode {
  if (sourceUnits === targetUnits) return node;
  const elevationFactor = sourceUnits === "english" ? FT_TO_M : 1 / FT_TO_M;
  const dischargeFactor = sourceUnits === "english" ? CFS_TO_CMS : 1 / CFS_TO_CMS;

  return {
    ...node,
    pipeElevation:
      node.pipeElevation == null ? null : node.pipeElevation * elevationFactor,
    maxEnergyElev: node.maxEnergyElev * elevationFactor,
    minEnergyElev: node.minEnergyElev * elevationFactor,
    maxDischarge: node.maxDischarge * dischargeFactor,
    minDischarge: node.minDischarge * dischargeFactor,
  };
}

type HistoryUnitConversion = {
  englishUnit: string;
  metricUnit: string;
  factor: number;
};

const HISTORY_UNIT_CONVERSIONS: Record<string, HistoryUnitConversion> = {
  ft: { englishUnit: "ft", metricUnit: "m", factor: FT_TO_M },
  feet: { englishUnit: "ft", metricUnit: "m", factor: FT_TO_M },
  foot: { englishUnit: "ft", metricUnit: "m", factor: FT_TO_M },
  m: { englishUnit: "ft", metricUnit: "m", factor: FT_TO_M },
  meter: { englishUnit: "ft", metricUnit: "m", factor: FT_TO_M },
  meters: { englishUnit: "ft", metricUnit: "m", factor: FT_TO_M },
  metre: { englishUnit: "ft", metricUnit: "m", factor: FT_TO_M },
  metres: { englishUnit: "ft", metricUnit: "m", factor: FT_TO_M },
  cfs: { englishUnit: "cfs", metricUnit: "cms", factor: CFS_TO_CMS },
  cms: { englishUnit: "cfs", metricUnit: "cms", factor: CFS_TO_CMS },
  "m3/s": { englishUnit: "cfs", metricUnit: "cms", factor: CFS_TO_CMS },
  "m3/sec": { englishUnit: "cfs", metricUnit: "cms", factor: CFS_TO_CMS },
  "m3/second": { englishUnit: "cfs", metricUnit: "cms", factor: CFS_TO_CMS },
  "ft3/s": { englishUnit: "cfs", metricUnit: "cms", factor: CFS_TO_CMS },
  "ft3/sec": { englishUnit: "cfs", metricUnit: "cms", factor: CFS_TO_CMS },
  "ft3/second": { englishUnit: "cfs", metricUnit: "cms", factor: CFS_TO_CMS },
  fps: { englishUnit: "fps", metricUnit: "mps", factor: FT_TO_M },
  "ft/s": { englishUnit: "fps", metricUnit: "mps", factor: FT_TO_M },
  "ft/sec": { englishUnit: "fps", metricUnit: "mps", factor: FT_TO_M },
  "ft/second": { englishUnit: "fps", metricUnit: "mps", factor: FT_TO_M },
  "feet/sec": { englishUnit: "fps", metricUnit: "mps", factor: FT_TO_M },
  mps: { englishUnit: "fps", metricUnit: "mps", factor: FT_TO_M },
  "m/s": { englishUnit: "fps", metricUnit: "mps", factor: FT_TO_M },
  "m/sec": { englishUnit: "fps", metricUnit: "mps", factor: FT_TO_M },
  "m/second": { englishUnit: "fps", metricUnit: "mps", factor: FT_TO_M },
  psi: { englishUnit: "psi", metricUnit: "kPa", factor: 6.894757293168 },
  kpa: { englishUnit: "psi", metricUnit: "kPa", factor: 6.894757293168 },
  in: { englishUnit: "in", metricUnit: "mm", factor: 25.4 },
  inch: { englishUnit: "in", metricUnit: "mm", factor: 25.4 },
  inches: { englishUnit: "in", metricUnit: "mm", factor: 25.4 },
  mm: { englishUnit: "in", metricUnit: "mm", factor: 25.4 },
};

function normalizeHistoryUnit(unit: string): string {
  return unit.trim().toLowerCase().replace(/³/g, "3").replace(/\s+/g, "");
}

export function getHistoryDisplayUnit(unit: string, targetUnits: DisplayUnits): string {
  const conversion = HISTORY_UNIT_CONVERSIONS[normalizeHistoryUnit(unit)];
  if (!conversion) return unit;
  return targetUnits === "english" ? conversion.englishUnit : conversion.metricUnit;
}

export function convertHistoryValue(
  value: number,
  unit: string,
  sourceUnits: DisplayUnits,
  targetUnits: DisplayUnits,
): number {
  if (sourceUnits === targetUnits) return value;
  const conversion = HISTORY_UNIT_CONVERSIONS[normalizeHistoryUnit(unit)];
  if (!conversion) return value;
  return sourceUnits === "english"
    ? value * conversion.factor
    : value / conversion.factor;
}
