import { formatMoney } from "../format";
import { useCabinet } from "../state";

export function CartPage() {
  const { cart, skus, setQty, removeFromCart, cartSum, cartCount, balance, checkout, setScreen } =
    useCabinet();
  const shortage = cartSum > balance;
  const need = Math.max(cartSum - balance, 0);

  return (
    <>
      <header className="page-hero">
        <div className="page-kicker">Покупка</div>
        <h1>Корзина</h1>
        <p>Списание с баланса агента. После оплаты коды сразу появятся в «Моих заказах».</p>
      </header>

      {cart.length === 0 ? (
        <section className="panel">
          <div className="empty-state">
            <h3>Пока пусто</h3>
            <p>Добавьте позиции с витрины — здесь соберём заказ и спишем с баланса.</p>
            <div className="quick">
              <button className="btn btn-primary" type="button" onClick={() => setScreen("catalog")}>
                Перейти на витрину
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="split-layout">
          <div>
            {cart.map((item) => {
              const sku = skus.find((row) => row.id === item.skuId);
              if (!sku) return null;
              return (
                <article key={item.skuId} className="line-card">
                  <div>
                    <h3>{sku.name}</h3>
                    <div className="muted">
                      {formatMoney(sku.price)} за шт · агентская цена
                    </div>
                    <div className="quick" style={{ marginTop: 12 }}>
                      <div className="step">
                        <button
                          type="button"
                          aria-label="Меньше"
                          onClick={() => setQty(item.skuId, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="mono">{item.qty}</span>
                        <button
                          type="button"
                          aria-label="Больше"
                          onClick={() => setQty(item.skuId, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button className="btn btn-ghost" type="button" onClick={() => removeFromCart(item.skuId)}>
                        Убрать
                      </button>
                    </div>
                  </div>
                  <div className="feed-side">
                    <span className="mono" style={{ fontSize: 16 }}>
                      {formatMoney(sku.price * item.qty)}
                    </span>
                  </div>
                </article>
              );
            })}
            <button className="btn" type="button" onClick={() => setScreen("catalog")}>
              Добавить ещё с витрины
            </button>
          </div>

          <aside className="summary-card">
            <h2>К оплате</h2>
            <div className="summary-line">
              <span>Позиций</span>
              <b>{cartCount}</b>
            </div>
            <div className="summary-line">
              <span>Баланс</span>
              <b>{formatMoney(balance)}</b>
            </div>
            <div className="summary-total">
              <span>Итого</span>
              <b>{formatMoney(cartSum)}</b>
            </div>
            {shortage ? (
              <>
                <p className="lead bad">Не хватает {formatMoney(need)}. Пополните баланс и вернитесь сюда.</p>
                <div className="quick">
                  <button className="btn btn-primary" type="button" onClick={() => setScreen("topup")}>
                    Пополнить {formatMoney(need)}
                  </button>
                </div>
              </>
            ) : (
              <div className="quick">
                <button className="btn btn-primary" type="button" onClick={() => checkout()}>
                  Списать {formatMoney(cartSum)}
                </button>
              </div>
            )}
            <p className="lead" style={{ marginTop: 14 }}>
              Коды не уходят «на сторону» — только в ваш кабинет.
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
