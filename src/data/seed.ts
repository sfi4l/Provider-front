import type {
  ApiCall,
  Invoice,
  Notice,
  Order,
  Settings,
  Sku,
  StaffMember,
  Transaction,
} from "../types";

export const TODAY = new Date(2026, 8, 23, 22, 40, 0);

export const ACCOUNT = {
  login: "stepa",
  name: "Степан",
  role: "Владелец",
  agentId: "1842",
  region: "Северный регион",
  balance: 24_864,
  reserved: 1_864,
  liveKey: "ak_live_9f3c2e1a7b84d0",
  sandboxKey: "ak_test_4c81e0bb29aa",
  webhook: "https://agent.nordcode.ru/hooks/xcode",
  deposit: {
    asset: "USDT" as const,
    networks: {
      trc20: {
        id: "trc20" as const,
        label: "TRC20",
        chain: "Tron",
        min: 10,
        eta: "1–3 мин",
        feeHint: "комиссия сети Tron",
      },
      ton: {
        id: "ton" as const,
        label: "TON",
        chain: "The Open Network",
        min: 10,
        eta: "до 1 мин",
        feeHint: "комиссия сети TON",
      },
    },
  },
};

export const SETTINGS: Settings = {
  organization: "ООО «НордКод»",
  notifyLow: true,
  notifyFail: true,
  notifyStaff: true,
  twoFa: false,
  autoDraft: true,
  autoBelow: 2000,
};

