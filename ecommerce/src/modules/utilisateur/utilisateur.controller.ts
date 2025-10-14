// User.controller.ts
import { User, UserRole } from "@prisma/client";
import { BaseController } from "../abstract/BaseController.js";
import { PrismaService } from "../abstract/PrismaService.js";
import { UserMessages, UserValidationRules } from "./utilisateur.enum.js";
import { BaseMessages } from "../abstract/abstract.enum.js";
import {
  formatUserResponse,
  formatUsersResponse,
} from "./helpers/userFormatter.js";

import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import prisma from "../../prismaClient.js";
import { CreateUserDto, UpdateUserDto } from "./utilisateur.dto.js";

const UserBaseSchema = {
  name: z.string().min(2, UserMessages.NAME_REQUIRED),
  email: z.string().email(UserMessages.INVALID_EMAIL_FORMAT),
  password: z
    .string()
    .min(
      UserValidationRules.MIN_PASSWORD_LENGTH,
      UserMessages.PASSWORD_TOO_SHORT
    ),
  telephone: z
    .string()
    .regex(
      /^((\+221|0)?(7[0678]|75|76|77|78|70|71|79)[0-9]{7})$/,
      "Numéro de téléphone sénégalais invalide"
    ),
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  role: z.nativeEnum(UserRole).optional(),
};

export class UserController extends BaseController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  protected service: PrismaService<User, CreateUserDto, UpdateUserDto>;

  protected createSchema = z.object(UserBaseSchema) as z.ZodType<
    Omit<CreateUserDto, "id" | "createdAt" | "updatedAt">
  >;

  protected updateSchema = z
    .object({
      id: z.string().uuid().optional(),
    })
    .merge(z.object(UserBaseSchema).partial()) as z.ZodType<UpdateUserDto>;

  constructor(service: PrismaService<User, CreateUserDto, UpdateUserDto>) {
    super();
    this.service = service;
  }

  // Surcharger la méthode de formatage pour exclure le mot de passe
  protected formatEntity(entity: User): any {
    return formatUserResponse(entity);
  }

  protected formatEntities(entities: User[]): any[] {
    return formatUsersResponse(entities);
  }

  // Surcharger les messages pour utiliser les messages personnalisés User
  protected getCreationMessage(): string {
    return UserMessages.CREATION_SUCCESS;
  }

  protected getListMessage(): string {
    return UserMessages.LIST_SUCCESS;
  }

  protected getDetailMessage(): string {
    return UserMessages.DETAIL_SUCCESS;
  }

  protected getUpdateMessage(): string {
    return UserMessages.UPDATE_SUCCESS;
  }

  protected getDeleteMessage(): string {
    return UserMessages.DELETE_SUCCESS;
  }

  protected getNotFoundMessage(): string {
    return UserMessages.NOT_FOUND;
  }
}
