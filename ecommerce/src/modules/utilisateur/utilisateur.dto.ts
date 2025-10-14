import { User, UserRole } from "@prisma/client";

// DTO pour création
export type CreateUserDto = Omit<User, "id" | "createdAt" | "updatedAt"> & {
  // Tous les champs requis/optionnels du modèle
  name: string;
  email: string;
  password: string;
  telephone: string;
  adresse: string;
  role?: UserRole; // Par défaut VISITEUR
};

// DTO pour mise à jour
export type UpdateUserDto = Partial<CreateUserDto>;
