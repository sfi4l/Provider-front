import { useEffect, useMemo, useState } from "react";
import { PRODUCTS, faceCaption, productById, type CatalogProduct } from "../data/catalog";
import { formatMoney } from "../format";
import { GroupChev } from "../layout/Icons";
import { useCabinet } from "../state";
import type { ProductKind, Sku } from "../types";

const KINDS: { key: ProductKind | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "code", label: "Коды" },
  { key: "key", label: "Ключи" },
  { key: "direct", label: "Прямые" },
];

type FilterKey = "kind" | "group" | null;

function kindLabel(kind: ProductKind) {
  if (kind === "code") return "Коды";
  if (kind === "key") return "Ключи";
  return "Прямые";
}

function Star({ on }: { on: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
      <path d="M8 2.3 9.76 6l4.04.58-2.92 2.84.7 4.04L8 11.5l-3.58 1.96.7-4.04L2.2 6.58 6.24 6z" />
    </svg>
  );
}

function BackChev() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8.4 3.2 4.6 7l3.8 3.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function nomsLabel(count: number) {
  const ten = count % 10;
  const hundred = count % 100;
  if (ten === 1 && hundred !== 11) return `${count} номинал`;
  if (ten >= 2 && ten <= 4 && (hundred < 12 || hundred > 14)) return `${count} номинала`;
  return `${count} номиналов`;
}

function pickSku(items: Sku[], picked: string | undefined, query: string) {
  if (picked) {
    const found = items.find((item) => item.id === picked);
    if (found) return found;
  }
  const needle = query.trim().replace(/^\$/, "").toLowerCase();
  if (needle) {
    const hit = items.find(
      (item) => item.variant.toLowerCase() === needle || String(item.face) === needle,
    );
    if (hit) return hit;
  }
  return items.find((item) => item.favorite) ?? items[0];
}

