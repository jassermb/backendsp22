const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const CoursGController = require('../controllers/CoursGController');
const upload = require("../middleware/fileapp");


// Créer un cours (sécurisé avec le token et enregistrer l'ID de l'instructeur)

router.post('/ajouter',upload.any('contenu'),CoursGController.createcours);

router.get('/getcoursByInstructorId/:id', CoursGController.getcoursByInstructorId);

// Obtenir la liste de tous les cours (sécurisé avec le token)
router.get('/lister', CoursGController.getAllcourss);

// Modifier un cours (sécurisé avec le token)
router.put('/modifier/:id_cg', authenticateToken , upload.any('contenu'), CoursGController.updatecours);

// Supprimer un cours (sécurisé avec le token)
router.delete('/supprimer/:id_cg', authenticateToken, CoursGController.deletecours); 

// Rechercher des cours par titre (sécurisé avec le token)
router.get('/rechercherByTitre', authenticateToken, CoursGController.searchcourssByTitre);

// Obtenir un cours par son ID (sécurisé avec le token)
router.get('/getCoursGById/:id', CoursGController.getcoursById);

// Obtenir le nombre total de cours gratuits (sécurisé avec le token)
router.get('/count', authenticateToken, CoursGController.getFreeCourseCount);
router.put('/accepter/:id_cg', CoursGController.acceptCours);
router.put('/refuser/:id_cg', CoursGController.rejectCours);
router.get('/notificationLastCours',CoursGController.getNotificationLastCours);

module.exports = router;
