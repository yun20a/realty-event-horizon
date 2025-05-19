
const express = require('express');
const propertyController = require('../controllers/propertyController');

const router = express.Router();

// Property routes
router.get('/', propertyController.getAllProperties);

module.exports = router;
