export interface CrossSectionShapeDefinition {
  label: string;
  aFactor: number;
  pFactor: number;
}

/**
 * Shape coefficients shared by surge-tank SHAPE pairs and conduit equivalent
 * diameter calculations. Values match the WHAMO Designer's existing shapes.
 */
export const CROSS_SECTION_SHAPES: Record<string, CrossSectionShapeDefinition> = {
  circular:           { label: 'Circular',            aFactor: 0.785, pFactor: 3.14 },
  horseshoe:          { label: 'Horse Shoe',          aFactor: 0.829, pFactor: 3.27 },
  modified_horseshoe: { label: 'Modified Horse Shoe', aFactor: 0.893, pFactor: 3.58 },
  dshaped:            { label: 'D-Shaped',            aFactor: 0.813, pFactor: 3.21 },
  custom:             { label: 'Custom',              aFactor: 0,     pFactor: 0 },
};

export const CONDUIT_SHAPE_OPTIONS = Object.entries(CROSS_SECTION_SHAPES)
  .filter(([key]) => key !== 'custom')
  .map(([value, shape]) => ({ value, label: shape.label }));

export function calculateEquivalentDiameter(
  shapeType: string | undefined,
  diameter: number,
): number | undefined {
  if (!Number.isFinite(diameter) || diameter <= 0) return undefined;
  const circularFactor = CROSS_SECTION_SHAPES.circular.aFactor;
  const shapeFactor = CROSS_SECTION_SHAPES[shapeType || 'circular']?.aFactor || circularFactor;
  return parseFloat((Math.sqrt(shapeFactor / circularFactor) * diameter).toFixed(6));
}

export function calculateCrossSectionArea(shapeType: string | undefined, diameter: number): number | undefined {
  const factor = shapeType ? CROSS_SECTION_SHAPES[shapeType]?.aFactor : undefined;
  if (!factor || !Number.isFinite(diameter) || diameter <= 0) return undefined;
  return parseFloat((factor * diameter * diameter).toFixed(6));
}

/**
 * An INP file stores conduit VARIABLE D/A values but not the UI-only shape
 * name. Restore a named shape when the ratio clearly matches one of the
 * known coefficients; otherwise preserve the safe custom/manual mode.
 */
export function inferCrossSectionShape(
  diameter: number | undefined,
  area: number | undefined,
  tolerance = 0.015,
): string {
  if (!diameter || !area || diameter <= 0 || area <= 0) return 'custom';
  const ratio = area / (diameter * diameter);
  const match = Object.entries(CROSS_SECTION_SHAPES)
    .filter(([key]) => key !== 'custom')
    .find(([, shape]) => Math.abs(ratio - shape.aFactor) <= tolerance);
  return match?.[0] ?? 'custom';
}