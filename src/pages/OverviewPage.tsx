import { Segmented } from "antd";
import { ACCOUNT, PERIODS } from "../data/seed";
import { chartBuckets, SpendChart, spendPoints } from "../components/SpendChart";
import { StarterGuide } from "../components/StarterGuide";
import { TopBuys } from "../components/TopBuys";
import { formatDateTime, formatMoney } from "../format";
import { ordersInPeriod, periodDays, useCabinet } from "../state";
import type { OrderStatus, PeriodKey } from "../types";

export function OverviewPage() {
  const {
    balance,
    reserved,
    orders,
    period,
    setPeriod,
    setScreen,
    openOrder,
    skus,
    settings,
    cartCount,
  } = useCabinet();
  const days = periodDays(period);
  const current = ordersInPeriod(orders, period);
  const spent = current
    .filter((row) => row.status !== "refunded")
    .reduce((sum, row) => sum + row.amount, 0);
  const issued = current.filter((row) => row.status === "issued").length;
  const failed = current.filter((row) => row.status === "failed").length;
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayCount = orders.filter((row) => row.date.slice(0, 10) === todayKey).length;
  const mix = skus
    .map((sku) => {
      const matched = current.filter((row) => row.skuId === sku.id);
      const amount = matched.reduce((sum, row) => sum + row.amount, 0);
      return {
        id: sku.id,
        name: sku.name,
        category: sku.category,
        amount,
        count: matched.length,
      };
    })
    .filter((row) => row.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const top = mix[0];
  const points = chartBuckets(spendPoints(current, days), days);
  const available = Math.max(balance - reserved, 0);
  const low = available < settings.autoBelow;

  return (
    <div className="home">
      <section className="home-strip">
        <div className="home-strip-main">
          <div className="home-strip-who">
            <span className="home-strip-hello">Здравствуйте, {ACCOUNT.name}</span>
            <div className="home-strip-balance mono">{formatMoney(available)}</div>
            <div className="home-strip-meta">
              <span>
                счёт <b className="mono">{formatMoney(balance)}</b>
              </span>
              <span>
                резерв <b className="mono">{formatMoney(reserved)}</b>
              </span>
              <span className={low ? "home-strip-flag is-warn" : "home-strip-flag"}>
                {low ? `ниже ${formatMoney(settings.autoBelow)}` : "хватает на покупки"}
              </span>
            </div>
          </div>
          <div className="home-strip-actions">
            <button className="btn btn-primary" type="button" onClick={() => setScreen("catalog")}>
              Витрина
            </button>
            <button className="btn" type="button" onClick={() => setScreen("topup")}>
              Пополнить
            </button>
            <button className="btn" type="button" onClick={() => setScreen("orders")}>
              Заказы
            </button>
            {cartCount > 0 && (
              <button className="btn" type="button" onClick={() => setScreen("cart")}>
                Корзина · {cartCount}
              </button>
            )}
          </div>
        </div>
      </section>

      <StarterGuide />

      <div className="row-2 home-analytics">
        <section className="panel home-panel">
          <div className="panel-head">
            <h2>Как уходили деньги</h2>
            <Segmented
              size="small"
              value={period}
              onChange={(value) => setPeriod(value as PeriodKey)}
              options={PERIODS.map((item) => ({ label: item.label, value: item.key }))}
            />
          </div>
          <SpendChart points={points} />
        </section>

        <section className="panel home-panel">
          <div className="panel-head">
            <div>
              <h2>Что покупали чаще</h2>
              {top && (
                <p className="lead">
                  {top.name}
                  <span className="home-top-lead-sum mono"> · {formatMoney(top.amount)}</span>
                </p>
              )}
            </div>
          </div>
          <TopBuys rows={mix.slice(0, 5)} />
        </section>
      </div>

      <section className="panel home-panel">
        <div className="panel-head">
          <h2>Последние выдачи</h2>
          <button className="btn" type="button" onClick={() => setScreen("orders")}>
            Все заказы
          </button>
        </div>
        <div className="feed feed-clean">
          {current.slice(0, 6).map((row) => (
            <button key={row.id} className="feed-row" type="button" onClick={() => openOrder(row.id)}>
              <div className="feed-main">
                <strong>{row.skuName}</strong>
                <span>
                  {row.id} · {row.qty} шт · {row.source === "api" ? "API" : row.actor} ·{" "}
                  {formatDateTime(row.date)}
                </span>
              </div>
              <div className="feed-side">
                <span className="mono">{formatMoney(row.amount)}</span>
                <span className={`status ${row.status}`}>{statusLabel(row.status)}</span>
              </div>
            </button>
          ))}
          {current.length === 0 && (
            <div className="empty-state">
              <h3>Пока тихо</h3>
              <p>Как только купите — выдача появится здесь.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function statusLabel(status: OrderStatus) {
  if (status === "issued") return "Выдано";
  if (status === "pending") return "Ждёт";
  if (status === "failed") return "Ошибка";
  if (status === "refunded") return "Возврат";
  return status;
}
