import { ACCOUNT } from "../data/seed";
import { formatDateTime } from "../format";
import { useCabinet } from "../state";

export function ApiPage() {
  const { liveKey, rotateKey, copyText, apiLog, settings, setScreen } = useCabinet();

  return (
    <>
      <header className="page-hero">
        <div className="page-hero-row">
          <div>
            <div className="page-kicker">Интеграции</div>
            <h1>API и ключи</h1>
            <p>
              Тот же ассортимент, что на витрине. Live списывает баланс агента. Sandbox ничего не выдаёт — только для
              проверки.
            </p>
          </div>
          <button className="btn" type="button" onClick={() => setScreen("docs")}>
            Как подключить
          </button>
        </div>
      </header>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Ключи доступа</h2>
            <p className="lead">
              {settings.organization} · скоупы: balance, catalog, orders, direct, webhooks
            </p>
          </div>
          <button className="btn" type="button" onClick={rotateKey}>
            Перевыпустить live
          </button>
        </div>
        <div className="code-list">
          <div className="code-row">
            <span>live · {liveKey}</span>
            <button className="btn btn-ghost" type="button" onClick={() => copyText(liveKey)}>
              Копировать
            </button>
          </div>
          <div className="code-row">
            <span>test · {ACCOUNT.sandboxKey}</span>
            <button className="btn btn-ghost" type="button" onClick={() => copyText(ACCOUNT.sandboxKey)}>
              Копировать
            </button>
          </div>
          <div className="code-row">
            <span>webhook · {ACCOUNT.webhook}</span>
            <button className="btn btn-ghost" type="button" onClick={() => copyText(ACCOUNT.webhook)}>
              Копировать
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Последние запросы</h2>
            <p className="lead">Журнал вызовов с вашего ключа.</p>
          </div>
        </div>
        <div className="feed">
          {apiLog.map((row) => (
            <div key={row.id} className="feed-row" style={{ cursor: "default" }}>
              <div className="feed-main">
                <strong className="mono">
                  {row.method} {row.path}
                </strong>
                <span>{formatDateTime(row.time)}</span>
              </div>
              <div className="feed-side">
                <span className={row.status >= 400 ? "bad" : "ok"}>{row.status}</span>
                <span className="muted mono">{row.ms} мс</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
