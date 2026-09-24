import type { ThemeConfig } from "antd";
import type { ThemeName } from "./types";

export function antdTheme(mode: ThemeName): ThemeConfig {
  const dark = mode === "dark";
  return {
    token: {
      colorPrimary: dark ? "#6f97d8" : "#2f5b9a",
      colorInfo: dark ? "#6f97d8" : "#2f5b9a",
      colorSuccess: dark ? "#7eb08a" : "#2f6b45",
      colorError: dark ? "#e07078" : "#c23b4a",
      colorText: dark ? "#f2f3f6" : "#14161c",
      colorTextSecondary: dark ? "#a6acb8" : "#5a6170",
      colorBorder: dark ? "#353b48" : "#d0d5de",
      colorBgContainer: dark ? "#171a20" : "#ffffff",
      colorBgElevated: dark ? "#1e222a" : "#ffffff",
      colorBgLayout: dark ? "#0a0b0e" : "#eef0f3",
      borderRadius: 12,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      fontSize: 14,
      controlHeight: 32,
      boxShadow: "none",
    },
    components: {
      Table: {
        headerBg: dark ? "#1e222a" : "#f1f3f6",
        headerColor: dark ? "#7c8494" : "#8b93a3",
        rowHoverBg: dark ? "#282d38" : "#e8ebf0",
        borderColor: dark ? "#262b35" : "#e2e5eb",
        cellPaddingBlock: 10,
      },
      Button: { primaryShadow: "none", defaultShadow: "none" },
      Modal: {
        contentBg: dark ? "#171a20" : "#ffffff",
        headerBg: dark ? "#171a20" : "#ffffff",
      },
    },
  };
}
