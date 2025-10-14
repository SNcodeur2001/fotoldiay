// import { Request, Response, NextFunction } from "express";
export {};
// // Étendre le type Request pour inclure user
// interface AuthenticatedRequest extends Request {
//   user?: {
//     id: number;
//     entrepriseId: number;
//     // ...autres propriétés utilisateur
//   };
// }
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// /**
//  * Middleware d'autorisation entreprise
//  * Vérifie que l'utilisateur n'accède qu'aux ressources de son entreprise
//  * Supposons que req.user.entrepriseId est défini après authentification
//  */
// export async function entrepriseAuthMiddleware(
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   const entrepriseId = req.user?.entrepriseId;
//   if (!entrepriseId) {
//     return res
//       .status(403)
//       .json({ message: "Accès refusé: entreprise non définie." });
//   }
//   const resourceType = req.baseUrl.split("/")[1]; // ex: 'client', 'paiement', etc.
//   const resourceId = req.params.id;
//   if (resourceType && resourceId) {
//     let resource: any;
//     switch (resourceType) {
//       case "client":
//         resource = await prisma.client.findUnique({
//           where: { id: Number(resourceId) },
//         });
//         if (!resource || resource.entrepriseId !== entrepriseId) {
//           return res
//             .status(403)
//             .json({ message: "Accès refusé: client hors entreprise." });
//         }
//         break;
//       case "entreprise":
//         // Ici, l'utilisateur ne doit accéder qu'à son entreprise
//         if (Number(resourceId) !== entrepriseId) {
//           return res
//             .status(403)
//             .json({ message: "Accès refusé: entreprise non autorisée." });
//         }
//         break;
//       case "paiement":
//         resource = await prisma.paiement.findUnique({
//           where: { id: Number(resourceId) },
//           include: { client: true },
//         });
//         if (!resource || resource.client?.entrepriseId !== entrepriseId) {
//           return res
//             .status(403)
//             .json({ message: "Accès refusé: paiement hors entreprise." });
//         }
//         break;
//       case "transaction":
//         resource = await prisma.transaction.findUnique({
//           where: { id: Number(resourceId) },
//           include: { client: true },
//         });
//         if (!resource || resource.client?.entrepriseId !== entrepriseId) {
//           return res
//             .status(403)
//             .json({ message: "Accès refusé: transaction hors entreprise." });
//         }
//         break;
//       default:
//         // Pour les autres ressources, on laisse passer
//         break;
//     }
//   }
//   next();
// }
