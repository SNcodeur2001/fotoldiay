# Fotoljaay - Marketplace de Découverte Transparente

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

Fotoljaay est une plateforme de marketplace innovante conçue pour la découverte de produits avec un focus absolu sur la transparence. Contrairement aux marketplaces traditionnelles, Fotoljaay n'intègre aucun système de vente - elle se concentre uniquement sur la présentation et la découverte de produits authentiques.

## 🎯 Concept Unique

**"Voir pour croire"** - Fotoljaay révolutionne l'expérience d'achat en ligne en garantissant l'authenticité des produits grâce à un système de capture photo exclusif via webcam. Les utilisateurs peuvent découvrir des produits sans pression commerciale, dans un environnement de confiance.

## ✨ Fonctionnalités Principales

### 📷 Capture Transparente
- **Webcam obligatoire** : Importation de photos depuis la galerie interdite
- **Capture en temps réel** : Photos prises directement via la webcam de l'ordinateur
- **Authenticité garantie** : Élimination des risques de photos retouchées ou d'objets inexistants

### 🔄 Gestion Dynamique des Produits
- **Expiration hebdomadaire** : Tous les produits sont automatiquement supprimés chaque semaine
- **Actualisation forcée** : Encourage la présentation de produits toujours disponibles
- **Modération stricte** : Validation manuelle de chaque produit par des modérateurs

### 👑 Système VIP
- **Visibilité prioritaire** : Produits VIP affichés en premier dans les résultats
- **Badge distinctif** : Identification visuelle claire des produits premium
- **Monétisation future** : Système prêt pour l'implémentation de fonctionnalités payantes

### 📊 Analytics Intégré
- **Comptage de vues** : Suivi du nombre de consultations par produit
- **Mesure d'intérêt** : Indicateur d'attractivité des produits
- **Statistiques utilisateur** : Données pour optimiser les publications

### 🔔 Notifications Intelligentes
- **Rappels automatiques** : Alerte les vendeurs quand leurs produits expirent
- **Système de types** : Notifications INFO, WARNING, SUCCESS, ERROR
- **Gestion de lecture** : Marquage lu/non lu des notifications

## 🏗️ Architecture

### Backend (Node.js/Express/TypeScript)
```
ecommerce/
├── src/
│   ├── app.ts                 # Configuration principale Express
│   ├── server.ts             # Point d'entrée serveur
│   ├── scheduler.ts          # Tâches automatiques (nettoyage hebdomadaire)
│   ├── prismaClient.ts       # Client Prisma
│   └── modules/
│       ├── product/          # Gestion des produits
│       ├── category/         # Gestion des catégories
│       └── notification/     # Système de notifications
├── prisma/
│   ├── schema.prisma         # Schéma base de données
│   └── migrations/           # Migrations Prisma
└── package.json
```

### Frontend (Angular/TypeScript)
```
frontend/fotoljaay-frontend/
├── src/
│   ├── app/
│   │   ├── app.routes.ts      # Configuration des routes
│   │   ├── services/         # Services Angular (auth, product, category)
│   │   └── pages/            # Composants de pages
│   │       ├── products/
│   │       │   ├── list/     # Liste des produits
│   │       │   ├── add/      # Ajout de produit avec webcam
│   │       │   └── detail/   # Détail produit
│   │       └── profile/      # Profil utilisateur
│   └── styles.css            # Styles globaux
└── angular.json
```

## 🚀 Installation & Configuration

### Prérequis
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **MySQL** >= 8.0
- **Angular CLI** >= 17.0.0

### 1. Clonage du Repository
```bash
git clone <repository-url>
cd fotoljaay
```

### 2. Configuration Backend
```bash
cd ecommerce

# Installation des dépendances
npm install

# Configuration de la base de données
cp .env.example .env
# Éditer .env avec vos paramètres MySQL

# Initialisation de la base de données
npx prisma migrate dev --name init
npx prisma generate

# Démarrage du serveur backend
npm run dev
```

### 3. Configuration Frontend
```bash
cd ../frontend/fotoljaay-frontend

# Installation des dépendances
npm install

# Démarrage du serveur de développement
ng serve
```

### 4. Accès à l'Application
- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:5080
- **Documentation API** : http://localhost:5080/api-docs (si configuré)

## 📋 Variables d'Environnement

### Backend (.env)
```env
# Base de données
DATABASE_URL="mysql://user:password@localhost:3306/fotoljaay"

# Serveur
PORT=5080
NODE_ENV=development

# Frontend
URL_FRONTEND=http://localhost:4200

# Sécurité (optionnel)
JWT_SECRET=your-secret-key
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm run start        # Démarrage en production
npm run prisma:studio # Interface graphique Prisma
```

### Frontend
```bash
ng serve             # Serveur de développement
ng build             # Build de production
ng test              # Exécution des tests
ng lint              # Vérification du code
```

## 📚 API Documentation

### Endpoints Principaux

