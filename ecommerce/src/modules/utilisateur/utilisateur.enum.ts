// src/modules/utilisateur/utilisateur.enum.ts

export enum UserMessages {
  // Messages de succès
  CREATION_SUCCESS = "Utilisateur créé avec succès",
  UPDATE_SUCCESS = "Utilisateur mis à jour avec succès",
  DELETE_SUCCESS = "Utilisateur supprimé avec succès",
  LIST_SUCCESS = "Liste des utilisateurs récupérée avec succès",
  DETAIL_SUCCESS = "Détails de l'utilisateur récupérés avec succès",
  LOGIN_SUCCESS = "Connexion réussie",
  LOGOUT_SUCCESS = "Déconnexion réussie",
  PASSWORD_RESET_SUCCESS = "Mot de passe réinitialisé avec succès",

  // Messages d'erreur
  NOT_FOUND = "Utilisateur non trouvé",
  EMAIL_ALREADY_EXISTS = "Cette adresse email est déjà utilisée",
  INVALID_CREDENTIALS = "Email ou mot de passe incorrect",
  INVALID_EMAIL_FORMAT = "Format d'email invalide",
  PASSWORD_TOO_SHORT = "Le mot de passe doit contenir au moins 8 caractères",
  INVALID_ROLE = "Rôle utilisateur invalide",
  UNAUTHORIZED = "Accès non autorisé",
  TOKEN_EXPIRED = "Token d'authentification expiré",
  TOKEN_INVALID = "Token d'authentification invalide",
  MISSING_TOKEN = "Token d'authentification manquant",

  // Messages de validation
  NAME_REQUIRED = "Le nom est obligatoire",
  EMAIL_REQUIRED = "L'email est obligatoire",
  PASSWORD_REQUIRED = "Le mot de passe est obligatoire",
  TELEPHONE_REQUIRED = "Le téléphone est obligatoire",
  ADRESSE_REQUIRED = "L'adresse est obligatoire",
  TELEPHONE_ALREADY_EXISTS = "Ce numéro de téléphone est déjà utilisé",
  INVALID_TELEPHONE_FORMAT = "Format de téléphone sénégalais invalide",
  ROLE_REQUIRED = "Le rôle est obligatoire",

  // Messages d'autorisation
  ADMIN_REQUIRED = "Droits d'administrateur requis",
  MANAGER_REQUIRED = "Droits de gestionnaire requis",
  OWNER_OR_ADMIN_REQUIRED = "Seul le propriétaire ou un administrateur peut effectuer cette action",
}

export enum UserRoles {
  VENDEUR = "VENDEUR",
  GESTIONNAIRE = "GESTIONNAIRE",
  VISITEUR = "VISITEUR",
}

export enum UserValidationRules {
  MIN_PASSWORD_LENGTH = 8,
  MAX_NAME_LENGTH = 100,
  MAX_EMAIL_LENGTH = 255,
}
