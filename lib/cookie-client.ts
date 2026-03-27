export const getAuthTokenClient = (): string | null => {
  if (typeof window === "undefined") return null;

  const match = document.cookie.match(/(^| )auth_token=([^;]+)/);
  return match ? match[2] : null;
};