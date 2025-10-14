// import { PrismaClient, TypeUtilisateur, RoleEmploye } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import { AuthService } from '../services/authService.js';
export {};
// const prisma = new PrismaClient();
// /**
//  * Script de test du système d'autorisation
//  * Crée des données de test et vérifie le fonctionnement
//  */
// async function testAuthorizationSystem() {
//   try {
//     console.log('🚀 Test du système d\'autorisation...\n');
//     // 1. Créer une entreprise de test
//     console.log('1. Création d\'une entreprise de test...');
//     const entreprise = await prisma.entreprise.create({
//       data: {
//         nom: 'Entreprise Test',
//         adresse: '123 Rue de Test',
//         email: 'contact@entreprise-test.com',
//         ninea: 'TEST123456',
//         monnaie: 'XOF'
//       }
//     });
//     console.log(`✅ Entreprise créée: ${entreprise.nom} (ID: ${entreprise.id})\n`);
//     // 2. Créer des utilisateurs de test avec différents rôles
//     console.log('2. Création d\'utilisateurs de test...');
//     const utilisateurs = [];
//     const rolesTest = [
//       { type: TypeUtilisateur.SUPER_ADMIN, email: 'superadmin@test.com', nom: 'Super', prenom: 'Admin' },
//       { type: TypeUtilisateur.EMPLOYEE, email: 'admin@entreprise-test.com', nom: 'Admin', prenom: 'Entreprise' },
//       { type: TypeUtilisateur.MANAGER, email: 'manager@entreprise-test.com', nom: 'Manager', prenom: 'Departement' },
//       { type: TypeUtilisateur.EMPLOYEE, email: 'caissier@entreprise-test.com', nom: 'Caissier', prenom: 'Test' },
//       { type: TypeUtilisateur.EMPLOYEE, email: 'employe@entreprise-test.com', nom: 'Employe', prenom: 'Simple' }
//     ];
//     for (const role of rolesTest) {
//       const hashedPassword = await bcrypt.hash('password123', 12);
//       const utilisateur = await prisma.utilisateur.create({
//         data: {
//           nom: role.nom,
//           prenom: role.prenom,
//           email: role.email,
//           password: hashedPassword,
//           type: role.type,
//           entrepriseId: entreprise.id,
//           actif: true
//         }
//       });
//       utilisateurs.push(utilisateur);
//       console.log(`✅ ${role.type}: ${role.email}`);
//     }
//     console.log('');
//     // 3. Créer un département de test
//     console.log('3. Création d\'un département de test...');
//     const departement = await prisma.departement.create({
//       data: {
//         nom: 'Département IT',
//         description: 'Département informatique',
//         entrepriseId: entreprise.id
//       }
//     });
//     console.log(`✅ Département créé: ${departement.nom}\n`);
//     // 4. Créer des employés de test
//     console.log('4. Création d\'employés de test...');
//     const employes = [];
//     for (let i = 1; i <= 3; i++) {
//       const employe = await prisma.employe.create({
//         data: {
//           matricule: `EMP00${i}`,
//           nom: `Employé${i}`,
//           prenom: `Test${i}`,
//           adresse: `${i} Rue Test`,
//           poste: `Poste ${i}`,
//           typeContrat: 'CDI',
//           dateEmbauche: new Date(),
//           salaireBase: 500000 + (i * 100000),
//           entrepriseId: entreprise.id,
//           departementId: i <= 2 ? departement.id : undefined // Les 2 premiers dans le département
//         }
//       });
//       employes.push(employe);
//       console.log(`✅ Employé créé: ${employe.matricule} - ${employe.nom} ${employe.prenom}`);
//     }
//     console.log('');
//     // 5. Test des connexions
//     console.log('5. Test des connexions...');
//     for (const user of utilisateurs) {
//       const loginResult = await AuthService.login({
//         email: user.email,
//         password: 'password123'
//       });
//       if (loginResult.success) {
//         console.log(`✅ Connexion réussie: ${user.type} - ${user.email}`);
//         // Vérification du token
//         const tokenVerification = AuthService.verifyToken(loginResult.token!);
//         if (tokenVerification.valid) {
//           console.log(`   ✅ Token valide pour ${user.email}`);
//         } else {
//           console.log(`   ❌ Token invalide pour ${user.email}: ${tokenVerification.error}`);
//         }
//       } else {
//         console.log(`❌ Connexion échouée: ${user.email} - ${loginResult.error}`);
//       }
//     }
//     console.log('');
//     // 6. Test de changement de mot de passe
//     console.log('6. Test de changement de mot de passe...');
//     const adminUser = utilisateurs.find(u => u.email === 'admin@entreprise-test.com');
//     if (adminUser) {
//       const changeResult = await AuthService.changePassword(
//         adminUser.id,
//         'password123',
//         'nouveaumotdepasse123'
//       );
//       if (changeResult.success) {
//         console.log(`✅ Mot de passe changé avec succès pour ${adminUser.email}`);
//         // Test avec l'ancien mot de passe (doit échouer)
//         const oldPasswordTest = await AuthService.login({
//           email: adminUser.email,
//           password: 'password123'
//         });
//         if (!oldPasswordTest.success) {
//           console.log(`✅ Ancien mot de passe refusé correctement`);
//         } else {
//           console.log(`❌ Ancien mot de passe encore accepté (problème de sécurité)`);
//         }
//         // Test avec le nouveau mot de passe (doit réussir)
//         const newPasswordTest = await AuthService.login({
//           email: adminUser.email,
//           password: 'nouveaumotdepasse123'
//         });
//         if (newPasswordTest.success) {
//           console.log(`✅ Nouveau mot de passe accepté correctement`);
//         } else {
//           console.log(`❌ Nouveau mot de passe refusé: ${newPasswordTest.error}`);
//         }
//       } else {
//         console.log(`❌ Échec du changement de mot de passe: ${changeResult.error}`);
//       }
//     }
//     console.log('');
//     // 7. Test des tentatives de connexion échouées
//     console.log('7. Test de sécurité - tentatives échouées...');
//     const testEmail = 'admin@entreprise-test.com';
//     for (let i = 1; i <= 3; i++) {
//       const failedAttempt = await AuthService.login({
//         email: testEmail,
//         password: 'mauvais-mot-de-passe'
//       });
//       console.log(`   Tentative ${i}: ${failedAttempt.success ? 'Réussie (problème!)' : 'Échouée (normal)'}`);
//     }
//     // Vérification du compteur de tentatives
//     const userWithFailedAttempts = await prisma.utilisateur.findUnique({
//       where: { email: testEmail }
//     });
//     if (userWithFailedAttempts && userWithFailedAttempts.tentativesConnexion > 0) {
//       console.log(`✅ Compteur de tentatives échouées: ${userWithFailedAttempts.tentativesConnexion}`);
//     }
//     console.log('');
//     console.log('🎉 Tests terminés avec succès!\n');
//     // Affichage du résumé
//     console.log('📊 RÉSUMÉ DES DONNÉES CRÉÉES:');
//     console.log(`- Entreprise: ${entreprise.nom} (${entreprise.id})`);
//     console.log(`- Utilisateurs: ${utilisateurs.length}`);
//     console.log(`- Département: ${departement.nom}`);
//     console.log(`- Employés: ${employes.length}`);
//     console.log('');
//     console.log('🔑 COMPTES DE TEST CRÉÉS:');
//     utilisateurs.forEach(user => {
//       const password = user.email === adminUser?.email ? 'nouveaumotdepasse123' : 'password123';
//       console.log(`- ${user.type}: ${user.email} / ${password}`);
//     });
//     console.log('');
//     console.log('🚀 PROCHAINES ÉTAPES:');
//     console.log('1. Intégrer les routes d\'authentification dans votre serveur Express');
//     console.log('2. Tester les endpoints avec un client REST (Postman, curl, etc.)');
//     console.log('3. Implémenter le frontend avec les hooks fournis');
//     console.log('4. Configurer les variables d\'environnement JWT_SECRET');
//   } catch (error) {
//     console.error('❌ Erreur lors du test:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
// // Fonction de nettoyage (optionnel)
// async function cleanupTestData() {
//   try {
//     console.log('🧹 Nettoyage des données de test...');
//     // Suppression en ordre inverse des dépendances
//     await prisma.employe.deleteMany({
//       where: {
//         matricule: {
//           startsWith: 'EMP'
//         }
//       }
//     });
//     await prisma.departement.deleteMany({
//       where: {
//         nom: 'Département IT'
//       }
//     });
//     await prisma.utilisateur.deleteMany({
//       where: {
//         email: {
//           endsWith: '@test.com'
//         }
//       }
//     });
//     await prisma.utilisateur.deleteMany({
//       where: {
//         email: {
//           endsWith: '@entreprise-test.com'
//         }
//       }
//     });
//     await prisma.entreprise.deleteMany({
//       where: {
//         nom: 'Entreprise Test'
//       }
//     });
//     console.log('✅ Données de test nettoyées');
//   } catch (error) {
//     console.error('❌ Erreur lors du nettoyage:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
// // Exécution du script selon l'argument
// const action = process.argv[2];
// if (action === 'cleanup') {
//   cleanupTestData();
// } else {
//   testAuthorizationSystem();
// }
