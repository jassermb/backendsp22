// coursPModel.js
const db = require('../config/db');
const express = require('express');

const app = express();
const util = require('util');

const query = util.promisify(db.query).bind(db);

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const updatecours = (id_cg, titre, description, contenu) => {
    const query = 'UPDATE courgratuits SET titre = ?, description = ?, contenu = ? WHERE id_cg = ?';
    return db.query(query, [titre, description, contenu, id_cg]);
};

const createcours = async (CoursData, id_InsctructeurC) => { 
    try {
        const { titre, description, contenu,  } = CoursData;
        
        // Insérez la formation dans la base de données avec l'ID de l'instructeur
        const insertQuery = `
            INSERT INTO courgratuits (titre, description ,contenu, id_InsctructeurC)
            VALUES (?, ?, ?, ?)
        `;
        const result = await db.query(insertQuery, [titre, description, contenu, id_InsctructeurC]);
     
        
        return result;  
    } catch (error) {
        throw error;
    }
};

const getcoursByInstructorId = async (instructorId) => {
    try {
        const queryString = `
            SELECT *
            FROM courgratuits
            WHERE id_InsctructeurC = ?
        `;
        const results = await query(queryString, [instructorId]);
        return results;
    } catch (error) {
        throw error;
    }
};

const getcoursById = async (id_cg) => {
    try {
        const results = await query('SELECT * FROM courgratuits WHERE id_cg = ?', [id_cg]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};




const getAllcourss = () => {
    const query = 'SELECT * FROM courgratuits';
    return db.query(query);
};




const deletecours = (id_cg) => {
    const query = 'DELETE FROM courgratuits WHERE id_cg= ?';
    return db.query(query, [id_cg]);
};

const searchcourssByTitre = (titre) => {
    const query = 'SELECT * FROM courgratuits WHERE titre LIKE ?';
    const searchPattern = `%${titre}%`;
    return db.query(query, [searchPattern]);
};

const countCours = async () => {
    try {
        const results = await query('SELECT COUNT(*) AS total FROM courgratuits');
        return results[0].total;
    } catch (error) {
        throw error;
    }
};
const updateCoursStatus = async (id_cg, status) => {
    try {
        const updateQuery = 'UPDATE courgratuits SET status = ? WHERE id_cg = ?';
        await db.query(updateQuery, [status, id_cg]);
    } catch (error) {
        throw error;
    }
};
const getLastAddedCours = async () => {
    try {
        // Exécutez la requête SQL pour récupérer les détails du dernier cours ajouté
        const queryResult = await query(`
            SELECT *
            FROM courgratuits
            ORDER BY id_cg DESC
            LIMIT 1
        `);

        // Renvoie le premier résultat (le dernier cours ajouté) ou null s'il n'y a aucun cours
        return queryResult.length ? queryResult[0] : null;
    } catch (error) {
        console.error('Erreur lors de la récupération du dernier cours ajouté :', error);
        throw error;
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
    updateCoursStatus,
    createcours,
    getAllcourss,
    updatecours,
    deletecours,
    searchcourssByTitre,
    getcoursById , 
    countCours ,
    getcoursByInstructorId ,
    getLastAddedCours, 
    getInstructeurById
};
