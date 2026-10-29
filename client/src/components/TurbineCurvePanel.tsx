import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronRight, Zap, BarChart2, Info } from 'lucide-react';
import {
  TURBINE_CURVE_LIBRARY,
  getRecommendedNs,
  getTurbineCurvePointAtGate,
  generateEvenlySpacedGatePercentages,
  generateEvenlySpacedHeadValues,
  generateTcharFromCurves,
  MAX_GATE_PERCENT,
  MAX_GATE_VALUE_COUNT,
  MAX_HEAD_STEP_COUNT,
  MIN_GATE_PERCENT,
  MIN_GATE_VALUE_COUNT,
  MIN_HEAD_STEP_COUNT,
  type TurbineNsGroup,
} from '@/lib/turbine-curves';
import type { TcharType } from '@/lib/store';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const GATE_COLORS = ['#1a73e8','#34a853','#fbbc04','#ea4335','#9c27b0','#ff5722','#00bcd4','#607d8b','#795548'];
const formatCurveInputValue = (value: number) => String(Number(value.toFixed(3)));

interface Props {
  tType: number;
  activeTc: TcharType;
  updateTcharData: (tType: number, data: TcharType) => void;
  designHead?: number;
}

export function TurbineCurvePanel({ tType, activeTc, updateTcharData, designHead: initialDesignHead }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedNsUS, setSelectedNsUS] = useState<number>(30);
  const [designHead, setDesignHead] = useState<string>(String(initialDesignHead ?? 50));
  const [designFlow, setDesignFlow] = useState<string>('100');
  const [designEff, setDesignEff] = useState<string>('0.90');
  const [numHeadSteps, setNumHeadSteps] = useState<string>('5');
  const [headStepValues, setHeadStepValues] = useState<string[]>(() =>
    generateEvenlySpacedHeadValues(
      TURBINE_CURVE_LIBRARY[0],
      Number(initialDesignHead) > 0 ? Number(initialDesignHead) : 50,
      5,
    ).map(formatCurveInputValue)
  );
  const [headStepsManuallyEdited, setHeadStepsManuallyEdited] = useState(false);
  const [gateCount, setGateCount] = useState<string>('5');
  const [gatePercentInputs, setGatePercentInputs] = useState<string[]>(['20', '40', '60', '80', '100']);
  const [previewGate, setPreviewGate] = useState<number>(100);
  const [showChart, setShowChart] = useState(true);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [generated, setGenerated] = useState<TcharType | null>(null);

  const nsGroup: TurbineNsGroup = useMemo(
    () => TURBINE_CURVE_LIBRARY.find(g => g.nsUS === selectedNsUS) ?? TURBINE_CURVE_LIBRARY[0],
    [selectedNsUS]
  );

  const recommendation = useMemo(
    () => getRecommendedNs(parseFloat(designHead) || 50),
    [designHead]
  );

  const headStepCountValue = Number(numHeadSteps);
  const headStepCountIsValid =
    /^\d+$/.test(numHeadSteps) &&
    Number.isInteger(headStepCountValue) &&
    headStepCountValue >= MIN_HEAD_STEP_COUNT &&
    headStepCountValue <= MAX_HEAD_STEP_COUNT;
  const parsedHeadStepValues = headStepValues.map(value =>
    value.trim() === '' ? Number.NaN : Number(value)
  );
  const roundedHeadStepValues = parsedHeadStepValues.map(value => Math.round(value * 1000) / 1000);
  const headStepValuesAreValid =
    headStepCountIsValid &&
    headStepValues.length === headStepCountValue &&
    parsedHeadStepValues.every(value => Number.isFinite(value) && value > 0) &&
    new Set(roundedHeadStepValues).size === headStepValues.length;

  const gateCountValue = Number(gateCount);
  const gateCountIsValid =
    /^\d+$/.test(gateCount) &&
    Number.isInteger(gateCountValue) &&
    gateCountValue >= MIN_GATE_VALUE_COUNT &&
    gateCountValue <= MAX_GATE_VALUE_COUNT;
  const parsedGatePercentInputs = gatePercentInputs.map(value =>
    value.trim() === '' ? Number.NaN : Number(value)
  );
  const availableGates = Array.from(new Set(parsedGatePercentInputs
    .filter(value => Number.isFinite(value) && value >= MIN_GATE_PERCENT && value <= MAX_GATE_PERCENT)))
    .sort((a, b) => a - b);
  const gatePercentagesAreValid =
    gateCountIsValid &&
    gatePercentInputs.length === gateCountValue &&
    parsedGatePercentInputs.every(value =>
      Number.isFinite(value) && value >= MIN_GATE_PERCENT && value <= MAX_GATE_PERCENT
    ) &&
    new Set(parsedGatePercentInputs).size === gatePercentInputs.length;
  const gateSettingsAreValid = gateCountIsValid && gatePercentagesAreValid;
  const curveSettingsAreValid = gateSettingsAreValid && headStepValuesAreValid;
  const activePreviewGate = availableGates.includes(previewGate)
    ? previewGate
    : availableGates[0] ?? MAX_GATE_PERCENT;

  const formatGatePercent = (value: number) => String(Number(value.toFixed(2)));

  const refreshAutomaticHeadValues = (
    count: number,
    targetDesignHead = Number(designHead) || 50,
    targetGroup = nsGroup,
  ) => {
    const values = generateEvenlySpacedHeadValues(targetGroup, targetDesignHead, count);
    if (values.length > 0) {
      setHeadStepValues(values.map(formatCurveInputValue));
      setHeadStepsManuallyEdited(false);
    }
  };

  const handleHeadStepCountChange = (value: string) => {
    setNumHeadSteps(value);
    if (!/^\d+$/.test(value)) return;
    refreshAutomaticHeadValues(Number(value));
  };

  const handleHeadStepValueChange = (index: number, value: string) => {
    setHeadStepValues(previous => previous.map((item, itemIndex) =>
      itemIndex === index ? value : item
    ));
    setHeadStepsManuallyEdited(true);
  };

  const handleDesignHeadChange = (value: string) => {
    setDesignHead(value);
    if (!headStepsManuallyEdited && headStepCountIsValid) {
      refreshAutomaticHeadValues(headStepCountValue, Number(value) || 50);
    }
  };

  const handleNsChange = (value: string) => {
    const nextNs = Number(value);
    setSelectedNsUS(nextNs);
    const nextGroup = TURBINE_CURVE_LIBRARY.find(group => group.nsUS === nextNs) ?? TURBINE_CURVE_LIBRARY[0];
    if (!headStepsManuallyEdited && headStepCountIsValid) {
      refreshAutomaticHeadValues(headStepCountValue, Number(designHead) || 50, nextGroup);
    }
  };

  const handleGateCountChange = (value: string) => {
    setGateCount(value);
    if (!/^\d+$/.test(value)) return;
    const count = Number(value);
    const values = generateEvenlySpacedGatePercentages(count);
    if (values.length > 0) {
      setGatePercentInputs(values.map(formatGatePercent));
      setPreviewGate(values[values.length - 1]);
    }
  };

  const handleGatePercentChange = (index: number, value: string) => {
    setGatePercentInputs(previous => previous.map((item, itemIndex) =>
      itemIndex === index ? value : item
    ));
  };

  const previewGateData = useMemo(() => {
    const heads = Array.from(new Set(nsGroup.gates.flatMap(gate =>
      gate.points.map(point => Math.round(point.head))
    ))).sort((a, b) => a - b);
    return heads.flatMap(head => {
      const point = getTurbineCurvePointAtGate(nsGroup, activePreviewGate, head);
      if (!point) return [];
      return [{
        head,
        q: parseFloat(point.q.toFixed(2)),
        eff: parseFloat(Math.min(Math.max(
          (point.head > 1 && point.q > 1) ? (point.torque / (point.head * point.q)) * (parseFloat(designEff) * 100) : 0,
          0), 0.98).toFixed(4)),
      }];
    });
  }, [nsGroup, activePreviewGate, designEff]);

  const allGatesPreviewData = useMemo(() => {
    const headSet = new Set<number>();
    nsGroup.gates.forEach(g => g.points.forEach(p => headSet.add(Math.round(p.head))));
    const heads = Array.from(headSet).sort((a, b) => a - b);

    return heads.map(h => {
      const row: Record<string, number> = { head: h };
      availableGates.forEach(gatePercent => {
        const point = getTurbineCurvePointAtGate(nsGroup, gatePercent, h);
        if (point) row[`g${gatePercent}`] = parseFloat(point.q.toFixed(2));
      });
      return row;
    });
  }, [nsGroup, gatePercentInputs]);

  const handleGenerate = () => {
    if (!curveSettingsAreValid) return;
    const hasTcharData = activeTc.gate.length > 0 || activeTc.head.length > 0;
    if (hasTcharData && !confirmOverwrite) {
      setConfirmOverwrite(true);
      return;
    }
    doGenerate();
  };

  const doGenerate = () => {
    const result = generateTcharFromCurves({
      nsGroup,
      selectedGatePercents: parsedGatePercentInputs,
      designHead: parseFloat(designHead) || 50,
      designFlow: parseFloat(designFlow) || 100,
      designEfficiency: parseFloat(designEff) || 0.9,
      numHeadSteps: headStepCountValue,
      headValues: parsedHeadStepValues,
    });
    setGenerated(result);
    updateTcharData(tType, result);
    setConfirmOverwrite(false);
  };

  const previewBlock = useMemo(() => {
    const tc = generated ?? activeTc;
    if (tc.gate.length === 0) return null;
    const lines: string[] = [];
    lines.push(`TCHAR TYPE ${tType}`);
    lines.push(` GATE ${tc.gate.join(' ')}`);
    lines.push(` HEAD ${tc.head.join(' ')}`);
    lines.push(' Q');
    tc.qMatrix.forEach(row => lines.push('  ' + row.join(' ')));
    lines.push(' EFFICIENCY');
    tc.effMatrix.forEach(row => lines.push('  ' + row.join(' ')));
    lines.push('FINISH');
    return lines.join('\n');
  }, [generated, activeTc, tType]);

  return (
    <div className="border rounded-md overflow-hidden border-teal-200">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold bg-teal-50 hover:bg-teal-100 transition-colors text-teal-800"
        onClick={() => setOpen(v => !v)}
        type="button"
        data-testid="btn-toggle-curve-panel"
      >
        <span className="flex items-center gap-1.5">
          <BarChart2 className="h-3.5 w-3.5" />
          Performance Curves — TCHAR Generator
        </span>
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>

      {open && (
        <div className="p-3 space-y-4 bg-white">
          <p className="text-[10px] text-muted-foreground italic">
            Select a predefined turbine hill chart library curve to auto-populate TCHAR TYPE {tType}. Existing TCHAR data will be replaced only after confirmation.
          </p>

          {/* Ns group selection */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">Specific Speed (Ns)</Label>
            <Select value={String(selectedNsUS)} onValueChange={handleNsChange}>
              <SelectTrigger className="h-7 text-xs" data-testid="select-ns-group">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TURBINE_CURVE_LIBRARY.map(g => (
                  <SelectItem key={g.nsUS} value={String(g.nsUS)}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-slate-400">Range: {nsGroup.headRange}</p>
          </div>

          {/* Ns recommendation */}
          <div className="flex items-start gap-1.5 bg-blue-50 border border-blue-100 rounded px-2 py-1.5">
            <Info className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-blue-700">
              <span className="font-semibold">Recommendation:</span>{' '}
              Suggested Ns {recommendation.nsUS} (US) — {recommendation.reason}.
            </p>
          </div>

          {/* Design parameters */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">Design Parameters</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px]">Design Head (H)</Label>
                <input
                  className="w-full h-7 border rounded px-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 mt-0.5"
                  value={designHead}
                  onChange={e => handleDesignHeadChange(e.target.value)}
                  data-testid="input-design-head"
                  type="number" step="any" placeholder="e.g. 50"
                />
              </div>
              <div>
                <Label className="text-[10px]">Design Flow (Q)</Label>
                <input
                  className="w-full h-7 border rounded px-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 mt-0.5"
                  value={designFlow}
                  onChange={e => setDesignFlow(e.target.value)}
                  data-testid="input-design-flow"
                  type="number" step="any" placeholder="e.g. 100"
                />
              </div>
              <div>
                <Label className="text-[10px]">Design Efficiency (η)</Label>
                <input
                  className="w-full h-7 border rounded px-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 mt-0.5"
                  value={designEff}
                  onChange={e => setDesignEff(e.target.value)}
                  data-testid="input-design-eff"
                  type="number" step="0.01" min="0" max="1" placeholder="0.90"
                />
              </div>
              <div>
                <Label className="text-[10px]">Number of head steps (3–50)</Label>
                <input
                  className={`w-full h-7 border rounded px-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 mt-0.5 ${
                    !headStepCountIsValid ? 'border-red-500' : ''
                  }`}
                  value={numHeadSteps}
                  onChange={e => handleHeadStepCountChange(e.target.value)}
                  data-testid="input-head-steps"
                  aria-invalid={!headStepCountIsValid}
                  type="number" step="1" min={MIN_HEAD_STEP_COUNT} max={MAX_HEAD_STEP_COUNT} placeholder="5"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[9px] text-slate-500">
                Head values are auto-spaced and editable. Editing Design Head or Ns refreshes them until you edit a value.
              </p>
              {!headStepCountIsValid && (
                <p className="text-[10px] text-red-600" role="alert" data-testid="error-head-step-count">
                  Enter a whole number from {MIN_HEAD_STEP_COUNT} to {MAX_HEAD_STEP_COUNT}.
                </p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {headStepValues.map((value, index) => {
                  const parsedValue = parsedHeadStepValues[index];
                  const invalid = !Number.isFinite(parsedValue) ||
                    parsedValue <= 0 ||
                    roundedHeadStepValues.filter(candidate => candidate === roundedHeadStepValues[index]).length > 1;
                  return (
                    <div key={index}>
                      <Label htmlFor={`input-head-value-${index}`} className="text-[10px]">
                        Head {index + 1}
                      </Label>
                      <input
                        id={`input-head-value-${index}`}
                        type="number"
                        min="0.001"
                        step="0.001"
                        value={value}
                        onChange={event => handleHeadStepValueChange(index, event.target.value)}
                        aria-invalid={invalid}
                        data-testid={`input-head-value-${index + 1}`}
                        className={`mt-0.5 w-full h-7 border rounded px-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 ${
                          invalid ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              {headStepCountIsValid && !headStepValuesAreValid && (
                <p className="text-[10px] text-red-600" role="alert" data-testid="error-head-values">
                  Enter {headStepCountValue} unique positive head values.
                </p>
              )}
            </div>
          </div>

          {/* Gate-opening values */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">Gate Opening Values (%)</Label>
            <div>
              <Label htmlFor="input-gate-count" className="text-[10px]">Number of values (3–50)</Label>
              <input
                id="input-gate-count"
                type="number"
                min={MIN_GATE_VALUE_COUNT}
                max={MAX_GATE_VALUE_COUNT}
                step="1"
                value={gateCount}
                onChange={event => handleGateCountChange(event.target.value)}
                aria-invalid={!gateCountIsValid}
                data-testid="input-gate-count"
                className={`mt-0.5 w-full h-7 border rounded px-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 ${
                  !gateCountIsValid ? 'border-red-500' : ''
                }`}
              />
              <p className="mt-1 text-[9px] text-slate-500">
                Values are spaced evenly from {MIN_GATE_PERCENT}% to {MAX_GATE_PERCENT}%. Edit any value below.
              </p>
              {!gateCountIsValid && (
                <p className="mt-1 text-[10px] text-red-600" role="alert" data-testid="error-gate-count">
                  Enter a whole number from {MIN_GATE_VALUE_COUNT} to {MAX_GATE_VALUE_COUNT}.
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {gatePercentInputs.map((value, index) => {
                const parsedValue = parsedGatePercentInputs[index];
                const invalid = !Number.isFinite(parsedValue) ||
                  parsedValue < MIN_GATE_PERCENT ||
                  parsedValue > MAX_GATE_PERCENT ||
                  parsedGatePercentInputs.filter(candidate => candidate === parsedValue).length > 1;
                return (
                  <div key={index}>
                    <Label htmlFor={`input-gate-percent-${index}`} className="text-[10px]">
                      Value {index + 1} (%)
                    </Label>
                    <input
                      id={`input-gate-percent-${index}`}
                      type="number"
                      min={MIN_GATE_PERCENT}
                      max={MAX_GATE_PERCENT}
                      step="0.01"
                      value={value}
                      onChange={event => handleGatePercentChange(index, event.target.value)}
                      aria-invalid={invalid}
                      data-testid={`input-gate-percent-${index + 1}`}
                      className={`mt-0.5 w-full h-7 border rounded px-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 ${
                        invalid ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            {gateCountIsValid && !gatePercentagesAreValid && (
              <p className="text-[10px] text-red-600" role="alert" data-testid="error-gate-percentages">
                Enter unique percentages from {MIN_GATE_PERCENT}% to {MAX_GATE_PERCENT}%.
              </p>
            )}
          </div>

          {/* Chart preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">Curve Preview</Label>
              <button
                className="text-[10px] text-blue-600 hover:underline"
                onClick={() => setShowChart(v => !v)}
                type="button"
              >
                {showChart ? 'Hide' : 'Show'}
              </button>
            </div>

            {showChart && (
              <>
                <div className="flex items-center gap-2">
                  <Label className="text-[10px]">Gate:</Label>
                  <Select value={String(activePreviewGate)} onValueChange={v => setPreviewGate(Number(v))}>
                    <SelectTrigger className="h-6 text-[10px] w-20" data-testid="select-preview-gate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGates.map(gatePercent => (
                        <SelectItem key={gatePercent} value={String(gatePercent)}>{gatePercent}%</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-[10px] text-slate-400">(single gate) · all gates Q below</span>
                </div>

                {/* Single gate — Head vs Q and Head vs Eff */}
                <div className="rounded border border-slate-100 overflow-hidden bg-slate-50 p-2">
                  <p className="text-[10px] font-medium text-slate-500 mb-1">Gate {activePreviewGate}% — Head vs Q &amp; Efficiency (normalized)</p>
                  <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={previewGateData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="head" tick={{ fontSize: 9 }} label={{ value: 'Head (norm.)', position: 'insideBottom', offset: 0, fontSize: 9 }} />
                      <YAxis yAxisId="q" tick={{ fontSize: 9 }} orientation="left" />
                      <YAxis yAxisId="eff" tick={{ fontSize: 9 }} orientation="right" domain={[0, 1]} />
                      <Tooltip
                        contentStyle={{ fontSize: 10 }}
                        formatter={(v: any, name: string) => [
                          typeof v === 'number' ? v.toFixed(3) : v,
                          name === 'q' ? 'Q (norm.)' : 'Efficiency'
                        ]}
                      />
                      <Legend wrapperStyle={{ fontSize: 9 }} />
                      <Line yAxisId="q" type="monotone" dataKey="q" stroke="#1a73e8" dot={false} name="Q (norm.)" strokeWidth={1.5} />
                      <Line yAxisId="eff" type="monotone" dataKey="eff" stroke="#34a853" dot={false} name="Efficiency" strokeWidth={1.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* All gates — Head vs Q */}
                <div className="rounded border border-slate-100 overflow-hidden bg-slate-50 p-2">
                  <p className="text-[10px] font-medium text-slate-500 mb-1">All gates — Head vs Q (normalized)</p>
                  <ResponsiveContainer width="100%" height={130}>
                    <LineChart data={allGatesPreviewData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="head" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ fontSize: 10 }} />
                      <Legend wrapperStyle={{ fontSize: 9 }} />
                      {availableGates.map((gatePercent, i) => (
                        <Line
                          key={gatePercent}
                          type="monotone"
                          dataKey={`g${gatePercent}`}
                          stroke={GATE_COLORS[i % GATE_COLORS.length]}
                          dot={false}
                          name={`${gatePercent}%`}
                          strokeWidth={1.5}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>

          {/* Generate button */}
          <div className="space-y-2">
            {confirmOverwrite && (
              <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
                <Info className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-amber-800">
                  TCHAR TYPE {tType} already has data. This will <strong>overwrite</strong> existing values. Click again to confirm.
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 text-[10px] flex-1 bg-teal-600 hover:bg-teal-700 text-white gap-1"
                onClick={handleGenerate}
                disabled={!curveSettingsAreValid}
                data-testid="btn-generate-tchar"
                type="button"
              >
                <Zap className="h-3 w-3" />
                {confirmOverwrite ? 'Confirm Overwrite' : 'Generate TCHAR From Curves'}
              </Button>
              {confirmOverwrite && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[10px]"
                  onClick={() => setConfirmOverwrite(false)}
                  type="button"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Generated indicator */}
          {generated && (
            <div className="flex items-start gap-1.5 bg-sky-50 border border-sky-200 rounded px-2 py-1.5">
              <Info className="h-3 w-3 text-sky-500 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-sky-800">
                <strong>Automatically generated:</strong> TCHAR TYPE {tType} values were computed from the <strong>{nsGroup.label}</strong> hill chart library. Edit the tables directly to adjust manually.
              </p>
            </div>
          )}

          {/* Preview block */}
          {previewBlock && (
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">Generated TCHAR Block Preview</Label>
              <pre className="text-[9px] font-mono bg-slate-900 text-green-300 p-2 rounded overflow-x-auto max-h-48 leading-relaxed">
                {previewBlock}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
