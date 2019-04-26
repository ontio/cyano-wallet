import { storageGet, storageSet } from "./storageApi";

export type NetValue = "TEST" | "MAIN" | "PRIVATE";

export interface Settings {
  net: NetValue;
  address: string;
  ssl: boolean;
}

const defaultSettings: Settings = {
  address: "",
  net: "TEST",
  ssl: false
};

export async function saveSettings(settings: Settings) {
  storageSet("settings", JSON.stringify(settings));
}

export async function loadSettings(): Promise<Settings> {
  const settings = await storageGet("settings");

  if (settings === null) {
    return defaultSettings;
  }

  try {
    return JSON.parse(settings) as Settings;
  } catch (e) {
    return defaultSettings;
  }
}
