const express = require('express');
const { handleInstall, callApi } = require('../controllers/authController');
const { installValidation } = require('../validate/authValidate');
const router = express.Router();

router.get('/install', installValidation, handleInstall);
router.post('/call-api', callApi);

module.exports = router;