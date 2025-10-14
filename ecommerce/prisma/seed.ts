import { PrismaClient, UserRole, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash du mot de passe admin123
    const passwordHash = await bcrypt.hash("admin123", 10);

    console.log("🚀 Démarrage du seed...");

    // 1️⃣ Création du super admin
    const superAdmin = await prisma.user.upsert({
      where: { email: "jeeridev@gmail.com" },
      update: {
        name: "Jeeri Dev Super Admin",
        password: passwordHash,
        telephone: "+221781234567",
        adresse: "Plateau, Dakar, Sénégal",
        role: "GESTIONNAIRE", // Le rôle le plus élevé dans notre schéma
      },
      create: {
        name: "Jeeri Dev Super Admin",
        email: "jeeridev@gmail.com",
        password: passwordHash,
        telephone: "+221781234567",
        adresse: "Plateau, Dakar, Sénégal",
        role: "GESTIONNAIRE",
      },
    });

    console.log("✅ Super admin créé:", superAdmin.email);

    // 2️⃣ Création de 5 vendeurs
    const vendeurs = [];
    const nomsVendeurs = [
      {
        name: "Amadou DIALLO",
        email: "amadou.diallo@ecommerce.sn",
        telephone: "+221771234567",
        adresse: "Medina, Dakar, Sénégal",
      },
      {
        name: "Fatou NDIAYE",
        email: "fatou.ndiaye@ecommerce.sn",
        telephone: "+221772345678",
        adresse: "Parcelles Assainies, Dakar, Sénégal",
      },
      {
        name: "Ibrahima BA",
        email: "ibrahima.ba@ecommerce.sn",
        telephone: "+221773456789",
        adresse: "Grand Yoff, Dakar, Sénégal",
      },
      {
        name: "Awa SARR",
        email: "awa.sarr@ecommerce.sn",
        telephone: "+221774567890",
        adresse: "Keur Massar, Dakar, Sénégal",
      },
      {
        name: "Ousmane SY",
        email: "ousmane.sy@ecommerce.sn",
        telephone: "+221775678901",
        adresse: "Rufisque, Dakar, Sénégal",
      },
    ];

    for (const vendeurData of nomsVendeurs) {
      const vendeur = await prisma.user.upsert({
        where: { email: vendeurData.email },
        update: {
          name: vendeurData.name,
          password: passwordHash,
          telephone: vendeurData.telephone,
          adresse: vendeurData.adresse,
          role: "VENDEUR",
        },
        create: {
          name: vendeurData.name,
          email: vendeurData.email,
          password: passwordHash,
          telephone: vendeurData.telephone,
          adresse: vendeurData.adresse,
          role: "VENDEUR",
        },
      });
      vendeurs.push(vendeur);
      console.log("✅ Vendeur créé:", vendeur.email);
    }

    // 3️⃣ Création de quelques catégories de base
    const categories = [];
    const categoriesData = [
      {
        libelle: "Électronique",
        description: "Appareils électroniques et accessoires",
      },
      { libelle: "Vêtements", description: "Mode et vêtements pour tous" },
      {
        libelle: "Maison & Jardin",
        description: "Articles pour la maison et le jardin",
      },
      {
        libelle: "Sport & Loisirs",
        description: "Équipements sportifs et loisirs",
      },
      {
        libelle: "Livres & Médias",
        description: "Livres, films et médias divers",
      },
    ];

    for (const catData of categoriesData) {
      const category = await prisma.category.upsert({
        where: { libelle: catData.libelle },
        update: {
          description: catData.description,
        },
        create: {
          libelle: catData.libelle,
          description: catData.description,
        },
      });
      categories.push(category);
      console.log("✅ Catégorie créée:", category.libelle);
    }

    // 4️⃣ Création de produits d'exemple pour chaque vendeur
    const produitsExemples = [
      // Électronique
      {
        title: "iPhone 14 Pro",
        description: "Smartphone Apple dernière génération",
        price: 899000,
        category: 0,
      },
      {
        title: "Samsung Galaxy S23",
        description: "Smartphone Samsung haute gamme",
        price: 750000,
        category: 0,
      },
      {
        title: "MacBook Air M2",
        description: "Ordinateur portable Apple",
        price: 1200000,
        category: 0,
      },
      {
        title: "AirPods Pro",
        description: "Écouteurs sans fil Apple",
        price: 180000,
        category: 0,
      },

      // Vêtements
      {
        title: "T-shirt Coton Bio",
        description: "T-shirt en coton biologique",
        price: 15000,
        category: 1,
      },
      {
        title: "Jean Slim Noir",
        description: "Jean slim coupe moderne",
        price: 35000,
        category: 1,
      },
      {
        title: "Robe d'été Fleurie",
        description: "Robe légère pour l'été",
        price: 45000,
        category: 1,
      },
      {
        title: "Sneakers Blanches",
        description: "Baskets tendance unisexe",
        price: 65000,
        category: 1,
      },

      // Maison & Jardin
      {
        title: "Canapé 3 Places",
        description: "Canapé confortable en tissu",
        price: 250000,
        category: 2,
      },
      {
        title: "Aspirateur Robot",
        description: "Aspirateur automatique intelligent",
        price: 150000,
        category: 2,
      },
      {
        title: "Plantes d'intérieur",
        description: "Set de 5 plantes vertes",
        price: 25000,
        category: 2,
      },
      {
        title: "Lampe LED Design",
        description: "Lampe moderne à LED",
        price: 35000,
        category: 2,
      },

      // Sport & Loisirs
      {
        title: "Vélo VTT",
        description: "Vélo tout-terrain 21 vitesses",
        price: 180000,
        category: 3,
      },
      {
        title: "Ballon de Football",
        description: "Ballon officiel FIFA",
        price: 12000,
        category: 3,
      },
      {
        title: "Raquette de Tennis",
        description: "Raquette professionnelle",
        price: 85000,
        category: 3,
      },
      {
        title: "Tapis de Yoga",
        description: "Tapis antidérapant premium",
        price: 18000,
        category: 3,
      },

      // Livres & Médias
      {
        title: "Roman Bestseller",
        description: "Roman à succès de l'année",
        price: 8000,
        category: 4,
      },
      {
        title: "Livre de Cuisine",
        description: "Recettes du monde entier",
        price: 15000,
        category: 4,
      },
      {
        title: "Film Blu-ray",
        description: "Film dernière sortie",
        price: 12000,
        category: 4,
      },
      {
        title: "Jeu de Société",
        description: "Jeu familial stratégique",
        price: 22000,
        category: 4,
      },
    ];

    let produitIndex = 0;
    for (const vendeur of vendeurs) {
      // Chaque vendeur crée 4 produits
      for (let i = 0; i < 4; i++) {
        const produitData =
          produitsExemples[produitIndex % produitsExemples.length];

        const product = await prisma.product.create({
          data: {
            title: `${produitData.title} - ${vendeur.name.split(" ")[0]}`,
            description: produitData.description,
            price: produitData.price,
            status: Math.random() > 0.3 ? "VALIDE" : "EN_ATTENTE", // 70% validés
            dateExpiration: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
            userId: vendeur.id,
            categoryId: categories[produitData.category].id,
            imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${produitData.title}`,
          },
        });

        console.log(`✅ Produit créé: ${product.title}`);
        produitIndex++;
      }
    }

    // 5️⃣ Création d'un utilisateur visiteur pour les tests
    const visiteur = await prisma.user.upsert({
      where: { email: "visiteur@ecommerce.sn" },
      update: {
        name: "Visiteur Test",
        password: passwordHash,
        telephone: "+221776789012",
        adresse: "Thiès, Sénégal",
        role: "VISITEUR",
      },
      create: {
        name: "Visiteur Test",
        email: "visiteur@ecommerce.sn",
        password: passwordHash,
        telephone: "+221776789012",
        adresse: "Thiès, Sénégal",
        role: "VISITEUR",
      },
    });

    console.log("✅ Visiteur test créé:", visiteur.email);

    // 📊 Résumé
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();

    console.log("\n🎉 SEED TERMINÉ AVEC SUCCÈS !");
    console.log("========================");
    console.log(`👥 Utilisateurs créés: ${totalUsers}`);
    console.log(`   - 1 Gestionnaire (Super Admin): jeeridev@gmail.com`);
    console.log(
      `   - 5 Vendeurs: amadou.diallo@ecommerce.sn, fatou.ndiaye@ecommerce.sn, etc.`
    );
    console.log(`   - 1 Visiteur: visiteur@ecommerce.sn`);
    console.log(`📦 Produits créés: ${totalProducts}`);
    console.log(`🏷️ Catégories créées: ${totalCategories}`);
    console.log(`🔑 Mot de passe pour tous: admin123`);
    console.log("========================");
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
