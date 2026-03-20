import { useEffect } from "react";
import { useSelector } from "react-redux";

import { selectThemeMode } from "../store/slices/themeSlice";

const STORAGE_KEY = "techzone-theme";

/**
 * Syncs Redux theme to <html data-theme> and localStorage (run inside Redux Provider).
 */
export default function ThemeEffect() {
  const mode = useSelector(selectThemeMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (_) {
      /* ignore */
    }
  }, [mode]);

  return null;
}
