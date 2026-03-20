import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "techzone-theme";

function readInitialMode() {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch (_) {
    /* ignore */
  }
  return "light";
}

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: readInitialMode() },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
    setTheme(state, action) {
      if (action.payload === "dark" || action.payload === "light") {
        state.mode = action.payload;
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const selectThemeMode = (state) => state.theme.mode;
export default themeSlice.reducer;
