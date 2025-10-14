// src/modules/auditlog/swagger.auditlog.schema.ts
export {};
/**
 * @swagger
 * components:
 *   schemas:
 *     AuditAction:
 *       type: string
 *       enum:
 *         - CREATE
 *         - READ
 *         - UPDATE
 *         - DELETE
 *         - LOGIN
 *         - LOGOUT
 *         - PASSWORD_RESET
 *         - EXPORT
 *         - IMPORT
 *       example: CREATE
 *
 *     AuditLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "44444444-4444-4444-4444-444444444444"
 *         action:
 *           $ref: '#/components/schemas/AuditAction'
 *         entityType:
 *           type: string
 *           example: "User"
 *         entityId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         userId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         userEmail:
 *           type: string
 *           format: email
 *           nullable: true
 *         ipAddress:
 *           type: string
 *           example: "192.168.1.100"
 *         userAgent:
 *           type: string
 *           example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
 *         details:
 *           type: object
 *           description: Détails supplémentaires de l'action en format JSON
 *           example: { "field": "email", "oldValue": "old@example.com", "newValue": "new@example.com" }
 *         timestamp:
 *           type: string
 *           format: date-time
 *         success:
 *           type: boolean
 *           default: true
 *         errorMessage:
 *           type: string
 *           nullable: true
 *
 *     AuditLogFilter:
 *       type: object
 *       properties:
 *         action:
 *           $ref: '#/components/schemas/AuditAction'
 *         entityType:
 *           type: string
 *           example: "User"
 *         userId:
 *           type: string
 *           format: uuid
 *         userEmail:
 *           type: string
 *           format: email
 *         ipAddress:
 *           type: string
 *         success:
 *           type: boolean
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *
 *     AuditLogStats:
 *       type: object
 *       properties:
 *         totalLogs:
 *           type: integer
 *           example: 1250
 *         actionStats:
 *           type: object
 *           additionalProperties:
 *             type: integer
 *           example:
 *             CREATE: 300
 *             READ: 650
 *             UPDATE: 200
 *             DELETE: 50
 *             LOGIN: 50
 *         entityStats:
 *           type: object
 *           additionalProperties:
 *             type: integer
 *           example:
 *             User: 400
 *             Product: 800
 *             Category: 50
 *         successRate:
 *           type: number
 *           format: float
 *           example: 98.5
 */
/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: Liste les logs d'audit avec filtres
 *     tags:
 *       - Audit Logs
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - name: action
 *         in: query
 *         schema:
 *           $ref: '#/components/schemas/AuditAction'
 *         description: Filtrer par action
 *       - name: entityType
 *         in: query
 *         schema:
 *           type: string
 *         description: Filtrer par type d'entité
 *       - name: userId
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrer par utilisateur
 *       - name: userEmail
 *         in: query
 *         schema:
 *           type: string
 *           format: email
 *         description: Filtrer par email utilisateur
 *       - name: ipAddress
 *         in: query
 *         schema:
 *           type: string
 *         description: Filtrer par adresse IP
 *       - name: success
 *         in: query
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut de réussite
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de début pour le filtrage
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de fin pour le filtrage
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des logs d'audit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuditLog'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - privilèges insuffisants
 *
 * /api/audit-logs/{id}:
 *   get:
 *     summary: Récupérer un log d'audit spécifique
 *     tags:
 *       - Audit Logs
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Log d'audit trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - privilèges insuffisants
 *       404:
 *         description: Log d'audit non trouvé
 *
 * /api/audit-logs/stats:
 *   get:
 *     summary: Récupérer les statistiques des logs d'audit
 *     tags:
 *       - Audit Logs
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de début pour les statistiques
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de fin pour les statistiques
 *     responses:
 *       200:
 *         description: Statistiques des logs d'audit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditLogStats'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - privilèges insuffisants
 *
 * /api/audit-logs/export:
 *   get:
 *     summary: Exporter les logs d'audit au format CSV
 *     tags:
 *       - Audit Logs
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - name: action
 *         in: query
 *         schema:
 *           $ref: '#/components/schemas/AuditAction'
 *         description: Filtrer par action
 *       - name: entityType
 *         in: query
 *         schema:
 *           type: string
 *         description: Filtrer par type d'entité
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de début pour l'export
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de fin pour l'export
 *     responses:
 *       200:
 *         description: Fichier CSV des logs d'audit
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             description: Nom du fichier CSV
 *             schema:
 *               type: string
 *               example: 'attachment; filename="audit-logs-2025-10-08.csv"'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - privilèges insuffisants
 */
