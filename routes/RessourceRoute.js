const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require("../middleware/fileapp");
const RessourceGController = require('../controllers/RessourceController');



// Créer un Ressource (sécurisé avec le token et enregistrer l'ID de l'instructeur)
 
router.post('/ajouter',upload.any('contenu'),RessourceGController.createRessource);

router.get('/getRessourceByInstructorId/:id', RessourceGController.getRessourceByInstructorId);  
 
// Obtenir la liste de tous les Ressource (sécurisé avec le token) 
router.get('/lister', RessourceGController.getAllRessources); 
router.get('/liste', RessourceGController.getRessources);
 
// Modifier un Ressource (sécurisé avec le token)
router.put('/modifier/:id_r', authenticateToken, upload.any('contenu'), RessourceGController.updateRessource);

// Supprimer un Ressource (sécurisé avec le token)
router.delete('/supprimer/:id_r', authenticateToken, RessourceGController.deleteRessource);

// Rechercher des Ressource par titre (sécurisé avec le token)
router.get('/rechercherByTitre', RessourceGController.searchRessourcesByTitre);

// Obtenir un Ressource par son ID (sécurisé avec le token)
router.get('/getRessourceGById/:id', RessourceGController.getRessourceById);  

// Obtenir le nombre total de Ressource gratuits (sécurisé avec le token) 
router.get('/count', RessourceGController.getFreeRessourceeCount); 
router.get('/rechercherByTitre/:id', RessourceGController.searchRessourcesByTitre);
router.put('/accepter/:id_cg', RessourceGController.acceptRessource);
router.put('/refuser/:id_cg', RessourceGController.rejectRessource);

module.exports = router;
