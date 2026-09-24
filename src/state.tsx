import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ACCOUNT,
  API_LOG,
  INVOICES,
  NOTICES,
  ORDERS,
  SETTINGS,
  SKUS,
  STAFF,
  TODAY,
  TRANSACTIONS,
} from "./data/seed";
import { formatMoney, makeCodes, uid } from "./format";
import type {
  CartItem,
  Invoice,
  Notice,
  Order,
  PayMethod,
  PeriodKey,
  ScreenKey,
  Settings,
  Sku,
  StaffMember,
  StaffRole,
  ThemeName,
  Transaction,
} from "./types";

export type Issued = { title: string; codes: string[] };

type CabinetValue = {
  screen: ScreenKey;
  setScreen: (key: ScreenKey) => void;
  theme: ThemeName;
  toggleTheme: () => void;
  period: PeriodKey;
  setPeriod: (key: PeriodKey) => void;
  balance: number;
  reserved: number;
  skus: Sku[];
  cart: CartItem[];
  orders: Order[];
  txs: Transaction[];
  staff: StaffMember[];
  invoices: Invoice[];
  notices: Notice[];
  settings: Settings;
  setSettings: (next: Settings) => void;
  issued: Issued | null;
  closeIssued: () => void;
  toast: string | null;
  apiLog: typeof API_LOG;
  liveKey: string;
  rotateKey: () => void;
  cartSum: number;
  cartCount: number;
  selectedOrderId: string | null;
  selectOrder: (id: string) => void;
  openOrder: (id: string) => void;
  addToCart: (skuId: string, qty?: number) => void;
  setQty: (skuId: string, qty: number) => void;
  removeFromCart: (skuId: string) => void;
  toggleFavorite: (skuId: string) => void;
  buyNow: (skuId: string, qty?: number) => string | null;
  checkout: () => string | null;
  topup: (amount: number, method: PayMethod) => Invoice;
  confirmDeposit: (id: string) => void;
  expireDeposit: (id: string) => void;
  repeatOrder: (id: string) => string | null;
  retryDirect: (id: string) => void;
  invite: (name: string, login: string, role: StaffRole, limit: number | null) => void;
  copyText: (value: string) => void;
  markRead: (id: string) => void;
};

const CabinetContext = createContext<CabinetValue | null>(null);

function inDays(iso: string, days: number) {
  return new Date(iso).getTime() >= TODAY.getTime() - days * 86400000;
}

export function periodDays(key: PeriodKey) {
  return key === "7d" ? 7 : key === "90d" ? 90 : 30;
}

export function ordersInPeriod(orders: Order[], key: PeriodKey) {
  return orders.filter((row) => inDays(row.date, periodDays(key)));
}

