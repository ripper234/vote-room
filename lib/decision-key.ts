export const KEY_STORAGE = "bechira-recovery-key-v1";
export const PREVIOUS_KEY_STORAGE = "vote-room-previous-recovery-key-v1";
export const SESSION_CLEAR_STORAGE = "vote-room-session-clear-v1";

export function clearDeviceDecisionKeys() {
  try {
    window.localStorage.removeItem(KEY_STORAGE);
    window.localStorage.removeItem(PREVIOUS_KEY_STORAGE);
    window.localStorage.setItem(SESSION_CLEAR_STORAGE, String(Date.now()));
    window.sessionStorage.removeItem("vote-room-guest-choice-v1");
  } catch {
    // A blocked browser storage API cannot contain a readable guest key.
  }
}
