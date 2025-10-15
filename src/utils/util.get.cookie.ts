export const getCookieUtil = (cookieName: string) => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(cookieName));
    return cookie ? cookie.split("=")[1] : null;
  }
};
