// entreprise.schema.ts
import { z } from "zod";
export const createEntrepriseSchema = z.object({
    nom: z.string().min(2),
    adresse: z.string().min(2),
    raisonSociale: z.string().nullable().optional(),
    ville: z.string().nullable().optional(),
    codePostal: z.string().nullable().optional(),
    telephone: z
        .string()
        .regex(/^((\+221|0)?(7[0678]|75|76|77|78|70|71|79)[0-9]{7})$/)
        .nullable()
        .optional(),
    email: z.string().email().nullable().optional(),
    siteWeb: z.string().url().nullable().optional(),
    logo: z.string().nullable().optional(),
    ninea: z.string().nullable().optional(),
    rccm: z.string().nullable().optional(),
    devise: z.string().nullable().optional(),
    monnaie: z.string().default("XOF"),
    typePeriodeDefaut: z.enum(["MENSUELLE", "HEBDOMADAIRE"]).default("MENSUELLE"),
    tauxCSS: z.number().min(0).max(1).default(0.07),
    tauxImpot: z.number().min(0).max(1).default(0),
    joursOuvrablesParMois: z.number().min(1).max(31).default(22),
    actif: z.boolean().default(true),
    deletedAt: z.date().nullable().optional(),
    primaryColor: z.string().nullable().optional(),
    secondaryColor: z.string().nullable().optional(),
    backgroundColor: z.string().nullable().optional(),
    textColor: z.string().nullable().optional(),
});