export function CatalogPage() {
  const { skus, addToCart, buyNow, toggleFavorite } = useCabinet();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ProductKind | "all">("all");
  const [group, setGroup] = useState("all");
  const [onlyFav, setOnlyFav] = useState(false);
  const [open, setOpen] = useState<FilterKey>(null);
  const [opened, setOpened] = useState<string | null>(null);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const brands = useMemo(() => [...new Set(PRODUCTS.map((item) => item.brand))], []);

  const clustered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PRODUCTS.map((product) => {
      const items = skus
        .filter((sku) => sku.productId === product.id)
        .sort((a, b) => a.face - b.face);
      return { product, items };
    }).filter(({ product, items }) => {
      if (!items.length) return false;
      if (kind !== "all" && product.kind !== kind) return false;
      if (group !== "all" && product.brand !== group) return false;
      if (onlyFav && !items.some((item) => item.favorite)) return false;
      if (!needle) return true;
      return [product.title, product.brand, product.category, ...items.map((item) => item.variant)].some(
        (value) => value.toLowerCase().includes(needle),
      );
    });
  }, [group, kind, onlyFav, query, skus]);

  useEffect(() => {
    if (!opened) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpened(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened]);

  useEffect(() => {
    setQty(1);
    setError(null);
    document.querySelector(".main")?.scrollTo({ top: 0 });
  }, [opened]);

  function toggle(next: FilterKey) {
    setOpen((current) => (current === next ? null : next));
  }

  const kindCaption = KINDS.find((item) => item.key === kind)?.label ?? "Тип";
  const openedProduct = opened ? productById(opened) : undefined;
  const openedItems = opened ? skus.filter((sku) => sku.productId === opened).sort((a, b) => a.face - b.face) : [];

  if (openedProduct && openedItems.length) {
    const sku = pickSku(openedItems, picked[openedProduct.id], query);
    const max = sku.stock === null ? 99 : Math.max(sku.stock, 1);
    const safeQty = Math.min(Math.max(qty, 1), max);
    const favored = openedItems.some((item) => item.favorite);

    return (
      <ProductView
        product={openedProduct}
        items={openedItems}
        sku={sku}
        qty={safeQty}
        error={error}
        favored={favored}
        onBack={() => setOpened(null)}
        onPick={(id) => {
          setPicked((current) => ({ ...current, [openedProduct.id]: id }));
          setQty(1);
        }}
        onQty={(next) => setQty(Math.min(Math.max(next, 1), max))}
        onFav={() => toggleFavorite(sku.id)}
        onCart={() => addToCart(sku.id, safeQty)}
        onBuy={() => setError(buyNow(sku.id, safeQty))}
      />
    );
  }

  return (
    <>
      <header className="page-hero">
        <div className="page-kicker">Ассортимент</div>
        <h1>Витрина</h1>
        <p>Выберите бренд, откройте карточку, возьмите номинал. Коды сразу в кабинете — без получателя «на стороне».</p>
      </header>

      <section className="panel catalog-head">
        <input
          className="field search"
          placeholder="Apple, Steam, 25…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="filters">
          <button
            type="button"
            className={open === "kind" || kind !== "all" ? "filter-chip is-on" : "filter-chip"}
            onClick={() => toggle("kind")}
          >
            {kind === "all" ? "Тип" : kindCaption}
            <span className={open === "kind" ? "filter-chev is-open" : "filter-chev"}>
              <GroupChev />
            </span>
          </button>
          <button
            type="button"
            className={open === "group" || group !== "all" ? "filter-chip is-on" : "filter-chip"}
            onClick={() => toggle("group")}
          >
            {group === "all" ? "Марка" : group}
            <span className={open === "group" ? "filter-chev is-open" : "filter-chev"}>
              <GroupChev />
            </span>
          </button>
          <button
            type="button"
            className={onlyFav ? "filter-chip is-on" : "filter-chip"}
            onClick={() => setOnlyFav((value) => !value)}
          >
            Избранное
          </button>
        </div>
        {open && (
          <div className="filter-tray-inner">
            {open === "kind" &&
              KINDS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={kind === item.key ? "pill is-on" : "pill"}
                  onClick={() => setKind(item.key)}
                >
                  {item.label}
                </button>
              ))}
            {open === "group" && (
              <>
                <button
                  type="button"
                  className={group === "all" ? "pill is-on" : "pill"}
                  onClick={() => setGroup("all")}
                >
                  Все
                </button>
                {brands.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={group === name ? "pill is-on" : "pill"}
                    onClick={() => setGroup(name)}
                  >
                    {name}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </section>

      <div className="shop-grid">
        {clustered.map(({ product, items }) => {
          const from = Math.min(...items.map((item) => item.price));
          const favored = items.some((item) => item.favorite);
          return (
            <article key={product.id} className={`shop-card tone-${product.tone}`}>
              <button type="button" className="shop-hit" onClick={() => setOpened(product.id)}>
                <div className="shop-card-top">
                  <span className="shop-mark">{product.mark}</span>
                  <span className="status">{kindLabel(product.kind)}</span>
                </div>
                <div className="shop-card-body">
                  <div className="shop-brand">{product.brand}</div>
                  <h2>{product.title}</h2>
                </div>
                <div className="shop-card-foot">
                  <div>
                    <div className="shop-from">{items.length > 1 ? `от ${formatMoney(from)}` : formatMoney(from)}</div>
                    <div className="muted">{nomsLabel(items.length)}</div>
                  </div>
                  <span className="shop-go">Открыть</span>
                </div>
              </button>
              <button
                className={favored ? "icon-fav shop-fav is-on" : "icon-fav shop-fav"}
                type="button"
                aria-label="Избранное"
                onClick={(event) => {
                  event.stopPropagation();
                  const target = items.find((item) => item.favorite) ?? items[0];
                  toggleFavorite(target.id);
                }}
              >
                <Star on={favored} />
              </button>
            </article>
          );
        })}
      </div>
      {clustered.length === 0 && (
        <section className="panel">
          <div className="empty-state">
            <h3>Ничего не нашлось</h3>
            <p>Снимите фильтр или очистите поиск — ассортимент широкий.</p>
          </div>
        </section>
      )}
    </>
  );
}

function ProductView({
  product,
  items,
  sku,
  qty,
  error,
  favored,
  onBack,
  onPick,
  onQty,
  onFav,
  onCart,
  onBuy,
}: {
  product: CatalogProduct;
  items: Sku[];
  sku: Sku;
  qty: number;
  error: string | null;
  favored: boolean;
  onBack: () => void;
  onPick: (id: string) => void;
  onQty: (qty: number) => void;
  onFav: () => void;
  onCart: () => void;
  onBuy: () => void;
}) {
  const many = items.length > 1;
  const total = sku.price * qty;

  return (
    <>
      <button className="shop-back" type="button" onClick={onBack}>
        <BackChev />
        Витрина
      </button>
      <div className={`product-stage tone-${product.tone}`}>
        <aside className="product-hero">
          <div className="product-pack">
            <div className="product-pack-face">{faceCaption(product.unit, sku)}</div>
            <div className="product-pack-sub">
              {product.title}
              {qty > 1 ? ` · ${qty} шт` : ""}
            </div>
          </div>
          <div>
            <div className="shop-brand">{product.category}</div>
            <div className="product-hero-name">{product.brand}</div>
          </div>
        </aside>
        <section className="product-buy">
          <div className="product-buy-head">
            <div>
              <h2>{product.title}</h2>
              <p className="lead">{product.blurb}</p>
            </div>
            <span className="status">{kindLabel(product.kind)}</span>
          </div>
          {many && (
            <div className="face-grid">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === sku.id ? "face is-on" : "face"}
                  onClick={() => onPick(item.id)}
                >
                  <span className="face-val">{faceCaption(product.unit, item)}</span>
                  <span className="face-price">{formatMoney(item.price)}</span>
                </button>
              ))}
            </div>
          )}
          {!many && (
            <div className="face-single">
              <span className="face-val">{faceCaption(product.unit, sku)}</span>
              <span className="muted">агентская цена {formatMoney(sku.price)}</span>
            </div>
          )}
          <div className="product-pay">
            <div className="step">
              <button type="button" aria-label="Меньше" onClick={() => onQty(qty - 1)}>
                −
              </button>
              <span className="mono">{qty}</span>
              <button type="button" aria-label="Больше" onClick={() => onQty(qty + 1)}>
                +
              </button>
            </div>
            <div className="product-sum">
              <div className="kpi-value">{formatMoney(total)}</div>
              <div className="muted">{qty > 1 ? `${formatMoney(sku.price)} × ${qty}` : "к списанию"}</div>
            </div>
          </div>
          {error && <p className="lead bad">{error}</p>}
          <div className="sku-actions product-actions">
            <button className={favored ? "icon-fav is-on" : "icon-fav"} type="button" onClick={onFav} aria-label="Избранное">
              <Star on={favored} />
            </button>
            <button className="btn" type="button" onClick={onCart}>
              В корзину
            </button>
            <button className="btn btn-primary" type="button" onClick={onBuy}>
              Купить
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
