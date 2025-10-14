// import { Request, Response, NextFunction } from "express";
// import prisma from "../../prismaClient.js";
export {};
// // Middleware d'audit adapté à l'authentification JWT et multi-tenant
// export function auditMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const start = Date.now();
//   res.on("finish", async () => {
//     try {
//       const user = (req as any).user || null;
//       const entrepriseId =
//         user?.entrepriseId ?? Number(req.headers["x-entreprise-id"]) ?? null;
//       const duration = Date.now() - start;
//       await prisma.auditLog.create({
//         data: {
//           action: `${req.method} ${req.originalUrl}`,
//           entity: req.baseUrl || req.originalUrl,
//           status: String(res.statusCode),
//           ip: req.ip,
//           userAgent: req.headers["user-agent"] || null,
//           metadata: {
//             durationMs: duration,
//             query: req.query,
//           } as any,
//           utilisateurId: user?.userId ?? null,
//           entrepriseId: entrepriseId ?? 0,
//         },
//       });
//     } catch (err) {
//       console.error("Erreur audit log:", err);
//     }
//   });
//   next();
// }
