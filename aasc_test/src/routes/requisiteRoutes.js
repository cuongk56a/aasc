const express = require('express');
const { getRequisites, createRequisite, detailsRequisite, deleteRequisite, updateRequisite } = require('../controllers/requisiteController');
const { getListValidation, createValidation, deleteValidation } = require('../validate/requisiteValidate');
const router = express.Router();

router.post('/list/:contactId', getListValidation, getRequisites);
router.post('/create',createValidation, createRequisite);

router.route('/:requisiteId')
      .patch(updateRequisite)
      .delete(deleteValidation, deleteRequisite);

module.exports = router;