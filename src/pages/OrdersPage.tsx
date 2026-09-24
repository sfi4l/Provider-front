import { useEffect, useMemo, useState } from "react";
import { formatDateTime, formatMoney } from "../format";
import { useCabinet } from "../state";
import type { Order, OrderStatus, ProductKind } from "../types";

const STATUS: Record<OrderStatus, string> = {
  issued: "Выдано",
  pending: "Ждёт",
  failed: "Ошибка",
  refunded: "Возврат",
};

const KIND: Record<ProductKind, string> = {
  code: "Код",
  key: "Ключ",
  direct: "Прямое",
};

const FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "issued", label: "Выдано" },
  { key: "pending", label: "Ждёт" },
  { key: "failed", label: "Ошибки" },
  { key: "refunded", label: "Возвраты" },
];

export function OrdersPage() {
  const { orders, repeatOrder, copyText, setScreen, selectedOrderId, selectOrder } = useCabinet();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((row) => {
      if (status !== "all" && row.status !== status) return false;
      if (!needle) return true;
      return [row.id, row.skuName, row.actor, row.source, row.apiRequestId, ...(row.codes ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [orders, query, status]);

  useEffect(() => {
    if (!selectedOrderId && orders[0]) selectOrder(orders[0].id);
  }, [orders, selectOrder, selectedOrderId]);

  useEffect(() => {
    if (!selectedOrderId) return;
    if (rows.some((row) => row.id === selectedOrderId)) return;
    if (rows[0]) selectOrder(rows[0].id);
  }, [rows, selectOrder, selectedOrderId]);

  const selected =
    (selectedOrderId ? orders.find((row) => row.id === selectedOrderId) : null) ??
    rows[0] ??
    null;

  function select(id: string) {
    selectOrder(id);
  }

  const issued = orders.filter((row) => row.status === "issued").length;
  const spent = orders
    .filter((row) => row.status === "issued")
    .reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="orders-shell">
      <header className="page-hero page-hero-row orders-hero">
        <div>
          <h1>Мои заказы</h1>
          <p>
            {issued} выдач · {formatMoney(spent)}
          </p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setScreen("catalog")}>
          Новая покупка
        </button>
      </header>

      <div className="orders-split">
        <section className="orders-list panel">
          <div className="toolbar">
            <input
              className="field search"
              placeholder="ID, товар, код…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="pills">
              {FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={status === item.key ? "pill is-on" : "pill"}
                  onClick={() => setStatus(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="empty-state">
              <h3>Пусто</h3>
              <p>Смените фильтр или купите на витрине.</p>
            </div>
          ) : (
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Время</th>
                    <th>Товар</th>
                    <th>Кто</th>
                    <th>Сумма</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className={selected?.id === row.id ? "is-on" : undefined}
                      onClick={() => select(row.id)}
                    >
                      <td>
                        <div className="muted">{formatDateTime(row.date)}</div>
                        <div className="mono orders-id">{row.id}</div>
                      </td>
                      <td>
                        <div className="orders-sku">{row.skuName}</div>
                        <div className="muted">
                          {row.qty} шт · {KIND[row.kind]}
                        </div>
                      </td>
                      <td>
                        <div>{row.source === "api" ? "API" : row.actor}</div>
                        {row.source === "api" && <div className="muted mono">{row.apiRequestId}</div>}
                      </td>
                      <td className="mono">{formatMoney(row.amount)}</td>
                      <td>
                        <span className={`status ${row.status}`}>{STATUS[row.status]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="orders-detail panel">
          {selected ? (
            <OrderDetail
              order={selected}
              onRepeat={() => repeatOrder(selected.id)}
              onCopy={(value) => copyText(value)}
            />
          ) : (
            <div className="orders-detail-empty">Выберите заказ</div>
          )}
        </aside>
      </div>
    </div>
  );
}

function OrderDetail({
  order,
  onRepeat,
  onCopy,
}: {
  order: Order;
  onRepeat: () => void;
  onCopy: (value: string) => void;
}) {
  const hasCodes = Boolean(order.codes?.length);

  return (
    <div className="order-detail">
      <div className="order-detail-head">
        <div>
          <div className="mono order-detail-id">{order.id}</div>
          <h2>{order.skuName}</h2>
          <div className="order-detail-meta">
            <span className={`status ${order.status}`}>{STATUS[order.status]}</span>
            <span>
              {order.qty} шт · {KIND[order.kind]}
            </span>
            <span className="mono">{formatMoney(order.amount)}</span>
          </div>
        </div>
        <button className="btn" type="button" onClick={onRepeat}>
          Купить ещё
        </button>
      </div>

      <dl className="order-facts">
        <div>
          <dt>Канал</dt>
          <dd>{order.source === "api" ? "API" : "Кабинет"}</dd>
        </div>
        <div>
          <dt>Кто</dt>
          <dd>{order.actor}</dd>
        </div>
        {order.apiRequestId && (
          <div>
            <dt>Request</dt>
            <dd className="mono">{order.apiRequestId}</dd>
          </div>
        )}
        <div>
          <dt>Время</dt>
          <dd>{formatDateTime(order.date)}</dd>
        </div>
      </dl>

      <div className="order-timeline-block">
        <h3>Таймлайн</h3>
        <ol className="order-timeline">
          {order.timeline.map((event, index) => (
            <li key={`${event.at}-${index}`}>
              <span className="order-timeline-dot" aria-hidden />
              <div>
                <strong>{event.title}</strong>
                {event.detail && <span>{event.detail}</span>}
                <em>{formatDateTime(event.at)}</em>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {hasCodes && (
        <div className="order-codes-block">
          <div className="order-codes-head">
            <h3>Коды</h3>
            <button className="btn btn-ghost" type="button" onClick={() => onCopy(order.codes!.join("\n"))}>
              Скопировать все
            </button>
          </div>
          <div className="code-list">
            {order.codes!.map((code) => (
              <div className="code-row" key={code}>
                <span>{code}</span>
                <button className="btn btn-ghost" type="button" onClick={() => onCopy(code)}>
                  Копировать
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
