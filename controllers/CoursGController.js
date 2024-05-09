const CoursModel = require('../models/CoursGModel ');
const db = require('../config/db');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require("../middleware/fileapp")

const errorHandler = (res, message) => {
    console.error(message);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
};

const updatecours = async (req, res) => {
    try {
        const { id_cg } = req.params;
        const { titre, description } = req.body;
        let contenu = req.Fnameup; // Utiliser req.Fnameup pour récupérer le contenu

        // Vérifiez si le fichier a été téléchargé pour mise à jour du contenu
        if (req.file) {
            contenu = req.file.path; // Mettez à jour le contenu avec le nouveau fichier téléchargé
        }

        // Mettre à jour le cours dans la base de données
        await CoursModel.updatecours(id_cg, titre, description, contenu);

        res.status(200).json({ success: true, message: 'Cours modifié avec succès.' });
    } catch (error) {
        console.error('Error in updatecours:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const createcours = async (req, res) => {
    try {
        // Utilisez authenticateToken pour vérifier le token et récupérer l'ID de l'instructeur
        authenticateToken(req, res, async () => {
            try {
                const id_InsctructeurC = req.user.id; // Récupérez l'ID de l'instructeur à partir du token

                const { titre, description } = req.body;
          
                
                // Vérifiez si tous les champs requis sont présents
                if (!titre || !description ) {
                    return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les données requises.' });
                }

                // Créez la cours dans la base de données avec un statut par défaut (par exemple, 0 pour "en attente")
                const contenu = req.Fnameup; // Remplacez par la valeur souhaitée pour plant
                const CoursData = { titre, description,  contenu };
               

                const result = await CoursModel.createcours(CoursData, id_InsctructeurC); // Passez l'ID de l'instructeur
                const CoursId = result.insertId;
                req.Fnameup=undefined ; 
                res.status(201).json({ 
                    success: true,
                    message: 'cours crée avec succès.',
                    CoursId: CoursId
                });
            } catch (error) {
                console.error('Erreur lors de la création de la cours :', error);
                res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
}






const getAllcourss = async (req, res) => {
    try {
        const results = await query(`
            SELECT courgratuits.*, instructeur.id AS instructeur_id, instructeur.nom AS instructeur_nom, instructeur.prenom AS instructeur_prenom , instructeur.Avatar AS instructeur_Avatar
            FROM courgratuits
            INNER JOIN instructeur ON courgratuits.id_InsctructeurC = instructeur.id
        `);

        // Convertir les résultats en une structure de données simple  id_InsctructeurC
        const formations = results.map(result => ({ ...result }));

        return res.status(200).json({ success: true, liste: formations });
    } catch (err) {
        return errorHandler(res, err);
    }
};

const getcoursByInstructorId = async (req, res) => {
    try {
        const { id } = req.params;
        const cours = await CoursModel.getcoursByInstructorId(id);
        res.status(200).json({ success: true, cours });
    } catch (error) {
        console.error('Erreur lors de la récupération des cours par ID d\'instructeur :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};



const deletecours = async (req, res) => {
    try {
        const { id_cg } = req.params;
        const result = await CoursModel.deletecours(id_cg);

        // Extraire les informations nécessaires de l'objet result
        const rowsAffected = result.affectedRows;

        res.status(200).json({ success: true, message: 'cours gratuissupprimée avec succès.', rowsAffected });
    } catch (error) {
        console.error('Error in deletecours:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const searchcourssByTitre = async (req, res) => {
    try {
        const { titre } = req.query;
        // Utilisez LIKE pour rechercher les correspondances partielles dans la base de données
        const results = await query('SELECT * FROM courgratuits WHERE titre LIKE ?', [`%${titre}%`]);

        // Convertissez les résultats en une structure de données simple
        const courss = results.map(result => ({ ...result }));

        res.status(200).json({ success: true, courss });
    } catch (error) {
        console.error('Error in searchcourssByTitre:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};



const getcoursById = async (req, res) => {
    try {
        const { id } = req.params;
        const id_cg=id;
        const CoursModel1 = await CoursModel.getcoursById(id_cg);
        if (CoursModel1) {
            res.status(200).json({ success: true, cours: CoursModel1 });
        } else {
            res.status(404).json({ success: false, message: 'Instructeur non trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du formation par ID:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération du formation.' });
    }
};


const getFreeCourseCount = async (req, res) => {
    try {
        const count = await CoursModel.countCours();
        res.json({ total: count });
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de cours gratuis :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const acceptCours = async (req, res) => {
    try {
        const { id_cg } = req.params;
        // Mettez à jour le statut de la formation avec l'ID donné pour le marquer comme accepté
        await CoursModel.updateCoursStatus(id_cg, 1); // 1 pour "accepté"
        res.status(200).json({ success: true, message: 'Formation acceptée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la formation :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const rejectCours = async (req, res) => {
    try {
        const { id_cg } = req.params;
        // Mettez à jour le statut de la formation avec l'ID donné pour le marquer comme refusé
        await CoursModel.updateCoursStatus(id_cg, 3); // 0 pour "refusé"
        res.status(200).json({ success: true, message: 'Cours refusée avec succès.' });
    } catch (error) {
        console.error('Erreur lors du refus de la cours :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};
const getNotificationLastCours = async (req, res) => {
    try {
        // Récupérer les détails du dernier cours ajouté
        const lastCours = await CoursModel.getLastAddedCours();

        if (lastCours) {
            // Récupérer les détails de l'instructeur associé au cours
            const instructeur = await CoursModel.getInstructeurById(lastCours.id_InsctructeurC);

            // Construire le message de notification
            const notificationMessage = `Nouveau cours ajouté par ${instructeur.prenom} ${instructeur.nom}: ${lastCours.titre}`;

            // Envoyer la notification
            // Vous pouvez envoyer la notification à un service de notification ou la renvoyer en tant que réponse HTTP
            res.status(200).json({ success: true, message: notificationMessage });
        } else {
            res.status(404).json({ success: false, message: 'Aucun cours trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la dernière cours ajoutée :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};
const getInstructeurById = async (instructeurId) => {
    try {
        // Exécutez la requête SQL pour récupérer les détails de l'instructeur par son ID
        const queryResult = await query(`
            SELECT *
            FROM instructeur
            WHERE id = ?
        `, [instructeurId]);

        // Renvoie les détails de l'instructeur ou null s'il n'existe pas
        return queryResult.length ? queryResult[0] : null;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'instructeur :', error);
        throw error;
    }
};
module.exports = {
    getFreeCourseCount,
    createcours,
    getAllcourss,
    updatecours,
    deletecours,
    searchcourssByTitre,
    getcoursById ,
    getcoursByInstructorId ,
    acceptCours ,
    rejectCours  , 
    getNotificationLastCours ,
    getInstructeurById
};
