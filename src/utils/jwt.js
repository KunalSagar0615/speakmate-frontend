export const decodeJwtPayload = (token) => {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getUserIdFromToken = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return payload.id ?? payload.userId ?? payload.sub ?? null;
};
