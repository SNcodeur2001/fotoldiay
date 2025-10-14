import { Category } from "@prisma/client";

// DTO pour création
export type CreateCategoryDto = Omit<
  Category,
  "id" | "createdAt" | "updatedAt"
> & {
  // Tous les champs requis/optionnels du modèle
  libelle: string;
  description?: string;
};

// DTO pour mise à jour
export type UpdateCategoryDto = Partial<CreateCategoryDto>;
