// src/swagger/swagger.entreprise.schema.ts
export {};
/**
 * @swagger
 * components:
 *   schemas:
 *     Entreprise:
 *       type: object
 *       required:
 *         - nom
 *         - adresse
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "b5c1e3e8-4a8a-4c83-8c7c-1dce8c5a7f11"
 *         nom:
 *           type: string
 *           example: "OpenAI Sénégal"
 *         adresse:
 *           type: string
 *           example: "Dakar, Plateau"
 *         raisonSociale:
 *           type: string
 *           nullable: true
 *           example: "SARL"
 *         ville:
 *           type: string
 *           nullable: true
 *           example: "Thiès"
 *         codePostal:
 *           type: string
 *           nullable: true
 *           example: "21000"
 *         telephone:
 *           type: string
 *           nullable: true
 *           example: "+221770000000"
 *         email:
 *           type: string
 *           nullable: true
 *           example: "contact@openai.sn"
 *         siteWeb:
 *           type: string
 *           nullable: true
 *           example: "https://openai.sn"
 *         logo:
 *           type: string
 *           nullable: true
 *           example: "https://openai.sn/logo.png"
 *         ninea:
 *           type: string
 *           nullable: true
 *           example: "123456789"
 *         rccm:
 *           type: string
 *           nullable: true
 *           example: "D/2025/B/12345"
 *         devise:
 *           type: string
 *           nullable: true
 *           example: "XOF"
 *         monnaie:
 *           type: string
 *           example: "XOF"
 *         typePeriodeDefaut:
 *           type: string
 *           enum:
 *             - MENSUELLE
 *             - HEBDOMADAIRE
 *           default: MENSUELLE
 *         tauxCSS:
 *           type: number
 *           example: 0.07
 *         tauxImpot:
 *           type: number
 *           example: 0.0
 *         joursOuvrablesParMois:
 *           type: integer
 *           example: 22
 *         actif:
 *           type: boolean
 *           default: true
 *         dateCreation:
 *           type: string
 *           format: date-time
 *         derniereModif:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     EntrepriseInput:
 *       type: object
 *       required:
 *         - nom
 *         - adresse
 *       properties:
 *         nom:
 *           type: string
 *           example: "Nouvelle Entreprise"
 *         adresse:
 *           type: string
 *           example: "Kaolack, Sénégal"
 *         raisonSociale:
 *           type: string
 *           nullable: true
 *           example: "SARL"
 *         ville:
 *           type: string
 *           nullable: true
 *           example: "Thiès"
 *         codePostal:
 *           type: string
 *           nullable: true
 *           example: "21000"
 *         telephone:
 *           type: string
 *           nullable: true
 *           example: "+221770000000"
 *         email:
 *           type: string
 *           nullable: true
 *           example: "info@entreprise.sn"
 *         siteWeb:
 *           type: string
 *           nullable: true
 *           example: "https://nouvelle-entreprise.sn"
 *         logo:
 *           type: string
 *           nullable: true
 *           example: "https://nouvelle-entreprise.sn/logo.png"
 *         ninea:
 *           type: string
 *           nullable: true
 *           example: "987654321"
 *         rccm:
 *           type: string
 *           nullable: true
 *           example: "D/2025/B/67890"
 *         devise:
 *           type: string
 *           nullable: true
 *           example: "XOF"
 *         monnaie:
 *           type: string
 *           example: "XOF"
 *         typePeriodeDefaut:
 *           type: string
 *           enum:
 *             - MENSUELLE
 *             - HEBDOMADAIRE
 *           default: MENSUELLE
 *         tauxCSS:
 *           type: number
 *           example: 0.07
 *         tauxImpot:
 *           type: number
 *           example: 0.0
 *         joursOuvrablesParMois:
 *           type: integer
 *           example: 22
 *         actif:
 *           type: boolean
 *           default: true
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
/**
 * @swagger
 * /api/entreprise:
 *   get:
 *     summary: Liste toutes les entreprises
 *     tags:
 *       - Entreprise
 *     responses:
 *       200:
 *         description: Liste des entreprises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entreprise'
 *
 *   post:
 *     summary: Crée une nouvelle entreprise
 *     tags:
 *       - Entreprise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntrepriseInput'
 *     responses:
 *       201:
 *         description: Entreprise créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entreprise'
 *
 * /api/entreprise/{id}:
 *   get:
 *     summary: Récupérer une entreprise par ID
 *     tags:
 *       - Entreprise
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Entreprise trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entreprise'
 *
 *   put:
 *     summary: Mettre à jour une entreprise
 *     tags:
 *       - Entreprise
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntrepriseInput'
 *     responses:
 *       200:
 *         description: Entreprise mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entreprise'
 *
 *   delete:
 *     summary: Supprimer une entreprise (soft delete)
 *     tags:
 *       - Entreprise
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Entreprise supprimée
 */
