// Types et interfaces pour le système d'autorisation
export var TypeUtilisateur;
(function (TypeUtilisateur) {
    TypeUtilisateur["SUPER_ADMIN"] = "SUPER_ADMIN";
    TypeUtilisateur["ADMIN"] = "ADMIN";
    TypeUtilisateur["MANAGER"] = "MANAGER";
    TypeUtilisateur["CAISSIER"] = "CAISSIER";
    TypeUtilisateur["EMPLOYEE"] = "EMPLOYEE";
})(TypeUtilisateur || (TypeUtilisateur = {}));
export var Action;
(function (Action) {
    Action["CREATE"] = "CREATE";
    Action["READ"] = "READ";
    Action["UPDATE"] = "UPDATE";
    Action["DELETE"] = "DELETE";
    Action["APPROVE"] = "APPROVE";
    Action["REJECT"] = "REJECT";
    Action["PAYMENT"] = "PAYMENT";
    Action["EXPORT"] = "EXPORT";
})(Action || (Action = {}));
export var Resource;
(function (Resource) {
    Resource["ENTREPRISE"] = "ENTREPRISE";
    Resource["UTILISATEUR"] = "UTILISATEUR";
    Resource["EMPLOYE"] = "EMPLOYE";
    Resource["DEPARTEMENT"] = "DEPARTEMENT";
    Resource["PAYRUN"] = "PAYRUN";
    Resource["PAYSLIP"] = "PAYSLIP";
    Resource["PAIEMENT"] = "PAIEMENT";
    Resource["CONGE"] = "CONGE";
    Resource["PRESENCE"] = "PRESENCE";
    Resource["DOCUMENT"] = "DOCUMENT";
    Resource["CONFIGURATION"] = "CONFIGURATION";
    Resource["AUDIT"] = "AUDIT";
})(Resource || (Resource = {}));
// Matrice des permissions par type d'utilisateur
export const PERMISSIONS_MATRIX = {
    [TypeUtilisateur.SUPER_ADMIN]: [
        // Accès complet à toutes les ressources
        { action: Action.CREATE, resource: Resource.ENTREPRISE },
        { action: Action.READ, resource: Resource.ENTREPRISE },
        { action: Action.UPDATE, resource: Resource.ENTREPRISE },
        { action: Action.DELETE, resource: Resource.ENTREPRISE },
        { action: Action.CREATE, resource: Resource.UTILISATEUR },
        { action: Action.READ, resource: Resource.UTILISATEUR },
        { action: Action.UPDATE, resource: Resource.UTILISATEUR },
        { action: Action.DELETE, resource: Resource.UTILISATEUR },
        { action: Action.READ, resource: Resource.AUDIT },
        // ... toutes les autres permissions
    ],
    [TypeUtilisateur.ADMIN]: [
        // Gestion complète de son entreprise
        { action: Action.READ, resource: Resource.ENTREPRISE, conditions: ['own'] },
        { action: Action.UPDATE, resource: Resource.ENTREPRISE, conditions: ['own'] },
        { action: Action.CREATE, resource: Resource.UTILISATEUR, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.UTILISATEUR, conditions: ['own-company'] },
        { action: Action.UPDATE, resource: Resource.UTILISATEUR, conditions: ['own-company'] },
        { action: Action.DELETE, resource: Resource.UTILISATEUR, conditions: ['own-company'] },
        { action: Action.CREATE, resource: Resource.EMPLOYE, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.EMPLOYE, conditions: ['own-company'] },
        { action: Action.UPDATE, resource: Resource.EMPLOYE, conditions: ['own-company'] },
        { action: Action.DELETE, resource: Resource.EMPLOYE, conditions: ['own-company'] },
        { action: Action.CREATE, resource: Resource.DEPARTEMENT, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.DEPARTEMENT, conditions: ['own-company'] },
        { action: Action.UPDATE, resource: Resource.DEPARTEMENT, conditions: ['own-company'] },
        { action: Action.DELETE, resource: Resource.DEPARTEMENT, conditions: ['own-company'] },
        { action: Action.CREATE, resource: Resource.PAYRUN, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.PAYRUN, conditions: ['own-company'] },
        { action: Action.UPDATE, resource: Resource.PAYRUN, conditions: ['own-company'] },
        { action: Action.APPROVE, resource: Resource.PAYRUN, conditions: ['own-company'] },
        { action: Action.REJECT, resource: Resource.PAYRUN, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.PAYSLIP, conditions: ['own-company'] },
        { action: Action.UPDATE, resource: Resource.PAYSLIP, conditions: ['own-company'] },
        { action: Action.CREATE, resource: Resource.PAIEMENT, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.PAIEMENT, conditions: ['own-company'] },
        { action: Action.UPDATE, resource: Resource.PAIEMENT, conditions: ['own-company'] },
        { action: Action.PAYMENT, resource: Resource.PAIEMENT, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.CONGE, conditions: ['own-company'] },
        { action: Action.APPROVE, resource: Resource.CONGE, conditions: ['own-company'] },
        { action: Action.REJECT, resource: Resource.CONGE, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.PRESENCE, conditions: ['own-company'] },
        { action: Action.UPDATE, resource: Resource.PRESENCE, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.DOCUMENT, conditions: ['own-company'] },
        { action: Action.CREATE, resource: Resource.DOCUMENT, conditions: ['own-company'] },
        { action: Action.EXPORT, resource: Resource.DOCUMENT, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.CONFIGURATION, conditions: ['own-company'] },
        { action: Action.UPDATE, resource: Resource.CONFIGURATION, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.AUDIT, conditions: ['own-company'] }
    ],
    [TypeUtilisateur.MANAGER]: [
        // Gestion de son département
        { action: Action.READ, resource: Resource.EMPLOYE, conditions: ['own-department'] },
        { action: Action.UPDATE, resource: Resource.EMPLOYE, conditions: ['own-department'] },
        { action: Action.READ, resource: Resource.DEPARTEMENT, conditions: ['own'] },
        { action: Action.UPDATE, resource: Resource.DEPARTEMENT, conditions: ['own'] },
        { action: Action.READ, resource: Resource.PAYRUN, conditions: ['own-company'] },
        { action: Action.APPROVE, resource: Resource.PAYRUN, conditions: ['own-department'] },
        { action: Action.READ, resource: Resource.PAYSLIP, conditions: ['own-department'] },
        { action: Action.READ, resource: Resource.PAIEMENT, conditions: ['own-department'] },
        { action: Action.READ, resource: Resource.CONGE, conditions: ['own-department'] },
        { action: Action.APPROVE, resource: Resource.CONGE, conditions: ['own-department'] },
        { action: Action.REJECT, resource: Resource.CONGE, conditions: ['own-department'] },
        { action: Action.READ, resource: Resource.PRESENCE, conditions: ['own-department'] },
        { action: Action.UPDATE, resource: Resource.PRESENCE, conditions: ['own-department'] },
        { action: Action.READ, resource: Resource.DOCUMENT, conditions: ['own-department'] },
        { action: Action.EXPORT, resource: Resource.DOCUMENT, conditions: ['own-department'] }
    ],
    [TypeUtilisateur.CAISSIER]: [
        // Gestion des paiements
        { action: Action.READ, resource: Resource.EMPLOYE, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.PAYRUN, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.PAYSLIP, conditions: ['own-company'] },
        { action: Action.UPDATE, resource: Resource.PAYSLIP, conditions: ['own-company'] },
        { action: Action.CREATE, resource: Resource.PAIEMENT, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.PAIEMENT, conditions: ['own-company'] },
        { action: Action.UPDATE, resource: Resource.PAIEMENT, conditions: ['own-company'] },
        { action: Action.PAYMENT, resource: Resource.PAIEMENT, conditions: ['own-company'] },
        { action: Action.READ, resource: Resource.DOCUMENT, conditions: ['payment-related'] },
        { action: Action.CREATE, resource: Resource.DOCUMENT, conditions: ['payment-related'] }
    ],
    [TypeUtilisateur.EMPLOYEE]: [
        // Consultation uniquement de ses propres données
        { action: Action.READ, resource: Resource.EMPLOYE, conditions: ['own'] },
        { action: Action.UPDATE, resource: Resource.EMPLOYE, conditions: ['own-personal-info'] },
        { action: Action.READ, resource: Resource.PAYSLIP, conditions: ['own'] },
        { action: Action.CREATE, resource: Resource.CONGE, conditions: ['own'] },
        { action: Action.READ, resource: Resource.CONGE, conditions: ['own'] },
        { action: Action.READ, resource: Resource.PRESENCE, conditions: ['own'] },
        { action: Action.READ, resource: Resource.DOCUMENT, conditions: ['own'] }
    ]
};
