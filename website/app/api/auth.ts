/**
 * Client-side auth helpers.
 */
const TOKEN_KEY = "soulcut_token";
/** Get the current JWT, or null if not logged in. */
export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}
/** Save the JWT after login. */
export function setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
}
/** Clear the JWT on logout. */
export function clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
}
/** Whether a JWT is currently stored. */
export function isLoggedIn(): boolean {
    return getToken() !== null;
}