import { ACCOUNT } from "../data/seed";
import { useCabinet } from "../state";

export function DocsPage() {
  const { liveKey, setScreen } = useCabinet();

  return (
    <>
      <header className="page-hero">
        <div className="page-hero-row">
          <div>
            <div className="page-kicker">Интеграции</div>
            <h1>Как подключить API</h1>
            <p>
              Короткие примеры под ваш live-ключ. Полный ассортимент — как на витрине: баланс, коды, ключи, прямые
              зачисления.
            </p>
          </div>
          <button className="btn" type="button" onClick={() => setScreen("api")}>
            К ключам
          </button>
        </div>
      </header>

      <div className="docs-grid">
        <article className="docs-card">
          <h3>1. Взять ключ</h3>
          <p>В разделе «API и ключи» скопируйте live. Sandbox — только для проверки без списания.</p>
        </article>
        <article className="docs-card">
          <h3>2. Купить позицию</h3>
          <p>POST /v1/orders с sku и qty. Коды придут в ответе и продублируются вебхуком.</p>
        </article>
        <article className="docs-card">
          <h3>3. Слушать вебхук</h3>
          <p>
            После выдачи стучим на {ACCOUNT.webhook}. Подпись — HMAC-SHA256 вашим live-ключом.
          </p>
        </article>
        <article className="docs-card">
          <h3>4. Смотреть в кабинете</h3>
          <p>Даже через API заказ появится в «Моих заказах» — удобно сверять руками.</p>
        </article>
      </div>

      <section className="panel docs" style={{ marginTop: 14 }}>
        <h2>Примеры</h2>

        <h3>Баланс</h3>
        <pre>{`curl -s https://api.xcode.example/v1/balance \\
  -H "Authorization: Bearer ${liveKey}"`}</pre>

        <h3>Купить код или ключ</h3>
        <pre>{`curl -s -X POST https://api.xcode.example/v1/orders \\
  -H "Authorization: Bearer ${liveKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"sku":"sku-st1000","qty":2}'`}</pre>

        <h3>Прямое зачисление</h3>
        <pre>{`fetch("https://api.xcode.example/v1/orders", {
  method: "POST",
  headers: {
    Authorization: "Bearer ${liveKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ sku: "sku-mts", qty: 1 }),
});`}</pre>
      </section>
    </>
  );
}
