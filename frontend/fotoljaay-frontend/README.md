# Fotoljaay Frontend

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/)

Interface utilisateur moderne et intuitive pour la plateforme Fotoljaay - Marketplace de découverte transparente.

## 📋 Table des Matières

- [Aperçu](#aperçu)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du Projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Routing](#routing)
- [Services](#services)
- [Styles](#styles)
- [Tests](#tests)
- [Build & Déploiement](#build--déploiement)

## 🎯 Aperçu

Le frontend Fotoljaay offre une expérience utilisateur fluide et moderne pour :
- **Découvrir des produits** avec transparence garantie
- **Publier des produits** via capture webcam obligatoire
- **Naviguer intuitivement** dans un environnement sans pression commerciale
- **Gérer son profil** et ses notifications

## 🛠 Technologies

- **Framework** : Angular 17+
- **Langage** : TypeScript
- **Styles** : Tailwind CSS
- **Programmation réactive** : RxJS
- **HTTP Client** : Angular HttpClient
- **Routing** : Angular Router
- **Forms** : Reactive Forms + Template-driven Forms
- **Webcam** : ngx-webcam
- **Build** : Angular CLI

## 🚀 Installation

### Prérequis
- Node.js >= 16.0.0
- npm >= 8.0.0
- Angular CLI >= 17.0.0

### Étapes d'installation

```bash
# Cloner le repository
git clone <repository-url>
cd fotoljaay/frontend/fotoljaay-frontend

# Installer les dépendances
npm install

# Vérifier l'installation
ng version
```

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5080/api'
};
```

Et `src/environments/environment.prod.ts` pour la production :

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.fotoljaay.com/api'
};
```

## 📁 Structure du Projet

```
frontend/fotoljaay-frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Composant racine
│   │   ├── app.config.ts         # Configuration Angular
│   │   ├── app.routes.ts         # Configuration des routes
│   │   ├── app.html              # Template racine
│   │   ├── app.css               # Styles globaux
│   │   ├── components/           # Composants réutilisables
│   │   │   └── navbar/           # Barre de navigation
│   │   ├── pages/                # Pages de l'application
│   │   │   ├── auth/             # Authentification
│   │   │   │   ├── login/        # Connexion
│   │   │   │   └── register/     # Inscription
│   │   │   ├── products/         # Gestion des produits
│   │   │   │   ├── list/         # Liste des produits
│   │   │   │   ├── add/          # Ajout de produit
│   │   │   │   └── detail/       # Détail produit
│   │   │   └── profile/          # Profil utilisateur
│   │   └── services/             # Services Angular
│   │       ├── auth.service.ts   # Service d'authentification
│   │       ├── product.service.ts # Service produits
│   │       └── category.service.ts # Service catégories
│   ├── environments/             # Configuration environnements
│   ├── styles.css                # Styles globaux Tailwind
│   ├── index.html                # Point d'entrée HTML
│   └── main.ts                   # Point d'entrée TypeScript
├── angular.json                  # Configuration Angular CLI
├── tsconfig.json                 # Configuration TypeScript
├── tailwind.config.js            # Configuration Tailwind CSS
└── package.json
```

## 🎨 Fonctionnalités

### Interface Utilisateur
- **Design responsive** : Adaptation mobile, tablette, desktop
- **Navigation intuitive** : Structure claire et accessible
- **Feedback visuel** : Indicateurs de chargement, messages d'erreur/succès
- **Accessibilité** : Support clavier, contraste, labels appropriés

### Capture Webcam
- **Intégration ngx-webcam** : Capture photo en temps réel
- **Contrôles intuitifs** :
  - Bouton de capture
  - Aperçu des photos
  - Suppression d'images
  - Validation du nombre minimum
- **Instructions claires** : Guide utilisateur pour la capture

### Gestion des Produits
- **Liste paginée** : Produits avec filtres avancés
- **Détail produit** : Vue complète avec informations vendeur
- **Ajout de produit** : Formulaire avec validation webcam
- **Statuts visuels** : Badges pour VIP, statuts de modération

### Authentification
- **Connexion/Inscription** : Forms réactives avec validation
- **Gestion de session** : JWT tokens, persistence locale
- **Protection des routes** : Guards Angular

### Notifications
- **Système intégré** : Affichage des notifications utilisateur
- **Types visuels** : INFO, WARNING, SUCCESS, ERROR
- **Gestion de lecture** : Marquage automatique

## 🛣️ Routing

### Configuration des Routes

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'products', component: List },
  { path: 'product/:id', component: Detail },
  { path: 'add-product', component: Add },
  { path: 'profile', component: Profile },
  { path: '**', redirectTo: '/products' }
];
```

### Routes Protégées
- **Ajout de produit** : Réservé aux vendeurs authentifiés
- **Profil** : Accessible uniquement connecté
- **Actions modérateur** : Réservées aux gestionnaires

## 🔧 Services

### AuthService
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(credentials: LoginRequest): Observable<AuthResponse>
  register(userData: RegisterRequest): Observable<AuthResponse>
  logout(): Observable<any>
  getCurrentUser(): Observable<User>
  isAuthenticated(): boolean
  isSeller(): boolean
  isManager(): boolean
}
```

### ProductService
```typescript
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getAllProducts(params?: ProductFilters): Observable<ProductResponse>
  getProductById(id: string): Observable<Product>
  createProduct(product: ProductInput): Observable<Product>
  updateProduct(id: string, product: Partial<ProductInput>): Observable<Product>
  deleteProduct(id: string): Observable<void>
}
```

### CategoryService
```typescript
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  getAllCategories(): Observable<CategoryResponse>
  getCategoryById(id: string): Observable<Category>
}
```

## 🎨 Styles

### Tailwind CSS
Configuration centralisée dans `tailwind.config.js` :

```javascript
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444'
      }
    },
  },
  plugins: [],
}
```

### Classes Utilitaires
- **Boutons** : `btn-primary`, `btn-secondary`
- **Formulaires** : `input-field`, validation states
- **Cartes** : `card`, `card-hover`
- **Badges** : Status, VIP, notifications
- **Loading** : Spinners, skeletons

### Responsive Design
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## 🧪 Tests

### Configuration des Tests
- **Framework** : Jasmine + Karma
- ** Librairie** : Angular Testing Utilities

### Structure des Tests
```
src/
├── app/
│   ├── components/
│   │   └── navbar/
│   │       ├── navbar.component.spec.ts
│   │       └── navbar.component.ts
│   └── services/
│       ├── auth.service.spec.ts
│       └── auth.service.ts
```

### Exécution des Tests
```bash
# Tests unitaires
ng test

# Tests avec couverture
ng test --code-coverage

# Tests e2e
ng e2e
```

### Exemple de Test
```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should retrieve products', () => {
    const mockProducts = [{ id: '1', title: 'Test Product' }];

    service.getAllProducts().subscribe(products => {
      expect(products.data).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });
});
```

## 🏗️ Build & Déploiement

### Build de Développement
```bash
ng build
# Output: dist/fotoljaay-frontend/
```

### Build de Production
```bash
ng build --configuration production
```

### Optimisations de Production
- **AOT Compilation** : Ahead-of-Time activé
- **Tree Shaking** : Suppression du code inutilisé
- **Minification** : Réduction de la taille des bundles
- **Compression** : Gzip/Brotli
- **Lazy Loading** : Chargement différé des modules

### Configuration de Build
```json
// angular.json
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "500kB",
          "maximumError": "1MB"
        }
      ],
      "optimization": true,
      "sourceMap": false,
      "namedChunks": false
    }
  }
}
```

### Déploiement
```bash
# Build optimisé
ng build --configuration production

# Déployer le contenu de dist/fotoljaay-frontend/
# Vers votre serveur web (Nginx, Apache, etc.)
```

## 🔧 Scripts NPM

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "e2e": "ng e2e"
  }
}
```

## 🌟 Fonctionnalités Avancées

### Programmation Réactive
- **Observables RxJS** : Gestion des flux de données
- **Operators** : map, filter, switchMap, catchError
- **Subjects** : Communication inter-composants

### Gestion d'État
- **Services** : État partagé entre composants
- **BehaviorSubjects** : État réactif
- **LocalStorage** : Persistence des données utilisateur

### Performance
- **OnPush Change Detection** : Optimisation des rendus
- **Lazy Loading** : Chargement différé des routes
- **TrackBy Functions** : Optimisation des listes
- **Virtual Scrolling** : Pour grandes listes (futur)

### Accessibilité
- **ARIA Labels** : Labels appropriés pour les lecteurs d'écran
- **Keyboard Navigation** : Support complet du clavier
- **Focus Management** : Gestion du focus
- **Color Contrast** : Respect des normes d'accessibilité

## 🔍 Debugging

### Outils de Développement
```typescript
// Debug RxJS
import { tap } from 'rxjs/operators';

