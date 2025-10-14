export function setAuthCookie(res, name, value, maxAge) {
    res.cookie(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge,
    });
}
export function setRefreshTokenCookie(res, refreshToken) {
    setAuthCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
}
export function clearRefreshTokenCookie(res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
}
