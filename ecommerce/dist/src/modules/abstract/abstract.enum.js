// src/modules/abstract/abstract.enum.ts
export var BaseMessages;
(function (BaseMessages) {
    // Messages génériques de succès
    BaseMessages["CREATION_SUCCESS"] = "Cr\u00E9ation r\u00E9ussie";
    BaseMessages["UPDATE_SUCCESS"] = "Mise \u00E0 jour r\u00E9ussie";
    BaseMessages["DELETE_SUCCESS"] = "Suppression r\u00E9ussie";
    BaseMessages["LIST_SUCCESS"] = "Liste r\u00E9cup\u00E9r\u00E9e avec succ\u00E8s";
    BaseMessages["DETAIL_SUCCESS"] = "\u00C9l\u00E9ment r\u00E9cup\u00E9r\u00E9 avec succ\u00E8s";
    BaseMessages["OPERATION_SUCCESS"] = "Op\u00E9ration r\u00E9ussie";
    // Messages génériques d'erreur
    BaseMessages["NOT_FOUND"] = "\u00C9l\u00E9ment non trouv\u00E9";
    BaseMessages["UNAUTHORIZED"] = "Acc\u00E8s non autoris\u00E9";
    BaseMessages["FORBIDDEN"] = "Action interdite";
    BaseMessages["INVALID_REQUEST"] = "Requ\u00EAte invalide";
    BaseMessages["VALIDATION_ERROR"] = "Erreur de validation";
    BaseMessages["INTERNAL_ERROR"] = "Erreur interne du serveur";
    BaseMessages["NETWORK_ERROR"] = "Erreur de r\u00E9seau";
    BaseMessages["TIMEOUT_ERROR"] = "D\u00E9lai d'attente d\u00E9pass\u00E9";
    // Messages de validation génériques
    BaseMessages["REQUIRED_FIELD"] = "Ce champ est obligatoire";
    BaseMessages["INVALID_FORMAT"] = "Format invalide";
    BaseMessages["INVALID_TYPE"] = "Type de donn\u00E9es invalide";
    BaseMessages["TOO_SHORT"] = "Valeur trop courte";
    BaseMessages["TOO_LONG"] = "Valeur trop longue";
    BaseMessages["INVALID_EMAIL"] = "Format d'email invalide";
    BaseMessages["INVALID_URL"] = "Format d'URL invalide";
    BaseMessages["INVALID_DATE"] = "Format de date invalide";
    BaseMessages["INVALID_NUMBER"] = "Nombre invalide";
    // Messages d'authentification
    BaseMessages["LOGIN_REQUIRED"] = "Connexion requise";
    BaseMessages["INVALID_TOKEN"] = "Token invalide";
    BaseMessages["TOKEN_EXPIRED"] = "Token expir\u00E9";
    BaseMessages["INSUFFICIENT_PRIVILEGES"] = "Privil\u00E8ges insuffisants";
    // Messages de pagination
    BaseMessages["INVALID_PAGE"] = "Num\u00E9ro de page invalide";
    BaseMessages["INVALID_LIMIT"] = "Limite invalide";
    BaseMessages["PAGE_OUT_OF_RANGE"] = "Page hors limites";
})(BaseMessages || (BaseMessages = {}));
export var HttpStatusCodes;
(function (HttpStatusCodes) {
    HttpStatusCodes[HttpStatusCodes["OK"] = 200] = "OK";
    HttpStatusCodes[HttpStatusCodes["CREATED"] = 201] = "CREATED";
    HttpStatusCodes[HttpStatusCodes["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatusCodes[HttpStatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCodes[HttpStatusCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusCodes[HttpStatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusCodes[HttpStatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCodes[HttpStatusCodes["CONFLICT"] = 409] = "CONFLICT";
    HttpStatusCodes[HttpStatusCodes["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatusCodes[HttpStatusCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatusCodes || (HttpStatusCodes = {}));
export var ValidationRules;
(function (ValidationRules) {
    ValidationRules[ValidationRules["MIN_STRING_LENGTH"] = 1] = "MIN_STRING_LENGTH";
    ValidationRules[ValidationRules["MAX_STRING_LENGTH"] = 255] = "MAX_STRING_LENGTH";
    ValidationRules[ValidationRules["MIN_TEXT_LENGTH"] = 1] = "MIN_TEXT_LENGTH";
    ValidationRules[ValidationRules["MAX_TEXT_LENGTH"] = 1000] = "MAX_TEXT_LENGTH";
    ValidationRules[ValidationRules["MIN_PASSWORD_LENGTH"] = 8] = "MIN_PASSWORD_LENGTH";
    ValidationRules[ValidationRules["MAX_PASSWORD_LENGTH"] = 128] = "MAX_PASSWORD_LENGTH";
    ValidationRules[ValidationRules["MIN_PAGE"] = 1] = "MIN_PAGE";
    ValidationRules[ValidationRules["MAX_LIMIT"] = 100] = "MAX_LIMIT";
    ValidationRules[ValidationRules["DEFAULT_LIMIT"] = 10] = "DEFAULT_LIMIT";
})(ValidationRules || (ValidationRules = {}));
