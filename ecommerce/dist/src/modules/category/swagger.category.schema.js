// src/modules/category/swagger.category.schema.ts
export {};
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - libelle
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "33333333-3333-3333-3333-333333333333"
 *         libelle:
 *           type: string
 *           example: "Électronique"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Catégorie pour tous les appareils électroniques"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CategoryInput:
 *       type: object
 *       required:
 *         - libelle
 *       properties:
 *         libelle:
 *           type: string
 *           example: "Électronique"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Catégorie pour tous les appareils électroniques"
 *
 *     CategoryWithProducts:
 *       allOf:
 *         - $ref: '#/components/schemas/Category'
 *         - type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Liste toutes les catégories
 *     tags:
 *       - Categories
 *     parameters:
 *       - name: includeProducts
 *         in: query
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Inclure les produits associés à chaque catégorie
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/Category'
 *                   - $ref: '#/components/schemas/CategoryWithProducts'
 *
 *   post:
 *     summary: Crée une nouvelle catégorie
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Catégorie créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Une catégorie avec ce libellé existe déjà
 *
 * /api/categories/{id}:
 *   get:
 *     summary: Récupérer une catégorie par ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: includeProducts
 *         in: query
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Inclure les produits associés à la catégorie
 *     responses:
 *       200:
 *         description: Catégorie trouvée
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Category'
 *                 - $ref: '#/components/schemas/CategoryWithProducts'
 *       404:
 *         description: Catégorie non trouvée
 *
 *   put:
 *     summary: Mettre à jour une catégorie
 *     tags:
 *       - Categories
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
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Catégorie non trouvée
 *       409:
 *         description: Une catégorie avec ce libellé existe déjà
 *
 *   delete:
 *     summary: Supprimer une catégorie
 *     tags:
 *       - Categories
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Catégorie supprimée
 *       400:
 *         description: Impossible de supprimer - des produits sont associés à cette catégorie
 *       404:
 *         description: Catégorie non trouvée
 *
 * /api/categories/search:
 *   get:
 *     summary: Rechercher des catégories par libellé
 *     tags:
 *       - Categories
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Terme de recherche pour le libellé
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
