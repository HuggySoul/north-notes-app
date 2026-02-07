import { theme as antdTheme, type ThemeConfig } from "antd";
import type { ThemeMode } from "./theme.types";

const baseTheme: ThemeConfig = {
  token: {
    colorPrimary: "#fa8c16",
    colorInfo: "#fa8c16",
    colorWarning: "#fadb14",
    fontSize: 15,
    borderRadius: 10,
    controlHeightLG: 52,
  },
};

/** Задаёт токены и пресеты компонентов */
export function getThemeConfig(mode: ThemeMode): ThemeConfig {
  const isDark = mode === "dark";

  const algorithm = isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  return {
    algorithm,
    token: {
      ...baseTheme.token,
    },
  };
}
