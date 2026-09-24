import { formatDateTime, formatMoney } from "../format";
import { useCabinet } from "../state";

export function DirectPage() {
  const { orders, copyText, setScreen } = useCabinet();
  const rows = orders.filter((row) => row.kind === "direct");
  const issued = rows.filter((row) => row.status === "issued").length;
  const spent = rows
    .filter((row) => row.status === "issued")
    .reduce((sum, row) => sum + row.amount, 0);

  return (
    <>
      <header className="page-hero">
        <div className="page-hero-row">
          <div>
            <div className="page-kicker">Выдачи</div>
            <h1>Прямые зачисления</h1>
            <p>
              Покупка на сайте — коды сразу в кабинете. Не нужно передавать номер или логин клиента: всё остаётся у
              вас.
            </p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => setScreen("catalog")}>
            Купить прямое
          </button>
        </div>
      </header>

      <div className="stat-pills">
        <span className="stat-pill">
          Выдано <b>{issued}</b>
        </span>
        <span className="stat-pill">
          На сумму <b>{formatMoney(spent)}</b>
        </span>
      </div>

      <section className="panel">
        {rows.length === 0 ? (
          <div className="empty-state">
            <h3>Прямых пока нет</h3>
            <p>На витрине выберите товар с типом «Прямые» — выдача появится здесь.</p>
            <div className="quick">
              <button className="btn btn-primary" type="button" onClick={() => setScreen("catalog")}>
                Открыть витрину
              </button>
            </div>
          </div>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="order-card">
              <div className="order-top">
                <div>
                  <h3>{row.skuName}</h3>
                  <div className="order-meta">
                    <span className="mono">{row.id}</span>
                    <span>{formatDateTime(row.date)}</span>
                    <span>{row.qty} шт</span>
                  </div>
                </div>
                <div className="feed-side">
                  <span className="mono">{formatMoney(row.amount)}</span>
                  <span className={`status ${row.status}`}>
                    {row.status === "issued"
                      ? "Выдано"
                      : row.status === "pending"
                        ? "Ждёт"
                        : row.status === "failed"
                          ? "Ошибка"
                          : "Возврат"}
                  </span>
                </div>
              </div>
              {row.codes && row.codes.length > 0 && (
                <div className="order-actions">
                  <button className="btn" type="button" onClick={() => copyText(row.codes!.join("\n"))}>
                    Скопировать коды
                  </button>
                  <button className="btn btn-ghost" type="button" onClick={() => setScreen("orders")}>
                    Все заказы
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </>
  );
}
