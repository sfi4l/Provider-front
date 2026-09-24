import { formatMoney } from "../format";

export type RankRow = {
  id: string;
  name: string;
  category: string;
  amount: number;
  count: number;
};

function issueWord(count: number) {
  const ten = count % 10;
  const hundred = count % 100;
  if (ten === 1 && hundred !== 11) return "выдача";
  if (ten >= 2 && ten <= 4 && (hundred < 12 || hundred > 14)) return "выдачи";
  return "выдач";
}

export function TopBuys({ rows }: { rows: RankRow[] }) {
  const max = rows[0]?.amount || 1;

  if (rows.length === 0) {
    return (
      <div className="empty-state top-buys-empty">
        <p>Пока нет покупок за период</p>
      </div>
    );
  }

  return (
    <ol className="top-buys">
      {rows.map((row) => {
        const width = Math.max((row.amount / max) * 100, 6);
        return (
          <li key={row.id}>
            <div className="top-buys-line">
              <span className="top-buys-name" title={row.name}>
                {row.name}
              </span>
              <b className="mono">{formatMoney(row.amount)}</b>
            </div>
            <div className="top-buys-meta">
              {row.count} {issueWord(row.count)} · {row.category}
            </div>
            <div className="top-buys-track">
              <i style={{ width: `${width}%` }} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
