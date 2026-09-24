import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ACCOUNT } from "../data/seed";
import { formatMoney, todayLabel } from "../format";
import { NAV, screenLabel } from "../nav";
import { useCabinet } from "../state";
import type { ScreenKey } from "../types";
import {
  BellIcon,
  ChevIcon,
  CloseIcon,
  GroupChev,
  MoonIcon,
  NavIcon,
  SunIcon,
  WalletIcon,
} from "./Icons";

type Props = { children: ReactNode };

export function Shell({ children }: Props) {
  const {
    screen,
    setScreen,
    theme,
    toggleTheme,
    cartSum,
    cartCount,
    balance,
    notices,
    markRead,
    issued,
    closeIssued,
    toast,
    copyText,
  } = useCabinet();

  const [pop, setPop] = useState<"account" | "notif" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const [closedGroups, setClosedGroups] = useState<string[]>([]);

  const unread = notices.filter((item) => item.unread).length;
  const date = useMemo(() => todayLabel(), []);

  function go(key: ScreenKey) {
    setScreen(key);
    setPop(null);
    setMenuOpen(false);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setPop(null);
      setMenuOpen(false);
      setLogout(false);
    }
    function onPointer(event: PointerEvent) {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest("#account") && !event.target.closest("#notif")) setPop(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return (
    <div className={menuOpen ? "shell is-menu-open" : "shell"}>
      <button className="scrim" type="button" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} />

      <aside className="aside">
        <div className="aside-head">
          <div className="brand">
            <span className="brand-mark">xcode</span>
            <span className="brand-sub">Кабинет агента</span>
          </div>
          <button className="aside-close" type="button" aria-label="Закрыть" onClick={() => setMenuOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <nav className="nav">
          {NAV.map((group) => {
            const open = !closedGroups.includes(group.id);
            const hasActive = group.items.some((item) => item.key === screen);
            const shown = open || hasActive;
            return (
              <div key={group.id} className={shown ? "group" : "group is-collapsed"}>
                <button
                  className="group-title"
                  type="button"
                  onClick={() =>
                    setClosedGroups((current) =>
                      current.includes(group.id)
                        ? current.filter((id) => id !== group.id)
                        : [...current, group.id],
                    )
                  }
                >
                  <span>{group.title}</span>
                  <GroupChev />
                </button>
                <div className="group-items">
                  <div className="group-inner">
                    {group.items.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        className={item.key === screen ? "nav-item is-active" : "nav-item"}
                        onClick={() => go(item.key)}
                      >
                        <span className="chip">
                          <NavIcon screen={item.key} />
                        </span>
                        <span className="nav-label">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        <div className="aside-foot">
          <div className="cart">
            <div className="kicker">Корзина</div>
            <div className="sum-row">
              <div className="sum">{formatMoney(cartSum)}</div>
              <div className="meta">{cartCount ? `${cartCount} шт` : "пусто"}</div>
            </div>
            <button className="cart-link" type="button" onClick={() => go("cart")}>
              Открыть корзину →
            </button>
          </div>
        </div>
      </aside>

      <div className="stage">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className={menuOpen ? "burger-btn is-open" : "burger-btn"}
              type="button"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              onClick={() => {
                setPop(null);
                setMenuOpen((value) => !value);
              }}
            >
              <span className="burger-lines" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
            <span className="topbar-title">{screenLabel(screen)}</span>
          </div>
          <div className="dock">
            <span className="dock-cell is-quiet">{date}</span>
            <button
              className="dock-cell"
              type="button"
              onClick={() => go("transactions")}
              aria-label={`Баланс ${formatMoney(balance)}`}
            >
              <WalletIcon />
              <span className="mono">{formatMoney(balance)}</span>
            </button>
            <div className="pop" id="notif">
              <button
                className={pop === "notif" ? "dock-cell is-icon is-open" : "dock-cell is-icon"}
                type="button"
                aria-label="Уведомления"
                aria-expanded={pop === "notif"}
                onClick={(event) => {
                  event.stopPropagation();
                  setPop((current) => (current === "notif" ? null : "notif"));
                }}
              >
                <BellIcon />
                {unread > 0 && <span className="badge">{unread > 99 ? "99+" : unread}</span>}
              </button>
              {pop === "notif" && (
                <div className="bubble notif-bubble">
                  <div className="bubble-head">
                    <span className="notif-title">Уведомления</span>
                    {unread > 0 && <span className="count">{unread}</span>}
                  </div>
                  <div className="notes">
                    {notices.map((note) => (
                      <button
                        key={note.id}
                        className="note"
                        type="button"
                        onClick={() => {
                          markRead(note.id);
                          if (note.screen) go(note.screen);
                          else setPop(null);
                        }}
                      >
                        <strong>{note.title}</strong>
                        <span>{note.text}</span>
                        <time>{note.time}</time>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="pop" id="account">
              <button
                className={pop === "account" ? "dock-cell is-open" : "dock-cell"}
                type="button"
                aria-expanded={pop === "account"}
                onClick={(event) => {
                  event.stopPropagation();
                  setPop((current) => (current === "account" ? null : "account"));
                }}
              >
                <span>{ACCOUNT.login}</span>
                <ChevIcon />
              </button>
              {pop === "account" && (
                <div className="bubble account-bubble">
                  <div className="bubble-head">
                    <span className="avatar">{ACCOUNT.name.slice(0, 1)}</span>
                    <span className="who">
                      <b>{ACCOUNT.name}</b>
                      <small>{ACCOUNT.role}</small>
                    </span>
                    <button className="theme-btn" type="button" aria-label="Сменить тему" onClick={toggleTheme}>
                      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                    </button>
                  </div>
                  <div className="actions">
                    <button className="action is-cabinet" type="button" onClick={() => go("settings")}>
                      Кабинет
                    </button>
                    <button
                      className="action is-logout"
                      type="button"
                      onClick={() => {
                        setPop(null);
                        setLogout(true);
                      }}
                    >
                      Выйти
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="main">{children}</main>
      </div>

      {logout && (
        <div
          className="dialog-back"
          onClick={(event) => {
            if (event.target === event.currentTarget) setLogout(false);
          }}
        >
          <div className="dialog" role="dialog" aria-modal="true">
            <h2>Выход из аккаунта</h2>
            <p>Выйти из аккаунта {ACCOUNT.name}?</p>
            <div className="dialog-actions">
              <button className="btn" type="button" onClick={() => setLogout(false)}>
                Отмена
              </button>
              <button className="btn btn-danger" type="button" onClick={() => setLogout(false)}>
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}

      {issued && (
        <div
          className="dialog-back"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeIssued();
          }}
        >
          <div className="dialog wide" role="dialog" aria-modal="true">
            <h2>{issued.title}</h2>
            <p>Коды только в кабинете. Скопируйте или скачайте файл.</p>
            <div className="code-list">
              {issued.codes.map((code) => (
                <div className="code-row" key={code}>
                  <span>{code}</span>
                  <button className="btn btn-ghost" type="button" onClick={() => copyText(code)}>
                    Копировать
                  </button>
                </div>
              ))}
            </div>
            <div className="dialog-actions">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  const blob = new Blob([issued.codes.join("\n")], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "codes.txt";
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Скачать .txt
              </button>
              <button className="btn btn-primary" type="button" onClick={() => copyText(issued.codes.join("\n"))}>
                Копировать все
              </button>
              <button className="btn" type="button" onClick={closeIssued}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
