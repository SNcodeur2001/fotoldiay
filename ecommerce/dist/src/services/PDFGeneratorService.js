import PDFDocument from 'pdfkit';
import fs from 'fs/promises';
import path from 'path';
export class PDFGeneratorService {
    static UPLOADS_DIR = 'uploads/documents';
    static LOGOS_DIR = 'uploads/logos';
    constructor() {
        this.ensureDirectoriesExist();
    }
    async ensureDirectoriesExist() {
        try {
            await fs.access(PDFGeneratorService.UPLOADS_DIR);
        }
        catch {
            await fs.mkdir(PDFGeneratorService.UPLOADS_DIR, { recursive: true });
        }
        try {
            await fs.access(PDFGeneratorService.LOGOS_DIR);
        }
        catch {
            await fs.mkdir(PDFGeneratorService.LOGOS_DIR, { recursive: true });
        }
    }
    /**
     * Génère un bulletin de paie PDF personnalisé pour l'entreprise
     */
    async generatePayslipPDF(payslip) {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: {
                Title: `Bulletin de paie - ${payslip.employe.nom} ${payslip.employe.prenom}`,
                Subject: `Période ${payslip.payRun.periode}`,
                Author: payslip.employe.entreprise.nom
            }
        });
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        await this.buildPayslipContent(doc, payslip);
        doc.end();
        return new Promise((resolve, reject) => {
            doc.on('end', async () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const fileName = `bulletin_${payslip.numero}_${Date.now()}.pdf`;
                    const filePath = path.join(PDFGeneratorService.UPLOADS_DIR, fileName);
                    await fs.writeFile(filePath, buffer);
                    resolve({ filePath, buffer });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
    /**
     * Génère un reçu de paiement PDF personnalisé
     */
    async generatePaymentReceiptPDF(paiement) {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: {
                Title: `Reçu de paiement - ${paiement.reference}`,
                Subject: `Paiement ${paiement.employe.nom} ${paiement.employe.prenom}`,
                Author: paiement.employe.entreprise.nom
            }
        });
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        await this.buildReceiptContent(doc, paiement);
        doc.end();
        return new Promise((resolve, reject) => {
            doc.on('end', async () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const fileName = `recu_${paiement.reference}_${Date.now()}.pdf`;
                    const filePath = path.join(PDFGeneratorService.UPLOADS_DIR, fileName);
                    await fs.writeFile(filePath, buffer);
                    resolve({ filePath, buffer });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
    async buildPayslipContent(doc, payslip) {
        const entreprise = payslip.employe.entreprise;
        const employe = payslip.employe;
        // Couleurs personnalisées de l'entreprise
        const primaryColor = entreprise.primaryColor || '#2563eb';
        const secondaryColor = entreprise.secondaryColor || '#f1f5f9';
        const textColor = entreprise.textColor || '#1e293b';
        // En-tête avec logo de l'entreprise
        await this.addCompanyHeader(doc, entreprise, primaryColor, textColor);
        // Titre du document
        doc.fontSize(18)
            .fillColor(primaryColor)
            .text('BULLETIN DE PAIE', 50, 120, { align: 'center' });
        // Informations période
        doc.fontSize(12)
            .fillColor(textColor)
            .text(`Période: ${payslip.payRun.periode}`, 50, 150)
            .text(`N° Bulletin: ${payslip.numero}`, 350, 150);
        // Section Employé
        this.addSectionHeader(doc, 'INFORMATIONS EMPLOYÉ', 180, primaryColor, secondaryColor);
        doc.fontSize(10)
            .fillColor(textColor)
            .text(`Nom: ${employe.nom} ${employe.prenom}`, 60, 200)
            .text(`Poste: ${employe.poste || 'Non spécifié'}`, 60, 215)
            .text(`Département: ${employe.departement?.nom || 'Non spécifié'}`, 300, 200)
            .text(`Matricule: ${employe.matricule || 'N/A'}`, 300, 215);
        // Section Éléments de paie
        let yPos = 250;
        this.addSectionHeader(doc, 'ÉLÉMENTS DE PAIE', yPos, primaryColor, secondaryColor);
        yPos += 30;
        // Éléments de base
        const elementsBase = [
            { label: 'Salaire de base', value: payslip.salaireBase },
            { label: 'Prime de présence', value: payslip.primePresence },
            { label: 'Prime de rendement', value: payslip.primeRendement },
            { label: 'Prime de transport', value: payslip.primeTransport },
            { label: 'Autres primes', value: payslip.autresPrimes },
            { label: 'Heures supplémentaires', value: payslip.montantHeuresSupp },
        ];
        elementsBase.forEach(element => {
            if (element.value > 0) {
                doc.text(`${element.label}:`, 60, yPos)
                    .text(this.formatCurrency(element.value), 400, yPos, { align: 'right' });
                yPos += 15;
            }
        });
        // Salaire brut
        yPos += 10;
        doc.fontSize(11)
            .fillColor(primaryColor)
            .text('SALAIRE BRUT:', 60, yPos)
            .text(this.formatCurrency(payslip.salaireBrut), 400, yPos, { align: 'right' });
        // Section Déductions
        yPos += 30;
        this.addSectionHeader(doc, 'DÉDUCTIONS', yPos, primaryColor, secondaryColor);
        yPos += 30;
        const deductions = [
            { label: 'Cotisations CSS', value: payslip.cotisationsCSS },
            { label: 'Cotisation IPM Employé', value: payslip.cotisationIPMEmploye },
            { label: 'Impôt sur le revenu', value: payslip.impotSurRevenu },
            { label: 'Avances déduites', value: payslip.avancesDeduites },
            { label: 'Autres déductions', value: payslip.autresDeductions },
        ];
        doc.fontSize(10).fillColor(textColor);
        deductions.forEach(deduction => {
            if (deduction.value > 0) {
                doc.text(`${deduction.label}:`, 60, yPos)
                    .text(`-${this.formatCurrency(deduction.value)}`, 400, yPos, { align: 'right' });
                yPos += 15;
            }
        });
        // Total déductions
        yPos += 10;
        doc.fontSize(11)
            .fillColor('#dc2626')
            .text('TOTAL DÉDUCTIONS:', 60, yPos)
            .text(`-${this.formatCurrency(payslip.totalDeductions)}`, 400, yPos, { align: 'right' });
        // Net à payer
        yPos += 30;
        doc.rect(50, yPos - 5, 500, 25)
            .fillAndStroke(primaryColor, primaryColor);
        doc.fontSize(14)
            .fillColor('white')
            .text('NET À PAYER:', 60, yPos)
            .text(this.formatCurrency(payslip.salaireNetAPayer), 400, yPos, { align: 'right' });
        // Informations paiement si payé
        if (payslip.statut === 'PAYE' && payslip.montantPaye > 0) {
            yPos += 40;
            doc.fontSize(10)
                .fillColor(textColor)
                .text(`Montant payé: ${this.formatCurrency(payslip.montantPaye)}`, 60, yPos)
                .text(`Statut: ${this.getStatutLabel(payslip.statut)}`, 300, yPos);
        }
        // Pied de page
        this.addFooter(doc, entreprise, textColor);
    }
    async buildReceiptContent(doc, paiement) {
        const entreprise = paiement.employe.entreprise;
        const employe = paiement.employe;
        const primaryColor = entreprise.primaryColor || '#2563eb';
        const textColor = entreprise.textColor || '#1e293b';
        // En-tête
        await this.addCompanyHeader(doc, entreprise, primaryColor, textColor);
        // Titre
        doc.fontSize(18)
            .fillColor(primaryColor)
            .text('REÇU DE PAIEMENT', 50, 120, { align: 'center' });
        // Numéro de reçu
        doc.fontSize(12)
            .fillColor(textColor)
            .text(`N° Reçu: ${paiement.numeroRecu || paiement.reference}`, 50, 150)
            .text(`Date: ${this.formatDate(paiement.datePaiement)}`, 350, 150);
        // Informations employé
        let yPos = 190;
        this.addSectionHeader(doc, 'BÉNÉFICIAIRE', yPos, primaryColor, entreprise.secondaryColor || '#f1f5f9');
        yPos += 30;
        doc.fontSize(10)
            .fillColor(textColor)
            .text(`Nom: ${employe.nom} ${employe.prenom}`, 60, yPos)
            .text(`Poste: ${employe.poste || 'Non spécifié'}`, 300, yPos);
        // Détails du paiement
        yPos += 50;
        this.addSectionHeader(doc, 'DÉTAILS DU PAIEMENT', yPos, primaryColor, entreprise.secondaryColor || '#f1f5f9');
        yPos += 30;
        const detailsPaiement = [
            { label: 'Référence', value: paiement.reference },
            { label: 'Mode de paiement', value: this.getModePaiementLabel(paiement.modePaiement) },
            { label: 'Montant', value: this.formatCurrency(paiement.montant) },
            { label: 'Bulletin concerné', value: paiement.payslip.numero },
            { label: 'Statut', value: this.getStatutPaiementLabel(paiement.statut) },
        ];
        detailsPaiement.forEach(detail => {
            doc.text(`${detail.label}:`, 60, yPos)
                .text(detail.value, 200, yPos);
            yPos += 20;
        });
        // Montant en gros
        yPos += 20;
        doc.rect(50, yPos - 5, 500, 30)
            .fillAndStroke(primaryColor, primaryColor);
        doc.fontSize(16)
            .fillColor('white')
            .text('MONTANT PAYÉ:', 60, yPos)
            .text(this.formatCurrency(paiement.montant), 400, yPos, { align: 'right' });
        // Informations additionnelles
        if (paiement.numeroTransaction) {
            yPos += 50;
            doc.fontSize(10)
                .fillColor(textColor)
                .text(`N° Transaction: ${paiement.numeroTransaction}`, 60, yPos);
        }
        if (paiement.notes) {
            yPos += 20;
            doc.text(`Notes: ${paiement.notes}`, 60, yPos);
        }
        // Signature
        yPos += 60;
        doc.text('Signature du bénéficiaire:', 60, yPos)
            .text('Signature de l\'employeur:', 300, yPos);
        // Pied de page
        this.addFooter(doc, entreprise, textColor);
    }
    async addCompanyHeader(doc, entreprise, primaryColor, textColor) {
        // Logo de l'entreprise si disponible
        if (entreprise.logo) {
            try {
                const logoPath = path.join(PDFGeneratorService.LOGOS_DIR, entreprise.logo);
                await fs.access(logoPath);
                doc.image(logoPath, 50, 30, { width: 80, height: 60 });
            }
            catch {
                // Logo non trouvé, on continue sans
            }
        }
        // Informations entreprise
        doc.fontSize(16)
            .fillColor(primaryColor)
            .text(entreprise.nom, 150, 30)
            .fontSize(10)
            .fillColor(textColor)
            .text(entreprise.adresse, 150, 50);
        if (entreprise.telephone) {
            doc.text(`Tél: ${entreprise.telephone}`, 150, 65);
        }
        if (entreprise.email) {
            doc.text(`Email: ${entreprise.email}`, 150, 80);
        }
        if (entreprise.ninea) {
            doc.text(`NINEA: ${entreprise.ninea}`, 400, 50);
        }
        // Ligne de séparation
        doc.moveTo(50, 100)
            .lineTo(550, 100)
            .strokeColor(primaryColor)
            .stroke();
    }
    addSectionHeader(doc, title, yPos, primaryColor, backgroundColor) {
        doc.rect(50, yPos, 500, 20)
            .fillAndStroke(backgroundColor, primaryColor);
        doc.fontSize(11)
            .fillColor(primaryColor)
            .text(title, 60, yPos + 5);
    }
    addFooter(doc, entreprise, textColor) {
        const pageHeight = doc.page.height;
        doc.fontSize(8)
            .fillColor(textColor)
            .text(`Document généré le ${this.formatDate(new Date())}`, 50, pageHeight - 50)
            .text(`${entreprise.nom} - Système de gestion de paie`, 50, pageHeight - 35, { align: 'center' });
    }
    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(amount);
    }
    formatDate(date) {
        return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    }
    getStatutLabel(statut) {
        const labels = {
            'GENERE': 'Généré',
            'VALIDE': 'Validé',
            'EN_ATTENTE_PAIEMENT': 'En attente de paiement',
            'PAIEMENT_PARTIEL': 'Paiement partiel',
            'PAYE': 'Payé',
            'ANNULE': 'Annulé'
        };
        return labels[statut] || statut;
    }
    getModePaiementLabel(mode) {
        const labels = {
            'ESPECES': 'Espèces',
            'VIREMENT_BANCAIRE': 'Virement bancaire',
            'CHEQUE': 'Chèque',
            'ORANGE_MONEY': 'Orange Money',
            'FREE_MONEY': 'Free Money',
            'WAVE': 'Wave',
            'WIZALL_MONEY': 'Wizall Money',
            'AUTRE': 'Autre'
        };
        return labels[mode] || mode;
    }
    getStatutPaiementLabel(statut) {
        const labels = {
            'EN_ATTENTE': 'En attente',
            'TRAITE': 'Traité',
            'CONFIRME': 'Confirmé',
            'ECHEC': 'Échec',
            'ANNULE': 'Annulé'
        };
        return labels[statut] || statut;
    }
}
