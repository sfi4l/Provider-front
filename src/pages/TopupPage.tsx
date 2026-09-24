import { useEffect, useMemo, useState } from "react";
import { ACCOUNT } from "../data/seed";
import { formatDateTime, formatMoney } from "../format";
import { useCabinet } from "../state";
import type { PayMethod } from "../types";

const STATUS: Record<string, string> = {
  paid: "Зачислено",
  waiting: "Ожидает",
  expired: "Истекло",
};

const NETWORKS = Object.values(ACCOUNT.deposit.networks);
const PRESETS = [100, 500, 1000, 2500, 5000];

function shortAddr(value: string) {
  if (value.length < 18) return value;
  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

function formatRemain(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function UsdtMark({ size = 28 }: { size?: number }) {
  return (
    <svg className="usdt-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path
        fill="#fff"
        d="M17.922 17.383v-.002c-.152.01-1.041.065-3.121.065-1.626 0-2.778-.055-3.178-.065v.003c-2.51-.117-4.394-.567-4.394-1.106 0-.54 1.884-.99 4.394-1.107v2.038c.41.03 1.594.1 3.197.1 2.014 0 3.005-.078 3.102-.098V15.17c2.505.117 4.385.568 4.385 1.107 0 .54-1.88 1.09-4.385 1.106zm0-2.607V12.63h4.037V9.772h-12.14v2.857h4.037v2.146c-3.294.151-5.776.857-5.776 1.708 0 .851 2.482 1.557 5.776 1.708v6.895h4.066v-6.895c3.29-.151 5.76-.857 5.76-1.708 0-.85-2.47-1.556-5.76-1.707z"
      />
    </svg>
  );
}

export function TopupPage() {
  const { balance, reserved, invoices, topup, confirmDeposit, expireDeposit, copyText } = useCabinet();
  const [network, setNetwork] = useState<PayMethod>("trc20");
  const [amount, setAmount] = useState("1000");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const selected = ACCOUNT.deposit.networks[network];
  const available = Math.max(balance - reserved, 0);
  const parsed = Number(amount);
  const amountOk = Number.isFinite(parsed) && parsed >= selected.min;

  const live = activeId ? invoices.find((row) => row.id === activeId) ?? null : null;
  const showTicket = Boolean(live);
  const liveNet = live ? ACCOUNT.deposit.networks[live.method] : selected;
  const waiting = live?.status === "waiting";
  const remainMs = live ? Date.parse(live.expiresAt) - now : 0;

  useEffect(() => {
    if (!waiting) return;
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, [waiting, live?.id]);

  useEffect(() => {
    if (!live || live.status !== "waiting") return;
    if (Date.parse(live.expiresAt) <= now) expireDeposit(live.id);
  }, [expireDeposit, live, now]);

  const qrUrl = useMemo(() => {
    if (!live) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=168x168&margin=10&data=${encodeURIComponent(live.address)}`;
  }, [live]);

  function createAddress() {
    if (!amountOk) return;
    const invoice = topup(parsed, network);
    setActiveId(invoice.id);
    setNow(Date.now());
  }

  return (
    <>
      <header className="page-hero page-hero-row">
        <div>
          <h1>Пополнение</h1>
          <p>USDT · TON / TRC20</p>
        </div>
        <div className="topup-balance">
          <div>
            <span className="kpi-label">Доступно</span>
            <div className="mono topup-balance-value">{formatMoney(available)}</div>
          </div>
          <div className="topup-balance-split">
            <span>
              счёт <b className="mono">{formatMoney(balance)}</b>
            </span>
            <span>
              резерв <b className="mono">{formatMoney(reserved)}</b>
            </span>
          </div>
        </div>
      </header>

      <section className={showTicket ? "panel deposit-panel" : "panel deposit-panel is-solo"}>
        <div className="deposit-form">
          <div className="deposit-coin">
            <UsdtMark size={36} />
            <div>
              <b>USDT</b>
              <span>Tether</span>
            </div>
          </div>

          <fieldset className="deposit-label">
            <legend>Сеть</legend>
            <div className="network-list" role="radiogroup" aria-label="Сеть">
              {NETWORKS.map((item) => (
                <label key={item.id} className={network === item.id ? "network-item is-on" : "network-item"}>
                  <input
                    type="radio"
                    name="network"
                    checked={network === item.id}
                    onChange={() => setNetwork(item.id)}
                  />
                  <span className="network-item-body">
                    <b>{item.label}</b>
                    <span>{item.chain}</span>
                  </span>
                  <span className="network-item-meta">{item.eta}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="deposit-label">
            Сумма
            <div className="deposit-amount-row">
              <input
                className="field"
                type="number"
                min={selected.min}
                step={1}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <span className="deposit-amount-unit">USDT</span>
            </div>
            <div className="amount-presets" style={{ marginTop: 8 }}>
              {PRESETS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={Number(amount) === value ? "pill is-on" : "pill"}
                  onClick={() => setAmount(String(value))}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="deposit-hint">мин. {selected.min} USDT</div>
          </label>

          <button
            className="btn btn-primary"
            type="button"
            disabled={!amountOk}
            onClick={createAddress}
            style={{ width: "100%" }}
          >
            Пополнить
          </button>
        </div>

        {showTicket && live && (
          <div className="deposit-pay">
            <div className="deposit-ticket-head">
              <div className="deposit-ticket-asset">
                <UsdtMark size={40} />
                <div>
                  <div className="deposit-ticket-amount mono">
                    {formatMoney(live.amount)} <span>USDT</span>
                  </div>
                  <div className="deposit-ticket-net">
                    {liveNet.label} · {liveNet.eta}
                  </div>
                </div>
              </div>
              {waiting ? (
                <div className={`deposit-timer${remainMs < 5 * 60 * 1000 ? " is-low" : ""}`}>
                  <span>Осталось</span>
                  <b className="mono">{formatRemain(remainMs)}</b>
                </div>
              ) : (
                <span className={`status ${live.status}`}>{STATUS[live.status]}</span>
              )}
            </div>

            <div className="deposit-pay-body">
              <div className="qr-wrap">
                <img className="qr-image" src={qrUrl} alt="" width={168} height={168} />
              </div>
              <div className="deposit-pay-main">
                <label className="deposit-addr-label">
                  Адрес
                  <div className="address-row">
                    <code title={live.address}>{live.address}</code>
                    <button className="btn btn-primary" type="button" onClick={() => copyText(live.address)}>
                      Копировать
                    </button>
                  </div>
                </label>
                {waiting && (
                  <button className="btn" type="button" onClick={() => confirmDeposit(live.id)}>
                    Проверить поступление
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>История</h2>
        </div>
        {invoices.length === 0 ? (
          <p className="lead">Пока пусто.</p>
        ) : (
          <table className="plain">
            <thead>
              <tr>
                <th>Время</th>
                <th>Сеть</th>
                <th>Адрес</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((row) => {
                const net = ACCOUNT.deposit.networks[row.method];
                return (
                  <tr key={row.id}>
                    <td>
                      <div className="muted">{formatDateTime(row.date)}</div>
                    </td>
                    <td>{net.label}</td>
                    <td>
                      <button
                        className="btn btn-ghost mono"
                        type="button"
                        style={{ height: "auto", padding: "4px 0" }}
                        onClick={() => {
                          setActiveId(row.id);
                          setNetwork(row.method);
                        }}
                      >
                        {shortAddr(row.address)}
                      </button>
                    </td>
                    <td className="mono">{formatMoney(row.amount)}</td>
                    <td>
                      <span className={`status ${row.status}`}>{STATUS[row.status]}</span>
                    </td>
                    <td>
                      {row.status === "waiting" && (
                        <button className="btn btn-ghost" type="button" onClick={() => confirmDeposit(row.id)}>
                          Зачислить
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
