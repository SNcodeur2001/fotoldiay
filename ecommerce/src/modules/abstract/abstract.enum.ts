export enum BaseMessages {
  CREATION_SUCCESS = "Créé avec succès",
  LIST_SUCCESS = "Liste récupérée avec succès",
  DETAIL_SUCCESS = "Détails récupérés avec succès",
  UPDATE_SUCCESS = "Mis à jour avec succès",
  DELETE_SUCCESS = "Supprimé avec succès",
  NOT_FOUND = "Ressource non trouvée"
}

export enum HttpStatusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}
