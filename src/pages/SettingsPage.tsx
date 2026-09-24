import { ACCOUNT } from "../data/seed";
import { formatMoney } from "../format";
import { useCabinet } from "../state";

export function SettingsPage() {
  const { settings, setSettings } = useCabinet();

  return (
    <>
      <header className="page-hero">
        <div className="page-kicker">Кабинет</div>
        <h1>Настройки</h1>
        <p>
          Организация, уведомления и безопасность. Агент {ACCOUNT.agentId} · {ACCOUNT.region}.
        </p>
      </header>

      <section className="panel">
        <h2>Организация</h2>
        <p className="lead">Так вы видите кабинет в шапке и в документах.</p>
        <label style={{ display: "block", marginTop: 14 }}>
          Название
          <input
            className="field"
            style={{ width: "100%", marginTop: 6 }}
            value={settings.organization}
            onChange={(event) => setSettings({ ...settings, organization: event.target.value })}
          />
        </label>
        <div className="balance-meta" style={{ marginTop: 14 }}>
          <span>
            логин <b>{ACCOUNT.login}</b>
          </span>
          <span>
            роль <b>{ACCOUNT.role}</b>
          </span>
        </div>
      </section>

      <section className="panel">
        <h2>Уведомления</h2>
        <p className="lead">Тихие сигналы о деньгах и выдачах — без лишнего шума.</p>
        <div className="stack" style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <label className="check">
            <input
              type="checkbox"
              checked={settings.notifyLow}
              onChange={(event) => setSettings({ ...settings, notifyLow: event.target.checked })}
            />
            Низкий баланс (ниже {formatMoney(settings.autoBelow)})
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={settings.notifyFail}
              onChange={(event) => setSettings({ ...settings, notifyFail: event.target.checked })}
            />
            Ошибка выдачи
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={settings.notifyStaff}
              onChange={(event) => setSettings({ ...settings, notifyStaff: event.target.checked })}
            />
            Покупка сотрудника
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Безопасность</h2>
        <p className="lead">Двухфакторный вход — заглушка под будущий прод.</p>
        <label className="check" style={{ marginTop: 14 }}>
          <input
            type="checkbox"
            checked={settings.twoFa}
            onChange={(event) => setSettings({ ...settings, twoFa: event.target.checked })}
          />
          Включить 2FA
        </label>
      </section>
    </>
  );
}
