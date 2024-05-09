const express = require('express');
const router = express.Router();
const PublicationController = require('../controllers/PublicationController');
const upload = require("../middleware/fileapp");


router.post('/ajouter', upload.any('contenu'), PublicationController.createPublication);
router.get('/lister', PublicationController.getAllPublications);
router.put('/modifier/:id_public', PublicationController.updatePublication);
router.delete('/supprimer/:id_public', PublicationController.deletePublication);
router.get('/rechercher', PublicationController.searchPublicationsByTitre);
router.get('/getPublicationById/:id', PublicationController.getPublicationById);
router.put('/accepter/:id_public', PublicationController.rejectPublication);
router.put('/refuser/:id_public', PublicationController.rejectPublication);
router.get('/publication/:id_public/creation-date', PublicationController.getPublicationCreationDate);

module.exports = router;
