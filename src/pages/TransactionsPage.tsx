import { useMemo, useState } from "react";
import { formatDateTime, formatMoney } from "../format";
import { useCabinet } from "../state";
import type { TxType } from "../types";

const TYPES: { key: TxType | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "purchase", label: "Покупки" },
  { key: "topup", label: "Пополнения" },
  { key: "reserve", label: "Резерв" },
  { key: "refund", label: "Возвраты" },
  { key: "staff", label: "Сотрудники" },
];

const TX: Record<TxType, string> = {
  purchase: "Покупка",
  topup: "Пополнение",
  reserve: "Резерв",
  refund: "Возврат",
  staff: "Сотрудник",
};

export function TransactionsPage() {
  const { txs, balance, setScreen } = useCabinet();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TxType | "all">("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return txs.filter((row) => {
      if (type !== "all" && row.type !== type) return false;
      if (needle && ![row.id, row.note, row.actor].join(" ").toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [query, txs, type]);

  const inSum = txs.filter((row) => row.amount > 0).reduce((sum, row) => sum + row.amount, 0);
  const outSum = txs.filter((row) => row.amount < 0).reduce((sum, row) => sum + row.amount, 0);

  function exportCsv() {
    const body = ["id,date,type,amount,note,actor"]
      .concat(
        rows.map(
          (row) =>
            `${row.id},${row.date},${row.type},${row.amount},"${row.note.replaceAll('"', '""')}",${row.actor}`,
        ),
      )
      .join("\n");
    const blob = new Blob([body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="page-hero">
        <div className="page-hero-row">
          <div>
            <div className="page-kicker">Деньги</div>
            <h1>Движения по кабинету</h1>
            <p>Покупки, пополнения, резерв и возвраты — одна лента на весь агентский счёт.</p>
          </div>
          <button className="btn" type="button" onClick={exportCsv}>
            Скачать CSV
          </button>
        </div>
      </header>

      <div className="stat-pills">
        <span className="stat-pill">
          Сейчас на счёте <b>{formatMoney(balance)}</b>
        </span>
        <span className="stat-pill">
          Пришло <b className="ok">{formatMoney(inSum)}</b>
        </span>
        <span className="stat-pill">
          Ушло <b className="bad">{formatMoney(outSum)}</b>
        </span>
      </div>

      <section className="panel">
        <div className="toolbar">
          <input
            className="field search"
            placeholder="Номер, комментарий, кто…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="pills">
            {TYPES.map((item) => (
              <button
                key={item.key}
                type="button"
                className={type === item.key ? "pill is-on" : "pill"}
                onClick={() => setType(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="empty-state">
            <h3>Пусто по фильтру</h3>
            <p>Сбросьте поиск или пополните баланс — движение появится здесь.</p>
            <div className="quick">
              <button className="btn btn-primary" type="button" onClick={() => setScreen("topup")}>
                Пополнить
              </button>
            </div>
          </div>
        ) : (
          <div className="feed">
            {rows.map((row) => (
              <div key={row.id} className="feed-row" style={{ cursor: "default" }}>
                <div className="feed-main">
                  <strong>{row.note}</strong>
                  <span>
                    {row.id} · {TX[row.type]} · {row.actor} · {formatDateTime(row.date)}
                  </span>
                </div>
                <div className="feed-side">
                  <span className={row.amount < 0 ? "mono bad" : "mono ok"}>{formatMoney(row.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
