// src/modules/category/category.enum.ts

export enum CategoryMessages {
  // Messages de succès
  CREATION_SUCCESS = "Catégorie créée avec succès",
  UPDATE_SUCCESS = "Catégorie mise à jour avec succès",
  DELETE_SUCCESS = "Catégorie supprimée avec succès",
  LIST_SUCCESS = "Liste des catégories récupérée avec succès",
  DETAIL_SUCCESS = "Détails de la catégorie récupérés avec succès",

  // Messages d'erreur
  NOT_FOUND = "Catégorie non trouvée",
  LIBELLE_ALREADY_EXISTS = "Une catégorie avec ce libellé existe déjà",
  CATEGORY_IN_USE = "Impossible de supprimer cette catégorie car elle est utilisée par des produits",
  INVALID_LIBELLE = "Libellé de catégorie invalide",
  UNAUTHORIZED_ACCESS = "Accès non autorisé à cette catégorie",

  // Messages de validation
  LIBELLE_REQUIRED = "Le libellé est obligatoire",
  DESCRIPTION_REQUIRED = "La description est obligatoire",
  LIBELLE_TOO_SHORT = "Le libellé doit contenir au moins 2 caractères",
  LIBELLE_TOO_LONG = "Le libellé ne peut pas dépasser 100 caractères",
  DESCRIPTION_TOO_LONG = "La description ne peut pas dépasser 500 caractères",

  // Messages d'autorisation
  MANAGER_REQUIRED = "Seuls les gestionnaires peuvent gérer les catégories",
  ADMIN_REQUIRED = "Droits d'administrateur requis",
  CREATE_PERMISSION_REQUIRED = "Permission de création de catégorie requise",
  UPDATE_PERMISSION_REQUIRED = "Permission de modification de catégorie requise",
  DELETE_PERMISSION_REQUIRED = "Permission de suppression de catégorie requise",
}

export enum CategoryValidationRules {
  MIN_LIBELLE_LENGTH = 2,
  MAX_LIBELLE_LENGTH = 100,
  MIN_DESCRIPTION_LENGTH = 5,
  MAX_DESCRIPTION_LENGTH = 500,
}

export enum CategoryPermissions {
  CREATE = "category:create",
  READ = "category:read",
  UPDATE = "category:update",
  DELETE = "category:delete",
  MANAGE_ALL = "category:manage_all",
}
