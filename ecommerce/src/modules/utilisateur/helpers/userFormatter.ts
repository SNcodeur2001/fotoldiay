// src/modules/utilisateur/helpers/userFormatter.ts
export const formatUserResponse = (user: any) => {
    const { password, ...safeUser } = user;
    return safeUser;
};

export const formatUsersResponse = (users: any[]) => {
    return users.map(formatUserResponse);
};

export default {
    formatUserResponse,
    formatUsersResponse,
};
