import type { ScreenKey } from "./types";

export type NavItem = { key: ScreenKey; label: string };
export type NavGroup = { id: string; title: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    id: "work",
    title: "Работа",
    items: [
      { key: "overview", label: "Главная" },
      { key: "catalog", label: "Витрина" },
      { key: "cart", label: "Корзина" },
    ],
  },
  {
    id: "money",
    title: "Деньги",
    items: [
      { key: "topup", label: "Пополнить" },
      { key: "transactions", label: "Движения" },
    ],
  },
  {
    id: "issue",
    title: "Выдачи",
    items: [
      { key: "orders", label: "Мои заказы" },
      { key: "direct", label: "Прямые" },
    ],
  },
  {
    id: "team",
    title: "Команда",
    items: [{ key: "staff", label: "Сотрудники" }],
  },
  {
    id: "int",
    title: "Интеграции",
    items: [
      { key: "api", label: "API и ключи" },
      { key: "docs", label: "Как подключить" },
    ],
  },
  {
    id: "sys",
    title: "Кабинет",
    items: [{ key: "settings", label: "Настройки" }],
  },
];

export function screenLabel(key: ScreenKey) {
  for (const group of NAV) {
    const found = group.items.find((item) => item.key === key);
    if (found) return found.label;
  }
  return "Кабинет";
}
