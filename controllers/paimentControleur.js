const db = require('../config/db');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const axios = require("axios")
const jwt = require('jsonwebtoken');
const secretKey = 'votre_clé_secrète'; // Assurez-vous de remplacer ceci par votre propre clé secrète

// Fonction pour extraire l'ID du participant à partir du token
const extractUserIdFromToken = (token) => {
    try {
        // Extraire l'ID du participant du token JWT
        const decodedToken = jwt.verify(token, secretKey);
        return decodedToken.id
        console.log(decodedToken.id);
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error);
        return null;
    }
};


const Add = async (req, res) => {

    const participantId = req.body.participantId;
    const formation_id = req.body.formation_id;

    
    const url = "https://developers.flouci.com/api/generate_payment";
    const payload = {
        "app_token": "adf58929-ac14-4b7c-8176-32c3908f8dd7",
        "app_secret": "532300ef-5077-457c-a2a4-23f33a0622d8",
        "amount": req.body.amount,
        "accept_card": "true",
        "session_timeout_secs": 3000,
        "success_link": `http://localhost:3001/Formation/getformationById/${formation_id}`,
        "fail_link": "http://localhost:3000/fail",
        "developer_tracking_id": "0b5cc9de-5280-4975-ba4e-ad0d3a8e419b"
    };

    try {
        const result = await axios.post(url, payload);
        const paymentId = result.data.payment_id;
        const formation_id = req.body.formation_id;

        const updateQuery = `UPDATE formation_p SET participantfp_id = ? WHERE id_fp = ?`;
        await query(updateQuery, [participantId, formation_id]);

        res.send(result.data);

    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur s'est produite lors du traitement du paiement.");
    }
};

const verify = async (req, res) => {
    const id_payment = req.params.id
    const url = `https://developers.flouci.com/api/verify_payment/${id_payment}`
    await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
            'apppublic': 'adf58929-ac14-4b7c-8176-32c3908f8dd7',
            "appsecret": "532300ef-5077-457c-a2a4-23f33a0622d8",
        }
    })
        .then(result => {
            res.send(result.data)
        })
        .catch(err => {
            console.log(err.message)

        }
        )

};
module.exports = {
    Add,
    verify,
};