import { TypeContrat, } from "@prisma/client";
import prisma from "../prismaClient.js";
export class SalaryCalculationService {
    /**
     * Calcule le salaire d'un employé selon son type de contrat
     */
    async calculateSalary(params) {
        const { employe, payRun, pointages, joursOuvres } = params;
        switch (employe.typeContrat) {
            case TypeContrat.JOURNALIER:
                return this.calculateDailySalary(params);
            case TypeContrat.HONORAIRE:
                return this.calculateHourlySalary(params);
            case TypeContrat.CDI:
            case TypeContrat.CDD:
                return this.calculateMonthlySalary(params);
            case TypeContrat.STAGE:
                return this.calculateInternSalary(params);
            default:
                return this.calculateMonthlySalary(params);
        }
    }
    /**
     * Calcul pour employés journaliers (basé sur les jours travaillés et workedMinutes)
     */
    async calculateDailySalary(params) {
        const { employe, pointages, joursOuvres } = params;
        // Calculer les jours réellement travaillés à partir des pointages
        const joursTravailles = pointages.filter((p) => p.workedMinutes > 0).length;
        const totalMinutesTravaillees = pointages.reduce((sum, p) => sum + p.workedMinutes, 0);
        // Calcul du salaire de base journalier
        const tauxJournalier = employe.tauxJournalier || employe.salaireBase / joursOuvres;
        const montantJournalier = tauxJournalier * joursTravailles;
        // Primes spécifiques aux journaliers
        const primeAssiduité = this.calculateAttendanceBonus(joursTravailles, joursOuvres);
        const primePresence = employe.prime;
        // Déductions spécifiques
        const deductionAbsence = this.calculateAbsenceDeduction(joursOuvres - joursTravailles, tauxJournalier);
        const deductionRetard = this.calculateLatenessDeduction(pointages, tauxJournalier);
        // Calculs
        const totalPrimes = primeAssiduité + primePresence;
        const totalDeductions = deductionAbsence + deductionRetard;
        const salaireBrut = montantJournalier + totalPrimes;
        const cotisationsCSS = this.calculateCSS(salaireBrut, employe);
        const impots = this.calculateTax(salaireBrut - cotisationsCSS, employe);
        const salaireNet = salaireBrut - cotisationsCSS - impots - totalDeductions;
        const detailsCalcul = {
            typeCalcul: "JOURNALIER",
            minutesTravaillees: totalMinutesTravaillees,
            tauxUtilise: tauxJournalier,
            montantBase: montantJournalier,
            primes: { assiduité: primeAssiduité, presence: primePresence },
            deductions: { absence: deductionAbsence, retard: deductionRetard },
            remises: {},
        };
        return {
            payslipData: {
                joursTravailles,
                minutesTravaillees: totalMinutesTravaillees,
                montantJournalier,
                primeAssiduité,
                primePresence,
                deductionAbsence,
                deductionRetard,
                salaireBrut,
                cotisationsCSS,
                impotSurRevenu: impots,
                salaireNet,
                salaireNetAPayer: salaireNet,
                totalDeductions,
                salaireBase: employe.salaireBase,
                detailsCalcul,
            },
            detailsCalcul,
        };
    }
    /**
     * Calcul pour employés honoraires (basé sur les heures/minutes travaillées)
     */
    async calculateHourlySalary(params) {
        const { employe, pointages } = params;
        const totalMinutesTravaillees = pointages.reduce((sum, p) => sum + p.workedMinutes, 0);
        const heuresTravaillees = totalMinutesTravaillees / 60;
        // Calcul du taux horaire
        const tauxHoraire = employe.tauxHoraire || 0;
        const montantHoraire = heuresTravaillees * tauxHoraire;
        // Gestion des heures supplémentaires (au-delà de 8h/jour)
        const heuresSupplementaires = this.calculateOvertimeHours(pointages);
        const montantHeuresSupp = heuresSupplementaires * tauxHoraire * 1.5;
        // Primes de performance
        const primeRendement = this.calculatePerformanceBonus(heuresTravaillees, employe);
        // Remises commerciales pour les honoraires
        const remisePerformance = this.calculatePerformanceDiscount(heuresTravaillees);
        const totalPrimes = primeRendement + montantHeuresSupp;
        const totalRemises = remisePerformance;
        const salaireBrut = montantHoraire + totalPrimes - totalRemises;
        const cotisationsCSS = this.calculateCSS(salaireBrut, employe);
        const impots = this.calculateTax(salaireBrut - cotisationsCSS, employe);
        const salaireNet = salaireBrut - cotisationsCSS - impots;
        const detailsCalcul = {
            typeCalcul: "HONORAIRE",
            minutesTravaillees: totalMinutesTravaillees,
            tauxUtilise: tauxHoraire,
            montantBase: montantHoraire,
            primes: { rendement: primeRendement, heuresSupp: montantHeuresSupp },
            deductions: {},
            remises: { performance: remisePerformance },
        };
        return {
            payslipData: {
                minutesTravaillees: totalMinutesTravaillees,
                heuresNormales: heuresTravaillees - heuresSupplementaires,
                heuresSupplementaires,
                montantHoraire,
                montantHeuresSupp,
                primeRendement,
                remisePerformance,
                totalRemises,
                salaireBrut,
                cotisationsCSS,
                impotSurRevenu: impots,
                salaireNet,
                salaireNetAPayer: salaireNet,
                salaireBase: employe.salaireBase,
                detailsCalcul,
            },
            detailsCalcul,
        };
    }
    /**
     * Calcul pour employés mensuels (CDI/CDD)
     */
    async calculateMonthlySalary(params) {
        const { employe, pointages, joursOuvres } = params;
        const joursTravailles = pointages.filter((p) => p.workedMinutes > 0).length;
        const totalMinutesTravaillees = pointages.reduce((sum, p) => sum + p.workedMinutes, 0);
        const salaireBase = employe.salaireBase;
        const prorata = joursTravailles / joursOuvres;
        const salaireProrata = salaireBase * prorata;
        // Primes
        const primePresence = employe.prime;
        const primeAssiduité = this.calculateAttendanceBonus(joursTravailles, joursOuvres);
        // Déductions pour absences non justifiées
        const joursAbsence = joursOuvres - joursTravailles;
        const deductionAbsence = joursAbsence > 0 ? (salaireBase / joursOuvres) * joursAbsence : 0;
        const totalPrimes = primePresence + primeAssiduité;
        const salaireBrut = salaireProrata + totalPrimes;
        const cotisationsCSS = this.calculateCSS(salaireBrut, employe);
        const impots = this.calculateTax(salaireBrut - cotisationsCSS, employe);
        const salaireNet = salaireBrut - cotisationsCSS - impots - deductionAbsence;
        const detailsCalcul = {
            typeCalcul: "MENSUEL",
            minutesTravaillees: totalMinutesTravaillees,
            tauxUtilise: salaireBase / joursOuvres,
            montantBase: salaireProrata,
            primes: { presence: primePresence, assiduité: primeAssiduité },
            deductions: { absence: deductionAbsence },
            remises: {},
        };
        return {
            payslipData: {
                joursTravailles,
                joursAbsence,
                minutesTravaillees: totalMinutesTravaillees,
                salaireBase: salaireProrata,
                primePresence,
                primeAssiduité,
                deductionAbsence,
                salaireBrut,
                cotisationsCSS,
                impotSurRevenu: impots,
                salaireNet,
                salaireNetAPayer: salaireNet,
                totalDeductions: deductionAbsence,
                detailsCalcul,
            },
            detailsCalcul,
        };
    }
    /**
     * Calcul pour stagiaires
     */
    async calculateInternSalary(params) {
        const { employe, pointages } = params;
        const totalMinutesTravaillees = pointages.reduce((sum, p) => sum + p.workedMinutes, 0);
        const joursTravailles = pointages.filter((p) => p.workedMinutes > 0).length;
        // Indemnité de stage fixe
        const indemniteStage = employe.salaireBase;
        const primePresence = employe.prime;
        const salaireBrut = indemniteStage + primePresence;
        // Pas de cotisations pour les stagiaires
        const salaireNet = salaireBrut;
        const detailsCalcul = {
            typeCalcul: "STAGE",
            minutesTravaillees: totalMinutesTravaillees,
            tauxUtilise: 0,
            montantBase: indemniteStage,
            primes: { presence: primePresence },
            deductions: {},
            remises: {},
        };
        return {
            payslipData: {
                joursTravailles,
                minutesTravaillees: totalMinutesTravaillees,
                salaireBase: indemniteStage,
                primePresence,
                salaireBrut,
                salaireNet,
                salaireNetAPayer: salaireNet,
                detailsCalcul,
            },
            detailsCalcul,
        };
    }
    // Méthodes utilitaires
    calculateAttendanceBonus(joursTravailles, joursOuvres) {
        const tauxAssiduité = joursTravailles / joursOuvres;
        if (tauxAssiduité >= 1.0)
            return 50000; // Prime complète
        if (tauxAssiduité >= 0.9)
            return 30000; // Prime partielle
        return 0;
    }
    calculateAbsenceDeduction(joursAbsence, tauxJournalier) {
        return joursAbsence * tauxJournalier * 0.5; // 50% du salaire journalier
    }
    calculateLatenessDeduction(pointages, tauxJournalier) {
        let totalRetard = 0;
        pointages.forEach((p) => {
            if (p.entreeAt && p.workedMinutes < 480) {
                // Moins de 8h
                const minutesManquantes = 480 - p.workedMinutes;
                totalRetard += (minutesManquantes / 480) * tauxJournalier * 0.1; // 10% de déduction
            }
        });
        return totalRetard;
    }
    calculateOvertimeHours(pointages) {
        return pointages.reduce((total, p) => {
            const heuresJour = p.workedMinutes / 60;
            return total + Math.max(0, heuresJour - 8);
        }, 0);
    }
    calculatePerformanceBonus(heuresTravaillees, employe) {
        if (heuresTravaillees > 160)
            return employe.prime; // Plus de 160h/mois
        return 0;
    }
    calculatePerformanceDiscount(heuresTravaillees) {
        if (heuresTravaillees < 80)
            return 25000; // Pénalité pour moins de 80h/mois
        return 0;
    }
    calculateCSS(salaireBrut, employe) {
        if (employe.exonereCSS)
            return 0;
        const tauxCSS = employe.tauxCSSPersonnalise || 0.07;
        return salaireBrut * tauxCSS;
    }
    calculateTax(salaireImposable, employe) {
        if (employe.exonereImpot)
            return 0;
        // Calcul progressif de l'impôt (exemple simplifié)
        if (salaireImposable <= 50000)
            return 0;
        if (salaireImposable <= 100000)
            return salaireImposable * 0.05;
        return salaireImposable * 0.1;
    }
    /**
     * Récupère les pointages d'un employé pour une période
     */
    async getPointagesForPeriod(employeId, dateDebut, dateFin) {
        return await prisma.pointage.findMany({
            where: {
                employeId,
                date: {
                    gte: dateDebut,
                    lte: dateFin,
                },
                deletedAt: null,
            },
            orderBy: { date: "asc" },
        });
    }
    /**
     * Génère un payslip complet pour un employé
     */
    async generatePayslip(employeId, payRunId) {
        const employe = await prisma.employe.findUniqueOrThrow({
            where: { id: employeId },
        });
        const payRun = await prisma.payRun.findUniqueOrThrow({
            where: { id: payRunId },
        });
        const pointages = await this.getPointagesForPeriod(employeId, payRun.dateDebut, payRun.dateFin);
        const joursOuvres = this.calculateWorkingDays(payRun.dateDebut, payRun.dateFin);
        const calculationResult = await this.calculateSalary({
            employe,
            payRun,
            pointages,
            joursOuvres,
        });
        const numero = await this.generatePayslipNumber(payRunId, employeId);
        // Assurer que tous les champs requis sont définis
        const payslipData = {
            numero,
            employeId,
            payRunId,
            joursOuvres,
            salaireBase: calculationResult.payslipData.salaireBase || employe.salaireBase,
            salaireBrut: calculationResult.payslipData.salaireBrut || 0,
            salaireNet: calculationResult.payslipData.salaireNet || 0,
            salaireNetAPayer: calculationResult.payslipData.salaireNetAPayer || 0,
            ...calculationResult.payslipData,
            // Assurer que detailsCalcul est au bon format pour Prisma
            detailsCalcul: calculationResult.payslipData.detailsCalcul || null,
        };
        return await prisma.payslip.create({
            data: payslipData, // Type assertion pour éviter les erreurs de type complexes
        });
    }
    calculateWorkingDays(dateDebut, dateFin) {
        let count = 0;
        const current = new Date(dateDebut);
        while (current <= dateFin) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                // Exclure dimanche (0) et samedi (6)
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        return count;
    }
    async generatePayslipNumber(payRunId, employeId) {
        const payRun = await prisma.payRun.findUniqueOrThrow({
            where: { id: payRunId },
        });
        const count = await prisma.payslip.count({
            where: { payRunId },
        });
        return `BS-${payRun.reference}-${String(count + 1).padStart(3, "0")}`;
    }
}
export const salaryCalculationService = new SalaryCalculationService();
