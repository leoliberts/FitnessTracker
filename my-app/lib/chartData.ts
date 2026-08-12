import type { WeightRow } from "@/db/weights";

export type ChartResult = {
  data: { value?: number; label: string }[];
  yAxisOffset: number;
  maxValue: number;
  stepValue: number;
};

export function toChartData(rows: WeightRow[], days: number): ChartResult {
  const byDay = new Map(rows.map(r => [r.day, r.kg]));
  const out = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    out.push({
      value: byDay.get(day),
      label: i % Math.ceil(days / 6) === 0 ? day.slice(5) : "",
    });
  }

  // ---- everything below is new ----

  const values = out.map(p => p.value).filter((v): v is number => v != null);

  if (values.length === 0) {
    return { data: out, yAxisOffset: 70, maxValue: 15, stepValue: 3 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const mid = (min + max) / 2;

  const MIN_SPAN = 7;
  let lo = min - (max - min) * 0.15;
  let hi = max + (max - min) * 0.15;

  if (hi - lo < MIN_SPAN) {
    lo = mid - MIN_SPAN / 2;
    hi = mid + MIN_SPAN / 2;
  }

  lo = Math.floor(lo);
  hi = Math.ceil(hi);

  return {
    data: out,
    yAxisOffset: lo,
    maxValue: hi - lo,
    stepValue: (hi - lo) / 5,
  };
}