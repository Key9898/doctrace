export const FIRST_RUN_STORAGE_KEY = "doctrace.firstRunDismissed";

export function isFirstRunDismissed() {
  try {
    return window.localStorage.getItem(FIRST_RUN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function dismissFirstRun() {
  try {
    window.localStorage.setItem(FIRST_RUN_STORAGE_KEY, "true");
    return true;
  } catch {
    return false;
  }
}
