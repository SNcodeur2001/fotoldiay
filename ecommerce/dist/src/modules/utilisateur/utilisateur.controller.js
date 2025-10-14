// User.controller.ts
import { UserRole } from "@prisma/client";
import BaseController from "../abstract/BaseController.js";
import { UserMessages, UserValidationRules } from "./utilisateur.enum.js";
import { formatUserResponse, formatUsersResponse, } from "./helpers/userFormatter.js";
import { z } from "zod";
const UserBaseSchema = {
    name: z.string().min(2, UserMessages.NAME_REQUIRED),
    email: z.string().email(UserMessages.INVALID_EMAIL_FORMAT),
    password: z
        .string()
        .min(UserValidationRules.MIN_PASSWORD_LENGTH, UserMessages.PASSWORD_TOO_SHORT),
    telephone: z
        .string()
        .regex(/^((\+221|0)?(7[0678]|75|76|77|78|70|71|79)[0-9]{7})$/, "Numéro de téléphone sénégalais invalide"),
    adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    role: z.nativeEnum(UserRole).optional(),
};
export class UserController extends BaseController {
    service;
    createSchema = z.object(UserBaseSchema);
    updateSchema = z
        .object({
        id: z.string().uuid().optional(),
    })
        .merge(z.object(UserBaseSchema).partial());
    constructor(service) {
        super();
        this.service = service;
    }
    // Surcharger la méthode de formatage pour exclure le mot de passe
    formatEntity(entity) {
        return formatUserResponse(entity);
    }
    formatEntities(entities) {
        return formatUsersResponse(entities);
    }
    // Surcharger les messages pour utiliser les messages personnalisés User
    getCreationMessage() {
        return UserMessages.CREATION_SUCCESS;
    }
    getListMessage() {
        return UserMessages.LIST_SUCCESS;
    }
    getDetailMessage() {
        return UserMessages.DETAIL_SUCCESS;
    }
    getUpdateMessage() {
        return UserMessages.UPDATE_SUCCESS;
    }
    getDeleteMessage() {
        return UserMessages.DELETE_SUCCESS;
    }
    getNotFoundMessage() {
        return UserMessages.NOT_FOUND;
    }
}
