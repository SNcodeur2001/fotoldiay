# Fotoljaay Backend API

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

API backend pour la plateforme Fotoljaay - Marketplace de découverte transparente.

## 📋 Table des Matières

- [Aperçu](#aperçu)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du Projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Base de Données](#base-de-données)
- [Fonctionnalités](#fonctionnalités)
- [Déploiement](#déploiement)
- [Tests](#tests)

## 🎯 Aperçu

Le backend de Fotoljaay fournit une API RESTful complète pour gérer :
- **Produits** : CRUD, modération, expiration automatique
- **Catégories** : Gestion des catégories de produits
- **Notifications** : Système de notifications utilisateur
- **Tâches automatiques** : Nettoyage hebdomadaire des données

## 🛠 Technologies

- **Runtime** : Node.js 16+
- **Framework** : Express.js
- **Langage** : TypeScript
- **ORM** : Prisma
- **Base de données** : MySQL 8.0+
- **Validation** : Zod
- **Planification** : Node-cron
- **Sécurité** : CORS, validation des entrées

## 🚀 Installation

### Prérequis
- Node.js >= 16.0.0
- npm >= 8.0.0
- MySQL >= 8.0

### Étapes d'installation

```bash
# Cloner le repository
git clone <repository-url>
cd fotoljaay/ecommerce

# Installer les dépendances
npm install

# Configuration de l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres
```

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
# Base de données
DATABASE_URL="mysql://user:password@localhost:3306/fotoljaay"

# Serveur
PORT=5080
NODE_ENV=development

# Frontend
URL_FRONTEND=http://localhost:4200

# Sécurité (optionnel)
JWT_SECRET=your-secret-key-here
```

### Initialisation de la base de données

```bash
# Créer et appliquer les migrations
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate

# (Optionnel) Ouvrir Prisma Studio
npx prisma studio
```

## 📁 Structure du Projet

```
ecommerce/
├── src/
│   ├── app.ts                 # Configuration Express principale
│   ├── server.ts             # Point d'entrée serveur
│   ├── scheduler.ts          # Tâches automatiques
│   ├── prismaClient.ts       # Client Prisma
│   └── modules/
│       ├── index.routes.ts   # Configuration des routes
│       ├── product/          # Module produits
│       │   ├── product.controller.ts
│       │   ├── product.dto.ts
│       │   ├── product.enum.ts
│       │   └── product.route.ts
│       ├── category/         # Module catégories
│       │   ├── category.controller.ts
│       │   ├── category.dto.ts
│       │   ├── category.enum.ts
│       │   └── category.route.ts
│       └── notification/     # Module notifications
│           ├── notification.controller.ts
│           ├── notification.dto.ts
│           ├── notification.enum.ts
│           └── notification.route.ts
├── prisma/
│   ├── schema.prisma         # Schéma base de données
│   └── migrations/           # Migrations Prisma
├── package.json
├── tsconfig.json
└── README.md
```

## 🔗 API Endpoints

### Produits (`/api/products`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Liste des produits (avec filtres/pagination) |
| GET | `/api/products/:id` | Détail d'un produit (incrémente vues) |
| POST | `/api/products` | Création d'un produit |
| PUT | `/api/products/:id` | Mise à jour d'un produit |
| DELETE | `/api/products/:id` | Suppression d'un produit |
| PUT | `/api/products/:id/approve` | Approbation modérateur |
| PUT | `/api/products/:id/reject` | Rejet modérateur |
| PUT | `/api/products/:id/vip` | Définition statut VIP |

#### Paramètres de requête (GET /api/products)
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)
- `status` : Filtre par statut (`EN_ATTENTE`, `VALIDE`, `EXPIRE`, `SUPPRIME`)
- `categoryId` : Filtre par catégorie
- `userId` : Filtre par utilisateur
- `search` : Recherche textuelle (titre, description)

### Catégories (`/api/categories`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/categories` | Liste des catégories |
| GET | `/api/categories/:id` | Détail d'une catégorie |
| POST | `/api/categories` | Création d'une catégorie |
| PUT | `/api/categories/:id` | Mise à jour d'une catégorie |
| DELETE | `/api/categories/:id` | Suppression d'une catégorie |

### Notifications (`/api/notifications`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/notifications` | Liste des notifications utilisateur |
| GET | `/api/notifications/:id` | Détail d'une notification |
| POST | `/api/notifications` | Création d'une notification |
| PUT | `/api/notifications/:id` | Mise à jour d'une notification |
| DELETE | `/api/notifications/:id` | Suppression d'une notification |

## 🗄️ Base de Données

### Schéma Prisma

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  telephone String   @unique
  adresse   String
  role      UserRole @default(VENDEUR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  products      Product[]
  notifications Notification[]

  @@map("users")
}

model Product {
  id             String        @id @default(uuid())
  title          String
  description    String?
  price          Float
  imageUrl       String?
  status         ProductStatus @default(EN_ATTENTE)
  dateExpiration DateTime?
  viewCount      Int           @default(0)
  isVip          Boolean       @default(false)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])

  @@index([userId])
  @@index([categoryId])
  @@index([status])
  @@index([isVip])
  @@map("products")
}

model Category {
  id          String    @id @default(uuid())
  libelle        String    @unique
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  products Product[]

  @@map("categories")
}

model Notification {
  id        String   @id @default(uuid())
  title     String
  message   String
  type      NotificationType @default(INFO)
  isRead    Boolean  @default(false)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([isRead])
  @@map("notifications")
}

enum UserRole {
  SUPER_ADMIN
  VENDEUR
  GESTIONNAIRE
  VISITEUR
}

enum ProductStatus {
  EN_ATTENTE
  VALIDE
  EXPIRE
  SUPPRIME
}

enum NotificationType {
  INFO
  WARNING
  SUCCESS
  ERROR
}
```

## ⚡ Fonctionnalités

### Gestion des Produits
- **CRUD complet** avec validation Zod
- **Système de statut** : EN_ATTENTE → VALIDE → EXPIRE → SUPPRIME
- **Expiration automatique** : 7 jours après approbation
- **Système VIP** : Priorité d'affichage
- **Comptage de vues** : Incrémentation automatique
- **Filtrage avancé** : Par statut, catégorie, recherche

### Modération
- **Approbation/Rejet** : Endpoints dédiés pour modérateurs
- **Expiration automatique** : Marquage comme EXPIRE
- **Suppression définitive** : Après 30 jours d'expiration

### Notifications
- **Types multiples** : INFO, WARNING, SUCCESS, ERROR
- **Gestion de lecture** : Marquage lu/non lu
- **Notifications automatiques** : Expiration de produits

### Tâches Automatiques
- **Nettoyage hebdomadaire** : Tous les dimanches à 2h
- **Expiration des produits** : Marquage automatique
- **Suppression définitive** : Produits expirés depuis 30 jours
- **Notifications** : Alerte utilisateurs

## 🏃‍♂️ Démarrage

### Mode Développement
```bash
npm run dev
```

### Mode Production
```bash
npm run build
npm start
```

### Scripts Disponibles
```bash
npm run dev          # Développement avec nodemon
npm run build        # Build TypeScript
npm run start        # Production
npm run prisma:studio # Interface graphique Prisma
npm run prisma:generate # Générer client Prisma
npm run prisma:migrate # Appliquer migrations
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

## 🚀 Déploiement

### Préparation
```bash
# Build de production
npm run build

# Migration base de données
npx prisma migrate deploy

# Générer client Prisma
npx prisma generate
```

### Variables de Production
```env
NODE_ENV=production
DATABASE_URL=mysql://prod-user:prod-password@prod-host:3306/fotoljaay
PORT=5080
```

### Process Manager (PM2)
```bash
npm install -g pm2
pm2 start dist/server.js --name fotoljaay-backend
```

## 🔒 Sécurité

### Mesures Implémentées
- **Validation stricte** : Schémas Zod pour toutes les entrées
- **Protection XSS** : Sanitisation automatique
- **CORS configuré** : Origines autorisées explicites
- **Rate limiting** : Protection contre les abus (optionnel)
- **Logs sécurisés** : Pas de données sensibles dans les logs

### Bonnes Pratiques
- **Typage strict** : TypeScript avec strict mode
- **Gestion d'erreurs** : Middleware centralisé
- **Validation des entrées** : À tous les niveaux
- **Séparation des responsabilités** : Architecture modulaire

## 📊 Monitoring

### Métriques à Surveiller
- **Performance API** : Temps de réponse, taux d'erreur
- **Base de données** : Connexions, requêtes lentes
- **Tâches automatiques** : Statut d'exécution, erreurs
- **Utilisation** : Nombre de requêtes, utilisateurs actifs

### Logs
```bash
# Logs structurés avec Winston (recommandé)
npm install winston winston-daily-rotate-file
```

## 🔧 Maintenance

### Sauvegarde Base de Données
```bash
# Export MySQL
mysqldump -u user -p fotoljaay > backup.sql

# Import
mysql -u user -p fotoljaay < backup.sql
```

### Mise à Jour
```bash
# Récupérer les changements
git pull origin main

# Appliquer migrations
npx prisma migrate deploy

# Redémarrer le service
pm2 restart fotoljaay-backend
```

## 📞 Support

### Points de Contact
- **Issues GitHub** : Pour bugs et demandes de fonctionnalités
- **Documentation API** : Endpoints détaillés et exemples
- **Logs applicatifs** : Pour diagnostic des problèmes

### Debugging
```bash
# Debug mode
NODE_ENV=development DEBUG=* npm run dev

# Logs détaillés
tail -f logs/app.log
```

---

**Fotoljaay Backend** - API robuste pour une marketplace transparente. 🔒✨