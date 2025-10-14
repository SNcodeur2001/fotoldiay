# TODO - Système de Modération des Produits

## Backend
- [x] Ajouter middleware d'authentification pour routes de modération (GESTIONNAIRE requis)
- [x] Tester les permissions des routes approve/reject

## Frontend - Services
- [x] Ajouter méthodes approveProduct() et rejectProduct() dans ProductService

## Frontend - Pages
- [x] Créer page de modération (/moderation) pour gestionnaires
- [x] Modifier list.html pour afficher boutons approuver/rejeter si GESTIONNAIRE

## Frontend - Routes
- [x] Ajouter route /moderation dans app.routes.ts

## Frontend - Auth Guards
- [x] Créer guard pour vérifier rôle GESTIONNAIRE

## Notifications
- [ ] Ajouter notifications backend pour informer vendeurs des décisions
- [ ] Afficher notifications frontend

## Tests
- [ ] Tester flux complet : publication -> modération -> notification
- [ ] Vérifier permissions utilisateur
