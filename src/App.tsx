import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { CabinetProvider, useCabinet } from "./state";
import { Shell } from "./layout/Shell";
import { antdTheme } from "./theme";
import { OverviewPage } from "./pages/OverviewPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CartPage } from "./pages/CartPage";
import { TopupPage } from "./pages/TopupPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { OrdersPage } from "./pages/OrdersPage";
import { DirectPage } from "./pages/DirectPage";
import { StaffPage } from "./pages/StaffPage";
import { ApiPage } from "./pages/ApiPage";
import { DocsPage } from "./pages/DocsPage";
import { SettingsPage } from "./pages/SettingsPage";

function Screen() {
  const { screen } = useCabinet();
  if (screen === "catalog") return <CatalogPage />;
  if (screen === "cart") return <CartPage />;
  if (screen === "topup") return <TopupPage />;
  if (screen === "transactions") return <TransactionsPage />;
  if (screen === "orders") return <OrdersPage />;
  if (screen === "direct") return <DirectPage />;
  if (screen === "staff") return <StaffPage />;
  if (screen === "api") return <ApiPage />;
  if (screen === "docs") return <DocsPage />;
  if (screen === "settings") return <SettingsPage />;
  return <OverviewPage />;
}

function Themed() {
  const { theme } = useCabinet();
  return (
    <ConfigProvider locale={ruRU} theme={antdTheme(theme)}>
      <Shell>
        <Screen />
      </Shell>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <CabinetProvider>
      <Themed />
    </CabinetProvider>
  );
}
