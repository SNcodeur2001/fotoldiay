// src/modules/product/product.enum.ts
export var ProductMessages;
(function (ProductMessages) {
    // Messages de succès
    ProductMessages["CREATION_SUCCESS"] = "Produit cr\u00E9\u00E9 avec succ\u00E8s";
    ProductMessages["UPDATE_SUCCESS"] = "Produit mis \u00E0 jour avec succ\u00E8s";
    ProductMessages["DELETE_SUCCESS"] = "Produit supprim\u00E9 avec succ\u00E8s";
    ProductMessages["LIST_SUCCESS"] = "Liste des produits r\u00E9cup\u00E9r\u00E9e avec succ\u00E8s";
    ProductMessages["DETAIL_SUCCESS"] = "D\u00E9tails du produit r\u00E9cup\u00E9r\u00E9s avec succ\u00E8s";
    ProductMessages["STATUS_UPDATED"] = "Statut du produit mis \u00E0 jour avec succ\u00E8s";
    ProductMessages["VALIDATED_SUCCESS"] = "Produit valid\u00E9 avec succ\u00E8s";
    ProductMessages["REJECTED_SUCCESS"] = "Produit rejet\u00E9 avec succ\u00E8s";
    // Messages d'erreur
    ProductMessages["NOT_FOUND"] = "Produit non trouv\u00E9";
    ProductMessages["TITLE_ALREADY_EXISTS"] = "Un produit avec ce titre existe d\u00E9j\u00E0";
    ProductMessages["INVALID_PRICE"] = "Le prix doit \u00EAtre un nombre positif";
    ProductMessages["INVALID_STATUS"] = "Statut de produit invalide";
    ProductMessages["EXPIRED_PRODUCT"] = "Ce produit a expir\u00E9";
    ProductMessages["UNAUTHORIZED_ACCESS"] = "Vous n'\u00EAtes pas autoris\u00E9 \u00E0 acc\u00E9der \u00E0 ce produit";
    ProductMessages["CANNOT_MODIFY_VALIDATED"] = "Impossible de modifier un produit valid\u00E9";
    ProductMessages["CANNOT_DELETE_VALIDATED"] = "Impossible de supprimer un produit valid\u00E9";
    ProductMessages["OWNER_ONLY"] = "Seul le propri\u00E9taire peut modifier ce produit";
    // Messages de validation
    ProductMessages["TITLE_REQUIRED"] = "Le titre est obligatoire";
    ProductMessages["DESCRIPTION_REQUIRED"] = "La description est obligatoire";
    ProductMessages["PRICE_REQUIRED"] = "Le prix est obligatoire";
    ProductMessages["CATEGORY_REQUIRED"] = "La cat\u00E9gorie est obligatoire";
    ProductMessages["USER_REQUIRED"] = "L'utilisateur est obligatoire";
    ProductMessages["EXPIRATION_DATE_REQUIRED"] = "La date d'expiration est obligatoire";
    ProductMessages["FUTURE_EXPIRATION_REQUIRED"] = "La date d'expiration doit \u00EAtre dans le futur";
    // Messages d'autorisation
    ProductMessages["SELLER_REQUIRED"] = "Seuls les vendeurs peuvent cr\u00E9er des produits";
    ProductMessages["MANAGER_REQUIRED"] = "Droits de gestionnaire requis pour cette action";
    ProductMessages["VALIDATION_RIGHTS_REQUIRED"] = "Droits de validation requis";
})(ProductMessages || (ProductMessages = {}));
export var ProductStatus;
(function (ProductStatus) {
    ProductStatus["EN_ATTENTE"] = "EN_ATTENTE";
    ProductStatus["VALIDE"] = "VALIDE";
    ProductStatus["EXPIRE"] = "EXPIRE";
})(ProductStatus || (ProductStatus = {}));
export var ProductValidationRules;
(function (ProductValidationRules) {
    ProductValidationRules[ProductValidationRules["MIN_TITLE_LENGTH"] = 3] = "MIN_TITLE_LENGTH";
    ProductValidationRules[ProductValidationRules["MAX_TITLE_LENGTH"] = 200] = "MAX_TITLE_LENGTH";
    ProductValidationRules[ProductValidationRules["MIN_DESCRIPTION_LENGTH"] = 10] = "MIN_DESCRIPTION_LENGTH";
    ProductValidationRules[ProductValidationRules["MAX_DESCRIPTION_LENGTH"] = 1000] = "MAX_DESCRIPTION_LENGTH";
    ProductValidationRules[ProductValidationRules["MIN_PRICE"] = 0.01] = "MIN_PRICE";
    ProductValidationRules[ProductValidationRules["MAX_PRICE"] = 999999999] = "MAX_PRICE";
    ProductValidationRules[ProductValidationRules["DEFAULT_EXPIRATION_DAYS"] = 90] = "DEFAULT_EXPIRATION_DAYS";
})(ProductValidationRules || (ProductValidationRules = {}));