function at(daysAgo: number, hour: number, minute: number) {
  const date = new Date(TODAY);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const SKUS: Sku[] = [
  { id: "sku-app5", productId: "apple", name: "App Store 5 USD", kind: "code", group: "Apple", variant: "5", face: 5, category: "Мобильные", price: 4.85, stock: 240, favorite: false },
  { id: "sku-app", productId: "apple", name: "App Store 10 USD", kind: "code", group: "Apple", variant: "10", face: 10, category: "Мобильные", price: 9.8, stock: 186, favorite: true },
  { id: "sku-app25", productId: "apple", name: "App Store 25 USD", kind: "code", group: "Apple", variant: "25", face: 25, category: "Мобильные", price: 24.4, stock: 94, favorite: false },
  { id: "sku-st1000", productId: "steam", name: "Steam 10 USD", kind: "code", group: "Steam", variant: "10", face: 10, category: "Игры", price: 9.7, stock: 184, favorite: true },
  { id: "sku-st2500", productId: "steam", name: "Steam 25 USD", kind: "code", group: "Steam", variant: "25", face: 25, category: "Игры", price: 24.1, stock: 62, favorite: false },
  { id: "sku-st50", productId: "steam", name: "Steam 50 USD", kind: "code", group: "Steam", variant: "50", face: 50, category: "Игры", price: 47.9, stock: 41, favorite: false },
  { id: "sku-ps10", productId: "playstation", name: "PlayStation Store 10 USD", kind: "code", group: "PlayStation", variant: "10", face: 10, category: "Игры", price: 9.6, stock: 73, favorite: false },
  { id: "sku-ps25", productId: "playstation", name: "PlayStation Store 25 USD", kind: "code", group: "PlayStation", variant: "25", face: 25, category: "Игры", price: 22.8, stock: 41, favorite: true },
  { id: "sku-ps50", productId: "playstation", name: "PlayStation Store 50 USD", kind: "code", group: "PlayStation", variant: "50", face: 50, category: "Игры", price: 45.5, stock: 22, favorite: false },
  { id: "sku-xbox10", productId: "xbox", name: "Xbox 10 USD", kind: "code", group: "Xbox", variant: "10", face: 10, category: "Игры", price: 9.7, stock: 38, favorite: false },
  { id: "sku-xbox25", productId: "xbox", name: "Xbox 25 USD", kind: "code", group: "Xbox", variant: "25", face: 25, category: "Игры", price: 24.2, stock: 19, favorite: false },
  { id: "sku-xbox", productId: "xbox-gp", name: "Xbox Game Pass 1 мес", kind: "code", group: "Xbox", variant: "1 мес", face: 1, category: "Игры", price: 8.9, stock: 18, favorite: false },
  { id: "sku-win", productId: "windows", name: "Windows 11 Pro", kind: "key", group: "Microsoft", variant: "Win 11", face: 11, category: "Софт", price: 41.2, stock: 27, favorite: false },
  { id: "sku-off", productId: "office", name: "Office 2021", kind: "key", group: "Microsoft", variant: "Office", face: 2021, category: "Софт", price: 26.8, stock: 14, favorite: true },
  { id: "sku-psn", productId: "adobe", name: "Adobe Photoshop 1 мес", kind: "key", group: "Adobe", variant: "1 мес", face: 1, category: "Софт", price: 15.4, stock: 33, favorite: false },
  { id: "sku-mts", productId: "mts", name: "МТС 5 USD", kind: "direct", group: "МТС", variant: "5", face: 5, category: "Связь", price: 4.87, stock: null, favorite: true },
  { id: "sku-mts10", productId: "mts", name: "МТС 10 USD", kind: "direct", group: "МТС", variant: "10", face: 10, category: "Связь", price: 9.7, stock: null, favorite: false },
  { id: "sku-mts25", productId: "mts", name: "МТС 25 USD", kind: "direct", group: "МТС", variant: "25", face: 25, category: "Связь", price: 24.1, stock: null, favorite: false },
  { id: "sku-meg5", productId: "megafon", name: "МегаФон 5 USD", kind: "direct", group: "МегаФон", variant: "5", face: 5, category: "Связь", price: 4.85, stock: null, favorite: false },
  { id: "sku-meg", productId: "megafon", name: "МегаФон 10 USD", kind: "direct", group: "МегаФон", variant: "10", face: 10, category: "Связь", price: 9.7, stock: null, favorite: false },
  { id: "sku-meg25", productId: "megafon", name: "МегаФон 25 USD", kind: "direct", group: "МегаФон", variant: "25", face: 25, category: "Связь", price: 24, stock: null, favorite: false },
  { id: "sku-tele", productId: "tele2", name: "Tele2 3 USD", kind: "direct", group: "Tele2", variant: "3", face: 3, category: "Связь", price: 2.92, stock: null, favorite: false },
  { id: "sku-tele5", productId: "tele2", name: "Tele2 5 USD", kind: "direct", group: "Tele2", variant: "5", face: 5, category: "Связь", price: 4.8, stock: null, favorite: false },
  { id: "sku-tele10", productId: "tele2", name: "Tele2 10 USD", kind: "direct", group: "Tele2", variant: "10", face: 10, category: "Связь", price: 9.5, stock: null, favorite: false },
  { id: "sku-pubg", productId: "pubg", name: "PUBG Mobile 60 UC", kind: "direct", group: "PUBG", variant: "60", face: 60, category: "Игры", price: 0.79, stock: null, favorite: false },
  { id: "sku-pubg325", productId: "pubg", name: "PUBG Mobile 325 UC", kind: "direct", group: "PUBG", variant: "325", face: 325, category: "Игры", price: 4.2, stock: null, favorite: false },
];

function shift(iso: string, ms: number) {
  return new Date(Date.parse(iso) + ms).toISOString();
}

function issuedTimeline(date: string, source: "cabinet" | "api", qty: number, amountNote: string) {
  return [
    { at: shift(date, -4500), title: "Заказ создан", detail: source === "api" ? "Через API" : "В кабинете" },
    { at: shift(date, -2200), title: "Списание с баланса", detail: amountNote },
    { at: date, title: "Выдано", detail: `${qty} шт` },
  ];
}

export const ORDERS: Order[] = [
  {
    id: "A-4821",
    date: at(0, 21, 12),
    skuId: "sku-st1000",
    skuName: "Steam 10 USD",
    kind: "code",
    qty: 4,
    amount: 38.8,
    status: "issued",
    actor: "Степан",
    source: "cabinet",
    timeline: issuedTimeline(at(0, 21, 12), "cabinet", 4, "$38.80"),
    codes: ["K7Q2-M1LA-9XPC-TT04", "B3N8-Q0WE-2HJK-881C", "P9AA-44LM-ZX12-QQ7R", "D1C0-88VT-PLM2-09KA"],
  },
  {
    id: "A-4820",
    date: at(0, 18, 40),
    skuId: "sku-mts",
    skuName: "МТС 5 USD",
    kind: "direct",
    qty: 1,
    amount: 4.87,
    status: "issued",
    actor: "Илья",
    source: "cabinet",
    timeline: issuedTimeline(at(0, 18, 40), "cabinet", 1, "$4.87"),
    codes: ["MTS5-K7Q2-M1LA-14C2"],
  },
  {
    id: "A-4819",
    date: at(0, 14, 5),
    skuId: "sku-win",
    skuName: "Windows 11 Pro",
    kind: "key",
    qty: 2,
    amount: 82.4,
    status: "issued",
    actor: "Shop bot",
    source: "api",
    apiRequestId: "req_7f3a2c91",
    timeline: issuedTimeline(at(0, 14, 5), "api", 2, "$82.40"),
    codes: ["VK7GM-2T8QH-9XPLA-BB21K-M0QWE", "NP3CX-88A1L-Q2RTY-09BNM-ZXCVB"],
  },
  {
    id: "A-4814",
    date: at(1, 11, 22),
    skuId: "sku-ps25",
    skuName: "PlayStation Store 25 USD",
    kind: "code",
    qty: 1,
    amount: 22.8,
    status: "failed",
    actor: "Марина",
    source: "cabinet",
    timeline: [
      { at: shift(at(1, 11, 22), -3800), title: "Заказ создан", detail: "В кабинете" },
      { at: shift(at(1, 11, 22), -1800), title: "Списание с баланса", detail: "$22.80" },
      { at: at(1, 11, 22), title: "Ошибка выдачи", detail: "Провайдер не ответил" },
    ],
  },
  {
    id: "A-4802",
    date: at(3, 16, 8),
    skuId: "sku-off",
    skuName: "Office 2021",
    kind: "key",
    qty: 1,
    amount: 26.8,
    status: "refunded",
    actor: "Степан",
    source: "cabinet",
    timeline: [
      { at: shift(at(3, 16, 8), -86400000), title: "Заказ создан", detail: "В кабинете" },
      { at: shift(at(3, 16, 8), -86398000), title: "Списание с баланса", detail: "$26.80" },
      { at: shift(at(3, 16, 8), -86396000), title: "Выдано", detail: "1 шт" },
      { at: at(3, 16, 8), title: "Возврат", detail: "$26.80" },
    ],
  },
  {
    id: "A-4788",
    date: at(6, 10, 15),
    skuId: "sku-meg",
    skuName: "МегаФон 10 USD",
    kind: "direct",
    qty: 3,
    amount: 29.1,
    status: "issued",
    actor: "Илья",
    source: "cabinet",
    timeline: issuedTimeline(at(6, 10, 15), "cabinet", 3, "$29.10"),
    codes: ["MF10-P9AA-44LM-QQ7R", "MF10-D1C0-88VT-09KA", "MF10-B3N8-Q0WE-881C"],
  },
  {
    id: "A-4701",
    date: at(18, 12, 0),
    skuId: "sku-st2500",
    skuName: "Steam 25 USD",
    kind: "code",
    qty: 6,
    amount: 144.6,
    status: "issued",
    actor: "Shop bot",
    source: "api",
    apiRequestId: "req_1a90bb44",
    timeline: issuedTimeline(at(18, 12, 0), "api", 6, "$144.60"),
    codes: [
      "ST25-AA11-BB22-CC33",
      "ST25-DD44-EE55-FF66",
      "ST25-GG77-HH88-II99",
      "ST25-JJ00-KK11-LL22",
      "ST25-MM33-NN44-OO55",
      "ST25-PP66-QQ77-RR88",
    ],
  },
  {
    id: "A-4610",
    date: at(40, 9, 40),
    skuId: "sku-xbox",
    skuName: "Xbox Game Pass 1 мес",
    kind: "code",
    qty: 10,
    amount: 89,
    status: "issued",
    actor: "Марина",
    source: "cabinet",
    timeline: issuedTimeline(at(40, 9, 40), "cabinet", 10, "$89.00"),
    codes: [
      "XBGP-01-A1B2-C3D4",
      "XBGP-02-E5F6-G7H8",
      "XBGP-03-I9J0-K1L2",
      "XBGP-04-M3N4-O5P6",
      "XBGP-05-Q7R8-S9T0",
      "XBGP-06-U1V2-W3X4",
      "XBGP-07-Y5Z6-A7B8",
      "XBGP-08-C9D0-E1F2",
      "XBGP-09-G3H4-I5J6",
      "XBGP-10-K7L8-M9N0",
    ],
  },
];

export const TRANSACTIONS: Transaction[] = [
  { id: "T-9021", date: at(0, 21, 12), type: "purchase", amount: -38.8, note: "Steam 10 USD × 4", actor: "Степан" },
  { id: "T-9020", date: at(0, 18, 40), type: "purchase", amount: -4.87, note: "МТС 5 USD × 1", actor: "Илья" },
  { id: "T-9018", date: at(0, 14, 5), type: "purchase", amount: -82.4, note: "Windows 11 Pro × 2", actor: "Степан" },
  { id: "T-9011", date: at(1, 9, 0), type: "topup", amount: 2500, note: "USDT TRC20", actor: "Степан" },
  { id: "T-9004", date: at(1, 11, 22), type: "staff", amount: -22.8, note: "Покупка сотрудника", actor: "Марина" },
  { id: "T-8990", date: at(3, 16, 20), type: "refund", amount: 26.8, note: "Возврат Office 2021", actor: "Степан" },
  { id: "T-8802", date: at(12, 11, 0), type: "topup", amount: 5000, note: "USDT TON", actor: "Степан" },
  { id: "T-8700", date: at(28, 15, 30), type: "purchase", amount: -144.6, note: "Steam 25 USD × 6", actor: "Степан" },
];

export const STAFF: StaffMember[] = [
  { id: "u-1", name: "Степан", login: "stepa", role: "owner", limit: null, spent: 1842, active: true },
  { id: "u-2", name: "Илья Котов", login: "ilya", role: "buyer", limit: 500, spent: 184.2, active: true },
  { id: "u-3", name: "Марина Ли", login: "marina", role: "finance", limit: 2000, spent: 22.8, active: true },
  { id: "u-4", name: "Артём", login: "artem", role: "viewer", limit: 0, spent: 0, active: true },
  { id: "u-5", name: "Shop bot", login: "bot", role: "api", limit: 10000, spent: 640, active: true },
];

export const INVOICES: Invoice[] = [
  {
    id: "DEP-1104",
    date: at(1, 9, 0),
    amount: 2500,
    method: "trc20",
    status: "paid",
    asset: "USDT",
    address: "TXk9QmW7pL1842aBcDeFgHiJkTrc20Usdt01",
    expiresAt: at(1, 9, 30),
  },
  {
    id: "DEP-1103",
    date: at(12, 11, 0),
    amount: 5000,
    method: "ton",
    status: "paid",
    asset: "USDT",
    address: "UQAx7k9mN2pQ1842TonUsdtDepositWallet02",
    expiresAt: at(12, 11, 30),
  },
  {
    id: "DEP-1105",
    date: at(0, 10, 20),
    amount: 1000,
    method: "trc20",
    status: "waiting",
    asset: "USDT",
    address: "TX3rF8sL2n1842PendingTrc20UsdtAddr03",
    expiresAt: new Date(Date.now() + 28 * 60 * 1000).toISOString(),
  },
];

export const API_LOG: ApiCall[] = [
  { id: "r1", time: at(0, 21, 12), method: "POST", path: "/v1/orders", status: 201, ms: 84 },
  { id: "r2", time: at(0, 21, 12), method: "GET", path: "/v1/balance", status: 200, ms: 22 },
  { id: "r3", time: at(0, 18, 41), method: "POST", path: "/v1/direct", status: 202, ms: 140 },
  { id: "r4", time: at(0, 14, 6), method: "POST", path: "/v1/orders", status: 201, ms: 91 },
  { id: "r5", time: at(1, 11, 22), method: "POST", path: "/v1/orders", status: 409, ms: 38 },
];

export const NOTICES: Notice[] = [
  {
    id: "n3",
    title: "Счёт оплачен",
    text: "DEP-1104 зачислен на баланс, 2 500 USDT (TRC20).",
    time: "вчера",
    unread: false,
    screen: "transactions",
  },
];

export const PERIODS = [
  { key: "7d" as const, label: "7 дней", days: 7 },
  { key: "30d" as const, label: "30 дней", days: 30 },
  { key: "90d" as const, label: "Квартал", days: 90 },
];
