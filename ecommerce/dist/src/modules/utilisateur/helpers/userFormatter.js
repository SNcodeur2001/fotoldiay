// src/modules/utilisateur/helpers/userFormatter.ts
export const formatUserResponse = (user) => {
    const { password, ...safeUser } = user;
    return safeUser;
};
export const formatUsersResponse = (users) => {
    return users.map(formatUserResponse);
};
export default {
    formatUserResponse,
    formatUsersResponse,
};
