// src/modules/category/category.enum.ts
export var CategoryMessages;
(function (CategoryMessages) {
    // Messages de succès
    CategoryMessages["CREATION_SUCCESS"] = "Cat\u00E9gorie cr\u00E9\u00E9e avec succ\u00E8s";
    CategoryMessages["UPDATE_SUCCESS"] = "Cat\u00E9gorie mise \u00E0 jour avec succ\u00E8s";
    CategoryMessages["DELETE_SUCCESS"] = "Cat\u00E9gorie supprim\u00E9e avec succ\u00E8s";
    CategoryMessages["LIST_SUCCESS"] = "Liste des cat\u00E9gories r\u00E9cup\u00E9r\u00E9e avec succ\u00E8s";
    CategoryMessages["DETAIL_SUCCESS"] = "D\u00E9tails de la cat\u00E9gorie r\u00E9cup\u00E9r\u00E9s avec succ\u00E8s";
    // Messages d'erreur
    CategoryMessages["NOT_FOUND"] = "Cat\u00E9gorie non trouv\u00E9e";
    CategoryMessages["LIBELLE_ALREADY_EXISTS"] = "Une cat\u00E9gorie avec ce libell\u00E9 existe d\u00E9j\u00E0";
    CategoryMessages["CATEGORY_IN_USE"] = "Impossible de supprimer cette cat\u00E9gorie car elle est utilis\u00E9e par des produits";
    CategoryMessages["INVALID_LIBELLE"] = "Libell\u00E9 de cat\u00E9gorie invalide";
    CategoryMessages["UNAUTHORIZED_ACCESS"] = "Acc\u00E8s non autoris\u00E9 \u00E0 cette cat\u00E9gorie";
    // Messages de validation
    CategoryMessages["LIBELLE_REQUIRED"] = "Le libell\u00E9 est obligatoire";
    CategoryMessages["DESCRIPTION_REQUIRED"] = "La description est obligatoire";
    CategoryMessages["LIBELLE_TOO_SHORT"] = "Le libell\u00E9 doit contenir au moins 2 caract\u00E8res";
    CategoryMessages["LIBELLE_TOO_LONG"] = "Le libell\u00E9 ne peut pas d\u00E9passer 100 caract\u00E8res";
    CategoryMessages["DESCRIPTION_TOO_LONG"] = "La description ne peut pas d\u00E9passer 500 caract\u00E8res";
    // Messages d'autorisation
    CategoryMessages["MANAGER_REQUIRED"] = "Seuls les gestionnaires peuvent g\u00E9rer les cat\u00E9gories";
    CategoryMessages["ADMIN_REQUIRED"] = "Droits d'administrateur requis";
    CategoryMessages["CREATE_PERMISSION_REQUIRED"] = "Permission de cr\u00E9ation de cat\u00E9gorie requise";
    CategoryMessages["UPDATE_PERMISSION_REQUIRED"] = "Permission de modification de cat\u00E9gorie requise";
    CategoryMessages["DELETE_PERMISSION_REQUIRED"] = "Permission de suppression de cat\u00E9gorie requise";
})(CategoryMessages || (CategoryMessages = {}));
export var CategoryValidationRules;
(function (CategoryValidationRules) {
    CategoryValidationRules[CategoryValidationRules["MIN_LIBELLE_LENGTH"] = 2] = "MIN_LIBELLE_LENGTH";
    CategoryValidationRules[CategoryValidationRules["MAX_LIBELLE_LENGTH"] = 100] = "MAX_LIBELLE_LENGTH";
    CategoryValidationRules[CategoryValidationRules["MIN_DESCRIPTION_LENGTH"] = 5] = "MIN_DESCRIPTION_LENGTH";
    CategoryValidationRules[CategoryValidationRules["MAX_DESCRIPTION_LENGTH"] = 500] = "MAX_DESCRIPTION_LENGTH";
})(CategoryValidationRules || (CategoryValidationRules = {}));
export var CategoryPermissions;
(function (CategoryPermissions) {
    CategoryPermissions["CREATE"] = "category:create";
    CategoryPermissions["READ"] = "category:read";
    CategoryPermissions["UPDATE"] = "category:update";
    CategoryPermissions["DELETE"] = "category:delete";
    CategoryPermissions["MANAGE_ALL"] = "category:manage_all";
})(CategoryPermissions || (CategoryPermissions = {}));
