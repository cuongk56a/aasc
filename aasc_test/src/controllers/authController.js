const axios = require('axios');
const { appConfigs } = require('../config/config');
const fs = require('fs');
const { response } = require('../utils/response');
const { StatusCodes } = require('http-status-codes');

const loadTokens = () => {
    if (fs.existsSync('src/storage/tokens.json')) {
      return JSON.parse(fs.readFileSync('src/storage/tokens.json'));
    }
    return {};
};

async function handleInstall(req, res) {
    const { code } = req.query;
    try {
        const result = await axios.post(`https://oauth.bitrix.info/oauth/token?grant_type=authorization_code&client_id=${appConfigs.CLIENT_ID}&client_secret=${appConfigs.CLIENT_SECRET}&code=${code}`);
        const { access_token, refresh_token } = result.data;
        await fs.promises.writeFile('src/storage/tokens.json', JSON.stringify({ access_token, refresh_token }));
        return response(res, StatusCodes.ACCEPTED, true, {}, "App installed successfully");
    } catch (error) {
        return response(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            {},
            error.message
        );
    }
}

async function renewToken(res, old_refresh_token) {
    try {
        const result = await axios.post(`https://oauth.bitrix.info/oauth/token?grant_type=refresh_token&client_id=${appConfigs.CLIENT_ID}&client_secret=${appConfigs.CLIENT_SECRET}&refresh_token=${old_refresh_token}`);
        const { access_token, refresh_token } = result.data;
        await fs.promises.writeFile('src/storage/tokens.json', JSON.stringify({ access_token, refresh_token }));
        return access_token;
    } catch (error) {
        return response(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            {},
            error.message
        );
    }
    
}

async function callApi(req, res) {
    const { action, payload } = req.body;
    const tokens = loadTokens();
    if (!tokens.access_token) return res.status(401).json({ error: "Unauthorized" });
    try {
        const results = await axios.get(`${appConfigs.BITRIX_DOMAIN}/rest/${action}?auth=${tokens.access_token}`, payload);
        return response(res, StatusCodes.ACCEPTED, true, {...results.data}, null);
    } catch (error) {
        if (error.response?.data?.error === 'expired_token') {
            tokens.access_token = await renewToken(res,tokens.refresh_token);
            const retry = await axios.get(`${appConfigs.BITRIX_DOMAIN}/rest/${action}?auth=${tokens.access_token}`, payload);
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
}

module.exports = { handleInstall, callApi, renewToken };