observable$.pipe(
  tap(data => console.log('Debug:', data))
).subscribe();

// Debug Angular
import { ChangeDetectorRef } from '@angular/core';

constructor(private cdr: ChangeDetectorRef) {}

debugChangeDetection() {
  this.cdr.detectChanges();
}
```

### Console Logging
```typescript
// Logging structuré
private logger = {
  info: (message: string, data?: any) => console.log(`[INFO] ${message}`, data),
  error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error),
  warn: (message: string, data?: any) => console.warn(`[WARN] ${message}`, data)
};
```

## 📱 Support Mobile

### Progressive Web App (PWA)
Configuration pour transformation en PWA :
- **Service Worker** : Mise en cache hors ligne
- **Web App Manifest** : Installation comme application native
- **Push Notifications** : Notifications push (futur)

### Responsive Design
- **Breakpoints Tailwind** : sm, md, lg, xl
- **Flexbox/Grid** : Layouts adaptatifs
- **Touch Events** : Support tactile optimisé

## 🔄 Intégration Continue

### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:ci
      - run: npm run build
```

## 📊 Monitoring

### Analytics (futur)
- **Google Analytics** : Suivi du comportement utilisateur
- **Performance Monitoring** : Core Web Vitals
- **Error Tracking** : Sentry ou équivalent

### Métriques
- **Temps de chargement** : First Contentful Paint, Largest Contentful Paint
- **Taux d'erreur** : JavaScript errors, failed requests
- **Utilisation** : Pages vues, sessions, utilisateurs

---

**Fotoljaay Frontend** - Interface moderne pour une découverte transparente. 🎨✨
