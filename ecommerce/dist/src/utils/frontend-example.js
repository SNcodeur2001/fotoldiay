// Exemple d'utilisation du système d'autorisation côté frontend (JavaScript/TypeScript)
// Ce fichier peut être adapté selon votre framework frontend (React, Vue, Angular, etc.)
// Types d'utilisateurs (à synchroniser avec le backend)
export const TypeUtilisateur = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    CAISSIER: 'CAISSIER',
    EMPLOYEE: 'EMPLOYEE'
};
// Service d'authentification
export class AuthService {
    static TOKEN_KEY = 'authToken';
    static API_BASE = '/api/auth';
    // Connexion
    static async login(email, password) {
        try {
            const response = await fetch(`${this.API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                localStorage.setItem(this.TOKEN_KEY, data.token);
                return { success: true, user: data.user, token: data.token };
            }
            else {
                return { success: false, error: data.error || 'Erreur de connexion' };
            }
        }
        catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return { success: false, error: 'Erreur de réseau' };
        }
    }
    // Déconnexion
    static async logout() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (token) {
            try {
                await fetch(`${this.API_BASE}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
            }
        }
        localStorage.removeItem(this.TOKEN_KEY);
    }
    // Récupération du token stocké
    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    // Vérification si l'utilisateur est connecté
    static isAuthenticated() {
        return !!this.getToken();
    }
    // Récupération du profil utilisateur
    static async getProfile() {
        const token = this.getToken();
        if (!token) {
            return { success: false, error: 'Aucun token trouvé' };
        }
        try {
            const response = await fetch(`${this.API_BASE}/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok && data.success) {
                return { success: true, user: data.user };
            }
            else {
                return { success: false, error: data.error || 'Erreur lors de la récupération du profil' };
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            return { success: false, error: 'Erreur de réseau' };
        }
    }
}
// Service pour les requêtes authentifiées
export class ApiService {
    static getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = AuthService.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }
    // Requête GET authentifiée
    static async get(url) {
        return fetch(url, {
            method: 'GET',
            headers: this.getHeaders()
        });
    }
    // Requête POST authentifiée
    static async post(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
    }
    // Requête PUT authentifiée
    static async put(url, data) {
        return fetch(url, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
    }
    // Requête DELETE authentifiée
    static async delete(url) {
        return fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
    }
}
// Gestion des permissions côté frontend
export class PermissionService {
    // Matrice simplifiée des permissions frontend
    static PERMISSIONS = {
        [TypeUtilisateur.SUPER_ADMIN]: ['*'], // Accès complet
        [TypeUtilisateur.ADMIN]: [
            'employes.create', 'employes.read', 'employes.update', 'employes.delete',
            'payrun.create', 'payrun.read', 'payrun.update', 'payrun.approve',
            'paiements.create', 'paiements.read', 'paiements.update', 'paiements.execute',
            'departements.create', 'departements.read', 'departements.update', 'departements.delete',
            'utilisateurs.create', 'utilisateurs.read', 'utilisateurs.update', 'utilisateurs.delete',
            'entreprise.read', 'entreprise.update',
            'documents.read', 'documents.create', 'documents.export',
            'audit.read'
        ],
        [TypeUtilisateur.MANAGER]: [
            'employes.read', 'employes.update',
            'payrun.read', 'payrun.approve',
            'paiements.read',
            'conges.read', 'conges.approve', 'conges.reject',
            'presences.read', 'presences.update',
            'documents.read', 'documents.export'
        ],
        [TypeUtilisateur.CAISSIER]: [
            'employes.read',
            'payrun.read',
            'payslips.read', 'payslips.update',
            'paiements.create', 'paiements.read', 'paiements.update', 'paiements.execute',
            'documents.read', 'documents.create'
        ],
        [TypeUtilisateur.EMPLOYEE]: [
            'employes.read.own',
            'payslips.read.own',
            'conges.create.own', 'conges.read.own',
            'presences.read.own',
            'documents.read.own'
        ]
    };
    // Vérification des permissions
    static hasPermission(userType, permission) {
        const userPermissions = this.PERMISSIONS[userType] || [];
        // SUPER_ADMIN a toutes les permissions
        if (userPermissions.includes('*')) {
            return true;
        }
        // Vérification exacte de la permission
        return userPermissions.includes(permission);
    }
    // Vérification des rôles
    static hasRole(userType, requiredRoles) {
        return requiredRoles.includes(userType);
    }
    // Vérification si l'utilisateur peut accéder à une ressource
    static canAccess(userType, action, resource) {
        const permission = `${resource}.${action}`;
        return this.hasPermission(userType, permission);
    }
}
// Service pour la gestion des employés
export class EmployeeService {
    static BASE_URL = '/api/employes';
    // Liste des employés
    static async getEmployees(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `${this.BASE_URL}?${queryParams}` : this.BASE_URL;
            const response = await ApiService.get(url);
            const data = await response.json();
            if (response.ok && data.success) {
                return { success: true, data: data.data };
            }
            else {
                return { success: false, error: data.error || 'Erreur lors du chargement' };
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des employés:', error);
            return { success: false, error: 'Erreur de réseau' };
        }
    }
    // Détails d'un employé
    static async getEmployee(id) {
        try {
            const response = await ApiService.get(`${this.BASE_URL}/${id}`);
            const data = await response.json();
            if (response.ok && data.success) {
                return { success: true, data: data.data };
            }
            else {
                return { success: false, error: data.error || 'Erreur lors du chargement' };
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement de l\'employé:', error);
            return { success: false, error: 'Erreur de réseau' };
        }
    }
    // Création d'un employé
    static async createEmployee(employeeData) {
        try {
            const response = await ApiService.post(this.BASE_URL, employeeData);
            const data = await response.json();
            if (response.ok && data.success) {
                return { success: true, data: data.data };
            }
            else {
                return { success: false, error: data.error || 'Erreur lors de la création' };
            }
        }
        catch (error) {
            console.error('Erreur lors de la création de l\'employé:', error);
            return { success: false, error: 'Erreur de réseau' };
        }
    }
    // Mise à jour d'un employé
    static async updateEmployee(id, employeeData) {
        try {
            const response = await ApiService.put(`${this.BASE_URL}/${id}`, employeeData);
            const data = await response.json();
            if (response.ok && data.success) {
                return { success: true, data: data.data };
            }
            else {
                return { success: false, error: data.error || 'Erreur lors de la mise à jour' };
            }
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de l\'employé:', error);
            return { success: false, error: 'Erreur de réseau' };
        }
    }
    // Suppression d'un employé
    static async deleteEmployee(id) {
        try {
            const response = await ApiService.delete(`${this.BASE_URL}/${id}`);
            const data = await response.json();
            if (response.ok && data.success) {
                return { success: true };
            }
            else {
                return { success: false, error: data.error || 'Erreur lors de la suppression' };
            }
        }
        catch (error) {
            console.error('Erreur lors de la suppression de l\'employé:', error);
            return { success: false, error: 'Erreur de réseau' };
        }
    }
}
// Exemple d'utilisation dans une page/composant
/*
// Connexion
const loginResult = await AuthService.login('admin@entreprise.com', 'password');
if (loginResult.success) {
  console.log('Connexion réussie:', loginResult.user);
} else {
  console.error('Erreur:', loginResult.error);
}

// Vérification des permissions avant d'afficher un bouton
const user = await AuthService.getProfile();
if (user.success && PermissionService.canAccess(user.user.type, 'create', 'employes')) {
  // Afficher le bouton "Ajouter un employé"
}

// Chargement des employés selon les permissions
const employeesResult = await EmployeeService.getEmployees({ statut: 'ACTIF' });
if (employeesResult.success) {
  console.log('Employés:', employeesResult.data);
}

// Création d'un employé (si autorisé)
if (PermissionService.hasPermission(userType, 'employes.create')) {
  const createResult = await EmployeeService.createEmployee({
    matricule: 'EMP001',
    nom: 'Doe',
    prenom: 'John',
    // ... autres champs
  });
}
*/
export default {
    AuthService,
    ApiService,
    PermissionService,
    EmployeeService,
    TypeUtilisateur
};
