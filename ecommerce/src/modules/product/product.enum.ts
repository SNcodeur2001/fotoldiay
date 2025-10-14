// src/modules/product/product.enum.ts

export enum ProductMessages {
  // Messages de succès
  CREATION_SUCCESS = "Produit créé avec succès",
  UPDATE_SUCCESS = "Produit mis à jour avec succès",
  DELETE_SUCCESS = "Produit supprimé avec succès",
  LIST_SUCCESS = "Liste des produits récupérée avec succès",
  DETAIL_SUCCESS = "Détails du produit récupérés avec succès",
  STATUS_UPDATED = "Statut du produit mis à jour avec succès",
  VALIDATED_SUCCESS = "Produit validé avec succès",
  REJECTED_SUCCESS = "Produit rejeté avec succès",

  // Messages d'erreur
  NOT_FOUND = "Produit non trouvé",
  TITLE_ALREADY_EXISTS = "Un produit avec ce titre existe déjà",
  INVALID_PRICE = "Le prix doit être un nombre positif",
  INVALID_STATUS = "Statut de produit invalide",
  EXPIRED_PRODUCT = "Ce produit a expiré",
  UNAUTHORIZED_ACCESS = "Vous n'êtes pas autorisé à accéder à ce produit",
  CANNOT_MODIFY_VALIDATED = "Impossible de modifier un produit validé",
  CANNOT_DELETE_VALIDATED = "Impossible de supprimer un produit validé",
  OWNER_ONLY = "Seul le propriétaire peut modifier ce produit",

  // Messages de validation
  TITLE_REQUIRED = "Le titre est obligatoire",
  DESCRIPTION_REQUIRED = "La description est obligatoire",
  PRICE_REQUIRED = "Le prix est obligatoire",
  CATEGORY_REQUIRED = "La catégorie est obligatoire",
  USER_REQUIRED = "L'utilisateur est obligatoire",
  EXPIRATION_DATE_REQUIRED = "La date d'expiration est obligatoire",
  FUTURE_EXPIRATION_REQUIRED = "La date d'expiration doit être dans le futur",

  // Messages d'autorisation
  SELLER_REQUIRED = "Seuls les vendeurs peuvent créer des produits",
  MANAGER_REQUIRED = "Droits de gestionnaire requis pour cette action",
  VALIDATION_RIGHTS_REQUIRED = "Droits de validation requis",
}

export enum ProductStatus {
  EN_ATTENTE = "EN_ATTENTE",
  VALIDE = "VALIDE",
  EXPIRE = "EXPIRE",
}

export enum ProductValidationRules {
  MIN_TITLE_LENGTH = 3,
  MAX_TITLE_LENGTH = 200,
  MIN_DESCRIPTION_LENGTH = 10,
  MAX_DESCRIPTION_LENGTH = 1000,
  MIN_PRICE = 0.01,
  MAX_PRICE = 999999999,
  DEFAULT_EXPIRATION_DAYS = 90,
}
