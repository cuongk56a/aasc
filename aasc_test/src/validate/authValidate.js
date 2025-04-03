const joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const { response } = require("../utils/response");

const validation = joi.object({
  code: joi.string().required()
});

const installValidation = async (req, res, next) => {
  const data = {
    code: req.query.code,
  };
  const { error } = validation.validate(data);
  if (error) {
    let msg = `Error in Install App Data : ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
  } else {
    next();
  }
};
module.exports = { installValidation };