import type { ProductKind } from "../types";

export type CatalogTone =
  | "apple"
  | "steam"
  | "play"
  | "xbox"
  | "ms"
  | "adobe"
  | "mts"
  | "mega"
  | "tele"
  | "pubg";

export type CatalogProduct = {
  id: string;
  title: string;
  brand: string;
  blurb: string;
  kind: ProductKind;
  category: string;
  tone: CatalogTone;
  mark: string;
  unit: "usd" | "uc" | "text";
};

export const PRODUCTS: CatalogProduct[] = [
  {
    id: "apple",
    title: "App Store",
    brand: "Apple",
    blurb: "Коды пополнения. После списания сразу в кабинете — скопировать или скачать файл.",
    kind: "code",
    category: "Мобильные",
    tone: "apple",
    mark: "A",
    unit: "usd",
  },
  {
    id: "steam",
    title: "Steam Wallet",
    brand: "Steam",
    blurb: "Пополнение кошелька. Код выдаётся агенту, не на аккаунт Steam.",
    kind: "code",
    category: "Игры",
    tone: "steam",
    mark: "S",
    unit: "usd",
  },
  {
    id: "playstation",
    title: "PlayStation Store",
    brand: "PlayStation",
    blurb: "Коды магазина. Номинал выбирается на карточке, выдача — в кабинете.",
    kind: "code",
    category: "Игры",
    tone: "play",
    mark: "PS",
    unit: "usd",
  },
  {
    id: "xbox",
    title: "Xbox",
    brand: "Xbox",
    blurb: "Подарочные коды Microsoft Store / Xbox. Без привязки к профилю.",
    kind: "code",
    category: "Игры",
    tone: "xbox",
    mark: "X",
    unit: "usd",
  },
  {
    id: "xbox-gp",
    title: "Game Pass",
    brand: "Xbox",
    blurb: "Подписка на месяц. Ключ появляется в кабинете сразу после оплаты.",
    kind: "code",
    category: "Игры",
    tone: "xbox",
    mark: "GP",
    unit: "text",
  },
  {
    id: "windows",
    title: "Windows 11 Pro",
    brand: "Microsoft",
    blurb: "Розничный ключ. Одна позиция — один ключ в выдаче.",
    kind: "key",
    category: "Софт",
    tone: "ms",
    mark: "W",
    unit: "text",
  },
  {
    id: "office",
    title: "Office 2021",
    brand: "Microsoft",
    blurb: "Ключ Office. Выдача тем же окном, что и для кодов.",
    kind: "key",
    category: "Софт",
    tone: "ms",
    mark: "O",
    unit: "text",
  },
  {
    id: "adobe",
    title: "Photoshop",
    brand: "Adobe",
    blurb: "Месяц Photoshop. Ключ остаётся в кабинете.",
    kind: "key",
    category: "Софт",
    tone: "adobe",
    mark: "Ps",
    unit: "text",
  },
  {
    id: "mts",
    title: "МТС",
    brand: "МТС",
    blurb: "Код пополнения. На сайте не уходит на номер — только в кабинет.",
    kind: "direct",
    category: "Связь",
    tone: "mts",
    mark: "М",
    unit: "usd",
  },
  {
    id: "megafon",
    title: "МегаФон",
    brand: "МегаФон",
    blurb: "Код пополнения. Номинал на карточке, выдача сразу после списания.",
    kind: "direct",
    category: "Связь",
    tone: "mega",
    mark: "Мф",
    unit: "usd",
  },
  {
    id: "tele2",
    title: "Tele2",
    brand: "Tele2",
    blurb: "Код пополнения. Без логина и телефона на витрине.",
    kind: "direct",
    category: "Связь",
    tone: "tele",
    mark: "T2",
    unit: "usd",
  },
  {
    id: "pubg",
    title: "PUBG Mobile UC",
    brand: "PUBG",
    blurb: "Коды UC. Покупка на сайте — список кодов в кабинете.",
    kind: "direct",
    category: "Игры",
    tone: "pubg",
    mark: "P",
    unit: "uc",
  },
];

export function productById(id: string) {
  return PRODUCTS.find((item) => item.id === id);
}

export function faceCaption(unit: CatalogProduct["unit"], sku: { face: number; variant: string }) {
  if (unit === "usd") return `$${sku.face}`;
  if (unit === "uc") return `${sku.face} UC`;
  return sku.variant;
}
