const ADMIN_AUTH_KEY = "cc-admin-auth";
const ADMIN_TOKEN_KEY = "cc-admin-auth-token";
const ADMIN_PASSWORD_KEY = "cc-admin-password";
const ADMIN_LOGIN_AT_KEY = "cc-admin-login-at";
const ADMIN_SESSION_MS = 24 * 60 * 60 * 1000;

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_PASSWORD_KEY);
  localStorage.removeItem(ADMIN_LOGIN_AT_KEY);
}

export function saveAdminSession(password: string, token?: string) {
  localStorage.setItem(ADMIN_AUTH_KEY, "true");
  localStorage.setItem(ADMIN_PASSWORD_KEY, password);
  localStorage.setItem(ADMIN_LOGIN_AT_KEY, String(Date.now()));

  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

export function isAdminSessionValid() {
  const auth = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  const hasBackendCredential =
    Boolean(localStorage.getItem(ADMIN_PASSWORD_KEY)) ||
    Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));
  const loginAt = Number(localStorage.getItem(ADMIN_LOGIN_AT_KEY) || 0);
  const isFresh = loginAt > 0 && Date.now() - loginAt < ADMIN_SESSION_MS;

  return auth && hasBackendCredential && isFresh;
}
