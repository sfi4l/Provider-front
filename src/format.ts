const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateTime = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatMoney(value: number) {
  return money.format(value);
}

export function formatCompact(value: number) {
  return compact.format(value);
}

export function formatDateTime(iso: string) {
  return dateTime.format(new Date(iso)).replace(".", "");
}

export function todayLabel(date = new Date()) {
  const raw = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function makeCode() {
  const chunk = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${chunk()}-${chunk()}-${chunk()}-${chunk()}`;
}

export function makeCodes(count: number) {
  return Array.from({ length: count }, makeCode);
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