#### Produits
- `GET /api/products` - Liste des produits (avec filtres et pagination)
- `GET /api/products/:id` - Détail d'un produit
- `POST /api/products` - Création d'un produit
- `PUT /api/products/:id/approve` - Approbation modérateur
- `PUT /api/products/:id/reject` - Rejet modérateur
- `PUT /api/products/:id/vip` - Définition statut VIP

#### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Création d'une catégorie

#### Notifications
- `GET /api/notifications` - Liste des notifications utilisateur
- `PUT /api/notifications/:id` - Marquer comme lu

### Filtres et Recherche
```javascript
// Exemple de requête avec filtres
GET /api/products?status=VALIDE&categoryId=123&page=1&limit=12
```

## 🎨 Fonctionnalités Frontend

### Interface Utilisateur
- **Design moderne** : Interface responsive avec Tailwind CSS
- **Navigation intuitive** : Structure claire et accessible
- **Feedback visuel** : Indicateurs de statut, badges VIP, compteurs de vues

### Capture Webcam
- **Intégration ngx-webcam** : Bibliothèque spécialisée pour la capture
- **Contrôles intuitifs** : Boutons de capture, aperçu, suppression
- **Validation stricte** : Au moins une photo obligatoire

### Gestion d'État
- **Services Angular** : Gestion centralisée des données
- **Observables RxJS** : Programmation réactive
- **Intercepteurs HTTP** : Gestion automatique de l'authentification

## 🔐 Sécurité

### Mesures Implémentées
- **Validation stricte** : Schémas Zod pour toutes les entrées
- **Typage TypeScript** : Sécurité de type end-to-end
- **Protection CSRF** : Configuration CORS appropriée
- **Sanitisation** : Échappement automatique des entrées utilisateur

### Authentification
- **JWT Tokens** : Gestion sécurisée des sessions
- **Middleware d'authentification** : Protection des routes sensibles
- **Rôles utilisateur** : VENDEUR, GESTIONNAIRE, VISITEUR

## 📊 Base de Données

### Schéma Principal
```sql
-- Utilisateurs
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('VENDEUR', 'GESTIONNAIRE', 'VISITEUR') DEFAULT 'VENDEUR'
);

-- Produits
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  imageUrl VARCHAR(500),
  status ENUM('EN_ATTENTE', 'VALIDE', 'EXPIRE', 'SUPPRIME') DEFAULT 'EN_ATTENTE',
  dateExpiration DATETIME,
  viewCount INT DEFAULT 0,
  isVip BOOLEAN DEFAULT FALSE,
  userId VARCHAR(36),
  categoryId VARCHAR(36),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);

-- Catégories
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  libelle VARCHAR(255) UNIQUE NOT NULL,
  description TEXT
);

-- Notifications
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('INFO', 'WARNING', 'SUCCESS', 'ERROR') DEFAULT 'INFO',
  isRead BOOLEAN DEFAULT FALSE,
  userId VARCHAR(36),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔄 Workflows Métier

### Publication d'un Produit
1. **Capture** : Utilisateur prend des photos avec sa webcam
2. **Soumission** : Produit créé avec statut `EN_ATTENTE`
3. **Modération** : Modérateur examine et approuve/rejette
4. **Publication** : Produit visible avec expiration dans 7 jours
5. **Expiration** : Produit marqué comme `EXPIRE`
6. **Suppression** : Produit supprimé définitivement après 30 jours

### Système de Notifications
- **Expiration imminente** : Alerte 24h avant expiration
- **Produit expiré** : Rappel pour republier
- **Modération** : Notification d'approbation/rejet

## 🧪 Tests

### Structure des Tests
```
__tests__/
├── unit/           # Tests unitaires
├── integration/    # Tests d'intégration
└── e2e/           # Tests end-to-end
```

### Exécution des Tests
```bash
# Backend
npm test
npm run test:watch
npm run test:coverage

# Frontend
ng test
ng e2e
```

## 🚀 Déploiement

### Production Backend
```bash
# Build
npm run build

# Migration base de données
npx prisma migrate deploy

# Démarrage
npm start
```

### Production Frontend
```bash
# Build optimisé
ng build --configuration production

# Déploiement des fichiers dist/
```

### Variables de Production
```env
NODE_ENV=production
DATABASE_URL=mysql://prod-user:prod-password@prod-host:3306/fotoljaay
URL_FRONTEND=https://votredomaine.com
```

## 🤝 Contribution

### Processus de Contribution
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de Code
- **TypeScript strict** : Configuration maximale
- **ESLint/Prettier** : Formatage automatique
- **Tests obligatoires** : Couverture minimum 80%
- **Documentation** : JSDoc pour toutes les fonctions publiques

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Développement Backend** : Architecture API, base de données, logique métier
- **Développement Frontend** : Interface utilisateur, expérience webcam
- **Design UX/UI** : Conception de l'interface et expérience utilisateur
- **DevOps** : Déploiement, monitoring, sécurité

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation API

---

**Fotoljaay** - Où la transparence rencontre l'innovation dans le commerce en ligne. 🎯# fotoldiay
