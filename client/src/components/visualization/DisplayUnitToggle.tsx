export type DisplayUnit = "SI" | "FPS";

interface DisplayUnitToggleProps {
  value: DisplayUnit;
  onChange: (value: DisplayUnit) => void;
}

export default function DisplayUnitToggle({ value, onChange }: DisplayUnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Display units"
      className="inline-flex rounded-md overflow-hidden border border-gray-200 text-xs font-bold"
    >
      {(["FPS", "SI"] as const).map((unit) => (
        <button
          key={unit}
          type="button"
          aria-pressed={value === unit}
          onClick={() => onChange(unit)}
          className={`px-3 py-1 transition-colors ${
            value === unit
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {unit}
        </button>
      ))}
    </div>
  );
}
