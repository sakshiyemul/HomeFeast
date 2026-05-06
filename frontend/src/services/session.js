export const SESSION = {
  token: "homefeast_token",
  user: "homefeast_user"
};

const LEGACY_SESSION = {
  token: "token",
  user: "user"
};

export const persistSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(SESSION.token, token);
    localStorage.setItem(LEGACY_SESSION.token, token);
  }
  if (user) {
    localStorage.setItem(SESSION.user, JSON.stringify(user));
    localStorage.setItem(LEGACY_SESSION.user, JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION.token);
  localStorage.removeItem(SESSION.user);
  localStorage.removeItem(LEGACY_SESSION.token);
  localStorage.removeItem(LEGACY_SESSION.user);
};

export const getToken = () => localStorage.getItem(SESSION.token) || localStorage.getItem(LEGACY_SESSION.token);
export const getUser = () => {
  const stored = localStorage.getItem(SESSION.user) || localStorage.getItem(LEGACY_SESSION.user);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};
