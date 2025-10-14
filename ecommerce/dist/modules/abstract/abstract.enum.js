export var BaseMessages;
(function (BaseMessages) {
    BaseMessages["CREATION_SUCCESS"] = "Cr\u00E9\u00E9 avec succ\u00E8s";
    BaseMessages["LIST_SUCCESS"] = "Liste r\u00E9cup\u00E9r\u00E9e avec succ\u00E8s";
    BaseMessages["DETAIL_SUCCESS"] = "D\u00E9tails r\u00E9cup\u00E9r\u00E9s avec succ\u00E8s";
    BaseMessages["UPDATE_SUCCESS"] = "Mis \u00E0 jour avec succ\u00E8s";
    BaseMessages["DELETE_SUCCESS"] = "Supprim\u00E9 avec succ\u00E8s";
    BaseMessages["NOT_FOUND"] = "Ressource non trouv\u00E9e";
})(BaseMessages || (BaseMessages = {}));
export var HttpStatusCodes;
(function (HttpStatusCodes) {
    HttpStatusCodes[HttpStatusCodes["OK"] = 200] = "OK";
    HttpStatusCodes[HttpStatusCodes["CREATED"] = 201] = "CREATED";
    HttpStatusCodes[HttpStatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCodes[HttpStatusCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusCodes[HttpStatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusCodes[HttpStatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCodes[HttpStatusCodes["CONFLICT"] = 409] = "CONFLICT";
    HttpStatusCodes[HttpStatusCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatusCodes || (HttpStatusCodes = {}));
