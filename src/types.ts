export type ScreenKey =
  | "overview"
  | "catalog"
  | "cart"
  | "topup"
  | "transactions"
  | "orders"
  | "direct"
  | "staff"
  | "api"
  | "docs"
  | "settings";

export type ProductKind = "code" | "key" | "direct";
export type PeriodKey = "7d" | "30d" | "90d";
export type ThemeName = "dark" | "light";
export type OrderStatus = "issued" | "pending" | "failed" | "refunded";
export type TxType = "purchase" | "topup" | "reserve" | "refund" | "staff";
export type StaffRole = "owner" | "buyer" | "finance" | "viewer" | "api";
export type PayMethod = "trc20" | "ton";
export type InvoiceStatus = "paid" | "waiting" | "expired";

export type Sku = {
  id: string;
  productId: string;
  name: string;
  kind: ProductKind;
  group: string;
  variant: string;
  face: number;
  category: string;
  price: number;
  stock: number | null;
  favorite: boolean;
};

export type CartItem = {
  skuId: string;
  qty: number;
};

export type OrderSource = "cabinet" | "api";

export type OrderEvent = {
  at: string;
  title: string;
  detail?: string;
};

export type Order = {
  id: string;
  date: string;
  skuId: string;
  skuName: string;
  kind: ProductKind;
  qty: number;
  amount: number;
  status: OrderStatus;
  actor: string;
  source: OrderSource;
  apiRequestId?: string;
  timeline: OrderEvent[];
  codes?: string[];
};

export type Transaction = {
  id: string;
  date: string;
  type: TxType;
  amount: number;
  note: string;
  actor: string;
};

export type StaffMember = {
  id: string;
  name: string;
  login: string;
  role: StaffRole;
  limit: number | null;
  spent: number;
  active: boolean;
};

export type Invoice = {
  id: string;
  date: string;
  amount: number;
  method: PayMethod;
  status: InvoiceStatus;
  asset: "USDT";
  address: string;
  /** ISO — адрес живёт 30 минут */
  expiresAt: string;
};

export type ApiCall = {
  id: string;
  time: string;
  method: string;
  path: string;
  status: number;
  ms: number;
};

export type Notice = {
  id: string;
  title: string;
  text: string;
  time: string;
  unread: boolean;
  screen?: ScreenKey;
};

export type Settings = {
  organization: string;
  notifyLow: boolean;
  notifyFail: boolean;
  notifyStaff: boolean;
  twoFa: boolean;
  autoDraft: boolean;
  autoBelow: number;
};
