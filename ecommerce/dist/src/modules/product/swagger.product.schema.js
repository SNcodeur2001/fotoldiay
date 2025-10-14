// src/modules/product/swagger.product.schema.ts
export {};
/**
 * @swagger
 * components:
 *   schemas:
 *     ProductStatus:
 *       type: string
 *       enum:
 *         - EN_ATTENTE
 *         - VALIDE
 *         - EXPIRE
 *       example: EN_ATTENTE
 *
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - userId
 *         - categoryId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "22222222-2222-2222-2222-222222222222"
 *         title:
 *           type: string
 *           example: "iPhone 14 Pro"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Smartphone Apple en excellent état"
 *         price:
 *           type: number
 *           format: float
 *           example: 999.99
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/images/iphone14.jpg"
 *         status:
 *           $ref: '#/components/schemas/ProductStatus'
 *         dateExpiration:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         userId:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductInput:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - userId
 *         - categoryId
 *       properties:
 *         title:
 *           type: string
 *           example: "iPhone 14 Pro"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Smartphone Apple en excellent état"
 *         price:
 *           type: number
 *           format: float
 *           example: 999.99
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/images/iphone14.jpg"
 *         status:
 *           $ref: '#/components/schemas/ProductStatus'
 *         dateExpiration:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         userId:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 */
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Liste tous les produits
 *     tags:
 *       - Products
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           $ref: '#/components/schemas/ProductStatus'
 *         description: Filtrer par statut
 *       - name: categoryId
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrer par catégorie
 *       - name: userId
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrer par utilisateur
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 *   post:
 *     summary: Crée un nouveau produit
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Produit créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *
 * /api/products/{id}:
 *   get:
 *     summary: Récupérer un produit par ID
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Produit trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 *
 *   put:
 *     summary: Mettre à jour un produit
 *     tags:
 *       - Products
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
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 *
 *   delete:
 *     summary: Supprimer un produit
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Produit supprimé
 *       404:
 *         description: Produit non trouvé
 *
 * /api/products/user/{userId}:
 *   get:
 *     summary: Récupérer tous les produits d'un utilisateur
 *     tags:
 *       - Products
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Liste des produits de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: Récupérer tous les produits d'une catégorie
 *     tags:
 *       - Products
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Liste des produits de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
