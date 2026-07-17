import { ConfigProvider, theme as antdTheme } from "antd";
import { useIsDarkMode } from "../../lib/useIsDarkMode";

// Scoped to the specific pages that actually render antd components
// (Community, Admin posts) instead of wrapping the whole app — antd is a
// heavy dependency, and importing it from main.jsx forced every route,
// including the home page, to download it upfront.
export default function AntdThemeProvider({ children }) {
  const isDark = useIsDarkMode();
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#8C7AE6",
          borderRadius: 12,
          fontFamily: "'Nunito', sans-serif",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
