const joi = require("joi");
const { response } = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const getListValidation = async (req, res, next) => {
  const data = {
    start: req.body.start,
    filter: req.body.filter,
  };
  const { error } = joi.object({
      start: joi.number().default(0),
      filter: joi.object({
        ID: joi.string(),
        NAME: joi.string(),
        TYPE_ID: joi.string(),
        SOURCE_ID: joi.string(),
      })
    }).validate(data);

  if (error) {
    let msg = `Error in List Contact Data : ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
  } else {
    next();
  }
};

const createValidation = async (req, res, next) => {
  const data = {
    NAME: req.body.NAME,
    ADDRESS: req.body.ADDRESS,
    PHONE: req.body.PHONE,
    EMAIL: req.body.EMAIL,
    WEBSITE: req.body.WEBSITE
  };
  const { error } = joi.object({
      NAME: joi.string().required(),
      ADDRESS: joi.string().required(),
      PHONE: joi.array().items(
        joi.object({
          VALUE: joi.string().required(),
          VALUE_TYPE: joi.string().required()
        })
      ),
      EMAIL: joi.array().items(
        joi.object({
          VALUE: joi.string().email().required(),
          VALUE_TYPE: joi.string().required()
        })
      ),
      WEBSITE: joi.array().items(
        joi.object({
          VALUE: joi.string().required(),
          VALUE_TYPE: joi.string().required()
        })
      ),
    }).validate(data);

  if (error) {
    let msg = `Error in Create Contact Data : ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
  } else {
    next();
  }
};

const updateValidation = async (req, res, next) => {
  const data = {
    NAME: req.body.NAME,
    ADDRESS: req.body.ADDRESS,
    PHONE: req.body.PHONE,
    EMAIL: req.body.EMAIL,
    WEBSITE: req.body.WEBSITE,
    contactId: req.params.contactId
  };
  const { error } = joi.object({
      NAME: joi.string().required(),
      ADDRESS: joi.string().required(),
      PHONE: joi.array().items(
        joi.object({
          VALUE: joi.string().required(),
          VALUE_TYPE: joi.string().required()
        })
      ),
      EMAIL: joi.array().items(
        joi.object({
          VALUE: joi.string().required(),
          VALUE_TYPE: joi.string().required()
        })
      ),
      WEBSITE: joi.array().items(
        joi.object({
          VALUE: joi.string().required(),
          VALUE_TYPE: joi.string().required()
        })
      ),
      contactId: joi.string().required()
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
    contactId: req.params.contactId
  };
  const { error } = joi.object({
      contactId: joi.string().required()
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
    contactId: req.params.contactId
  };
  const { error } = joi.object({
      contactId: joi.string().required()
    }).validate(data);

  if (error) {
    let msg = `Error in Delete Contact Data : ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
  } else {
    next();
  }
};

module.exports = { getListValidation, createValidation, detailsValidation, updateValidation, deleteValidation };