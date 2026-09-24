import { useMemo, useState } from "react";
import { useCabinet } from "../state";
import type { ScreenKey } from "../types";

type StepId = "topup" | "buy" | "codes" | "api";

type Step = {
  id: StepId;
  n: number;
  title: string;
  text: string;
  cta: string;
  screen: ScreenKey;
};

const STEPS: Step[] = [
  {
    id: "topup",
    n: 1,
    title: "Пополнить",
    text: "Сумма, сеть, адрес на 30 минут.",
    cta: "Пополнить",
    screen: "topup",
  },
  {
    id: "buy",
    n: 2,
    title: "Купить",
    text: "Витрина → номинал → списание.",
    cta: "Витрина",
    screen: "catalog",
  },
  {
    id: "codes",
    n: 3,
    title: "Забрать коды",
    text: "В заказах — лог и коды.",
    cta: "Заказы",
    screen: "orders",
  },
  {
    id: "api",
    n: 4,
    title: "API",
    text: "Тот же каталог ключом.",
    cta: "Ключи",
    screen: "api",
  },
];

const STORAGE_KEY = "xcode-starter-v3";

type StarterState = {
  dismissed: boolean;
};

function loadStarter(): StarterState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { dismissed: false };
    return { dismissed: Boolean(JSON.parse(raw).dismissed) };
  } catch {
    return { dismissed: false };
  }
}

function saveStarter(next: StarterState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function StarterGuide() {
  const { setScreen, orders, txs, invoices, balance } = useCabinet();
  const [state, setState] = useState<StarterState>(loadStarter);

  const doneMap = useMemo(
    () => ({
      topup:
        balance > 0 ||
        txs.some((row) => row.type === "topup") ||
        invoices.some((row) => row.status === "paid"),
      buy: orders.some((row) => row.status === "issued" || row.status === "failed"),
      codes: orders.some((row) => (row.codes?.length ?? 0) > 0),
      api: orders.some((row) => row.source === "api"),
    }),
    [balance, invoices, orders, txs],
  );

  const completed = STEPS.map((step) => doneMap[step.id]);
  const doneCount = completed.filter(Boolean).length;
  const allDone = doneCount === STEPS.length;
  const nextIndex = completed.findIndex((value) => !value);

  function setDismissed(dismissed: boolean) {
    const next = { dismissed };
    saveStarter(next);
    setState(next);
  }

  if (state.dismissed) {
    return (
      <button className="starter-reopen" type="button" onClick={() => setDismissed(false)}>
        {allDone ? "Стартер" : `Стартер · ${STEPS.length - doneCount}`}
      </button>
    );
  }

  return (
    <section className={allDone ? "starter is-done" : "starter"}>
      <div className="starter-head">
        <div>
          <h2>{allDone ? "Готово" : "С чего начать"}</h2>
          <p className="lead">{allDone ? "Можно скрыть." : "Деньги → покупка → коды → API"}</p>
        </div>
        <div className="starter-progress">
          <div className="starter-progress-label">
            {doneCount}/{STEPS.length}
          </div>
          <div className="starter-bar" aria-hidden="true">
            <i style={{ width: `${(doneCount / STEPS.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="starter-steps">
        {STEPS.map((step, index) => {
          const done = completed[index];
          const current = !allDone && index === nextIndex;
          return (
            <button
              key={step.id}
              type="button"
              className={
                done ? "starter-step is-done" : current ? "starter-step is-current" : "starter-step"
              }
              onClick={() => setScreen(step.screen)}
            >
              <span className="starter-n">{done ? "✓" : step.n}</span>
              <span className="starter-body">
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </span>
              <span className="starter-cta">{step.cta}</span>
            </button>
          );
        })}
      </div>

      <div className="starter-foot">
        {!allDone && nextIndex >= 0 && (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setScreen(STEPS[nextIndex].screen)}
          >
            {STEPS[nextIndex].cta}
          </button>
        )}
        <button className="btn btn-ghost" type="button" onClick={() => setDismissed(true)}>
          {allDone ? "Скрыть" : "Позже"}
        </button>
      </div>
    </section>
  );
}