function loadTheme(): ThemeName {
  try {
    return localStorage.getItem("xcode-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function CabinetProvider({ children }: { children: ReactNode }) {
  const [screen, setScreenState] = useState<ScreenKey>("overview");
  const [theme, setTheme] = useState<ThemeName>(loadTheme);
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [balance, setBalance] = useState(ACCOUNT.balance);
  const [skus, setSkus] = useState(SKUS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState(ORDERS);
  const [txs, setTxs] = useState(TRANSACTIONS);
  const [staff, setStaff] = useState(STAFF);
  const [invoices, setInvoices] = useState(INVOICES);
  const [notices, setNotices] = useState(NOTICES);
  const [settings, setSettings] = useState(SETTINGS);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [liveKey, setLiveKey] = useState(ACCOUNT.liveKey);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const ping = useCallback((text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("xcode-theme", theme);
  }, [theme]);

  const setScreen = useCallback((key: ScreenKey) => setScreenState(key), []);

  const selectOrder = useCallback((id: string) => {
    setSelectedOrderId(id);
  }, []);

  const openOrder = useCallback((id: string) => {
    setSelectedOrderId(id);
    setScreenState("orders");
  }, []);

  const cartSum = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const sku = skus.find((row) => row.id === item.skuId);
        return sum + (sku ? sku.price * item.qty : 0);
      }, 0),
    [cart, skus],
  );
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = useCallback((skuId: string, qty = 1) => {
    setCart((current) => {
      const found = current.find((item) => item.skuId === skuId);
      if (found) {
        return current.map((item) =>
          item === found ? { ...item, qty: item.qty + qty } : item,
        );
      }
      return [...current, { skuId, qty }];
    });
    ping("В корзине");
  }, [ping]);

  const setQty = useCallback((skuId: string, qty: number) => {
    setCart((current) =>
      current
        .map((item) => (item.skuId === skuId ? { ...item, qty } : item))
        .filter((item) => item.qty > 0),
    );
  }, []);

  const removeFromCart = useCallback((skuId: string) => {
    setCart((current) => current.filter((item) => item.skuId !== skuId));
  }, []);

  const toggleFavorite = useCallback((skuId: string) => {
    setSkus((current) =>
      current.map((sku) => (sku.id === skuId ? { ...sku, favorite: !sku.favorite } : sku)),
    );
  }, []);

  const fulfill = useCallback(
    (sku: Sku, qty: number, actor: string) => {
      if (sku.stock !== null && sku.stock < qty) return "Не хватает кодов на складе";
      const amount = sku.price * qty;
      if (balance < amount) return "Не хватает баланса";
      const codes = makeCodes(qty);
      const date = new Date().toISOString();
      const money = formatMoney(amount);
      const order: Order = {
        id: uid("A"),
        date,
        skuId: sku.id,
        skuName: sku.name,
        kind: sku.kind,
        qty,
        amount,
        status: "issued",
        actor,
        source: "cabinet",
        timeline: [
          { at: new Date(Date.parse(date) - 4500).toISOString(), title: "Заказ создан", detail: "В кабинете" },
          { at: new Date(Date.parse(date) - 2200).toISOString(), title: "Списание с баланса", detail: money },
          { at: date, title: "Выдано", detail: `${qty} шт` },
        ],
        codes,
      };
      setBalance((value) => value - amount);
      setOrders((rows) => [order, ...rows]);
      setTxs((rows) => [
        {
          id: uid("T"),
          date: order.date,
          type: "purchase",
          amount: -amount,
          note: `${sku.name} × ${qty}`,
          actor,
        },
        ...rows,
      ]);
      if (sku.stock !== null) {
        setSkus((rows) =>
          rows.map((row) => (row.id === sku.id ? { ...row, stock: (row.stock ?? 0) - qty } : row)),
        );
      }
      setIssued({
        title: "Коды выданы",
        codes,
      });
      setSelectedOrderId(order.id);
      return null;
    },
    [balance],
  );

  const buyNow = useCallback(
    (skuId: string, qty = 1) => {
      const sku = skus.find((row) => row.id === skuId);
      if (!sku) return "Нет позиции";
      return fulfill(sku, qty, ACCOUNT.name);
    },
    [fulfill, skus],
  );

  const checkout = useCallback(() => {
    if (!cart.length) return "Корзина пуста";
    if (balance < cartSum) {
      setScreenState("topup");
      return "Не хватает баланса — пополните";
    }
    const lines = cart.map((item) => ({ item, sku: skus.find((row) => row.id === item.skuId) }));
    for (const line of lines) {
      if (!line.sku) return "Нет позиции";
      if (line.sku.stock !== null && line.sku.stock < line.item.qty) return "Не хватает кодов на складе";
    }
    const created: Order[] = [];
    const extraTx: Transaction[] = [];
    const delta: Record<string, number> = {};
    const codesAll: string[] = [];
    const now = new Date().toISOString();
    for (const { item, sku } of lines) {
      if (!sku) continue;
      const codes = makeCodes(item.qty);
      const amount = sku.price * item.qty;
      const money = formatMoney(amount);
      created.push({
        id: uid("A"),
        date: now,
        skuId: sku.id,
        skuName: sku.name,
        kind: sku.kind,
        qty: item.qty,
        amount,
        status: "issued",
        actor: ACCOUNT.name,
        source: "cabinet",
        timeline: [
          { at: new Date(Date.parse(now) - 4500).toISOString(), title: "Заказ создан", detail: "В кабинете" },
          { at: new Date(Date.parse(now) - 2200).toISOString(), title: "Списание с баланса", detail: money },
          { at: now, title: "Выдано", detail: `${item.qty} шт` },
        ],
        codes,
      });
      extraTx.push({
        id: uid("T"),
        date: now,
        type: "purchase",
        amount: -amount,
        note: `${sku.name} × ${item.qty}`,
        actor: ACCOUNT.name,
      });
      if (sku.stock !== null) delta[sku.id] = (delta[sku.id] ?? 0) + item.qty;
      codesAll.push(...codes);
    }
    const issuedOrders = [...created].reverse();
    const issuedTx = [...extraTx].reverse();
    setBalance((value) => value - cartSum);
    setOrders((rows) => [...issuedOrders, ...rows]);
    setTxs((rows) => [...issuedTx, ...rows]);
    setSkus((rows) =>
      rows.map((row) => (delta[row.id] ? { ...row, stock: (row.stock ?? 0) - delta[row.id] } : row)),
    );
    setCart([]);
    setIssued({
      title: "Коды выданы",
      codes: codesAll,
    });
    if (issuedOrders[0]) setSelectedOrderId(issuedOrders[0].id);
    return null;
  }, [balance, cart, cartSum, skus]);

  const topup = useCallback((amount: number, method: PayMethod) => {
    const network = ACCOUNT.deposit.networks[method];
    const tag = Math.random().toString(36).slice(2, 10).toUpperCase();
    const address =
      method === "trc20"
        ? `TX${ACCOUNT.agentId}${tag}UsdtTrc20Dep`
        : `UQ${ACCOUNT.agentId}${tag}UsdtTonDep`;
    const now = Date.now();
    const invoice: Invoice = {
      id: uid("DEP"),
      date: new Date(now).toISOString(),
      amount,
      method,
      status: "waiting",
      asset: "USDT",
      address,
      expiresAt: new Date(now + 30 * 60 * 1000).toISOString(),
    };
    setInvoices((rows) => [invoice, ...rows]);
    ping(`${formatMoney(amount)} USDT · ${network.label}`);
    return invoice;
  }, [ping]);

  const expireDeposit = useCallback((id: string) => {
    setInvoices((rows) =>
      rows.map((item) => (item.id === id && item.status === "waiting" ? { ...item, status: "expired" as const } : item)),
    );
  }, []);

  const confirmDeposit = useCallback(
    (id: string) => {
      const row = invoices.find((item) => item.id === id);
      if (!row || row.status !== "waiting") return;
      if (Date.parse(row.expiresAt) <= Date.now()) {
        expireDeposit(id);
        ping("Время депозита истекло");
        return;
      }
      setInvoices((rows) => rows.map((item) => (item.id === id ? { ...item, status: "paid" as const } : item)));
      setBalance((value) => value + row.amount);
      const network = ACCOUNT.deposit.networks[row.method];
      setTxs((rows) => [
        {
          id: uid("T"),
          date: new Date().toISOString(),
          type: "topup",
          amount: row.amount,
          note: `USDT ${network.label}`,
          actor: ACCOUNT.name,
        },
        ...rows,
      ]);
      ping(`Зачислено ${formatMoney(row.amount)} USDT`);
    },
    [expireDeposit, invoices, ping],
  );

  const repeatOrder = useCallback(
    (id: string) => {
      const order = orders.find((row) => row.id === id);
      if (!order) return "Нет заказа";
      return buyNow(order.skuId, order.qty);
    },
    [buyNow, orders],
  );

  const retryDirect = useCallback((id: string) => {
    setOrders((rows) =>
      rows.map((row) => (row.id === id ? { ...row, status: "issued" } : row)),
    );
    ping("Повтор отправлен");
  }, [ping]);

  const invite = useCallback((name: string, login: string, role: StaffRole, limit: number | null) => {
    setStaff((rows) => [
      ...rows,
      { id: uid("u"), name, login, role, limit, spent: 0, active: true },
    ]);
    ping("Доступ выдан");
  }, [ping]);

  const rotateKey = useCallback(() => {
    setLiveKey(`ak_live_${Math.random().toString(36).slice(2, 16)}`);
    ping("Ключ перевыпущен");
  }, [ping]);

  const copyText = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      ping("Скопировано");
    } catch {
      ping("Не удалось скопировать");
    }
  }, [ping]);

  const markRead = useCallback((id: string) => {
    setNotices((rows) => rows.map((row) => (row.id === id ? { ...row, unread: false } : row)));
  }, []);

  const value: CabinetValue = {
    screen,
    setScreen,
    theme,
    toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    period,
    setPeriod,
    balance,
    reserved: ACCOUNT.reserved,
    skus,
    cart,
    orders,
    txs,
    staff,
    invoices,
    notices,
    settings,
    setSettings,
    issued,
    closeIssued: () => setIssued(null),
    toast,
    apiLog: API_LOG,
    liveKey,
    rotateKey,
    cartSum,
    cartCount,
    selectedOrderId,
    selectOrder,
    openOrder,
    addToCart,
    setQty,
    removeFromCart,
    toggleFavorite,
    buyNow,
    checkout,
    topup,
    confirmDeposit,
    expireDeposit,
    repeatOrder,
    retryDirect,
    invite,
    copyText,
    markRead,
  };

  return <CabinetContext.Provider value={value}>{children}</CabinetContext.Provider>;
}

export function useCabinet() {
  const value = useContext(CabinetContext);
  if (!value) throw new Error("CabinetProvider missing");
  return value;
}
