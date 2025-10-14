// src/modules/utilisateur/utilisateur.enum.ts
export var UserMessages;
(function (UserMessages) {
    // Messages de succès
    UserMessages["CREATION_SUCCESS"] = "Utilisateur cr\u00E9\u00E9 avec succ\u00E8s";
    UserMessages["UPDATE_SUCCESS"] = "Utilisateur mis \u00E0 jour avec succ\u00E8s";
    UserMessages["DELETE_SUCCESS"] = "Utilisateur supprim\u00E9 avec succ\u00E8s";
    UserMessages["LIST_SUCCESS"] = "Liste des utilisateurs r\u00E9cup\u00E9r\u00E9e avec succ\u00E8s";
    UserMessages["DETAIL_SUCCESS"] = "D\u00E9tails de l'utilisateur r\u00E9cup\u00E9r\u00E9s avec succ\u00E8s";
    UserMessages["LOGIN_SUCCESS"] = "Connexion r\u00E9ussie";
    UserMessages["LOGOUT_SUCCESS"] = "D\u00E9connexion r\u00E9ussie";
    UserMessages["PASSWORD_RESET_SUCCESS"] = "Mot de passe r\u00E9initialis\u00E9 avec succ\u00E8s";
    // Messages d'erreur
    UserMessages["NOT_FOUND"] = "Utilisateur non trouv\u00E9";
    UserMessages["EMAIL_ALREADY_EXISTS"] = "Cette adresse email est d\u00E9j\u00E0 utilis\u00E9e";
    UserMessages["INVALID_CREDENTIALS"] = "Email ou mot de passe incorrect";
    UserMessages["INVALID_EMAIL_FORMAT"] = "Format d'email invalide";
    UserMessages["PASSWORD_TOO_SHORT"] = "Le mot de passe doit contenir au moins 8 caract\u00E8res";
    UserMessages["INVALID_ROLE"] = "R\u00F4le utilisateur invalide";
    UserMessages["UNAUTHORIZED"] = "Acc\u00E8s non autoris\u00E9";
    UserMessages["TOKEN_EXPIRED"] = "Token d'authentification expir\u00E9";
    UserMessages["TOKEN_INVALID"] = "Token d'authentification invalide";
    UserMessages["MISSING_TOKEN"] = "Token d'authentification manquant";
    // Messages de validation
    UserMessages["NAME_REQUIRED"] = "Le nom est obligatoire";
    UserMessages["EMAIL_REQUIRED"] = "L'email est obligatoire";
    UserMessages["PASSWORD_REQUIRED"] = "Le mot de passe est obligatoire";
    UserMessages["TELEPHONE_REQUIRED"] = "Le t\u00E9l\u00E9phone est obligatoire";
    UserMessages["ADRESSE_REQUIRED"] = "L'adresse est obligatoire";
    UserMessages["TELEPHONE_ALREADY_EXISTS"] = "Ce num\u00E9ro de t\u00E9l\u00E9phone est d\u00E9j\u00E0 utilis\u00E9";
    UserMessages["INVALID_TELEPHONE_FORMAT"] = "Format de t\u00E9l\u00E9phone s\u00E9n\u00E9galais invalide";
    UserMessages["ROLE_REQUIRED"] = "Le r\u00F4le est obligatoire";
    // Messages d'autorisation
    UserMessages["ADMIN_REQUIRED"] = "Droits d'administrateur requis";
    UserMessages["MANAGER_REQUIRED"] = "Droits de gestionnaire requis";
    UserMessages["OWNER_OR_ADMIN_REQUIRED"] = "Seul le propri\u00E9taire ou un administrateur peut effectuer cette action";
})(UserMessages || (UserMessages = {}));
export var UserRoles;
(function (UserRoles) {
    UserRoles["VENDEUR"] = "VENDEUR";
    UserRoles["GESTIONNAIRE"] = "GESTIONNAIRE";
    UserRoles["VISITEUR"] = "VISITEUR";
})(UserRoles || (UserRoles = {}));
export var UserValidationRules;
(function (UserValidationRules) {
    UserValidationRules[UserValidationRules["MIN_PASSWORD_LENGTH"] = 8] = "MIN_PASSWORD_LENGTH";
    UserValidationRules[UserValidationRules["MAX_NAME_LENGTH"] = 100] = "MAX_NAME_LENGTH";
    UserValidationRules[UserValidationRules["MAX_EMAIL_LENGTH"] = 255] = "MAX_EMAIL_LENGTH";
})(UserValidationRules || (UserValidationRules = {}));
