import { useSyncExternalStore } from "react";

const THEME_KEY = "mindease_chat_theme";

// MindEase Theme Colors
export const CHAT_THEMES = [
  { id: "default", color: "#FDFCF0", name: "Warm Ivory" },
  { id: "sage",    color: "#F4F7F4", name: "Soft Sage" },
  { id: "rose",    color: "#FFF5F5", name: "Dusty Rose" },
  { id: "blue",    color: "#F0F4F8", name: "Calm Blue" },
  { id: "lavender",color: "#F8F5FA", name: "Lavender" },
];

export const DEFAULT_THEME = CHAT_THEMES[0].color;

// Simple reactive store based on localStorage
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
}

export function setTheme(color: string) {
  localStorage.setItem(THEME_KEY, color);
  listeners.forEach((l) => l());
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_THEME);
}
