const axios = require('axios');
const { appConfigs } = require('../config/config');
const fs = require('fs');
const { renewToken } = require('./authController');
const { response } = require('../utils/response');
const { StatusCodes } = require('http-status-codes');

const loadTokens = () => {
  if (fs.existsSync('src/storage/tokens.json')) {
    return JSON.parse(fs.readFileSync('src/storage/tokens.json'));
  }
  return {};
};

async function getRequisites(req, res){
  const { contactId } = req.params;
  const tokens = loadTokens();
  if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const results = await axios.post(
      `${appConfigs.BITRIX_DOMAIN}/rest/crm.requisite.bankdetail.list?auth=${tokens.access_token}`,
      {
        order: { "DATE_CREATE": "ASC" },
        filter: {"ENTITY_ID": contactId},
        select: ["*"],
      }
    );
    return response(res, StatusCodes.ACCEPTED, true, {...results.data}, null);
  } catch (error) {
    if (error.response?.data?.error === 'expired_token') {
        tokens.access_token = await renewToken(res, tokens.refresh_token);
        const retry = await axios.post(`${appConfigs.BITRIX_DOMAIN}/rest/crm.requisite.bankdetail.list?auth=${tokens.access_token}`,
          {
            order: { "DATE_CREATE": "ASC" },
            filter: {"ENTITY_ID": contactId},
            select: ["*"],
          }
        );
        return response(res, StatusCodes.ACCEPTED, true, {...retry.data}, null);
    } else {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        error.message
    );
    }
  }
};

async function createRequisite(req, res){
  const tokens = loadTokens();
  if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });
  const {CONTACT_ID, NAME_BANK, RQ_ACC_NUM, NAME} = req.body
  try {
    const result = await axios.post(
      `${appConfigs.BITRIX_DOMAIN}/rest/crm.requisite.bankdetail.add?auth=${tokens.access_token}`,
      {fields:{NAME: NAME,RQ_BANK_NAME: NAME, RQ_ACC_NUM, ENTITY_TYPE_ID: 3, PRESET_ID: 1, ENTITY_ID: CONTACT_ID}}
    );
    return response(res, StatusCodes.CREATED, true, {...result.data}, null);
  } catch (error) {
    if (error.response?.data?.error === 'expired_token') {
        tokens.access_token = await renewToken(res, tokens.refresh_token);
        const repty = await axios.post(
          `${appConfigs.BITRIX_DOMAIN}/rest/crm.requisite.bankdetail.add?auth=${tokens.access_token}`,
          {fields:{NAME: NAME, RQ_BANK_NAME: NAME, RQ_ACC_NUM, ENTITY_TYPE_ID: 3, PRESET_ID: 1, ENTITY_ID: CONTACT_ID}}
        );
        return response(res, StatusCodes.CREATED, true, {...repty.data}, null);
    } else {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        error.message
    );
    }
  }
};

async function detailsRequisite(req, res){
  const tokens = loadTokens();
  if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });
  const {requisiteId} = req.params;
  try {
    const result = await axios.post(`${appConfigs.BITRIX_DOMAIN}/rest/crm.requisite.bankdetail.get?auth=${tokens.access_token}`, {
      id: requisiteId,
    });
    return response(res, StatusCodes.ACCEPTED, true, {...result.data.result}, null);
  } catch (error) {
    if (error.response?.data?.error === 'expired_token') {
        tokens.access_token = await renewToken(res, tokens.refresh_token);
        const retry = await axios.post(
          `${appConfigs.BITRIX_DOMAIN}/rest/crm.requisite.bankdetail.get?auth=${tokens.access_token}`,{
            id: requisiteId,
          });
        return response(res, StatusCodes.ACCEPTED, true, {...retry.data.result}, null);
    } else {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        error.message
    );
    }
  }
};

async function updateRequisite(req, res){
  const tokens = loadTokens();
  if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });
  const {NAME, NAME_BANK, RQ_ACC_NUM} = req.body;
  const {requisiteId} = req.params;
  try {
    const result = await axios.post(
      `${appConfigs.BITRIX_DOMAIN}/rest/crm.requisite.bankdetail.update?auth=${tokens.access_token}`,
      {
        fields:{NAME:NAME_BANK, RQ_BANK_NAME: NAME_BANK, RQ_ACC_NUM},
        id: requisiteId
      }
    );
    return response(res, StatusCodes.ACCEPTED, true, {...result.data}, null);
  } catch (error) {
    if (error.response?.data?.error === 'expired_token') {
        tokens.access_token = await renewToken(res, tokens.refresh_token);
        const repty = await axios.post(
          `${appConfigs.BITRIX_DOMAIN}/rest/crm.requisite.bankdetail.update?auth=${tokens.access_token}`,
          {
            fields:{NAME: NAME_BANK, RQ_BANK_NAME: NAME_BANK, RQ_ACC_NUM},
            id: requisiteId
          }
        );
        return response(res, StatusCodes.ACCEPTED, true, {...repty.data}, null);
    } else {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        error.message
    );
    }
  }
};

async function deleteRequisite(req, res){
  const tokens = loadTokens();
  if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });
  const {requisiteId} = req.params;
  try {
    await axios.post(`${appConfigs.BITRIX_DOMAIN}/rest/crm.requisite.bankdetail.delete?auth=${tokens.access_token}`, {
      id: requisiteId,
    });
    return response(res, StatusCodes.ACCEPTED, true, {}, null);
  } catch (error) {
    if (error.response?.data?.error === 'expired_token') {
        tokens.access_token = await renewToken(res, tokens.refresh_token);
        await axios.post(
          `${appConfigs.BITRIX_DOMAIN}/rest/crm.requisite.bankdetail.delete?auth=${tokens.access_token}`,{
            id: requisiteId,
          });
        return response(res, StatusCodes.CREATED, true, {}, null);
    } else {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        error.message
    );
    }
  }
};

module.exports = { getRequisites, createRequisite, detailsRequisite, deleteRequisite, updateRequisite };