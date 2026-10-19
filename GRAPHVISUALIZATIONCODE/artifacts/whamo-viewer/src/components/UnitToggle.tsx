export type DisplayUnits = "english" | "metric";

export default function UnitToggle({
  units,
  onChange,
  className = "",
}: {
  units: DisplayUnits;
  onChange: (units: DisplayUnits) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-[10px] font-medium text-gray-400">Display units</span>
      <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 p-0.5">
        {([
          ["english", "FPS"],
          ["metric", "SI"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={units === value}
            onClick={() => onChange(value)}
            className={`rounded px-2 py-1 text-[10px] font-semibold transition-colors ${
              units === value
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
