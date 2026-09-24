import { useMemo, useState } from "react";
import type { Order } from "../types";
import { formatCompact, formatMoney } from "../format";

type Point = { date: string; label: string; amount: number };

const W = 560;
const H = 148;
const PAD = { t: 10, r: 6, b: 24, l: 38 };

export function spendPoints(orders: Order[], days: number): Point[] {
  const today = new Date();
  const points: Point[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const amount = orders
      .filter((row) => row.date.slice(0, 10) === key && row.status !== "refunded")
      .reduce((sum, row) => sum + row.amount, 0);
    points.push({
      date: key,
      label: new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(date),
      amount,
    });
  }
  return points;
}

/** Для длинных периодов — недели, чтобы не было «пустой пилы». */
export function chartBuckets(points: Point[], days: number): Point[] {
  if (days <= 14) return points;
  const size = days <= 45 ? 7 : 10;
  const buckets: Point[] = [];
  for (let i = 0; i < points.length; i += size) {
    const slice = points.slice(i, i + size);
    const amount = slice.reduce((sum, row) => sum + row.amount, 0);
    const last = slice[slice.length - 1];
    buckets.push({
      date: last.date,
      label: slice[0].label,
      amount,
    });
  }
  return buckets;
}

export function SpendChart({ points }: { points: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const geometry = useMemo(() => {
    const max = Math.max(...points.map((p) => p.amount), 1);
    const innerW = W - PAD.l - PAD.r;
    const innerH = H - PAD.t - PAD.b;
    const n = Math.max(points.length, 1);
    const slot = innerW / n;
    const barW = Math.min(18, Math.max(7, slot * 0.55));
    const bars = points.map((point, index) => {
      const h = point.amount > 0 ? Math.max(4, (point.amount / max) * innerH) : 0;
      const x = PAD.l + index * slot + (slot - barW) / 2;
      const y = PAD.t + innerH - h;
      return { ...point, x, y, h, barW };
    });
    const ticks = [0, 0.5, 1].map((ratio) => ({
      value: max * ratio,
      y: PAD.t + innerH - ratio * innerH,
    }));
    const labelEvery = points.length > 12 ? 2 : 1;
    return { bars, ticks, labelEvery, innerH, baselineY: PAD.t + innerH };
  }, [points]);

  const active = hover === null ? null : geometry.bars[hover];

  return (
    <div className="spend-chart-wrap">
      <svg
        className="spend-chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="График трат"
        onMouseLeave={() => setHover(null)}
      >
        {geometry.ticks.map((tick) => (
          <g key={tick.y}>
            <line x1={PAD.l} x2={W - PAD.r} y1={tick.y} y2={tick.y} className="spend-grid" />
            <text x={PAD.l - 8} y={tick.y + 3.5} className="spend-axis" textAnchor="end">
              {formatCompact(tick.value)}
            </text>
          </g>
        ))}
        {geometry.bars.map((bar, index) => (
          <g key={bar.date}>
            {bar.h === 0 ? (
              <circle
                className="spend-empty"
                cx={bar.x + bar.barW / 2}
                cy={geometry.baselineY - 1}
                r={1.5}
              />
            ) : (
              <rect
                className={hover === index ? "spend-bar is-on" : "spend-bar"}
                x={bar.x}
                y={bar.y}
                width={bar.barW}
                height={bar.h}
                rx={3}
                onMouseEnter={() => setHover(index)}
              />
            )}
            <rect
              x={bar.x - 4}
              y={PAD.t}
              width={bar.barW + 8}
              height={geometry.innerH}
              fill="transparent"
              onMouseEnter={() => setHover(index)}
            />
            {index % geometry.labelEvery === 0 && (
              <text x={bar.x + bar.barW / 2} y={H - 8} className="spend-axis" textAnchor="middle">
                {bar.label}
              </text>
            )}
          </g>
        ))}
        {active && active.amount > 0 && (
          <g transform={`translate(${Math.min(active.x + active.barW + 6, W - 120)}, ${Math.max(active.y - 36, 4)})`}>
            <rect width="112" height="34" rx="8" className="spend-tip" />
            <text x="10" y="14" className="spend-tip-label">
              {active.label}
            </text>
            <text x="10" y="27" className="spend-tip-value">
              {formatMoney(active.amount)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
