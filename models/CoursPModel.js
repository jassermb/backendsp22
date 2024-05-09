// coursPModel.js
const db = require('../config/db');
const express = require('express');

const app = express();
const util = require('util');

const query = util.promisify(db.query).bind(db);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const createcoursP = async (CoursPData, id_InsctructeurCP,formationId) => {
    try {
        const { titre, description, contenu,  } = CoursPData;
        
        // Insérez la formation dans la base de données avec l'ID de l'instructeur
        const insertQuery = `
            INSERT INTO courpayant (titre, description ,contenu,formation_id,id_InsctructeurCP)
            VALUES (?, ?, ?,?, ?)
        `;
        const result = await db.query(insertQuery, [titre, description, contenu,formationId,id_InsctructeurCP]);
     
        
        return result;  
    } catch (error) {
        throw error;
    }
};
const getcoursById = async (id_cp) => {
    try {
        const results = await query('SELECT * FROM courpayant WHERE id_cp = ?', [id_cp]);
        return results;
    } catch (error) {
        throw error;
    }
};


const getAllcourss = () => {
    const query = 'SELECT * FROM courpayant';
    return db.query(query);
};

const updatecours = async (id_cp, titre, description, contenu) => {
    try {
        // Vérifiez si le contenu est fourni, s'il est fourni, mettez à jour le contenu aussi
        let query = '';
        let queryParams = [];
        if (contenu) {
            query = 'UPDATE courpayant SET titre = ?, description = ?, contenu = ? WHERE id_cp = ?';
            queryParams = [titre, description, contenu, id_cp];
        } else {
            query = 'UPDATE courpayant SET titre = ?, description = ? WHERE id_cp = ?';
            queryParams = [titre, description, id_cp];
        }
        const result = await db.query(query, queryParams);
        return result;
    } catch (error) {
        throw error;
    }
};



const deletecours = (id_cp) => {
    const query = 'DELETE FROM courpayant WHERE id_cp = ?';
    return db.query(query, [id_cp]);
};

const searchcourssByTitre = (titre) => {
    const query = 'SELECT * FROM courpayant WHERE titre LIKE ?';
    const searchPattern = `%${titre}%`;
    return db.query(query, [searchPattern]);
};
const getCoursByFormationId = async (formationId) => {
    try {
        const results = await query('SELECT * FROM courpayant WHERE formation_id = ?', [formationId]);
        return results;
    } catch (error) {
        console.error('Error in getCoursByFormationId:', error);
        throw error;
    }
};

module.exports = {
    getCoursByFormationId,
    createcoursP,
    getAllcourss,
    updatecours,
    deletecours,
    searchcourssByTitre,
    getcoursById
};
