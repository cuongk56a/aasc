const express = require('express');
const { getContacts, createContact, detailsContact, deleteContact, updateContact } = require('../controllers/contactController');
const { getListValidation, createValidation, detailsValidation, updateValidation } = require('../validate/contactValidate');
const { deleteValidation } = require('../validate/requisiteValidate');
const router = express.Router();

router.post('/list', getListValidation, getContacts);
router.post('/create', createValidation, createContact);

router.route('/:contactId')
      .get(detailsValidation, detailsContact)
      .patch(updateValidation ,updateContact)
      .delete(deleteValidation, deleteContact);

module.exports = router;