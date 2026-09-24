import { useState } from "react";
import { formatMoney } from "../format";
import { useCabinet } from "../state";
import type { StaffRole } from "../types";

const ROLES: { key: StaffRole; label: string; hint: string }[] = [
  { key: "buyer", label: "Покупатель", hint: "Витрина, корзина, заказы" },
  { key: "finance", label: "Финансист", hint: "Пополнение и движения" },
  { key: "viewer", label: "Просмотр", hint: "Сводка и журналы без покупок" },
  { key: "api", label: "Только API", hint: "Ключи и инструкция" },
];

const ROLE: Record<StaffRole, string> = {
  owner: "Владелец",
  buyer: "Покупатель",
  finance: "Финансист",
  viewer: "Просмотр",
  api: "Только API",
};

export function StaffPage() {
  const { staff, invite } = useCabinet();
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [role, setRole] = useState<StaffRole>("buyer");
  const [limit, setLimit] = useState(300);

  return (
    <>
      <header className="page-hero">
        <div className="page-kicker">Команда</div>
        <h1>Сотрудники</h1>
        <p>Пустите людей в тот же кабинет: роль и потолок трат — чтобы покупки не уезжали без контроля.</p>
      </header>

      <section className="panel">
        <h2>Выдать доступ</h2>
        <p className="lead">Новый человек появится в списке сразу. Владелец остаётся один.</p>
        <div className="form-grid" style={{ marginTop: 14 }}>
          <label>
            Имя
            <input className="field" value={name} onChange={(event) => setName(event.target.value)} placeholder="Анна" />
          </label>
          <label>
            Логин
            <input
              className="field"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="anna"
            />
          </label>
          <label>
            Роль
            <select className="field" value={role} onChange={(event) => setRole(event.target.value as StaffRole)}>
              {ROLES.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Лимит, USD
            <input
              className="field"
              type="number"
              min={0}
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
            />
          </label>
        </div>
        <p className="lead" style={{ marginTop: 10 }}>
          {ROLES.find((item) => item.key === role)?.hint}
        </p>
        <div className="quick">
          <button
            className="btn btn-primary"
            type="button"
            disabled={!name.trim() || !login.trim()}
            onClick={() => {
              invite(name.trim(), login.trim(), role, limit);
              setName("");
              setLogin("");
            }}
          >
            Выдать доступ
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Кто в кабинете</h2>
            <p className="lead">{staff.length} человек · лимиты в USD</p>
          </div>
        </div>
        <div className="feed">
          {staff.map((row) => (
            <div key={row.id} className="feed-row" style={{ cursor: "default" }}>
              <div className="feed-main">
                <strong>{row.name}</strong>
                <span>
                  {row.login} · {ROLE[row.role]}
                </span>
              </div>
              <div className="feed-side">
                <span className="mono">{formatMoney(row.spent)}</span>
                <span className="muted">
                  {row.limit === null ? "без потолка" : `лимит ${formatMoney(row.limit)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
