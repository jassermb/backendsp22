const express = require('express');
const router = express.Router();
const PaiementController = require('../controllers/paimentControleur');
const { authenticateToken, generateToken } = require("../middleware/authMiddleware");
router.post('/paiment', authenticateToken, PaiementController.Add);
router.post('/Verify/:id',PaiementController.verify );

module.exports = router;
 