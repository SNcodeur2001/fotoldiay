import prisma from "../prismaClient.js";
/**
 * Vérifier si un employé est en congé approuvé à une date donnée
 */
export async function isEmployeEnConge(employeId, date = new Date()) {
    try {
        // Normaliser la date pour ne comparer que les jours (pas les heures)
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        const congesActifs = await prisma.conge.findMany({
            where: {
                employeId,
                statut: "APPROUVE",
                dateDebut: {
                    lte: dateOnly,
                },
                dateFin: {
                    gte: dateOnly,
                },
                deletedAt: null,
            },
            select: {
                id: true,
                type: true,
                dateDebut: true,
                dateFin: true,
            },
        });
        return congesActifs.length > 0;
    }
    catch (error) {
        console.error("Erreur lors de la vérification des congés:", error);
        return false; // En cas d'erreur, on autorise le pointage
    }
}
/**
 * Récupérer les détails des congés actifs d'un employé
 */
export async function getCongesActifs(employeId, date = new Date()) {
    try {
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        const congesActifs = await prisma.conge.findMany({
            where: {
                employeId,
                statut: "APPROUVE",
                dateDebut: {
                    lte: dateOnly,
                },
                dateFin: {
                    gte: dateOnly,
                },
                deletedAt: null,
            },
            select: {
                id: true,
                type: true,
                dateDebut: true,
                dateFin: true,
                motif: true,
                nombreJours: true,
            },
            orderBy: {
                dateDebut: "asc",
            },
        });
        return congesActifs;
    }
    catch (error) {
        console.error("Erreur lors de la récupération des congés actifs:", error);
        return [];
    }
}
/**
 * Vérifier les congés pour plusieurs employés à la fois
 */
export async function getEmployesAvecStatutConge(employeIds, date = new Date()) {
    try {
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        // Récupérer tous les congés actifs pour tous les employés
        const congesActifs = await prisma.conge.findMany({
            where: {
                employeId: {
                    in: employeIds,
                },
                statut: "APPROUVE",
                dateDebut: {
                    lte: dateOnly,
                },
                dateFin: {
                    gte: dateOnly,
                },
                deletedAt: null,
            },
            select: {
                employeId: true,
                type: true,
                dateDebut: true,
                dateFin: true,
            },
        });
        // Créer un Map pour un accès rapide
        const congesMap = new Map();
        congesActifs.forEach((conge) => {
            if (!congesMap.has(conge.employeId)) {
                congesMap.set(conge.employeId, []);
            }
            congesMap.get(conge.employeId).push(conge);
        });
        // Retourner le statut pour chaque employé
        return employeIds.map((employeId) => ({
            employeId,
            enConge: congesMap.has(employeId),
            conges: congesMap.get(employeId) || [],
        }));
    }
    catch (error) {
        console.error("Erreur lors de la vérification des congés en masse:", error);
        // En cas d'erreur, retourner tous les employés comme disponibles
        return employeIds.map((employeId) => ({
            employeId,
            enConge: false,
            conges: [],
        }));
    }
}
/**
 * Filtrer les employés qui ne sont pas en congé
 */
export async function filterEmployesDisponibles(employes, date = new Date()) {
    try {
        const employeIds = employes.map((emp) => emp.id);
        const statutsConges = await getEmployesAvecStatutConge(employeIds, date);
        const employesDisponibles = employes.filter((employe) => {
            const statut = statutsConges.find((s) => s.employeId === employe.id);
            return !statut?.enConge;
        });
        return employesDisponibles;
    }
    catch (error) {
        console.error("Erreur lors du filtrage des employés disponibles:", error);
        return employes; // En cas d'erreur, retourner tous les employés
    }
}
