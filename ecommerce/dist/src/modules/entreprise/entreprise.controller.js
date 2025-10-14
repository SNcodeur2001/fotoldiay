import BaseController from "../abstract/BaseController.js";
import { z } from "zod";
const entrepriseBaseSchema = {
    nom: z.string().min(2),
    adresse: z.string().min(2),
    raisonSociale: z.string().nullable().default(null),
    ville: z.string().nullable().default(null),
    codePostal: z.string().nullable().default(null),
    telephone: z
        .string()
        .regex(/^((\+221|0)?(7[0678]|75|76|77|78|70|71|79)[0-9]{7})$/)
        .nullable()
        .default(null),
    email: z.string().email().nullable().default(null),
    siteWeb: z.string().url().nullable().default(null),
    logo: z.string().nullable().default(null),
    ninea: z.string().nullable().default(null),
    rccm: z.string().nullable().default(null),
    devise: z.string().nullable().default(null),
    monnaie: z.string().default("XOF"),
    typePeriodeDefaut: z.enum(["MENSUELLE", "HEBDOMADAIRE"]).default("MENSUELLE"),
    tauxCSS: z.number().min(0).max(1).default(0.07),
    tauxImpot: z.number().min(0).max(1).default(0),
    joursOuvrablesParMois: z.number().min(1).max(31).default(22),
    actif: z.boolean().default(true),
    deletedAt: z.date().nullable().default(null),
    primaryColor: z.string().nullable().default(null),
    secondaryColor: z.string().nullable().default(null),
    backgroundColor: z.string().nullable().default(null),
    textColor: z.string().nullable().default(null),
};
export class EntrepriseController extends BaseController {
    service;
    createSchema = z.object(entrepriseBaseSchema);
    updateSchema = z
        .object({
        id: z.string().uuid().optional(),
    })
        .merge(z.object(entrepriseBaseSchema).partial());
    constructor(service) {
        super();
        this.service = service;
    }
}
