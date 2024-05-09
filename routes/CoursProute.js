const express = require('express');
const router = express.Router();
const CoursPController = require('../controllers/CoursPController');
const upload = require("../middleware/fileapp")



router.post('/ajouter/:formationId', upload.any('contenu'), CoursPController.createcoursP);
router.get('/lister', CoursPController.getAllcourss); 
router.get('/lister', CoursPController.listerCours);
router.put('/modifier/:id_cp',upload.any('contenu'), CoursPController.updatecours);
router.delete('/supprimer/:id_cp', CoursPController.deletecours);
router.get('/rechercher', CoursPController.searchcourssByTitre);
router.get('/getCoursById/:id_cp', CoursPController.getcoursById);


router.get('/formation/:formationId/cours', CoursPController.getCoursByFormationId);

module.exports = router;
