// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { createPermissionFilter } from '../middleware/auth.js';
// import { Resource, TypeUtilisateur } from '../types/permissions.js';
export {};
// const prisma = new PrismaClient();
// /**
//  * Contrôleur pour la gestion des employés avec permissions basées sur les rôles
//  */
// export class EmployeController {
//   /**
//    * GET /api/employes
//    * Liste des employés (filtrée selon les permissions)
//    */
//   static async getEmployes(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({
//           error: 'Authentification requise',
//           code: 'AUTHENTICATION_REQUIRED'
//         });
//       }
//       // Création du filtre basé sur les permissions utilisateur
//       const permissionFilter = createPermissionFilter(req.user, Resource.EMPLOYE);
//       // Pagination
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 20;
//       const offset = (page - 1) * limit;
//       // Filtres de recherche
//       const { search, departement, statut, typeContrat } = req.query;
//       const searchFilter: any = { ...permissionFilter };
//       if (search) {
//         searchFilter.OR = [
//           { nom: { contains: search as string, mode: 'insensitive' } },
//           { prenom: { contains: search as string, mode: 'insensitive' } },
//           { matricule: { contains: search as string, mode: 'insensitive' } },
//           { email: { contains: search as string, mode: 'insensitive' } }
//         ];
//       }
//       if (departement) {
//         searchFilter.departementId = departement as string;
//       }
//       if (statut) {
//         searchFilter.statut = statut as string;
//       }
//       if (typeContrat) {
//         searchFilter.typeContrat = typeContrat as string;
//       }
//       // Récupération des employés avec pagination
//       const [employes, total] = await Promise.all([
//         prisma.employe.findMany({
//           where: searchFilter,
//           include: {
//             departement: {
//               select: {
//                 id: true,
//                 nom: true
//               }
//             },
//             entreprise: {
//               select: {
//                 id: true,
//                 nom: true
//               }
//             }
//           },
//           orderBy: [
//             { nom: 'asc' },
//             { prenom: 'asc' }
//           ],
//           skip: offset,
//           take: limit
//         }),
//         prisma.employe.count({
//           where: searchFilter
//         })
//       ]);
//       // Masquer certaines informations selon le type d'utilisateur
//       const employesFiltres = employes.map(employe => {
//         const employeData: any = { ...employe };
//         // Les EMPLOYEE ne peuvent voir que leurs propres informations complètes
//         if (req.user!.type === TypeUtilisateur.EMPLOYEE && employe.id !== req.user!.id) {
//           // Masquer les informations sensibles
//           delete employeData.salaireBase;
//           delete employeData.numeroCompte;
//           delete employeData.banque;
//           delete employeData.rib;
//           delete employeData.numeroCNI;
//           delete employeData.numeroPasseport;
//           delete employeData.numeroCSS;
//           delete employeData.numeroIPM;
//         }
//         // Les CAISSIER peuvent voir les infos nécessaires aux paiements
//         if (req.user!.type === TypeUtilisateur.CAISSIER) {
//           delete employeData.numeroCNI;
//           delete employeData.numeroPasseport;
//         }
//         return employeData;
//       });
//       return res.status(200).json({
//         success: true,
//         data: employesFiltres,
//         pagination: {
//           currentPage: page,
//           totalPages: Math.ceil(total / limit),
//           totalItems: total,
//           itemsPerPage: limit
//         }
//       });
//     } catch (error) {
//       console.error('Erreur lors de la récupération des employés:', error);
//       return res.status(500).json({
//         error: 'Erreur interne du serveur',
//         code: 'INTERNAL_ERROR'
//       });
//     }
//   }
//   /**
//    * GET /api/employes/:id
//    * Détails d'un employé (selon permissions)
//    */
//   static async getEmploye(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       if (!req.user) {
//         return res.status(401).json({
//           error: 'Authentification requise',
//           code: 'AUTHENTICATION_REQUIRED'
//         });
//       }
//       // Récupération de l'employé
//       const employe = await prisma.employe.findUnique({
//         where: {
//           id,
//           deletedAt: null
//         },
//         include: {
//           departement: {
//             select: {
//               id: true,
//               nom: true,
//               responsable: true
//             }
//           },
//           entreprise: {
//             select: {
//               id: true,
//               nom: true
//             }
//           },
//           payslips: {
//             where: { deletedAt: null },
//             orderBy: { dateGeneration: 'desc' },
//             take: 5,
//             select: {
//               id: true,
//               numero: true,
//               salaireNet: true,
//               dateGeneration: true,
//               statut: true
//             }
//           }
//         }
//       });
//       if (!employe) {
//         return res.status(404).json({
//           error: 'Employé non trouvé',
//           code: 'EMPLOYEE_NOT_FOUND'
//         });
//       }
//       // Vérification des permissions d'accès
//       const hasAccess = 
//         req.user.type === TypeUtilisateur.SUPER_ADMIN ||
//         (req.user.type === TypeUtilisateur.ADMIN && employe.entrepriseId === req.user.entrepriseId) ||
//         (req.user.type === TypeUtilisateur.MANAGER && employe.departementId === req.user.departementId) ||
//         (req.user.type === TypeUtilisateur.CAISSIER && employe.entrepriseId === req.user.entrepriseId) ||
//         (req.user.type === TypeUtilisateur.EMPLOYEE && employe.id === req.user.id);
//       if (!hasAccess) {
//         return res.status(403).json({
//           error: 'Accès refusé à cet employé',
//           code: 'EMPLOYEE_ACCESS_DENIED'
//         });
//       }
//       // Filtrage des données selon le type d'utilisateur
//       const employeData: any = { ...employe };
//       if (req.user.type === TypeUtilisateur.EMPLOYEE && employe.id !== req.user.id) {
//         return res.status(403).json({
//           error: 'Accès refusé',
//           code: 'ACCESS_DENIED'
//         });
//       }
//       if (req.user.type === TypeUtilisateur.CAISSIER) {
//         delete employeData.numeroCNI;
//         delete employeData.numeroPasseport;
//       }
//       return res.status(200).json({
//         success: true,
//         data: employeData
//       });
//     } catch (error) {
//       console.error('Erreur lors de la récupération de l\'employé:', error);
//       return res.status(500).json({
//         error: 'Erreur interne du serveur',
//         code: 'INTERNAL_ERROR'
//       });
//     }
//   }
//   /**
//    * POST /api/employes
//    * Création d'un nouvel employé
//    */
//   static async createEmploye(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({
//           error: 'Authentification requise',
//           code: 'AUTHENTICATION_REQUIRED'
//         });
//       }
//       const {
//         matricule,
//         nom,
//         prenom,
//         dateNaissance,
//         email,
//         telephone,
//         adresse,
//         poste,
//         departementId,
//         typeContrat,
//         dateEmbauche,
//         salaireBase,
//         ...autresChamps
//       } = req.body;
//       // Validation des champs obligatoires
//       if (!matricule || !nom || !prenom || !poste || !typeContrat || !dateEmbauche || !salaireBase) {
//         return res.status(400).json({
//           error: 'Champs obligatoires manquants',
//           code: 'MISSING_REQUIRED_FIELDS'
//         });
//       }
//       // Vérification de l'unicité du matricule dans l'entreprise
//       const existingEmployee = await prisma.employe.findFirst({
//         where: {
//           matricule,
//           entrepriseId: req.user.entrepriseId,
//           deletedAt: null
//         }
//       });
//       if (existingEmployee) {
//         return res.status(400).json({
//           error: 'Ce matricule existe déjà dans l\'entreprise',
//           code: 'MATRICULE_ALREADY_EXISTS'
//         });
//       }
//       // Vérification du département si spécifié
//       if (departementId) {
//         const departement = await prisma.departement.findUnique({
//           where: {
//             id: departementId,
//             entrepriseId: req.user.entrepriseId,
//             deletedAt: null
//           }
//         });
//         if (!departement) {
//           return res.status(400).json({
//             error: 'Département non trouvé',
//             code: 'DEPARTMENT_NOT_FOUND'
//           });
//         }
//       }
//       // Création de l'employé
//       const nouvelEmploye = await prisma.employe.create({
//         data: {
//           matricule,
//           nom: nom.trim(),
//           prenom: prenom.trim(),
//           dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
//           email: email?.toLowerCase().trim(),
//           telephone: telephone?.trim(),
//           adresse: adresse?.trim(),
//           poste: poste.trim(),
//           departementId,
//           typeContrat,
//           dateEmbauche: new Date(dateEmbauche),
//           salaireBase: parseFloat(salaireBase),
//           entrepriseId: req.user.entrepriseId,
//           ...autresChamps
//         },
//         include: {
//           departement: {
//             select: {
//               id: true,
//               nom: true
//             }
//           },
//           entreprise: {
//             select: {
//               id: true,
//               nom: true
//             }
//           }
//         }
//       });
//       return res.status(201).json({
//         success: true,
//         data: nouvelEmploye,
//         message: 'Employé créé avec succès'
//       });
//     } catch (error) {
//       console.error('Erreur lors de la création de l\'employé:', error);
//       if (error instanceof Error && error.message.includes('Unique constraint')) {
//         return res.status(400).json({
//           error: 'Contrainte d\'unicité violée',
//           code: 'UNIQUE_CONSTRAINT_VIOLATION'
//         });
//       }
//       return res.status(500).json({
//         error: 'Erreur interne du serveur',
//         code: 'INTERNAL_ERROR'
//       });
//     }
//   }
//   /**
//    * PUT /api/employes/:id
//    * Mise à jour d'un employé
//    */
//   static async updateEmploye(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       if (!req.user) {
//         return res.status(401).json({
//           error: 'Authentification requise',
//           code: 'AUTHENTICATION_REQUIRED'
//         });
//       }
//       // Récupération de l'employé existant
//       const employeExistant = await prisma.employe.findUnique({
//         where: {
//           id,
//           deletedAt: null
//         }
//       });
//       if (!employeExistant) {
//         return res.status(404).json({
//           error: 'Employé non trouvé',
//           code: 'EMPLOYEE_NOT_FOUND'
//         });
//       }
//       // Vérification des permissions de modification
//       const canUpdate = 
//         req.user.type === TypeUtilisateur.SUPER_ADMIN ||
//         (req.user.type === TypeUtilisateur.ADMIN && employeExistant.entrepriseId === req.user.entrepriseId) ||
//         (req.user.type === TypeUtilisateur.MANAGER && employeExistant.departementId === req.user.departementId);
//       if (!canUpdate) {
//         return res.status(403).json({
//           error: 'Permissions insuffisantes pour modifier cet employé',
//           code: 'UPDATE_ACCESS_DENIED'
//         });
//       }
//       // Filtrage des champs modifiables selon le type d'utilisateur
//       let updatedData = { ...req.body };
//       if (req.user.type === TypeUtilisateur.MANAGER) {
//         // Les managers ne peuvent modifier que certains champs
//         const allowedFields = ['poste', 'statut', 'notes'];
//         updatedData = Object.keys(updatedData)
//           .filter(key => allowedFields.includes(key))
//           .reduce((obj: any, key) => {
//             obj[key] = updatedData[key];
//             return obj;
//           }, {});
//       }
//       // Suppression des champs non modifiables
//       delete updatedData.id;
//       delete updatedData.matricule; // Le matricule ne peut pas être modifié
//       delete updatedData.entrepriseId;
//       delete updatedData.createdAt;
//       delete updatedData.updatedAt;
//       // Mise à jour
//       const employeMiseAJour = await prisma.employe.update({
//         where: { id },
//         data: {
//           ...updatedData,
//           updatedAt: new Date()
//         },
//         include: {
//           departement: {
//             select: {
//               id: true,
//               nom: true
//             }
//           },
//           entreprise: {
//             select: {
//               id: true,
//               nom: true
//             }
//           }
//         }
//       });
//       return res.status(200).json({
//         success: true,
//         data: employeMiseAJour,
//         message: 'Employé mis à jour avec succès'
//       });
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de l\'employé:', error);
//       return res.status(500).json({
//         error: 'Erreur interne du serveur',
//         code: 'INTERNAL_ERROR'
//       });
//     }
//   }
//   /**
//    * DELETE /api/employes/:id
//    * Suppression (logique) d'un employé
//    */
//   static async deleteEmploye(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       if (!req.user) {
//         return res.status(401).json({
//           error: 'Authentification requise',
//           code: 'AUTHENTICATION_REQUIRED'
//         });
//       }
//       // Seuls ADMIN et SUPER_ADMIN peuvent supprimer
//       if (![TypeUtilisateur.SUPER_ADMIN, TypeUtilisateur.ADMIN].includes(req.user.type)) {
//         return res.status(403).json({
//           error: 'Permissions insuffisantes pour supprimer un employé',
//           code: 'DELETE_ACCESS_DENIED'
//         });
//       }
//       const employe = await prisma.employe.findUnique({
//         where: {
//           id,
//           deletedAt: null
//         }
//       });
//       if (!employe) {
//         return res.status(404).json({
//           error: 'Employé non trouvé',
//           code: 'EMPLOYEE_NOT_FOUND'
//         });
//       }
//       // Un ADMIN ne peut supprimer que dans sa propre entreprise
//       if (req.user.type === TypeUtilisateur.ADMIN && employe.entrepriseId !== req.user.entrepriseId) {
//         return res.status(403).json({
//           error: 'Vous ne pouvez supprimer que les employés de votre entreprise',
//           code: 'COMPANY_ACCESS_DENIED'
//         });
//       }
//       // Suppression logique
//       await prisma.employe.update({
//         where: { id },
//         data: {
//           deletedAt: new Date(),
//           statut: 'INACTIF'
//         }
//       });
//       return res.status(200).json({
//         success: true,
//         message: 'Employé supprimé avec succès'
//       });
//     } catch (error) {
//       console.error('Erreur lors de la suppression de l\'employé:', error);
//       return res.status(500).json({
//         error: 'Erreur interne du serveur',
//         code: 'INTERNAL_ERROR'
//       });
//     }
//   }
// }
