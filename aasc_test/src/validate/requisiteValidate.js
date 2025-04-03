const joi = require("joi");
const { response } = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const getListValidation = async (req, res, next) => {
  const data = {
    contactId: req.params.contactId,
  };
  const { error } = joi.object({
    contactId: joi.string().required()
    }).validate(data);

  if (error) {
    let msg = `Error in List Requisite Data : ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
  } else {
    next();
  }
};

const createValidation = async (req, res, next) => {
  const data = {
    CONTACT_ID: req.body.CONTACT_ID,
    NAME: req.body.NAME,
    RQ_ACC_NUM: req.body.RQ_ACC_NUM
  };
  const { error } = joi.object({
      CONTACT_ID: joi.number().required(),
      NAME: joi.string().required(),
      RQ_ACC_NUM: joi.string().required(),
    }).validate(data);

  if (error) {
    let msg = `Error in Create Requisite Data : ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
  } else {
    next();
  }
};

const updateValidation = async (req, res, next) => {
  const data = {
    NAME_BANK: req.body.NAME_BANK,
    RQ_ACC_NUM: req.body.RQ_ACC_NUM,
    requisiteId: req.params.requisiteId
  };
  const { error } = joi.object({
      NAME_BANK: joi.string().required(),
      RQ_ACC_NUM: joi.string().required(),
      requisiteId: joi.string().required()
    }).validate(data);

  if (error) {
    let msg = `Error in Update Contact Data : ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
  } else {
    next();
  }
};

const detailsValidation = async (req, res, next) => {
  const data = {
    requisiteId: req.params.requisiteId
  };
  const { error } = joi.object({
      requisiteId: joi.string().required()
    }).validate(data);

  if (error) {
    let msg = `Error in Get Contact Data : ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
  } else {
    next();
  }
};

const deleteValidation = async (req, res, next) => {
  const data = {
    requisiteId: req.params.requisiteId
  };
  const { error } = joi.object({
      requisiteId: joi.string().required()
    }).validate(data);

  if (error) {
    let msg = `Error in Delete Contact Data : ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
  } else {
    next();
  }
};

module.exports = { getListValidation, createValidation, detailsValidation, updateValidation, deleteValidation };