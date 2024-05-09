// FormationPModel.js
const db = require('../config/db');
const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const util = require('util');

const query = util.promisify(db.query).bind(db);

// const createFormation = async (formationData) => {
//     try {
//         const { titre, description, domaine, plant, prix, certeficat, niveaux } = formationData;
//         const insertQuery = `
//             INSERT INTO formation_p (titre, description, domaine, plant, prix, certeficat, niveaux)
//             VALUES (?, ?, ?, ?, ?, ?,?)
//         `;
//         const result = await db.query(insertQuery, [titre, description, domaine, plant, prix, certeficat, niveaux]);
//         return result;
//     } catch (error) {
//         throw error;
//     }
// };
// const createFormation = async (req, res) => {
//     try {
//         const { titre, description, domaine, niveaux, prix, certeficat } = req.body;
//         const { coursIds } = req.body; // Tableau d'identifiants de cours
        
//         // Vérifiez si tous les champs requis sont présents
//         if (!titre || !description || !domaine || !niveaux || !prix || !certeficat) {
//             return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les données requises.' });
//         }

//         // Créez la formation dans la base de données
//         const plant = req.Fnameup;
//         const formationData = { titre, description, domaine, plant, niveaux, prix, certeficat };
//         const result = await FormationModel.createFormation(formationData, coursIds); // Passez les identifiants de cours
        
//         const formationId = result.insertId;
//         req.Fnameup = undefined;
        
//         res.status(201).json({ 
//             success: true,
//             message: 'Formation créée avec succès.',
//             formationId: formationId
//         });
//     } catch (error) {
//         console.error('Erreur lors de la création de la formation :', error);
//         res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
//     }
// };
const createFormation = async (formationData, coursIds, instructeurfp_id) => {
    try {
        const { titre, description, domaine, plant, prix, certeficat, niveaux } = formationData;
        
        // Insérez la formation dans la base de données avec l'ID de l'instructeur
        const insertQuery = `
            INSERT INTO formation_p (titre, description, domaine, plant, prix, certeficat, niveaux, instructeurfp_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.query(insertQuery, [titre, description, domaine, plant, prix, certeficat, niveaux, instructeurfp_id]);
        
        // Récupérer l'ID de l'insertion directement depuis la réponse de la base de données
        const insertedId = result.insertId;

        return insertedId;  
    } catch (error) {
        throw error;
    }
};


 


const updateFormationStatus = async (id_fp, status) => {
    try {
        const updateQuery = 'UPDATE formation_p SET status = ? WHERE id_fp = ?';
        await db.query(updateQuery, [status, id_fp]);
    } catch (error) {
        throw error;
    }
};
const getFormationById = async (id_fp) => {
    try {
        const results = await query('SELECT * FROM formation_p WHERE id_fp = ?', [id_fp]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};



const getAllFormations = () => {
    const query = 'SELECT * FROM formation_p';
    return db.query(query);
};
const modifierFormation = (id_fp, titre, description, plant,domaine, prix, certeficat, niveaux) => {
    const query = '  UPDATE formation_p SET titre = ?, description = ?,plant = ? , domaine = ? , prix = ?, certeficat = ?, niveaux = ?  WHERE id_fp = ? ';
    return db.query(query, [titre, description, plant,domaine, prix, certeficat, niveaux, id_fp]);
};


const deleteFormation = (id) => {
    const query = 'DELETE FROM formation_p WHERE id_fp = ?';
    return db.query(query, [id]);
};
const deleteFormationById = (id) => {
    const query = 'DELETE FROM formation_p WHERE id_fp = ?';
    return db.query(query, [id]);
}; 

const searchFormationsByTitre = (titre) => {
    const query = 'SELECT * FROM formation_p WHERE titre LIKE ?';
    const searchPattern = `%${titre}%`;
    return db.query(query, [searchPattern]);
};
const searchFormationsByDomaine = async (domaine) => {
    try {
        const results = await query('SELECT * FROM formation_p WHERE domaine = ?', [domaine]);
        return results;
    } catch (error) {
        throw error;
    }
};
const countFormations = async () => {
    try {
        const results = await query('SELECT COUNT(*) AS total FROM formation_p');
        return results[0].total;
    } catch (error) {
        throw error;
    }
};
const countDistinctDomains = async () => {
    try {
        const query = util.promisify(db.query).bind(db); // Utilisez util.promisify pour rendre db.query asynchrone
        const queryString = 'SELECT COUNT(DISTINCT domaine) AS totalDomains FROM formation_p';
        const results = await query(queryString);
        return results[0].totalDomains;
    } catch (error) {
        throw error;
    }
};

const countFormationsByDomain = async () => {
    try {
        const query = util.promisify(db.query).bind(db); // Utilisez util.promisify pour rendre db.query asynchrone
        const queryString = 'SELECT domaine, COUNT(*) AS totalFormations FROM formation_p GROUP BY domaine';
        const results = await query(queryString);
        return results;
    } catch (error) {
        throw error;
    }
};
const countCertificats = async () => {
    try {
        const results = await query('SELECT SUM(certeficat) AS totalCertificats FROM formation_p');
        return results[0].totalCertificats;
    } catch (error) {
        throw error;
    }
};
const getFormationsByInstructorId = async (instructorId) => {
    try {
        const queryString = `
            SELECT *
            FROM formation_p
            WHERE instructeurfp_id = ?
        `;
        const results = await query(queryString, [instructorId]);
        return results;
    } catch (error) {
        throw error;
    }
};




module.exports = {
    createFormation,
    getAllFormations,
    modifierFormation,
    deleteFormation,
    searchFormationsByTitre,
    getFormationById ,
    searchFormationsByDomaine ,
    countFormations , 
    countFormationsByDomain , 
    countDistinctDomains ,
    countCertificats ,
    updateFormationStatus ,
    getFormationsByInstructorId ,
    deleteFormationById
};
