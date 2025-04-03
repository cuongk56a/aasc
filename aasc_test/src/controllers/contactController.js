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

async function getContacts(req, res){
  const { filter, start } = req.body;
  const tokens = loadTokens();
  if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const results = await axios.post(
      `${appConfigs.BITRIX_DOMAIN}/rest/crm.contact.list?auth=${tokens.access_token}`,
      {
        order: { "DATE_CREATE": "ASC" },
        filter: filter || {},
        select: ["NAME", "ADDRESS", "PHONE", "EMAIL", "WEB"],
        start: start ||0
      }
    );
    return response(res, StatusCodes.ACCEPTED, true, {...results.data}, null);
  } catch (error) {
    if (error.response?.data?.error === 'expired_token') {
        tokens.access_token = await renewToken(res, tokens.refresh_token);
        const retry = await axios.post(`${appConfigs.BITRIX_DOMAIN}/rest/crm.contact.list?auth=${tokens.access_token}`,
          {
            order: { "DATE_CREATE": "ASC" },
            filter: filter || {},
            select: ["NAME", "ADDRESS", "PHONE", "EMAIL", "WEB"],
            start: start ||0
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

async function createContact(req, res){
  const tokens = loadTokens();
  if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });
  const {NAME, ADDRESS, PHONE, EMAIL, WEBSITE, NAME_BANK, RQ_ACC_NUM} = req.body
  try {
    const result = await axios.post(
      `${appConfigs.BITRIX_DOMAIN}/rest/crm.contact.add?auth=${tokens.access_token}`,
      {fields:{NAME, ADDRESS, PHONE, EMAIL, WEB: WEBSITE}}
    );
    return response(res, StatusCodes.CREATED, true, {...result.data}, null);
  } catch (error) {
    if (error.response?.data?.error === 'expired_token') {
        tokens.access_token = await renewToken(res, tokens.refresh_token);
        const result = await axios.post(
          `${appConfigs.BITRIX_DOMAIN}/rest/crm.contact.add?auth=${tokens.access_token}`,
          {fields:{NAME, ADDRESS, PHONE, EMAIL, WEB: WEBSITE}}
        );
        return response(res, StatusCodes.CREATED, true, {...result.data}, null);
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

async function detailsContact(req, res){
  const tokens = loadTokens();
  if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });
  const {contactId} = req.params;
  try {
    const result = await axios.post(`${appConfigs.BITRIX_DOMAIN}/rest/crm.contact.get?auth=${tokens.access_token}`, {
      id: contactId,
    });
    return response(res, StatusCodes.ACCEPTED, true, {...result.data.result}, null);
  } catch (error) {
    if (error.response?.data?.error === 'expired_token') {
        tokens.access_token = await renewToken(res, tokens.refresh_token);
        const retry = await axios.post(
          `${appConfigs.BITRIX_DOMAIN}/rest/crm.contact.get?auth=${tokens.access_token}`,{
            id: contactId,
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

async function updateContact(req, res){
  const tokens = loadTokens();
  if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });
  const {NAME, ADDRESS, PHONE, EMAIL, WEB} = req.body;
  const {contactId} = req.params;
  try {
    const result = await axios.post(
      `${appConfigs.BITRIX_DOMAIN}/rest/crm.contact.update?auth=${tokens.access_token}`,
      {
        fields:{NAME, ADDRESS, PHONE, EMAIL, WEB},
        id: contactId
      }
    );
    return response(res, StatusCodes.ACCEPTED, true, {...result.data}, null);
  } catch (error) {
    if (error.response?.data?.error === 'expired_token') {
        tokens.access_token = await renewToken(res, tokens.refresh_token);
        const repty = await axios.post(
          `${appConfigs.BITRIX_DOMAIN}/rest/crm.contact.update?auth=${tokens.access_token}`,
          {
            fields:{NAME, ADDRESS, PHONE, EMAIL, WEB},
            id: contactId
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

async function deleteContact(req, res){
  const tokens = loadTokens();
  if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });
  const {contactId} = req.params;
  try {
    await axios.post(`${appConfigs.BITRIX_DOMAIN}/rest/crm.contact.delete?auth=${tokens.access_token}`, {
      id: contactId,
    });
    return response(res, StatusCodes.ACCEPTED, true, {}, null);
  } catch (error) {
    if (error.response?.data?.error === 'expired_token') {
        tokens.access_token = await renewToken(res, tokens.refresh_token);
        await axios.post(
          `${appConfigs.BITRIX_DOMAIN}/rest/crm.contact.delete?auth=${tokens.access_token}`,{
            id: contactId,
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

module.exports = { getContacts, createContact, detailsContact, deleteContact, updateContact };