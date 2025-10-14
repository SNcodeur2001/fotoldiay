// src/modules/app.enum.ts
export var AppMessages;
(function (AppMessages) {
    // Messages généraux de l'application
    AppMessages["WELCOME"] = "Bienvenue sur l'API eCommerce";
    AppMessages["API_READY"] = "API pr\u00EAte et fonctionnelle";
    AppMessages["HEALTH_CHECK_SUCCESS"] = "Service en bonne sant\u00E9";
    // Messages d'erreur globaux
    AppMessages["INTERNAL_ERROR"] = "Erreur interne du serveur";
    AppMessages["SERVICE_UNAVAILABLE"] = "Service temporairement indisponible";
    AppMessages["MAINTENANCE_MODE"] = "Service en maintenance";
    AppMessages["RATE_LIMIT_EXCEEDED"] = "Limite de requ\u00EAtes d\u00E9pass\u00E9e";
    // Messages de connexion/déconnexion
    AppMessages["CONNECTION_SUCCESS"] = "Connexion \u00E9tablie avec succ\u00E8s";
    AppMessages["CONNECTION_FAILED"] = "\u00C9chec de la connexion";
    AppMessages["DISCONNECTION_SUCCESS"] = "D\u00E9connexion r\u00E9ussie";
    // Messages de base de données
    AppMessages["DB_CONNECTION_SUCCESS"] = "Connexion \u00E0 la base de donn\u00E9es \u00E9tablie";
    AppMessages["DB_CONNECTION_FAILED"] = "\u00C9chec de la connexion \u00E0 la base de donn\u00E9es";
    AppMessages["DB_MIGRATION_SUCCESS"] = "Migration de la base de donn\u00E9es r\u00E9ussie";
    AppMessages["DB_MIGRATION_FAILED"] = "\u00C9chec de la migration de la base de donn\u00E9es";
})(AppMessages || (AppMessages = {}));
export var AppConfig;
(function (AppConfig) {
    AppConfig[AppConfig["DEFAULT_PAGE_SIZE"] = 10] = "DEFAULT_PAGE_SIZE";
    AppConfig[AppConfig["MAX_PAGE_SIZE"] = 100] = "MAX_PAGE_SIZE";
    AppConfig[AppConfig["DEFAULT_TIMEOUT"] = 30000] = "DEFAULT_TIMEOUT";
    AppConfig[AppConfig["MAX_UPLOAD_SIZE"] = 10485760] = "MAX_UPLOAD_SIZE";
    AppConfig[AppConfig["MIN_PASSWORD_LENGTH"] = 8] = "MIN_PASSWORD_LENGTH";
    AppConfig[AppConfig["MAX_PASSWORD_LENGTH"] = 128] = "MAX_PASSWORD_LENGTH";
    AppConfig[AppConfig["SESSION_TIMEOUT"] = 3600000] = "SESSION_TIMEOUT";
})(AppConfig || (AppConfig = {}));
export var AppEnvironments;
(function (AppEnvironments) {
    AppEnvironments["DEVELOPMENT"] = "development";
    AppEnvironments["PRODUCTION"] = "production";
    AppEnvironments["TEST"] = "test";
    AppEnvironments["STAGING"] = "staging";
})(AppEnvironments || (AppEnvironments = {}));
export var ApiVersions;
(function (ApiVersions) {
    ApiVersions["V1"] = "v1";
    ApiVersions["V2"] = "v2";
})(ApiVersions || (ApiVersions = {}));
export var ContentTypes;
(function (ContentTypes) {
    ContentTypes["JSON"] = "application/json";
    ContentTypes["XML"] = "application/xml";
    ContentTypes["TEXT"] = "text/plain";
    ContentTypes["HTML"] = "text/html";
    ContentTypes["PDF"] = "application/pdf";
    ContentTypes["IMAGE_JPEG"] = "image/jpeg";
    ContentTypes["IMAGE_PNG"] = "image/png";
})(ContentTypes || (ContentTypes = {}));
export var CacheKeys;
(function (CacheKeys) {
    CacheKeys["USER_SESSION"] = "user:session:";
    CacheKeys["PRODUCT_LIST"] = "products:list:";
    CacheKeys["CATEGORY_LIST"] = "categories:list:";
    CacheKeys["USER_PERMISSIONS"] = "user:permissions:";
})(CacheKeys || (CacheKeys = {}));
